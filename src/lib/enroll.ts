import { CheckoutResponse, parse } from "../../shared/contract";

/** What the membership button should do with a /api/checkout response. */
export type EnrollIntent =
  | { kind: "redirect"; url: string }
  | { kind: "fallback"; phone: string; email: string };

/**
 * Map a raw /api/checkout JSON response to a client intent, validating it against
 * the contract at the seam. On any shape drift (or a fallback response), degrade
 * to a call/email path so the enroll button is never a dead end (R5, AE1).
 */
export function enrollIntent(
  raw: unknown,
  fallback: { phone: string; email: string },
): EnrollIntent {
  const parsed = parse(CheckoutResponse, raw);
  if (parsed.ok) {
    if (parsed.value.status === "checkout") return { kind: "redirect", url: parsed.value.url };
    return { kind: "fallback", phone: parsed.value.phone, email: parsed.value.email };
  }
  return { kind: "fallback", ...fallback };
}
