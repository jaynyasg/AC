import { COMPANY } from "../../shared/knowledge";
import { Card, Cta, Eyebrow, Section, SectionHeading } from "../components/Bits";
import { Phone } from "../components/icons";
import { PARTNERS, type Partner } from "../data/partners";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

function groupByCategory(partners: readonly Partner[]): [string, Partner[]][] {
  const map = new Map<string, Partner[]>();
  for (const p of partners) {
    const list = map.get(p.category) ?? [];
    list.push(p);
    map.set(p.category, list);
  }
  return [...map.entries()];
}

export default function Referrals() {
  const groups = groupByCategory(PARTNERS);
  const hasPartners = groups.length > 0;

  return (
    <>
      <Section wash className="border-b border-line">
        <Eyebrow>Networking &amp; Referrals</Eyebrow>
        <SectionHeading
          title="A trusted network for homeowners"
          lead="Our goal is to connect the customers we serve with other trustworthy professionals — so you have dependable people for the home needs outside our field of expertise."
        />
      </Section>

      <Section>
        {hasPartners ? (
          <div className="space-y-10">
            {groups.map(([category, list]) => (
              <div key={category}>
                <h3 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-600">
                  {category}
                </h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((p) => (
                    <Card key={p.name}>
                      <h4 className="text-[15px] font-semibold">{p.name}</h4>
                      {p.blurb && (
                        <p className="mt-2 text-[14px] leading-relaxed text-muted">{p.blurb}</p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.phone && (
                          <Cta href={`tel:${p.phone.replace(/\D/g, "")}`} variant="ghost">
                            <Phone size={16} /> {p.phone}
                          </Cta>
                        )}
                        {p.url && (
                          <Cta href={p.url} variant="ghost">
                            Visit site
                          </Cta>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <h3 className="text-[17px] font-semibold">Need a trusted pro outside of AC?</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
              We're putting together a list of dependable people we trust for home services beyond
              heating and cooling — realtors, plumbing, electrical, foundation, remodeling,
              landscaping, and more. While we finish building it out, just ask and we'll point you to
              someone we'd use ourselves.
            </p>
            <div className="mt-5">
              <Cta href={telHref} variant="primary">
                <Phone size={16} /> Call {COMPANY.phone}
              </Cta>
            </div>
          </Card>
        )}
      </Section>

      <Section wash>
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
