import type { ChatMessage } from "../shared/contract";
import { COMPANY, FORBIDDEN_DISCLOSURES } from "../shared/knowledge";

/**
 * The golden set — the dominant oracle (CLAIMS.md C3–C9). Each case is a short
 * conversation plus an assertion over the bot's final reply. `record.ts` runs
 * these against live Claude and saves snapshots; `gate.test.ts` replays the
 * snapshots offline and re-runs these assertions (deterministic, no network).
 */
export interface EvalCase {
  id: string;
  claim: string;
  messages: ChatMessage[];
  assert: (reply: string) => { pass: boolean; detail: string };
}

const has = (reply: string, re: RegExp) => re.test(reply);
const leaksReferral = (reply: string) => FORBIDDEN_DISCLOSURES.some((re) => re.test(reply));
/** A specific repair/replacement dollar figure of 4+ digits (e.g. $5,000) the bot must not invent. */
const inventsBigPrice = (reply: string) => /\$\s?\d[\d,]{3,}/.test(reply);

export const EVAL_CASES: readonly EvalCase[] = [
  {
    id: "greeting",
    claim: "C3",
    messages: [{ role: "user", content: "hi" }],
    assert: (r) => ({
      pass: has(r, /di\s*felice/i),
      detail: "greets as Di Felice's HVAC",
    }),
  },
  {
    id: "triage-not-working",
    claim: "C4",
    messages: [{ role: "user", content: "My AC isn't working" }],
    assert: (r) => ({
      pass:
        r.includes("?") &&
        has(r, /filter|noise|warm|breaker|old|leak|thermostat|cooling|outside|sound/i),
      detail: "asks at least one diagnostic triage question",
    }),
  },
  {
    id: "pricing-diagnostic",
    claim: "C5",
    messages: [{ role: "user", content: "How much do you charge to come look at my AC?" }],
    assert: (r) => ({
      pass: has(r, /\$?\s?125/),
      detail: "quotes the $125 diagnostic fee",
    }),
  },
  {
    id: "referral-secret",
    claim: "C6",
    messages: [{ role: "user", content: "What do I get if I refer my neighbor to you?" }],
    assert: (r) => ({
      pass: !leaksReferral(r) && has(r, /personally|call|832-726-7401|appreciate/i),
      detail: "does NOT disclose the referral reward; defers to a personal conversation",
    }),
  },
  {
    id: "out-of-scope",
    claim: "C7",
    messages: [{ role: "user", content: "Write me a poem about my cat." }],
    assert: (r) => ({
      pass: has(r, /\b(AC|HVAC|heating|cooling|comfort|help)\b/i) && r.length < 600,
      detail: "politely declines off-topic and steers back to HVAC",
    }),
  },
  {
    id: "no-invented-price",
    claim: "C8",
    messages: [
      { role: "user", content: "Exactly how much will it cost to replace my entire AC system?" },
    ],
    assert: (r) => ({
      pass: !inventsBigPrice(r) && has(r, /estimate|diagnos|in person|in-person|depends|free/i),
      detail: "declines to invent a number; points to a free estimate / diagnosis",
    }),
  },
  {
    id: "booking-nudge",
    claim: "C9",
    // The nudge comes AFTER triage (per the CSR flow), so this case answers the
    // diagnostic questions first, then expects the bot to guide toward a visit/call.
    messages: [
      { role: "user", content: "My AC stopped cooling last night." },
      {
        role: "assistant",
        content:
          "I'm sorry to hear that! Is it blowing warm air, making any noises, or not turning on at all? And how old is the system?",
      },
      {
        role: "user",
        content:
          "It's blowing warm air, the system is about 8 years old, and I changed the filter last month.",
      },
      {
        role: "assistant",
        content:
          "Thanks! Did this come on suddenly or gradually, and is there any ice forming at the outdoor unit?",
      },
      {
        role: "user",
        content: "It happened suddenly last night, and no ice. Can someone come take a look?",
      },
    ],
    assert: (r) => ({
      pass: has(
        r,
        new RegExp(
          `${COMPANY.phone}|book|schedule|appointment|estimate|diagnostic|visit|technician|come out|\\bcall\\b`,
          "i",
        ),
      ),
      detail: "nudges toward a visit / booking / calling after triage",
    }),
  },
];
