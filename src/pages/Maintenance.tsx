import { COMPANY, MAINTENANCE } from "../../shared/knowledge";
import { Card, CheckList, Cta, Eyebrow, Section, SectionHeading } from "../components/Bits";
import { Leaf, Snowflake } from "../components/icons";

export default function Maintenance() {
  return (
    <>
      <Section wash className="border-b border-line">
        <Eyebrow>Bi-Yearly Maintenance Program</Eyebrow>
        <SectionHeading
          title="Get ahead of problems — before they become hardships"
          lead="In spring and fall we have the proper time to address issues before they worsen or damage critical equipment. Just like a car, your HVAC system needs regular tune-ups to perform at its best."
        />
        <ul className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {MAINTENANCE.benefits.map((b) => (
            <li
              key={b}
              className="rounded-card border border-line bg-paper px-4 py-3 text-[14px] font-medium text-ink-2 shadow-card"
            >
              {b}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Snowflake size={20} />
            </span>
            <h3 className="mt-4 text-[17px] font-semibold">Spring A/C Tune-Up</h3>
            <p className="mt-1 text-[13.5px] text-muted">Preparing your cooling system for summer heat.</p>
            <div className="mt-4">
              <CheckList items={MAINTENANCE.springTuneUp} />
            </div>
          </Card>
          <Card>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Leaf size={20} />
            </span>
            <h3 className="mt-4 text-[17px] font-semibold">Fall Heating Tune-Up</h3>
            <p className="mt-1 text-[13.5px] text-muted">Making sure your heat is safe and ready for winter.</p>
            <div className="mt-4">
              <CheckList items={MAINTENANCE.fallTuneUp} />
            </div>
          </Card>
        </div>
      </Section>

      <Section wash>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              title="Membership benefits"
              lead="Our company takes pride in giving the best service to our loyal patrons. As a member, you can expect:"
            />
            <div className="mt-6">
              <CheckList items={MAINTENANCE.memberBenefits} />
            </div>
          </div>
          <Card>
            <h3 className="text-[17px] font-semibold">Sign up &amp; schedule online</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              Schedule your maintenance check-up today. For multiple units at your residence or
              business, we discount our rate for each additional unit.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Cta to="/book" variant="primary" arrow>
                Sign up for maintenance
              </Cta>
              <Cta href={`tel:${COMPANY.phone.replace(/\D/g, "")}`} variant="ghost">
                Call {COMPANY.phone}
              </Cta>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
