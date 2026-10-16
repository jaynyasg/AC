import { useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  COMPANY,
  FAQ_TIPS,
  LINKS,
  MAINTENANCE,
  MEMBERSHIP_PLANS,
  WARRANTIES,
  type MembershipPlan,
} from "../../shared/knowledge";
import { BEFORE_AFTER } from "../data/gallery";
import { TESTIMONIALS } from "../data/testimonials";
import { enrollIntent } from "../lib/enroll";
import BookingForm from "./BookingForm";
import { Scene, Shell, revealDelay } from "./Scene";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

const cadenceLabel: Record<MembershipPlan["cadence"], string> = {
  "one-time": "one-time",
  month: "per month",
  year: "per year",
};

const reviewCta = LINKS.googleReview
  ? { href: LINKS.googleReview, label: "Leave a Google review" }
  : {
      href: `mailto:${COMPANY.email}?subject=${encodeURIComponent("My experience with Di Felice's HVAC")}`,
      label: "Share your experience",
    };

function Icon({ children, brass = false }: { children: ReactNode; brass?: boolean }) {
  return (
    <span className={brass ? "icon icon-brass" : "icon"} aria-hidden="true">
      <svg viewBox="0 0 24 24">{children}</svg>
    </span>
  );
}

export function TrustBand({ underHeader = false }: { underHeader?: boolean }) {
  return (
    <Scene name="trust" labelledBy="trust-title" underHeader={underHeader}>
      <Shell>
        <div className="section-head" data-reveal>
          <p className="eyebrow">Why homeowners call</p>
          <h2 id="trust-title">Comfort done right — and built to last</h2>
          <p>
            Our team is dedicated to reliable, high-quality HVAC services that keep your home
            comfortable and energy-efficient.
          </p>
        </div>
        <div className="trust-grid">
          <article className="plain-card" data-reveal style={revealDelay(0)}>
            <Icon>
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
              <path d="M9 12l2 2 4-4" />
            </Icon>
            <h3>Licensed &amp; insured</h3>
            <p>
              Texas-licensed ({COMPANY.license}). Commercial &amp; residential — installation &amp;
              repair you can trust.
            </p>
          </article>
          <article className="plain-card" data-reveal style={revealDelay(80)}>
            <Icon>
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v4l3 2" />
            </Icon>
            <h3>{COMPANY.experienceYears}+ years of experience</h3>
            <p>We specialize in preventative maintenance that keeps systems efficient year-round.</p>
          </article>
          <article className="plain-card" data-reveal style={revealDelay(160)}>
            <Icon>
              <path d="M4 10h16M4 14h16M8 4v4M16 16v4M7 20h4" />
            </Icon>
            <h3>Right-sized comfort</h3>
            <p>
              Real heat-load calculations for every room — not a rule-of-thumb guess — for lasting
              comfort.
            </p>
          </article>
        </div>
      </Shell>
    </Scene>
  );
}

export function SizingBand({
  underHeader = false,
  estimateLead = false,
}: {
  underHeader?: boolean;
  estimateLead?: boolean;
}) {
  return (
    <Scene name="sizing" labelledBy="sizing-title" underHeader={underHeader}>
      <Shell>
        <div className="split">
        <figure className="photo-frame" data-reveal>
          <img
            src="/media/technician.jpg"
            alt="HVAC technician in a hard hat and blue uniform using gauges on an outdoor air-conditioning condenser."
            width="1800"
            height="1200"
          />
          <figcaption>Stock photograph for atmosphere. Not a photo of Di Felice's crew.</figcaption>
        </figure>
        <div data-reveal style={revealDelay(80)}>
          <p className="eyebrow">Right-sized comfort</p>
          <h2 id="sizing-title">Sized for the rooms you actually live in</h2>
          {estimateLead && (
            <p>
              Just want an estimate on a new AC system? We'll gladly come out, run tests, and calculate
              the specific heat loads for the most optimal performance for your new investment — for
              free. We offer the same for Generac generator systems.
            </p>
          )}
          <p>
            Our industry used to size installations with a general “rule of thumb.” In 2026 that
            standard doesn't apply — there's a better way to calculate exactly what your house and
            each individual space needs for maximum, lasting comfort. Our in-depth process guarantees
            your needs are met head-on, with accuracy.
          </p>
          <p>
            If you get multiple quotes (which we highly advise for such an important investment) and a
            company can't explain how they calculated the cooling needed for each room, they may not be
            the company to go with. A cheaper quote can cost you more long-term with a system that's
            over- or under-sized.
          </p>
          <h3 className="subhead">Why correct sizing matters</h3>
          <ul className="check-list">
            <li>Excess moisture and mold from an oversized system</li>
            <li>Longer run times that wear equipment out faster</li>
            <li>Higher utility bills, year over year</li>
            <li>Unsafe, less healthy living conditions for your family</li>
          </ul>
          <p className="fine">
            We don't even care if you choose us — choose a company with your family's health and future
            in mind. A simple call is all it takes. We offer the same careful approach for Generac
            generator systems.
          </p>
          {estimateLead && (
            <>
              <h3 className="subhead">We handle the registration</h3>
              <p>
                When your new equipment qualifies for an extended manufacturer parts warranty, we
                register it with the manufacturer on your behalf — so you're covered without the
                paperwork. Ask us what your specific system qualifies for.
              </p>
              <div className="warranty">
                <h3>Warranties that protect your investment</h3>
                <p>
                  New installations are backed at two levels — by the equipment manufacturer and by us
                  directly.
                </p>
                <ul className="check-list">
                  {WARRANTIES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        </div>
      </Shell>
    </Scene>
  );
}

export function MaintenanceBand({ underHeader = false }: { underHeader?: boolean }) {
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
    <Scene name="maintenance" id="maintenance" labelledBy="maint-title" underHeader={underHeader}>
      <Shell>
        <div className="section-head" data-reveal>
          <p className="eyebrow">Bi-yearly maintenance program</p>
          <h2 id="maint-title">Maintenance &amp; Membership</h2>
          <p>
            Get ahead of problems — before they become hardships. In spring and fall we have the
            proper time to address issues before they worsen or damage critical equipment. Just like a
            car, your HVAC system needs regular tune-ups to perform at its best.
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
        <ul className="chip-list" data-reveal>
          {MAINTENANCE.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
        <div className="tuneup-grid">
          <details className="tuneup" data-reveal>
            <summary>
              Spring A/C tune-up <span>Preparing your cooling system for summer heat.</span>
            </summary>
            <ul>
              {MAINTENANCE.springTuneUp.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
          <details className="tuneup" data-reveal style={revealDelay(80)}>
            <summary>
              Fall heating tune-up <span>Making sure your heat is safe and ready for winter.</span>
            </summary>
            <ul>
              {MAINTENANCE.fallTuneUp.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        </div>
        <div className="plan-grid">
          {MEMBERSHIP_PLANS.map((plan, i) => {
            const fallback = fallbacks[plan.key];
            return (
              <article
                key={plan.key}
                className={plan.featured ? "plan plan-featured" : "plan"}
                data-reveal
                style={revealDelay(i * 80)}
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
          )}
        </p>
        <div className="warranty" data-reveal>
          <h3>Warranties that protect your investment</h3>
          <p>
            New installations are backed at two levels — by the equipment manufacturer and by us
            directly.
          </p>
          <ul className="check-list">
            {WARRANTIES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="brands">Brands we work with: {COMPANY.brands.join(", ")}.</p>
        </div>
        <div className="warranty" data-reveal>
          <h3>Membership benefits</h3>
          <p>
            Our company takes pride in giving the best service to our loyal patrons. As a member, you
            can expect:
          </p>
          <ul className="check-list">
            {MAINTENANCE.memberBenefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Schedule your maintenance check-up today. For multiple units at your residence or
            business, we discount our rate for each additional unit.
          </p>
          <p>
            <Link className="btn btn-ink" to="/book">
              Sign up for maintenance
            </Link>{" "}
            <a className="btn btn-cyan" href={telHref}>
              Call {COMPANY.phone}
            </a>
          </p>
        </div>
      </Shell>
    </Scene>
  );
}

export function AreaBand({ underHeader = false }: { underHeader?: boolean }) {
  return (
    <Scene name="area" id="area" labelledBy="area-title" underHeader={underHeader}>
      <Shell className="area-layout">
        <div data-reveal>
          <p className="eyebrow eyebrow-light">Service area</p>
          <h2 id="area-title">Houston, TX and surrounding areas</h2>
          <p>
            {COMPANY.name} Reliable AC &amp; heating for {COMPANY.area}. {COMPANY.scope}.
          </p>
          <p className="hours-inline">
            <strong>Hours.</strong> {COMPANY.hours.map((h) => `${h.days} ${h.time}`).join(" · ")}.
          </p>
        </div>
        <aside className="placeholder" data-reveal style={revealDelay(80)}>
          <h3>Licensed for the homes and businesses we serve</h3>
          <p>
            Commercial and residential installation and repair across {COMPANY.area}. Texas license{" "}
            {COMPANY.license}. Individual neighborhoods are not listed separately — call and we will
            confirm we cover your address.
          </p>
          <p>
            <a className="btn btn-cyan" href={telHref}>
              Call {COMPANY.phone}
            </a>
          </p>
        </aside>
      </Shell>
    </Scene>
  );
}

export function ReviewsBand({ underHeader = false }: { underHeader?: boolean }) {
  const hasReviews = TESTIMONIALS.length > 0;
  const hasWork = BEFORE_AFTER.length > 0;

  return (
    <Scene name="reviews" id="reviews" labelledBy="reviews-title" underHeader={underHeader}>
      <Shell>
        <div className="section-head" data-reveal>
          <p className="eyebrow">Testimonials</p>
          <h2 id="reviews-title">
            {hasReviews ? "What our customers say" : "Customer reviews are on the way"}
          </h2>
          <p>
            {hasReviews
              ? "Real words from the homeowners and businesses we've helped keep comfortable."
              : "We're a growing family business gathering feedback from the people we serve. Worked with us recently? We'd be grateful if you shared your experience."}
          </p>
        </div>
        {hasReviews ? (
          <div className="trust-grid">
            {TESTIMONIALS.map((t, i) => (
              <article key={t.quote} className="plain-card" data-reveal style={revealDelay(i * 80)}>
                <blockquote>
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <p>
                  <strong>{t.name}</strong>
                  {t.location ? ` · ${t.location}` : ""}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <article className="placeholder review-placeholder" data-reveal>
            <p>
              You could be the first review on this page. If we’ve earned it, a quick note means the
              world to a local family business.
            </p>
            <a className="btn btn-ink" href={reviewCta.href}>
              {reviewCta.label}
            </a>
          </article>
        )}
        <div className="soon" data-reveal>
          <h3>{hasWork ? "Before & after" : "Before & after — coming soon"}</h3>
          <p>
            {hasWork
              ? "Real jobs from recent service calls — clean installs, careful diagnostics, and comfort built to last."
              : "We're putting together real before-and-after photos from recent jobs. John will be adding them here shortly — clean installs, careful diagnostics, and comfort built to last."}
          </p>
          <p>
            <Link to="/gallery">See our work</Link>
            {" · "}
            <Link to="/testimonials">Testimonials</Link>
          </p>
        </div>
      </Shell>
    </Scene>
  );
}

export function TipsBand({
  underHeader = false,
  tight = false,
  showChatNote = false,
}: {
  underHeader?: boolean;
  tight?: boolean;
  showChatNote?: boolean;
}) {
  return (
    <Scene name="tips" id="tips" labelledBy="tips-title" tight={tight} underHeader={underHeader}>
      <Shell>
        <div className="section-head" data-reveal>
          <p className="eyebrow">FAQ &amp; homeowner tips</p>
          <h2 id="tips-title">Simple habits that keep your system healthy</h2>
          <p>
            A few things every homeowner can do to add longevity and avoid common issues. The
            dangerous components are handled during our maintenance visits — these are the safe ones
            you can manage yourself.
          </p>
        </div>
        <ol className="tips" data-reveal>
          {FAQ_TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ol>
        {showChatNote && (
          <p className="fine" data-reveal style={{ marginTop: "1.25rem" }}>
            Still have a question about your AC or heating? Tap the chat bubble in the corner — our
            assistant can help any time, day or night.
          </p>
        )}
      </Shell>
    </Scene>
  );
}

export function ContactBand({ underHeader = false }: { underHeader?: boolean }) {
  return (
    <Scene name="contact" id="contact" labelledBy="contact-title" underHeader={underHeader}>
      <Shell className="contact-grid">
        <div data-reveal>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Ready when you are</h2>
          <p>
            Whether it's an urgent repair or a free estimate on a new system, a quick call is all it
            takes to choose what's best for your family's comfort.
          </p>
          <p>
            Tell us a bit about what you need — a repair, a tune-up, or a free estimate on a new
            system — and we'll reach out to schedule. Estimates on new AC systems and Generac
            generators are free.
          </p>
          <p className="big-phone">
            <a href={telHref}>{COMPANY.phone}</a>
          </p>
          <dl className="contact-facts">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{COMPANY.owner}</dd>
            </div>
            <div>
              <dt>License</dt>
              <dd>Texas {COMPANY.license}</dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>
                {COMPANY.hours.map((h) => (
                  <span key={h.days}>
                    {h.days} {h.time}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Diagnostic</dt>
              <dd>${COMPANY.diagnosticFee} — credited toward your repair</dd>
            </div>
          </dl>
        </div>
        <BookingForm />
      </Shell>
    </Scene>
  );
}
