import { finalCta } from "@/content/copy";
import { GITHUB_URL } from "@/lib/config";
import { PlayStoreButton } from "@/components/cta/PlayStoreButton";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Sunburst } from "@/components/ui/Sunburst";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden border-b-2 border-ink bg-cost">
      <div aria-hidden className="tex-halftone absolute top-0 right-0 h-full w-1/2 opacity-0 sm:opacity-100" style={{ filter: "brightness(0.82)", maskImage: "linear-gradient(to left, black, transparent)" }} />
      <Sunburst
        className="absolute -bottom-40 -left-40 h-[420px] w-[420px] opacity-90 sm:-bottom-56 sm:-left-48 sm:h-[560px] sm:w-[560px]"
        color="var(--color-ink)"
      />
      <div className="relative mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32">
        <Reveal className="ml-auto max-w-3xl text-right">
          <Label tone="ink">{finalCta.eyebrow}</Label>
          <h2 id="final-title" className="display mt-5 text-[clamp(3.5rem,11vw,8rem)] text-ink">
            {finalCta.headline[0]}
            <br />
            <span className="text-cream">{finalCta.headline[1]}</span>
          </h2>
          <p className="mt-6 ml-auto max-w-md text-lg leading-relaxed text-ink">{finalCta.body}</p>
          <div className="mt-10 flex flex-wrap justify-end gap-4">
            <PlayStoreButton variant="ink" onDark size="lg" />
            <ButtonLink href={GITHUB_URL} external variant="outline" size="lg">
              GitHub ↗
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
