/** Canonical page for the combined maintenance program and membership plans. */
export const MAINTENANCE_PATH = "/maintenance";

const CHECKOUT_STATUS = ["success", "cancel"] as const;
export type CheckoutStatus = (typeof CHECKOUT_STATUS)[number];

/** Stripe success/cancel return, always on the combined page. */
export function checkoutReturnUrl(base: string, status: CheckoutStatus): string {
  return `${base.replace(/\/+$/, "")}${MAINTENANCE_PATH}?status=${status}`;
}

/**
 * Old in-page hashes that used to scroll the homepage. Kept so bookmarks and
 * shared links open the page that now owns that section.
 */
export const LEGACY_HASH_REDIRECTS: Record<string, string> = {
  "#services": "/services",
  "#maintenance": MAINTENANCE_PATH,
  "#area": "/service-area",
  "#contact": "/book",
  "#reviews": "/testimonials",
  "#tips": "/faq",
};

/**
 * Where an old membership URL or homepage hash should go, preserving the query
 * string (Stripe `?status=`) and any hash. Returns null when the URL is current.
 */
export function legacyRedirect(pathname: string, search = "", hash = ""): string | null {
  const bare = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (bare === "/membership") return `${MAINTENANCE_PATH}${search}${hash}`;
  if (bare === "/" && hash && LEGACY_HASH_REDIRECTS[hash]) return LEGACY_HASH_REDIRECTS[hash];
  return null;
}
