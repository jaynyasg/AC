---
title: "feat: Membership, content pages & review funnel for Di Felice's HVAC"
type: feat
status: completed
date: 2026-06-20
deepened: 2026-06-20
origin: docs/brainstorms/di-felice-website-updates-requirements.md
---

# feat: Membership, content pages & review funnel for Di Felice's HVAC

## Summary

Implement the seven website updates from the origin brainstorm by extending the existing seams: two new env-gated serverless functions (`api/checkout.ts`, `api/stripe-webhook.ts`) that mirror `api/booking.ts`'s graceful-fallback pattern, a new membership page and testimonials page, data-driven evolutions of the existing Gallery and Referrals stubs, a warranties section, and membership/warranty facts added to the chatbot's knowledge base. All new content lives in typed files; payments ride Stripe with Stripe as the system of record. Nothing errors before the owner supplies credentials/content.

---

## Problem Frame

The site is live but does not yet enroll members, showcase work, surface warranties, funnel reviews, or connect customers to trusted partners (see origin: `docs/brainstorms/di-felice-website-updates-requirements.md`). Most asks map onto existing honest empty-state stubs and the existing booking seam, so this is mostly data-wiring plus one genuinely new capability (Stripe payments). Much of the real content (photos, testimonials, partners, Stripe account/prices) does not exist yet, so everything is wired to activate when the owner adds it — no rebuild.

---

## Requirements

**Booking**
- R1. Booking requests are delivered to difeliceshvac@gmail.com (already routed; verify + document the Resend key that activates email).
- R2. With no Resend key, booking still succeeds, logs server-side, and shows call/email fallbacks (preserve).

**Membership**
- R3. Membership page presents three options: Tune-Up ($89.95 one-time), Seasonal ($159.95/yr + priority scheduling), Comfort ($19.95/mo: 2 visits/yr + priority + 20% off repairs).
- R4. Each plan's enroll button initiates Stripe Checkout — subscription mode for recurring, payment mode for the one-time tune-up.
- R5. With Stripe unconfigured, enroll buttons fall back to a call/email-to-enroll path — never a dead/erroring button.
- R6. Plan definitions (name, price, interval, features, plan key) are single-source-of-truth; price/label changes are one-line edits.
- R7. Membership facts are added to the chatbot KB so it can answer membership questions accurately.

**Subscription tracking & fulfillment**
- R18. No membership state stored on the site; Stripe is the system of record (structural).
- R19. A signature-verified Stripe webhook notifies the owner (email) of enrollments, cancellations, and failed payments; inert when unconfigured.
- R20. Member benefits are verified against Stripe and applied operationally; no on-site accounts/login.
- R21. (Optional) A "Manage my membership" link opens Stripe's hosted Customer Portal; shown only when configured.

**Gallery / Testimonials / Reviews**
- R8. Gallery renders real before/after entries from a typed data file with longevity/quality-of-life descriptions.
- R9. Gallery shows an honest "coming soon" empty-state when no entries exist (preserve).
- R12. A testimonials page shows curated real testimonials from a typed data file, honest empty-state until provided.
- R13. A "Leave a Google review" CTA appears in key spots (post-booking, testimonials page, footer) from one configurable link.
- R14. The chatbot can share the Google-review link when a customer is satisfied or asks how to review.
- R15. The Gallery "reviews coming" block is retired once the testimonials page exists.

**Warranties**
- R10. Warranty info is presented: manufacturer parts warranty + 2-yr company labor warranty on new installs; brand-dependent parts warranties up to ~10 yrs registered for the homeowner.
- R11. Warranty facts are added to the chatbot KB.

**Networking**
- R16. Networking page presents a trusted non-AC partner directory grouped by category from a typed data file.
- R17. Honest empty-state when no partners listed; the private referral reward is never stated publicly (boundary).

**Origin actors:** A1 Homeowner/customer, A2 John (owner), A3 Partner pro, A4 CSR chatbot, A5 External services (Stripe/Google/Resend).
**Origin flows:** F1 Membership enrollment, F2 Review follow-up.
**Origin acceptance examples:** AE1 (covers R5), AE2 (covers R4/R6), AE3 (covers R8/R9), AE4 (covers R1/R2), AE5 (covers R12/R13), AE6 (covers R18/R19).

---

## Scope Boundaries

- No database, no app-side membership/roster table, no entitlement gating — Stripe Dashboard is the roster.
- No custom member login or subscription-management UI — Stripe hosted checkout + (optional) hosted Customer Portal login link only.
- No real webhook idempotency store — the only side effect is a notification email; a rare duplicate is tolerated (accepted boundary).
- No fabricated testimonials/photos/partners — honest empty-states until the owner provides real content.
- The referral reward figure stays off the site and out of the bot (unchanged hard boundary).

### Deferred to Follow-Up Work

- Automated timed post-job review/drip emails (needs job tracking) — separate future iteration.
- Online automated membership-status verification / benefit application — future, only if the business needs it (forces a datastore).
- `/api/portal` email-lookup endpoint — only if the owner later wants portal access embedded vs. the no-code login link.

---

## Context & Research

### Relevant Code and Patterns

- `api/booking.ts` — canonical env-gated-external-call-with-graceful-fallback handler: method guard → `parse(Schema, req.body)` → `console.log` durable record → attempt external call only when env key present → always return 200 with a delivery flag. **Mirror exactly** for `api/checkout.ts`.
- `shared/contract.ts` — `parse(schema, data)` returns a discriminated union: `{ ok: true, value }` | `{ ok: false, fields }`. Schemas are flat `z.object`; `LIMITS` holds shared char caps; `ApiError = { error, fields? }`.
- `shared/knowledge.ts` — `COMPANY` flat `as const` + typed-list exports (`MAINTENANCE`, `FAQ_TIPS`, `TRIAGE_QUESTIONS`, `SERVICES`, `FORBIDDEN_DISCLOSURES`, `REFERRAL_SAFE_LINE`). New facts follow the `MAINTENANCE` shape so pages `.map()` over them.
- `shared/system-prompt.ts` — `buildSystemPrompt()` is a pure, date-free function of constants (cache-stable); `test/system-prompt.test.ts` asserts required facts present and no date strings.
- `shared/guard.ts` — `guardReply()`: empty → fallback; `FORBIDDEN_DISCLOSURES` match → `REFERRAL_SAFE_LINE`; over-length → truncate. **Watch:** the `bonus|gift|reward|commission` + number/%/$ pattern can false-positive on membership wording.
- `src/components/Bits.tsx` — reuse `Section({wash})`, `Eyebrow`, `SectionHeading({title,lead})`, `Card`, `CheckList({items})`, `Cta({to|href,variant})` (`to`=internal route, `href`=external/tel/mailto/Stripe redirect).
- `src/components/BookingForm.tsx` — status machine (`idle|submitting|success|error`) with client-side `parse` + `fetch("/api/booking")`; the `success` block is where the Google-review CTA attaches; mirror the fetch+status pattern for the Membership enroll button.
- `src/components/Header.tsx` (`NAV` array, rendered twice) + `src/components/Footer.tsx` (manual Explore list + Contact column) — where new routes/CTAs register. `src/App.tsx` routes nest under `Layout` (auto-gets Header/Footer/ChatWidget). `vercel.json` already excludes `/api/` — new functions need no config.
- Test harness: `test/api.test.ts` imports handlers directly (no `.js`), `vi.stubEnv(KEY,"")` to force fallback, hand-rolled `mockRes()`/`req()`. `eval/cases.ts` + `eval/record.ts` + `eval/gate.test.ts` (snapshotless cases are skipped, not failed). `CLAIMS.md` tracks the claim→test count.
- **ESM `.js` extension rule (load-bearing, commit `97f1e4d`):** relative imports in `api/*` and `shared/*` MUST use `.js`; `src/*` imports of shared do NOT (Vite resolves them). New `api/` + `shared/` files must follow this.

### Institutional Learnings

- No `docs/solutions/` exists yet (young repo). Prior art is the code seams above. Recommend running `/ce-compound` after this lands to capture: the env-gated-fallback seam, the Vercel ESM `.js` rule, and any Stripe webhook raw-body gotchas.

### External References

- Stripe Checkout Sessions (`stripe.checkout.sessions.create`): `mode:'payment'` requires a one-time price; `mode:'subscription'` requires a recurring price — mode follows the price type; one button = one session.
- Pre-created Price IDs in env vars (not inline `price_data`) so the owner changes prices via Dashboard + one-click redeploy, no code edit.
- Webhook raw body on bare `@vercel/node`: `export const config = {api:{bodyParser:false}}` is **Next.js-only and does nothing here**. Read the raw stream (`for await (const chunk of req)`) into a Buffer; never touch `req.body` on the webhook route. Verify signature with `stripe.webhooks.constructEvent(buf, sig, secret)`; 400 on failure.
- `stripe` Node SDK `^22.2.2` in `dependencies`; default import; omit `apiVersion` (release-pinned); instantiate at module scope; built-in types (do not add `@types/stripe`). `import Stripe from "stripe"` is a bare specifier — no `.js`.
- Customer Portal: use Stripe's no-code hosted **login_page** link (one URL, no customer-ID storage) for self-service; defer a custom `/api/portal`.
- Google review deep link: `https://search.google.com/local/writereview?placeid=<PLACE_ID>`; treat as config, don't render CTA until set.

---

## Key Technical Decisions

- **Mirror `api/booking.ts` for both new functions.** Same validate→log→attempt→graceful-200 skeleton and env-gating idiom (`process.env.X ?? fallback`). Checkout failure degrades to the call/email fallback (200), not a 500 — house style of "never a dead end."
- **Client sends a plan KEY only; server maps key → env Price ID.** Never accept a price/amount/Price-ID from the client (price-tampering vector). Display prices come from `MEMBERSHIP_PLANS` in `shared/knowledge.ts`; the owner keeps the displayed amount in sync with the Stripe Price (accepted manual boundary).
- **Bot quotes plan prices (confirmed call-out).** Add membership + warranty facts to `shared/knowledge.ts` AND surface them in `buildSystemPrompt()`, revising the "$125 is the only firm price" line to include membership prices. Requires a guard test (no false-positive redaction) and a one-time `npm run eval:record` for new cases. Bot KB extends to membership + warranty only — not partners/testimonials.
- **Content data split.** Bot-relevant facts (membership, warranty) → `shared/knowledge.ts`. Site-only content (before/after, testimonials, partners) → typed files under `src/data/` (not bundled into the bot). Configurable links (Google review, manage-membership) → a `LINKS` constant in `shared/knowledge.ts`, default `""`, CTA rendered only when set.
- **Webhook is its own shape.** Raw-body + signature verify; cannot reuse the `parse(Schema, req.body)` seam. Three events only (`checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`) → format + send owner email via the existing Resend `fetch` block. No DB, no idempotency store, no queue.
- **Stripe is the system of record.** Owner reads the roster in the Stripe Dashboard; webhook emails give real-time awareness; perks fulfilled operationally. Boundary: on-site gating/accounts would force a datastore (deferred).

---

## Open Questions

### Resolved During Planning

- Bot price-quoting vs. page-link-only: resolved to quote prices (user-confirmed) with guard test + eval re-record.
- Tier billing shapes: Tune-Up = one-time (`payment`); Seasonal = yearly subscription; Comfort = monthly subscription.
- Warranties placement: a section on the Services page + KB facts (matches origin lean), optionally a FAQ tip.
- Self-service: Stripe hosted Customer Portal login link (config-gated), not a custom endpoint.
- Stripe return states: `/membership?status=success|cancel` confirmation/encouragement states are specified in U5 (no longer deferred).
- Membership identity: `customer_email` is required at checkout so the success page and webhook can name the enrollee (U2/U3/U4, AE6).
- Header nav: Membership goes in the header, Testimonials in the footer (U5).
- Maintenance overlap: reconcile the existing bi-yearly-program KB copy with the new tiers (U1/U10); **product question for John** — does the Seasonal tier equal the existing bi-yearly program (default assumption: yes)?

### Deferred to Implementation

- Whether `config = {api:{bodyParser:false}}` has any effect on the installed `@vercel/node` runtime — the stream-read approach works regardless; confirm with the Stripe CLI during impl.
- Exact membership/warranty prose wording (must pass the guard regex) — finalize against `FORBIDDEN_DISCLOSURES` during impl.

---

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
ENROLLMENT (F1)
  Membership page button (plan key) ──POST /api/checkout──> map key→env Price ID
        │                                                         │
        │                          STRIPE_SECRET_KEY set? ──no──> 200 {available:false, fallback:{phone,email}}
        │                                   │ yes                         │
        │                    stripe.checkout.sessions.create(mode, price) │
        │                                   │                             ▼
        └──────── 200 {url} ──> window.location = url            button shows "Call/email to enroll"
                                      │
                              Stripe-hosted Checkout ──(payment)──> success_url

REVENUE EVENTS → AWARENESS (F1 cont.)
  Stripe ──event──> POST /api/stripe-webhook ──read RAW stream──> constructEvent(buf,sig,secret)
        bad sig → 400 ;  no secret configured → 200 inert
        valid → checkout.session.completed | subscription.deleted | invoice.payment_failed
              → format + Resend email to owner → 200

REVIEW FUNNEL (F2)
  Booking success / Testimonials page / Footer / Bot ──> LINKS.googleReview (rendered only when set)
```

---

## Implementation Units

### U1. Membership, warranty & link facts in the knowledge base

**Goal:** Single source of truth for the three plans, warranty terms, and configurable links.

**Requirements:** R3, R6, R7, R10, R11, R13, R21

**Dependencies:** None

**Files:**
- Modify: `shared/knowledge.ts`
- Modify: `test/knowledge.test.ts`

**Approach:**
- Add `MEMBERSHIP_PLANS` as a typed `as const` array: `{ key: "tuneup"|"seasonal"|"comfort", name, price (display string), cadence ("one-time"|"year"|"month"), features: string[] }`. Plan keys are the contract between client and `/api/checkout`.
- Add `WARRANTIES` (typed list of prose facts) mirroring `MAINTENANCE`.
- Add `LINKS = { googleReview: "", manageMembership: "" } as const` (empty until owner provides; CTAs render only when non-empty).
- Word features/warranty prose to avoid the guard trigger near numbers: do not place `bonus`/`gift`/`reward`/`commission` within ~60 chars of a `%`/`$`/number (use "discount", "included", "save", "off"). Note the *referral* regex (`referr*` within ~80 chars of a number) is a separate collision risk handled in U10's cross-topic guard test.
- Reconcile existing maintenance KB content with the new plans: `SERVICES.maintenance` and `MAINTENANCE.memberBenefits` already describe a "bi-yearly maintenance program" that overlaps the Seasonal/Comfort tiers. Update/retire that copy so the bot does not present two conflicting maintenance offerings (decision: does the Seasonal tier *equal* the existing bi-yearly program, or is it new? — surface to John; default assumption: Seasonal = the existing bi-yearly program, now named/priced).

**Patterns to follow:** `MAINTENANCE`/`SERVICES` `as const` exports in `shared/knowledge.ts`.

**Test scenarios:**
- Happy path: `MEMBERSHIP_PLANS` has exactly 3 plans with keys `tuneup|seasonal|comfort` and the correct display prices ($89.95 / $159.95 / $19.95).
- Edge case: `LINKS.googleReview`/`manageMembership` default to `""`.
- Error path (guard safety): assert every `MEMBERSHIP_PLANS` feature string and every `WARRANTIES` string is NOT matched by any `FORBIDDEN_DISCLOSURES` regex.

**Verification:** Plans/warranties/links importable and typed; knowledge tests green.

---

### U2. Checkout request/response contract

**Goal:** Typed, validated boundary for `/api/checkout`.

**Requirements:** R4, R5

**Dependencies:** None

**Files:**
- Modify: `shared/contract.ts`
- Modify: `test/contract.test.ts`

**Approach:**
- Add `CheckoutRequest` = `z.object({ plan: z.enum(["tuneup","seasonal","comfort"]), email: optional-or-empty })`.
- Add `CheckoutResponse` type covering both branches: live `{ ok: true, url: string }` and graceful `{ ok: true, available: false, fallback: { phone, email } }`. Consider `z.discriminatedUnion` (first DU in the contract — note as a new but acceptable pattern) or a flat optional-fields object; keep it minimal.
- Export inferred types via `z.infer`.

**Patterns to follow:** `BookingRequest`/`BookingResponse` in `shared/contract.ts`; reuse the `parse()` helper.

**Test scenarios:**
- Happy path: valid `{plan:"comfort"}` parses; `value.plan === "comfort"`.
- Edge case: missing `email` is allowed; empty-string `email` allowed.
- Error path: `{plan:"gold"}` (not in enum) → `parse` returns `{ok:false}` with a `plan` field error.

**Verification:** Contract tests green; types usable by `api/checkout.ts` and the Membership page.

---

### U3. `api/checkout.ts` — Stripe Checkout session with graceful fallback

**Goal:** Create a Checkout Session per plan; degrade to call/email when Stripe is unconfigured.

**Requirements:** R4, R5, R6

**Dependencies:** U1, U2

**Files:**
- Create: `api/checkout.ts`
- Create: `test/checkout.test.ts`
- Modify: `package.json` (add `"stripe": "^22.2.2"` to `dependencies`)
- Modify: `.env.example` (add `STRIPE_SECRET_KEY`, `STRIPE_PRICE_TUNEUP`, `STRIPE_PRICE_SEASONAL`, `STRIPE_PRICE_COMFORT`, optional `PUBLIC_BASE_URL`, with "OPTIONAL — graceful fallback" comments). Env var suffix matches the plan key (`tuneup`/`seasonal`/`comfort`), not the billing cadence.

**Approach:**
- Mirror `api/booking.ts`: POST-only (405 otherwise); `parse(CheckoutRequest, req.body)` (400 on failure). Add an Origin/Referer check (must match the known host) and rely on the JSON `parse` to reject cross-site form posts — `/api/checkout` is unauthenticated, so a CSRF/origin guard prevents third-party pages from minting sessions / pre-filling a victim `customer_email`.
- If `STRIPE_SECRET_KEY` (or the plan's Price-ID env var) is absent → return 200 `{ ok:true, available:false, fallback:{ phone: COMPANY.phone, email: COMPANY.email } }`. Per-plan degrade if just one Price ID is missing — and `console.log` which plan Price IDs resolved vs degraded so a partial misconfig (e.g., owner sets two of three) is visible in Vercel logs rather than silently routing one tier to call/email.
- Else: instantiate `Stripe` at module scope; map `plan` → env Price ID; `mode` = `payment` for `tuneup`, `subscription` for `seasonal`/`comfort`; set `success_url`/`cancel_url`, `metadata:{plan}`, and **require `customer_email`** (see U2) so the success page and the webhook owner-notification can identify the enrollee; return `{ ok:true, url: session.url }`.
- **success_url/cancel_url host safety:** build the base URL from `PUBLIC_BASE_URL` first; only fall back to `req.headers.host` when it matches an allowlist (production domain + `*.vercel.app`), else use the fallback 200. `req.headers.host` is attacker-controllable → an unsanitized Host poisons the post-payment redirect (open-redirect/phishing). Document `PUBLIC_BASE_URL` as recommended-in-prod (effectively required once Stripe is live).
- Wrap the Stripe call in try/catch; on error, `console.error(err.type, err.message)` (so a mode↔price-type mismatch — e.g., a recurring Price placed in `STRIPE_PRICE_TUNEUP` — is diagnosable) then degrade to the fallback 200 (never 500). `console.log` a durable record first.
- Use `.js` extensions on relative imports.

**Patterns to follow:** `api/booking.ts` env-gating + try/catch + `satisfies` response typing.

**Test scenarios:**
- Covers AE1. Error/fallback: with `STRIPE_SECRET_KEY` stubbed empty, valid body → 200 `{available:false, fallback}` (no throw, no live call).
- Happy path (offline, mock Stripe): with a mocked `stripe.checkout.sessions.create` returning `{url}`, valid `comfort` body → 200 `{url}`; assert mode/price mapping passed correctly.
- Edge case: GET → 405; malformed body → 400 with `fields`.
- Edge case: one Price-ID env missing → only that plan degrades.

**Verification:** Offline tests green without any real Stripe key; handler never 500s on a valid request.

---

### U4. `api/stripe-webhook.ts` — signature-verified owner notifications

**Goal:** Notify the owner by email on enrollment / cancellation / payment failure; inert when unconfigured.

**Requirements:** R18, R19

**Dependencies:** None (reuses Resend pattern + `COMPANY`)

**Files:**
- Create: `api/stripe-webhook.ts`
- Create: `test/stripe-webhook.test.ts`
- Modify: `.env.example` (add `STRIPE_WEBHOOK_SECRET`)

**Approach:**
- POST-only. Read the **raw request stream** into a Buffer (`for await (const chunk of req)`); never access `req.body`.
- If `STRIPE_WEBHOOK_SECRET` absent → 200 inert (log a clear "signature verification disabled" warning + return). Operational rule (Docs): set the secret in Vercel *before* registering the endpoint in the Stripe Dashboard, so there is no window where forged events are accepted inert.
- Else verify with `stripe.webhooks.constructEvent(buf, sig, secret)`; on `StripeSignatureVerificationError` → 400.
- Switch on `event.type`; build a notification and send via the existing Resend `fetch` block (recipient `process.env.BOOKING_TO_EMAIL ?? COMPANY.email`); ignore other event types with 200.
- **Notification identity & PII scoping:** include only `metadata.plan`, `amount_total`, and `customer_email`/`customer_details.name` from the event — never serialize the full event object (data minimization; recipient is a personal Gmail). This is what makes AE6 ("name the new member") satisfiable, which is why U2/U3 require email.
- **Resend coupling:** send fire-and-forget — a failed/slow Resend must NOT turn the response non-2xx, or Stripe re-delivers the event for up to 3 days, email-storming the owner. Return 2xx as soon as the event is verified; a failed email means a missed notification (Stripe Dashboard remains source of truth), which is the intended trade.
- Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`. Note `payment_failed` fires on *every* Smart-Retry attempt with no "recovered" counterpart — document that these emails are noisy/duplicated and John confirms current status in the Dashboard before applying perks (R20). (Adding `customer.subscription.updated` for authoritative status transitions is a deferred option.)
- No idempotency store (accepted boundary — only side effect is an email; dedupe on `event.id` is unnecessary and an in-memory set won't survive cold starts). `.js` extensions on relative imports.

**Execution note:** The offline gate cannot exercise the real raw-body/signature path, so confirming it is a **hard going-live checklist gate** (not just a nice-to-have): `stripe listen --forward-to .../api/stripe-webhook` + `stripe trigger checkout.session.completed` against a deploy, before announcing memberships live. Reason: if the runtime pre-parses/consumes `req`, the stream read yields an empty Buffer and every real event 400s — John gets zero notifications while `verify` stays green.

**Patterns to follow:** Resend `fetch` block in `api/booking.ts`; env-gating idiom.

**Test scenarios:**
- Edge case: GET → 405.
- Happy path (offline-testable, the highest-value coverage): feed a mock async-iterable `req` yielding raw chunks to the stream reader and assert the assembled Buffer equals the concatenated bytes. **Note:** the existing plain-object `req()` double in `test/api.test.ts` is NOT async-iterable — `for await (const chunk of req)` throws on it; the webhook tests need an async-generator / `Readable.from([buf])` double instead.
- Error path: `STRIPE_WEBHOOK_SECRET` set but bad/missing signature → 400 (mock `constructEvent` to throw; the inert-secret-unset path must return 200 before any stream read).
- Covers AE6. Happy path: secret unset → 200 inert (no email attempted); secret set + mocked valid `checkout.session.completed` → notification built from `metadata.plan` + `customer_email`/name only (mock Resend, assert recipient + subject + that the full event object is NOT serialized).
- Edge case: an unhandled event type → 200, no email.

**Verification:** Offline tests green by mocking `constructEvent`/Resend; no live Stripe signature needed in the gate.

---

### U5. Membership page + enroll flow + nav

**Goal:** Present the three plans and wire enroll buttons to checkout with graceful fallback.

**Requirements:** R3, R4, R5, R21

**Dependencies:** U1, U3

**Files:**
- Create: `src/pages/Membership.tsx`
- Modify: `src/App.tsx` (add `membership` route under Layout)
- Modify: `src/components/Header.tsx` (add to `NAV`)
- Modify: `src/components/Footer.tsx` (add Explore link; "Manage my membership" link when `LINKS.manageMembership` set)

**Approach:**
- Render three `Card`s from `MEMBERSHIP_PLANS` using `Section/Eyebrow/SectionHeading/CheckList/Cta` and the brand tokens; mark Comfort as the highlighted/most-popular tier.
- Each enroll button runs a small state machine mirroring `BookingForm.tsx`'s `Status` (`idle | requesting | redirecting | fallback`): on click → disable the button and show "Opening checkout…" while `fetch("/api/checkout", {plan})` is in flight (prevents double-submit / duplicate sessions); on `{url}` → `window.location.href = url`; on `{available:false}` (or error) → swap to a call/email affordance (tel/mailto), mirroring the BookingForm error block. Extract the response→intent logic into a tiny pure helper (`{url}` → redirect intent; `{available:false}` → fallback intent) and unit-test it offline (closes the AE1 client-side gap without a browser).
- Card layout: all three tier cards keep equal height with the CTA pinned to the bottom (flex-col), so a per-plan fallback (one tier's Price ID missing) swaps the button in-place without shifting the grid. Comfort is the highlighted/most-popular tier.
- **Stripe return states (resolved, not deferred):** Stripe always redirects to one of the two URLs, so handle both. `success_url = /membership?status=success` → confirmation banner ("You're enrolled — welcome! John will confirm your first visit.") + Google-review CTA when set; `cancel_url = /membership?status=cancel` → soft encouragement + the call/email fallback. Read via `URLSearchParams` in a `useEffect`; collapse on navigation.
- "Manage my membership" link rendered only when `LINKS.manageMembership` is non-empty.
- **Nav decision:** to avoid overflowing the desktop header at 7 links, add **Membership** to the header `NAV` (commercial priority) and put **Testimonials** in the Footer Explore list (+ the mobile drawer carries all). Keeps the `lg` header from compressing to illegible widths.

**Patterns to follow:** `src/components/BookingForm.tsx` fetch+status machine; `src/pages/Maintenance.tsx` for typed-list rendering; `src/pages/*` section composition.

**Test scenarios:**
- Test expectation: none for pure layout, BUT the enroll fetch/fallback branching is behavioral — if extracted into a small helper, unit-test: `{url}` response → returns redirect intent; `{available:false}` → returns fallback intent. Otherwise rely on `api/checkout` tests + manual browser verification.
- Covers AE2 (display side): the three plan prices shown match `MEMBERSHIP_PLANS`.

**Verification:** Page renders all three plans; buttons never error (redirect when live, call/email when not); route + nav present.

---

### U6. Before/after gallery — data-driven

**Goal:** Render real before/after entries; keep an honest empty-state.

**Requirements:** R8, R9

**Dependencies:** None

**Files:**
- Create: `src/data/gallery.ts` (typed `BeforeAfter[]`, empty array initially)
- Modify: `src/pages/Gallery.tsx`

**Approach:**
- Define `BeforeAfter = { beforeImg, afterImg, beforeAlt, afterAlt, title, description }` — the `beforeAlt`/`afterAlt` fields are required because before/after AC-unit photos look similar and need meaningful alt text (WCAG 1.1.1). When the array is empty, keep the current honest "coming soon" state + ambient mood imagery (clearly labeled, not captioned as real jobs). When populated, render each entry as a `Card` with the two images side-by-side (stacked on mobile), each tagged with a small "Before"/"After" pill, followed by title + longevity/quality-of-life description. The owner-instruction comment must require alt text per entry.
- Leave a comment block instructing where the owner drops photos (`public/assets/work/`) and adds entries.

**Patterns to follow:** existing `Gallery.tsx` empty-state + `MOOD` handling; `Maintenance.tsx` `.map()` rendering.

**Test scenarios:**
- Covers AE3. Test expectation: none (presentational) — covered by manual verification; the empty-state honesty is a human-judged boundary. Optionally assert `src/data/gallery.ts` default export is an empty array typed as `BeforeAfter[]`.

**Verification:** Empty data → honest coming-soon; adding an entry → renders before/after with description; no fabricated captions.

---

### U7. Testimonials page + Google-review funnel

**Goal:** Curated testimonials page + review CTAs in the conversion spots.

**Requirements:** R12, R13, R14, R15

**Dependencies:** U1

**Files:**
- Create: `src/pages/Testimonials.tsx`
- Create: `src/data/testimonials.ts` (typed `Testimonial[]`, empty initially)
- Modify: `src/App.tsx` (route), `src/components/Header.tsx` (NAV), `src/components/Footer.tsx` (Contact-column Google-review link)
- Modify: `src/components/BookingForm.tsx` (add Google-review CTA in the success block)
- Modify: `src/pages/Gallery.tsx` (retire the "reviews coming" block — R15)

**Approach:**
- `Testimonial = { quote, name, location? }`. Empty → honest empty-state ("be the first to share") + Google-review CTA. Populated → testimonial cards.
- Google-review CTA (`Cta href={LINKS.googleReview}`) rendered when `LINKS.googleReview` is set; place on the testimonials page, footer, and BookingForm success block. When `LINKS.googleReview` is empty (initial deployed state), fall back to the existing `mailto:${COMPANY.email}?subject=My experience…` "Share your experience" CTA (mirroring current `Gallery.tsx`) so the path is never dead. (R14 bot link handled in U10.)
- Remove the duplicate reviews section from `Gallery.tsx`.

**Patterns to follow:** `Bits.tsx` `Card`/`Cta`; `Gallery.tsx` review-block markup (to relocate); `BookingForm.tsx` success block.

**Test scenarios:**
- Covers AE5. Test expectation: none (presentational); manual verification of empty-state + CTA presence. Optionally assert `testimonials.ts` defaults to `[]`.

**Verification:** Testimonials route + nav present; CTAs appear only when the review link is set; Gallery no longer duplicates reviews.

---

### U8. Trusted-partner directory

**Goal:** Evolve the networking page into a categorized partner directory; keep the reward private.

**Requirements:** R16, R17

**Dependencies:** None

**Files:**
- Create: `src/data/partners.ts` (typed `Partner[]`, empty initially)
- Modify: `src/pages/Referrals.tsx`

**Approach:**
- `Partner = { name, category, phone?, url?, blurb? }` with categories (realtor, plumbing, electrical, foundation, remodeling, landscaping, etc.). Empty → honest empty-state inviting customers to ask for a recommendation. Populated → grouped-by-category cards.
- Keep the existing "are you a pro?" outreach card and the referral card that defers reward details to the owner personally — do NOT state the reward (boundary).

**Patterns to follow:** existing `Referrals.tsx` cards; `Bits.tsx` `Card`.

**Test scenarios:**
- Test expectation: none (presentational); manual verification. Boundary: visually confirm no reward figure appears (human-judged, matches existing claim).

**Verification:** Directory renders grouped partners when present; honest empty-state otherwise; reward never stated.

---

### U9. Warranties section on Services

**Goal:** Surface warranty value to homeowners.

**Requirements:** R10

**Dependencies:** U1

**Files:**
- Modify: `src/pages/Services.tsx`
- Modify (optional): `src/pages/Faq.tsx` (add a warranty entry if `FAQ_TIPS`-driven)

**Approach:**
- Add a "Warranties" `Section` rendering `WARRANTIES` from the KB (manufacturer parts + 2-yr labor + up-to-10-yr registered). Use `CheckList`/`Card` + `Shield` icon.

**Patterns to follow:** `Services.tsx` section composition; `Maintenance.tsx` list rendering.

**Test scenarios:**
- Test expectation: none (presentational, content from KB which is tested in U1).

**Verification:** Warranties render on Services from KB single-source.

---

### U10. Teach the chatbot membership + warranty (prompt, guard, eval)

**Goal:** Bot answers membership/warranty questions accurately, including plan prices, within boundaries.

**Requirements:** R7, R11, R14

**Dependencies:** U1

**Files:**
- Modify: `shared/system-prompt.ts` (reference `MEMBERSHIP_PLANS` + `WARRANTIES`; revise the "$125 is the only firm price" line to include membership prices; add the Google-review link sharing instruction for R14)
- Modify: `test/system-prompt.test.ts` (assert new facts present; keep the no-date invariant)
- Modify: `test/guard.test.ts` (assert membership/warranty answers are not falsely redacted)
- Modify: `eval/cases.ts` (add golden cases: membership question → correct plan price; warranty question → correct terms; satisfied customer → shares review link; referral reward question → still deflects)
- Modify: `CLAIMS.md` (new claims/rows)

**Approach:**
- Keep `buildSystemPrompt()` pure/date-free (cache invariant) and **preserve the literal `$125` substring** (`test/system-prompt.test.ts` asserts `toContain("$125")` and no `20\d\d-\d\d-\d\d` date). Interpolate plan facts from constants, not hardcoded numbers.
- Revise the firm-price sentence to: "$125 diagnostic fee and the listed membership plan prices are firm; everything else needs a quote." Ensure the prompt presents **one** coherent maintenance offering — fold/replace the existing `SERVICES.maintenance` "bi-yearly program" copy so the bot doesn't describe it and the new tiers as two separate things (see U1 reconciliation).
- Re-record snapshots: `npm run eval:record` re-records **all** cases (re-bills every snapshot against the revised prompt); to record one new case use `npm run eval:record <case-id>`. Manual, not part of `verify`; cases without snapshots are skipped by the gate until recorded.

**Execution note:** After prompt/KB changes, run `npm run eval:record` then `npm run verify`.

**Patterns to follow:** `buildSystemPrompt()` interpolation; `eval/cases.ts` case shape; existing referral-disclosure guard test.

**Test scenarios:**
- Happy path: system prompt contains a membership price and a warranty term, still contains the literal `$125`, and has no `20\d\d-\d\d-\d\d` date string.
- Error path (guard): a reply quoting "$19.95/mo" or "20% off repairs" is NOT redacted to the referral safe line.
- Error path (guard, cross-topic — critical): a reply that mentions both "referral" AND a membership "% / $" in one turn must NOT be wrongly redacted. The `referr*`-within-80-chars-of-a-number regex (`FORBIDDEN_DISCLOSURES[0]`) collides with "20% off repairs" when the bot also says "referral". If the test confirms over-redaction, tighten that regex to require a reward noun (`gift|reward|bonus|commission|receive|get`) near the number — keeping the actual reward-disclosure boundary intact.
- Edge case (boundary): a reply that would disclose the referral *reward amount* IS still redacted (unchanged).
- Eval (offline replay): recorded membership/warranty cases pass; the "what maintenance plans do you offer?" case returns one coherent answer (not old program + new tiers); referral-deflection case passes.

**Verification:** `verify` green; after `eval:record`, the new membership/warranty/review/referral cases pass offline.

---

### U11. Booking routing confirmation + docs

**Goal:** Confirm and document that booking reaches difeliceshvac@gmail.com and how to activate email.

**Requirements:** R1, R2

**Dependencies:** None

**Files:**
- Modify: `.env.example` (document `BOOKING_TO_EMAIL` default + that `RESEND_API_KEY` activates delivery; note `BOOKING_FROM_EMAIL`)
- Modify: `CLAIMS.md` (record the booking-routing claim)
- (No code change expected — `api/booking.ts` already routes to `BOOKING_TO_EMAIL ?? COMPANY.email`.)

**Approach:**
- Verify `COMPANY.email === "difeliceshvac@gmail.com"`; confirm the existing offline booking test covers the logged-fallback path. Document the Resend activation step.

**Patterns to follow:** existing `.env.example` comment style; `test/api.test.ts` booking case.

**Test scenarios:**
- Covers AE4. Happy/edge: existing offline test asserts valid booking → 200 `{delivery:"logged"}` with no Resend key (reaffirm; add an assertion that the destination resolves to `COMPANY.email` when `BOOKING_TO_EMAIL` unset, if not already covered).

**Verification:** Destination confirmed; `.env.example` documents activation; gate green.

---

## System-Wide Impact

- **Interaction graph:** Two new `/api/*` functions auto-served (no `vercel.json` change). New routes nest under `Layout`, so they inherit Header/Footer/ChatWidget. The chatbot path (`shared/agent.ts` → `system-prompt.ts` + `guard.ts`) is touched by U10.
- **Error propagation:** Checkout failures degrade to call/email (200), mirroring booking; webhook returns 400 only on bad signature, 200 otherwise; chat path already never 500s.
- **State lifecycle risks:** No app state; Stripe holds subscription state. Duplicate webhook → at most a duplicate owner email (accepted).
- **API surface parity:** New `CheckoutRequest`/`CheckoutResponse` follow the existing contract conventions; both client and server validate at the seam.
- **Integration coverage:** Stripe live calls are never exercised in `verify` (mocked/stubbed); real signature verification + raw-body behavior must be confirmed with the Stripe CLI / a deployed test, not unit tests.
- **Unchanged invariants:** `api/chat.ts`, `api/booking.ts` behavior preserved; the referral-reward privacy boundary and no-fabrication boundary are unchanged and explicitly re-tested.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Webhook signature fails due to parsed body (the `bodyParser:false` no-op on `@vercel/node`) | Read raw stream, never `req.body`; verify with Stripe CLI before relying on it (U4 execution note) |
| Guard false-positive redacts a membership reply — `bonus/gift/reward` + number, OR the `referr*` + number regex colliding with "20% off repairs" when "referral" co-occurs | Word facts to avoid trigger tokens (U1); add isolated AND cross-topic guard tests; tighten the referral regex to require a reward noun near the number if it over-redacts (U10) |
| Open-redirect via attacker-controlled `req.headers.host` in success/cancel URLs | Prefer `PUBLIC_BASE_URL`; allowlist-validate Host fallback; treat `PUBLIC_BASE_URL` as required-in-prod (U3) |
| Cross-site POST mints checkout sessions / pre-fills a victim email | Origin/Referer check + JSON-only parse on `/api/checkout` (U3) |
| Partial Stripe config silently routes one tier to call/email (owner thinks page works) | Log resolved-vs-degraded Price IDs; going-live step clicks all three enroll buttons (U3, Docs) |
| AE6 unsatisfiable — `checkout.session.completed` lacks the member name without email | Require `customer_email` (U2/U3); webhook reads `customer_details`/email; defined fallback (U4) |
| Webhook raw-body path is untestable in the offline gate | Direct stream-reader unit test offline; raw-body confirmation is a hard going-live gate, not optional (U4) |
| Bot quotes a price out of sync with the Stripe Price | Display price is single-source in KB; owner keeps KB ↔ Stripe Price in sync (documented boundary) |
| Secret key leaking into the client bundle | Secret stays in `api/` only; never `VITE_`-prefixed; client sends plan key only |
| Stale eval gate after prompt/KB change | U10 execution note: `eval:record` then `verify`; CLAIMS.md updated |
| Header nav crowding (7+ links) | Keep core links in `NAV`; consider folding lower-priority links into the footer during impl |
| External dependency: owner must provide Stripe account/prices, photos, testimonials, partners, Google Place ID, Resend key | Every feature ships dormant behind a fallback/empty-state; activates on content/key with no code change |

---

## Phased Delivery

- **Phase 1 — Foundation:** U1, U2 (data + contract; unblocks everything).
- **Phase 2 — Payments backend:** U3, U4 (checkout + webhook).
- **Phase 3 — Membership UI:** U5 (depends on U1, U3).
- **Phase 4 — Content surfaces:** U6, U7, U8, U9 (independent; parallelizable).
- **Phase 5 — Bot, booking & gate:** U10 (bot, needs `eval:record`), U11 (booking confirm + docs).

Each unit is an atomic commit; `npm run verify` must stay green after each (eval re-record is the one manual, paid step, tied to U10).

---

## Documentation / Operational Notes

- Update `.env.example` for all new env vars (U3, U4, U11) following the "OPTIONAL — graceful fallback" comment style.
- Update `CLAIMS.md` with new claim rows (U10, U11) per the project's done-criterion convention.
- Going-live steps the owner performs (no code): create Stripe Products/Prices → set `STRIPE_SECRET_KEY` + price-ID vars + `STRIPE_WEBHOOK_SECRET` in Vercel → create the webhook endpoint in the Stripe Dashboard → set `LINKS.googleReview`/`manageMembership` + `RESEND_API_KEY` → redeploy.
- Recommended after merge: `/ce-compound` to record the env-gated-fallback seam, the Vercel ESM `.js` rule, and the webhook raw-body gotcha (no `docs/solutions/` exists yet).

---

## Sources & References

- **Origin document:** docs/brainstorms/di-felice-website-updates-requirements.md
- Related code: `api/booking.ts`, `shared/contract.ts`, `shared/knowledge.ts`, `shared/system-prompt.ts`, `shared/guard.ts`, `src/components/Bits.tsx`, `src/components/BookingForm.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/App.tsx`, `eval/cases.ts`, `test/api.test.ts`, `CLAIMS.md`
- External docs: Stripe Checkout Sessions, Stripe webhooks signature verification, Stripe Customer Portal, Vercel Node runtime raw-body guidance, Google review deep-link format
