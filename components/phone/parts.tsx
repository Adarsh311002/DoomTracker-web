"use client";

import type { ReactNode } from "react";

/** The app's black screen header: spaced mono title left, muted meta right. */
export function AppHeader({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between bg-ink px-5">
      <span className="label text-[10px] tracking-[0.3em] text-cream">{title}</span>
      {right && <span className="label text-[10px] tracking-[0.2em] text-dark-muted">{right}</span>}
    </div>
  );
}

/** Segmented period switcher (Today / 7 Days / 30 Days). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange?: (value: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex h-11 shrink-0 border-b-2 border-ink">
      {options.map((option, i) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange?.(option)}
            onKeyDown={(e) => {
              if (!onChange) return;
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const dir = e.key === "ArrowRight" ? 1 : -1;
                const next = options[(i + dir + options.length) % options.length];
                onChange(next);
                const group = e.currentTarget.parentElement;
                requestAnimationFrame(() => {
                  group?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
                });
              }
            }}
            className={`label flex-1 cursor-pointer text-[10px] tracking-[0.2em] transition-colors ${
              i > 0 ? "border-l-2 border-ink" : ""
            } ${selected ? "bg-ink text-cream" : "tex-grain bg-cream text-ink hover:bg-surface"}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

/** Small mono label used throughout the screens. */
export function ScreenLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`label text-[9px] tracking-[0.24em] ${className}`}>{children}</p>;
}
