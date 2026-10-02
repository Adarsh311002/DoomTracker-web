/**
 * ILLUSTRATIVE demonstration data for the website's phone mockups and demos.
 *
 * None of this is real user data or a published metric. Every surface that
 * renders it is labelled "Illustrative". The numbers are internally
 * consistent (the 7-day view is the tail of the 30-day view, today's app
 * breakdown sums to today's total) so the mockups never contradict each other.
 *
 * Goal defaults mirror the app's INITIAL_GOALS in src/state/AppStateContext.tsx.
 */

import { summarizeDailyStats } from "./stats";

export interface DemoGoal {
  id: string;
  name: string;
  subtitle: string;
  targetMinutesPerDay: number;
  /** Minutes since local midnight. Protected windows are developer-seeded in V1. */
  protectedWindow: { start: number; end: number } | null;
  protectedWindowEnabled: boolean;
}

export const DEFAULT_GOALS: readonly DemoGoal[] = [
  {
    id: "coding",
    name: "Coding",
    subtitle: "Deep work · Weekdays",
    targetMinutesPerDay: 60,
    protectedWindow: { start: 540, end: 660 },
    protectedWindowEnabled: true,
  },
  {
    id: "reading",
    name: "Reading",
    subtitle: "Books · Every day",
    targetMinutesPerDay: 30,
    protectedWindow: { start: 1320, end: 1350 },
    protectedWindowEnabled: true,
  },
  {
    id: "exercise",
    name: "Exercise",
    subtitle: "Any movement · 5x/week",
    targetMinutesPerDay: 45,
    protectedWindow: null,
    protectedWindowEnabled: false,
  },
];

/** Goal-target stepper increment, same as the app's STEP_MINUTES. */
export const STEP_MINUTES = 5;

/** The app's risk-app list (exact package-name match). */
export const RISK_APPS = [
  { name: "Instagram", pkg: "com.instagram.android" },
  { name: "YouTube", pkg: "com.google.android.youtube" },
  { name: "TikTok", pkg: "com.zhiliaoapp.musically" },
  { name: "Reddit", pkg: "com.reddit.frontpage" },
] as const;

export const DOOMSCROLL_THRESHOLD_MINUTES = 2;

/** Illustrative "today" for header labels: a Tuesday, 2 September. */
export const DEMO_TODAY = {
  weekday: "TUESDAY",
  short: "TUE · SEP 2",
};

/** Today's illustrative per-app breakdown (app-level only — the app cannot see Reels/Shorts). */
export const DEMO_TODAY_APPS = [
  { name: "Instagram", minutes: 48 },
  { name: "YouTube", minutes: 31 },
  { name: "Reddit", minutes: 18 },
] as const;

export const DEMO_TODAY_MINUTES = DEMO_TODAY_APPS.reduce((sum, a) => sum + a.minutes, 0); // 97

/** 30 days ending "today" (Aug 4 → Sep 2). The last value is today, still in progress. */
const THIRTY_DAY_MINUTES = [
  118, 132, 96, 151, 202, 144, 120, 88, 109, 135, 74, 63, 34, 81, 127, 140, 112, 99, 156, 131, 104,
  87, 119, 128, 116, 141, 174, 109, 92, DEMO_TODAY_MINUTES,
];

function dayLabel(index: number): string {
  // Aug 4 + index; August has 31 days.
  const day = 4 + index;
  return day > 31 ? `SEP ${day - 31}` : `AUG ${day}`;
}

export const DEMO_30_DAYS = THIRTY_DAY_MINUTES.map((minutes, i) => ({
  label: dayLabel(i),
  minutes,
}));

const WEEKDAY_INITIALS = ["W", "T", "F", "S", "S", "M", "TODAY"];

export const DEMO_7_DAYS = DEMO_30_DAYS.slice(-7).map((d, i) => ({
  label: WEEKDAY_INITIALS[i],
  minutes: d.minutes,
}));

export const DEMO_7_DAY_STATS = summarizeDailyStats(DEMO_7_DAYS);
export const DEMO_30_DAY_STATS = summarizeDailyStats(DEMO_30_DAYS);

/** Average of the previous 6 *completed* days, excluding today — the app's vs-average baseline. */
export const DEMO_PREVIOUS_6_AVG =
  DEMO_7_DAYS.slice(0, 6).reduce((sum, d) => sum + d.minutes, 0) / 6;

export type BillPeriod = "Today" | "7 Days" | "30 Days";

export const BILL_PERIODS: readonly { key: BillPeriod; days: number; label: string; total: number }[] = [
  { key: "Today", days: 1, label: `TODAY · ${DEMO_TODAY.weekday}`, total: DEMO_TODAY_MINUTES },
  {
    key: "7 Days",
    days: 7,
    label: "AUG 27 – SEP 2",
    total: DEMO_7_DAYS.reduce((s, d) => s + d.minutes, 0),
  },
  {
    key: "30 Days",
    days: 30,
    label: "AUG 4 – SEP 2",
    total: DEMO_30_DAYS.reduce((s, d) => s + d.minutes, 0),
  },
];

/**
 * Illustrative risk-app sessions for the protected-window timeline.
 * Times are minutes since midnight.
 */
export const DEMO_TIMELINE_SESSIONS = [
  { app: "Instagram", start: 580, end: 592 },
  { app: "Reddit", start: 630, end: 631 },
  { app: "YouTube", start: 790, end: 821 },
  { app: "Instagram", start: 1150, end: 1176 },
  { app: "YouTube", start: 1310, end: 1328 },
] as const;

/** Illustrative sessions for the "what counts" classifier table. */
export const DEMO_CLASSIFIER_SESSIONS = [
  { app: "Instagram", minutes: 14, risk: true },
  { app: "YouTube", minutes: 1.5, risk: true },
  { app: "Google Maps", minutes: 22, risk: false },
  { app: "Reddit", minutes: 6, risk: true },
  { app: "TikTok", minutes: 2, risk: true },
] as const;
