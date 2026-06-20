import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { CheckoutRequest, parse, type CheckoutResponse } from "../shared/contract.js";
import { COMPANY, MEMBERSHIP_PLANS } from "../shared/knowledge.js";

/**
 * POST /api/checkout — create a Stripe Checkout Session for a membership plan.
 *
 * Mirrors api/booking.ts: validate at the seam, gate the external call on env
 * config, and degrade gracefully (call/email to enroll) instead of erroring when
 * Stripe is not yet wired up. The client sends ONLY a plan key; the server maps
 * it to the env Price id — never trust a client-sent price/amount (tamper vector).
 */

// Lazy singleton: read the key at call time (so tests can stub env) while still
// reusing the client across warm invocations.
let cached: Stripe | null = null;
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) cached = new Stripe(key);
  return cached;
}

/**
 * Build the absolute origin used for Stripe's success/cancel return URLs.
 * `req.headers.host` is attacker-controllable, so prefer the operator-set
 * PUBLIC_BASE_URL and only trust a known host fallback. Returns null when no
 * trusted origin is available (caller then degrades to the fallback path).
 */
function safeBaseUrl(req: VercelRequest): string | null {
  const env = process.env.PUBLIC_BASE_URL?.replace(/\/+$/, "");
  if (env) return env;
  const host = req.headers.host;
  if (!host) return null;
  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) return `http://${host}`;
  if (host.endsWith(".vercel.app")) return `https://${host}`;
  return null;
}

/** Reject cross-site browser POSTs; allow non-browser callers (no Origin header). */
function originAllowed(req: VercelRequest): boolean {
  const src = req.headers.origin ?? req.headers.referer;
  if (!src) return true;
  try {
    return new URL(src).host === req.headers.host;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!originAllowed(req)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const parsed = parse(CheckoutRequest, req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: "Invalid checkout request", fields: parsed.fields });
    return;
  }

  const { plan, email } = parsed.value;
  const planDef = MEMBERSHIP_PLANS.find((p) => p.key === plan)!;
  const priceId = process.env[planDef.priceEnv];
  const fallback: CheckoutResponse = {
    status: "fallback",
    phone: COMPANY.phone,
    email: COMPANY.email,
  };

  const stripe = getStripe();
  // Gate on config — never a dead/erroring button before the owner wires Stripe.
  // Per-plan: log which side is missing so a partial misconfig is visible in logs.
  if (!stripe || !priceId) {
    console.log(
      `[checkout] not configured — plan=${plan} stripeKey=${!!stripe} ${planDef.priceEnv}=${!!priceId} → fallback`,
    );
    res.status(200).json(fallback);
    return;
  }

  const base = safeBaseUrl(req);
  if (!base) {
    console.error("[checkout] no trusted base URL (set PUBLIC_BASE_URL) — falling back");
    res.status(200).json(fallback);
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: planDef.mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/membership?status=success`,
      cancel_url: `${base}/membership?status=cancel`,
      metadata: { plan },
      ...(email ? { customer_email: email } : {}),
    });
    if (!session.url) {
      console.error("[checkout] Stripe returned a session with no url — falling back");
      res.status(200).json(fallback);
      return;
    }
    res.status(200).json({ status: "checkout", url: session.url } satisfies CheckoutResponse);
  } catch (err) {
    // Log the error (type/message) so a mode↔price-type mismatch is diagnosable,
    // then degrade — house style is "never a dead end", never 500 a valid request.
    console.error("[checkout] Stripe session create failed:", err);
    res.status(200).json(fallback);
  }
}
