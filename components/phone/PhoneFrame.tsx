"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export type PhoneTab = "today" | "bill" | "trends" | "goals";

const TABS: { key: PhoneTab; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "bill", label: "The Bill" },
  { key: "trends", label: "Trends" },
  { key: "goals", label: "Goals" },
];

/** Logical canvas the screens are designed at (close to the app's 396dp reference). */
export const SCREEN_W = 360;
export const SCREEN_H = 740;
const BEZEL = 10;
const FRAME_W = SCREEN_W + BEZEL * 2;
const FRAME_H = SCREEN_H + BEZEL * 2;

/**
 * CSS-built Android phone. Screens render at a fixed logical size and the
 * whole device scales to its container, so the UI never reflows and stays
 * readable at any width.
 *
 * - `interactive={false}` (default): the device is a labelled image
 *   (role="img") and its internals are inert — no stray tab stops.
 * - `interactive`: role="group"; the screen's own controls are usable.
 */
export function PhoneFrame({
  children,
  activeTab,
  label,
  interactive = false,
  maxWidth = FRAME_W,
  className = "",
  shadow = "ink",
}: {
  children: ReactNode;
  activeTab: PhoneTab;
  label: string;
  interactive?: boolean;
  maxWidth?: number;
  className?: string;
  shadow?: "ink" | "cost" | "cream";
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(maxWidth / FRAME_W);

  useLayoutEffect(() => {
    const node = outerRef.current;
    if (!node) return;
    const update = () => setScale(node.clientWidth / FRAME_W);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const shadowColor =
    shadow === "cost" ? "var(--color-cost)" : shadow === "cream" ? "var(--color-cream)" : "var(--color-ink)";

  return (
    <div
      ref={outerRef}
      role={interactive ? "group" : "img"}
      aria-label={label}
      className={`relative w-full ${className}`}
      style={{ maxWidth, aspectRatio: `${FRAME_W} / ${FRAME_H}` }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
        inert={!interactive}
      >
        <div
          className="relative h-full w-full rounded-[38px] border-2 border-ink bg-ink"
          style={{ padding: BEZEL, boxShadow: `10px 10px 0 0 ${shadowColor}` }}
        >
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-cream">
            <StatusBar />
            <div className="tex-grain relative min-h-0 flex-1 overflow-hidden">{children}</div>
            <TabBar active={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="relative flex h-7 shrink-0 items-center justify-between bg-[#f5f8f6] px-5 text-[12px] font-medium text-ink">
      <span>9:30</span>
      <span aria-hidden className="absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
      <span aria-hidden className="flex items-center gap-1">
        <svg viewBox="0 0 16 12" className="h-2.5 w-3.5">
          <path d="M8 12 0 3.5a11.5 11.5 0 0 1 16 0z" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
          <path d="M12 0v12H0z" fill="currentColor" />
        </svg>
        <span className="block h-3 w-1.5 rounded-[1px] bg-ink" />
      </span>
    </div>
  );
}

function TabBar({ active }: { active: PhoneTab }) {
  return (
    <div className="flex h-[58px] shrink-0 items-stretch bg-ink px-2">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <div key={tab.key} className="relative flex flex-1 items-center justify-center">
            {isActive && <span className="absolute top-0 left-1/2 h-[4px] w-6 -translate-x-1/2 bg-cost" />}
            <span className={`label text-[9px] tracking-[0.16em] ${isActive ? "text-cream" : "text-dark-muted"}`}>
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
