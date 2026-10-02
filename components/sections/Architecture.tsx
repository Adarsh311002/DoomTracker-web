import { architecture } from "@/content/copy";
import { Eyebrow, Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";

const LANE_STYLE = [
  { tag: "text-protect", box: "border-cream/80 bg-ink" },
  { tag: "text-cost", box: "border-cost bg-cost/10" },
  { tag: "text-cream", box: "border-cream/80 bg-ink" },
];

/** Global 1-based step number for each node, across lanes. */
const OFFSETS = architecture.lanes.map((_, li) =>
  architecture.lanes.slice(0, li).reduce((sum, lane) => sum + lane.nodes.length, 0),
);

export function Architecture() {
  return (
    <section id="under-the-hood" aria-labelledby="arch-title" className="relative border-b-2 border-ink bg-ink text-cream">
      <div aria-hidden className="tex-grain-dark-soft absolute inset-0" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <Reveal>
            <Eyebrow tone="cost-bright">{architecture.eyebrow}</Eyebrow>
            <h2 id="arch-title" className="display text-[clamp(3rem,8vw,5.5rem)] text-cream">
              {architecture.headline}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-dark-body">{architecture.body}</p>
            <dl className="mt-10 flex flex-col border-t-2 border-cream/20">
              {architecture.facts.map((f) => (
                <div key={f.k} className="flex justify-between gap-6 border-b-2 border-cream/20 py-3">
                  <dt className="label text-[11px] text-dark-muted">{f.k}</dt>
                  <dd className="text-right text-[14px] text-cream">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.08}>
            <ol aria-label="Data flow, from Android to the screens" className="flex flex-col">
              {architecture.lanes.map((lane, li) => (
                <li key={lane.name} className="flex flex-col">
                  <Label tone="dark-muted" as="h3" className={`mb-2 ${li > 0 ? "mt-2" : ""} ${LANE_STYLE[li].tag}`}>
                    {lane.name}
                  </Label>
                  <ol className="flex flex-col">
                    {lane.nodes.map((node, ni) => {
                      const n = OFFSETS[li] + ni + 1;
                      const lastOverall = li === architecture.lanes.length - 1 && ni === lane.nodes.length - 1;
                      return (
                        <li key={node.title} className="flex flex-col items-stretch">
                          <div
                            className={`grid grid-cols-[2.5rem_1fr] items-center gap-3 border-2 px-4 py-3 sm:grid-cols-[2.5rem_14rem_1fr] ${
                              lastOverall ? "border-cost bg-cost text-ink" : LANE_STYLE[li].box
                            }`}
                          >
                            <span className={`label text-[10px] ${lastOverall ? "text-ink" : "text-dark-muted"}`}>
                              {String(n).padStart(2, "0")}
                            </span>
                            <span className="display text-xl leading-none">{node.title}</span>
                            <span
                              className={`col-start-2 text-[13px] sm:col-start-3 ${lastOverall ? "text-ink" : "text-dark-muted"}`}
                            >
                              {node.detail}
                            </span>
                          </div>
                          {!lastOverall && (
                            <span aria-hidden className="ml-[2.1rem] h-4 w-[2px] bg-cream/40" />
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
