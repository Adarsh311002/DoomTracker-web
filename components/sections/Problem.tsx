import { problem } from "@/content/copy";
import { allocateOpportunityCost, roundedPercent } from "@/lib/allocate";
import { DEFAULT_GOALS, DEMO_TODAY_MINUTES } from "@/lib/demo";
import { formatMinutesAsClock } from "@/lib/format";
import { IllustrativeTag } from "@/components/ui/Badge";
import { Eyebrow, Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";

export function Problem() {
  const { allocations } = allocateOpportunityCost(
    DEFAULT_GOALS.map((g) => ({ id: g.id, targetMinutesPerDay: g.targetMinutesPerDay })),
    DEMO_TODAY_MINUTES,
    1,
  );

  return (
    <section aria-labelledby="problem-title" className="relative overflow-hidden border-b-2 border-ink bg-cream">
      <div aria-hidden className="tex-grain absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1240px] gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-28">
        <Reveal>
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <h2 id="problem-title" className="display text-[clamp(3.5rem,10vw,7rem)] text-ink">
            {problem.headline[0]}
            <br />
            <span className="text-cost">{problem.headline[1]}</span>
          </h2>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink/80">{problem.body}</p>
        </Reveal>

        <div className="relative grid gap-6 sm:grid-cols-[0.85fr_1fr] sm:items-start">
          {/* The number */}
          <Reveal delay={0.05}>
            <figure className="border-2 border-dashed border-muted bg-cream/60 p-5 sm:mt-10">
              <Label tone="muted">{problem.otherLabel}</Label>
              <p className="mt-4 text-5xl font-medium tracking-tight text-muted">{problem.otherValue}</p>
              <figcaption className="mt-3 text-[14px] text-label">{problem.otherCaption}</figcaption>
            </figure>
          </Reveal>

          {/* The bill */}
          <Reveal delay={0.12}>
            <figure
              className="relative bg-surface pb-8 text-ink shadow-[0_0_0_2px_var(--color-ink)]"
              style={{
                clipPath:
                  "polygon(0 0,100% 0,100% calc(100% - 10px),95% 100%,90% calc(100% - 10px),85% 100%,80% calc(100% - 10px),75% 100%,70% calc(100% - 10px),65% 100%,60% calc(100% - 10px),55% 100%,50% calc(100% - 10px),45% 100%,40% calc(100% - 10px),35% 100%,30% calc(100% - 10px),25% 100%,20% calc(100% - 10px),15% 100%,10% calc(100% - 10px),5% 100%,0 calc(100% - 10px))",
              }}
            >
              <div className="flex items-center justify-between bg-ink px-5 py-3">
                <Label tone="cream" className="tracking-[0.3em]">
                  {problem.oursLabel}
                </Label>
                <Label tone="cost-bright">Receipt</Label>
              </div>
              <div className="px-5 pt-5">
                <Label tone="muted">Doomscrolled today</Label>
                <p className="display print-shadow mt-1 text-7xl text-cost">{formatMinutesAsClock(DEMO_TODAY_MINUTES)}</p>
                <div className="my-5 border-t-2 border-dashed border-ink" />
                <dl className="flex flex-col gap-2.5">
                  {allocations.map((a) => {
                    const goal = DEFAULT_GOALS.find((g) => g.id === a.goalId)!;
                    const pct = roundedPercent(a);
                    return (
                      <div key={a.goalId} className="flex items-baseline justify-between gap-3">
                        <dt className="label text-xs text-ink">{goal.name}</dt>
                        <span aria-hidden className="mb-1 flex-1 border-b-2 border-dotted border-faint" />
                        <dd className="label text-xs text-ink">
                          {Math.round(a.allocatedMinutes)}/{a.periodTargetMinutes}m ·{" "}
                          <span className={pct >= 100 ? "text-protect-ink" : "text-cost-ink"}>{pct}%</span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>
                <div className="my-5 border-t-2 border-dashed border-ink" />
                <figcaption className="text-[14px] leading-snug text-label">{problem.oursCaption}</figcaption>
              </div>
            </figure>
            <IllustrativeTag className="mt-4" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
