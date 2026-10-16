---
title: "Don't vi.mock the Stripe SDK under vitest — use the real SDK offline"
date: 2026-06-20
category: best-practices
module: api/stripe
problem_type: best_practice
component: testing_framework
severity: medium
related_components: ["payments", "tooling"]
root_cause: test_isolation
resolution_type: test_fix
applies_when:
  - "Reaching for vi.mock() on an ESM npm module under vitest"
  - "Hitting \"Cannot access '__vi_import_N__' before initialization\" (TDZ) at import"
  - "Unit-testing Stripe webhook verification or checkout endpoints offline"
  - "Vercel @vercel/node serverless functions in an ESM (type module) project"
tags: ["vitest", "vi-mock", "stripe", "esm", "hoisting", "temporal-dead-zone", "webhook-testing"]
---

# Don't vi.mock the Stripe SDK under vitest — use the real SDK offline

## Context

Unit-testing `@vercel/node` serverless handlers (`"type": "module"` ESM; Vite + React + TS; **vitest 2.1.9**; **stripe ^22.2.2**) that wrap the `stripe` SDK. The instinct is to `vi.mock('stripe', factory)` so tests never hit the network. **Every** mock variant failed at import time, before any test ran:

```
ReferenceError: Cannot access '__vi_import_0__' before initialization
```

This is the **temporal-dead-zone (TDZ) trap from `vi.mock` hoisting**: vitest hoists `vi.mock` calls above the imports, so the factory — or any top-level read of the mocked import / `vi.fn()` — runs before the import binding is initialized. Three variants all tripped it (so it is not a "use vi.hoisted correctly" problem):

```ts
// 1) destructured vi.hoisted ref captured by the factory
const { createSession } = vi.hoisted(() => ({ createSession: vi.fn() }));
vi.mock("stripe", () => ({ default: class { checkout = { sessions: { create: createSession } }; } }));

// 2) spy created in the factory, read at the file's top level via the mocked import
vi.mock("stripe", () => { const create = vi.fn(); return { default: class { static __spy = create; } }; });
import Stripe from "stripe";
const spy = (Stripe as unknown as { __spy: Mock }).__spy;   // top-level read of mocked import → TDZ

// 3) non-destructured vi.hoisted bag
const mocks = vi.hoisted(() => ({ createSession: vi.fn() }));
vi.mock("stripe", () => ({ default: class { checkout = { sessions: { create: mocks.createSession } }; } }));
```

## Guidance

**For env-gated serverless SDK handlers, don't mock the SDK module — use the real SDK offline and partition tests by whether they touch the network.** SDK *construction* and *crypto* are network-free; only the API call is not.

1. **Webhook handler → exercise the real SDK end-to-end.**
   - Generate a valid signed payload offline: `new Stripe(key).webhooks.generateTestHeaderString({ payload, secret })`.
   - Feed it through an **async-iterable request double** (the handler reads the raw stream via `for await (const chunk of req)`).
   - Let the real `stripe.webhooks.constructEvent` verify it. A garbage signature makes the **real** `constructEvent` throw → assert `400`. No mock can prove this; the real call can.
   - Spy only the **outbound** side effect: `vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }))`.

2. **Checkout handler → unit-test only the branches that never reach the network.**
   - Cover: `405` (wrong method), `400` (invalid body), not-configured graceful fallback, **per-plan degrade** (`vi.stubEnv` sets the secret but leaves that plan's price-id env unset → returns the fallback *before* any API call), and cross-site-origin `403`.
   - `new Stripe("sk_test_x")` makes **no** network call at construction, so the per-plan-degrade test runs the real SDK safely.
   - **Drop** the one "creates a live session" unit test — it could only ever assert against a mock (a tautology). Verify that path with the **Stripe CLI** (`stripe listen` / `stripe trigger`) as a going-live gate.

3. **Raw-body discipline (the latent bug the mock problem hides):** read the body via `for await (const chunk of req)` — never touch `req.body`, a **lazy getter that parses and consumes** the stream and breaks signature verification. `export const config = { api: { bodyParser: false } }` is **Next.js-only** and a **no-op on bare `@vercel/node`** — don't rely on it.

## Why This Matters

- **Mocking the SDK fights the runner and buys nothing.** The hoisting TDZ cost three failed variants — and even a "working" mock only proves the test calls *your mock*, never that Stripe accepts your payload.
- **The real SDK offline is simpler AND stronger.** Signature verification and session-config validation are deterministic and network-free, so the real code path runs in unit tests; a bad signature throwing `400` is a genuine assertion, not a stubbed return.
- **Honest boundaries.** The one path that truly needs the network (live session creation) is explicitly handed to the Stripe CLI as a going-live gate, instead of faked into a green check that proves nothing.

## When to Apply

- You reach for `vi.mock("<sdk>", factory)` and hit `Cannot access '__vi_import_N__' before initialization`, or any `vi.hoisted` / mocked-import TDZ in ESM + vitest.
- The handler wraps an SDK whose **constructor makes no network call** (Stripe, and many others).
- The handler is **env-gated** — it has not-configured / per-resource-missing branches that return before any API call.
- A webhook verifies a **raw signed body** (generatable + verifiable offline with the real SDK).
- **Not** for SDK calls that genuinely hit the network with no pre-network branch to assert — those belong in a CLI/integration gate, not vitest units.

## Examples

**Before — the failing mock (don't):**

```ts
const { createSession } = vi.hoisted(() => ({ createSession: vi.fn() }));
vi.mock("stripe", () => ({ default: class { checkout = { sessions: { create: createSession } }; } }));
import handler from "../api/checkout";
// ❌ ReferenceError: Cannot access '__vi_import_0__' before initialization (at import)
```

**After — real SDK, real verification (webhook):**

```ts
import Stripe from "stripe";
import webhook from "../api/stripe-webhook";

function streamReq(method: string, body = "", headers: Record<string, string> = {}) {
  return { method, headers, async *[Symbol.asyncIterator]() { if (body) yield Buffer.from(body); } } as unknown as VercelRequest;
}

it("rejects a bad signature with 400", async () => {
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
  const { res, out } = mockRes();
  await webhook(streamReq("POST", "{}", { "stripe-signature": "garbage" }), res);
  expect(out.code).toBe(400); // the REAL constructEvent throws → 400
});

it("emails the owner for a verified enrollment", async () => {
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
  vi.stubEnv("RESEND_API_KEY", "re_test");
  const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));
  const payload = JSON.stringify({ type: "checkout.session.completed", data: { object: { metadata: { plan: "comfort" } } } });
  const sig = new Stripe("sk_test_x").webhooks.generateTestHeaderString({ payload, secret: "whsec_test" });
  const { res, out } = mockRes();
  await webhook(streamReq("POST", payload, { "stripe-signature": sig }), res);
  expect(out.code).toBe(200);
  expect(fetchSpy).toHaveBeenCalledOnce();
});
```

**After — real SDK, network-free branches (checkout):**

```ts
import checkout from "../api/checkout"; // no vi.mock("stripe")

it("degrades when the plan's price id is missing", async () => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x"); // real new Stripe(), no network at construction
  // STRIPE_PRICE_TUNEUP intentionally unset
  const { res, out } = mockRes();
  await checkout(req("POST", { plan: "tuneup" }), res);
  expect(out.code).toBe(200);
  expect(out.body).toMatchObject({ status: "fallback" }); // returns before any API call
});
```

## Related

- `docs/plans/2026-06-20-001-feat-website-updates-membership-content-plan.md` — the plan for this work. Its U3/U4 test scenarios originally prescribed **mocking** `stripe.checkout.sessions.create` / `constructEvent`; this learning **supersedes** that approach. The shipped tests (`test/checkout.test.ts`, `test/stripe-webhook.test.ts`) use the real-SDK pattern above.
- `api/stripe-webhook.ts`, `api/checkout.ts` — the handlers; `shared/contract.ts` — the validated seam.
- No related GitHub issues (searched `vitest mock stripe`, `vi.hoisted` — none).
