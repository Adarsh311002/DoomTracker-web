"use client";

import { useMemo, useState } from "react";
import { goals as copy } from "@/content/copy";
import { allocateOpportunityCost, roundedPercent } from "@/lib/allocate";
import { DEFAULT_GOALS, DEMO_TIMELINE_SESSIONS, DEMO_TODAY_MINUTES, STEP_MINUTES, type DemoGoal } from "@/lib/demo";
import { formatWindow } from "@/lib/format";
import { findOverlaps, sumOverlapByGoal } from "@/lib/protected";
import { IllustrativeTag } from "@/components/ui/Badge";
import { Eyebrow, Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { ScreenGoals } from "@/components/phone/ScreenGoals";
import { ProtectedTimeline } from "@/components/goals/ProtectedTimeline";

function OrderReceipt({ title, order }: { title: string; order: readonly DemoGoal[] }) {
  const { allocations } = allocateOpportunityCost(
    order.map((g) => ({ id: g.id, targetMinutesPerDay: g.targetMinutesPerDay })),
    DEMO_TODAY_MINUTES,
    1,
  );
  return (
    <div className="border-2 border-ink bg-surface p-5 shadow-hard">
      <Label tone="muted">{title}</Label>
      <ol className="mt-4 flex flex-col gap-3">
        {allocations.map((a, i) => {
          const goal = order[i];
          const p = roundedPercent(a);
          return (
            <li key={a.goalId}>
              <div className="flex items-baseline justify-between">
                <span className="display text-xl text-ink">
                  <span className="label mr-2 text-[10px] text-label">{i + 1}</span>
                  {goal.name}
                </span>
                <span className={`display text-2xl ${p >= 100 ? "text-protect" : "text-ink"}`}>{p}%</span>
              </div>
              <div className="mt-1 h-3 border-2 border-ink bg-cream">
                <div className={`h-full ${p >= 100 ? "bg-protect" : "bg-ink"}`} style={{ width: `${p}%` }} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Goals() {
  const [goals, setGoals] = useState<DemoGoal[]>(() => DEFAULT_GOALS.map((g) => ({ ...g })));

  const adjust = (id: string, delta: number) =>
    setGoals((cur) =>
      cur.map((g) => (g.id === id ? { ...g, targetMinutesPerDay: Math.max(STEP_MINUTES, g.targetMinutesPerDay + delta) } : g)),
    );
  const toggle = (id: string) =>
    setGoals((cur) => cur.map((g) => (g.id === id ? { ...g, protectedWindowEnabled: !g.protectedWindowEnabled } : g)));

  const overlaps = useMemo(
    () =>
      findOverlaps(
        DEMO_TIMELINE_SESSIONS,
        goals
          .filter((g) => g.protectedWindow && g.protectedWindowEnabled)
          .map((g) => ({ goalId: g.id, start: g.protectedWindow!.start, end: g.protectedWindow!.end })),
      ),
    [goals],
  );
  const overlapByGoal = sumOverlapByGoal(overlaps);

  // Same goals, Exercise moved to the top: shows that order is priority.
  const reordered = [goals[2], goals[0], goals[1]];

  return (
    <section id="goals" aria-labelledby="goals-title" className="relative border-b-2 border-ink bg-cream">
      <div aria-hidden className="tex-grain absolute inset-0" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h2 id="goals-title" className="display text-[clamp(3.25rem,9vw,6.5rem)] text-ink">
              {copy.headline}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">{copy.body}</p>
            <dl className="mt-10 grid grid-cols-2 border-t-2 border-l-2 border-ink sm:grid-cols-3">
              {copy.capabilities.map((c) => (
                <div key={c.title} className="border-r-2 border-b-2 border-ink bg-surface p-4">
                  <dt className="display text-2xl text-ink">{c.title}</dt>
                  <dd className="mt-1 text-[13px] leading-snug text-label">{c.body}</dd>
                </div>
              ))}
              <div className="border-r-2 border-b-2 border-ink bg-ink p-4">
                <dt className="display text-2xl text-cost">Order = priority</dt>
                <dd className="mt-1 text-[13px] leading-snug text-dark-body">Top of the list gets funded first.</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col items-center">
            <div className="relative w-full max-w-[330px]">
              <PhoneFrame
                activeTab="goals"
                interactive
                label="Interactive Doom Tracker Goals screen. Adjust targets in 5-minute steps and toggle protected windows. Illustrative data."
              >
                <ScreenGoals goals={goals} onAdjust={adjust} onToggle={toggle} />
              </PhoneFrame>
              <IllustrativeTag className="absolute -bottom-3 -left-3 rotate-[-3deg]" />
            </div>
            <p className="label mt-8 text-center text-[11px] text-cost-ink">Try it — targets and toggles work</p>
          </Reveal>
        </div>

        {/* Order is priority */}
        <Reveal className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="display text-4xl text-ink">Same {DEMO_TODAY_MINUTES} minutes. Different order.</h3>
            <IllustrativeTag />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <OrderReceipt title="Order A · as listed" order={goals} />
            <OrderReceipt title={`Order B · ${reordered[0].name} moved to the top`} order={reordered} />
          </div>
        </Reveal>

        {/* Protected windows */}
        <Reveal className="mt-20">
          <div className="border-2 border-ink bg-surface shadow-[8px_8px_0_0_var(--color-protect)]">
            <div className="grid lg:grid-cols-[1fr_1.4fr]">
              <div className="border-b-2 border-ink bg-protect-fill p-6 sm:p-8 lg:border-r-2 lg:border-b-0">
                <Eyebrow tone="protect">{copy.protectedEyebrow}</Eyebrow>
                <p className="display text-[clamp(2rem,4vw,2.75rem)] text-ink">
                  Coding
                  <br />
                  <span className="text-protect">09:00 → 11:00</span>
                </p>
                <p className="mt-4 text-[16px] leading-relaxed text-ink/80">{copy.protectedBody}</p>
                <dl className="mt-6 flex flex-col gap-4">
                  {copy.protectedFacts.map((f) => (
                    <div key={f.k} className="border-l-4 border-protect pl-4">
                      <dt className="label text-xs text-ink">{f.k}</dt>
                      <dd className="mt-1 text-[14px] leading-snug text-ink/75">{f.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex flex-col gap-10 p-6 sm:p-8">
                <div>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <Label tone="ink">{copy.timelineCaption}</Label>
                    <IllustrativeTag />
                  </div>
                  <ProtectedTimeline goals={goals} sessions={DEMO_TIMELINE_SESSIONS} overlaps={overlaps} />
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-label">
                    <span className="flex items-center gap-2"><span className="h-3 w-3 border-2 border-protect bg-protect-fill" />Protected window</span>
                    <span className="flex items-center gap-2"><span className="h-3 w-3 border-2 border-ink bg-cost" />Risk-app session</span>
                    <span className="flex items-center gap-2"><span className="h-3 w-3 border-2 border-ink" style={{ backgroundImage: "repeating-linear-gradient(135deg, var(--color-ink) 0 2px, transparent 2px 5px)" }} />Overlap</span>
                  </div>
                </div>
                <ul className="flex flex-col border-t-2 border-ink" aria-live="polite">
                  {goals
                    .filter((g) => g.protectedWindow)
                    .map((g) => (
                      <li key={g.id} className="flex items-center justify-between gap-4 border-b-2 border-ink/15 py-3">
                        <span className="text-[15px] text-ink">
                          <strong className="font-semibold">{g.name}</strong>{" "}
                          <span className="label text-[11px] text-protect-ink">{formatWindow(g.protectedWindow!.start, g.protectedWindow!.end)}</span>
                        </span>
                        <span className="label text-[11px] whitespace-nowrap text-ink">
                          {g.protectedWindowEnabled ? `${overlapByGoal[g.id] ?? 0} min inside` : "Off"}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-label">{copy.protectedFootnote}</p>
        </Reveal>
      </div>
    </section>
  );
}
