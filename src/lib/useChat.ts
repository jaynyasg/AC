import { useCallback, useState } from "react";
import type { ChatResponse } from "../../shared/contract";

export interface UiMessage {
  role: "user" | "assistant";
  content: string;
}

export type ChatStatus = "idle" | "sending" | "error";

const GREETING =
  "Hi! You've reached DI Felice's HVAC. How can I help with your heating or cooling today?";

/** Chat client for the CSR widget. Talks to POST /api/chat; keeps full history. */
export function useChat() {
  const [messages, setMessages] = useState<UiMessage[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [status, setStatus] = useState<ChatStatus>("idle");

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || status === "sending") return;

      const next: UiMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages(next);
      setStatus("sending");
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });
        if (!res.ok) throw new Error(`chat request failed: ${res.status}`);
        const data = (await res.json()) as ChatResponse;
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
        setStatus("idle");
      } catch (err) {
        console.error("[chat] send failed:", err);
        setStatus("error");
      }
    },
    [messages, status],
  );

  const retryFromError = useCallback(() => setStatus("idle"), []);

  return { messages, status, send, retryFromError };
}
