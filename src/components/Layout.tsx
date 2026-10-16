import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { COMPANY } from "../../shared/knowledge";
import { legacyRedirect } from "../../shared/routes";
import { BookServiceLink } from "./BookServiceLink";
import ChatWidget from "./ChatWidget";
import Footer from "./Footer";
import Header from "./Header";
import { useSceneReveal } from "./Scene";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

export default function Layout() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  useSceneReveal(pathname + hash);

  useEffect(() => {
    const next = legacyRedirect(pathname, search, hash);
    if (next) {
      navigate(next, { replace: true });
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, search, hash, navigate]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <div className="dock">
        <a href={telHref}>Call now</a>
        <BookServiceLink>Book service</BookServiceLink>
      </div>
      <ChatWidget />
    </>
  );
}
