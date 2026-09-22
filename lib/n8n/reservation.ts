// ─────────────────────────────────────────────────────────────
// Reserve a Table → n8n `reserve-table` webhook.
// ─────────────────────────────────────────────────────────────

import { postToN8n, readConfirmed } from "@/lib/n8n/client";
import { newId } from "@/lib/n8n/ids";
import { reservationPayloadSchema, type ReservationInput } from "@/lib/n8n/schemas";
import type { ReservationPayload, ServiceResult } from "@/lib/n8n/types";

const FAILED = "We couldn't submit your reservation. Please try again.";
const UNAVAILABLE = "Reservations are temporarily unavailable. Please call us instead.";
const SUBMITTED = "Reservation request submitted successfully.";
const CONFIRMED = "Your reservation is confirmed.";

export async function submitReservation(input: ReservationInput): Promise<ServiceResult> {
  const reservationId = newId("RES");

  // The customer never picks a table; the workflow assigns one on its side.
  const payload: ReservationPayload = {
    reservation_id: reservationId,
    name: input.name,
    phone: input.phone,
    email: input.email,
    date: input.date,
    time: input.time,
    party_size: input.party_size,
    notes: input.notes ?? "",
  };

  const result = await postToN8n("reservation", reservationPayloadSchema.parse(payload));

  if (!result.ok) {
    return {
      ok: false,
      code: result.code,
      message: result.code === "config" ? UNAVAILABLE : FAILED,
    };
  }

  const confirmed = readConfirmed(result.data);
  return {
    ok: true,
    id: reservationId,
    confirmed,
    message: confirmed ? CONFIRMED : SUBMITTED,
  };
}
