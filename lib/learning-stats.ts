export type XpEvent = { key: string; day: string; points: number };

export function localDayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function readXpEvents(): XpEvent[] {
  try {
    const stored = localStorage.getItem("m2clar:xp-events");
    return stored ? JSON.parse(stored) as XpEvent[] : [];
  } catch {
    return [];
  }
}

export function awardXp(key: string, points: number): boolean {
  const events = readXpEvents();
  if (events.some((event) => event.key === key)) return false;
  events.push({ key, day: localDayKey(), points });
  try { localStorage.setItem("m2clar:xp-events", JSON.stringify(events)); } catch { return false; }
  return true;
}

export function markStudyDay(): string[] {
  const today = localDayKey();
  let days: string[] = [];
  try {
    days = JSON.parse(localStorage.getItem("m2clar:study-days") || "[]") as string[];
    if (!days.includes(today)) days.push(today);
    localStorage.setItem("m2clar:study-days", JSON.stringify(days));
  } catch { /* local storage can be disabled */ }
  return days;
}

export function currentStreak(days: string[], today = localDayKey()): number {
  const set = new Set(days);
  const cursor = new Date(`${today}T12:00:00`);
  if (!set.has(today)) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (set.has(localDayKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function pointsForActivity(stage: number, hintLevel: number, usedSolution: boolean): number {
  if (usedSolution) return 0;
  const base = stage === 5 ? 10 : stage === 7 ? 12 : stage === 4 ? 8 : 6;
  return Math.max(2, base - hintLevel * 2);
}
