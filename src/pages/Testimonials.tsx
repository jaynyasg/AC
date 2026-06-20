import { COMPANY, LINKS } from "../../shared/knowledge";
import { Card, Cta, Eyebrow, Section, SectionHeading } from "../components/Bits";
import { Star } from "../components/icons";
import { TESTIMONIALS } from "../data/testimonials";

// Funnel real ratings to Google when the review link is configured; until then,
// fall back to the existing "share your experience" email path so it's never dead.
const reviewCta = LINKS.googleReview
  ? { href: LINKS.googleReview, label: "Leave a Google review" }
  : {
      href: `mailto:${COMPANY.email}?subject=${encodeURIComponent("My experience with DI Felice's HVAC")}`,
      label: "Share your experience",
    };

const Stars = () => (
  <div className="flex gap-1 text-brand-400">
    <Star /> <Star /> <Star /> <Star /> <Star />
  </div>
);

export default function Testimonials() {
  const has = TESTIMONIALS.length > 0;

  return (
    <>
      <Section wash className="border-b border-line">
        <Eyebrow>Testimonials</Eyebrow>
        <SectionHeading
          title={has ? "What our customers say" : "Customer reviews are on the way"}
          lead={
            has
              ? "Real words from the homeowners and businesses we've helped keep comfortable."
              : "We're a growing family business gathering feedback from the people we serve. Worked with us recently? We'd be grateful if you shared your experience."
          }
        />
      </Section>

      <Section>
        {has ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <Card key={t.quote}>
                <div className="mb-3">
                  <Stars />
                </div>
                <blockquote className="text-[15px] leading-relaxed text-ink-2">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-[13.5px] font-semibold">
                  {t.name}
                  {t.location && <span className="font-normal text-muted"> · {t.location}</span>}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl text-center">
            <div className="mb-4 flex justify-center">
              <Stars />
            </div>
            <p className="text-[15px] leading-relaxed text-muted">
              You could be the first review on this page. If we&rsquo;ve earned it, a quick note means
              the world to a local family business.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Cta href={reviewCta.href} variant="primary">
            {reviewCta.label}
          </Cta>
          <Cta to="/book" variant="ghost">
            Book a visit
          </Cta>
        </div>
      </Section>
    </>
  );
}
