// ─────────────────────────────────────────────────────────────
// Online orders → the n8n `order-grabfood` / `order-foodpanda` webhooks.
//
// Both workflows take the same body; `source` is the only difference, so one
// builder serves both. Prices are never taken from the client — priceOrder()
// looks every line up in the menu and computes the total server-side.
// ─────────────────────────────────────────────────────────────

import { postToN8n } from "@/lib/n8n/client";
import { newId, type IdPrefix } from "@/lib/n8n/ids";
import { priceOrder } from "@/lib/n8n/pricing";
import { orderPayloadSchema, type OrderInput } from "@/lib/n8n/schemas";
import { manilaNowIso } from "@/lib/time";
import type { OrderPayload, OrderSource, ServiceResult } from "@/lib/n8n/types";

const FAILED = "We couldn't send your order request. Please try again.";
const UNAVAILABLE = "Online ordering is temporarily unavailable.";
const SENT = "Order request sent successfully.";

const ID_PREFIX: Record<OrderSource, IdPrefix> = {
  grabfood: "GRAB",
  foodpanda: "FP",
};

export async function submitOrder(
  source: OrderSource,
  input: OrderInput,
): Promise<ServiceResult> {
  const priced = priceOrder(input.items);
  if (!priced.ok) {
    return {
      ok: false,
      code: "validation",
      message: "Some items are no longer on the menu. Please refresh and try again.",
      fieldErrors: { items: priced.unknown.map((n) => `"${n}" is not on the menu`) },
    };
  }

  const orderId = newId(ID_PREFIX[source]);

  const payload: OrderPayload = {
    order_id: orderId,
    source,
    customer_name: input.customer_name,
    phone: input.phone ?? "",
    items: input.items.map((i) => ({
      name: i.name,
      qty: i.qty,
      modifiers: i.modifiers ?? [],
    })),
    total: priced.total,
    order_type: "delivery",
    notes: input.notes ?? "",
    timestamp: manilaNowIso(),
  };

  const result = await postToN8n(source, orderPayloadSchema.parse(payload));

  if (!result.ok) {
    return {
      ok: false,
      code: result.code,
      message: result.code === "config" ? UNAVAILABLE : FAILED,
    };
  }

  return { ok: true, id: orderId, confirmed: false, message: SENT };
}
