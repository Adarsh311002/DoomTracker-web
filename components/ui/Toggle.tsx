"use client";

import { motion } from "motion/react";

/** The app's square toggle: blue track + ink knob when on, white track when off. */
export function Toggle({
  checked,
  onChange,
  label,
  size = "md",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const dims = size === "sm" ? "h-6 w-11" : "h-7 w-[52px]";
  const knob = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative flex shrink-0 cursor-pointer items-center border-2 border-ink p-[2px] ${dims} ${
        checked ? "justify-end bg-protect" : "justify-start bg-surface"
      }`}
    >
      <motion.span layout transition={{ duration: 0.16, ease: [0.2, 0.9, 0.1, 1] }} className={`block bg-ink ${knob}`} />
    </button>
  );
}
