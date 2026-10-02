/**
 * Opportunity-cost allocation — a faithful port of the Doom Tracker mobile
 * app's `src/domain/allocateOpportunityCost.ts` (docs/architecture.md §12).
 *
 * Rules (unchanged from the app):
 * - Goals are processed strictly in array order; index 0 is highest priority.
 * - period target = daily target × number of days in the period.
 * - Each goal takes min(remaining, period target), so no goal exceeds 100%.
 * - Whatever is left after every goal is reported as `unallocatedMinutes`,
 *   never stacked onto a goal.
 * - A zero target is treated as already fully funded and consumes nothing.
 * - Deterministic and stateless: same inputs, same output.
 *
 * Do not "improve" this function — the website must demonstrate exactly the
 * semantics the app ships with.
 */

export interface OpportunityCostGoalInput {
  readonly id: string;
  readonly targetMinutesPerDay: number;
}

export interface GoalAllocation {
  readonly goalId: string;
  readonly periodTargetMinutes: number;
  readonly allocatedMinutes: number;
  readonly fundedPercent: number;
}

export interface OpportunityCostAllocationResult {
  readonly allocations: readonly GoalAllocation[];
  readonly unallocatedMinutes: number;
}

export function allocateOpportunityCost(
  goals: readonly OpportunityCostGoalInput[],
  totalDoomscrolledMinutesForPeriod: number,
  numberOfDaysInPeriod: number,
): OpportunityCostAllocationResult {
  let remaining = totalDoomscrolledMinutesForPeriod;
  const allocations: GoalAllocation[] = [];

  for (const goal of goals) {
    const periodTargetMinutes = goal.targetMinutesPerDay * numberOfDaysInPeriod;

    if (periodTargetMinutes === 0) {
      allocations.push({
        goalId: goal.id,
        periodTargetMinutes,
        allocatedMinutes: 0,
        fundedPercent: 100,
      });
      continue;
    }

    const allocatedMinutes = Math.min(remaining, periodTargetMinutes);
    const fundedPercent = (allocatedMinutes / periodTargetMinutes) * 100;
    remaining -= allocatedMinutes;

    allocations.push({
      goalId: goal.id,
      periodTargetMinutes,
      allocatedMinutes,
      fundedPercent,
    });
  }

  return { allocations, unallocatedMinutes: remaining };
}

/**
 * Display rounding, mirroring the app's `buildBillAllocationViews`: the
 * percent is rounded exactly once so the number shown and the
 * "fully funded" styling can never disagree.
 */
export function roundedPercent(allocation: GoalAllocation): number {
  return Math.round(allocation.fundedPercent);
}
