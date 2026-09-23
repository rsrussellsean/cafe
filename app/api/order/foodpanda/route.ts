// POST /api/order/foodpanda → n8n `order-foodpanda`
//
// Takes bag line items, prices them server-side, and hands them to the
// Foodpanda automation. The client-sent total, if any, is ignored.

import { allow } from "@/lib/api/rate-limit";
import { BAD_FIELDS, TOO_MANY, respond } from "@/lib/api/respond";
import { submitFoodpandaOrder } from "@/lib/n8n/foodpanda";
import { orderInputSchema } from "@/lib/n8n/schemas";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!allow(req, "order")) {
    return respond({ ok: false, code: "rate_limit", message: TOO_MANY });
  }

  const body = await req.json().catch(() => null);
  const parsed = orderInputSchema.safeParse(body);

  if (!parsed.success) {
    return respond({
      ok: false,
      code: "validation",
      message: BAD_FIELDS,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    });
  }

  if (parsed.data.website) {
    return respond({
      ok: true,
      id: "ORDER-IGNORED",
      confirmed: false,
      message: "Order request sent successfully.",
    });
  }

  return respond(await submitFoodpandaOrder(parsed.data));
}
