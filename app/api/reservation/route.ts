// POST /api/reservation → n8n `reserve-table`
//
// The browser never sees the webhook URL; it posts here, this route validates,
// and lib/n8n/reservation.ts builds and sends the payload.

import { allow } from "@/lib/api/rate-limit";
import { BAD_FIELDS, TOO_MANY, respond } from "@/lib/api/respond";
import { submitReservation } from "@/lib/n8n/reservation";
import { reservationInputSchema } from "@/lib/n8n/schemas";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!allow(req, "reservation")) {
    return respond({ ok: false, code: "rate_limit", message: TOO_MANY });
  }

  const body = await req.json().catch(() => null);
  const parsed = reservationInputSchema.safeParse(body);

  if (!parsed.success) {
    return respond({
      ok: false,
      code: "validation",
      message: BAD_FIELDS,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    });
  }

  // Honeypot filled in → a bot. Answer like a success so it learns nothing,
  // but send nothing onward.
  if (parsed.data.website) {
    return respond({
      ok: true,
      id: "RES-IGNORED",
      confirmed: false,
      message: "Reservation request submitted successfully.",
    });
  }

  return respond(await submitReservation(parsed.data));
}
