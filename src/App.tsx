import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Maintenance from "./pages/Maintenance";
import Faq from "./pages/Faq";
import Gallery from "./pages/Gallery";
import Referrals from "./pages/Referrals";
import Membership from "./pages/Membership";
import Book from "./pages/Book";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="faq" element={<Faq />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="membership" element={<Membership />} />
        <Route path="book" element={<Book />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
