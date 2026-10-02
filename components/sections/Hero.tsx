import { hero } from "@/content/copy";
import { GITHUB_URL } from "@/lib/config";
import { PlayStoreButton } from "@/components/cta/PlayStoreButton";
import { ButtonLink } from "@/components/ui/Button";
import { IllustrativeTag } from "@/components/ui/Badge";
import { Label } from "@/components/ui/Label";
import { Sunburst } from "@/components/ui/Sunburst";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { ScreenToday } from "@/components/phone/ScreenToday";

const CONCEPT = ["Screen time", "Doomscroll time", "Opportunity cost", "Your goals"];

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b-2 border-ink bg-ink text-cream">
      <div aria-hidden className="tex-grain-dark-soft absolute inset-0" />
      <div
        aria-hidden
        className="spin-in absolute -top-[14%] -right-[30%] w-[86vw] max-w-[760px] sm:-right-[14%] lg:-top-[30%] lg:-right-[8%] lg:w-[54vw]"
      >
        <Sunburst className="h-auto w-full" rays={32} />
      </div>

      <div className="relative mx-auto grid max-w-[1240px] gap-14 px-5 pt-14 pb-16 sm:px-8 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:pt-24 lg:pb-24">
        <div className="flex flex-col justify-center">
          <Label tone="cost-bright" className="rise">
            {hero.eyebrow}
          </Label>

          <h1 id="hero-title" className="display mt-6 text-[clamp(4.25rem,15vw,7.5rem)] text-cream">
            <span className="block overflow-hidden pb-[0.04em]">
              <span className="rise-line" style={delay(80)}>
                Every scroll
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <span className="rise-line" style={delay(160)}>
                has a <span className="text-cost">{hero.headlineAccent}</span>.
              </span>
            </span>
          </h1>

          <p className="rise mt-7 max-w-[34rem] text-lg leading-relaxed text-dark-body sm:text-xl" style={delay(300)}>
            {hero.body}
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-4" style={delay(380)}>
            <PlayStoreButton size="lg" onDark />
            <ButtonLink href={GITHUB_URL} external variant="outline" onDark size="lg">
              {hero.secondaryCta}
            </ButtonLink>
          </div>
          <p className="label mt-7 text-[11px] text-dark-muted">{hero.footnote}</p>
        </div>

        <div className="rise relative flex flex-col items-center justify-center lg:items-end" style={delay(200)}>
          <div className="relative w-full max-w-[340px]">
            <PhoneFrame
              activeTab="today"
              shadow="cost"
              label="Doom Tracker's Today screen showing 1 hour 37 minutes doomscrolled, split across Instagram, YouTube and Reddit. Illustrative data."
            >
              <ScreenToday />
            </PhoneFrame>
            <IllustrativeTag className="absolute -bottom-3 -left-3 rotate-[-3deg] sm:-left-8" />
          </div>
        </div>
      </div>

      <div className="relative border-t-2 border-cream/15 bg-ink">
        <ol
          aria-label="The Doom Tracker idea"
          className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-2 px-5 py-5 sm:px-8"
        >
          {CONCEPT.map((step, i) => (
            <li key={step} className="flex items-center gap-4">
              <span
                className={`label text-[11px] sm:text-xs ${
                  i === CONCEPT.length - 1 ? "text-protect" : i === 2 ? "text-cost" : "text-dark-body"
                }`}
              >
                {step}
              </span>
              {i < CONCEPT.length - 1 && (
                <span aria-hidden className="label text-xs text-dark-muted">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
