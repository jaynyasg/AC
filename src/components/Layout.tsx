import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { COMPANY } from "../../shared/knowledge";
import ChatWidget from "./ChatWidget";
import Footer from "./Footer";
import Header from "./Header";
import { useSceneReveal } from "./Scene";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

export default function Layout() {
  const { pathname, hash } = useLocation();
  useSceneReveal(pathname + hash);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

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
        <Link to="/#contact">Book service</Link>
      </div>
      <ChatWidget />
    </>
  );
}
