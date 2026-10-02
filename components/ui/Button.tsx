import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "ink" | "outline";
type Size = "md" | "lg" | "sm";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-cost text-ink border-ink shadow-hard",
  ink: "bg-ink text-cream border-ink shadow-hard-cost",
  outline: "bg-cream text-ink border-ink shadow-hard",
};

const ON_DARK: Record<Variant, string> = {
  primary: "bg-cost text-ink border-cream shadow-hard-cream",
  ink: "bg-ink text-cream border-cream shadow-hard-cream",
  outline: "bg-transparent text-cream border-cream shadow-hard-cream",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-4 text-lg",
  md: "h-12 px-6 text-xl",
  lg: "h-14 px-7 text-2xl",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  onDark = false,
  className = "",
}: {
  variant?: Variant;
  size?: Size;
  onDark?: boolean;
  className?: string;
}) {
  return [
    "press display inline-flex items-center justify-center gap-3 border-2 whitespace-nowrap select-none",
    "cursor-pointer leading-none tracking-wide",
    (onDark ? ON_DARK : VARIANTS)[variant],
    SIZES[size],
    className,
  ].join(" ");
}

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
  size?: Size;
  onDark?: boolean;
}

export function Button({ variant, size, onDark, className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, onDark, className })} {...rest} />;
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  onDark?: boolean;
  className?: string;
  external?: boolean;
}

export function ButtonLink({ href, children, variant, size, onDark, className, external }: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, onDark, className });
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
