import { COMPANY } from "../../shared/knowledge";
import { PARTNERS, type Partner } from "../data/partners";
import { Scene, Shell, revealDelay } from "../components/Scene";
import { usePageMeta } from "../lib/pageMeta";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

function groupByCategory(partners: readonly Partner[]): [string, Partner[]][] {
  const map = new Map<string, Partner[]>();
  for (const partner of partners) {
    const list = map.get(partner.category) ?? [];
    list.push(partner);
    map.set(partner.category, list);
  }
  return [...map.entries()];
}

export default function Referrals() {
  const groups = groupByCategory(PARTNERS);
  usePageMeta(
    "Referrals — Di Felice's HVAC",
    `Refer a customer to ${COMPANY.name}, or ask ${COMPANY.owner} for a trusted professional outside heating and cooling. Details are shared personally. Call ${COMPANY.phone}.`,
  );

  return (
    <Scene name="referral" labelledBy="referral-page-title" underHeader>
      <Shell>
        <div className="section-head" data-reveal>
          <p className="eyebrow eyebrow-light">Networking &amp; referrals</p>
          <h2 id="referral-page-title">
            A trusted network <span>for homeowners</span>
          </h2>
          <p>
            Our goal is to connect the customers we serve with other trustworthy professionals — so
            you have dependable people for the home needs outside our field of expertise.
          </p>
        </div>

        {groups.length > 0 ? (
          groups.map(([category, list]) => (
            <div key={category} style={{ marginBottom: "1.25rem" }}>
              <h3 className="subhead">{category}</h3>
              <div className="trust-grid">
                {list.map((partner) => (
                  <article key={partner.name} className="plain-card" data-reveal>
                    <h3>{partner.name}</h3>
                    {partner.blurb && <p>{partner.blurb}</p>}
                    <p>
                      {partner.phone && (
                        <a className="btn btn-ink" href={`tel:${partner.phone.replace(/\D/g, "")}`}>
                          {partner.phone}
                        </a>
                      )}{" "}
                      {partner.url && (
                        <a className="btn btn-cyan" href={partner.url}>
                          Visit site
                        </a>
                      )}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))
        ) : (
          <article className="plain-card" data-reveal>
            <h3>Need a trusted pro outside of AC?</h3>
            <p>
              We're putting together a list of dependable people we trust for home services beyond
              heating and cooling — realtors, plumbing, electrical, foundation, remodeling,
              landscaping, and more. While we finish building it out, just ask and we'll point you to
              someone we'd use ourselves.
            </p>
            <p>
              <a className="btn btn-ink" href={telHref}>
                Call {COMPANY.phone}
              </a>
            </p>
          </article>
        )}

        <div className="trust-grid" style={{ marginTop: "1rem" }}>
          <article className="plain-card" data-reveal style={revealDelay(0)}>
            <h3>Are you a home-services pro?</h3>
            <p>
              We're building a network of dependable providers — plumbing, electrical, roofing,
              landscaping, and more — who share our standards for honest, quality work. If that's you,
              let's talk about taking care of each other's customers.
            </p>
            <p>
              <a className="btn btn-ink" href={`mailto:${COMPANY.email}?subject=Partner network inquiry`}>
                Get in touch
              </a>
            </p>
          </article>
          <article className="plain-card" data-reveal style={revealDelay(80)}>
            <h3>Refer a new customer</h3>
            <p>
              Know someone who needs heating or cooling help? When you refer a new client to us, we'll
              extend a gift of appreciation for the business they bring our way.
            </p>
            <p>
              {COMPANY.owner} shares the details of that thank-you personally — just reach out and
              we'll fill you in.
            </p>
            <p>
              <a className="btn btn-cyan" href={telHref}>
                Call {COMPANY.phone}
              </a>
            </p>
          </article>
        </div>
      </Shell>
    </Scene>
  );
}
