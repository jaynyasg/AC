import { Link } from "react-router-dom";
import { COMPANY, LINKS } from "../../shared/knowledge";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

const EXPLORE = [
  { to: "/services", label: "Services" },
  { to: "/maintenance", label: "Maintenance Program" },
  { to: "/membership", label: "Membership & Plans" },
  { to: "/faq", label: "FAQ & Homeowner Tips" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/gallery", label: "Our Work" },
  { to: "/referrals", label: "Referrals" },
  { to: "/book", label: "Book / Free Estimate" },
];

export default function Footer() {
  return (
    <footer className="site-footer scene scene-dark has-snow" data-scene="footer">
      <div className="scene-bg" aria-hidden="true">
        <img className="from-bottom" src="/media/scenes/lagoon-bergs.jpg" alt="" />
      </div>
      <div className="shell footer-grid footer-grid-wide">
        <div>
          <p className="footer-name">{COMPANY.name}</p>
          <p>
            {COMPANY.tagline} Reliable AC &amp; heating for {COMPANY.area}. {COMPANY.scope}.
          </p>
        </div>
        <div>
          <p className="footer-label">Contact</p>
          <p>
            <a href={telHref}>{COMPANY.phone}</a>
          </p>
          <p>
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </p>
          <p>License {COMPANY.license}</p>
          {LINKS.googleReview && (
            <p>
              <a href={LINKS.googleReview}>Leave us a Google review</a>
            </p>
          )}
          {LINKS.manageMembership && (
            <p>
              <a href={LINKS.manageMembership}>Manage my membership</a>
            </p>
          )}
        </div>
        <div>
          <p className="footer-label">Hours</p>
          {COMPANY.hours.map((h) => (
            <p key={h.days}>
              {h.days} {h.time}
            </p>
          ))}
        </div>
        <div>
          <p className="footer-label">Explore</p>
          {EXPLORE.map((item) => (
            <p key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </p>
          ))}
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>
          © {new Date().getFullYear()} {COMPANY.name}. Brands we work with: {COMPANY.brands.join(", ")}.
        </p>
        <p>Commercial &amp; residential · Licensed &amp; insured</p>
      </div>
    </footer>
  );
}
