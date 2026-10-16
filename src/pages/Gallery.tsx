import { BEFORE_AFTER } from "../data/gallery";
import { Scene, Shell } from "../components/Scene";

const MOOD = ["/assets/site/mood3.jpg", "/assets/site/mood1.jpg", "/assets/site/mood4.jpg"];

export default function Gallery() {
  const hasWork = BEFORE_AFTER.length > 0;

  return (
    <Scene name="reviews" labelledBy="gallery-title" underHeader>
      <Shell>
        <div className="section-head" data-reveal>
          <p className="eyebrow">Our Work</p>
          <h2 id="gallery-title">{hasWork ? "Before & after" : "Before & after — coming soon"}</h2>
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
              {MOOD.map((src) => (
                <figure key={src} className="photo-frame">
                  <img src={src} alt="Cool, comfortable air" />
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
