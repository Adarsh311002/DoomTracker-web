# Doom Tracker — Website

A product showcase website for the Doom Tracker Android screen-time analytics app.

## What Doom Tracker is

Doom Tracker is an Android-first screen-time app. Instead of only reporting how long you spent on distracting apps, it prices that time against goals you set, such as Coding, Reading or Exercise, and shows what the time could have paid for instead:

```
screen time → doomscroll time → opportunity cost → your goals
```

In V1:
- **Usage data** comes from Android's `UsageStatsManager`. The app sees which app was in the foreground and for how long, never screen content.
- **What counts as doomscrolling:** a session on a developer-curated risk-app list (Instagram, YouTube, TikTok, Reddit) that lasts at least 2 minutes. The whole session counts.
- **Allocation:** doomscrolled minutes fund your goals in priority order. A goal can't exceed 100%, and leftover minutes are reported as unallocated.
- **Privacy:** there's no account and no backend. Usage data stays on the device.

The app lives in a separate repository: **https://github.com/Adarsh311002/DoomTracker**

## What this website is for

This repository is the public marketing site. It explains the idea, demonstrates the opportunity-cost model interactively, shows the app's screens, and publishes the privacy policy. It doesn't contain or run the app.

## Relationship to the mobile repository

- **Source of truth:** the mobile repository is the source of truth for product behaviour, terminology and visual identity. When the two disagree, the mobile repo wins, and this site should be updated.
- **Independent:** this repository doesn't import code from the mobile repo at build time or runtime, and it deploys on its own.
- **What was copied over:**
  - the opportunity-cost allocation function, ported line-for-line into `lib/allocate.ts` and checked against the app's 17 test cases
  - a few formatters and stat helpers
  - the design tokens
  - the reference design renders, kept under `docs/design-reference/` as a visual spec

  `docs/design-notes.md` records exactly what was copied and from where.
- **No repository links on the site:** the rendered website intentionally doesn't link to either GitHub repository. The mobile repository URL above is documentation only.

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, with design tokens under `@theme` in `app/globals.css` |
| Animation | Motion (`motion/react`), honouring `prefers-reduced-motion` |
| Fonts | Anton, Space Mono and Space Grotesk through `next/font`, self-hosted at build time |
| Rendering | Fully static. Every route is prerendered. |
| Hosting | Vercel |

There is no backend, API layer, database, CMS, authentication or analytics.

## Project structure

```
app/
  layout.tsx              Root layout, fonts, site metadata
  page.tsx                Landing page (composes the sections)
  privacy/page.tsx        /privacy
  opengraph-image.tsx     Generated social preview image
  icon.svg, sitemap.ts, robots.ts
  globals.css             Tokens, textures, motion and reduced-motion rules
components/
  sections/               One file per landing-page section
  phone/                  CSS phone frame + Today / Bill / Trends / Goals screens
  opportunity/            Draggable goal row for the interactive allocation demo
  goals/                  Protected-window timeline
  cta/                    Play Store button + Coming Soon modal
  layout/                 Header (incl. Privacy link), footer, logo, Motion provider
  ui/                     Primitives: labels, badges, cards, charts, toggle, sunburst…
lib/
  allocate.ts             Opportunity-cost allocation (ported from the app)
  stats.ts, format.ts, protected.ts, explain.ts
  demo.ts                 All illustrative demo data
  config.ts               URLs, launch flags, site metadata
content/
  copy.ts                 All marketing copy
  privacy.ts              Privacy policy content
assets/fonts/             OFL TTFs, used only by the OG image renderer
docs/
  design-notes.md         Design decisions, porting ledger, truthfulness rules
  design-reference/       Reference renders copied from the mobile repo
```

## Running locally

Requires Node.js 20.9 or later (Next.js 16's minimum).

```sh
npm install
npm run dev
```

Then open http://localhost:3000.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build (static prerender) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |

## The Play Store button

Doom Tracker isn't on Google Play yet. `lib/config.ts` holds:

```ts
export const PLAY_STORE_URL: string | null = null;
```

- **While it's `null`:** every "Get it on Google Play" button opens an accessible "Coming soon to Android" modal. It uses a native `<dialog>`, traps focus, closes on Escape or a backdrop click, and returns focus to the button.
- **After it's set to the real listing URL:** every one of those buttons becomes a normal outbound link. No other change is needed.

The site deliberately uses a text button rather than the official Google Play badge until a real listing exists.

## Privacy page

- `/privacy` is a draft privacy policy. Its content lives in `content/privacy.ts` and is sourced strictly from the mobile repository's actual data handling.
- It's linked from a dedicated Privacy button in the header on every screen size, and from the footer.
- **Must be reviewed before public launch.**
- **Contact address:** `PRIVACY_CONTACT_EMAIL` in `lib/config.ts` is `null`. The page shows a placeholder line until it's set.
- **Last-updated date:** `PRIVACY_LAST_UPDATED` controls the date shown on the page. Update it whenever the policy text changes.

## Deploying on Vercel

1. Import this repository into Vercel. The framework preset is detected as Next.js, and the default build settings work.
2. No environment variables are required.
   - Canonical and Open Graph URLs come from `NEXT_PUBLIC_SITE_URL` if it's set.
   - Otherwise they use Vercel's `VERCEL_PROJECT_PRODUCTION_URL`.
   - Locally they fall back to `http://localhost:3000`.
3. Optionally set `NEXT_PUBLIC_SITE_URL` (for example `https://your-domain.com`) once a custom domain exists.

The output is fully static, so no serverless functions are needed at runtime.

## Truthfulness

The website must describe Doom Tracker **V1 as it actually exists**.

- **Never claim:** AI/ML detection, Reels/Shorts detection, screen-content awareness, real-time monitoring, app blocking, live notifications, accounts, a backend, cloud sync, iOS support, download or user counts, ratings, or testimonials.
- **Phone mockups:** these are rebuilt in React from the reference designs. They show only elements that are data-driven in the V1 app. Placeholder parts of the references (streaks, coach insights, Bill narrative, "plain units", month-over-month comparisons) are left out.
- **Demo numbers:** all come from `lib/demo.ts`, and every surface that shows them is labelled **Illustrative data**.
- **Before editing copy:** read the rules at the top of `content/copy.ts`.

## Current status and limitations

- **Mobile app:** Doom Tracker V1 is in active development. The detection pipeline has unit and component tests but hasn't yet been verified end-to-end on real devices. It isn't published on Google Play.
- **App limits:** these are stated on the site under "Honest V1 limits".
  - Android only.
  - Not real-time; background checks run roughly every 15 minutes and Android may defer them.
  - No screen-content awareness.
  - The risk-app list is fixed.
  - No AccessibilityService, no blocking and no interventions.
- **Website open items:**
  - Set the production domain.
  - Add the privacy contact.
  - Get the privacy policy reviewed.
  - Replace the illustrative phone mockups with real device screenshots once they exist. `PhoneFrame` accepts any child, so this is a drop-in change.
