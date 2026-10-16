import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { COMPANY } from "../../shared/knowledge";
import { BookServiceLink } from "./BookServiceLink";
import { MORE_NAV, PRIMARY_NAV } from "../site-nav";

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
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          {MORE_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end className="nav-more" onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <BookServiceLink className="nav-book" onClick={() => setOpen(false)}>
            Book service
          </BookServiceLink>
          <a className="nav-call" href={telHref}>
            Call {COMPANY.phone}
          </a>
        </nav>

        <BookServiceLink className="btn btn-ghost header-book" onClick={() => setOpen(false)}>
          Book service
        </BookServiceLink>
        <a className="btn btn-cyan header-cta" href={telHref}>
          Call now
        </a>
      </div>
    </header>
  );
}
