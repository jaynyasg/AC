/**
 * Real before/after job photos for the Gallery page. Site-only content (the bot
 * does not read this). Empty until John provides real photos — until then the
 * Gallery shows an honest "coming soon" state, never fabricated or mislabeled work.
 *
 * To add an entry: drop the images under `public/assets/work/` and add an object
 * below. `beforeAlt`/`afterAlt` are REQUIRED — before/after AC photos look alike,
 * so meaningful alt text is needed for accessibility (WCAG 1.1.1).
 */
export type BeforeAfter = {
  beforeImg: string;
  afterImg: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  description: string;
};

export const BEFORE_AFTER: readonly BeforeAfter[] = [];
