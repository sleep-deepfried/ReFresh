import { GoogleGenAI } from "@google/genai";

/**
 * Official Gemini JavaScript SDK (@google/genai).
 * @see https://ai.google.dev/gemini-api/docs#javascript
 */
export function geminiModelId(): string {
  const m = process.env.GEMINI_MODEL?.trim();
  return m && m.length > 0 ? m : "gemini-3-flash-preview";
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
  systemInstruction?: string;
  userParts: GeminiPart[];
  responseMimeType?: string;
}): Promise<{ ok: boolean; status: number; text: string; rawError?: string }> {
  const { apiKey, systemInstruction, userParts, responseMimeType } = options;
  const ai = new GoogleGenAI({ apiKey });

  const config: {
    systemInstruction?: string;
    responseMimeType?: string;
  } = {};
  const sys = systemInstruction?.trim();
  if (sys) config.systemInstruction = sys;
  if (responseMimeType) config.responseMimeType = responseMimeType;

  try {
    const response = await ai.models.generateContent({
      model: geminiModelId(),
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
