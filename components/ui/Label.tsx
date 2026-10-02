import type { ReactNode } from "react";

type Tone = "muted" | "cost" | "cost-bright" | "protect" | "protect-bright" | "ink" | "cream" | "dark-muted";

const TONES: Record<Tone, string> = {
  muted: "text-label",
  /** Small orange text on light surfaces (AA). */
  cost: "text-cost-ink",
  /** Orange text on dark surfaces. */
  "cost-bright": "text-cost",
  protect: "text-protect-ink",
  "protect-bright": "text-protect",
  ink: "text-ink",
  cream: "text-cream",
  "dark-muted": "text-dark-muted",
};

/** Monospaced uppercase metadata label — the app's small-caps label style. */
export function Label({
  children,
  tone = "muted",
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  as?: "p" | "span" | "div" | "h2" | "h3" | "dt";
}) {
  return <Tag className={`label text-[11px] sm:text-xs ${TONES[tone]} ${className}`}>{children}</Tag>;
}

/** Section eyebrow: a short rule + label. */
export function Eyebrow({ children, tone = "cost" }: { children: ReactNode; tone?: Tone }) {
  const rule = tone.startsWith("cost") ? "bg-cost" : tone.startsWith("protect") ? "bg-protect" : "bg-current";
  return (
    <div className="mb-5 flex items-center gap-3">
      <span aria-hidden className={`h-[2px] w-8 shrink-0 ${rule}`} />
      <Label tone={tone}>{children}</Label>
    </div>
  );
}
