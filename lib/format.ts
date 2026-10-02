/** Minutes → "H:MM", matching the app's `formatMinutesAsClock`. */
export function formatMinutesAsClock(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

/** Goal target label, matching the app's GoalRow: "1 h", "2 h", "45 m", "90 m". */
export function formatTarget(minutes: number): string {
  if (minutes >= 60 && minutes % 60 === 0) {
    return `${minutes / 60} h`;
  }
  return `${minutes} m`;
}

/** Minute-of-day → "HH:MM" (1440 → "24:00"), matching formatProtectedWindowLabel. */
export function formatMinuteOfDay(minuteOfDay: number): string {
  const h = Math.floor(minuteOfDay / 60);
  const m = minuteOfDay % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatWindow(start: number, end: number): string {
  return `${formatMinuteOfDay(start)}–${formatMinuteOfDay(end)}`;
}

/** Long-form duration for prose: 97 → "1 h 37 min", 45 → "45 min". */
export function formatDurationWords(totalMinutes: number): string {
  const rounded = Math.round(totalMinutes);
  const h = Math.floor(rounded / 60);
  const m = rounded % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

/** Today's "vs your average" badge — same rounding/sign rules as the app. */
export function buildVsAverageLabel(todayMinutes: number, previousAverageMinutes: number): string {
  const diff = Math.round(todayMinutes - previousAverageMinutes);
  if (diff === 0) return "0 MIN VS YOUR AVERAGE";
  return `${diff > 0 ? "+" : "-"}${Math.abs(diff)} MIN VS YOUR AVERAGE`;
}
