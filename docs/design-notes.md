# Design notes

Working notes for the Doom Tracker showcase site. The mobile repository
(`github.com/Adarsh311002/DoomTracker`) is the source of truth for product
behaviour, terminology and visual identity. This site never imports code from it;
anything shared was copied and is noted below.

## What was taken from the mobile repo

| Item | Mobile source | Website location | How |
|---|---|---|---|
| Opportunity-cost algorithm | `src/domain/allocateOpportunityCost.ts` | `lib/allocate.ts` | Ported line-for-line. Verified against all 17 cases in the app's `allocateOpportunityCost.test.ts` (17/17 pass). |
| Daily stats (best/worst/avg) | `src/domain/dailyDoomscrollStats.ts` | `lib/stats.ts` | Ported. |
| Formatters | `formatDuration.ts`, `GoalRow.formatTarget`, `formatProtectedWindowLabel.ts`, `todayVsAverageLabel.ts` | `lib/format.ts` | Ported. |
| Protected-window overlap | `src/domain/protectedWindowOverlap.ts` | `lib/protected.ts` | Simplified to one illustrative day; same semantics (risk-app sessions of any length, same-day windows, informational only). |
| Default goals | `INITIAL_GOALS` in `src/state/AppStateContext.tsx` | `lib/demo.ts` | Copied: Coding 60 (09:00–11:00), Reading 30 (22:00–22:30), Exercise 45. |
| Colour tokens | `src/theme/tokens.ts` | `app/globals.css` `@theme` | Copied, plus three AA-contrast variants (below). |
| Textures | `src/theme/textures.ts` | `.tex-*` classes in `globals.css` | Re-created as CSS radial gradients. Page grain is 4px rather than 3px to avoid moiré on screens. |
| Sunburst | `src/components/Sunburst.tsx` | `components/ui/Sunburst.tsx`, `app/icon.svg` | Re-drawn as SVG. |
| Reference renders | `docs/design/*.png` | `docs/design-reference/` | Copied as the visual spec. **Not** served from `public/`: they contain placeholder content (e.g. "Instagram Reels", streak badges) that V1 can't produce. |

The Android launcher icon in the mobile repo is the stock template icon, so it
was not used. The favicon is a sunburst mark made for the site.

## Truthfulness ledger

Every phone mockup is recreated in React from the reference renders, keeping
only elements that are **data-driven in the V1 app**. Left out on purpose:

- **Today:** streak badge, the cost card's headline sentence, coach insight card, header date logic.
- **The Bill:** narrative sentence, "in plain units" grid, running balance.
- **Trends:** Day/Week tabs (removed from the app), "vs last month" badge, pattern insights, streak card.
- **Where it went:** app-level names only (Instagram, YouTube, Reddit). The reference says "Instagram Reels" / "YouTube Shorts", which the app cannot detect.

All demo numbers come from `lib/demo.ts`, are internally consistent (the 7-day
view is the tail of the 30-day view, the per-app minutes sum to today's total),
and every surface that shows them carries an **Illustrative data** tag.

The plain-English sentence under the interactive demo (`lib/explain.ts`) is
website copy. The app does not generate it.

Copy rules live at the top of `content/copy.ts`. Claims to never make: AI/ML,
Reels/Shorts detection, screen-content awareness, real-time monitoring, blocking,
notifications, accounts, a backend, cloud sync, iOS, or any usage metrics or
testimonials.

## Visual system

- **Palette:** cream `#F4F1E8`, ink `#101010`, cost `#F5411A`, protect `#2C93D8`, plus the soft variants from the app.
- **Contrast additions:** `#707070` muted text measures about 4.4:1 on cream, and `#F5411A` about 3.3:1, so small text on light backgrounds uses:
  - `label` `#5C5B57`
  - `cost-ink` `#C42D0B`
  - `protect-ink` `#17689F`
  The original colours remain for large display type, fills and text on dark backgrounds.
- **Type:**
  - Anton for display.
  - Space Mono for labels and metadata.
  - Space Grotesk for body text.
  - All three are self-hosted through `next/font`. The OG image renderer uses the OFL TTFs in `assets/fonts/`.
- **Shape:** 2px ink borders, square corners and hard offset shadows. The phone bezel is the only rounded shape, because it depicts a device.
- **Band rhythm:** ink hero → cream → white → cream → ink showcase → cream → ink → protect-fill privacy → ink → ruled cream → orange CTA → ink footer.

## Motion

- **Hero entrance** runs in CSS keyframes (`.rise`, `.rise-line`, `.spin-in`), so it plays before hydration and doesn't delay LCP.
- **Everything else** uses Motion (`motion/react`):
  - section reveals (`Reveal`)
  - bar growth
  - count-ups (`AnimatedNumber`)
  - showcase screen swaps
  - drag-to-reorder (`Reorder`)
  - toggle knobs
- **Button press** is plain CSS (`.press`). It needs no JS and feels more immediate.
- **Reduced motion:**
  - `MotionConfig reducedMotion="user"` drops Motion's transform and layout animations but keeps opacity.
  - A global CSS rule collapses keyframes and transitions.
  - Scripted checks confirm no element is left offset or hidden.

## Architecture decisions

- **Static.** All routes prerender (`○`), including `/opengraph-image`, `/sitemap.xml` and `/robots.txt`. There is no backend, API, CMS or analytics.
- **Phone frame:**
  - Screens render at a fixed 360×740 logical canvas and are scaled to fit their container with a `ResizeObserver`, so the UI never reflows.
  - Decorative phones are `role="img"` + `inert`.
  - Interactive ones (Bill period switch, Goals steppers and toggles) are `role="group"`.
- **Sticky showcase:**
  - Desktop (`lg+`) pins one phone that swaps screens as the text steps cross the viewport centre.
  - Below `lg`, each step renders its own phone inline. The sticky column is `display:none`, so it isn't duplicated in the accessibility tree.
- **Coming Soon modal:**
  - Native `<dialog>` + `showModal()` makes the page inert and handles Escape.
  - On top of that: an explicit Tab trap, `aria-modal`, labelled and described-by, backdrop click to close, body scroll lock, and focus restored to the trigger.
- **No GitHub links:** the site deliberately links to no source repository. Don’t reintroduce one without a decision.
- **Privacy CTA:** the header carries a dedicated orange Privacy link to `/privacy` on every screen size. It’s a plain `<a>`, so it works without JS.
- **Play Store launch-day switch:** set `PLAY_STORE_URL` in `lib/config.ts` and every CTA becomes a normal link.
- **Real device screenshots:** to swap mockups for real screenshots later, replace a `Screen*` child of `PhoneFrame` with a `next/image`. The frame doesn't care what's inside.

## Open items

- **Production domain:** set `NEXT_PUBLIC_SITE_URL`, or rely on `VERCEL_PROJECT_PRODUCTION_URL` on Vercel. Until then, canonical and OG URLs fall back to localhost.
- **Privacy contact:** `PRIVACY_CONTACT_EMAIL` is `null`, so `/privacy` shows a placeholder line instead of an address.
- **Privacy review:** `/privacy` is a draft and needs review before launch.
- **Mockups:** replace with real-device screenshots once end-to-end device testing is done.
