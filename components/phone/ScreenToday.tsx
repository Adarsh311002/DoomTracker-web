"use client";

import { motion } from "motion/react";
import { allocateOpportunityCost } from "@/lib/allocate";
import { buildVsAverageLabel, formatMinutesAsClock } from "@/lib/format";
import {
  DEFAULT_GOALS,
  DEMO_PREVIOUS_6_AVG,
  DEMO_7_DAY_STATS,
  DEMO_TODAY,
  DEMO_TODAY_APPS,
  DEMO_TODAY_MINUTES,
} from "@/lib/demo";
import { BarChart } from "@/components/ui/BarChart";
import { AppHeader, ScreenLabel } from "./parts";

const USAGE_FILLS = ["bg-cost", "bg-cost-soft", "tex-bar"];
const COST_FILLS = ["bg-protect", "bg-protect-soft"];

/**
 * Today screen, recreated from docs/design/today.png using only elements that
 * are data-driven in the V1 app: hero total, vs-average badge (previous 6
 * completed days), the "What it cost you" allocation bar, the last-7-days
 * chart and the per-app breakdown. Placeholder-only pieces of the reference
 * (streak badge, cost-card headline, coach insight) are left out.
 */
export function ScreenToday() {
  const total = DEMO_TODAY_MINUTES;
  const { allocations } = allocateOpportunityCost(
    DEFAULT_GOALS.map((g) => ({ id: g.id, targetMinutesPerDay: g.targetMinutesPerDay })),
    total,
    1,
  );
  const segments = allocations.map((a, i) => ({
    name: DEFAULT_GOALS[i].name,
    minutes: Math.round(a.allocatedMinutes),
    share: (a.allocatedMinutes / Math.max(1, total)) * 100,
  }));
  const [hours, mins] = formatMinutesAsClock(total).split(":");

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Doom Tracker" right={DEMO_TODAY.short} />

      <div className="relative px-5 pt-5 pb-5">
        <div aria-hidden className="tex-halftone absolute top-0 right-0 h-[168px] w-[150px] opacity-95" />
        <ScreenLabel className="relative text-label">Doomscrolled today</ScreenLabel>
        <div className="relative mt-1 flex items-end gap-2">
          <span className="display print-shadow text-[112px] leading-[0.86] text-cost">
            {hours}
            <span className="text-cost">:</span>
            {mins}
          </span>
          <span className="display mb-2 text-[26px] text-muted">Hrs</span>
        </div>
        <div className="relative mt-3 flex">
          <span className="label border-2 border-ink bg-protect px-2 py-1.5 text-[9px] tracking-[0.12em] text-ink">
            {buildVsAverageLabel(total, DEMO_PREVIOUS_6_AVG)}
          </span>
        </div>
      </div>

      <div className="h-[2px] shrink-0 bg-ink" />

      <div className="px-5 pt-4">
        <div className="border-2 border-ink bg-surface p-3.5 shadow-[5px_5px_0_0_var(--color-ink)]">
          <ScreenLabel className="text-cost-ink">What it cost you</ScreenLabel>
          <div className="mt-3 flex h-6 border-2 border-ink bg-cream">
            {segments.map((s, i) => (
              <motion.div
                key={s.name}
                className={`${COST_FILLS[Math.min(i, COST_FILLS.length - 1)]} ${i > 0 ? "border-l-2 border-ink/40" : ""}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${s.share}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between">
            {segments.map((s) => (
              <span key={s.name} className="label text-[8px] tracking-[0.1em] text-label">
                {s.name} {s.minutes}m
              </span>
            ))}
          </div>
          <p className="label mt-3 inline-block border-b-2 border-cost pb-0.5 text-[9px] tracking-[0.2em] text-ink">
            See the full bill →
          </p>
        </div>
      </div>

      <div className="px-5 pt-5">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h4 className="display text-[22px] text-ink">Last 7 days</h4>
          <ScreenLabel className="text-faint">Avg {formatMinutesAsClock(DEMO_7_DAY_STATS.averageMinutes)}</ScreenLabel>
        </div>
        <BarChart days={DEMO_7_DAY_STATS.days} height={92} gap={7} />
      </div>

      <div className="px-5 pt-5">
        <h4 className="display mb-3 text-[22px] text-ink">Where it went</h4>
        <ul className="flex flex-col gap-2.5">
          {DEMO_TODAY_APPS.map((app, i) => (
            <li key={app.name}>
              <div className="mb-1 flex items-end justify-between">
                <span className="text-[13px] text-ink">{app.name}</span>
                <span className="display text-[20px] leading-none text-ink">
                  {app.minutes}
                  <span className="text-[11px] text-label">M</span>
                </span>
              </div>
              <div className="h-4 border-2 border-ink bg-surface">
                <div className={`h-full ${USAGE_FILLS[i]}`} style={{ width: `${(app.minutes / total) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
