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

// Compact, honest trust cues docked under the hero panel. Every figure is grounded
// in shared/knowledge.ts — no invented claims, no social proof.
const TRUST = [
  { value: `$${COMPANY.diagnosticFee}`, label: "Diagnostic — credited toward your repair" },
  { value: "Free", label: "Estimates on new AC systems & generators" },
  { value: "Licensed", label: `Texas ${COMPANY.license}` },
];

export default function Home() {
  return (
    <>
      {/* Hero — "Frostline Calm": a full-bleed hero image with the content floating
          like a frosted control panel. Header stays as-is (approved "F with the current header"). */}
      <section className="relative isolate overflow-hidden border-b border-line">
        {/* Decorative backdrop — the headline carries the meaning, so the image is aria-hidden. */}
        <img
          src="/assets/background.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-top motion-safe:animate-revealIn"
        />
        {/* Icy veils fade the portrait image into a readable frosted base — heaviest at the
            bottom and left, where the panel sits. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-white/5 via-brand-50/60 to-brand-50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-50/90 via-brand-50/25 to-transparent"
        />

        <div className="container-page flex min-h-[clamp(520px,68vh,640px)] items-end py-12 sm:py-16">
          <div className="w-full max-w-xl rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-pop backdrop-blur-xl motion-safe:animate-riseIn sm:p-8">
            <Eyebrow>Cool air, clear answers · Houston, TX</Eyebrow>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-tight text-brand-950 sm:text-5xl">
              Comfort you can feel
              <br />
              before we say a word.
            </h1>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-ink-2">
              Licensed Houston HVAC — repair, installation, and maintenance, with right-sized
              systems and clear next steps. With {COMPANY.experienceYears}+ years of experience, we
              explain the issue, then make booking or calling simple.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Cta to="/book" variant="primary" arrow>
                Get a Free Estimate
              </Cta>
              <Cta href={telHref} variant="ghost">
                <Phone size={16} /> {COMPANY.phone}
              </Cta>
            </div>
            <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {TRUST.map((t, i) => (
                <div
                  key={t.value}
                  className="flex items-baseline gap-2 rounded-2xl border border-white/55 bg-white/55 p-3 shadow-card backdrop-blur-md motion-safe:animate-popIn sm:block"
                  style={{ animationDelay: `${160 + i * 90}ms` }}
                >
                  <p className="text-[15px] font-semibold tracking-tight text-brand-700">{t.value}</p>
                  <p className="text-[11.5px] leading-snug text-ink-2 sm:mt-1">{t.label}</p>
                </div>
              ))}
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
