import { describe, expect, it } from "vitest";
import {
  COMPANY,
  FORBIDDEN_DISCLOSURES,
  LINKS,
  MEMBERSHIP_PLANS,
  REFERRAL_SAFE_LINE,
  TRIAGE_QUESTIONS,
  WARRANTIES,
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

describe("membership + warranty facts (U1)", () => {
  it("has three plans with the expected keys and display prices", () => {
    expect(MEMBERSHIP_PLANS.map((p) => p.key)).toEqual(["tuneup", "seasonal", "comfort"]);
    const byKey = Object.fromEntries(MEMBERSHIP_PLANS.map((p) => [p.key, p]));
    expect(byKey.tuneup.price).toBe("$89.95");
    expect(byKey.seasonal.price).toBe("$159.95");
    expect(byKey.comfort.price).toBe("$24.95");
  });

  it("maps each plan to a Stripe price env var with a valid mode", () => {
    for (const p of MEMBERSHIP_PLANS) {
      expect(p.priceEnv).toMatch(/^STRIPE_PRICE_/);
      expect(["payment", "subscription"]).toContain(p.mode);
    }
    const byKey = Object.fromEntries(MEMBERSHIP_PLANS.map((p) => [p.key, p]));
    expect(byKey.tuneup.mode).toBe("payment"); // one-time price
    expect(byKey.seasonal.mode).toBe("subscription");
    expect(byKey.comfort.mode).toBe("subscription");
  });

  it("defaults owner links to empty so CTAs render only when configured", () => {
    expect(LINKS.googleReview).toBe("");
    expect(LINKS.manageMembership).toBe("");
  });

  it("membership + warranty wording never trips the referral/reward guard", () => {
    const strings = [
      ...MEMBERSHIP_PLANS.flatMap((p) => [p.name, p.price, p.blurb, ...p.features]),
      ...WARRANTIES,
    ];
    for (const s of strings) {
      expect(FORBIDDEN_DISCLOSURES.some((re) => re.test(s))).toBe(false);
    }
  });
});
