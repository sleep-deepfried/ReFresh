import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { resolveServerGeminiModelId } from "@/lib/gemini-model";

export const maxDuration = 60;

const MEALS = new Set(["breakfast", "lunch", "snack", "dinner"]);
const MAX_ITEMS = 80;
const MAX_SUGGESTIONS = 8;

interface CookItemIn {
  food_name: string;
  food_type: string;
  quantity: number;
  best_before?: string | null;
}

interface CookSuggestionRaw {
  title: string;
  subtitle: string;
  from_your_fridge: string[];
  symbol_name?: string;
}

function stripJsonFence(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  }
  return t.trim();
}

/** Map matched fridge label to canonical name from inventory */
function normalizeFridgeNames(
  labels: unknown[],
  nameSet: Map<string, string>
): string[] {
  if (!Array.isArray(labels)) return [];
  const out: string[] = [];
  for (const raw of labels) {
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    const canonical = nameSet.get(key);
    if (canonical && !out.includes(canonical)) out.push(canonical);
  }
  return out.slice(0, 8);
}

export async function POST(req: NextRequest) {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return jsonError(503, "config", "GEMINI_API_KEY is not configured");
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return jsonError(400, "validation", "Invalid JSON body");
    }

    const meal = String((body as { meal?: unknown }).meal ?? "")
      .trim()
      .toLowerCase();
    if (!MEALS.has(meal)) {
      return jsonError(
        400,
        "validation",
        "meal must be one of: breakfast, lunch, snack, dinner"
      );
    }

    const rawItems = (body as { items?: unknown }).items;
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return jsonError(400, "validation", "Expected non-empty items: [{ food_name, food_type, quantity, best_before? }, ...]");
    }

    const items: CookItemIn[] = [];
    const nameSet = new Map<string, string>();

    for (const r of rawItems.slice(0, MAX_ITEMS)) {
      if (!r || typeof r !== "object") continue;
      const o = r as Record<string, unknown>;
      const foodName = typeof o.food_name === "string" ? o.food_name.trim() : "";
      if (!foodName) continue;
      const foodType =
        typeof o.food_type === "string" && o.food_type.trim()
          ? o.food_type.trim().slice(0, 80)
          : "General";
      const q = Math.round(Number(o.quantity));
      const quantity = Number.isFinite(q) && q > 0 ? Math.min(9999, q) : 1;
      const bestBefore =
        typeof o.best_before === "string" && o.best_before.trim()
          ? o.best_before.trim().slice(0, 32)
          : null;

      nameSet.set(foodName.toLowerCase(), foodName);
      items.push({
        food_name: foodName.slice(0, 200),
        food_type: foodType,
        quantity,
        best_before: bestBefore,
      });
    }

    if (items.length === 0) {
      return jsonError(400, "validation", "No valid inventory items after normalization");
    }

    const inventoryJson = JSON.stringify(items);

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: resolveServerGeminiModelId(),
    });

    const prompt = `You are a practical home-cook assistant. The user has ONLY the ingredients in this JSON array (their real fridge inventory). Meal period: "${meal}".

Inventory (use only these; do not invent items):
${inventoryJson}

Task: Suggest ${Math.min(6, MAX_SUGGESTIONS)} distinct, realistic ideas for ${meal}. Each idea must:
- Use only ingredients that appear exactly as "food_name" in the inventory (or clearly derive from them, e.g. "Cherry Tomatoes" not "tomatoes" if only cherry tomatoes exist—prefer exact name matches).
- Prefer items with sooner best_before if dates suggest urgency (optional judgment).
- Be concise and actionable for a home cook.

Respond with ONLY valid JSON (no markdown fences), shape:
{"suggestions":[{"title":"string","subtitle":"string","from_your_fridge":["exact food_name from inventory"],"symbol_name":"fork.knife"}]}

Rules for symbol_name: use a short SF Symbol name suitable for SwiftUI Image(systemName:), e.g. cup.and.saucer.fill, fish.fill, flame.fill, leaf.fill, frying.pan.fill, basket.fill. If unsure use "fork.knife".

from_your_fridge must list 1–4 exact food_name strings copied from the inventory JSON.`;

    const result = await model.generateContent(prompt);
    const rawText = stripJsonFence(result.response.text());

    let parsed: { suggestions: CookSuggestionRaw[] };
    try {
      parsed = JSON.parse(rawText) as { suggestions: CookSuggestionRaw[] };
    } catch {
      console.error("cook suggestions parse failed, raw:", rawText.slice(0, 500));
      return jsonError(502, "model_parse", "Could not parse model response");
    }

    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      return jsonError(502, "model_parse", "Invalid suggestions array from model");
    }

    const suggestions = parsed.suggestions
      .filter((s) => s && typeof s.title === "string" && s.title.trim())
      .slice(0, MAX_SUGGESTIONS)
      .map((s) => {
        const title = s.title.trim().slice(0, 120);
        const subtitle =
          typeof s.subtitle === "string"
            ? s.subtitle.trim().slice(0, 280)
            : "Quick idea using what you have.";
        const fromYourFridge = normalizeFridgeNames(
          Array.isArray(s.from_your_fridge) ? s.from_your_fridge : [],
          nameSet
        );
        const symbolName =
          typeof s.symbol_name === "string" && /^[a-z0-9.]+$/i.test(s.symbol_name.trim())
            ? s.symbol_name.trim().slice(0, 80)
            : "fork.knife";

        return {
          title,
          subtitle,
          from_your_fridge: fromYourFridge,
          symbol_name: symbolName,
        };
      })
      .filter((s) => s.from_your_fridge.length > 0);

    if (suggestions.length === 0) {
      return jsonError(502, "model_parse", "Model returned no usable suggestions tied to inventory");
    }

    return jsonSuccess({ suggestions }, 200);
  } catch (e) {
    console.error("cook suggestions error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return jsonError(500, "internal", msg);
  }
}
