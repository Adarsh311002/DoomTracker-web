import { Sunburst } from "@/components/ui/Sunburst";

/** Wordmark: sunburst mark + spaced mono "DOOM TRACKER", like the app header. */
export function Logo({ tone = "cream" }: { tone?: "cream" | "ink" }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`grid h-7 w-7 place-items-center border-2 ${tone === "cream" ? "border-cream bg-ink" : "border-ink bg-ink"}`}>
        <Sunburst className="h-5 w-5" rays={18} />
      </span>
      <span className={`label text-[13px] tracking-[0.32em] hidden sm:inline ${tone === "cream" ? "text-cream" : "text-ink"}`}>Doom Tracker</span>
    </span>
  );
}
