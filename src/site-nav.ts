/** Destinations shared by the header, the phone menu, and the footer. */

export type NavItem = { to: string; label: string };

/** Desktop header. Also listed first in the phone menu and the footer. */
export const PRIMARY_NAV: readonly NavItem[] = [
  { to: "/services", label: "Services" },
  { to: "/maintenance", label: "Maintenance & Membership" },
  { to: "/service-area", label: "Service area" },
  { to: "/book", label: "Contact" },
];

/** Phone menu and footer. Each one is its own page. */
export const MORE_NAV: readonly NavItem[] = [
  { to: "/faq", label: "FAQ" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/referrals", label: "Referrals" },
];

export const FOOTER_NAV: readonly NavItem[] = [...PRIMARY_NAV, ...MORE_NAV];
