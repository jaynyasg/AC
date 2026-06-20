import { COMPANY } from "../../shared/knowledge";
import { Card, Cta, Eyebrow, Section, SectionHeading } from "../components/Bits";
import { Phone } from "../components/icons";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

export default function Referrals() {
  return (
    <>
      <Section wash className="border-b border-line">
        <Eyebrow>Networking &amp; Referrals</Eyebrow>
        <SectionHeading
          title="A trusted network for homeowners"
          lead="Our goal is to connect with other trustworthy professionals in the home-services world — so the customers we serve have people they can rely on for the things outside our field of expertise."
        />
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="text-[17px] font-semibold">Are you a home-services pro?</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
              We're building a network of dependable providers — plumbing, electrical, roofing,
              landscaping, and more — who share our standards for honest, quality work. If that's you,
              let's talk about taking care of each other's customers.
            </p>
            <div className="mt-5">
              <Cta href={`mailto:${COMPANY.email}?subject=Partner network inquiry`} variant="primary">
                Get in touch
              </Cta>
            </div>
          </Card>

          <Card>
            <h3 className="text-[17px] font-semibold">Refer a new customer</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
              Know someone who needs heating or cooling help? When you refer a new client to us, we'll
              extend a gift of appreciation for the business they bring our way.
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              {COMPANY.owner} shares the details of that thank-you personally — just reach out and
              we'll fill you in.
            </p>
            <div className="mt-5">
              <Cta href={telHref} variant="ghost">
                <Phone size={16} /> Call {COMPANY.phone}
              </Cta>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
