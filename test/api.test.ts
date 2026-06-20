import type { VercelRequest, VercelResponse } from "@vercel/node";
import { describe, expect, it } from "vitest";
import chat from "../api/chat";
import booking from "../api/booking";
import { FALLBACK_REPLY } from "../shared/guard";

// Minimal req/res doubles so we can exercise the real handlers offline. With no
// ANTHROPIC_API_KEY / RESEND_API_KEY set, the handlers must still return usable
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
});
