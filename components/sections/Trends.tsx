"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { trends } from "@/content/copy";
import { DEMO_30_DAY_STATS } from "@/lib/demo";
import { formatMinutesAsClock } from "@/lib/format";
import { formatStat } from "@/components/phone/ScreenTrends";
import { IllustrativeTag } from "@/components/ui/Badge";
import { Eyebrow, Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";

function titleDate(label: string) {
  const [m, d] = label.split(" ");
  return `${m[0]}${m.slice(1).toLowerCase()} ${d}`;
}

export function Trends() {
  const stats = DEMO_30_DAY_STATS;
  const max = Math.max(...stats.days.map((d) => d.minutes));
  const [focus, setFocus] = useState<number | null>(null);
  const shown = focus ?? stats.days.length - 1;
  const day = stats.days[shown];
  const best = stats.days[stats.bestDayIndex];
  const worst = stats.days[stats.worstDayIndex];

  return (
    <section aria-labelledby="trends-title" className="relative border-b-2 border-ink bg-ink text-cream">
      <div aria-hidden className="tex-grain-dark-soft absolute inset-0" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <Reveal>
            <Eyebrow tone="cost-bright">{trends.eyebrow}</Eyebrow>
            <h2 id="trends-title" className="display text-[clamp(3rem,8vw,5.5rem)] text-cream">
              {trends.headline}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-dark-body">{trends.body}</p>

            <div className="mt-10 grid grid-cols-2 gap-px border-2 border-cream/20 bg-cream/20">
              <div className="bg-ink p-4">
                <Label tone="protect-bright">{trends.liveNow.title}</Label>
                <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-cream">
                  {trends.liveNow.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-ink p-4">
                <Label tone="dark-muted">{trends.inProgress.title}</Label>
                <ul className="mt-3 flex flex-col gap-1.5 text-[14px] text-dark-muted">
                  {trends.inProgress.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-snug text-dark-muted">{trends.inProgress.note}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border-2 border-cream bg-cream p-5 text-ink shadow-hard-cost sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Label>Daily average · last 30 days</Label>
                  <p className="display mt-2 text-7xl text-ink sm:text-8xl">{formatMinutesAsClock(stats.averageMinutes)}</p>
                </div>
                <div className="text-right" aria-live="polite">
                  <Label>{titleDate(day.label)}{day.incomplete ? " · today, so far" : ""}</Label>
                  <p className={`display mt-2 text-5xl ${day.highlighted ? "text-cost" : "text-ink"}`}>{formatStat(day.minutes)}</p>
                </div>
              </div>

              <div className="relative mt-8" onMouseLeave={() => setFocus(null)}>
                <div
                  role="list"
                  aria-label="Doomscroll minutes per day, last 30 days (illustrative)"
                  className="relative flex h-56 items-end gap-[3px] border-b-2 border-ink sm:h-64 sm:gap-1"
                >
                  {stats.days.map((d, i) => {
                    const fill = d.highlighted ? "bg-cost" : d.incomplete ? "bg-cream" : "tex-bar";
                    const active = focus === i;
                    return (
                      <div key={d.label} role="listitem" className="flex h-full flex-1 items-end">
                        <motion.button
                          type="button"
                          aria-label={`${titleDate(d.label)}: ${formatStat(d.minutes).toLowerCase()}${
                            i === stats.bestDayIndex ? ", best day" : i === stats.worstDayIndex ? ", worst day" : ""
                          }${d.incomplete ? ", today so far" : ""}`}
                          onMouseEnter={() => setFocus(i)}
                          onFocus={() => setFocus(i)}
                          onBlur={() => setFocus(null)}
                          className={`w-full cursor-pointer border-2 border-b-0 border-ink ${fill} ${
                            active ? "outline-2 outline-offset-2 outline-protect" : ""
                          } focus-visible:outline-offset-2`}
                          style={{ height: `${(d.minutes / max) * 100}%`, originY: 1 }}
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.45, delay: i * 0.015, ease: [0.2, 0.9, 0.1, 1] }}
                        />
                      </div>
                    );
                  })}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 left-0 border-t-2 border-dashed border-ink/50"
                    style={{ bottom: `${(stats.averageMinutes / max) * 100}%` }}
                  >
                    <span className="label absolute -top-5 right-0 bg-cream px-1 text-[9px] text-label">Avg</span>
                  </div>
                </div>
                <div aria-hidden className="mt-2 flex justify-between">
                  {[0, 7, 14, 21, 29].map((i) => (
                    <span key={i} className="label text-[9px] text-label">
                      {titleDate(stats.days[i].label)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="border-2 border-ink bg-surface p-4">
                  <Label>Best day</Label>
                  <p className="display mt-1 text-4xl text-protect">{formatStat(best.minutes)}</p>
                  <p className="text-[13px] text-label">{titleDate(best.label)}</p>
                </div>
                <div className="border-2 border-ink bg-surface p-4">
                  <Label>Worst day</Label>
                  <p className="display mt-1 text-4xl text-cost">{formatStat(worst.minutes)}</p>
                  <p className="text-[13px] text-label">{titleDate(worst.label)}</p>
                </div>
              </div>
              <IllustrativeTag className="mt-6" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
