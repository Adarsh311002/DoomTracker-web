"use client";

import { useRef, useState, type ReactNode } from "react";
import { PLAY_STORE_URL } from "@/lib/config";
import { hero } from "@/content/copy";
import { buttonClasses } from "@/components/ui/Button";
import { ComingSoonModal } from "./ComingSoonModal";

type Props = {
  label?: ReactNode;
  variant?: "primary" | "ink" | "outline";
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
  className?: string;
};

function PlayGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="h-[0.7em] w-[0.7em]" aria-hidden focusable="false">
      <path d="M3 1.5v13l11-6.5z" fill="currentColor" />
    </svg>
  );
}

/**
 * "Get it on Google Play". While PLAY_STORE_URL is null it opens the Coming
 * Soon modal; once a URL is configured it becomes a plain outbound link.
 * Deliberately a text CTA — no official badge until a real listing exists.
 */
export function PlayStoreButton({ label = hero.primaryCta, variant = "primary", size = "md", onDark, className }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const classes = buttonClasses({ variant, size, onDark, className });

  if (PLAY_STORE_URL) {
    return (
      <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className={classes}>
        <PlayGlyph />
        {label}
        <span className="sr-only"> (opens Google Play in a new tab)</span>
      </a>
    );
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={classes}
      >
        <PlayGlyph />
        {label}
      </button>
      {open && (
        <ComingSoonModal open={open} onClose={() => setOpen(false)} returnFocusRef={triggerRef} />
      )}
    </>
  );
}
