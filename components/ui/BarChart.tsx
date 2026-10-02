"use client";

import { motion } from "motion/react";
import type { DailyStatView } from "@/lib/stats";

/**
 * The app's bar chart: halftone ink bars, the worst day in solid orange, the
 * in-progress day as an empty outline. Bars grow from the baseline on reveal.
 */
export function BarChart({
  days,
  height = 120,
  averageMinutes,
  gap = 6,
  showLabels = true,
  labelEvery = 1,
  className = "",
  animate = true,
}: {
  days: readonly DailyStatView[];
  height?: number;
  averageMinutes?: number;
  gap?: number;
  showLabels?: boolean;
  labelEvery?: number;
  className?: string;
  animate?: boolean;
}) {
  const max = Math.max(1, ...days.map((d) => d.minutes));
  const last = days.length - 1;

  return (
    <div className={className} aria-hidden>
      <div className="relative border-b-2 border-ink" style={{ height }}>
        <div className="absolute inset-0 flex items-end" style={{ gap }}>
          {days.map((day, i) => {
            const fill = day.highlighted ? "bg-cost" : day.incomplete ? "bg-cream" : "tex-bar";
            return (
              <motion.div
                key={i}
                className={`flex-1 border-2 border-b-0 border-ink ${fill}`}
                style={{ height: `${Math.max(3, (day.minutes / max) * 100)}%`, originY: 1 }}
                initial={animate ? { scaleY: 0 } : false}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.45, delay: animate ? Math.min(i * 0.03, 0.4) : 0, ease: [0.2, 0.9, 0.1, 1] }}
              />
            );
          })}
        </div>
        {averageMinutes !== undefined && (
          <div
            className="pointer-events-none absolute right-0 left-0 border-t-2 border-dashed border-muted/70"
            style={{ bottom: `${(averageMinutes / max) * 100}%` }}
          />
        )}
      </div>
      {showLabels && (
        <div className="mt-1.5 flex" style={{ gap }}>
          {days.map((day, i) => {
            const show = i === last || i % labelEvery === 0;
            return (
              <span
                key={i}
                className={`label flex-1 text-center text-[8px] tracking-normal ${
                  day.highlighted ? "text-cost-ink" : i === last ? "text-ink" : "text-label"
                }`}
              >
                {show ? day.label : ""}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
