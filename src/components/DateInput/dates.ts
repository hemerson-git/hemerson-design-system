/** Calendar dates as "yyyy-mm-dd" strings, the value format of <input type="date">, in local time. */

export function toIso(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromIso(value: string | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return toIso(date) === value ? date : null;
}

/** "10/10/2026" from "2026-10-10". */
export function formatTyped(value: string) {
  const date = fromIso(value);
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** "2026-10-10" from what was typed as day/month/year ("10/10/2026", "1/2/2026" or "10102026"), or null. */
export function parseTyped(text: string): string | null {
  const trimmed = text.trim();
  const parts = /^\d{8}$/.test(trimmed)
    ? [trimmed.slice(0, 2), trimmed.slice(2, 4), trimmed.slice(4)]
    : /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(trimmed)?.slice(1);
  if (!parts) return null;
  const [day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? toIso(date) : null;
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** The same day in another month, or that month's last day when it is shorter. */
export function addMonths(date: Date, months: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

/** Six weeks of days covering the month of `date`, each week starting on `weekStartsOn` (0 = Sunday). */
export function monthGrid(date: Date, weekStartsOn: number) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = addDays(first, -((first.getDay() - weekStartsOn + 7) % 7));
  return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(start, week * 7 + day)));
}

export function isWithin(value: string, min?: string, max?: string) {
  return (!min || value >= min) && (!max || value <= max);
}
