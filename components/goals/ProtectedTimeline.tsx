import type { DaySession, Overlap } from "@/lib/protected";
import type { DemoGoal } from "@/lib/demo";
import { formatMinuteOfDay } from "@/lib/format";

/** Visible range: 07:00 → 24:00 — wide enough to read the overlaps. */
const FROM = 420;
const TO = 1440;
const pos = (m: number) => `${((m - FROM) / (TO - FROM)) * 100}%`;
const len = (m: number) => `${(m / (TO - FROM)) * 100}%`;

/**
 * A day strip (07:00–24:00): protected windows in blue, risk-app sessions in orange,
 * and the overlapping minutes hatched. Text equivalent is provided by the
 * caller's summary list; this graphic is aria-hidden.
 */
export function ProtectedTimeline({
  goals,
  sessions,
  overlaps,
}: {
  goals: readonly DemoGoal[];
  sessions: readonly DaySession[];
  overlaps: readonly Overlap[];
}) {
  const windows = goals.filter((g) => g.protectedWindow && g.protectedWindowEnabled);

  return (
    <div aria-hidden className="select-none">
      <div className="relative h-28 border-2 border-ink bg-surface">
        {/* hour rules */}
        {[540, 720, 900, 1080, 1260].map((m) => (
          <span key={m} className="absolute top-0 bottom-0 w-px bg-ink/12" style={{ left: pos(m) }} />
        ))}
        {/* protected windows */}
        {windows.map((g) => (
          <div
            key={g.id}
            className="absolute top-0 bottom-0 border-x-2 border-protect bg-protect-fill"
            style={{ left: pos(g.protectedWindow!.start), width: len(g.protectedWindow!.end - g.protectedWindow!.start) }}
          >
            <span className="label absolute top-1 left-1 text-[8px] whitespace-nowrap text-protect-ink">{g.name}</span>
          </div>
        ))}
        {/* sessions */}
        {sessions.map((s, i) => (
          <div
            key={i}
            className="absolute bottom-3 h-7 min-w-[3px] border-2 border-ink bg-cost"
            style={{ left: pos(s.start), width: len(s.end - s.start) }}
          />
        ))}
        {/* overlap hatching */}
        {overlaps.map((o, i) => (
          <div
            key={`o${i}`}
            className="absolute top-8 bottom-3 min-w-[3px]"
            style={{
              left: pos(o.start),
              width: len(o.end - o.start),
              backgroundImage: "repeating-linear-gradient(135deg, var(--color-ink) 0 2px, transparent 2px 5px)",
            }}
          />
        ))}
      </div>
      <div className="relative mt-1.5 h-4">
        {[FROM, 720, 1080, TO].map((m) => (
          <span
            key={m}
            className="label absolute text-[9px] text-label"
            style={{ left: pos(m), transform: m === FROM ? "none" : m === TO ? "translateX(-100%)" : "translateX(-50%)" }}
          >
            {formatMinuteOfDay(m)}
          </span>
        ))}
      </div>
    </div>
  );
}
