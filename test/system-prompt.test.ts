import { describe, expect, it } from "vitest";
import { COMPANY, TRIAGE_QUESTIONS } from "../shared/knowledge";
import { SYSTEM_PROMPT } from "../shared/system-prompt";

describe("CSR system prompt assembly (C2)", () => {
  it("includes the required company facts", () => {
    expect(SYSTEM_PROMPT).toContain(COMPANY.name);
    expect(SYSTEM_PROMPT).toContain("$125");
    expect(SYSTEM_PROMPT).toContain(COMPANY.phone);
    expect(SYSTEM_PROMPT).toContain(COMPANY.license);
    for (const brand of COMPANY.brands) expect(SYSTEM_PROMPT).toContain(brand);
  });

  it("includes membership plan prices and warranty facts (C11, C12)", () => {
    expect(SYSTEM_PROMPT).toContain("$89.95");
    expect(SYSTEM_PROMPT).toContain("$159.95");
    expect(SYSTEM_PROMPT).toContain("$24.95");
    expect(SYSTEM_PROMPT).toContain("$125"); // diagnostic fee still present, unchanged
    expect(SYSTEM_PROMPT.toLowerCase()).toMatch(/warrant/);
  });

  it("embeds the triage script", () => {
    // at least the first triage question text should be present
    expect(SYSTEM_PROMPT).toContain(TRIAGE_QUESTIONS[0]);
  });

  it("instructs greeting, booking nudge, and final-answer-only", () => {
    expect(SYSTEM_PROMPT.toLowerCase()).toMatch(/greet/);
    expect(SYSTEM_PROMPT.toLowerCase()).toMatch(/book|estimate/);
    expect(SYSTEM_PROMPT.toLowerCase()).toMatch(/final answer/);
  });

  it("forbids referral disclosure and off-topic answers", () => {
    expect(SYSTEM_PROMPT.toLowerCase()).toMatch(/refer/);
    expect(SYSTEM_PROMPT.toLowerCase()).toMatch(/decline|unrelated|on ac|steer/);
  });

  it("is frozen (no interpolated date/time that would break prompt caching)", () => {
    expect(SYSTEM_PROMPT).not.toMatch(/\b20\d{2}-\d{2}-\d{2}\b/);
  });
});
