import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Label } from "@/components/ui/Label";
import { privacyIntro, privacySections } from "@/content/privacy";
import { GITHUB_URL, PRIVACY_CONTACT_EMAIL, PRIVACY_LAST_UPDATED } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Doom Tracker handles your data: usage data is read on-device via Android's UsageStatsManager, stored locally, and never sent to a server.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy policy — Doom Tracker", url: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main" className="relative bg-cream">
        <div aria-hidden className="tex-grain absolute inset-0" />

        <div className="relative border-b-2 border-ink bg-ink text-cream">
          <div aria-hidden className="tex-grain-dark-soft absolute inset-0" />
          <div className="relative mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-24">
            <Label tone="cost-bright">Legal · Draft for review</Label>
            <h1 className="display mt-5 text-[clamp(3.5rem,11vw,7.5rem)] text-cream">Privacy policy</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dark-body">{privacyIntro}</p>
            <p className="label mt-8 text-[11px] text-dark-muted">Last updated · {PRIVACY_LAST_UPDATED}</p>
          </div>
        </div>

        <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[240px_1fr] lg:gap-20 lg:py-24">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24">
              <Label tone="ink">On this page</Label>
              <ol className="mt-4 flex flex-col gap-2 border-l-2 border-ink pl-4">
                {privacySections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="text-[14px] text-label hover:text-cost-ink">
                      {s.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#contact" className="text-[14px] text-label hover:text-cost-ink">
                    Contact
                  </a>
                </li>
              </ol>
            </div>
          </nav>

          <article className="max-w-[68ch]">
            <div className="mb-12 border-2 border-dashed border-ink bg-surface p-5">
              <Label tone="cost">Status</Label>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">
                Doom Tracker is not yet published on Google Play. This draft describes the V1 build in the{" "}
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline decoration-cost decoration-2 underline-offset-2">
                  public source repository
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>{" "}
                and will be reviewed before public launch.
              </p>
            </div>

            {privacySections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="border-t-2 border-ink py-10 first:border-t-0 first:pt-0">
                <p className="label text-[11px] text-cost-ink">{String(i + 1).padStart(2, "0")}</p>
                <h2 id={`${s.id}-h`} className="display mt-2 text-4xl text-ink sm:text-5xl">
                  {s.title}
                </h2>
                <div className="mt-5 flex flex-col gap-4 text-[17px] leading-relaxed text-ink/85">
                  {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {s.list && (
                    <ul className="flex flex-col gap-2.5">
                      {s.list.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden className="mt-2.5 h-2 w-2 shrink-0 bg-cost" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.after?.map((p) => <p key={p}>{p}</p>)}
                </div>
              </section>
            ))}

            <section id="contact" aria-labelledby="contact-h" className="border-t-2 border-ink py-10">
              <h2 id="contact-h" className="display text-4xl text-ink sm:text-5xl">
                Contact
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-ink/85">
                {PRIVACY_CONTACT_EMAIL ? (
                  <>
                    Questions about this policy:{" "}
                    <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`} className="underline decoration-cost decoration-2 underline-offset-2">
                      {PRIVACY_CONTACT_EMAIL}
                    </a>
                  </>
                ) : (
                  <>
                    A privacy contact address will be added here before public launch. Until then, questions can be raised on the{" "}
                    <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="underline decoration-cost decoration-2 underline-offset-2">
                      project’s GitHub issues
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    .
                  </>
                )}
              </p>
            </section>

            <Link href="/" className="label mt-6 inline-block border-b-2 border-cost pb-1 text-xs text-ink">
              ← Back to Doom Tracker
            </Link>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
