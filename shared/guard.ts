import { LIMITS } from "./contract";
import { COMPANY, FORBIDDEN_DISCLOSURES, REFERRAL_SAFE_LINE } from "./knowledge";

/** Shown when there is no real answer to serve (empty model output, refusal, error). */
export const FALLBACK_REPLY =
  `Sorry — I'm having trouble answering right now. Please call us at ${COMPANY.phone} ` +
  `(Mon–Fri 8am–5pm, Sat 9am–noon) or email ${COMPANY.email} and we'll help right away.`;

export interface GuardedReply {
  reply: string;
  /** True when `reply` is a safe canned message because no real answer was available. */
  fallback: boolean;
}

/**
 * Boundary guard for model output (claims C6, C10). Runs at the seam before the
 * reply is ever served:
 *  1. empty / whitespace  → safe fallback (model refused, errored, or returned nothing)
 *  2. referral-reward leak → replaced with the privacy-preserving safe line
 *  3. over-long           → truncated to the contract's cap
 */
export function guardReply(raw: string | null | undefined): GuardedReply {
  const text = (raw ?? "").trim();
  if (!text) return { reply: FALLBACK_REPLY, fallback: true };

  // Defense-in-depth: the reward amount is never in the model's context, but if
  // it ever invents/confirms one, redact the whole reply to the safe line.
  if (FORBIDDEN_DISCLOSURES.some((re) => re.test(text))) {
    return { reply: REFERRAL_SAFE_LINE, fallback: false };
  }

  const reply =
    text.length > LIMITS.replyMaxChars
      ? text.slice(0, LIMITS.replyMaxChars).trimEnd() + "…"
      : text;
  return { reply, fallback: false };
}
