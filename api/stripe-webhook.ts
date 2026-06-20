import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { COMPANY } from "../shared/knowledge.js";

/**
 * POST /api/stripe-webhook — owner notifications for membership events.
 *
 * No database: the only side effect is emailing the owner (Stripe stays the
 * system of record). We subscribe to exactly three events. Signature is verified
 * against STRIPE_WEBHOOK_SECRET; when that secret is absent the endpoint is inert
 * (acknowledges + ignores) so it never errors before the owner wires Stripe.
 *
 * Raw-body note: we NEVER read `req.body` — that getter parses-and-consumes the
 * stream, which would corrupt the bytes Stripe signed. We read the raw stream
 * directly. (`export const config = { api: { bodyParser: false } }` is a
 * Next.js-only directive and a no-op on bare @vercel/node, so we don't rely on it.)
 */

let cached: Stripe | null = null;
function getStripe(): Stripe {
  // constructEvent is crypto-only (no API call), so any key suffices for verify.
  if (!cached) cached = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_webhook_verify_only");
  return cached;
}

async function readRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

/**
 * Email the owner. Errors are logged (observable) but NEVER propagated to a
 * non-2xx response — a failed/slow email must not make Stripe retry for days.
 * A missed notification is acceptable; the Stripe Dashboard remains authoritative.
 */
async function notifyOwner(subject: string, lines: string[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL ?? COMPANY.email;
  if (!apiKey || !to) {
    console.log(`[stripe-webhook] ${subject} — email not configured, logged only`);
    return;
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.BOOKING_FROM_EMAIL ?? "Di Felice's HVAC <onboarding@resend.dev>",
        to: [to],
        subject,
        text: lines.join("\n"),
      }),
    });
    if (!r.ok) console.error("[stripe-webhook] Resend returned", r.status);
  } catch (err) {
    console.error("[stripe-webhook] email send failed:", err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.warn(
      "[stripe-webhook] STRIPE_WEBHOOK_SECRET not set — signature verification disabled; ignoring event.",
    );
    res.status(200).json({ received: true, verified: false });
    return;
  }

  let raw: Buffer;
  try {
    raw = await readRawBody(req);
  } catch (err) {
    console.error("[stripe-webhook] failed to read raw body:", err);
    res.status(400).json({ error: "Bad request" });
    return;
  }

  const sigHeader = req.headers["stripe-signature"];
  const sig = Array.isArray(sigHeader) ? sigHeader[0] : (sigHeader ?? "");
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", (err as Error).message);
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  // PII-scoped notifications — only operationally necessary fields, never the
  // full event object (recipient is a personal inbox).
  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const plan = s.metadata?.plan ?? "unknown";
      const who = s.customer_details?.name || s.customer_details?.email || s.customer_email || "(see Stripe Dashboard)";
      const amount = typeof s.amount_total === "number" ? `$${(s.amount_total / 100).toFixed(2)}` : "";
      await notifyOwner(
        `New membership enrollment — ${plan}`,
        [`Plan: ${plan}`, `Member: ${who}`, amount ? `Amount: ${amount}` : ""].filter(Boolean),
      );
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await notifyOwner("Membership cancelled", [
        `Customer: ${String(sub.customer)}`,
        "A membership subscription was cancelled — see the Stripe Dashboard for details.",
      ]);
      break;
    }
    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice;
      await notifyOwner("Membership payment failed", [
        `Customer: ${inv.customer_email ?? String(inv.customer)}`,
        "A recurring membership payment failed. Stripe retries automatically; check the Dashboard for current status before applying member perks.",
      ]);
      break;
    }
    default:
      // Not a subscribed event — acknowledge and ignore.
      break;
  }

  res.status(200).json({ received: true });
}
