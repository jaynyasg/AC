import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { COMPANY } from "../../shared/knowledge";
import { Cta } from "./Bits";
import { Menu, Phone, Snowflake, X } from "./icons";

const NAV = [
  { to: "/services", label: "Services" },
  { to: "/maintenance", label: "Maintenance" },
  { to: "/membership", label: "Membership" },
  { to: "/faq", label: "FAQ & Tips" },
  { to: "/gallery", label: "Our Work" },
  { to: "/referrals", label: "Referrals" },
];

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white shadow-card">
            <Snowflake size={20} />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight">DI Felice's HVAC</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
              Licensed &amp; Insured · {COMPANY.license}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                "rounded-pill px-3 py-2 text-[13.5px] font-medium transition " +
                (isActive ? "bg-surface text-ink" : "text-muted hover:text-ink")
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Cta href={telHref} variant="ghost">
            <Phone size={16} /> {COMPANY.phone}
          </Cta>
          <Cta to="/book" variant="primary">
            Book / Free Estimate
          </Cta>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-line bg-paper text-ink lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="animate-fadeIn border-t border-line bg-canvas lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  "rounded-lg px-3 py-2.5 text-[15px] font-medium " +
                  (isActive ? "bg-surface text-ink" : "text-ink-2")
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Cta href={telHref} variant="ghost">
                <Phone size={16} /> Call {COMPANY.phone}
              </Cta>
              <Cta to="/book" variant="primary" className="w-full" >
                Book / Free Estimate
              </Cta>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
