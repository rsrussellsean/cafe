// ─────────────────────────────────────────────────────────────
// Asia/Manila time helpers.
//
// Client-safe on purpose: the reservation form needs `manilaToday()` for the
// date input's `min`, and the n8n payload builders need `manilaNowIso()` on the
// server. Deployments (Vercel, Render) run in UTC, so using the host clock
// directly would stamp a 20:00 Manila reservation with the previous day.
//
// PH has no DST, so the +08:00 offset is a constant and can be appended as a
// literal rather than derived.
// ─────────────────────────────────────────────────────────────

const MANILA = "Asia/Manila";
const OFFSET = "+08:00";

function parts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: MANILA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const out: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) {
    if (p.type !== "literal") out[p.type] = p.value;
  }
  // en-CA renders midnight as "24" in some runtimes; normalise it.
  if (out.hour === "24") out.hour = "00";
  return out;
}

/** Today in Manila as `YYYY-MM-DD`. */
export function manilaToday(now: Date = new Date()): string {
  const p = parts(now);
  return `${p.year}-${p.month}-${p.day}`;
}

/** Current Manila time as a full ISO-8601 string, e.g. `2026-09-19T21:00:00+08:00`. */
export function manilaNowIso(now: Date = new Date()): string {
  const p = parts(now);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${OFFSET}`;
}

/** Compact Manila date for ID prefixes, e.g. `20260919`. */
export function manilaDateStamp(now: Date = new Date()): string {
  return manilaToday(now).replace(/-/g, "");
}

/** True when `date` (YYYY-MM-DD) is at most `days` ahead of today in Manila. */
export function withinDays(date: string, days: number, now: Date = new Date()): boolean {
  const limit = new Date(`${manilaToday(now)}T00:00:00${OFFSET}`);
  limit.setUTCDate(limit.getUTCDate() + days);
  return new Date(`${date}T00:00:00${OFFSET}`) <= limit;
}
