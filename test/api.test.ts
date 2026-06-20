import type { VercelRequest, VercelResponse } from "@vercel/node";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import chat from "../api/chat";
import booking from "../api/booking";
import { FALLBACK_REPLY } from "../shared/guard";
import { COMPANY } from "../shared/knowledge";

// Keep these handler tests deterministic and OFFLINE even if the machine has real
// keys in its environment — clear them so we exercise the no-provider fallback path.
beforeEach(() => {
  vi.stubEnv("OPENAI_API_KEY", "");
  vi.stubEnv("RESEND_API_KEY", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

// Minimal req/res doubles so we can exercise the real handlers offline. With no
// OPENAI_API_KEY / RESEND_API_KEY set, the handlers must still return usable
// 200s (the contact path is never a dead end) — claims B2, B3, C10.
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
const req = (method: string, body?: unknown) => ({ method, body }) as VercelRequest;

describe("POST /api/chat (offline, no key)", () => {
  it("returns a safe fallback 200 for a valid request when the model is unavailable", async () => {
    const { res, out } = mockRes();
    await chat(req("POST", { messages: [{ role: "user", content: "hi" }] }), res);
    expect(out.code).toBe(200);
    expect((out.body as { reply: string }).reply).toBe(FALLBACK_REPLY);
  });

  it("rejects a GET with 405", async () => {
    const { res, out } = mockRes();
    await chat(req("GET"), res);
    expect(out.code).toBe(405);
  });

  it("rejects an invalid body with 400 + field errors", async () => {
    const { res, out } = mockRes();
    await chat(req("POST", { messages: [] }), res);
    expect(out.code).toBe(400);
    expect((out.body as { fields?: unknown }).fields).toBeDefined();
  });
});

describe("POST /api/booking (offline, no email provider)", () => {
  it("accepts a valid booking and reports delivery:logged", async () => {
    const { res, out } = mockRes();
    await booking(
      req("POST", { name: "Jane Homeowner", phone: "832-555-0142", serviceType: "repair" }),
      res,
    );
    expect(out.code).toBe(200);
    expect(out.body).toMatchObject({ ok: true, delivery: "logged" });
  });

  it("rejects an invalid booking with 400", async () => {
    const { res, out } = mockRes();
    await booking(req("POST", { name: "x", phone: "1", serviceType: "nope" }), res);
    expect(out.code).toBe(400);
  });

  // R1 / AE4: when Resend is configured, the request is delivered to the owner
  // address (difeliceshvac@gmail.com via BOOKING_TO_EMAIL / COMPANY.email).
  it("emails the booking to the owner address when Resend is configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("BOOKING_TO_EMAIL", COMPANY.email);
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const { res, out } = mockRes();
    await booking(
      req("POST", { name: "Jane Homeowner", phone: "832-555-0142", serviceType: "repair" }),
      res,
    );

    expect(out.code).toBe(200);
    expect(out.body).toMatchObject({ ok: true, delivery: "emailed" });
    const sent = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
    expect(sent.to).toContain(COMPANY.email);
    expect(COMPANY.email).toBe("difeliceshvac@gmail.com");
  });
});
