/**
 * The AC CSR knowledge base — the single source of truth for company facts that
 * both the website and the chatbot draw from. Every fact here is grounded in
 * PRD.md / the CSR pdf. The bot may ONLY assert things derivable from this file.
 *
 * Deliberately ABSENT: what a referrer receives. That figure is shared privately
 * (PRD boundary) and never enters the model's context. `FORBIDDEN_DISCLOSURES`
 * below is the deterministic backstop in case the model invents one.
 */

export const COMPANY = {
  name: "DI Felice's HVAC Corp.",
  owner: "John Di Felice",
  phone: "832-726-7401",
  email: "difeliceshvac@gmail.com",
  license: "TACLA85527C",
  area: "Houston, TX and surrounding areas",
  tagline: "Quality Comfort, Family First!",
  experienceYears: 15,
  diagnosticFee: 125,
  brands: ["Generac", "Lennox", "Rheem", "Carrier"],
  scope: "Commercial & Residential — Installation & Repair — Licensed & Insured",
  hours: [
    { days: "Mon–Fri", time: "8am – 5pm" },
    { days: "Saturday", time: "9am – noon" },
    { days: "Sunday", time: "Closed" },
  ],
} as const;

/** The CSR diagnostic triage questions, verbatim intent from `CSR ai building.pdf`. */
export const TRIAGE_QUESTIONS: readonly string[] = [
  "What specifically is your system doing — strange noises, blowing warm air, or not turning on (inside or outside)?",
  "Did this happen suddenly, or did it worsen over time?",
  "How old is your system?",
  "When did you last change your air filter?",
  "Has any other home-service company (roofing, siding, landscaping) worked on your house recently?",
  "Is your system leaking water outside?",
  "Does your system keep running nonstop?",
  "Is there an odor when it starts (musty or burnt smell)?",
  "Would we need a ladder for access?",
  "On a scale of 1–10, how severe is the issue?",
  "Is there ice forming at the outdoor condenser connections?",
  "When did an AC company last service your equipment?",
  "Does your main breaker trip when the AC starts?",
  "What do you normally keep your thermostat set to?",
];

/** Homeowner FAQ / maintenance tips (PRD FAQ section). */
export const FAQ_TIPS: readonly string[] = [
  "Check and replace your air filter every 3 months to keep airflow healthy and avoid stressing the system.",
  "Every 6 months, flush the primary drain line with about a cup of bleach in a gallon of hot water to prevent clogs and drainage issues.",
  "Turn your AC off during severe thunderstorms — a power surge or abrupt cutoff can damage expensive components.",
  "Keep plants, trees, and debris at least 2 feet away from the outdoor condenser for proper airflow.",
  "Don't let pets urinate on the outdoor unit — it corrodes the coil and can cause a refrigerant leak.",
];

export const SERVICES = {
  diagnostic:
    "Our diagnostic fee to come out and pinpoint the issue is $125. Think of it as an investment toward the repair — the $125 is credited toward fixing your issue, now or later. If repairs cost more than you can manage right now, the fee still applies when you're ready.",
  financing: "Financing options may be available in certain circumstances.",
  freeEstimates:
    "Estimates on new AC systems and Generac generators are free. We perform real heat-load calculations for each space — not a rule-of-thumb guess — so your system is sized correctly for lasting comfort.",
  maintenance:
    "Our bi-yearly maintenance program covers a Spring A/C tune-up and a Fall heating tune-up — priority scheduling, discounted repairs, reduced diagnostic fees, and longer equipment life. Multiple units are discounted per additional unit.",
} as const;

/** Bi-yearly maintenance program details (PRD Maintenance section). */
export const MAINTENANCE = {
  benefits: [
    "Lower energy bills",
    "Fewer unexpected breakdowns",
    "Longer equipment lifespan",
    "Improved indoor air quality",
    "Priority service during peak seasons",
    "Maintaining manufacturer warranty",
  ],
  springTuneUp: [
    "Check refrigerant levels and system pressures",
    "Inspect condenser coil and clean if necessary",
    "Test compressor and capacitor operation",
    "Inspect electrical components and tighten connections",
    "Check thermostat operation and calibration",
    "Inspect condensate drain and flush if needed",
    "Check air filter condition",
    "Measure temperature split across the coil",
    "Inspect outdoor unit for proper airflow",
  ],
  fallTuneUp: [
    "Inspect heat exchanger for cracks or damage",
    "Test safety controls",
    "Check gas pressure and burner operation",
    "Inspect ignition system",
    "Test blower motor and airflow",
    "Check thermostat operation",
    "Inspect flue and venting",
    "Inspect electrical connections",
    "Replace or inspect air filter",
  ],
  memberBenefits: [
    "Priority Scheduling — skip the long wait during busy seasons",
    "Discounted Repairs — save on parts and labor",
    "Reduced Diagnostic Fees",
    "Extended Equipment Life",
    "System Performance Reports",
  ],
} as const;

/**
 * Membership / plan offerings — the single source of truth for the website, the
 * checkout endpoint, and the chatbot. This is authoritative for plan names and
 * pricing (the `MAINTENANCE` block above stays the detailed tune-up checklist).
 *
 * - `price` is the DISPLAY string; the owner keeps it in sync with the Stripe
 *   Price object whose id lives in the `priceEnv` var (display ≠ charge is an
 *   accepted manual boundary).
 * - `key` is the only thing the client sends to /api/checkout; the server maps it
 *   to the env Price id (never trust a client-sent price/amount).
 * - `mode` follows the Stripe price type: "payment" for one-time, "subscription"
 *   for recurring.
 * Wording avoids the FORBIDDEN_DISCLOSURES triggers (no gift/reward/bonus or
 * referral language near a number) so bot replies quoting these never get redacted.
 */
export const MEMBERSHIP_PLANS = [
  {
    key: "tuneup",
    name: "One-Time Tune-Up",
    price: "$89.95",
    cadence: "one-time",
    mode: "payment",
    priceEnv: "STRIPE_PRICE_TUNEUP",
    blurb: "A single comprehensive tune-up to get your system running its best — no commitment.",
    featured: false,
    features: [
      "One full multi-point system tune-up",
      "Performance and safety inspection",
      "Cleaning and calibration",
    ],
  },
  {
    key: "seasonal",
    name: "Seasonal Plan",
    price: "$159.95",
    cadence: "year",
    mode: "subscription",
    priceEnv: "STRIPE_PRICE_SEASONAL",
    blurb: "Two tune-ups a year — Spring A/C and Fall heating — with priority scheduling.",
    featured: false,
    features: [
      "Two tune-ups per year (Spring A/C + Fall heating)",
      "Priority scheduling during peak seasons",
      "Longer, healthier equipment life",
    ],
  },
  {
    key: "comfort",
    name: "Comfort Membership",
    price: "$19.95",
    cadence: "month",
    mode: "subscription",
    priceEnv: "STRIPE_PRICE_COMFORT",
    blurb: "Year-round peace of mind: two visits, priority scheduling, and 20% off repairs.",
    featured: true,
    features: [
      "Two tune-ups per year (Spring + Fall)",
      "Priority scheduling during peak seasons",
      "20% off repairs",
    ],
  },
] as const;

export type MembershipPlan = (typeof MEMBERSHIP_PLANS)[number];
export type PlanKey = MembershipPlan["key"];

/**
 * Warranty facts (PRD + owner). Surfaced on the Services page and in the bot KB.
 * Worded to avoid the FORBIDDEN_DISCLOSURES guard triggers.
 */
export const WARRANTIES: readonly string[] = [
  "Every new installation includes the manufacturer's parts warranty, plus a 2-year labor warranty we provide directly to homeowners.",
  "Depending on the equipment brand you choose, coverage typically includes up to a 10-year parts warranty — which we register with the manufacturer on your behalf.",
];

/**
 * Owner-supplied links. Empty until provided; the UI and bot render these CTAs
 * ONLY when non-empty, so nothing ever points to a dead URL. `googleReview` is
 * bot-relevant (the bot may share it); `manageMembership` is the Stripe hosted
 * Customer Portal login link (site footer only).
 */
export const LINKS = {
  googleReview: "",
  manageMembership: "",
} as const;

/**
 * Deterministic guard input (claim C6). The referral REWARD must never be
 * disclosed. These patterns are what the guard redacts if the model ever emits a
 * referral-reward amount. The bot is also told (in the system prompt) never to
 * state one. Patterns are matched case-insensitively against the reply text.
 */
export const FORBIDDEN_DISCLOSURES: readonly RegExp[] = [
  // A percentage or dollar figure mentioned together with referral/reward language.
  /referr?\w*[\s\S]{0,80}(\d{1,3}\s?%|\d{1,3}\s?percent|\$\s?\d)/i,
  /(\d{1,3}\s?%|\d{1,3}\s?percent|\$\s?\d)[\s\S]{0,80}referr?\w*/i,
  /(gift|reward|bonus|kickback|commission)[\s\S]{0,60}(\d{1,3}\s?%|\d{1,3}\s?percent|\$\s?\d)/i,
];

/** The safe line the bot/guard uses when asked what a referrer receives. */
export const REFERRAL_SAFE_LINE =
  "We do show our appreciation for referrals, but John shares those details personally — " +
  `give us a call at ${COMPANY.phone} and we'll fill you in.`;
