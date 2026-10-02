"use client";

import { motion } from "motion/react";
import { allocateOpportunityCost, roundedPercent } from "@/lib/allocate";
import { formatMinutesAsClock } from "@/lib/format";
import { BILL_PERIODS, DEFAULT_GOALS, type BillPeriod, type DemoGoal } from "@/lib/demo";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { AppHeader, ScreenLabel, Segmented } from "./parts";

const PERIOD_KEYS = BILL_PERIODS.map((p) => p.key);

/**
 * The Bill, recreated from docs/design/bill.png. The period switch is live:
 * goal targets scale by the number of days and allocation runs through the
 * same algorithm as the app. The app's narrative sentence, "plain units" grid
 * and running balance are still placeholders in V1, so they're omitted.
 */
export function ScreenBill({
  period,
  onPeriodChange,
  goals = DEFAULT_GOALS,
}: {
  period: BillPeriod;
  onPeriodChange?: (period: BillPeriod) => void;
  goals?: readonly DemoGoal[];
}) {
  const current = BILL_PERIODS.find((p) => p.key === period) ?? BILL_PERIODS[0];
  const { allocations } = allocateOpportunityCost(
    goals.map((g) => ({ id: g.id, targetMinutesPerDay: g.targetMinutesPerDay })),
    current.total,
    current.days,
  );

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="The Bill" right="Opportunity cost" />
      <Segmented label="Bill period" options={PERIOD_KEYS} value={period} onChange={onPeriodChange} />

      <div className="relative shrink-0 overflow-hidden bg-ink px-5 pt-5 pb-6">
        <div aria-hidden className="tex-grain-dark absolute inset-0" />
        <ScreenLabel className="relative text-cost">{current.label}</ScreenLabel>
        <p className="display print-shadow-cream relative mt-2 text-[100px] leading-[0.86] text-cost">
          <AnimatedNumber value={current.total} format={formatMinutesAsClock} />
        </p>
        <ScreenLabel className="relative mt-3 text-dark-muted">Doomscrolled · {current.days === 1 ? "1 day" : `${current.days} days`}</ScreenLabel>
      </div>

      <div className="px-5 pt-5">
        <h4 className="display text-[26px] text-ink">This would have bought</h4>
        <ScreenLabel className="mt-1 text-label">Against the goals you set</ScreenLabel>

        <ul className="mt-4 flex flex-col gap-4">
          {allocations.map((a) => {
            const goal = goals.find((g) => g.id === a.goalId);
            const pct = roundedPercent(a);
            const funded = pct >= 100;
            return (
              <li key={a.goalId}>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="display text-[22px] leading-none text-ink">{goal?.name}</p>
                    <ScreenLabel className="mt-1 text-label">Target {a.periodTargetMinutes} min</ScreenLabel>
                  </div>
                  <p className={`display text-[40px] leading-none ${funded ? "text-protect" : "text-ink"}`}>
                    <AnimatedNumber value={pct} />
                    <span className="text-[18px]">%</span>
                  </p>
                </div>
                <div className="mt-2 h-6 border-2 border-ink bg-surface">
                  <motion.div
                    className={`h-full ${funded ? "bg-protect" : "bg-ink"}`}
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.45 }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
