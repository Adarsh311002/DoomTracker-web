/**
 * All major marketing copy lives here.
 *
 * TRUTHFULNESS: every statement must match the Doom Tracker V1 mobile
 * repository (README.md, docs/architecture.md, src/). Before adding a claim,
 * check it there. In particular, never claim: AI/ML, Reels/Shorts detection,
 * screen-content awareness, real-time monitoring, blocking, live
 * notifications, accounts, a backend, cloud sync, iOS, or any usage metrics.
 */

export const nav = {
  links: [
    { href: "#how-it-works", label: "How it works" },
    { href: "#the-bill", label: "The bill" },
    { href: "#privacy", label: "Privacy" },
    { href: "#under-the-hood", label: "Under the hood" },
  ],
};

export const hero = {
  eyebrow: "V1 · Android · In development",
  headlineLead: "Every scroll has a",
  headlineAccent: "price",
  body: "Doom Tracker tracks the time you lose to doomscrolling on Android, shows you where it went, and prices it against the goals you actually care about. Not a number. A bill.",
  primaryCta: "Get it on Google Play",
  secondaryCta: "View on GitHub",
  footnote: "Android only · No account · Usage data stays on your phone",
};

export const problem = {
  eyebrow: "The problem",
  headline: ["A number is not", "a bill."],
  body: "Most screen-time tools tell you how much time you lost and leave it there. “3h 12m on Instagram” is easy to shrug off. Doom Tracker reframes the same minutes as a trade-off: here's what that time could have paid for instead.",
  otherLabel: "A typical screen-time tool",
  otherValue: "3h 12m",
  otherCaption: "Screen time today. That’s it.",
  oursLabel: "Doom Tracker",
  oursCaption: "Doomscrolled today, priced against your goals.",
};

export const howItWorks = {
  eyebrow: "How it works",
  headline: "From screen time to opportunity cost",
  steps: [
    {
      n: "01",
      title: "Set your goals",
      body: "Pick what your time should be going to — Coding, Reading, Exercise, anything. Give each a daily target. The order of the list is your priority order.",
    },
    {
      n: "02",
      title: "Doom Tracker reads your usage",
      body: "Every ~15 minutes, Android’s own usage log is checked in the background. Doom Tracker sees which app was open and for how long — never what was on screen.",
    },
    {
      n: "03",
      title: "Get the bill",
      body: "Doomscrolled minutes are spent against your goals in priority order. You see exactly which goals that time would have fully — or partly — paid for.",
    },
  ],
  pipeline: [
    { key: "goals", title: "Goals", note: "Your list, in priority order" },
    { key: "usage", title: "Usage", note: "Android’s app-usage log" },
    { key: "sessions", title: "Sessions", note: "App · start · end" },
    { key: "doomscroll", title: "Doomscroll time", note: "Risk app + 2 min or longer" },
    { key: "bill", title: "The bill", note: "Minutes spent against goals" },
  ],
  ruleTitle: "What counts as doomscrolling",
  ruleBody:
    "A session counts when it’s on a risk app and lasts at least 2 minutes. Then its full duration counts. Anything shorter, or any other app, counts as zero. No guesswork, no AI — one deterministic rule.",
  ruleRiskApps: "Risk apps in V1",
};

export const opportunity = {
  eyebrow: "Try the math",
  headline: "Drag the scroll. Watch the bill.",
  body: "This is the exact allocation rule Doom Tracker uses, running in your browser. Minutes fill your goals top to bottom. Reorder the list and the same minutes buy something different.",
  sliderLabel: "Minutes doomscrolled today",
  reorderHint: "Drag or use the arrows to change priority",
  rules: [
    "Goals are funded in list order — top first.",
    "A goal can’t go past 100%.",
    "Leftover minutes stay unallocated — never piled onto a goal.",
    "Same inputs, same bill. Every time.",
  ],
};

export const showcase = {
  eyebrow: "The app",
  headline: "Four screens. One idea.",
  illustrativeNote: "Illustrative data. Screens are recreated from the V1 app’s design references.",
  steps: [
    {
      key: "today",
      tab: "Today",
      title: "Today, at a glance",
      body: "Your doomscroll total for the day, how it compares with your previous six days, which apps it went to, and a single bar showing which goals it ate into.",
      points: ["Today vs. your recent average", "Last 7 days, worst day marked", "Per-app breakdown"],
    },
    {
      key: "bill",
      tab: "The Bill",
      title: "The Bill",
      body: "The receipt. Switch between Today, 7 Days and 30 Days — each goal’s daily target scales to the period, and every goal shows how much of it your scrolling could have funded.",
      points: ["Today / 7 Days / 30 Days", "Targets scale with the period", "Per-goal funding in priority order"],
    },
    {
      key: "trends",
      tab: "Trends",
      title: "Trends",
      body: "Thirty days of doomscrolling in one chart, with your daily average and your best and worst days called out.",
      points: ["30-day daily bars", "Average line", "Best and worst day"],
    },
    {
      key: "goals",
      tab: "Goals",
      title: "Goals",
      body: "The exchange rate. Add, rename, remove and reorder goals, and tune daily targets in 5-minute steps. Change a target and the whole bill re-prices.",
      points: ["Add · rename · remove", "Reorder = reprioritise", "5-minute target steps"],
    },
  ],
  tryIt: "Try it — the period switch works",
};

export const goals = {
  eyebrow: "Goals + protected windows",
  headline: "Order is priority.",
  body: "Your goal list isn’t a wish list — it’s a queue. Doomscrolled minutes are spent against the first goal until it’s fully funded, then the next. Move Exercise above Reading and the same scroll time tells a different story.",
  capabilities: [
    { title: "Add", body: "New goals join at the bottom — lowest priority." },
    { title: "Rename", body: "Names are yours. Identity doesn’t depend on them." },
    { title: "Remove", body: "Gone from the list and from the bill." },
    { title: "Reorder", body: "Move up or down to change who gets funded first." },
    { title: "Adjust", body: "Daily targets in 5-minute steps." },
  ],
  protectedEyebrow: "Protected windows",
  protectedHeadline: "Coding · 09:00 → 11:00",
  protectedBody:
    "A goal can carry a daily window that matters most. Afterwards, Doom Tracker reports how many minutes of risk-app use landed inside it.",
  protectedFacts: [
    { k: "Reported afterward", v: "Retrospective — checked against sessions already recorded." },
    { k: "Doesn’t block", v: "No app is ever blocked, paused or interrupted." },
    { k: "Doesn’t change the bill", v: "Overlap is informational. The allocation math is untouched." },
  ],
  protectedFootnote:
    "In V1, protected windows come with the default goals and can be toggled on or off. Custom window times aren’t editable yet.",
  timelineCaption: "Illustrative day · risk-app sessions vs. protected windows",
};

export const trends = {
  eyebrow: "Trends",
  headline: "Thirty days, no spin.",
  body: "Trends shows a single 30-day view: one bar per day, your daily average, and your best and worst days. Hover or focus any bar for the number.",
  liveNow: {
    title: "In V1",
    items: ["30-day daily bars", "Daily average", "Best day", "Worst day"],
  },
  inProgress: {
    title: "Still being designed",
    items: ["Pattern insights", "Streaks", "Month-over-month comparison"],
    note: "These appear as placeholders in the V1 app and aren’t shown here as features.",
  },
};

export const privacy = {
  eyebrow: "Privacy · Local-first",
  headline: ["Your usage data", "stays on your phone."],
  body: "Doom Tracker is a single-user, on-device app. There’s no account to create and no server for your data to go to.",
  facts: [
    { title: "No account", body: "Nothing to sign up for. Open it and set your goals." },
    { title: "No backend", body: "There is no Doom Tracker server. The app’s code makes no network requests." },
    { title: "Stored locally", body: "Sessions live in an on-device Room database. Goals and settings live in on-device AsyncStorage." },
    { title: "Delete everything", body: "One action wipes all detection data, then resets your goals." },
    { title: "Usage Access only", body: "Reads Android’s UsageStatsManager — which app, and when. You grant it in Settings and can revoke it anytime." },
    { title: "No AccessibilityService", body: "Doom Tracker can’t see screen content, text, or what you scroll past." },
  ],
  sees: ["App package name", "Session start time", "Session end time"],
  neverSees: ["Screen content", "Text or messages", "Scroll gestures", "Which video or post"],
  cta: "Read the privacy policy",
};

export const architecture = {
  eyebrow: "Under the hood",
  headline: "Built like a product, not a prototype.",
  body: "Native Kotlin does the collecting. Pure TypeScript does the thinking. Each layer only depends on the one below it, and the domain logic never knows which Android API produced a session.",
  lanes: [
    {
      name: "Android · Kotlin",
      nodes: [
        { title: "UsageStatsManager", detail: "Android’s on-device app-usage event log" },
        { title: "Usage events", detail: "Polled by WorkManager every ~15 min, from a checkpoint" },
        { title: "Session reconstruction", detail: "Foreground/background events paired into sessions" },
        { title: "Room", detail: "Checkpoint · open sessions · closed sessions" },
      ],
    },
    {
      name: "Bridge",
      nodes: [{ title: "TurboModule", detail: "Typed native module — UsageStats" }],
    },
    {
      name: "React Native · TypeScript",
      nodes: [
        { title: "Data layer", detail: "Range reads, day bucketing" },
        { title: "Classification", detail: "Risk-app list + 2-minute rule" },
        { title: "Aggregation", detail: "Totals and per-app minutes" },
        { title: "Opportunity cost", detail: "Priority-ordered allocation" },
        { title: "Today · Bill · Trends", detail: "The screens you see" },
      ],
    },
  ],
  facts: [
    { k: "Native", v: "Kotlin · WorkManager · Room" },
    { k: "App", v: "React Native (New Architecture) · TypeScript" },
    { k: "Domain", v: "Pure functions, unit-tested" },
    { k: "Tests", v: "Vitest · Jest · JUnit + Robolectric" },
  ],
  cta: "Read the source on GitHub",
};

export const limits = {
  eyebrow: "Honest V1 limits",
  headline: ["Built deliberately.", "Not magic."],
  body: "Every limit below is a scope decision, made on purpose and written down. V1 does a small thing precisely instead of a big thing vaguely.",
  items: [
    { title: "Android only", why: "Detection is built on Android’s UsageStatsManager. There is no iOS version." },
    { title: "Not real-time", why: "Usage is read in the background about every 15 minutes — Android may delay that further." },
    { title: "No screen awareness", why: "It knows the app, not the content. It can’t tell Reels or Shorts from the rest of Instagram or YouTube." },
    { title: "Fixed risk-app list", why: "Instagram, YouTube, TikTok and Reddit, curated by the developer. Not user-editable in V1." },
    { title: "No AccessibilityService", why: "A deliberate privacy and Play-policy decision, not an oversight." },
    { title: "No blocking, no nudges", why: "Doom Tracker reports. It never blocks an app or interrupts you." },
    { title: "Some insights are placeholders", why: "Streaks, coach insights and narrative copy are still being designed." },
    { title: "Device validation pending", why: "The pipeline is unit- and component-tested; end-to-end testing on real devices is still to come." },
  ],
};

export const finalCta = {
  eyebrow: "Coming soon to Android",
  headline: ["Know the price", "before you scroll."],
  body: "Doom Tracker V1 is in active development. The source is public — follow along on GitHub.",
};

export const comingSoon = {
  title: "Coming soon to Android.",
  body: "Doom Tracker isn’t on Google Play yet. V1 is still in development and real-device testing is underway before any public release.",
  secondary: "Want to see where it’s at? The full source is on GitHub.",
  close: "Got it",
};

export const footer = {
  tagline: "Every scroll has a price.",
  disclaimer:
    "Doom Tracker is an independent project and is not affiliated with Instagram, YouTube, TikTok, Reddit or Google. App names are used only to describe which apps are tracked.",
  links: [
    { href: "/privacy", label: "Privacy policy" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#under-the-hood", label: "Under the hood" },
  ],
};
