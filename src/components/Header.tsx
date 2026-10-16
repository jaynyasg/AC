import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { COMPANY } from "../../shared/knowledge";

const NAV = [
  { to: "/services", label: "Services" },
  { to: "/maintenance", label: "Maintenance" },
  { to: "/membership", label: "Membership" },
  { to: "/#area", label: "Service area" },
  { to: "/#contact", label: "Contact" },
];

const MORE = [
  { to: "/faq", label: "FAQ & Tips" },
  { to: "/gallery", label: "Our Work" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/referrals", label: "Referrals" },
];

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-lock", open);
    return () => document.body.classList.remove("nav-lock");
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 900px)");
    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener?.("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener?.("change", onChange);
    };
  }, []);

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <div className="shell header-bar">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            DF
          </span>
          <span className="brand-text">
            <span className="brand-name">Di Felice's HVAC</span>
            <span className="brand-meta">Licensed &amp; insured · {COMPANY.license}</span>
          </span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="nav-toggle-bars" aria-hidden="true" />
        </button>

        <nav id="site-nav" className={`site-nav${open ? " is-open" : ""}`} aria-label="Primary">
          {NAV.map((item) =>
            item.to.startsWith("/#") ? (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ) : (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ),
          )}
          {MORE.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-more" onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <a className="nav-call" href={telHref}>
            Call {COMPANY.phone}
          </a>
        </nav>

        <a className="btn btn-cyan header-cta" href={telHref}>
          Call now
        </a>
      </div>
    </header>
  );
}
