import { GoogleGenAI } from "@google/genai";

/**
 * Official Gemini JavaScript SDK (@google/genai).
 * @see https://ai.google.dev/gemini-api/docs#javascript
 */
export function geminiModelId(): string {
  const m = process.env.GEMINI_MODEL?.trim();
  return m && m.length > 0 ? m : "gemini-3-flash-preview";
}

/** Cook `/api/cook/suggestions` — keep under Vercel Hobby ~10s; override with `GEMINI_COOK_MODEL`. */
export function geminiCookModelId(): string {
  const m = process.env.GEMINI_COOK_MODEL?.trim();
  return m && m.length > 0 ? m : "gemini-2.5-flash-lite";
}

/** `/api/inventory/scan` (vision + JSON) — default fast lite model; override with `GEMINI_SCAN_MODEL`. */
export function geminiScanModelId(): string {
  const m = process.env.GEMINI_SCAN_MODEL?.trim();
  return m && m.length > 0 ? m : "gemini-2.5-flash-lite";
}

/** `/api/inventory/safety` (single-item visual estimate) — override with `GEMINI_SAFETY_MODEL`. */
export function geminiSafetyModelId(): string {
  const m = process.env.GEMINI_SAFETY_MODEL?.trim();
  return m && m.length > 0 ? m : geminiScanModelId();
}

export type GeminiPart =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } };

function toSdkParts(parts: GeminiPart[]) {
  return parts.map((p) => {
    if ("text" in p) {
      return { text: p.text };
    }
    return {
      inlineData: {
        mimeType: p.inline_data.mime_type,
        data: p.inline_data.data,
      },
    };
  });
}

export async function geminiGenerateContent(options: {
  apiKey: string;
  model?: string;
  systemInstruction?: string;
  userParts: GeminiPart[];
  responseMimeType?: string;
  /** Cap response length (often improves latency for structured JSON). */
  maxOutputTokens?: number;
  /** Lower = faster, more deterministic JSON. */
  temperature?: number;
}): Promise<{ ok: boolean; status: number; text: string; rawError?: string }> {
  const { apiKey, model, systemInstruction, userParts, responseMimeType, maxOutputTokens, temperature } =
    options;
  const modelId = model?.trim() || geminiModelId();
  const ai = new GoogleGenAI({ apiKey });

  const config: {
    systemInstruction?: string;
    responseMimeType?: string;
    maxOutputTokens?: number;
    temperature?: number;
  } = {};
  const sys = systemInstruction?.trim();
  if (sys) config.systemInstruction = sys;
  if (responseMimeType) config.responseMimeType = responseMimeType;
  if (typeof maxOutputTokens === "number" && Number.isFinite(maxOutputTokens)) {
    config.maxOutputTokens = Math.max(256, Math.floor(maxOutputTokens));
  }
  if (typeof temperature === "number" && Number.isFinite(temperature)) {
    config.temperature = Math.min(2, Math.max(0, temperature));
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: "user",
        parts: toSdkParts(userParts),
      },
      config: Object.keys(config).length > 0 ? config : undefined,
    });

    const text = response.text?.trim() ?? "";
    return { ok: true, status: 200, text };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Model request failed";
    return { ok: false, status: 502, text: "", rawError: msg };
  }
}
