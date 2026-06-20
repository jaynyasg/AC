import { describe, expect, it } from "vitest";
import { enrollIntent } from "../src/lib/enroll";

const fb = { phone: "832-726-7401", email: "difeliceshvac@gmail.com" };

describe("enrollIntent (U5 / R5, AE1)", () => {
  it("returns a redirect for a valid checkout response", () => {
    expect(enrollIntent({ status: "checkout", url: "https://checkout.stripe.com/x" }, fb)).toEqual({
      kind: "redirect",
      url: "https://checkout.stripe.com/x",
    });
  });

  it("returns the server-provided fallback for a fallback response", () => {
    expect(enrollIntent({ status: "fallback", phone: "1", email: "a@b.com" }, fb)).toEqual({
      kind: "fallback",
      phone: "1",
      email: "a@b.com",
    });
  });

  it("degrades to the caller fallback on null / shape drift / missing fields", () => {
    expect(enrollIntent(null, fb)).toEqual({ kind: "fallback", ...fb });
    expect(enrollIntent({ status: "weird" }, fb)).toEqual({ kind: "fallback", ...fb });
    expect(enrollIntent({ status: "checkout" }, fb)).toEqual({ kind: "fallback", ...fb }); // no url
  });
});
