import { howItWorks } from "@/content/copy";
import { DEMO_CLASSIFIER_SESSIONS, DOOMSCROLL_THRESHOLD_MINUTES, RISK_APPS } from "@/lib/demo";
import { Badge, IllustrativeTag } from "@/components/ui/Badge";
import { Eyebrow, Label } from "@/components/ui/Label";
import { Reveal } from "@/components/ui/Reveal";

function formatSessionMinutes(m: number) {
  return Number.isInteger(m) ? `${m} min` : `${Math.floor(m)} min ${Math.round((m % 1) * 60)} s`;
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative border-b-2 border-ink bg-surface">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
          <h2 id="how-title" className="display max-w-3xl text-[clamp(3rem,8vw,5.5rem)] text-ink">
            {howItWorks.headline}
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {howItWorks.steps.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 0.06} className="border-2 border-ink bg-cream p-6 shadow-hard">
              <p className="display text-6xl text-cost">{step.n}</p>
              <h3 className="display mt-4 text-3xl text-ink">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{step.body}</p>
            </Reveal>
          ))}
        </ol>

        {/* Pipeline */}
        <Reveal className="mt-16">
          <Label tone="ink">The pipeline</Label>
          <ol className="mt-5 grid border-2 border-ink sm:grid-cols-5">
            {howItWorks.pipeline.map((node, i) => {
              const last = i === howItWorks.pipeline.length - 1;
              return (
                <li
                  key={node.key}
                  className={`relative flex flex-col justify-between gap-6 p-5 ${
                    last ? "bg-ink text-cream" : "bg-cream text-ink"
                  } ${i > 0 ? "border-t-2 border-ink sm:border-t-0 sm:border-l-2" : ""}`}
                >
                  <span className={`label text-[10px] ${last ? "text-cost" : "text-label"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className={`display text-2xl ${last ? "text-cost" : ""}`}>{node.title}</p>
                    <p className={`mt-1 text-[13px] ${last ? "text-dark-body" : "text-label"}`}>{node.note}</p>
                  </div>
                  {!last && (
                    <span
                      aria-hidden
                      className="absolute -bottom-[13px] left-5 z-10 grid h-6 w-6 place-items-center border-2 border-ink bg-cost text-xs text-ink sm:top-1/2 sm:-right-[13px] sm:bottom-auto sm:left-auto sm:-translate-y-1/2"
                    >
                      <span className="sm:hidden">↓</span>
                      <span className="hidden sm:inline">→</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </Reveal>

        {/* The rule */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.2fr] [&>*]:min-w-0">
          <Reveal>
            <h3 className="display text-4xl text-ink">{howItWorks.ruleTitle}</h3>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink/80">{howItWorks.ruleBody}</p>
            <Label tone="muted" className="mt-6">
              {howItWorks.ruleRiskApps}
            </Label>
            <ul className="mt-3 flex flex-wrap gap-2">
              {RISK_APPS.map((app) => (
                <li key={app.pkg}>
                  <Badge variant="ink">{app.name}</Badge>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="border-2 border-ink bg-cream shadow-hard">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink px-4 py-3">
                <Label tone="ink">Sessions → doomscroll minutes</Label>
                <IllustrativeTag />
              </div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-left">
                <caption className="sr-only">
                  Example sessions and whether they count as doomscrolling under the V1 rule
                </caption>
                <thead>
                  <tr className="border-b-2 border-ink">
                    {["App", "Length", "Risk app", `≥ ${DOOMSCROLL_THRESHOLD_MINUTES} min`, "Counts"].map((h) => (
                      <th key={h} scope="col" className="label px-4 py-2.5 text-[10px] font-bold text-label">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEMO_CLASSIFIER_SESSIONS.map((s) => {
                    const long = s.minutes >= DOOMSCROLL_THRESHOLD_MINUTES;
                    const counts = s.risk && long;
                    return (
                      <tr key={s.app} className="border-b border-ink/15 last:border-0">
                        <th scope="row" className="px-4 py-3 text-[14px] font-medium text-ink">
                          {s.app}
                        </th>
                        <td className="px-4 py-3 text-[14px] text-ink">{formatSessionMinutes(s.minutes)}</td>
                        <td className="label px-4 py-3 text-[11px]">{s.risk ? "Yes" : <span className="text-label">No</span>}</td>
                        <td className="label px-4 py-3 text-[11px]">{long ? "Yes" : <span className="text-label">No</span>}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`label inline-block min-w-[4.5rem] border-2 border-ink px-2 py-1 text-center text-[10px] ${
                              counts ? "bg-cost text-ink" : "bg-surface text-label"
                            }`}
                          >
                            {counts ? `${s.minutes} min` : "0 min"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
