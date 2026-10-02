import { limits } from "@/content/copy";
import { Eyebrow } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";

export function HonestLimits() {
  return (
    <section id="limits" aria-labelledby="limits-title" className="relative border-b-2 border-ink bg-cream">
      <div aria-hidden className="tex-ruled absolute inset-0" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal className="max-w-3xl">
          <Eyebrow>{limits.eyebrow}</Eyebrow>
          <h2 id="limits-title" className="display text-[clamp(3.25rem,9vw,6.5rem)] text-ink">
            {limits.headline[0]}
            <br />
            <span className="text-cost">{limits.headline[1]}</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">{limits.body}</p>
        </Reveal>

        <ol className="mt-14 grid gap-px border-2 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4">
          {limits.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={(i % 4) * 0.04} className="bg-surface p-6">
              <p className="label text-[10px] text-cost-ink">{String(i + 1).padStart(2, "0")} · Scope</p>
              <h3 className="display mt-3 text-[28px] leading-[0.95] text-ink">{item.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink/75">{item.why}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
