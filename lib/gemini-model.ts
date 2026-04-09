/**
 * Default Gemini model for Google Generative AI (generateContent, multimodal, etc.).
 * Server override: GEMINI_MODEL or GEMINI_VISION_MODEL (legacy, scan route).
 * Client override: NEXT_PUBLIC_GEMINI_MODEL (chatbot).
 */
export const DEFAULT_GEMINI_MODEL = "gemini-3-flash-preview";

export function resolveServerGeminiModelId(): string {
  const fromEnv =
    process.env.GEMINI_MODEL?.trim() ||
    process.env.GEMINI_VISION_MODEL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_GEMINI_MODEL;
}

export function resolveClientGeminiModelId(): string {
  const fromEnv =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_GEMINI_MODEL?.trim()
      : undefined;
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_GEMINI_MODEL;
}
