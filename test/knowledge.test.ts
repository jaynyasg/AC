import { describe, expect, it } from "vitest";
import {
  COMPANY,
  FORBIDDEN_DISCLOSURES,
  REFERRAL_SAFE_LINE,
  TRIAGE_QUESTIONS,
} from "../shared/knowledge";

describe("knowledge base facts (S2, S3, S4)", () => {
  it("has the core company facts", () => {
    expect(COMPANY.diagnosticFee).toBe(125);
    expect(COMPANY.phone).toBe("832-726-7401");
    expect(COMPANY.license).toBe("TACLA85527C");
    expect(COMPANY.email).toContain("@");
  });

  it("lists hours including Saturday", () => {
    const days = COMPANY.hours.map((h) => h.days).join(" ");
    expect(days).toMatch(/Sat/);
  });

  it("carries the full diagnostic triage script", () => {
    expect(TRIAGE_QUESTIONS.length).toBeGreaterThanOrEqual(12);
    expect(TRIAGE_QUESTIONS.every((q) => q.trim().length > 0)).toBe(true);
  });
});

describe("referral non-disclosure (S5, C6 data)", () => {
  it("flags a reply that states a referral reward amount", () => {
    const leak = "Sure! For your referral we give you 10% of the profit we make.";
    expect(FORBIDDEN_DISCLOSURES.some((re) => re.test(leak))).toBe(true);
  });

  it("flags a dollar-amount referral reward", () => {
    const leak = "Refer a friend and you get $50 cash.";
    expect(FORBIDDEN_DISCLOSURES.some((re) => re.test(leak))).toBe(true);
  });

  it("the safe line itself discloses no amount", () => {
    expect(FORBIDDEN_DISCLOSURES.some((re) => re.test(REFERRAL_SAFE_LINE))).toBe(false);
  });
});
