/**
 * Protected-window overlap, simplified from the app's
 * `findProtectedWindowOverlaps` (docs/architecture.md §13) for a single
 * illustrative day. Same-day windows only; any risk-app session counts,
 * regardless of the 2-minute doomscroll threshold. Purely informational —
 * it never feeds into the opportunity-cost allocation.
 */

export interface DaySession {
  readonly app: string;
  /** Minutes since midnight. */
  readonly start: number;
  readonly end: number;
}

export interface WindowSpec {
  readonly goalId: string;
  readonly start: number;
  readonly end: number;
}

export interface Overlap {
  readonly goalId: string;
  readonly app: string;
  readonly start: number;
  readonly end: number;
  readonly minutes: number;
}

export function findOverlaps(sessions: readonly DaySession[], windows: readonly WindowSpec[]): Overlap[] {
  const out: Overlap[] = [];
  for (const w of windows) {
    for (const s of sessions) {
      const start = Math.max(s.start, w.start);
      const end = Math.min(s.end, w.end);
      if (end > start) out.push({ goalId: w.goalId, app: s.app, start, end, minutes: end - start });
    }
  }
  return out;
}

export function sumOverlapByGoal(overlaps: readonly Overlap[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const o of overlaps) totals[o.goalId] = (totals[o.goalId] ?? 0) + o.minutes;
  return totals;
}
