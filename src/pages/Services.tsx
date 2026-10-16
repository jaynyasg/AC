import { COMPANY, SERVICES } from "../../shared/knowledge";
import { SizingBand } from "../components/Bands";
import { BookServiceLink } from "../components/BookServiceLink";
import { Scene, Shell, revealDelay } from "../components/Scene";
import { usePageMeta } from "../lib/pageMeta";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

export default function Services() {
  usePageMeta(
    "Services — Di Felice's HVAC",
    `AC and heating repairs, installs, and a $${COMPANY.diagnosticFee} diagnostic visit credited toward the repair. Free estimates on new systems and generators in ${COMPANY.area}.`,
  );
  return (
    <>
      <Scene name="services" id="services" labelledBy="services-page-title" underHeader>
        <Shell>
          <div className="section-head" data-reveal>
            <p className="eyebrow eyebrow-light">Services</p>
            <h2 id="services-page-title">
              Repairs, installs <span>&amp; honest diagnostics</span>
            </h2>
            <p>
              Your heating and cooling system is one of the most expensive and important systems in
              your home. Regular service keeps it running efficiently, prevents costly breakdowns, and
              extends equipment life.
            </p>
            <p>{SERVICES.diagnostic}</p>
          </div>
          <div className="diagnostic" data-reveal>
            <p className="diagnostic-fee">
              <span>${COMPANY.diagnosticFee}</span> diagnostic visit
            </p>
            <div>
              <p>
                Our initial diagnostic fee to show up and pinpoint your AC issue is{" "}
                <strong>${COMPANY.diagnosticFee}</strong>. Consider it an investment toward the parts
                and labor to fix your issue — the ${COMPANY.diagnosticFee} is credited toward the
                repair. If the repair costs more than you can manage at that moment, the fee can still
                be applied to fixing your issue right away or at a later time.
              </p>
              <p className="fine">
                Financing options may also be available for you to take advantage of in certain
                circumstances.
              </p>
              <a className="btn btn-cyan" href={telHref}>
                {COMPANY.phone}
              </a>
            </div>
          </div>
          <div className="service-grid" style={{ marginTop: "1rem" }}>
            <article className="service-card" data-reveal style={revealDelay(0)}>
              <h3>Need help now?</h3>
              <p>
                If your system isn't cooling or working properly, call and we'll get to the root of it.
              </p>
              <BookServiceLink>Book online</BookServiceLink>
            </article>
            <article className="service-card" data-reveal style={revealDelay(80)}>
              <h3>Repairs &amp; installs</h3>
              <p>Not cooling or acting up? We get to the root of the problem fast.</p>
              <BookServiceLink>Book a repair</BookServiceLink>
            </article>
            <article className="service-card" data-reveal style={revealDelay(160)}>
              <h3>Free estimates</h3>
              <p>Considering a new system or generator? Estimates are free.</p>
              <BookServiceLink>Request an estimate</BookServiceLink>
            </article>
          </div>
        </Shell>
      </Scene>
      <SizingBand estimateLead />
    </>
  );
}
