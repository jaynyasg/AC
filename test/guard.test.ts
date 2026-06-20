import { describe, expect, it } from "vitest";
import { LIMITS } from "../shared/contract";
import { FALLBACK_REPLY, guardReply } from "../shared/guard";
import { REFERRAL_SAFE_LINE } from "../shared/knowledge";

describe("reply guard (C6, C10)", () => {
  it("returns the fallback for empty / whitespace output", () => {
    expect(guardReply("")).toEqual({ reply: FALLBACK_REPLY, fallback: true });
    expect(guardReply("   ")).toEqual({ reply: FALLBACK_REPLY, fallback: true });
    expect(guardReply(null)).toEqual({ reply: FALLBACK_REPLY, fallback: true });
  });

  it("passes a normal reply through unchanged", () => {
    const r = guardReply("Happy to help with your AC! What's it doing?");
    expect(r.fallback).toBe(false);
    expect(r.reply).toContain("AC");
  });

  it("redacts a referral-reward disclosure to the safe line", () => {
    const r = guardReply("If you refer a friend we give you 10% of the profit.");
    expect(r.reply).toBe(REFERRAL_SAFE_LINE);
    expect(r.fallback).toBe(false);
  });

  it("truncates an over-long reply to the contract cap", () => {
    const r = guardReply("A".repeat(LIMITS.replyMaxChars + 500));
    expect(r.reply.length).toBeLessThanOrEqual(LIMITS.replyMaxChars + 1);
    expect(r.reply.endsWith("…")).toBe(true);
  });
});
