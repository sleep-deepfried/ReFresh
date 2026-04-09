import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

export interface ScannedItem {
  name: string;
  quantity: number;
  confidence: number;
  food_type?: string;
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
      model: process.env.GEMINI_VISION_MODEL || "gemini-3-flash-preview",
    });

    const prompt = `You are a kitchen inventory assistant. Look at this photo of food (fridge, pantry, counter, or grocery items).

Identify DISTINCT food items you can clearly see. For each item:
- "name": short English label (e.g. "Eggs", "Tomatoes")
- "quantity": integer count of separate units visible (e.g. 6 eggs; if unclear minimum 1)
- "confidence": number from 0 to 1 for how sure you are
- "food_type": one of: Produce, Dairy, Meat, Seafood, Pantry, Snack, Beverage, Frozen, Other

Rules:
- Merge duplicates of the same item into one row with total quantity.
- If nothing food-related is visible, return an empty items array.
- Do NOT include non-food objects.

Respond with ONLY valid JSON (no markdown, no code fences), exactly:
{"items":[{"name":"string","quantity":1,"confidence":0.9,"food_type":"Other"}]}`;

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType, data: base64 } },
    ]);

    const raw = stripJsonFence(result.response.text());
    let parsed: { items: ScannedItem[] };
    try {
      parsed = JSON.parse(raw) as { items: ScannedItem[] };
    } catch {
      console.error("Gemini scan parse failed, raw:", raw.slice(0, 500));
      return jsonError(502, "model_parse", "Could not parse model response");
    }

    if (!parsed.items || !Array.isArray(parsed.items)) {
      return jsonError(502, "model_parse", "Invalid items array from model");
    }

    const items: ScannedItem[] = parsed.items
      .filter((i) => i && typeof i.name === "string" && i.name.trim().length > 0)
      .map((i) => ({
        name: i.name.trim(),
        quantity: Math.max(1, Math.min(9999, Math.round(Number(i.quantity)) || 1)),
        confidence: Math.min(1, Math.max(0, Number(i.confidence) || 0)),
        food_type: typeof i.food_type === "string" ? i.food_type : "Other",
      }));

    return jsonSuccess({ items }, 200);
  } catch (e) {
    console.error("inventory scan error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return jsonError(500, "internal", msg);
  }
}
