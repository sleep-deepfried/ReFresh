import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { resolveServerGeminiModelId } from "@/lib/gemini-model";

export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export type FreshnessStatus = "fresh" | "stale" | "spoiled";

export interface ScannedItem {
  name: string;
  quantity: number;
  confidence: number;
  food_type?: string;
  freshness_status: FreshnessStatus;
  days_until_best: number;
}

const FRESHNESS_SET = new Set<string>(["fresh", "stale", "spoiled"]);

function normalizeFreshnessStatus(value: unknown): FreshnessStatus {
  const s = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (FRESHNESS_SET.has(s)) return s as FreshnessStatus;
  return "fresh";
}

function normalizeDaysUntilBest(value: unknown): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n) || n < 0) return 7;
  return Math.min(365, n);
}

function stripJsonFence(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  }
  return t.trim();
}

export async function POST(req: NextRequest) {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return jsonError(503, "config", "GEMINI_API_KEY is not configured");
    }

    const form = await req.formData();
    const image = form.get("image");
    if (!(image instanceof Blob)) {
      return jsonError(400, "validation", "Missing multipart field 'image'");
    }

    if (image.size > MAX_BYTES) {
      return jsonError(400, "validation", "Image exceeds maximum size (10 MB)");
    }

    const mimeType = image.type || "image/jpeg";
    if (!ALLOWED.has(mimeType.toLowerCase())) {
      return jsonError(
        400,
        "validation",
        `Unsupported image type: ${mimeType}. Use JPEG, PNG, WebP, or HEIC.`
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = buffer.toString("base64");

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: resolveServerGeminiModelId(),
    });

    const prompt = `You are a kitchen inventory assistant. Look at this photo of food (fridge, pantry, counter, or grocery items).

Identify DISTINCT food items you can clearly see. For each item:
- "name": short English label (e.g. "Eggs", "Tomatoes")
- "quantity": integer count of separate units visible (e.g. 6 eggs; if unclear minimum 1)
- "confidence": number from 0 to 1 for how sure you are
- "food_type": one of: Produce, Dairy, Meat, Seafood, Pantry, Snack, Beverage, Frozen, Other
- "freshness_status": visual estimate only — one of: fresh, stale, spoiled (lowercase)
- "days_until_best": integer 0–365, estimated days until peak eating quality / best-by window from visible cues (not food safety); use judgment per item

Rules:
- Merge duplicates of the same item into one row with total quantity.
- If nothing food-related is visible, return an empty items array.
- Do NOT include non-food objects.
- freshness_status and days_until_best are estimates from the photo only, not medical advice.

Respond with ONLY valid JSON (no markdown, no code fences), exactly:
{"items":[{"name":"string","quantity":1,"confidence":0.9,"food_type":"Other","freshness_status":"fresh","days_until_best":7}]}`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType, data: base64 } },
    ]);

    const raw = stripJsonFence(result.response.text());
    let parsed: { items: unknown[] };
    try {
      parsed = JSON.parse(raw) as { items: unknown[] };
    } catch {
      console.error("Gemini scan parse failed, raw:", raw.slice(0, 500));
      return jsonError(502, "model_parse", "Could not parse model response");
    }

    if (!parsed.items || !Array.isArray(parsed.items)) {
      return jsonError(502, "model_parse", "Invalid items array from model");
    }

    const items: ScannedItem[] = parsed.items
      .filter((raw): raw is Record<string, unknown> => raw != null && typeof raw === "object")
      .filter((i) => typeof i.name === "string" && i.name.trim().length > 0)
      .map((i) => ({
        name: (i.name as string).trim(),
        quantity: Math.max(1, Math.min(9999, Math.round(Number(i.quantity)) || 1)),
        confidence: Math.min(1, Math.max(0, Number(i.confidence) || 0)),
        food_type: typeof i.food_type === "string" ? i.food_type : "Other",
        freshness_status: normalizeFreshnessStatus(i.freshness_status),
        days_until_best: normalizeDaysUntilBest(i.days_until_best),
      }));

    return jsonSuccess({ items }, 200);
  } catch (e) {
    console.error("inventory scan error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return jsonError(500, "internal", msg);
  }
}
