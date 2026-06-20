import type { VercelRequest, VercelResponse } from "@vercel/node";
import { BookingRequest, parse, type BookingResponse } from "../shared/contract.js";
import { COMPANY } from "../shared/knowledge.js";

// POST /api/booking — validate, then email the request via Resend if configured.
// If no email provider is set (or sending fails), the request is still logged and
// the call returns ok with delivery:"logged" — the contact path is never a dead end.
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const parsed = parse(BookingRequest, req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: "Invalid booking request", fields: parsed.fields });
    return;
  }

  const b = parsed.value;
  // Always have a durable record server-side, regardless of email delivery.
  console.log("[booking] new request:", JSON.stringify(b));

  let delivery: BookingResponse["delivery"] = "logged";
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL ?? COMPANY.email;
  if (apiKey && to) {
    try {
      const lines = [
        `Service: ${b.serviceType}`,
        `Name: ${b.name}`,
        `Phone: ${b.phone}`,
        b.email ? `Email: ${b.email}` : null,
        b.preferredTime ? `Preferred time: ${b.preferredTime}` : null,
        b.message ? `\nMessage:\n${b.message}` : null,
      ].filter(Boolean);
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.BOOKING_FROM_EMAIL ?? "DI Felice's HVAC <onboarding@resend.dev>",
          to: [to],
          reply_to: b.email || undefined,
          subject: `New booking request — ${b.serviceType} — ${b.name}`,
          text: lines.join("\n"),
        }),
      });
      if (r.ok) delivery = "emailed";
      else console.error("[booking] Resend returned", r.status, await r.text().catch(() => ""));
    } catch (err) {
      console.error("[booking] email send failed:", err);
    }
  }

  res.status(200).json({ ok: true, delivery } satisfies BookingResponse);
}
