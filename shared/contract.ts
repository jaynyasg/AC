import { z } from "zod";

/**
 * The single typed seam between the React app, the Vercel serverless functions,
 * and the eval harness. Each schema is BOTH the runtime validator (`.parse`) and
 * the compile-time type (`z.infer`). Validate every external/LLM payload here.
 */

// ---- Limits (shared by UI + API so they never disagree) --------------------
export const LIMITS = {
  messageMaxChars: 2000,
  replyMaxChars: 4000,
  maxMessagesPerRequest: 40,
  bookingMessageMaxChars: 1000,
} as const;

// ---- Chat ------------------------------------------------------------------
export const ChatRole = z.enum(["user", "assistant"]);
export type ChatRole = z.infer<typeof ChatRole>;

export const ChatMessage = z.object({
  role: ChatRole,
  content: z.string().min(1).max(LIMITS.messageMaxChars),
});
export type ChatMessage = z.infer<typeof ChatMessage>;

export const ChatRequest = z.object({
  messages: z.array(ChatMessage).min(1).max(LIMITS.maxMessagesPerRequest),
});
export type ChatRequest = z.infer<typeof ChatRequest>;

export const ChatResponse = z.object({
  reply: z.string().min(1).max(LIMITS.replyMaxChars),
  /** True when the reply is a safe fallback (no key, model error, refusal). */
  fallback: z.boolean().optional(),
});
export type ChatResponse = z.infer<typeof ChatResponse>;

// ---- Booking / contact -----------------------------------------------------
export const ServiceType = z.enum([
  "repair",
  "maintenance",
  "new-system-estimate",
  "generator",
  "other",
]);
export type ServiceType = z.infer<typeof ServiceType>;

// Loose phone check: require at least 10 digits somewhere in the string.
const phone = z
  .string()
  .trim()
  .min(7)
  .max(30)
  .refine((v) => (v.replace(/\D/g, "").length >= 10), {
    message: "Enter a valid phone number (at least 10 digits).",
  });

export const BookingRequest = z.object({
  name: z.string().trim().min(2).max(80),
  phone,
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  serviceType: ServiceType,
  preferredTime: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(LIMITS.bookingMessageMaxChars).optional().or(z.literal("")),
});
export type BookingRequest = z.infer<typeof BookingRequest>;

export const BookingResponse = z.object({
  ok: z.literal(true),
  /** "emailed" when delivered via Resend, "logged" when no provider configured. */
  delivery: z.enum(["emailed", "logged"]),
});
export type BookingResponse = z.infer<typeof BookingResponse>;

// ---- Checkout / membership -------------------------------------------------
// `plan` MUST match a MEMBERSHIP_PLANS key in shared/knowledge.ts (a contract
// test asserts they stay in sync). The client sends ONLY the plan key — never a
// price, amount, or Stripe id — and the server resolves the env Price id.
export const CheckoutPlan = z.enum(["tuneup", "seasonal", "comfort"]);
export type CheckoutPlan = z.infer<typeof CheckoutPlan>;

export const CheckoutRequest = z.object({
  plan: CheckoutPlan,
  // Optional prefill only; Stripe's hosted Checkout collects the email itself.
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
});
export type CheckoutRequest = z.infer<typeof CheckoutRequest>;

/**
 * Discriminated on `status`: "checkout" carries the Stripe-hosted URL the client
 * redirects to; "fallback" means Stripe is not configured (or this plan's Price
 * id is missing) so the UI shows a call/email-to-enroll path — never a dead button.
 */
export const CheckoutResponse = z.discriminatedUnion("status", [
  z.object({ status: z.literal("checkout"), url: z.string().url() }),
  z.object({ status: z.literal("fallback"), phone: z.string(), email: z.string() }),
]);
export type CheckoutResponse = z.infer<typeof CheckoutResponse>;

export const ApiError = z.object({
  error: z.string(),
  fields: z.record(z.string()).optional(),
});
export type ApiError = z.infer<typeof ApiError>;

// ---- Parse-or-fallback helper (use at the seam) ----------------------------
export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; fields: Record<string, string> };

/** Safe parse that flattens zod errors into a field→message map for the UI/API. */
export function parse<T>(schema: z.ZodType<T>, data: unknown): ParseResult<T> {
  const r = schema.safeParse(data);
  if (r.success) return { ok: true, value: r.data };
  const fields: Record<string, string> = {};
  for (const issue of r.error.issues) {
    const key = issue.path.join(".") || "_";
    if (!fields[key]) fields[key] = issue.message;
  }
  return { ok: false, fields };
}
