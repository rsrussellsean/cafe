// ─────────────────────────────────────────────────────────────
// Request reference IDs.
//
// IMPORTANT: these are *request references*, not authoritative booking numbers.
// The site has no database, so a true per-day sequence ("-001", "-002") is not
// possible — an in-process counter would reset on restart and collide across
// serverless instances, handing two customers the same ID. Instead the trailing
// segment is a random discriminator, and the n8n workflow owns the real
// booking reference if one is needed.
// ─────────────────────────────────────────────────────────────

import { manilaDateStamp } from "@/lib/time";

export type IdPrefix = "RES" | "GRAB" | "FP";

/** e.g. `RES-20260919-K3A7` */
export function newId(prefix: IdPrefix): string {
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 4).toUpperCase();
  return `${prefix}-${manilaDateStamp()}-${suffix}`;
}
