import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage } from "./contract";
import { guardReply, type GuardedReply } from "./guard";
import { SYSTEM_PROMPT } from "./system-prompt";

/**
 * The chatbot's core call path — used by BOTH `api/chat.ts` (production) and the
 * eval recorder, so the golden eval exercises the exact deployed logic.
 *
 * Default model is `claude-opus-4-8` per Anthropic guidance (don't downgrade for
 * cost silently). Set CHAT_MODEL=claude-haiku-4-5 to cut cost ~5x for a
 * high-volume CSR bot — that's the owner's call, surfaced in .env.example.
 */
export const CHAT_MODEL: string = process.env.CHAT_MODEL ?? "claude-opus-4-8";
const MAX_TOKENS = 1024;

/** Drop any leading assistant turns so the first message is a user turn (API requires it). */
function startAtFirstUser(messages: ChatMessage[]): ChatMessage[] {
  const i = messages.findIndex((m) => m.role === "user");
  return i <= 0 ? messages.slice(Math.max(i, 0)) : messages.slice(i);
}

/**
 * Run one CSR turn. Never throws for runtime/model/auth failures — it degrades to
 * a safe fallback reply so the widget can't die. Errors are logged (observable).
 */
export async function runChat(messages: ChatMessage[]): Promise<GuardedReply> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("[chat] ANTHROPIC_API_KEY not set — serving fallback reply.");
    return guardReply(null);
  }

  const apiMessages: Anthropic.MessageParam[] = startAtFirstUser(messages).map((m) => ({
    role: m.role,
    content: m.content,
  }));
  if (apiMessages.length === 0) return guardReply(null);

  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: CHAT_MODEL,
      max_tokens: MAX_TOKENS,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: apiMessages,
    });

    if (res.stop_reason === "refusal") return guardReply(null);

    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return guardReply(text);
  } catch (err) {
    console.error("[chat] model call failed:", err);
    return guardReply(null);
  }
}
