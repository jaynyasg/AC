import { COMPANY } from "../../shared/knowledge";
import { BEFORE_AFTER } from "../data/gallery";
import { Scene, Shell } from "../components/Scene";
import { usePageMeta } from "../lib/pageMeta";

const MOOD = [
  {
    src: "/media/scenes/iceland-blue-ice.jpg",
    alt: "Glossy blue glacier ice, shown for atmosphere — not a photo of our work.",
  },
  {
    src: "/media/scenes/greenland-blue-ice.jpg",
    alt: "Blue ice in dark water, shown for atmosphere — not a photo of our work.",
  },
  {
    src: "/media/scenes/blue-berg.jpg",
    alt: "A blue iceberg, shown for atmosphere — not a photo of our work.",
  },
];

export default function Gallery() {
  const hasWork = BEFORE_AFTER.length > 0;
  usePageMeta(
    "Gallery — Di Felice's HVAC",
    hasWork
      ? `Before-and-after photos from ${COMPANY.name} jobs in ${COMPANY.area}.`
      : `Before-and-after photos from ${COMPANY.name} will be posted as they're collected. ${COMPANY.area}.`,
  );

  return (
    <Scene name="reviews" labelledBy="gallery-title" underHeader>
      <Shell>
        <div className="section-head" data-reveal>
          <p className="eyebrow">Our Work</p>
          <h2 id="gallery-title">
            {hasWork ? (
              <>
                Before <span>&amp; after</span>
              </>
            ) : (
              <>
                Before &amp; after <span>— coming soon</span>
              </>
            )}
          </h2>
          <p>
            {hasWork
              ? "Real jobs from recent service calls — clean installs, careful diagnostics, and comfort built to last."
              : "We're putting together real before-and-after photos from recent jobs. John will be adding them here shortly — clean installs, careful diagnostics, and comfort built to last."}
          </p>
        </div>

        {hasWork ? (
          <div className="trust-grid">
            {BEFORE_AFTER.map((job) => (
              <article key={job.title} className="plain-card" data-reveal>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <div className="tuneup-grid" style={{ marginTop: "0.8rem" }}>
                  {[
                    { label: "Before", src: job.beforeImg, alt: job.beforeAlt },
                    { label: "After", src: job.afterImg, alt: job.afterAlt },
                  ].map((img) => (
                    <figure key={img.label} className="photo-frame">
                      <img src={img.src} alt={img.alt} />
                      <figcaption>{img.label}</figcaption>
                    </figure>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <>
            <div className="trust-grid" data-reveal>
              {MOOD.map((shot) => (
                <figure key={shot.src} className="photo-frame">
                  <img src={shot.src} alt={shot.alt} />
                </figure>
              ))}
            </div>
            <p className="fine" data-reveal>
              Imagery shown for ambiance. Actual project photos will be posted as they're collected.
            </p>
          </>
        )}
      </Shell>
    </Scene>
  );
}
