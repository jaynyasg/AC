---
date: 2026-06-20
topic: di-felice-website-updates
---

# Di Felice's HVAC — Website Updates (Membership, Content & Reviews)

## Summary

Add a membership/plans page with Stripe-powered enroll buttons, and turn four content surfaces — before/after gallery, customer testimonials, a trusted-partner directory, and warranty information — into typed, data-driven sections that John fills with real content over time. Every external dependency (Stripe keys, photos, testimonials, partners, the Google-review link, the booking email key) is wired now behind a graceful fallback so each goes live by adding a value, not by rebuilding.

---

## Problem Frame

The site is live and the marketing pages render, but it does not yet do the commercial and trust-building jobs John (the owner) needs. He cannot enroll members or collect recurring maintenance revenue; there is no way to showcase real completed work; warranty value he provides is invisible; satisfied customers aren't funneled to Google reviews; and there is no public way to connect his customers with the trusted non-AC home-service pros he knows. These requests arrived as a batch of texts from John to the developer.

Several of these map onto existing honest empty-state stubs (`src/pages/Gallery.tsx`, `src/pages/Referrals.tsx`) and the existing booking seam (`api/booking.ts`), so the work is mostly *wiring data and a payment path*, not building from zero. Much of the real content (photos, testimonials, partner list, payment account/keys) doesn't exist yet, so the brief is explicitly "wire it up for now" — structure it so John can drop content in later with no code change.

---

## Actors

- A1. Homeowner / customer: browses plans, enrolls in a membership, books service, leaves a Google review, finds trusted partners.
- A2. John (owner): supplies real content (photos, testimonials, partners, prices) and receives booking + enrollment notifications.
- A3. Prospective partner pro: a trusted non-AC home-services provider listed in (or reaching out to join) the network.
- A4. CSR chatbot: answers membership and warranty questions from the knowledge base and shares the review link.
- A5. External services: Stripe (payments), Google (reviews), Resend (booking email).

---

## Key Flows

- F1. Membership enrollment
  - **Trigger:** Customer clicks an enroll button on the plans page.
  - **Actors:** A1, A5 (Stripe), A2 (notified).
  - **Steps:** Choose a plan → button calls the checkout seam → if Stripe configured, redirect to Stripe-hosted Checkout (subscription for recurring, one-time for the tune-up) → on success return to a confirmation state. If Stripe not configured, the button routes to a call/email-to-enroll path instead.
  - **Outcome:** Customer is enrolled (Stripe records the subscription) or routed to contact John; John is notified of a new enrollment via the webhook when configured.
  - **Covered by:** R3, R4, R5, R6, R18, R19.

- F2. Review follow-up
  - **Trigger:** Customer completes a booking, or expresses satisfaction to the chatbot.
  - **Actors:** A1, A4, A6 (Google).
  - **Steps:** After booking confirmation (and via testimonials page / footer / chatbot), a "Leave a Google review" CTA points to the configured Google review link.
  - **Outcome:** Customer is directed to leave a Google rating + comment.
  - **Covered by:** R13, R14.

---

## Requirements

**Booking routing**
- R1. Booking requests are delivered to difeliceshvac@gmail.com. (Destination is already correct via `COMPANY.email` / `BOOKING_TO_EMAIL` in `api/booking.ts` — verified, not a code change.)
- R2. Email delivery activates when a Resend key is configured; with no key, booking still succeeds, is logged server-side, and the UI shows call/email fallbacks. (Structural — preserve existing behavior.)

**Membership / plans**
- R3. A plans/membership page presents three options: a one-time **Tune-Up** ($89.95), a **Seasonal** bi-annual plan ($159.95/yr, includes priority scheduling), and a **Comfort** membership ($24.95/mo: 2 visits/yr + priority scheduling + 20% off repairs).
- R4. Each plan has an enroll button that initiates payment via Stripe Checkout — subscription mode for recurring plans, one-time mode for the tune-up.
- R5. When Stripe is not yet configured (no keys / price IDs), enroll buttons fall back gracefully to a call/email-to-enroll path — never a dead or erroring button.
- R6. Plan definitions (name, price, billing interval, features, Stripe price-id mapping) live in a single source of truth so price/label changes are one-line edits.
- R7. Membership plan facts (names, prices, benefits) are added to the chatbot knowledge base so the bot can answer membership questions accurately, within existing lane/guard rules.

**Before/after gallery**
- R8. The gallery renders real before/after entries from a typed data file; each entry pairs before and after images with a short description framed around longevity / quality-of-life.
- R9. When no entries exist, the page shows an honest "coming soon" empty-state with no fabricated or mislabeled work. (Preserve current behavior.)

**Warranties**
- R10. Warranty information is presented to homeowners: manufacturer parts warranty plus a company-provided 2-year labor warranty on new installs, and brand-dependent parts warranties up to ~10 years that John registers on the homeowner's behalf.
- R11. Warranty facts are added to the chatbot knowledge base so the bot can answer warranty questions.

**Testimonials & reviews**
- R12. A dedicated testimonials page shows curated, real testimonials from a typed data file, with an honest empty-state until provided.
- R13. A "Leave a Google review" call-to-action appears in key spots (post-booking confirmation, testimonials page, footer) using a single configurable Google-review link.
- R14. The chatbot can share the Google-review link when a customer expresses satisfaction or asks how to leave a review.
- R15. The existing "reviews coming" block on the gallery page is retired once the testimonials page exists, to avoid duplication.

**Networking / trusted partners**
- R16. The networking page presents a directory of trusted non-AC home-service partners grouped by category (realtors, plumbing, electrical, foundation, remodeling, landscaping, etc.) from a typed data file.
- R17. When no partners are listed, the page shows an honest empty-state inviting customers to ask for a recommendation; the private referral reward is never stated publicly. (Boundary — unchanged.)

**Subscription tracking & fulfillment**
- R18. No membership state is stored on the site; **Stripe is the system of record** for subscriptions (active/canceled/past-due status, renewals, failed payments). John views the live member roster via the Stripe Dashboard. (Structural.)
- R19. A signature-verified Stripe webhook endpoint notifies John (email) of new enrollments, cancellations, and failed payments. With no webhook secret configured it is inert and Stripe remains the source of truth. (Env-gated, graceful — same pattern as the other seams.)
- R20. Member benefits (priority scheduling, 20% off repairs) are verified against Stripe and applied operationally by John at service time; the site has no accounts/login and does not auto-apply benefits online.
- R21. (Optional) A "Manage my membership" link opens Stripe's hosted Customer Portal for self-service (update card, cancel, view invoices); shown only when configured.

### Membership tiers (comparative)

| Plan | Price | Visits/yr | Priority scheduling | Repair discount | Stripe mode |
|---|---|---|---|---|---|
| Tune-Up | $89.95 one-time | 1 (one tune-up) | — | — | one-time |
| Seasonal | $159.95 / year | 2 | ✓ | — | subscription (yearly) |
| Comfort | $24.95 / month | 2 | ✓ | 20% off repairs | subscription (monthly) |

---

## Acceptance Examples

- AE1. **Covers R5.** Given Stripe is not configured, when a visitor clicks an enroll button, then they are routed to a call/email-to-enroll path — not an error.
- AE2. **Covers R4, R6.** Given Stripe is configured with price IDs, when a visitor clicks the Comfort plan, then a Stripe Checkout subscription session opens for the configured monthly price.
- AE3. **Covers R8, R9.** Given no before/after entries exist, when a visitor opens the gallery, then an honest "coming soon" state shows with no placeholder image captioned as a real job.
- AE4. **Covers R1, R2.** Given a Resend key is set, when a booking is submitted, then an email is delivered to difeliceshvac@gmail.com; given no key, the booking is still accepted and logged.
- AE5. **Covers R12, R13.** Given no testimonials in the data file, when a visitor opens the testimonials page, then an honest empty-state with a "share your experience" + "Leave a Google review" CTA shows.
- AE6. **Covers R18, R19.** Given the Stripe webhook is configured, when a customer completes enrollment, then John receives an email naming the new member and plan and the subscription is recorded in Stripe; given no webhook secret, enrollment still succeeds and Stripe still records it.

---

## Success Criteria

- John can enroll paying members, showcase real work, collect reviews, and cross-refer partners — each capability going live by dropping in content/keys, with no further code changes.
- All existing boundaries hold: no fabricated social proof, the referral reward stays private, the bot stays in its lane, and every external seam fails gracefully.
- `npm run verify` stays green; the live `/api/chat`, `/api/booking`, and new `/api/checkout` seams behave correctly with and without their respective keys.
- `ce-plan` can implement without inventing product behavior — every TBD is an explicit dependency with a defined fallback.

---

## Scope Boundaries

- Automated timed post-job review/drip emails (needs job tracking / scheduling) — deferred; the review nudge is CTA/link-based for now.
- On-site comment/review submission, storage, and moderation — rejected (preserves the no-database design).
- Auto-embedded live Google reviews widget — rejected (chose curated + funnel).
- *Custom* member login / subscription-management UI on the site — out; Stripe's hosted checkout and (optional) Customer Portal handle billing and self-service.
- Custom subscription lifecycle logic (cancellations, dunning, proration) — out; Stripe owns it, and our webhook only notifies John.
- Online, automated verification of membership status during booking/repair (e.g., auto-applying the 20% discount on the site) — deferred; perks are applied operationally for now.
- Producing the real content itself (photos, testimonials, partner list, final prices) — supplied by John, not built here.

---

## Key Decisions

- **Payments via Stripe Checkout, env-gated with graceful fallback** (mirrors `api/booking.ts`): standard recurring + one-time billing, funds settle to John's bank, no PCI burden on the site, and buttons stay alive (call/email) before keys exist.
- **Keep the no-database design**; all new content lives in typed data files. Preserves the stateless architecture, needs zero new infra, keeps honest empty-states, and makes content updates one-line edits.
- **Stripe is the system of record for memberships** (no local subscriptions table). Stripe tracks status/renewals/dunning automatically; John sees the roster + MRR in the Stripe Dashboard. A webhook emails him on enrollment/cancellation/failure for awareness, and perks are verified against Stripe and applied operationally. A custom mirror would just create a second, stale source of truth. The boundary: on-site member accounts or automated online benefit application is the point at which a datastore would become warranted — out of scope for now.
- **Curated testimonials + Google-review funnel** (no on-site submission): honors the no-fabrication rule and avoids a datastore, moderation, and spam.
- **Membership + warranty facts added to the chatbot knowledge base**: lets the bot answer accurately; a deliberate, controlled extension of today's "$125 is the only hard fact it quotes" rule.
- **Monthly membership confirmed at $24.95** before charging real cards.

---

## Dependencies / Assumptions

- **Stripe**: account + secret key + a price ID per plan (John's "incoming receiving business account"), plus a webhook signing secret for the enrollment-notification endpoint — provided later.
- **Resend**: API key (and optional `BOOKING_TO_EMAIL`) set in Vercel for booking emails to actually send to difeliceshvac@gmail.com.
- **Content from John**: real before/after photos + per-job descriptions; real testimonials (with permission to publish); the trusted-partner list (name, category, contact); the Google Business review link.
- **Assumption**: the $89.95 tune-up is a one-time purchase; the $159.95 Seasonal plan is billed annually.
- **Assumption**: warranty terms as stated in John's texts are accurate and publishable.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R4][Technical] Exact Stripe mode per plan and the success/cancel return-URL behavior — settle during planning.
- [Affects R7, R11][Technical] How membership/warranty facts integrate with the response guard so the bot quotes only knowledge-base-sourced prices/terms.
- [Affects R13][Needs research] The most effective placements/timing for the Google-review CTA that convert without nagging.
- [Affects R3][User decision — confirmed] Final monthly price is $24.95.
