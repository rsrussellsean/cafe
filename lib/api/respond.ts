// ─────────────────────────────────────────────────────────────
// Turns a ServiceResult into an HTTP response. One mapping, three routes.
// ─────────────────────────────────────────────────────────────

import type { FailureCode, ServiceResult } from "@/lib/n8n/types";

const STATUS: Record<FailureCode, number> = {
  validation: 400,
  rate_limit: 429,
  timeout: 502,
  upstream: 502,
  network: 502,
  config: 503,
};

export const TOO_MANY = "Too many requests — please wait a moment and try again.";
export const BAD_FIELDS = "Please check the highlighted fields.";

export function respond(result: ServiceResult): Response {
  if (result.ok) {
    return Response.json(
      { ok: true, id: result.id, confirmed: result.confirmed, message: result.message },
      { status: 200 },
    );
  }

  return Response.json(
    { ok: false, code: result.code, message: result.message, fieldErrors: result.fieldErrors },
    { status: STATUS[result.code] },
  );
}
