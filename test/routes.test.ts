import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BOOK_FORM_PATH, checkoutReturnUrl, legacyRedirect, MAINTENANCE_PATH } from "../shared/routes";
import { FOOTER_NAV, MORE_NAV, PRIMARY_NAV } from "../src/site-nav";

const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8")) as {
  redirects?: { source: string; destination: string; permanent?: boolean }[];
};

describe("maintenance and membership routes", () => {
  it("sends Stripe back to the combined page", () => {
    expect(MAINTENANCE_PATH).toBe("/maintenance");
    expect(checkoutReturnUrl("https://difelices.example", "success")).toBe(
      "https://difelices.example/maintenance?status=success",
    );
    expect(checkoutReturnUrl("https://difelices.example/", "cancel")).toBe(
      "https://difelices.example/maintenance?status=cancel",
    );
  });

  it("keeps the Stripe status query when an old membership URL is opened", () => {
    expect(legacyRedirect("/membership", "?status=success")).toBe("/maintenance?status=success");
    expect(legacyRedirect("/membership/", "?status=cancel", "#plans")).toBe(
      "/maintenance?status=cancel#plans",
    );
    expect(legacyRedirect("/maintenance", "?status=success")).toBeNull();
  });

  it("redirects /membership in vercel.json without dropping the query", () => {
    const rules = vercel.redirects ?? [];
    const membership = rules.filter((rule) => rule.source === "/membership" || rule.source === "/membership/");
    expect(membership.length).toBeGreaterThan(0);
    for (const rule of membership) {
      expect(rule.destination).toBe("/maintenance");
      expect(rule.destination.includes("?")).toBe(false);
    }
  });

  it("sends old homepage section links to their pages", () => {
    expect(legacyRedirect("/", "", "#area")).toBe("/service-area");
    expect(legacyRedirect("/", "", "#contact")).toBe("/book#book-form");
    expect(BOOK_FORM_PATH).toBe("/book#book-form");
    expect(legacyRedirect("/", "", "#maintenance")).toBe("/maintenance");
    expect(legacyRedirect("/services", "", "#area")).toBeNull();
  });
});

describe("navigation destinations", () => {
  const all = [...PRIMARY_NAV, ...MORE_NAV];

  it("points every header, menu, and footer link at its own page", () => {
    for (const item of [...all, ...FOOTER_NAV]) {
      expect(item.to.startsWith("/")).toBe(true);
      expect(item.to.includes("#")).toBe(false);
    }
    expect(all.map((item) => item.to)).toEqual([
      "/services",
      "/maintenance",
      "/service-area",
      "/book",
      "/faq",
      "/gallery",
      "/testimonials",
      "/referrals",
    ]);
    expect(FOOTER_NAV.map((item) => item.to)).toEqual(all.map((item) => item.to));
  });

  it("does not keep a separate membership destination", () => {
    expect(all.some((item) => item.to === "/membership")).toBe(false);
    expect(all.filter((item) => item.to === "/maintenance")).toHaveLength(1);
  });
});
