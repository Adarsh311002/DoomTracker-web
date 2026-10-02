"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { showcase } from "@/content/copy";
import type { BillPeriod } from "@/lib/demo";
import { IllustrativeTag } from "@/components/ui/Badge";
import { Eyebrow, Label } from "@/components/ui/Label";
import { PhoneFrame, type PhoneTab } from "@/components/phone/PhoneFrame";
import { ScreenToday } from "@/components/phone/ScreenToday";
import { ScreenBill } from "@/components/phone/ScreenBill";
import { ScreenTrends } from "@/components/phone/ScreenTrends";
import { ScreenGoals } from "@/components/phone/ScreenGoals";

type Step = (typeof showcase.steps)[number];

const LABELS: Record<PhoneTab, string> = {
  today: "Doom Tracker Today screen: 1 hour 37 minutes doomscrolled, compared with your recent average, with a last-7-days chart. Illustrative data.",
  bill: "Doom Tracker Bill screen with a working Today, 7 Days and 30 Days period switch, showing how much of each goal the scroll time could have funded. Illustrative data.",
  trends: "Doom Tracker Trends screen: a 30-day bar chart with the daily average, best day and worst day. Illustrative data.",
  goals: "Doom Tracker Goals screen listing Coding, Reading and Exercise with daily targets and protected windows. Illustrative data.",
};

function Screen({ tab, period, onPeriod }: { tab: PhoneTab; period: BillPeriod; onPeriod: (p: BillPeriod) => void }) {
  switch (tab) {
    case "today":
      return <ScreenToday />;
    case "bill":
      return <ScreenBill period={period} onPeriodChange={onPeriod} />;
    case "trends":
      return <ScreenTrends />;
    case "goals":
      return <ScreenGoals />;
  }
}

/** One text step. Reports when it reaches the middle band of the viewport. */
function StepBlock({ step, index, onActive, children }: { step: Step; index: number; onActive: (i: number) => void; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="flex flex-col justify-center py-10 lg:min-h-[78vh] lg:py-0">
      <Label tone="cost-bright">
        {String(index + 1).padStart(2, "0")} / {step.tab}
      </Label>
      <h3 className="display mt-4 text-[clamp(2.75rem,6vw,4.5rem)] text-cream">{step.title}</h3>
      <p className="mt-5 max-w-md text-lg leading-relaxed text-dark-body">{step.body}</p>
      <ul className="mt-6 flex flex-col gap-2">
        {step.points.map((point) => (
          <li key={point} className="flex items-center gap-3 text-[15px] text-cream">
            <span aria-hidden className="h-2 w-2 shrink-0 bg-cost" />
            {point}
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}

/**
 * Sticky phone story. Desktop: the phone stays pinned while the text steps
 * scroll past, and the screen swaps to match. Mobile: each step carries its
 * own phone, stacked — no sticky behaviour.
 */
export function Features() {
  const [active, setActive] = useState(0);
  const [period, setPeriod] = useState<BillPeriod>("Today");
  const activeTab = showcase.steps[active].key as PhoneTab;

  return (
    <section aria-labelledby="showcase-title" className="relative border-b-2 border-ink bg-ink text-cream">
      <div aria-hidden className="tex-grain-dark-soft absolute inset-0" />
      <div className="relative mx-auto max-w-[1240px] px-5 pt-20 pb-10 sm:px-8 lg:pt-28 lg:pb-0">
        <Eyebrow tone="cost-bright">{showcase.eyebrow}</Eyebrow>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="showcase-title" className="display text-[clamp(3rem,9vw,6.5rem)] text-cream">
            {showcase.headline}
          </h2>
          <p className="label max-w-xs text-[11px] leading-relaxed text-dark-muted">{showcase.illustrativeNote}</p>
        </div>

        <div className="mt-8 lg:mt-0 lg:grid lg:grid-cols-[1fr_minmax(0,400px)] lg:gap-16">
          <div>
            {showcase.steps.map((step, i) => {
              const tab = step.key as PhoneTab;
              return (
                <StepBlock key={step.key} step={step} index={i} onActive={setActive}>
                  {/* Mobile/tablet: inline phone per step */}
                  <div className="mt-10 lg:hidden">
                    <div className="relative mx-auto w-full max-w-[320px]">
                      <PhoneFrame activeTab={tab} label={LABELS[tab]} interactive={tab === "bill"} shadow="cost">
                        <Screen tab={tab} period={period} onPeriod={setPeriod} />
                      </PhoneFrame>
                      <IllustrativeTag className="absolute -bottom-3 -left-2 rotate-[-3deg]" />
                    </div>
                    {tab === "bill" && <p className="label mt-8 text-center text-[11px] text-cost">{showcase.tryIt} ↑</p>}
                  </div>
                </StepBlock>
              );
            })}
          </div>

          {/* Desktop: pinned phone */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(56px+3vh)] flex flex-col items-center pb-[6vh]">
              <div className="relative w-full" style={{ maxWidth: "min(370px, 38vh)" }}>
                <PhoneFrame
                  activeTab={activeTab}
                  label={LABELS[activeTab]}
                  interactive={activeTab === "bill"}
                  shadow="cost"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={activeTab}
                      className="absolute inset-0"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -24 }}
                      transition={{ duration: 0.28, ease: [0.2, 0.9, 0.1, 1] }}
                    >
                      <Screen tab={activeTab} period={period} onPeriod={setPeriod} />
                    </motion.div>
                  </AnimatePresence>
                </PhoneFrame>
                <IllustrativeTag className="absolute -bottom-3 -left-6 rotate-[-3deg]" />
              </div>
              <ol className="mt-7 flex gap-2" aria-label="Showcase progress">
                {showcase.steps.map((step, i) => (
                  <li
                    key={step.key}
                    aria-current={i === active ? "step" : undefined}
                    className={`label border-2 px-2 py-1 text-[10px] transition-colors ${
                      i === active ? "border-cost bg-cost text-ink" : "border-dark-muted/50 text-dark-muted"
                    }`}
                  >
                    {step.tab}
                  </li>
                ))}
              </ol>
              <p className={`label mt-4 text-[11px] text-cost transition-opacity ${activeTab === "bill" ? "opacity-100" : "opacity-0"}`}>
                {showcase.tryIt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
