/**
 * Site-wide configuration. Change values here rather than in components.
 */

/**
 * Google Play listing URL. While `null`, every "Get it on Google Play" CTA
 * opens the Coming Soon modal. On launch day, set this to the listing URL and
 * every CTA becomes a normal outbound link.
 */
export const PLAY_STORE_URL: string | null = null;

export const PRODUCT_NAME = "Doom Tracker";

export const PRODUCT_VERSION_LABEL = "V1 · In development";

/**
 * Contact for privacy questions. `null` renders a placeholder on /privacy
 * that must be resolved before public launch.
 */
export const PRIVACY_CONTACT_EMAIL: string | null = null;

/** Date shown on the privacy page. Update whenever the policy text changes. */
export const PRIVACY_LAST_UPDATED = "2 October 2026";

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const SITE = {
  url: resolveSiteUrl(),
  title: "Doom Tracker — Every scroll has a price",
  description:
    "An Android screen-time app that turns doomscrolling into an opportunity-cost bill, priced against your own goals. Local-first. Currently in V1 development.",
} as const;
