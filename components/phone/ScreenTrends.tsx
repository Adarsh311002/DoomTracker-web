"use client";

import { formatMinutesAsClock } from "@/lib/format";
import { DEMO_30_DAY_STATS } from "@/lib/demo";
import { BarChart } from "@/components/ui/BarChart";
import { AppHeader, ScreenLabel, Segmented } from "./parts";

export function formatStat(minutes: number): string {
  return minutes < 60 ? `${Math.round(minutes)} MIN` : formatMinutesAsClock(minutes);
}

function titleCaseDate(label: string): string {
  const [mon, day] = label.split(" ");
  return `${mon[0]}${mon.slice(1).toLowerCase()} ${day}`;
}

/**
 * Trends, recreated from docs/design/trends.png. V1 ships a single Month
 * view; the reference's Day/Week tabs, "vs last month" badge, pattern
 * insights and streak card are placeholders and are left out.
 */
export function ScreenTrends() {
  const stats = DEMO_30_DAY_STATS;
  const best = stats.days[stats.bestDayIndex];
  const worst = stats.days[stats.worstDayIndex];
  const chartDays = stats.days.map((d) => ({ ...d, label: d.label.split(" ")[1] }));

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Trends" right="Aug 4 – Sep 2" />
      <Segmented label="Trends period" options={["Month"] as const} value="Month" />

      <div className="px-5 pt-5">
        <ScreenLabel className="text-label">Daily average</ScreenLabel>
        <p className="display mt-1 text-[84px] leading-[0.86] text-ink">{formatMinutesAsClock(stats.averageMinutes)}</p>
      </div>

      <div className="relative px-5 pt-6">
        <span className="label absolute top-4 right-5 text-[8px] tracking-[0.2em] text-label">Avg</span>
        <BarChart days={chartDays} height={190} gap={2.5} averageMinutes={stats.averageMinutes} labelEvery={5} />
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pt-5">
        <div className="border-2 border-ink bg-surface p-3">
          <ScreenLabel className="text-label">Best day</ScreenLabel>
          <p className="display mt-1 text-[30px] leading-none text-protect">{formatStat(best.minutes)}</p>
          <p className="mt-1 text-[12px] text-ink">{titleCaseDate(best.label)}</p>
        </div>
        <div className="border-2 border-ink bg-surface p-3">
          <ScreenLabel className="text-label">Worst day</ScreenLabel>
          <p className="display mt-1 text-[30px] leading-none text-cost">{formatStat(worst.minutes)}</p>
          <p className="mt-1 text-[12px] text-ink">{titleCaseDate(worst.label)}</p>
        </div>
      </div>
    </div>
  );
}
