import { useEffect, useRef, useState } from "react";
import { COMPANY } from "../../shared/knowledge";
import { useChat } from "../lib/useChat";
import { Chat, Send, Snowflake, X } from "./icons";

const SUGGESTIONS = ["My AC isn't cooling", "Book a tune-up", "What's the diagnostic fee?"];
const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [draft, setDraft] = useState("");
  const { messages, status, send, retryFromError } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Proactive nudge: appear once after a few seconds if the panel is still closed.
  useEffect(() => {
    if (open || sessionStorage.getItem("hvac-chat-nudged")) return;
    const t = setTimeout(() => setNudge(true), 6000);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status, open]);

  function openPanel() {
    setOpen(true);
    setNudge(false);
    sessionStorage.setItem("hvac-chat-nudged", "1");
  }

  function submit(text: string) {
    const t = text.trim();
    if (!t) return;
    setDraft("");
    void send(t);
  }

  return (
    <>
      {/* Launcher */}
      <div className="chat-anchor fixed right-5 z-50 flex flex-col items-end gap-3">
        {nudge && !open && (
          <button
            type="button"
            onClick={openPanel}
            className="animate-riseIn max-w-[15rem] rounded-card border border-line bg-paper px-4 py-3 text-left text-[13.5px] text-ink-2 shadow-pop"
          >
            <span className="font-medium text-ink">Need help with your AC?</span> Ask me anything —
            I'm here to help.
          </button>
        )}
        {!open && (
          <button
            type="button"
            aria-label="Open chat"
            onClick={openPanel}
            className="grid h-14 w-14 place-items-center rounded-full bg-[#5fe3f5] text-[#04222c] shadow-pop transition hover:bg-[#8aedf8] active:scale-95"
          >
            <Chat size={26} />
          </button>
        )}
      </div>

      {/* Panel */}
      {open && (
        <div className="chat-anchor chat-panel fixed right-5 z-50 flex w-[min(24rem,calc(100vw-2.5rem))] animate-popIn flex-col overflow-hidden rounded-card border border-white/40 bg-[#f4f8fc] shadow-pop">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#071426] px-4 py-3 text-[#f4f8fc]">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">
                <Snowflake size={18} />
              </span>
              <div className="leading-tight">
                <p className="text-[14px] font-semibold">Di Felice's HVAC</p>
                <p className="text-[11px] text-white/75">Customer support · usually quick</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/85 hover:bg-white/15"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="scrollbar-none flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed " +
                    (m.role === "user"
                      ? "bg-[#071426] text-[#f4f8fc]"
                      : "border border-line bg-white text-ink-2")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {status === "sending" && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl border border-line bg-paper px-3.5 py-3">
                  <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="rounded-card border border-accent-red/30 bg-accent-red/5 px-3.5 py-3 text-[13px] text-ink-2">
                Something went wrong reaching our assistant.{" "}
                <button onClick={retryFromError} className="font-semibold text-brand-700 underline">
                  Try again
                </button>{" "}
                or call{" "}
                <a href={telHref} className="font-semibold text-brand-700 underline">
                  {COMPANY.phone}
                </a>
                .
              </div>
            )}

            {messages.length === 1 && status === "idle" && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submit(s)}
                    className="rounded-pill border border-line bg-paper px-3 py-1.5 text-[12.5px] text-ink-2 transition hover:border-brand-300 hover:text-brand-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t border-line bg-paper px-3 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              submit(draft);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about your AC or heating…"
              maxLength={2000}
              className="min-w-0 flex-1 rounded-pill border border-line bg-canvas px-4 py-2.5 text-[13.5px] outline-none placeholder:text-muted-2 focus:border-brand-300"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!draft.trim() || status === "sending"}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#5fe3f5] text-[#04222c] transition hover:bg-[#8aedf8] disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-2"
      style={{ animationDelay: delay }}
    />
  );
}
