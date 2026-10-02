import Link from "next/link";
import { footer } from "@/content/copy";
import { PRODUCT_VERSION_LABEL } from "@/lib/config";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-cream">
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="display mt-6 text-4xl text-cream">{footer.tagline}</p>
            <p className="label mt-4 text-[11px] text-dark-muted">{PRODUCT_VERSION_LABEL}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-3">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="label text-xs text-dark-body hover:text-cost">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 border-t-2 border-dark-muted/30 pt-6">
          <p className="max-w-3xl text-[13px] leading-relaxed text-dark-muted">{footer.disclaimer}</p>
          <p className="label mt-4 text-[10px] text-dark-muted">© {new Date().getFullYear()} Doom Tracker</p>
        </div>
      </div>
    </footer>
  );
}
