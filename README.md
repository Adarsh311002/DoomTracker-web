# Doom Tracker — Showcase Website

> This repository contains the public showcase website for Doom Tracker. The actual Doom Tracker Android application is maintained separately in a private repository.
>
> If deeper implementation details from the mobile application are needed, access to the private repository can be provided with permission.

## Private Mobile Application Notice

- **This repository is the website only.** It is a static Next.js site that explains the product, demonstrates the opportunity-cost model interactively, shows the app's screens, and publishes the privacy policy. It contains no Android code and no part of the app's build.
- **The Android app is separate and private.** It is intentionally not linked from this repository or from the rendered website.
- **Why this README is long.** The goal is that a developer or recruiter can understand what Doom Tracker is and how it is built from this one file, without needing the private repository. Sections 1–13 describe the mobile app. Sections 14–19 describe this website.
- **Where the website and the app meet.** The opportunity-cost algorithm in `lib/allocate.ts` mirrors the app's implementation, and the phone mockups are recreated from the app's design references. Everything else on the site is website-only code.

---

## 1. What is Doom Tracker?

Doom Tracker is an Android-first screen-time analytics and productivity application.

Most screen-time tools report a number ("3h 12m on Instagram") and stop there. That number is easy to shrug off. Doom Tracker's goal is not just to report time. It converts distracting-app usage into an **opportunity cost** measured against goals the user chose.

```
screen time
   ↓
doomscroll time
   ↓
opportunity cost
   ↓
coding / reading / exercise goals
```

**Example.** A user sets Coding at 60 min/day, Reading at 30 min/day and Exercise at 45 min/day. After 97 minutes of doomscrolling, the app reports that the time would have paid for the whole coding hour, the whole reading session and a start on exercise. It doesn't just say "1h 37m".

**Why it exists.** The product bet is that a trade-off is more motivating than a total. "You lost 97 minutes" is abstract. "That was your coding hour and your reading" is concrete, and it is priced in the user's own priorities.

## 2. Core Product Idea

Doom Tracker distinguishes three tiers of usage.

| Tier | Meaning |
|---|---|
| **Normal app usage** | Any app session. Recorded, but ignored for doomscroll totals. |
| **Risk-app usage** | A session on an app from the risk list. |
| **Doomscrolling** | Risk-app usage that is long enough to count. |

The V1 rule is a single, deterministic filter:

```
risk app
   +
session duration ≥ 2 minutes
   =
doomscrolling
```

- A qualifying session counts at its **full duration**. There is no partial counting or truncation.
- A session shorter than 2 minutes counts as zero, however many times the app was reopened.
- One global threshold applies to every app. There are no per-app thresholds.
- Time of day does not affect whether a session counts.

**Risk apps in V1:** Instagram, YouTube, TikTok and Reddit.

The list is **developer-curated**. It is matched on exact Android package name, shipped with the app, and not user-editable in V1. An app that isn't on the list never counts, which is the expected outcome for most apps on any phone.

**What this does not do.** Doom Tracker does not use machine learning. It does not identify individual Reels or Shorts, and it does not see screen content. It knows which app was in the foreground and for how long, and nothing more. "Doomscrolling" in V1 is derived from session patterns, not from content inspection.

## 3. Main User Experience

The app has four main sections and a short onboarding flow (intro, explanation, Usage Access permission, goal setup).

### Today

- Today's doomscroll total, shown as a large hero number.
- A badge comparing today with the average of the previous six *completed* days. Today is excluded from that baseline.
- A "What it cost you" bar showing how today's minutes were spent across goals.
- A last-7-days bar chart with the worst day highlighted.
- A per-app breakdown ("where it went").

### The Bill

A period selector switches between **Today**, **7 Days** and **30 Days**. Goal targets are scaled to the period:

```
daily target × number of days = period target
```

For each goal the Bill shows its period target and how much of it the doomscrolled time could have funded, as a percentage.

### Trends

V1 has a single **Month (30-day)** view:

- A bar for each of the last 30 days, with the in-progress day shown as an outline.
- The daily average.
- The best day (fewest minutes) and the worst day (most minutes).

Day and Week views were removed because they weren't implemented.

### Goals

Users can:

- add goals
- remove goals
- rename goals
- reorder goals
- change each goal's daily target, in 5-minute steps

**Goal order is priority order.** Reordering is a meaningful action: it changes which goals the doomscrolled minutes fund first. The Goals screen also holds the protected-window toggles (section 5), and the permission and data controls (replay onboarding, open Usage Access settings, delete all data).

## 4. Opportunity-Cost Engine

This is the product's central piece of logic. It is a small, pure function that turns a total number of minutes into a per-goal funding result.

**Inputs**

- An ordered list of goals. Order is priority, and position 1 is highest.
- Each goal's daily target in minutes.
- The total doomscrolled minutes for the period being priced.
- The number of days in that period.

**Algorithm**

```
remaining = total doomscrolled minutes for the period

for each goal, in priority order:
    period_target = daily_target × days_in_period
    allocated     = min(remaining, period_target)
    funded_%      = allocated / period_target × 100
    remaining     = remaining − allocated

unallocated = remaining
```

**Worked example** (one day, goals ordered Coding, Reading, Exercise, 97 minutes doomscrolled):

| Goal | Daily target | Allocated | Funded |
|---|---|---|---|
| Coding | 60 | 60 | 100% |
| Reading | 30 | 30 | 100% |
| Exercise | 45 | 7 | 16% |
| *Unallocated* | | *0* | |

**Properties**

- **Sequential and priority-ordered.** Swap Exercise to the top of the list and the same 97 minutes fund Exercise fully (45), Coding for 52 of its 60 minutes (87%), and Reading not at all.
- **Scales with the report length.** For 7 days, Coding's target is 420 minutes rather than 60.
- **No goal can exceed 100%.** There is no overflow stacking onto an individual goal.
- **Leftover time stays unallocated.** If minutes remain after every goal is fully funded, they are reported as a separate "unallocated" value, not added to the last goal.
- **Edge cases are defined.** Zero minutes means every goal is 0% funded. An empty goal list leaves everything unallocated. A zero-minute target is treated as already fully funded and consumes nothing, so it can't cause a division by zero.
- **Deterministic and stateless.** The same inputs always produce the same output, and nothing is remembered between calls. It is therefore independent of whether reordering goals should retroactively change past results, because no past results are stored.
- **Pure domain logic.** It has no dependency on Android, the database, React or the UI, so it can be tested in isolation.

This is plain arithmetic, not AI or inference.

## 5. Protected Windows

A goal can carry a **protected window**, a fixed daily time range such as Coding, 09:00–11:00.

Protected-window analysis:

- finds risk-app sessions that overlap the window (any part of the session intersecting the range counts)
- applies to risk-app usage broadly, whether or not a given session is long enough to count as doomscrolling
- is **retrospective**: it reports on usage that has already been recorded
- does **not block** any application
- does **not send real-time interventions or live alerts**
- does **not alter the opportunity-cost calculation**. A session inside a window is priced exactly like any other session of the same length.

The Goals screen shows, for each enabled window, how many minutes of risk-app use today fell inside it.

**Current development limits.** In V1, protected windows come with the default goals (Coding 09:00–11:00, Reading 22:00–22:30) and can be switched on or off. Users cannot yet create or edit window times, and new goals start without a window. Windows are same-day ranges only, with no crossing midnight.

## 6. Technical Architecture

The app has four layers. Each depends only on the one below it, and the domain logic never knows which native API produced the sessions it processes.

```
Android OS
    ↓
UsageStatsManager  (OS-maintained app-usage event log)
    ↓
Usage events
    ↓
Kotlin native detection pipeline    ┐
    ↓                               │
Session reconstruction              │  Android native layer
    ↓                               │
Room (checkpoint, open, closed)     ┘
    ↓
TurboModule / native bridge
    ↓
React Native / TypeScript           ┐
    ↓                               │
Data layer                          │  JavaScript layer
    ↓                               │
Domain layer                        │
    ↓                               │
Today · Bill · Trends · Goals       ┘
```

### Android native layer

Written in Kotlin. It owns everything that needs the Android runtime.

- **UsageStatsManager and `queryEvents()`.** Android's OS records app foreground/background transition events continuously, whether or not Doom Tracker's process is running. The app reads that log through the event-level query API. A delayed read only delays when the app learns about a session. It doesn't lose data.
- **Usage Access permission.** `PACKAGE_USAGE_STATS` is a special permission granted only by the user in system Settings, never through a runtime dialog. The app checks it through `AppOpsManager`, can open the system Usage Access screen, and handles devices that lack that screen without crashing.
- **WorkManager.** A periodic job runs about every 15 minutes, which is Android's minimum interval. It is a unique, keep-existing job, so starting detection repeatedly has no extra effect. Detection starts automatically on launch and whenever the app returns to the foreground, but only if access has been granted. If access has been revoked, the job exits successfully and does nothing.
- **Checkpoint.** Each run resumes from the last processed timestamp, so no events are lost or processed twice. On the very first run the window is empty and tracking starts from that moment. There is no back-fill of earlier history.
- **Safe query boundary.** Each query stops a few minutes before "now", because Android hides the most recent events. The checkpoint advances only to the end of the window actually queried.
- **Open and closed sessions.** The pipeline carries sessions that were still open at the end of a run into the next run, and stores finished ones as closed sessions.

### Session reconstruction

Android provides low-level foreground and background events, not ready-made sessions. The reconstruction step pairs them:

```
foreground event  →  open a session
background event  →  close it  →  (package, start, end)
```

Details that matter for correctness:

- **Events are normalised first.** Events with invalid timestamps are dropped without failing the batch.
- **Duplicate resume events are ignored.** A repeated "foreground" for an app that is already open does not start a second session.
- **Open sessions persist across polling runs.** If a session is still open when a query window ends, it is stored and completed by a later run.
- **No fabricated end times.** If a session cannot be legitimately closed, for example after a device shutdown, it is discarded rather than given an invented end time.
- **Incremental, checkpoint-based processing.** Each run only handles events since the last checkpoint.
- **Classification-agnostic.** Reconstruction produces sessions for whatever apps appear in the log. Deciding which of them count is a separate, downstream step.

### Room

Native persistence uses Room (SQLite) and holds three conceptual things:

| Store | Contents |
|---|---|
| **Checkpoint** | A single timestamp: the last processed point in the event log. |
| **Open sessions** | Sessions still open at the end of the last run. Fully replaced each run. |
| **Closed sessions** | Append-only history of finished sessions: package name, start, end, and a source tag. |

**Raw Android events are not persisted.** Only reconstructed sessions are. A session is a cleaner abstraction than a stream of transitions: it is what every downstream calculation needs, it is far smaller to store, and it keeps the storage format independent of any one Android API. The source tag leaves room to add another detection source later without changing the layers above.

**Storage is not filtered by risk app.** Every reconstructed session is stored. Classification happens when data is read, so changing the classification rules never requires re-collecting data. The current version has no retention or pruning policy, so history accumulates until the user deletes it.

Range reads use overlap semantics: a session is returned if any part of it falls inside the requested range, so a session crossing midnight appears in both days.

### Native bridge

React Native talks to Android through a single typed native module (a TurboModule, on React Native's New Architecture). The module's conceptual API:

| Method | Purpose |
|---|---|
| `getUsageAccessStatus()` | Whether Usage Access is currently granted |
| `openUsageAccessSettings()` | Open the system settings screen for it |
| `startDetection()` | Schedule the periodic background job |
| `stopDetection()` | Cancel it |
| `getClosedSessions(start, end)` | Closed sessions overlapping a time range |
| `clearAllData()` | Delete the checkpoint, open sessions and closed sessions |

The session query is **range-based, not tied to "today"**. Because the bridge answers "give me sessions between A and B", the same call serves Today, the 7- and 30-day Bill, and the 30-day Trends chart. That avoids a separate native query for each screen.

The JavaScript wrappers around the module never throw on read failures. If the native module is missing or a read fails, they resolve to an empty result and the screens render a zero-usage state. Deleting data is the exception: a failure there is surfaced to the user.

### Data layer

A thin TypeScript layer between the bridge and the domain logic:

- **Arbitrary date ranges.** Calendar-day ranges (today) and rolling ranges (last N days, or the previous N completed days excluding today).
- **Range session fetching.** React hooks that request sessions for a range.
- **Day bucketing.** Sessions are grouped by local calendar day. Each session belongs to exactly one day (the day it started), and bucketing stays correct across daylight-saving changes.
- **Stale-response protection.** If the requested range changes while a read is in flight, the late response is discarded so it can't overwrite newer data.

### Domain layer

Framework-independent TypeScript with no React Native, database or Android imports. It contains:

- risk-app classification
- the doomscroll heuristic
- aggregation (totals, per-app minutes)
- daily statistics (best, worst, average, in-progress day)
- opportunity-cost allocation
- protected-window overlap

Because every module is a pure function of its inputs, the whole layer is tested without a device, an emulator or a database. It is the part of the system with the strictest correctness requirements, and it is the cheapest to verify.

### UI layer

- **Onboarding** (four steps): intro, explanation, Usage Access permission, goal setup. The permissions step shows live access status and re-checks it when the user returns from Settings.
- **Four main screens:** Today, The Bill, Trends, Goals.
- **Shared components** built to a single design-token set: bar chart, progress bar, segmented control, stepper, toggle, cards, and halftone textures.
- **State management** is React Context with plain `useState`. There is no external state library, no navigation library (tabs and onboarding steps are state-driven), and nothing renders until persisted state has loaded, so no screen ever shows pre-load defaults.

## 7. Technology Stack

| Technology | Purpose | Why |
|---|---|---|
| React Native | UI and application layer | React-based mobile UI with direct native Android integration. Bare workflow, New Architecture enabled. |
| TypeScript | App and domain logic | Type safety, plus business logic that is testable without a device. |
| Kotlin | Android-native layer | Direct access to Android APIs that React Native cannot reach. |
| UsageStatsManager | Usage source | Provides OS-level app foreground/background events with a small privacy footprint. |
| WorkManager | Background processing | Periodic retrospective work without a foreground service. |
| Room | Native persistence | Structured, timestamped session and checkpoint storage with range queries. |
| AsyncStorage | App state | Goals, onboarding state and other small local product state. |
| TurboModule | Native bridge | A typed React Native to Android boundary. |
| React Context | Global app state | The V1 state surface is small enough not to need an external library. |
| Vitest | Domain and data tests | Fast testing of pure functions. |
| Jest | React Native tests | Component, hook and state testing. |
| JUnit / Robolectric | Native tests | Kotlin and Android behaviour tested on the JVM. |

## 8. Why These Architectural Choices?

### Why UsageStatsManager?

V1 needs to know **which app was in the foreground and for how long**. It does not need to know what the user was looking at. The system log answers the first question completely, costs little battery because it is queried rather than monitored, and exposes only app identity and timing. It also keeps working when Doom Tracker's own process has been killed, because the OS keeps recording.

### Why not AccessibilityService?

It was deliberately left out of V1:

- **Larger privacy surface.** It can observe on-screen content across apps, which is far more than the product needs.
- **Battery cost.** Continuous observation costs more than reading an OS log.
- **Platform and policy complexity.** Using it for a non-accessibility purpose carries a heavier review and disclosure burden on Google Play.
- **UI fragility.** Telling Reels or Shorts apart from other content would depend on other apps' internal, undocumented UI identifiers, which change between updates and fail silently when they do.

It is a possible future extension, not a rejected one. The detection layer sits behind a generic session interface so a richer source could be added later without rewriting the layers above.

### Why WorkManager instead of a foreground service?

V1 is **retrospective, not real-time**. It reads recorded usage periodically, so it doesn't need a continuously running service and the persistent notification that would come with one. The trade-off is stated honestly: scheduled work is not guaranteed to run at exact intervals, and Android may defer it under Doze or App Standby. The effect is that data appears after the next successful run, not that data is lost.

### Why Room instead of AsyncStorage for sessions?

Session data is structured, timestamped history that is queried by time range and written transactionally. A real database handles overlap queries, atomic replacement of open sessions and atomic deletion. Key-value storage would force the app to load and filter everything in JavaScript.

### Why AsyncStorage for goals and onboarding?

That data is small, app-level state: a handful of goals and a flag. It is not an analytics database, and a key-value store is the right size for it.

### Why no backend?

V1 doesn't need accounts, cloud sync, server-side computation or shared user data. Everything it computes can be computed from the device's own usage log, so the product can remain entirely local. That also removes a whole class of privacy and operational concerns.

### Why a pure domain layer?

Business rules should be testable without Android, a database or a UI. Keeping classification, aggregation, allocation and overlap as pure functions means the rules that define the product can be verified quickly and exhaustively, and refactored safely.

## 9. Complete End-to-End Flow

```
User grants Usage Access
   ↓
Doom Tracker starts detection
   ↓
WorkManager periodically runs
   ↓
Checkpoint determines where to resume
   ↓
UsageStatsManager.queryEvents()
   ↓
Events normalised
   ↓
Sessions reconstructed
   ↓
Room stores sessions
   ↓
React Native requests a time range
   ↓
TurboModule returns closed sessions
   ↓
Risk-app classification
   ↓
Doomscroll classification
   ↓
Aggregation
   ↓
Daily bucketing, when a chart needs it
   ↓
Opportunity-cost calculation
   ↓
Today / Bill / Trends render the results
```

**A concrete example**

```
Instagram used from 10:00 → 10:25
   ↓
25-minute session
   ↓
Instagram is a risk app
   ↓
25 ≥ 2 minutes
   ↓
25 doomscroll minutes
   ↓
Included in today's total
   ↓
Included in the opportunity-cost calculation
```

If the same app had been open for 90 seconds instead, the session would be stored, but it would contribute zero doomscroll minutes. And a 22-minute Google Maps session would be stored but never classified as doomscrolling, because that app is not on the risk list.

## 10. Persistence Model

Two local systems, with different jobs.

### Room: usage and detection state

- the checkpoint
- open sessions
- closed sessions

### AsyncStorage: product state

- onboarding completion
- the goal list, in priority order
- each goal's name and daily target
- each goal's protected-window setting and whether it is enabled

Every value read back from storage is validated. Corrupt or unrecognised data falls back to defaults, and an older saved format for protected windows is migrated automatically on load.

### Deleting data

"Delete all my data" touches both systems, in a deliberate order:

1. The native side wipes the checkpoint, open sessions and closed sessions in **one database transaction**.
2. Only if that succeeds does the app reset goals and onboarding.
3. If the native wipe fails, the user sees an error and nothing is reset, so the app never reports a deletion that did not happen.

## 11. Privacy / Local-First Design

Based on V1 behaviour only:

- **No account.** There is no sign-up or login.
- **No Doom Tracker backend.** There is no Doom Tracker server for data to go to.
- **No network requests from the app's own code.** The Android manifest does declare the `INTERNET` permission, but it comes from the React Native project template, where it supports the development build server. No app feature uses it.
- **Usage data is stored locally**, in the on-device Room database.
- **Goals and settings are stored locally**, in AsyncStorage.
- **Automatic Android app backup is disabled**, so this data isn't included in Android cloud backups of the app.
- **The user can delete everything** from inside the app (section 10).
- **Usage Access is user-controlled.** It can only be granted, and revoked, in system Settings, and the background job checks it on every run.
- **No AccessibilityService.** The app reads only app identity and session start and end times. It cannot see screen content, text, messages, scroll activity or which video or post was viewed.

This describes how V1 behaves. It is not a guarantee of absolute security and not a legal statement. The website publishes a draft privacy policy at `/privacy`, which is to be reviewed before public launch.

## 12. Testing

The mobile project's tests are split by what they cover.

| Suite | Framework | Covers |
|---|---|---|
| Domain and data logic | Vitest | Classification and threshold boundaries, aggregation, day bucketing, date ranges, opportunity-cost allocation and its edge cases, protected-window overlap, label formatting, native-wrapper failure paths, persistence validation and migration |
| React Native UI and state | Jest | Goals CRUD and hydration, delete-all-data behaviour, onboarding screens, the range-fetch hook's stale-response guard, the detection lifecycle hook |
| Android native | JUnit + Robolectric | Session reconstruction, checkpoint behaviour, event normalisation, permission handling, Room storage |

The project is also covered by TypeScript type-checking and ESLint.

**What is not claimed.** The detection pipeline has been verified with unit and component tests. It has **not yet been verified end to end on physical devices**, and cross-version and cross-manufacturer behaviour is untested. Doing so is a remaining step before V1 is considered complete.

## 13. Current V1 Limitations

These are the current scope and deliberate design boundaries of V1, not hidden weaknesses.

- **Android only.** Detection is built on an Android API. There is no iOS version.
- **Not real-time.** Data appears after the next background run. The app cannot react at the moment a limit is crossed.
- **Background work can be delayed.** WorkManager runs about every 15 minutes at best, and Android may defer it under Doze or App Standby.
- **No screen-content awareness.** The app sees apps, not content.
- **Cannot detect individual Reels or Shorts.** It can only tell that Instagram or YouTube was open.
- **Fixed, developer-curated risk-app list** of four apps. It is not user-editable.
- **No AccessibilityService**, by design (section 8).
- **No app blocking.**
- **No real-time intervention or live notifications.** The notifications toggle in onboarding is visual only.
- **No history back-fill.** Tracking begins when it is first started.
- **No data-retention policy yet.** Session history is kept until the user deletes it.
- **Protected windows are not user-editable yet** (section 5).
- **Some narrative and insight areas are still in development.** Streaks, coach insights, the Bill's narrative sentence, its plain-unit conversions and running balance, and Trends' pattern insights and month-over-month comparison are placeholders in V1.
- **Not published on Google Play yet.**
- **End-to-end real-device validation is pending** (section 12).

## 14. This Showcase Website

This repository is the public website. It:

- explains and promotes Doom Tracker
- demonstrates the opportunity-cost model with an interactive minutes slider and reorderable goals
- shows the product's four screens as phone mockups, including a working Bill period switch and working Goals steppers and toggles
- visualises protected windows against an illustrative day
- publishes the draft privacy page
- provides a "Get it on Google Play" button that currently opens a Coming Soon dialog
- is fully independent of the mobile project: it deploys on its own and nothing is imported from the app at build time or runtime

**Illustrative data.** Every number in the phone mockups and demos is demonstration data from `lib/demo.ts`, and each place that shows it is labelled "Illustrative data". The site publishes no real user data, usage counts, ratings, testimonials or performance metrics, because none exist.

**What is shown from the app, and what is left out.** The mockups are recreated in React from the app's design references, and show only elements that are data-driven in V1. Elements that are placeholders in the app (streaks, coach insight, Bill narrative, plain units, running balance, Trends insights and month-over-month badge) are omitted. Per-app breakdowns use app names only, because the app cannot tell Reels or Shorts.

**How the demos relate to the app.**

- `lib/allocate.ts` mirrors the mobile app's allocation function. It was ported line for line and checked against the app's own allocation test cases, so the slider and goal ordering demonstrate the real semantics.
- Formatting and daily-statistics helpers are ports of the app's equivalents.
- The protected-window helper is simplified to one illustrative day but keeps the same overlap semantics.
- The plain-English sentence under the opportunity-cost demo is website copy. The app does not generate it.

**Website stack**

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, with design tokens under `@theme` in `app/globals.css` |
| Animation | Motion (`motion/react`), honouring `prefers-reduced-motion` |
| Fonts | Anton, Space Mono and Space Grotesk through `next/font` |
| Rendering | Static. Every route is prerendered. |
| Hosting | Vercel |

There is no backend, API layer, database, CMS, authentication or analytics.

## 15. Website Structure

```
app/
  layout.tsx              Root layout, fonts, site metadata
  page.tsx                Landing page (composes the sections)
  privacy/page.tsx        The /privacy page
  opengraph-image.tsx     Generated social preview image
  icon.svg, sitemap.ts, robots.ts
  globals.css             Design tokens, textures, motion and reduced-motion rules
components/
  sections/               One file per landing-page section
  phone/                  CSS phone frame + Today / Bill / Trends / Goals screens
  opportunity/            Draggable goal row for the interactive allocation demo
  goals/                  Protected-window timeline
  ui/                     Primitives: labels, badges, cards, charts, toggle, sunburst
  cta/                    Play Store button + Coming Soon modal
  layout/                 Header (with the Privacy link), footer, logo, Motion provider
lib/
  allocate.ts             Opportunity-cost allocation, mirroring the mobile app
  stats.ts, format.ts     Daily statistics and formatters
  protected.ts            Protected-window overlap for the demo day
  explain.ts              Plain-English readout for the allocation demo
  demo.ts                 All illustrative demo data
  config.ts               Launch flags, URLs, site metadata
content/
  copy.ts                 All marketing copy
  privacy.ts              Privacy policy content
assets/fonts/             OFL font files, used only by the social-image renderer
docs/
  design-notes.md         Design decisions and the website's porting notes
  design-reference/       Design reference renders used as the visual spec
```

| Directory | What it holds |
|---|---|
| `app/` | Routes and site-wide setup. |
| `components/sections/` | The landing page, one file per section. |
| `components/phone/` | A CSS-built phone frame, and the four screens as React components. |
| `components/opportunity/` | The goal row used by the interactive demo. |
| `components/goals/` | The protected-window day timeline. |
| `components/ui/` | Reusable visual primitives for the design system. |
| `components/cta/` | The Play Store button and its accessible Coming Soon dialog. |
| `components/layout/` | Header, footer, logo and the Motion configuration provider. |
| `lib/` | Pure logic and configuration. It is kept out of components so it can be reasoned about on its own. |
| `content/` | All marketing and policy copy, centralised so the claims are easy to audit. |
| `docs/` | Design notes and reference renders. |

There is no `public/` directory: the site has no static image assets, because the phone screens are built in code.

## 16. Play Store Launch Behavior

`lib/config.ts` holds:

```ts
export const PLAY_STORE_URL: string | null = null;
```

- **Currently (`null`):** every "Get it on Google Play" button opens a "Coming soon to Android" modal. It uses a native `<dialog>`, traps keyboard focus, closes on Escape or a backdrop click, and returns focus to the button that opened it.
- **Later:** set `PLAY_STORE_URL` to the real listing URL and every one of those buttons becomes a normal outbound link.

No other code change is required. The site uses a text button rather than the official Google Play badge until a real listing exists.

## 17. Local Development

Requires **Node.js 20.9 or later** (Next.js 16's minimum).

```sh
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # TypeScript, no emit
npm run lint         # ESLint
npm run build        # production build (static prerender)
npm run start        # serve the production build
```

## 18. Deployment

The site is designed for Vercel.

1. Import the repository into Vercel. The Next.js preset is detected and the default build settings work.
2. No environment variables are required.
3. Optionally set `NEXT_PUBLIC_SITE_URL` (for example `https://your-domain.com`) once a custom domain exists. It is used for canonical and Open Graph URLs. Without it, those use Vercel's production URL on Vercel, and `http://localhost:3000` locally.

The output is fully static, so no backend or serverless functions are needed for normal operation.

Before public launch, also set `PRIVACY_CONTACT_EMAIL` in `lib/config.ts` (currently `null`, so `/privacy` shows a placeholder line) and have the privacy policy reviewed.

## 19. Current Status

**Website**

- Implemented.
- Locally validated: typecheck, lint, production build and scripted browser checks for interactions, keyboard and reduced-motion behaviour, and layout at multiple widths.
- Ready for deployment and review.

**Mobile application**

- V1 is in active development.
- It lives in a private repository.
- It is not yet on Google Play.
- Its detection pipeline has unit and component tests but hasn't yet been verified end to end on physical devices.

**This website is not the app.** It describes Doom Tracker V1 as it currently exists and avoids promising anything beyond that. When this README and the app disagree, the app is the source of truth and this README should be corrected.
