import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import webhook from "../api/stripe-webhook";

// No module mocking: we use the REAL Stripe SDK. `generateTestHeaderString`
// produces a valid signature offline and `constructEvent` genuinely throws on a
// bad one, so we exercise the real verification path. Only the outbound email
// (global fetch) is spied — no network, no vitest mock-hoisting traps.

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");
  vi.stubEnv("RESEND_API_KEY", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

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

// An async-iterable request double — the plain-object req() used elsewhere is NOT
// async-iterable, which is exactly the trap the webhook's raw-stream read avoids.
function streamReq(method: string, body = "", headers: Record<string, string> = {}) {
  return {
    method,
    headers,
    async *[Symbol.asyncIterator]() {
      if (body) yield Buffer.from(body);
    },
  } as unknown as VercelRequest;
}

describe("POST /api/stripe-webhook (U4 / R18, R19)", () => {
  it("rejects a GET with 405", async () => {
    const { res, out } = mockRes();
    await webhook(streamReq("GET"), res);
    expect(out.code).toBe(405);
  });

  it("is inert (200) and sends no email when no signing secret is set", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { res, out } = mockRes();
    await webhook(streamReq("POST", '{"type":"x"}'), res);
    expect(out.code).toBe(200);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects a bad signature with 400", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    const { res, out } = mockRes();
    await webhook(
      streamReq("POST", '{"type":"checkout.session.completed"}', {
        "stripe-signature": "t=1,v1=deadbeef",
      }),
      res,
    );
    expect(out.code).toBe(400);
  });

  // Covers AE6: a verified enrollment emails the owner a PII-scoped notification
  // that names the member and plan (not the full event object).
  it("emails the owner for a verified enrollment, scoped to plan + member", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const payload = JSON.stringify({
      id: "evt_1",
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { plan: "comfort" },
          customer_details: { name: "Jane Homeowner", email: "jane@example.com" },
          amount_total: 1995,
        },
      },
    });
    const sig = new Stripe("sk_test_x").webhooks.generateTestHeaderString({
      payload,
      secret: "whsec_test",
    });

    const { res, out } = mockRes();
    await webhook(streamReq("POST", payload, { "stripe-signature": sig }), res);

    expect(out.code).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    const sent = JSON.parse(init.body as string);
    expect(sent.subject).toContain("comfort");
    expect(sent.text).toContain("Jane Homeowner");
    expect(sent.text).toContain("$19.95");
    expect(sent.text).not.toContain("customer_details"); // PII-scoped, not full event
  });

  // A failed email must NOT turn the response non-2xx (no Stripe retry storm).
  it("still returns 200 when the notification email fails", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    const payload = JSON.stringify({
      id: "evt_2",
      type: "checkout.session.completed",
      data: { object: { metadata: { plan: "seasonal" }, amount_total: 15995 } },
    });
    const sig = new Stripe("sk_test_x").webhooks.generateTestHeaderString({
      payload,
      secret: "whsec_test",
    });

    const { res, out } = mockRes();
    await webhook(streamReq("POST", payload, { "stripe-signature": sig }), res);
    expect(out.code).toBe(200);
  });
});
