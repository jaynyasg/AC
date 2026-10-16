import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { legacyRedirect } from "../shared/routes";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Maintenance from "./pages/Maintenance";
import ServiceArea from "./pages/ServiceArea";
import Faq from "./pages/Faq";
import Gallery from "./pages/Gallery";
import Referrals from "./pages/Referrals";
import Testimonials from "./pages/Testimonials";
import Book from "./pages/Book";
import NotFound from "./pages/NotFound";

function LegacyRedirect() {
  const { pathname, search, hash } = useLocation();
  return <Navigate to={legacyRedirect(pathname, search, hash) ?? "/"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="membership" element={<LegacyRedirect />} />
        <Route path="service-area" element={<ServiceArea />} />
        <Route path="faq" element={<Faq />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="book" element={<Book />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
