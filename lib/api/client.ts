// ─────────────────────────────────────────────────────────────
// The only networking module UI components import.
//
// Components call these functions; they never see a webhook URL, never build a
// payload, and never branch on HTTP status codes. Everything comes back as a
// uniform, already-friendly result.
// ─────────────────────────────────────────────────────────────

import type { ReservationInput, OrderInput } from "@/lib/n8n/schemas";

const CLIENT_TIMEOUT_MS = 15_000;

export type ApiResult = {
  ok: boolean;
  id?: string;
  confirmed: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const RESERVATION_FAILED = "We couldn't submit your reservation. Please try again.";
const ORDER_FAILED = "We couldn't send your order request. Please try again.";

async function post(path: string, body: unknown, fallback: string): Promise<ApiResult> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    });

    const data = (await res.json().catch(() => null)) as Partial<ApiResult> | null;

    if (!data || typeof data.message !== "string") {
      // Unexpected response shape (proxy error page, truncated body, …).
      return { ok: false, confirmed: false, message: fallback };
    }

    return {
      ok: res.ok && data.ok === true,
      id: data.id,
      confirmed: data.confirmed === true,
      message: data.message,
      fieldErrors: data.fieldErrors,
    };
  } catch {
    // Offline, DNS failure, or the 15s client timeout.
    return { ok: false, confirmed: false, message: fallback };
  }
}

export function submitReservation(input: ReservationInput): Promise<ApiResult> {
  return post("/api/reservation", input, RESERVATION_FAILED);
}

export function triggerGrabFoodOrder(input: OrderInput): Promise<ApiResult> {
  return post("/api/order/grabfood", input, ORDER_FAILED);
}

export function triggerFoodpandaOrder(input: OrderInput): Promise<ApiResult> {
  return post("/api/order/foodpanda", input, ORDER_FAILED);
}
