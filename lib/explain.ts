import type { OpportunityCostAllocationResult } from "./allocate";

/**
 * Plain-English reading of an allocation result, for the website's
 * interactive demo. Website copy only — the V1 app does not generate this
 * sentence (its Bill narrative is still placeholder content).
 */
export function explainAllocation(
  result: OpportunityCostAllocationResult,
  names: Record<string, string>,
  totalMinutes: number,
): string {
  const total = Math.round(totalMinutes);
  if (total === 0) {
    return "Zero minutes scrolled. Nothing spent — every goal is untouched.";
  }
  if (result.allocations.length === 0) {
    return `${total} minutes scrolled, and no goals to price them against — all of it is unallocated.`;
  }

  const full: string[] = [];
  let partial: string | null = null;
  const untouched: string[] = [];

  for (const a of result.allocations) {
    const name = names[a.goalId] ?? a.goalId;
    if (a.periodTargetMinutes === 0) continue;
    if (a.allocatedMinutes >= a.periodTargetMinutes) {
      full.push(`${name} (${a.periodTargetMinutes} min)`);
    } else if (a.allocatedMinutes > 0) {
      partial = `${Math.round(a.allocatedMinutes)} of ${name}’s ${a.periodTargetMinutes} minutes`;
    } else {
      untouched.push(name);
    }
  }

  const parts: string[] = [];
  if (full.length > 0) parts.push(`all of ${list(full)}`);
  if (partial) parts.push(partial);

  if (parts.length === 0) {
    return `${total} minutes scrolled, and every goal has a zero target — all of it is unallocated.`;
  }

  let sentence = `${total} minutes would have paid for ${list(parts)}.`;
  if (untouched.length > 0) {
    sentence += ` ${list(untouched)} ${untouched.length === 1 ? "isn’t" : "aren’t"} reached.`;
  }
  const left = Math.round(result.unallocatedMinutes);
  if (left > 0) {
    sentence += ` ${left} more minutes go beyond every goal — unallocated.`;
  }
  return sentence;
}

function list(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
