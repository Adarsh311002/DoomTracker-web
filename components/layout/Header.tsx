import Link from "next/link";
import { nav } from "@/content/copy";
import { PlayStoreButton } from "@/components/cta/PlayStoreButton";
import { Logo } from "./Logo";

function LockGlyph() {
  return (
    <svg viewBox="0 0 12 14" className="h-3.5 w-3" aria-hidden focusable="false">
      <path d="M3 6V4a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="0.5" y="6" width="11" height="7.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Trust CTA: a plain link to /privacy (no JS needed), styled in the cost
 * accent with the mechanical press. The hard shadow is cream rather than ink
 * so it stays visible on the ink header.
 */
function PrivacyCta() {
  return (
    <Link
      href="/privacy"
      className="press label inline-flex h-9 items-center gap-2 border-2 border-ink bg-cost px-3 text-[11px] whitespace-nowrap text-ink shadow-[3px_3px_0_0_var(--color-cream)] sm:px-3.5"
    >
      <LockGlyph />
      <span className="lg:hidden">Privacy</span>
      <span className="hidden lg:inline">Privacy Policy</span>
    </Link>
  );
}

export function Header({ links = true }: { links?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-ink text-cream">
      <a
        href="#main"
        className="label sr-only z-50 bg-cost px-4 py-3 text-ink focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" aria-label="Doom Tracker — home" className="shrink-0">
          <Logo />
        </Link>
        {links && (
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={`/${link.href}`}
                    className="label text-[11px] text-dark-muted transition-colors hover:text-cream"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <PrivacyCta />
          <PlayStoreButton
            size="sm"
            variant="outline"
            onDark
            className="h-9! px-3! text-base! shadow-[3px_3px_0_0_var(--color-cream)]!"
            label={
              <>
                <span className="sm:hidden">Get the app</span>
                <span className="hidden sm:inline">Get it on Google Play</span>
              </>
            }
          />
        </div>
      </div>
    </header>
  );
}
