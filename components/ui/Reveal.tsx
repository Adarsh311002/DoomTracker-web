"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const TAGS = { div: motion.div, li: motion.li, section: motion.section } as const;

/**
 * Short, mechanical section reveal: a small upward snap plus fade, once.
 * Under reduced motion, MotionConfig drops the transform and keeps the fade.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 18,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: keyof typeof TAGS;
}) {
  const Tag = TAGS[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.4, delay, ease: [0.2, 0.9, 0.1, 1] }}
    >
      {children}
    </Tag>
  );
}
