"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent, type RefObject } from "react";
import { comingSoon } from "@/content/copy";
import { GITHUB_URL } from "@/lib/config";
import { Sunburst } from "@/components/ui/Sunburst";
import { buttonClasses } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Built on the native <dialog> + showModal(), which makes the rest of the page
 * inert and handles Escape. On top of that: an explicit Tab focus trap,
 * aria-modal, labelled/described-by, backdrop-click to close, and focus
 * restoration to the element that opened it (handled by the caller via
 * `returnFocusRef`).
 */
export function ComingSoonModal({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleClose = () => {
    onClose();
    // Defer so the dialog has fully closed before focus moves.
    requestAnimationFrame(() => returnFocusRef?.current?.focus());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const nodes = ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!nodes || nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    // Clicks on the ::backdrop target the <dialog> element itself.
    if (event.target === ref.current) ref.current?.close();
  };

  return (
    <dialog
      ref={ref}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      className="dt-dialog m-auto w-[calc(100%-32px)] max-w-md overflow-visible border-2 border-ink bg-transparent p-0 text-ink shadow-hard-cost backdrop:bg-ink/75"
    >
      <div className="relative overflow-hidden bg-ink text-cream">
        <div aria-hidden className="tex-grain-dark absolute inset-0 opacity-60" />
        <Sunburst className="absolute -top-16 -right-16 h-44 w-44" />
        <div className="relative px-6 pt-8 pb-6">
          <Label tone="cost-bright">
            Google Play · Not yet listed
          </Label>
          <h2 id={titleId} className="display mt-3 max-w-[14ch] text-5xl text-cream">
            {comingSoon.title}
          </h2>
        </div>
      </div>
      <div className="tex-grain bg-cream px-6 pt-5 pb-6">
        <p id={descId} className="text-[15px] leading-relaxed text-ink">
          {comingSoon.body}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-label">{comingSoon.secondary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            autoFocus
            onClick={() => ref.current?.close()}
            className={buttonClasses({ variant: "primary", size: "sm" })}
          >
            {comingSoon.close}
          </button>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: "outline", size: "sm" })}
          >
            GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
