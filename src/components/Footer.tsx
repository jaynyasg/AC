import { NavLink } from "react-router-dom";
import { COMPANY, LINKS } from "../../shared/knowledge";
import { FOOTER_NAV } from "../site-nav";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

export default function Footer() {
  return (
    <footer className="site-footer scene scene-dark" data-scene="footer">
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
          {FOOTER_NAV.map((item) => (
            <p key={item.to}>
              <NavLink to={item.to} end>
                {item.label}
              </NavLink>
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
