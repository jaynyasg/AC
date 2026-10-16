import { useEffect, useRef, useState } from "react";
import { COMPANY } from "../../shared/knowledge";
import { useChat } from "../lib/useChat";
import { BookServiceLink } from "./BookServiceLink";
import { Chat, Send, Snowflake, X } from "./icons";

const SUGGESTIONS = ["My AC isn't cooling", "Book a tune-up", "What's the diagnostic fee?"];
const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;
const NUDGE_KEY = "hvac-chat-nudged";

function nudgeDismissed(): boolean {
  try {
    return sessionStorage.getItem(NUDGE_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberNudge() {
  try {
    sessionStorage.setItem(NUDGE_KEY, "1");
  } catch {
    /* Private mode can reject sessionStorage. The bubble still closes. */
  }
}

/** True when the bubble would cover a card, link, or control. */
function nudgeCoversContent(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return true;
  const xs = [rect.left + 4, rect.left + rect.width / 2, rect.right - 4];
  const ys = [rect.top + 4, rect.top + rect.height / 2, rect.bottom - 4];
  const samples = ys.flatMap((y) => xs.map((x) => [x, y]));
  const blocker =
    "a, button, input, select, textarea, summary, label, h1, h2, h3, p, li, .plain-card, .service-card, .plan, .tuneup, .teaser-card, .book-form, .btn, .diagnostic";
  for (const [x, y] of samples) {
    if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return true;
    for (const node of document.elementsFromPoint(x, y)) {
      if (el.contains(node) || node.closest(".chat-anchor, .dock, .site-header")) continue;
      if (node.closest(blocker)) return true;
    }
  }
  return false;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [retired, setRetired] = useState(nudgeDismissed);
  const [nudgeClear, setNudgeClear] = useState(false);
  const [draft, setDraft] = useState("");
  const { messages, status, send, retryFromError } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const nudgeRef = useRef<HTMLButtonElement>(null);

  // Show the teaser only while the corner under it is empty, then retire it
  // for the session so it cannot sit on card text or buttons.
  useEffect(() => {
    if (open || retired) return;
    let stop = false;
    let frame = 0;
    let lifetime = 0;
    const shown = { current: false };

    const place = () => {
      const el = nudgeRef.current;
      if (!el || stop) return;
      const clear = !nudgeCoversContent(el);
      setNudgeClear(clear);
      if (clear && !shown.current) {
        shown.current = true;
        lifetime = window.setTimeout(() => {
          rememberNudge();
          setRetired(true);
        }, 6000);
      }
    };

    const onMove = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };

    const start = window.setTimeout(() => {
      place();
      window.addEventListener("scroll", onMove, { passive: true, capture: true });
      window.addEventListener("resize", onMove);
    }, 1200);

    return () => {
      stop = true;
      window.clearTimeout(start);
      window.clearTimeout(lifetime);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open, retired]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status, open]);

  function openPanel() {
    setOpen(true);
    setRetired(true);
    rememberNudge();
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
        {!open && !retired && (
          <button
            ref={nudgeRef}
            type="button"
            data-clear={nudgeClear ? "true" : "false"}
            aria-hidden={nudgeClear ? undefined : true}
            tabIndex={nudgeClear ? 0 : -1}
            onClick={openPanel}
            className="chat-nudge animate-riseIn rounded-card border border-line bg-paper text-left shadow-pop"
          >
            Need help with your AC?
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

          <div className="border-t border-line bg-paper px-4 py-2">
            <BookServiceLink
              className="text-[13px] font-semibold text-[#04222c] underline"
              onClick={() => setOpen(false)}
            >
              Book service
            </BookServiceLink>
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
