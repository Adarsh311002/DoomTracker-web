"use client";

import { formatMinutesAsClock, formatTarget, formatWindow } from "@/lib/format";
import { DEFAULT_GOALS, DEMO_TIMELINE_SESSIONS, type DemoGoal } from "@/lib/demo";
import { findOverlaps, sumOverlapByGoal } from "@/lib/protected";
import { Toggle } from "@/components/ui/Toggle";
import { AppHeader, ScreenLabel } from "./parts";

/** Illustrative "minutes in protected window today", from the demo day's sessions. */
function overlapFor(goals: readonly DemoGoal[]): Record<string, number> {
  return sumOverlapByGoal(
    findOverlaps(
      DEMO_TIMELINE_SESSIONS,
      goals
        .filter((g) => g.protectedWindow)
        .map((g) => ({ goalId: g.id, start: g.protectedWindow!.start, end: g.protectedWindow!.end })),
    ),
  );
}

/**
 * Goals ("The exchange rate"), recreated from docs/design/goals.png.
 * When `onAdjust` / `onToggle` are passed, the steppers and switches work.
 */
export function ScreenGoals({
  goals = DEFAULT_GOALS,
  onAdjust,
  onToggle,
}: {
  goals?: readonly DemoGoal[];
  onAdjust?: (id: string, delta: number) => void;
  onToggle?: (id: string) => void;
}) {
  const overlapByGoal = overlapFor(goals);
  const perDay = goals.reduce((s, g) => s + g.targetMinutesPerDay, 0);

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Goals" right={`${formatMinutesAsClock(perDay)} / day`} />
      <div className="px-5 pt-5">
        <h4 className="display text-[34px] leading-[0.92] text-ink">
          The exchange
          <br />
          rate
        </h4>
        <p className="mt-2.5 text-[13px] leading-snug text-label">
          Every scrolled minute is priced against these. Change a target and the whole bill re-prices.
        </p>
      </div>

      <ul className="flex flex-col gap-3.5 px-5 pt-4">
        {goals.map((goal) => {
          const hasWindow = goal.protectedWindow !== null;
          const overlap = overlapByGoal[goal.id];
          return (
            <li key={goal.id} className="border-2 border-ink bg-surface shadow-[5px_5px_0_0_var(--color-ink)]">
              <div className="flex items-center justify-between gap-2 px-3.5 py-3">
                <div className="min-w-0">
                  <p className="display truncate text-[22px] leading-none text-ink">{goal.name}</p>
                  {goal.subtitle && <ScreenLabel className="mt-1 truncate text-label">{goal.subtitle}</ScreenLabel>}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    aria-label={`Decrease ${goal.name} target`}
                    onClick={() => onAdjust?.(goal.id, -5)}
                    disabled={goal.targetMinutesPerDay <= 5}
                    className="display grid h-9 w-9 cursor-pointer place-items-center border-2 border-ink bg-cream text-[18px] text-ink disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="display w-[58px] text-center text-[24px] leading-none text-ink" aria-live="polite">
                    {formatTarget(goal.targetMinutesPerDay)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase ${goal.name} target`}
                    onClick={() => onAdjust?.(goal.id, 5)}
                    className="display grid h-9 w-9 cursor-pointer place-items-center border-2 border-ink bg-ink text-[18px] text-cream"
                  >
                    +
                  </button>
                </div>
              </div>
              <div
                className={`flex items-center justify-between gap-2 border-t-2 border-ink px-3.5 py-2.5 ${
                  hasWindow ? "bg-protect-fill" : "bg-surface"
                }`}
              >
                <div>
                  <ScreenLabel className={hasWindow ? "text-protect-ink" : "text-label"}>
                    {hasWindow ? `Protected ${formatWindow(goal.protectedWindow!.start, goal.protectedWindow!.end)}` : "No protected window"}
                  </ScreenLabel>
                  {hasWindow && goal.protectedWindowEnabled && overlap ? (
                    <ScreenLabel className="mt-1 text-cost-ink">{overlap} min in protected window today</ScreenLabel>
                  ) : null}
                </div>
                {hasWindow && (
                  <Toggle
                    size="sm"
                    checked={goal.protectedWindowEnabled}
                    onChange={() => onToggle?.(goal.id)}
                    label={`${goal.name} protected window`}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="px-5 pt-4">
        <div className="display grid h-12 place-items-center border-2 border-dashed border-muted text-[20px] text-muted">
          + Add a goal
        </div>
      </div>
    </div>
  );
}
