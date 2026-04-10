import { NextRequest, NextResponse } from "next/server";
import { geminiGenerateContent, geminiSafetyModelId } from "@/lib/gemini";
import { parseModelJson } from "@/lib/parseModelJson";
import { extractScanImageFromRequest } from "@/lib/scanMultipartImage";

const SAFETY_SYSTEM = `You see one photo. Decide if the main subject is edible food or drink you could assess for visible spoilage—not medical or lab safety.
Output JSON only, one object:
{"subject":"food"|"not_food"|"unclear","status":"fresh"|"warning"|"spoiled","explanation":"short plain English, max 400 chars","confidence":0.0-1.0}
- subject "not_food" for objects, pets, people without food, screens, outdoor scenes, text, tools, etc.
- subject "unclear" if you cannot tell what the subject is.
- subject "food" for actual food, dishes, or drinks meant for consumption.
When subject is not_food or unclear: set status to "warning", explain briefly (e.g. "This looks like a phone, not food."), confidence 0.5–0.9.
When subject is food: status "fresh" if appearance looks normal; "warning" if uncertain; "spoiled" if strong spoilage cues. No recipes or meal ideas.`;

const STATUS = new Set(["fresh", "warning", "spoiled"]);

function normalizeSubject(raw: Record<string, unknown>): "food" | "not_food" | "unclear" {
  const sub = typeof raw.subject === "string" ? raw.subject.trim().toLowerCase().replace(/[\s-]+/g, "_") : "";
  if (sub === "not_food" || sub === "non_food") return "not_food";
  if (sub === "unclear" || sub === "unknown") return "unclear";
  if (sub === "food") return "food";
  return "unclear";
}

function normalizeSafety(raw: Record<string, unknown>): {
  status: string;
  explanation: string;
  confidence: number;
  not_food: boolean;
  uncertain: boolean;
} {
  const subject = normalizeSubject(raw);
  const uncertain = subject === "unclear";
  const notFood = subject === "not_food";

  let status = "warning";
  if (typeof raw.status === "string") {
    const s = raw.status.trim().toLowerCase();
    if (STATUS.has(s)) status = s;
    else if (s.includes("spoil")) status = "spoiled";
    else if (s.includes("warn") || s === "stale") status = "warning";
    else if (s.includes("fresh")) status = "fresh";
  }

  const explanationRaw =
    typeof raw.explanation === "string" ? raw.explanation.trim().slice(0, 2000) : "";

  let confidence = 0.7;
  if (typeof raw.confidence === "number" && Number.isFinite(raw.confidence)) {
    confidence = Math.min(1, Math.max(0, raw.confidence));
  }

  if (notFood) {
    status = "warning";
    confidence = Math.min(0.9, Math.max(0.5, confidence));
    const explanation =
      explanationRaw ||
      "This does not look like food. Point the camera at something edible to check freshness.";
    return { status, explanation, confidence, not_food: true, uncertain: false };
  }

  if (uncertain) {
    status = "warning";
    confidence = Math.min(0.9, Math.max(0.5, confidence));
    const explanation =
      explanationRaw ||
      "We could not tell if this is food. Try a clearer, well-lit photo of the food.";
    return { status, explanation, confidence, not_food: false, uncertain: true };
  }

  const explanation = explanationRaw || "No explanation provided.";
  return { status, explanation, confidence, not_food: false, uncertain: false };
}

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "config",
          message: "Safety scan is not configured on the server.",
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
    model: geminiSafetyModelId(),
    systemInstruction: SAFETY_SYSTEM,
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
    temperature: 0.15,
    maxOutputTokens: 512,
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

  let parsed: Record<string, unknown>;
  try {
    parsed = parseModelJson(gen.text) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "parse", message: "Model did not return valid JSON" },
      },
      { status: 502 }
    );
  }

  const data = normalizeSafety(parsed);

  return NextResponse.json({
    success: true,
    data: {
      status: data.status,
      explanation: data.explanation,
      confidence: data.confidence,
      not_food: data.not_food,
      uncertain: data.uncertain,
    },
  });
}
