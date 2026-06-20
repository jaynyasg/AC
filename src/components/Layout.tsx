import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ChatWidget from "./ChatWidget";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  const { pathname } = useLocation();
  // Reset scroll on route change (SPA navigation).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* On-demand, proactive CSR chatbot — present on every page (PRD). */}
      <ChatWidget />
    </div>
  );
}
