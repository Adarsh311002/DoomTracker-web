import type { ReactNode } from "react";

type Variant = "filled" | "outlined" | "cost" | "ink" | "illustrative";

const VARIANTS: Record<Variant, string> = {
  filled: "bg-protect text-ink border-ink",
  outlined: "bg-cream text-ink border-ink",
  cost: "bg-cost text-ink border-ink",
  ink: "bg-ink text-cream border-ink",
  illustrative: "bg-cream text-ink border-ink border-dashed",
};

/** The app's bordered rectangular badge ("-37 MIN VS YOUR AVERAGE"). */
export function Badge({
  children,
  variant = "outlined",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={`label inline-flex items-center border-2 px-2 py-1 text-[10px] leading-none whitespace-nowrap ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Marks demonstration data. Use anywhere a number isn't real. */
export function IllustrativeTag({ className = "", children = "Illustrative data" }: { className?: string; children?: ReactNode }) {
  return (
    <Badge variant="illustrative" className={className}>
      <span aria-hidden className="mr-1.5 inline-block h-1.5 w-1.5 bg-cost" />
      {children}
    </Badge>
  );
}
