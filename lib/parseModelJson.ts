/**
 * Parse JSON from Gemini (and similar) outputs: strict JSON, ```json fences,
 * or substring from first `{` to last `}`.
 */
export function parseModelJson(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("empty_model_output");
  }

  const candidates: string[] = [];
  const push = (s: string) => {
    const t = s.trim();
    if (t && !candidates.includes(t)) candidates.push(t);
  };

  push(trimmed);

  const fenceRe = /```(?:json)?\s*([\s\S]*?)```/gi;
  let fm: RegExpExecArray | null;
  while ((fm = fenceRe.exec(trimmed)) !== null) {
    if (fm[1]) push(fm[1]);
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    push(trimmed.slice(start, end + 1));
  }

  for (const s of candidates) {
    try {
      return JSON.parse(s);
    } catch {
      /* try next */
    }
  }

  throw new Error("invalid_model_json");
}
