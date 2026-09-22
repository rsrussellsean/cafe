// ─────────────────────────────────────────────────────────────
// The one place in the app that talks to n8n.
//
// Everything above this module deals in typed inputs and opaque failure codes;
// everything below is HTTP. Upstream status codes and response bodies are
// logged server-side and never returned to the caller.
// ─────────────────────────────────────────────────────────────

import { webhookTimeoutMs, webhookUrl } from "@/lib/n8n/env";
import type { WebhookKind } from "@/lib/n8n/types";

type PostSuccess = { ok: true; data: unknown };
type PostFailure = { ok: false; code: "timeout" | "upstream" | "network" | "config" };
export type PostResult = PostSuccess | PostFailure;

export async function postToN8n(kind: WebhookKind, payload: unknown): Promise<PostResult> {
  const url = webhookUrl(kind);
  if (!url) return { ok: false, code: "config" };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(webhookTimeoutMs()),
    });
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      console.error(`[n8n] ${kind} webhook timed out after ${webhookTimeoutMs()}ms`);
      return { ok: false, code: "timeout" };
    }
    console.error(`[n8n] ${kind} webhook unreachable:`, err);
    return { ok: false, code: "network" };
  }

  // n8n often answers with an empty body or a bare string such as
  // {"message":"Workflow was started"}, so parsing is best-effort.
  const text = await res.text().catch(() => "");
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* keep the raw text */
  }

  if (!res.ok) {
    console.error(`[n8n] ${kind} webhook returned ${res.status}:`, text.slice(0, 500));
    return { ok: false, code: "upstream" };
  }

  return { ok: true, data };
}

/**
 * n8n only tells us a workflow *started* unless the workflow itself responds
 * with a confirmation. We treat a reservation as confirmed only on an explicit
 * signal — never merely because the POST succeeded.
 */
export function readConfirmed(data: unknown): boolean {
  if (typeof data !== "object" || data === null) return false;
  const body = data as Record<string, unknown>;
  return body.confirmed === true || body.status === "confirmed";
}
