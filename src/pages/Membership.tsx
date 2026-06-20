import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { COMPANY, LINKS, MEMBERSHIP_PLANS, type MembershipPlan } from "../../shared/knowledge";
import { Card, CheckList, Cta, Eyebrow, Section, SectionHeading } from "../components/Bits";
import { Phone } from "../components/icons";
import { enrollIntent } from "../lib/enroll";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;
const cadenceLabel: Record<MembershipPlan["cadence"], string> = {
  "one-time": "one-time",
  month: "/mo",
  year: "/yr",
};

export default function Membership() {
  const [params] = useSearchParams();
  const status = params.get("status");
  const [pending, setPending] = useState<string | null>(null);
  const [fallbacks, setFallbacks] = useState<Record<string, { phone: string; email: string }>>({});

  async function enroll(plan: MembershipPlan) {
    setPending(plan.key);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.key }),
      });
      const intent = enrollIntent(await res.json().catch(() => null), {
        phone: COMPANY.phone,
        email: COMPANY.email,
      });
      if (intent.kind === "redirect") {
        window.location.href = intent.url;
        return;
      }
      setFallbacks((f) => ({ ...f, [plan.key]: { phone: intent.phone, email: intent.email } }));
    } catch (err) {
      console.error("[checkout] request failed:", err);
      setFallbacks((f) => ({ ...f, [plan.key]: { phone: COMPANY.phone, email: COMPANY.email } }));
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <Section wash className="border-b border-line">
        <Eyebrow>Membership &amp; Plans</Eyebrow>
        <SectionHeading
          title="Keep your comfort covered year-round"
          lead="Stay ahead of breakdowns with regular tune-ups, priority scheduling, and member savings. Pick the plan that fits your home."
        />
      </Section>

      {status === "success" && (
        <Section className="pt-0">
          <div className="rounded-card border border-accent-green/30 bg-accent-green/5 p-6 text-center">
            <h2 className="text-[18px] font-semibold">You're enrolled — welcome to the family!</h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-muted">
              {COMPANY.owner} will be in touch to confirm your first visit. Thank you for trusting us
              with your comfort.
            </p>
            {LINKS.googleReview && (
              <div className="mt-5 flex justify-center">
                <Cta href={LINKS.googleReview} variant="primary">
                  Leave us a Google review
                </Cta>
              </div>
            )}
          </div>
        </Section>
      )}
      {status === "cancel" && (
        <Section className="pt-0">
          <div className="rounded-card border border-line bg-paper p-6 text-center">
            <p className="text-[14px] leading-relaxed text-muted">
              No worries — you can enroll anytime. Not sure which plan fits? Call{" "}
              <a href={telHref} className="font-semibold text-brand-700">
                {COMPANY.phone}
              </a>{" "}
              and we'll help you choose.
            </p>
          </div>
        </Section>
      )}

      <Section className={status ? "pt-0" : ""}>
        <div className="grid gap-6 lg:grid-cols-3">
          {MEMBERSHIP_PLANS.map((plan) => {
            const fb = fallbacks[plan.key];
            return (
              <Card
                key={plan.key}
                className={`flex flex-col ${plan.featured ? "ring-2 ring-brand-400" : ""}`}
              >
                {plan.featured && (
                  <span className="mb-3 inline-flex w-fit rounded-pill bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-700">
                    Most popular
                  </span>
                )}
                <h3 className="text-[18px] font-semibold">{plan.name}</h3>
                <p className="mt-1">
                  <span className="text-3xl font-bold text-ink">{plan.price}</span>
                  <span className="text-[13px] text-muted"> {cadenceLabel[plan.cadence]}</span>
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">{plan.blurb}</p>
                <div className="mt-5">
                  <CheckList items={plan.features} />
                </div>

                <div className="mt-auto pt-6">
                  {fb ? (
                    <div className="space-y-2">
                      <p className="text-[12.5px] text-muted">Call or email to enroll:</p>
                      <Cta
                        href={`tel:${fb.phone.replace(/\D/g, "")}`}
                        variant="primary"
                        className="w-full"
                      >
                        <Phone size={16} /> {fb.phone}
                      </Cta>
                      <Cta
                        href={`mailto:${fb.email}?subject=${encodeURIComponent(`Enroll — ${plan.name}`)}`}
                        variant="ghost"
                        className="w-full"
                      >
                        Email us
                      </Cta>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => enroll(plan)}
                      disabled={pending === plan.key}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-pill bg-brand-500 px-6 text-[14px] font-semibold text-white shadow-card transition hover:bg-brand-600 active:scale-[0.985] disabled:opacity-60"
                    >
                      {pending === plan.key ? "Opening checkout…" : "Enroll now"}
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <p className="mt-6 text-[12.5px] leading-relaxed text-muted-2">
          The $125 diagnostic fee is separate and applies to repair visits. Membership is billed
          securely through Stripe and you can cancel anytime.
          {LINKS.manageMembership && (
            <>
              {" "}
              <a href={LINKS.manageMembership} className="font-semibold text-brand-700 underline">
                Manage my membership
              </a>
              .
            </>
          )}
        </p>
      </Section>
    </>
  );
}
