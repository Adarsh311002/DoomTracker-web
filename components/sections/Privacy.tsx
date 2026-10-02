import { privacy } from "@/content/copy";
import { Eyebrow, Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";

export function Privacy() {
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="relative border-b-2 border-ink bg-protect-fill">
      <div aria-hidden className="tex-grain absolute inset-0" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Reveal>
            <Eyebrow tone="protect">{privacy.eyebrow}</Eyebrow>
            <h2 id="privacy-title" className="display text-[clamp(3.25rem,9vw,6.5rem)] text-ink">
              {privacy.headline[0]}
              <br />
              <span className="text-protect">{privacy.headline[1]}</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">{privacy.body}</p>
          </Reveal>

          {/* Sees / never sees */}
          <Reveal delay={0.06}>
            <div className="grid grid-cols-2 border-2 border-ink bg-surface shadow-[8px_8px_0_0_var(--color-protect)]">
              <div className="border-r-2 border-ink p-5">
                <Label tone="protect">What it reads</Label>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {privacy.sees.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-[15px] text-ink">
                      <span aria-hidden className="mt-1.5 h-2.5 w-2.5 shrink-0 bg-protect" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5">
                <Label tone="cost">What it can’t see</Label>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {privacy.neverSees.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-[15px] text-ink/70 line-through decoration-cost decoration-2">
                      <span aria-hidden className="mt-1.5 h-2.5 w-2.5 shrink-0 border-2 border-cost" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="mt-14 grid border-t-2 border-l-2 border-ink sm:grid-cols-2 lg:grid-cols-3">
          {privacy.facts.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 0.04} className="border-r-2 border-b-2 border-ink bg-surface p-6">
              <p className="display text-3xl text-ink">{f.title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{f.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
