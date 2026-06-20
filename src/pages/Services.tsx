import { COMPANY } from "../../shared/knowledge";
import { Card, Cta, Eyebrow, Section, SectionHeading } from "../components/Bits";
import { Phone } from "../components/icons";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

export default function Services() {
  return (
    <>
      <Section wash className="border-b border-line">
        <Eyebrow>Services</Eyebrow>
        <SectionHeading
          title="Repairs, installs & honest diagnostics"
          lead="Your heating and cooling system is one of the most expensive and important systems in your home. Regular service keeps it running efficiently, prevents costly breakdowns, and extends equipment life."
        />
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <h3 className="text-[17px] font-semibold">Diagnostic visit — ${COMPANY.diagnosticFee}</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
              Our initial diagnostic fee to show up and pinpoint your AC issue is{" "}
              <strong>${COMPANY.diagnosticFee}</strong>. Consider it an investment toward the parts
              and labor to fix your issue — the ${COMPANY.diagnosticFee} is credited toward the
              repair. If the repair costs more than you can manage at that moment, the fee can still
              be applied to fixing your issue right away or at a later time.
            </p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
              Financing options may also be available for you to take advantage of in certain
              circumstances.
            </p>
          </Card>
          <Card>
            <h3 className="text-[16px] font-semibold">Need help now?</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              If your system isn't cooling or working properly, call and we'll get to the root of it.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Cta href={telHref} variant="primary">
                <Phone size={16} /> {COMPANY.phone}
              </Cta>
              <Cta to="/book" variant="ghost">
                Book online
              </Cta>
            </div>
          </Card>
        </div>
      </Section>

      <Section wash>
        <SectionHeading
          title="Free estimates — sized with real math, not a guess"
          lead="Just want an estimate on a new AC system? We'll gladly come out, run tests, and calculate the specific heat loads for the most optimal performance for your new investment — for free. We offer the same for Generac generator systems."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 text-[14.5px] leading-relaxed text-ink-2">
            <p>
              Our industry used to size installations with a general "rule of thumb." In 2026 that
              standard doesn't apply — there's a better way to calculate exactly what your house and
              each individual space needs for maximum, lasting comfort. Our in-depth process
              guarantees your needs are met head-on, with accuracy.
            </p>
            <p>
              If you get multiple quotes (which we highly advise for such an important investment) and
              a company can't explain how they calculated the cooling needed for each room, they may
              not be the company to go with. A cheaper quote can cost you more long-term with a system
              that's over- or under-sized.
            </p>
          </div>
          <Card>
            <h3 className="text-[16px] font-semibold">Why correct sizing matters</h3>
            <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-ink-2">
              <li>• Excess moisture and mold from an oversized system</li>
              <li>• Longer run times that wear equipment out faster</li>
              <li>• Higher utility bills, year over year</li>
              <li>• Unsafe, less healthy living conditions for your family</li>
            </ul>
            <p className="mt-4 text-[13.5px] italic leading-relaxed text-muted">
              We don't even care if you choose us — choose a company with your family's health and
              future in mind. A simple call is all it takes.
            </p>
          </Card>
        </div>
      </Section>
    </>
  );
}
