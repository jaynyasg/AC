import { describe, expect, it } from "vitest";
import { BookingRequest, ChatRequest, parse } from "../shared/contract";

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
