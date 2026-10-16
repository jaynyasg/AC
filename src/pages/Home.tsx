import { Link } from "react-router-dom";
import { COMPANY } from "../../shared/knowledge";
import { TrustBand } from "../components/Bands";
import Hero from "../components/Hero";
import { Scene, Shell, revealDelay } from "../components/Scene";
import { usePageMeta } from "../lib/pageMeta";
import { FOOTER_NAV } from "../site-nav";
import { BOOK_FORM_PATH } from "../../shared/routes";

const BLURBS: Record<string, string> = {
  "/services": `Repairs, installs, and a $${COMPANY.diagnosticFee} diagnostic visit credited toward the repair. Free estimates on new systems.`,
  "/maintenance":
    "Spring and fall tune-ups, membership benefits, and the tune-up, seasonal, and comfort plans.",
  "/service-area": `${COMPANY.area}. Commercial and residential, licensed ${COMPANY.license}.`,
  "/book": "Book a repair, a tune-up, or a free estimate. We'll reach out to schedule.",
  "/faq": "Filter, drain-line, and safety habits that help a system last between visits.",
  "/gallery": "Before-and-after photos from real jobs, posted as they're collected.",
  "/testimonials": "Customer reviews are on the way. Share your experience if we've earned it.",
  "/referrals": `Refer a customer, or ask ${COMPANY.owner} for a trusted pro outside of HVAC.`,
};

export default function Home() {
  usePageMeta(
    "Di Felice's HVAC — AC & Heating Repair & Install | Houston, TX",
    "Di Felice's HVAC Corp. — reliable AC and heating, installation & repair, commercial & residential. Licensed & insured (TACLA85527C). Free estimates. Call 832-726-7401.",
  );

  return (
    <>
      <Hero />
      <TrustBand />
      <Scene name="sizing" labelledBy="explore-title">
        <Shell>
          <div className="section-head" data-reveal>
            <p className="eyebrow">Explore</p>
            <h2 id="explore-title">Find the page you need</h2>
            <p>Each topic has its own page — services, plans, the area we cover, and how to book.</p>
          </div>
          <div className="teaser-grid">
            {FOOTER_NAV.map((item, index) => (
              <Link
                key={item.to}
                className="plain-card teaser-card"
                to={item.to === "/book" ? BOOK_FORM_PATH : item.to}
                data-reveal
                style={revealDelay(index * 40)}
              >
                <h3>{item.label}</h3>
                <p>{BLURBS[item.to]}</p>
              </Link>
            ))}
          </div>
        </Shell>
      </Scene>
    </>
  );
}
