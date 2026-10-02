/**
 * Port of the app's `summarizeDailyDoomscrollStats`: best/worst/average over
 * per-day totals. Ties go to the earliest day; the last day is the
 * in-progress one.
 */

export interface DailyStatView {
  readonly label: string;
  readonly minutes: number;
  readonly highlighted: boolean;
  readonly incomplete: boolean;
}

export interface DailyStats {
  readonly days: readonly DailyStatView[];
  readonly bestDayIndex: number;
  readonly worstDayIndex: number;
  readonly averageMinutes: number;
}

export function summarizeDailyStats(
  daily: readonly { label: string; minutes: number }[],
): DailyStats {
  if (daily.length === 0) {
    return { days: [], bestDayIndex: -1, worstDayIndex: -1, averageMinutes: 0 };
  }

  let best = 0;
  let worst = 0;
  let total = 0;
  daily.forEach((day, i) => {
    total += day.minutes;
    if (day.minutes < daily[best].minutes) best = i;
    if (day.minutes > daily[worst].minutes) worst = i;
  });

  const last = daily.length - 1;
  return {
    days: daily.map((day, i) => ({
      label: day.label,
      minutes: day.minutes,
      highlighted: i === worst,
      incomplete: i === last,
    })),
    bestDayIndex: best,
    worstDayIndex: worst,
    averageMinutes: total / daily.length,
  };
}
