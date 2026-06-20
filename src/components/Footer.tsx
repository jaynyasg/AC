import { Link } from "react-router-dom";
import { COMPANY, LINKS } from "../../shared/knowledge";
import { Phone, Snowflake } from "./icons";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

export default function Footer() {
  return (
    <footer className="border-t border-line bg-brand-950 text-white/80">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
              <Snowflake size={20} />
            </span>
            <span className="text-[15px] font-semibold text-white">Di Felice's HVAC Corp.</span>
          </div>
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-white/65">
            {COMPANY.tagline} Reliable AC &amp; heating for {COMPANY.area}. {COMPANY.scope}.
          </p>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-[14px]">
            <li>
              <a href={telHref} className="inline-flex items-center gap-2 text-white hover:text-frost">
                <Phone size={16} /> {COMPANY.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${COMPANY.email}`} className="text-white/80 hover:text-frost">
                {COMPANY.email}
              </a>
            </li>
            <li className="text-white/65">License {COMPANY.license}</li>
            {LINKS.googleReview && (
              <li>
                <a href={LINKS.googleReview} className="text-white/80 hover:text-frost">
                  Leave us a Google review
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Hours</h3>
          <ul className="mt-4 space-y-2 text-[14px] text-white/80">
            {COMPANY.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-white/60">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-[14px] text-white/80">
            <li><Link to="/services" className="hover:text-frost">Services</Link></li>
            <li><Link to="/maintenance" className="hover:text-frost">Maintenance Program</Link></li>
            <li><Link to="/membership" className="hover:text-frost">Membership &amp; Plans</Link></li>
            <li><Link to="/faq" className="hover:text-frost">FAQ &amp; Homeowner Tips</Link></li>
            <li><Link to="/testimonials" className="hover:text-frost">Testimonials</Link></li>
            <li><Link to="/book" className="hover:text-frost">Book / Free Estimate</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-[12.5px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {COMPANY.name}. Brands we work with: {COMPANY.brands.join(", ")}.</p>
          <p>Commercial &amp; Residential · Licensed &amp; Insured</p>
        </div>
      </div>
    </footer>
  );
}
