// ─────────────────────────────────────────────────────────────
// Webhook configuration. Server-side only — nothing under components/ or any
// "use client" module may import this.
//
// Fails closed: there is deliberately no hard-coded production URL fallback, so
// a missing env var surfaces as a `config` failure rather than silently posting
// to a baked-in endpoint.
// ─────────────────────────────────────────────────────────────

import type { WebhookKind } from "@/lib/n8n/types";

const ENV_VAR: Record<WebhookKind, string> = {
  reservation: "N8N_RESERVATION_WEBHOOK_URL",
  grabfood: "N8N_GRABFOOD_WEBHOOK_URL",
  foodpanda: "N8N_FOODPANDA_WEBHOOK_URL",
};

const DEFAULT_TIMEOUT_MS = 10_000;

/** The configured webhook URL, or `null` when the env var is unset/blank. */
export function webhookUrl(kind: WebhookKind): string | null {
  const name = ENV_VAR[kind];
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`[n8n] ${name} is not set — refusing to send ${kind} payload.`);
    return null;
  }
  return value;
}

/**
 * Outbound timeout. Generous by default: the n8n instance runs on Render's free
 * tier and cold-starts, so a tight timeout would fail perfectly good requests.
 */
export function webhookTimeoutMs(): number {
  const raw = Number(process.env.N8N_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TIMEOUT_MS;
}
