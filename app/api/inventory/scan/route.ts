import { NextRequest, NextResponse } from "next/server";
import { geminiGenerateContent } from "@/lib/gemini";

const SCAN_SYSTEM = `You are a pantry vision assistant. Identify distinct food items visible in this refrigerator or pantry photo.
Output JSON only with this exact shape:
{"items":[{"name":"","quantity":1,"confidence":0.85,"food_type":"Other","freshness_status":"fresh","days_until_best":7}]}

Rules:
- name: short human-readable label (English).
- quantity: positive integer; use 1 for uncountable bulk.
- confidence: number from 0 to 1.
- food_type: one of Produce, Dairy, Meat, Poultry, Seafood, Pantry, Frozen, Beverage, Other (or close variants).
- freshness_status: exactly one of fresh, stale, spoiled (lowercase).
- days_until_best: integer 0-365; estimate from visual cues, use 7 if unsure.
If no food is clearly visible, return {"items":[]}.`;

const FRESHNESS = new Set(["fresh", "stale", "spoiled"]);

function normalizeItem(raw: Record<string, unknown>): {
  name: string;
  quantity: number;
  confidence: number;
  food_type: string;
  freshness_status: string;
  days_until_best: number;
} | null {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (!name) return null;

  let quantity = 1;
  if (typeof raw.quantity === "number" && Number.isFinite(raw.quantity)) {
    quantity = Math.max(1, Math.min(99, Math.floor(raw.quantity)));
  }

  let confidence = 0.8;
  if (typeof raw.confidence === "number" && Number.isFinite(raw.confidence)) {
    confidence = Math.min(1, Math.max(0, raw.confidence));
  }

  const food_type =
    typeof raw.food_type === "string" && raw.food_type.trim()
      ? raw.food_type.trim().slice(0, 64)
      : "Other";

  let freshness_status = "fresh";
  if (typeof raw.freshness_status === "string") {
    const f = raw.freshness_status.trim().toLowerCase();
    if (FRESHNESS.has(f)) freshness_status = f;
  }

  let days_until_best = 7;
  if (typeof raw.days_until_best === "number" && Number.isFinite(raw.days_until_best)) {
    days_until_best = Math.min(365, Math.max(0, Math.floor(raw.days_until_best)));
  }

  return {
    name: name.slice(0, 120),
    quantity,
    confidence,
    food_type,
    freshness_status,
    days_until_best,
  };
}

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "config",
          message: "Inventory scan is not configured on the server.",
        },
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "Expected multipart form data" },
      },
      { status: 400 }
    );
  }

  const file = formData.get("image");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "Missing image field" },
      },
      { status: 400 }
    );
  }

  const mimeType = file.type?.trim() || "image/jpeg";
  if (!mimeType.startsWith("image/")) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "File must be an image" },
      },
      { status: 400 }
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "Empty image" },
      },
      { status: 400 }
    );
  }

  const maxBytes = 12 * 1024 * 1024;
  if (buf.length > maxBytes) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "Image too large" },
      },
      { status: 400 }
    );
  }

  const base64 = buf.toString("base64");

  const gen = await geminiGenerateContent({
    apiKey: key,
    systemInstruction: SCAN_SYSTEM,
    userParts: [
      {
        inline_data: {
          mime_type: mimeType,
          data: base64,
        },
      },
      {
        text: "Analyze this refrigerator or food photo and follow the system instructions exactly.",
      },
    ],
    responseMimeType: "application/json",
  });

  if (!gen.ok) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "upstream",
          message: gen.rawError ?? "Model request failed",
        },
      },
      { status: 502 }
    );
  }

  let parsed: { items?: unknown };
  try {
    parsed = JSON.parse(gen.text) as { items?: unknown };
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "parse", message: "Model did not return valid JSON" },
      },
      { status: 502 }
    );
  }

  const rawList = Array.isArray(parsed.items) ? parsed.items : [];
  const items: ReturnType<typeof normalizeItem>[] = [];
  for (const row of rawList) {
    if (typeof row !== "object" || row === null) continue;
    const norm = normalizeItem(row as Record<string, unknown>);
    if (norm) items.push(norm);
    if (items.length >= 40) break;
  }

  return NextResponse.json({
    success: true,
    data: { items },
  });
}
