"use client";

import { Reorder } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { opportunity } from "@/content/copy";
import { allocateOpportunityCost } from "@/lib/allocate";
import { DEFAULT_GOALS, STEP_MINUTES } from "@/lib/demo";
import { explainAllocation } from "@/lib/explain";
import { formatMinutesAsClock } from "@/lib/format";
import { AllocationRow, type EditableGoal } from "@/components/opportunity/AllocationRow";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Eyebrow, Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";

const MAX_MINUTES = 240;
const INITIAL_MINUTES = 97;
const INITIAL_GOALS: EditableGoal[] = DEFAULT_GOALS.map(({ id, name, targetMinutesPerDay }) => ({
  id,
  name,
  targetMinutesPerDay,
}));

export function OpportunityCost() {
  const [minutes, setMinutes] = useState(INITIAL_MINUTES);
  const [goals, setGoals] = useState<EditableGoal[]>(INITIAL_GOALS);

  const result = useMemo(
    () =>
      allocateOpportunityCost(
        goals.map((g) => ({ id: g.id, targetMinutesPerDay: g.targetMinutesPerDay })),
        minutes,
        1,
      ),
    [goals, minutes],
  );

  const names = useMemo(() => Object.fromEntries(goals.map((g) => [g.id, g.name])), [goals]);
  const explanation = explainAllocation(result, names, minutes);
  const sumTargets = goals.reduce((s, g) => s + g.targetMinutesPerDay, 0);

  // Announce the result once interaction settles, not on every slider step.
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setAnnouncement(explanation), 700);
    return () => clearTimeout(t);
  }, [explanation]);

  // Running "remaining" after each goal — the algorithm's own loop, made visible.
  const remainingAfter = result.allocations.reduce<number[]>((acc, a) => {
    const prev = acc.length ? acc[acc.length - 1] : minutes;
    acc.push(prev - a.allocatedMinutes);
    return acc;
  }, []);

  const move = (id: string, direction: -1 | 1) => {
    setGoals((current) => {
      const i = current.findIndex((g) => g.id === id);
      const j = i + direction;
      if (i < 0 || j < 0 || j >= current.length) return current;
      const next = [...current];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const adjust = (id: string, delta: number) => {
    setGoals((current) =>
      current.map((g) =>
        g.id === id ? { ...g, targetMinutesPerDay: Math.max(STEP_MINUTES, g.targetMinutesPerDay + delta) } : g,
      ),
    );
  };

  const isDefault =
    minutes === INITIAL_MINUTES &&
    goals.length === INITIAL_GOALS.length &&
    goals.every((g, i) => g.id === INITIAL_GOALS[i].id && g.targetMinutesPerDay === INITIAL_GOALS[i].targetMinutesPerDay);

  return (
    <section id="the-bill" aria-labelledby="oc-title" className="relative border-b-2 border-ink bg-cream">
      <div aria-hidden className="tex-grain absolute inset-0" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
          <Reveal>
            <Eyebrow>{opportunity.eyebrow}</Eyebrow>
            <h2 id="oc-title" className="display text-[clamp(3rem,8vw,5.5rem)] text-ink">
              {opportunity.headline}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">{opportunity.body}</p>
            <ol className="mt-8 flex flex-col gap-3 border-t-2 border-ink pt-6">
              {opportunity.rules.map((rule, i) => (
                <li key={rule} className="flex gap-3 text-[15px] leading-snug text-ink">
                  <span className="label pt-0.5 text-[11px] text-cost-ink">{String(i + 1).padStart(2, "0")}</span>
                  {rule}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border-2 border-ink bg-surface shadow-hard">
              {/* Slider */}
              <div className="border-b-2 border-ink p-5 sm:p-7">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <label htmlFor="oc-minutes" className="label block text-[11px] text-label">
                      {opportunity.sliderLabel}
                    </label>
                    <p className="display print-shadow mt-2 text-[clamp(4.5rem,14vw,7rem)] leading-[0.86] text-cost">
                      <AnimatedNumber value={minutes} format={formatMinutesAsClock} duration={0.2} />
                    </p>
                  </div>
                  <div className="text-right">
                    <Label tone="muted">Sum of daily targets</Label>
                    <p className="display mt-1 text-3xl text-ink">{sumTargets} min</p>
                  </div>
                </div>
                <input
                  id="oc-minutes"
                  type="range"
                  min={0}
                  max={MAX_MINUTES}
                  step={1}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  aria-valuetext={`${minutes} minutes`}
                  className="dt-range mt-6"
                  style={{ ["--fill" as string]: `${(minutes / MAX_MINUTES) * 100}%` }}
                />
                <div aria-hidden className="mt-1 flex justify-between">
                  {[0, 60, 120, 180, 240].map((t) => (
                    <span key={t} className="label text-[10px] text-label">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Goals in priority order */}
              <div className="tex-grain bg-cream p-4 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <Label tone="ink">Your goals · priority order</Label>
                  <div className="flex items-center gap-4">
                    <Label tone="muted" as="span" className="hidden sm:inline">
                      {opportunity.reorderHint}
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        setGoals(INITIAL_GOALS);
                        setMinutes(INITIAL_MINUTES);
                      }}
                      disabled={isDefault}
                      className="label cursor-pointer border-b-2 border-cost text-[11px] text-ink disabled:cursor-default disabled:border-transparent disabled:text-label"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <Reorder.Group axis="y" values={goals} onReorder={setGoals} className="flex flex-col gap-3.5">
                  {goals.map((goal, i) => (
                    <AllocationRow
                      key={goal.id}
                      goal={goal}
                      allocation={result.allocations[i]}
                      index={i}
                      count={goals.length}
                      remainingAfter={remainingAfter[i]}
                      onMove={move}
                      onAdjust={adjust}
                    />
                  ))}
                </Reorder.Group>

                <div className="mt-3.5 flex items-center justify-between gap-4 border-2 border-dashed border-ink px-4 py-3">
                  <div>
                    <p className="display text-xl leading-none text-ink">Unallocated</p>
                    <p className="mt-1 text-[13px] text-label">Beyond every goal. Never stacked onto one.</p>
                  </div>
                  <p className={`display text-3xl whitespace-nowrap ${result.unallocatedMinutes > 0 ? "text-cost-ink" : "text-faint"}`}>
                    <AnimatedNumber value={result.unallocatedMinutes} duration={0.2} /> min
                  </p>
                </div>
              </div>

              {/* Reading of the result */}
              <div className="border-t-2 border-ink bg-ink p-5 sm:p-7">
                <Label tone="cost-bright">The bill, in words</Label>
                <p className="mt-3 text-lg leading-relaxed text-cream sm:text-xl">
                  {explanation}
                </p>
                <p aria-live="polite" className="sr-only">
                  {announcement}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
