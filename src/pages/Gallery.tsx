import { COMPANY } from "../../shared/knowledge";
import { Cta, Eyebrow, Section, SectionHeading } from "../components/Bits";
import { Star } from "../components/icons";
import { BEFORE_AFTER } from "../data/gallery";

// Ambient cool-blue imagery — mood only, NOT captioned as specific customer jobs.
const MOOD = ["/assets/site/mood3.jpg", "/assets/site/mood1.jpg", "/assets/site/mood4.jpg"];

export default function Gallery() {
  const hasWork = BEFORE_AFTER.length > 0;

  return (
    <>
      <Section wash className="border-b border-line">
        <Eyebrow>Our Work</Eyebrow>
        <SectionHeading
          title={hasWork ? "Before & after" : "Before & after — coming soon"}
          lead={
            hasWork
              ? "Real jobs from recent service calls — clean installs, careful diagnostics, and comfort built to last."
              : "We're putting together real before-and-after photos from recent jobs. John will be adding them here shortly — clean installs, careful diagnostics, and comfort built to last."
          }
        />
      </Section>

      {hasWork ? (
        <Section>
          <div className="grid gap-8">
            {BEFORE_AFTER.map((job) => (
              <article
                key={job.title}
                className="rounded-card border border-line bg-paper p-5 shadow-card"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Before", src: job.beforeImg, alt: job.beforeAlt },
                    { label: "After", src: job.afterImg, alt: job.afterAlt },
                  ].map((img) => (
                    <figure
                      key={img.label}
                      className="relative overflow-hidden rounded-lg border border-line"
                    >
                      <span className="absolute left-3 top-3 rounded-pill bg-ink/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        {img.label}
                      </span>
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="h-60 w-full object-cover"
                        loading="lazy"
                      />
                    </figure>
                  ))}
                </div>
                <h3 className="mt-4 text-[16px] font-semibold">{job.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{job.description}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : (
        <Section>
          <div className="grid gap-5 sm:grid-cols-3">
            {MOOD.map((src) => (
              <div key={src} className="overflow-hidden rounded-card border border-line shadow-card">
                <img
                  src={src}
                  alt="Cool, comfortable air"
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12.5px] text-muted-2">
            Imagery shown for ambiance. Actual project photos will be posted as they're collected.
          </p>
        </Section>
      )}

      <Section wash>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex justify-center gap-1 text-brand-400">
            <Star /> <Star /> <Star /> <Star /> <Star />
          </div>
          <h2 className="text-2xl font-semibold sm:text-3xl">Customer reviews are on the way</h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
            We're a growing family business and we're gathering feedback from the people we serve.
            Worked with us recently? We'd be grateful if you shared your experience — and you might be
            the first review on this page.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Cta href={`mailto:${COMPANY.email}?subject=My experience with DI Felice's HVAC`} variant="primary">
              Share your experience
            </Cta>
            <Cta to="/book" variant="ghost">
              Book a visit
            </Cta>
          </div>
        </div>
      </Section>
    </>
  );
}
