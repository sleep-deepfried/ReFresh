import { NextRequest, NextResponse } from "next/server";
import { geminiGenerateContent } from "@/lib/gemini";

const COOK_SYSTEM = `You are a professional home cook. Using only the fridge inventory, meal period, and cuisine country/region the user provides, suggest exactly 3 practical meal ideas. Each idea must lean heavily on items they already have. When a country is named, favor that country's everyday home cooking; when they choose International, do not favor one region. Output JSON only with this shape:
{"suggestions":[{"title":"","subtitle":"","from_your_fridge":[]}]}
Use short titles, one-line subtitles, and list ingredient names from their inventory that each dish uses (subset of what they have — use the exact food_name strings from the inventory list).`;

type InvLine = {
  food_name: string;
  food_type: string;
  quantity: number;
  best_before: string | null;
};

function buildCookUserText(
  meal: string,
  country: string,
  items: InvLine[]
): string {
  const inv =
    items.length === 0
      ? "(empty — suggest very simple pantry-staple ideas and note they can add inventory)"
      : items
          .map((i) => `- ${i.food_name} (${i.food_type}) ×${i.quantity}`)
          .join("\n");
  return `Meal period: ${meal}
Cuisine / region: ${country}

Fridge inventory:
${inv}

Return JSON only with exactly 3 suggestions.`;
}

function clampInt(n: unknown, min: number, max: number, fallback: number): number {
  const x = typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : fallback;
  return Math.min(max, Math.max(min, x));
}

function normalizeSuggestion(
  raw: Record<string, unknown>,
  allowedNames: Set<string>
): {
  title: string;
  subtitle: string;
  from_your_fridge: string[];
  symbol_name: string | null;
} | null {
  const title =
    typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return null;
  const subtitle =
    typeof raw.subtitle === "string"
      ? raw.subtitle.trim().slice(0, 400)
      : "";
  let from: string[] = [];
  if (Array.isArray(raw.from_your_fridge)) {
    from = raw.from_your_fridge
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  from = from.filter((n) => allowedNames.has(n));
  if (from.length === 0 && allowedNames.size > 0) {
    from = [Array.from(allowedNames)[0]];
  }
  const symbol =
    typeof raw.symbol_name === "string" && raw.symbol_name.trim()
      ? raw.symbol_name.trim()
      : null;
  return {
    title: title.slice(0, 120),
    subtitle,
    from_your_fridge: from.slice(0, 12),
    symbol_name: symbol,
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
          message: "Cook suggestions are not configured on the server.",
        },
      },
      { status: 503 }
    );
  }

  let body: {
    meal?: string;
    country?: string;
    items?: InvLine[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "bad_request", message: "Invalid JSON body" },
      },
      { status: 400 }
    );
  }

  const meal = typeof body.meal === "string" ? body.meal.trim() : "";
  const country =
    typeof body.country === "string" ? body.country.trim() : "International";
  const items = Array.isArray(body.items) ? body.items : [];

  const normalizedItems: InvLine[] = items
    .map((row) => {
      const food_name =
        typeof row?.food_name === "string" ? row.food_name.trim() : "";
      if (!food_name) return null;
      const food_type =
        typeof row?.food_type === "string" && row.food_type.trim()
          ? row.food_type.trim()
          : "Other";
      const quantity = clampInt(row?.quantity, 1, 999, 1);
      const best_before =
        row?.best_before === null || row?.best_before === undefined
          ? null
          : typeof row.best_before === "string"
            ? row.best_before
            : null;
      return { food_name, food_type, quantity, best_before };
    })
    .filter((x): x is InvLine => x !== null)
    .slice(0, 200);

  const allowedNames = new Set(normalizedItems.map((i) => i.food_name));
  const userText = buildCookUserText(
    meal || "any",
    country || "International",
    normalizedItems
  );

  const gen = await geminiGenerateContent({
    apiKey: key,
    systemInstruction: COOK_SYSTEM,
    userParts: [{ text: userText }],
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

  let parsed: { suggestions?: unknown };
  try {
    parsed = JSON.parse(gen.text) as { suggestions?: unknown };
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "parse", message: "Model did not return valid JSON" },
      },
      { status: 502 }
    );
  }

  const rawList = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
  const suggestions: ReturnType<typeof normalizeSuggestion>[] = [];
  for (const row of rawList) {
    if (typeof row !== "object" || row === null) continue;
    const norm = normalizeSuggestion(row as Record<string, unknown>, allowedNames);
    if (norm) suggestions.push(norm);
    if (suggestions.length >= 3) break;
  }

  if (suggestions.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "parse",
          message: "Model returned no usable suggestions",
        },
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { suggestions },
  });
}
