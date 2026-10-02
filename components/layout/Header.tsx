import Link from "next/link";
import { nav } from "@/content/copy";
import { GITHUB_URL } from "@/lib/config";
import { PlayStoreButton } from "@/components/cta/PlayStoreButton";
import { Logo } from "./Logo";

export function Header({ links = true }: { links?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-ink text-cream">
      <a
        href="#main"
        className="label sr-only z-50 bg-cost px-4 py-3 text-ink focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8">
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
        <div className="flex items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="label hidden text-[11px] text-dark-muted transition-colors hover:text-cream sm:inline"
          >
            GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <PlayStoreButton
            size="sm"
            onDark
            className="h-9! px-3! text-base!"
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
