// ─────────────────────────────────────────────────────────────
// Server-side price resolution for delivery orders.
//
// The client never gets to state the total. It sends item names and quantities;
// the price comes from lib/data.ts here, and unknown item names are rejected.
// Otherwise a tampered request could post a ₱1 order.
// ─────────────────────────────────────────────────────────────

import { drinks } from "@/lib/data";

const PRICES = new Map(drinks.map((d) => [d.name, Number(d.price)]));

export type PricedLine = { name: string; qty: number; lineTotal: number };

export type PricingResult =
  | { ok: true; lines: PricedLine[]; total: number }
  | { ok: false; unknown: string[] };

export function priceOrder(items: { name: string; qty: number }[]): PricingResult {
  const unknown = items.map((i) => i.name).filter((name) => !PRICES.has(name));
  if (unknown.length > 0) return { ok: false, unknown };

  const lines = items.map((i) => ({
    name: i.name,
    qty: i.qty,
    lineTotal: round2(PRICES.get(i.name)! * i.qty),
  }));

  return { ok: true, lines, total: round2(lines.reduce((s, l) => s + l.lineTotal, 0)) };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
