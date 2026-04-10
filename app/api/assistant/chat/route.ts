import { NextRequest, NextResponse } from "next/server";
import { geminiGenerateContent } from "@/lib/gemini";
import { parseModelJson } from "@/lib/parseModelJson";

const SYSTEM_INSTRUCTION = `You are ReFresh's fridge assistant. Help with food inventory, meal ideas from what they have, and simple fridge questions. Do not give medical or food-safety diagnoses. If the user wants to add or remove items, include structured actions.

Output JSON only with exactly this shape:
{"message":"<short reply shown in chat>","actions":[]}

Each action is one of:
- {"type":"add","food_name":"","food_type":"Other","quantity":1,"best_before":null}
- {"type":"remove","food_name":"","quantity":null}

For add: food_name required; food_type optional (default Other); quantity integer 1-99; best_before optional ISO8601 full-date string or null.
For remove: food_name required; quantity null removes the whole line, or a positive integer to subtract that many from the matched item (case-insensitive name match).
If no inventory changes are needed, use an empty actions array.
Keep the conversational message friendly and concise.
At most 10 actions.`;

type ChatMessage = { role: string; content: string };
type InvLine = {
  food_name: string;
  food_type: string;
  quantity: number;
  best_before: string | null;
};

function buildUserPrompt(
  messages: ChatMessage[],
  items: InvLine[],
  country: string | null
): string {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");
  const invLines =
    items.length === 0
      ? "(empty)"
      : items
          .map((i) => `- ${i.food_name} (${i.food_type}) ×${i.quantity}`)
          .join("\n");
  const region = country?.trim() || "unspecified";
  return `Cuisine / region context: ${region}

Current fridge inventory:
${invLines}

Conversation:
${transcript}

Respond with JSON only (message + actions).`;
}

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "config",
          message: "Assistant is not configured on the server.",
        },
      },
      { status: 503 }
    );
  }

  let body: {
    messages?: ChatMessage[];
    items?: InvLine[];
    country?: string | null;
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

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const items = Array.isArray(body.items) ? body.items : [];
  const country = body.country ?? null;

  const userText = buildUserPrompt(messages, items, country);

  const gen = await geminiGenerateContent({
    apiKey: key,
    systemInstruction: SYSTEM_INSTRUCTION,
    userParts: [{ text: userText }],
    responseMimeType: "application/json",
    temperature: 0.25,
    maxOutputTokens: 4096,
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

  const text = gen.text;

  let data: { message?: unknown; actions?: unknown };
  try {
    data = parseModelJson(text) as { message?: unknown; actions?: unknown };
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "parse", message: "Model did not return valid JSON" },
      },
      { status: 502 }
    );
  }

  const message =
    typeof data.message === "string"
      ? data.message.trim()
      : "";
  if (!message) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "parse", message: "Empty assistant message" },
      },
      { status: 502 }
    );
  }

  const actions = Array.isArray(data.actions) ? data.actions : [];

  return NextResponse.json({
    success: true,
    data: { message, actions },
  });
}
