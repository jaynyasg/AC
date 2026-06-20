import { Link } from "react-router-dom";
import { COMPANY, SERVICES } from "../../shared/knowledge";
import { Card, Cta, Eyebrow, Section, SectionHeading } from "../components/Bits";
import { ArrowRight, Leaf, Phone, Shield, Snowflake, Star, Wrench } from "../components/icons";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

const VALUES = [
  {
    icon: <Shield size={22} />,
    title: "Licensed & insured",
    body: `Texas-licensed (${COMPANY.license}). Commercial & residential — installation & repair you can trust.`,
  },
  {
    icon: <Star size={20} />,
    title: `${COMPANY.experienceYears}+ years of experience`,
    body: "We specialize in preventative maintenance that keeps systems efficient year-round.",
  },
  {
    icon: <Snowflake size={20} />,
    title: "Right-sized comfort",
    body: "Real heat-load calculations for every room — not a rule-of-thumb guess — for lasting comfort.",
  },
];

const LINKS = [
  { to: "/services", icon: <Wrench size={20} />, title: "Repairs & Installs", body: "Not cooling or acting up? We get to the root of the problem fast." },
  { to: "/maintenance", icon: <Leaf size={20} />, title: "Maintenance Program", body: "Bi-yearly spring & fall tune-ups that prevent costly breakdowns." },
  { to: "/book", icon: <Snowflake size={20} />, title: "Free Estimates", body: "Considering a new system or generator? Estimates are free." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="wash-cool border-b border-line">
        <div className="container-page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <Eyebrow>AC &amp; Heating · Houston, TX</Eyebrow>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Quality Comfort,
              <br />
              <span className="text-brand-600">Family First.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-2">
              Reliable AC and heating solutions to ensure your home's health and comfort. With over{" "}
              {COMPANY.experienceYears} years of experience, we keep your system running efficiently,
              year-round.
            </p>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              Not cooling or not working properly? Call us today and we'll get to the root of your
              problem right away.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Cta to="/book" variant="primary" arrow>
                Get a Free Estimate
              </Cta>
              <Cta href={telHref} variant="dark">
                <Phone size={16} /> {COMPANY.phone}
              </Cta>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] font-medium text-muted">
              <span className="inline-flex items-center gap-1.5"><Shield size={15} /> Licensed &amp; Insured</span>
              <span className="inline-flex items-center gap-1.5"><Wrench size={15} /> Commercial &amp; Residential</span>
              <span className="inline-flex items-center gap-1.5"><Star size={14} /> {COMPANY.experienceYears}+ years</span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-card border border-line shadow-card">
              <img
                src="/assets/background.png"
                alt="Cool air flowing from a wall-mounted air conditioning unit"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-card border border-line bg-paper px-4 py-3 shadow-pop sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                Diagnostic fee
              </p>
              <p className="text-[15px] font-semibold text-ink">
                ${COMPANY.diagnosticFee} <span className="font-normal text-muted">· credited toward your repair</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <Section>
        <SectionHeading
          title="Comfort done right — and built to last"
          lead="Our team is dedicated to reliable, high-quality HVAC services that keep your home comfortable and energy-efficient."
        />
        <div className="mt-9 grid gap-5 sm:grid-cols-3">
          {VALUES.map((v) => (
            <Card key={v.title}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                {v.icon}
              </span>
              <h3 className="mt-4 text-[16px] font-semibold">{v.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{v.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* What we do */}
      <Section wash>
        <SectionHeading title="What we do" lead={SERVICES.diagnostic} />
        <div className="mt-9 grid gap-5 sm:grid-cols-3">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="group">
              <Card className="h-full">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  {l.icon}
                </span>
                <h3 className="mt-4 flex items-center gap-1.5 text-[16px] font-semibold">
                  {l.title}
                  <ArrowRight className="text-muted-2 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{l.body}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA band */}
      <Section>
        <div className="overflow-hidden rounded-card bg-brand-950 px-8 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready when you are</h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
            Whether it's an urgent repair or a free estimate on a new system, a quick call is all it
            takes to choose what's best for your family's comfort.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Cta to="/book" variant="primary" arrow>
              Book a Visit
            </Cta>
            <Cta href={telHref} variant="ghost">
              <Phone size={16} /> Call {COMPANY.phone}
            </Cta>
          </div>
        </div>
      </Section>
    </>
  );
}
