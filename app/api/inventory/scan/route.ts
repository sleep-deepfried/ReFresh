import { NextRequest, NextResponse } from "next/server";
import { geminiGenerateContent, geminiScanModelId } from "@/lib/gemini";
import { parseModelJson } from "@/lib/parseModelJson";
import { extractScanImageFromRequest } from "@/lib/scanMultipartImage";

const SCAN_SYSTEM = `List distinct visible food or drink items in the image. JSON only, no prose, no recipes, no meal or cuisine ideas.
Shape:
{"items":[...],"scene":"food"|"no_food"|"unclear","notice":"optional short English for the user"}
- items: same as below. Max 25.
- scene: "food" if you listed real edible items. "no_food" if the photo is clearly not food (objects, pets, people without food, screens, outdoor scenes, random items). "unclear" if the image is too dark/blurry/empty shelf and you cannot list items.
- notice: required when items is empty — briefly say why (e.g. "This looks like a keyboard, not food." or "No groceries visible — try a closer fridge shot.").
Item fields: {"name":"short English label","quantity":1,"confidence":0.9,"food_type":"Other","freshness_status":"fresh","days_until_best":7}
food_type: Produce|Dairy|Meat|Poultry|Seafood|Pantry|Frozen|Beverage|Other. freshness_status: fresh|stale|spoiled. quantity 1-99. confidence 0-1. days_until_best 0-365 (use 7 if unsure). If no edible items to list, use items:[].`;

const FRESHNESS = new Set(["fresh", "stale", "spoiled"]);

type ScanScene = "food" | "no_food" | "unclear";

function normalizeScene(raw: unknown): ScanScene {
  if (typeof raw !== "string") return "unclear";
  const s = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (s === "no_food" || s === "not_food" || s === "non_food") return "no_food";
  if (s === "food" || s === "food_found" || s === "has_food") return "food";
  return "unclear";
}

function trimNotice(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.trim().slice(0, 500);
}

function buildInventoryWarning(
  itemCount: number,
  scene: ScanScene,
  notice: string
): { code: string; message: string } | undefined {
  if (itemCount > 0) return undefined;
  const n = notice.trim();
  if (scene === "no_food") {
    return {
      code: "not_food",
      message:
        n ||
        "This does not look like food. Try a dish, groceries, or the inside of your fridge or pantry.",
    };
  }
  return {
    code: "no_items",
    message:
      n ||
      "No food was detected. Use better light, move closer, or photograph shelves or containers with food.",
  };
}

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

  const extracted = await extractScanImageFromRequest(req);
  if (extracted instanceof NextResponse) return extracted;

  const { base64, mimeType } = extracted;

  const gen = await geminiGenerateContent({
    apiKey: key,
    model: geminiScanModelId(),
    systemInstruction: SCAN_SYSTEM,
    userParts: [
      {
        inline_data: {
          mime_type: mimeType,
          data: base64,
        },
      },
      { text: "JSON only." },
    ],
    responseMimeType: "application/json",
    temperature: 0.2,
    maxOutputTokens: 2048,
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

  let parsed: { items?: unknown; scene?: unknown; notice?: unknown };
  try {
    parsed = parseModelJson(gen.text) as { items?: unknown; scene?: unknown; notice?: unknown };
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
    if (items.length >= 25) break;
  }

  let scene = normalizeScene(parsed.scene);
  if (items.length > 0) {
    scene = "food";
  }
  const notice = trimNotice(parsed.notice);
  const warning = buildInventoryWarning(items.length, scene, notice);

  return NextResponse.json({
    success: true,
    data: {
      item_count: items.length,
      scene,
      items,
      ...(warning ? { warning } : {}),
    },
  });
}
