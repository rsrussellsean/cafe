// ─────────────────────────────────────────────────────────────
// Best-effort per-IP throttling for the public n8n-backed routes.
//
// Scope note: this is an in-process counter. It resets on restart and is
// per-instance, so it is not a security boundary — its job is to stop casual
// abuse from burning through the n8n execution quota. A shared store (KV) would
// be needed for a real guarantee.
// ─────────────────────────────────────────────────────────────

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function prune(now: number) {
  if (buckets.size < 1000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/** Returns true when the request is within its budget. */
export function allow(req: Request, scope: string): boolean {
  const now = Date.now();
  prune(now);

  const key = `${scope}:${clientIp(req)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  bucket.count += 1;
  return bucket.count <= MAX_REQUESTS;
}
