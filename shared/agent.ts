import OpenAI from "openai";
import type { ChatMessage } from "./contract";
import { guardReply, type GuardedReply } from "./guard";
import { SYSTEM_PROMPT } from "./system-prompt";

/**
 * The chatbot's core call path — used by BOTH `api/chat.ts` (production) and the
 * eval recorder, so the golden eval exercises the exact deployed logic.
 *
 * Runs on OpenAI gpt-4o-mini — cheap and fast for a high-volume CSR bot. Override
 * with CHAT_MODEL=<any OpenAI chat model>. Uses OPENAI_API_KEY.
 */
export const CHAT_MODEL: string = process.env.CHAT_MODEL ?? "gpt-4o-mini";
const MAX_TOKENS = 1024;

/** Drop any leading assistant turns so the conversation starts on a user turn. */
function startAtFirstUser(messages: ChatMessage[]): ChatMessage[] {
  const i = messages.findIndex((m) => m.role === "user");
  return i <= 0 ? messages.slice(Math.max(i, 0)) : messages.slice(i);
}

/**
 * Run one CSR turn. Never throws for runtime/model/auth failures — it degrades to
 * a safe fallback reply so the widget can't die. Errors are logged (observable).
 */
export async function runChat(messages: ChatMessage[]): Promise<GuardedReply> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[chat] OPENAI_API_KEY not set — serving fallback reply.");
    return guardReply(null);
  }

  const history = startAtFirstUser(messages);
  if (history.length === 0) return guardReply(null);

  // OpenAI takes the system prompt as the first message (no top-level `system`).
  const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m): OpenAI.Chat.Completions.ChatCompletionMessageParam =>
      m.role === "user"
        ? { role: "user", content: m.content }
        : { role: "assistant", content: m.content },
    ),
  ];

  try {
    const client = new OpenAI();
    const res = await client.chat.completions.create({
      model: CHAT_MODEL,
      max_tokens: MAX_TOKENS,
      messages: chatMessages,
    });
    const text = (res.choices[0]?.message?.content ?? "").trim();
    return guardReply(text);
  } catch (err) {
    console.error("[chat] model call failed:", err);
    return guardReply(null);
  }
}
