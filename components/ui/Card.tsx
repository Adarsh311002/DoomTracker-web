import type { ReactNode } from "react";

type Shadow = "ink" | "cost" | "protect" | "cream" | "none";

const SHADOWS: Record<Shadow, string> = {
  ink: "shadow-hard",
  cost: "shadow-hard-cost",
  protect: "shadow-[6px_6px_0_0_var(--color-protect)]",
  cream: "shadow-hard-cream",
  none: "",
};

/** Square, 2px-bordered card with a hard offset shadow. */
export function Card({
  children,
  className = "",
  shadow = "ink",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  shadow?: Shadow;
  as?: "div" | "article" | "li" | "section" | "figure";
}) {
  return <Tag className={`border-2 border-ink bg-surface ${SHADOWS[shadow]} ${className}`}>{children}</Tag>;
}
