// ─────────────────────────────────────────────────────────────
// Contract types for the n8n integrations.
//
// The outbound payload shapes are dictated by the n8n workflows. Their key
// names and casing are part of the contract and must not drift. Both order
// webhooks take the same snake_case body; only `source` tells them apart.
// ─────────────────────────────────────────────────────────────

export type WebhookKind = "reservation" | "grabfood" | "foodpanda";

/** Exact JSON posted to the `reserve-table` webhook. */
export type ReservationPayload = {
  reservation_id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  party_size: number;
  notes: string;
};

/** The `source` field, which is also the webhook the order is posted to. */
export type OrderSource = Extract<WebhookKind, "grabfood" | "foodpanda">;

/** Exact JSON posted to the `order-grabfood` and `order-foodpanda` webhooks. */
export type OrderPayload = {
  order_id: string;
  source: OrderSource;
  customer_name: string;
  phone: string;
  items: { name: string; qty: number; modifiers: string[] }[];
  total: number;
  order_type: "delivery";
  notes: string;
  timestamp: string;
};

export type FailureCode =
  | "validation"
  | "rate_limit"
  | "timeout"
  | "upstream"
  | "network"
  | "config";

/**
 * What every service function returns. Failures carry an opaque code plus
 * customer-safe copy — raw upstream status codes, bodies and webhook URLs
 * never travel in here.
 */
export type ServiceResult =
  | { ok: true; id: string; confirmed: boolean; message: string }
  | {
      ok: false;
      code: FailureCode;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
