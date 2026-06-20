import { describe, expect, it } from "vitest";
import {
  BookingRequest,
  ChatRequest,
  CheckoutPlan,
  CheckoutRequest,
  parse,
} from "../shared/contract";
import { MEMBERSHIP_PLANS } from "../shared/knowledge";

describe("ChatRequest contract (C1)", () => {
  it("accepts a valid conversation", () => {
    const r = parse(ChatRequest, { messages: [{ role: "user", content: "hi" }] });
    expect(r.ok).toBe(true);
  });

  it("rejects an empty messages array", () => {
    const r = parse(ChatRequest, { messages: [] });
    expect(r.ok).toBe(false);
  });

  it("rejects a bad role", () => {
    const r = parse(ChatRequest, { messages: [{ role: "system", content: "x" }] });
    expect(r.ok).toBe(false);
  });

  it("rejects empty message content", () => {
    const r = parse(ChatRequest, { messages: [{ role: "user", content: "" }] });
    expect(r.ok).toBe(false);
  });
});

describe("BookingRequest contract (B1, B3)", () => {
  const valid = {
    name: "Jane Homeowner",
    phone: "(832) 555-0142",
    serviceType: "repair",
  };

  it("accepts a valid booking", () => {
    const r = parse(BookingRequest, valid);
    expect(r.ok).toBe(true);
  });

  it("rejects a too-short phone and reports the field", () => {
    const r = parse(BookingRequest, { ...valid, phone: "123" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fields.phone).toBeDefined();
  });

  it("rejects an invalid service type", () => {
    const r = parse(BookingRequest, { ...valid, serviceType: "spaceship" });
    expect(r.ok).toBe(false);
  });

  it("rejects a malformed email but allows an empty string", () => {
    expect(parse(BookingRequest, { ...valid, email: "not-an-email" }).ok).toBe(false);
    expect(parse(BookingRequest, { ...valid, email: "" }).ok).toBe(true);
  });
});

describe("CheckoutRequest contract (U2 / R4, R5)", () => {
  it("accepts a valid plan key", () => {
    expect(parse(CheckoutRequest, { plan: "comfort" }).ok).toBe(true);
  });

  it("accepts an optional prefill email and an empty string", () => {
    expect(parse(CheckoutRequest, { plan: "comfort", email: "a@b.com" }).ok).toBe(true);
    expect(parse(CheckoutRequest, { plan: "tuneup", email: "" }).ok).toBe(true);
  });

  it("rejects an unknown plan and reports the field", () => {
    const r = parse(CheckoutRequest, { plan: "gold" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fields.plan).toBeDefined();
  });

  it("plan keys stay in sync with MEMBERSHIP_PLANS", () => {
    expect([...CheckoutPlan.options].sort()).toEqual(
      MEMBERSHIP_PLANS.map((p) => p.key).slice().sort(),
    );
  });
});
