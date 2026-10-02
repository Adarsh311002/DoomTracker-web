"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * reducedMotion="user" makes every Motion animation honour
 * prefers-reduced-motion: transform/layout animations are skipped while
 * opacity changes still apply, so state stays legible.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ type: "tween", ease: [0.2, 0.9, 0.1, 1], duration: 0.35 }}>
      {children}
    </MotionConfig>
  );
}
