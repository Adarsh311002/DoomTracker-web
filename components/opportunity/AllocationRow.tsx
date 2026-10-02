"use client";

import { motion, Reorder, useDragControls } from "motion/react";
import type { GoalAllocation } from "@/lib/allocate";
import { roundedPercent } from "@/lib/allocate";
import { STEP_MINUTES } from "@/lib/demo";

export interface EditableGoal {
  id: string;
  name: string;
  targetMinutesPerDay: number;
}

/**
 * One goal in the priority list. Drag the handle (pointer/touch) or use the
 * arrow buttons (keyboard) to reorder; ± adjusts the daily target in the
 * app's 5-minute steps.
 */
export function AllocationRow({
  goal,
  allocation,
  index,
  count,
  remainingAfter,
  onMove,
  onAdjust,
}: {
  goal: EditableGoal;
  allocation: GoalAllocation;
  index: number;
  count: number;
  remainingAfter: number;
  onMove: (id: string, direction: -1 | 1) => void;
  onAdjust: (id: string, delta: number) => void;
}) {
  const controls = useDragControls();
  const pct = roundedPercent(allocation);
  const funded = pct >= 100;
  const allocated = Math.round(allocation.allocatedMinutes);

  return (
    <Reorder.Item
      value={goal}
      dragListener={false}
      dragControls={controls}
      className="relative list-none border-2 border-ink bg-surface"
      whileDrag={{ scale: 1.015, boxShadow: "8px 8px 0 0 var(--color-ink)", zIndex: 10 }}
      style={{ boxShadow: "4px 4px 0 0 var(--color-ink)" }}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 p-3 sm:grid-cols-[auto_minmax(0,12rem)_1fr_auto] sm:gap-x-4 sm:p-4">
        {/* Handle + priority */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Drag to reorder ${goal.name}`}
            tabIndex={-1}
            onPointerDown={(e) => controls.start(e)}
            className="grid h-10 w-8 cursor-grab touch-none place-items-center text-label hover:text-ink active:cursor-grabbing"
          >
            <svg viewBox="0 0 12 18" className="h-[18px] w-3" aria-hidden>
              {[3, 9, 15].map((y) => (
                <g key={y}>
                  <rect x="1" y={y - 1.5} width="3" height="3" fill="currentColor" />
                  <rect x="8" y={y - 1.5} width="3" height="3" fill="currentColor" />
                </g>
              ))}
            </svg>
          </button>
          <span className="label text-[11px] text-label">{String(index + 1).padStart(2, "0")}</span>
        </div>

        {/* Name + target stepper */}
        <div className="min-w-0">
          <p className="display truncate text-[26px] leading-none text-ink">{goal.name}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`Decrease ${goal.name} daily target`}
              disabled={goal.targetMinutesPerDay <= STEP_MINUTES}
              onClick={() => onAdjust(goal.id, -STEP_MINUTES)}
              className="grid h-7 w-7 cursor-pointer place-items-center border-2 border-ink bg-cream text-sm font-bold disabled:cursor-not-allowed disabled:opacity-35"
            >
              −
            </button>
            <span className="label w-[64px] text-center text-[11px] whitespace-nowrap text-ink">
              {goal.targetMinutesPerDay} min
              <span className="sr-only"> per day</span>
            </span>
            <button
              type="button"
              aria-label={`Increase ${goal.name} daily target`}
              onClick={() => onAdjust(goal.id, STEP_MINUTES)}
              className="grid h-7 w-7 cursor-pointer place-items-center border-2 border-ink bg-ink text-sm font-bold text-cream"
            >
              +
            </button>
          </div>
        </div>

        {/* Bar + percent (full second row on mobile) */}
        <div className="col-span-3 flex items-center gap-3 sm:col-span-1 sm:col-start-3 sm:row-start-1">
          <div className="min-w-0 flex-1">
            <div
              className="h-7 border-2 border-ink bg-cream"
              role="meter"
              aria-label={`${goal.name} funded`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-valuetext={`${pct}% — ${allocated} of ${allocation.periodTargetMinutes} minutes`}
            >
              <motion.div
                className={`h-full ${funded ? "bg-protect" : "tex-bar"}`}
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.4, ease: [0.2, 0.9, 0.1, 1] }}
              />
            </div>
            <div className="mt-1.5 flex flex-wrap justify-between gap-x-3">
              <span className="label text-[10px] whitespace-nowrap text-label">
                {allocated} / {allocation.periodTargetMinutes} min
              </span>
              <span className="label text-[10px] whitespace-nowrap text-label">{Math.round(remainingAfter)} min left</span>
            </div>
          </div>
          <p
            className={`display w-[3.6ch] shrink-0 text-right text-[40px] leading-none ${funded ? "text-protect" : "text-ink"}`}
          >
            {pct}
            <span className="text-[18px]">%</span>
          </p>
        </div>

        {/* Keyboard reorder */}
        <div className="col-start-3 row-start-1 flex flex-col sm:col-start-4">
          <button
            type="button"
            aria-label={`Move ${goal.name} up`}
            disabled={index === 0}
            onClick={() => onMove(goal.id, -1)}
            className="grid h-7 w-8 cursor-pointer place-items-center border-2 border-ink bg-cream text-[10px] disabled:cursor-not-allowed disabled:opacity-30"
          >
            ▲
          </button>
          <button
            type="button"
            aria-label={`Move ${goal.name} down`}
            disabled={index === count - 1}
            onClick={() => onMove(goal.id, 1)}
            className="-mt-[2px] grid h-7 w-8 cursor-pointer place-items-center border-2 border-ink bg-cream text-[10px] disabled:cursor-not-allowed disabled:opacity-30"
          >
            ▼
          </button>
        </div>
      </div>
    </Reorder.Item>
  );
}
