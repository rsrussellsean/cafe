// Order via Foodpanda. The whole body lives in lib/n8n/order.ts — both delivery
// platforms share one payload shape.

import { submitOrder } from "@/lib/n8n/order";
import type { OrderInput } from "@/lib/n8n/schemas";
import type { ServiceResult } from "@/lib/n8n/types";

export function submitFoodpandaOrder(input: OrderInput): Promise<ServiceResult> {
  return submitOrder("foodpanda", input);
}
