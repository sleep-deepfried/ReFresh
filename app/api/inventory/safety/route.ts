import { NextRequest, NextResponse } from "next/server";
import { geminiGenerateContent, geminiSafetyModelId } from "@/lib/gemini";
import { extractScanImageFromRequest } from "@/lib/scanMultipartImage";

const SAFETY_SYSTEM = `You see one photo of food (or a single dish). Give a quick visual-only estimate—not medical or lab food safety.
Output JSON only, one object:
{"status":"fresh"|"warning"|"spoiled","explanation":"short plain English, max 400 chars","confidence":0.0-1.0}
Rules: status "fresh" if appearance looks normal; "warning" if uncertain or mixed signals; "spoiled" if strong visual spoilage cues. No recipes, meals, or cuisine. No extra keys.`;

const STATUS = new Set(["fresh", "warning", "spoiled"]);

function normalizeSafety(raw: Record<string, unknown>): {
  status: string;
  explanation: string;
  confidence: number;
} {
  let status = "warning";
  if (typeof raw.status === "string") {
    const s = raw.status.trim().toLowerCase();
    if (STATUS.has(s)) status = s;
    else if (s.includes("spoil")) status = "spoiled";
    else if (s.includes("warn") || s === "stale") status = "warning";
    else if (s.includes("fresh")) status = "fresh";
  }

  let explanation =
    typeof raw.explanation === "string" ? raw.explanation.trim().slice(0, 2000) : "";
  if (!explanation) explanation = "No explanation provided.";

  let confidence = 0.7;
  if (typeof raw.confidence === "number" && Number.isFinite(raw.confidence)) {
    confidence = Math.min(1, Math.max(0, raw.confidence));
  }

  return { status, explanation, confidence };
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
    parsed = JSON.parse(gen.text) as Record<string, unknown>;
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
    data,
  });
}
