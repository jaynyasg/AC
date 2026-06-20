import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import checkout from "../api/checkout";
import { COMPANY } from "../shared/knowledge";

// These tests cover every branch that ships DORMANT and must never error — the
// graceful-degradation logic, origin rejection, and validation. They never reach
// the real `stripe.checkout.sessions.create` network call (it's gated behind
// config that these tests leave unset, or behind a missing price id). The live
// session-creation path is verified separately via the Stripe CLI going-live gate
// (see the plan's U3/U4 execution notes) — a unit test could only mock it anyway.
// `new Stripe("sk_test_x")` makes no network call at construction, so the
// "secret set, price missing" degrade test runs the real SDK safely.

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "");
  vi.stubEnv("STRIPE_PRICE_TUNEUP", "");
  vi.stubEnv("STRIPE_PRICE_SEASONAL", "");
  vi.stubEnv("STRIPE_PRICE_COMFORT", "");
  vi.stubEnv("PUBLIC_BASE_URL", "");
});
afterEach(() => vi.unstubAllEnvs());

function mockRes() {
  const out: { code?: number; body?: unknown; headers: Record<string, string> } = { headers: {} };
  const res = {
    status(code: number) {
      out.code = code;
      return res;
    },
    json(body: unknown) {
      out.body = body;
      return res;
    },
    setHeader(k: string, v: string) {
      out.headers[k] = v;
    },
  } as unknown as VercelResponse;
  return { res, out };
}
const req = (method: string, body?: unknown, headers: Record<string, string> = {}) =>
  ({ method, body, headers }) as unknown as VercelRequest;

describe("POST /api/checkout (U3 / R4, R5)", () => {
  it("rejects a GET with 405", async () => {
    const { res, out } = mockRes();
    await checkout(req("GET"), res);
    expect(out.code).toBe(405);
  });

  it("rejects an invalid plan with 400 + field errors", async () => {
    const { res, out } = mockRes();
    await checkout(req("POST", { plan: "gold" }), res);
    expect(out.code).toBe(400);
    expect((out.body as { fields?: unknown }).fields).toBeDefined();
  });

  // Covers AE1 (server side): Stripe not configured → call/email fallback, no error.
  it("falls back to call/email (200) when Stripe is not configured", async () => {
    const { res, out } = mockRes();
    await checkout(req("POST", { plan: "comfort" }), res);
    expect(out.code).toBe(200);
    expect(out.body).toMatchObject({
      status: "fallback",
      phone: COMPANY.phone,
      email: COMPANY.email,
    });
  });

  // Per-plan degrade: secret present but THIS plan's price id missing → fallback,
  // and it returns before any Stripe API call (so no network, no mock needed).
  it("degrades only the unconfigured plan when one price id is missing", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
    vi.stubEnv("STRIPE_PRICE_COMFORT", "price_123"); // comfort configured, tuneup not
    vi.stubEnv("PUBLIC_BASE_URL", "https://difelices-hvac.vercel.app");

    const { res, out } = mockRes();
    await checkout(req("POST", { plan: "tuneup" }), res);
    expect(out.code).toBe(200);
    expect(out.body).toMatchObject({ status: "fallback" });
  });

  // A genuine cross-site browser POST (Origin host ≠ Host) is rejected.
  it("rejects a cross-site origin with 403", async () => {
    const { res, out } = mockRes();
    await checkout(
      req(
        "POST",
        { plan: "comfort" },
        { host: "difelices-hvac.vercel.app", origin: "https://evil.example" },
      ),
      res,
    );
    expect(out.code).toBe(403);
  });
});
