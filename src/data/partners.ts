/**
 * Trusted non-AC home-service partners John refers customers to. Site-only
 * content. Empty until John supplies a vetted list — until then the Networking
 * page shows an honest empty-state inviting customers to ask for a recommendation.
 * The private referral reward is NEVER stated here (hard boundary).
 */
export type Partner = {
  name: string;
  /** e.g. "Realtor", "Plumbing", "Electrical", "Foundation", "Remodeling", "Landscaping" */
  category: string;
  phone?: string;
  url?: string;
  blurb?: string;
};

export const PARTNERS: readonly Partner[] = [];
