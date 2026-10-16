import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { COMPANY, LINKS, MEMBERSHIP_PLANS, type MembershipPlan } from "../../shared/knowledge";
import { enrollIntent } from "../lib/enroll";
import { Scene, Shell, revealDelay } from "../components/Scene";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;
const cadenceLabel: Record<MembershipPlan["cadence"], string> = {
  "one-time": "one-time",
  month: "per month",
  year: "per year",
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
      setFallbacks((current) => ({
        ...current,
        [plan.key]: { phone: intent.phone, email: intent.email },
      }));
    } catch (err) {
      console.error("[checkout] request failed:", err);
      setFallbacks((current) => ({
        ...current,
        [plan.key]: { phone: COMPANY.phone, email: COMPANY.email },
      }));
    } finally {
      setPending(null);
    }
  }

  return (
    <Scene name="maintenance" labelledBy="plans-title" underHeader>
      <Shell>
        <div className="section-head" data-reveal>
          <p className="eyebrow">Membership &amp; plans</p>
          <h2 id="plans-title">Keep your comfort covered year-round</h2>
          <p>
            Stay ahead of breakdowns with regular tune-ups, priority scheduling, and member savings.
            Pick the plan that fits your home.
          </p>
        </div>

        {status === "success" && (
          <article className="plain-card" data-reveal style={{ marginBottom: "1rem" }}>
            <h3>You're enrolled — welcome to the family!</h3>
            <p>
              {COMPANY.owner} will be in touch to confirm your first visit. Thank you for trusting us
              with your comfort.
            </p>
            {LINKS.googleReview && (
              <p>
                <a className="btn btn-ink" href={LINKS.googleReview}>
                  Leave us a Google review
                </a>
              </p>
            )}
          </article>
        )}
        {status === "cancel" && (
          <article className="plain-card" data-reveal style={{ marginBottom: "1rem" }}>
            <p>
              No worries — you can enroll anytime. Not sure which plan fits? Call{" "}
              <a href={telHref}>{COMPANY.phone}</a> and we'll help you choose.
            </p>
          </article>
        )}

        <div className="plan-grid">
          {MEMBERSHIP_PLANS.map((plan, index) => {
            const fallback = fallbacks[plan.key];
            return (
              <article
                key={plan.key}
                className={plan.featured ? "plan plan-featured" : "plan"}
                data-reveal
                style={revealDelay(index * 80)}
              >
                {plan.featured && <p className="plan-flag">Featured</p>}
                <h3>{plan.name}</h3>
                <p className="price">
                  {plan.price} <span>{cadenceLabel[plan.cadence]}</span>
                </p>
                <p>{plan.blurb}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <p>
                  {fallback ? (
                    <>
                      Call or email to enroll:{" "}
                      <a className="btn btn-cyan" href={`tel:${fallback.phone.replace(/\D/g, "")}`}>
                        {fallback.phone}
                      </a>{" "}
                      <a
                        className="btn btn-ink"
                        href={`mailto:${fallback.email}?subject=${encodeURIComponent(`Enroll — ${plan.name}`)}`}
                      >
                        Email us
                      </a>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={plan.featured ? "btn btn-cyan" : "btn btn-ink"}
                      onClick={() => enroll(plan)}
                      disabled={pending === plan.key}
                    >
                      {pending === plan.key ? "Opening checkout…" : "Enroll now"}
                    </button>
                  )}
                </p>
              </article>
            );
          })}
        </div>

        <p className="fine center" data-reveal>
          The ${COMPANY.diagnosticFee} diagnostic fee is separate and applies to repair visits.
          Membership is billed securely through Stripe and you can cancel anytime.
          {LINKS.manageMembership && (
            <>
              {" "}
              <a href={LINKS.manageMembership}>Manage my membership</a>.
            </>
          )}{" "}
          <Link to="/maintenance">See what's included in each tune-up</Link>.
        </p>
      </Shell>
    </Scene>
  );
}
