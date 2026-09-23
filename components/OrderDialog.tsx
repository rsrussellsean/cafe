"use client";

import { useState } from "react";
import Dialog from "@/components/Dialog";
import { useBag, peso } from "@/lib/bag-context";
import { triggerGrabFoodOrder, triggerFoodpandaOrder } from "@/lib/api/client";

export type Platform = "grabfood" | "foodpanda";

type Status = "idle" | "submitting" | "success" | "error";

const PLATFORM = {
  grabfood: { label: "GrabFood", send: triggerGrabFoodOrder },
  foodpanda: { label: "Foodpanda", send: triggerFoodpandaOrder },
} as const;

const field =
  "w-full border-b border-ink/20 bg-transparent pb-3 text-base text-ink outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-forest";
const label = "font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50";

/** "extra shot, less ice" → ["extra shot", "less ice"]; blanks dropped. */
function splitModifiers(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

type Props = {
  platform: Platform | null;
  onClose: () => void;
};

export default function OrderDialog({ platform, onClose }: Props) {
  const { items, total, clear } = useBag();
  const [form, setForm] = useState({ customer_name: "", phone: "", notes: "", website: "" });
  // Per-line requests, keyed by item name (bag lines are unique by name). Kept
  // out of the bag itself: modifiers only matter at checkout, and the bag is
  // persisted to localStorage.
  const [mods, setMods] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const busy = status === "submitting";
  const name = platform ? PLATFORM[platform].label : "";

  const reset = () => {
    setForm({ customer_name: "", phone: "", notes: "", website: "" });
    setMods({});
    setStatus("idle");
    setMessage("");
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    window.setTimeout(reset, 250);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform || status === "submitting" || status === "success") return;

    setStatus("submitting");
    setMessage("Connecting…");
    setErrors({});

    const result = await PLATFORM[platform].send({
      ...form,
      items: items.map((i) => ({
        name: i.name,
        qty: i.qty,
        modifiers: splitModifiers(mods[i.name]),
      })),
    });

    if (result.ok) {
      setStatus("success");
      setMessage(result.message);
      return;
    }
    setStatus("error");
    setMessage(result.message);
    setErrors(result.fieldErrors ?? {});
  };

  return (
    <Dialog open={platform !== null} onClose={handleClose} title={`Order via ${name}`}>
      {status === "success" ? (
        <div className="py-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-caramel">
            ✺ Sent
          </p>
          <p className="mt-3 font-display text-2xl leading-tight tracking-tight">
            {message}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            Our team will pick this up and confirm with you shortly.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-forest px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors duration-300 hover:bg-gold hover:text-forest-deep"
            >
              Done
            </button>
            <button
              type="button"
              onClick={() => {
                clear();
                handleClose();
              }}
              className="link-line font-mono text-xs uppercase tracking-[0.2em] text-ink/50 hover:text-caramel"
            >
              Clear my bag
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          {/* Show exactly what is about to be sent. */}
          <ul className="border-b border-ink/10 pb-4">
            {items.map((i) => (
              <li
                key={i.name}
                className="py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/70"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span>
                    {i.qty} × {i.name}
                  </span>
                  <span className="tabular-nums">₱ {peso(Number(i.price) * i.qty)}</span>
                </div>
                <input
                  type="text"
                  aria-label={`Special requests for ${i.name}`}
                  value={mods[i.name] ?? ""}
                  onChange={(e) => setMods({ ...mods, [i.name]: e.target.value })}
                  className="mt-1 w-full border-b border-ink/10 bg-transparent pb-1 font-mono text-[11px] normal-case tracking-normal text-ink/70 outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-forest"
                  placeholder="extra shot, less ice — optional"
                />
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between pt-3 font-mono text-sm">
            <span className="uppercase tracking-[0.2em] text-ink/60">Total</span>
            <span className="tabular-nums">₱ {peso(total)}</span>
          </div>

          <div className="mt-8">
            <label className={label} htmlFor="order-name">
              01 — Name for the order
            </label>
            <input
              id="order-name"
              type="text"
              required
              autoComplete="name"
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              className={`mt-3 ${field}`}
              placeholder="Your name"
            />
            {errors.customer_name?.[0] && (
              <p className="mt-2 font-mono text-[11px] text-caramel">
                {errors.customer_name[0]}
              </p>
            )}
          </div>

          <div className="mt-8">
            <label className={label} htmlFor="order-phone">
              02 — Phone{" "}
              <span className="normal-case tracking-normal">
                (optional — so we can call you back)
              </span>
            </label>
            <input
              id="order-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`mt-3 ${field}`}
              placeholder="0917 123 4567"
            />
          </div>

          <div className="mt-8">
            <label className={label} htmlFor="order-notes">
              03 — Notes <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              id="order-notes"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`mt-3 resize-none ${field}`}
              placeholder="Delivery address, landmarks, preferences…"
            />
          </div>

          <div className="hidden" aria-hidden>
            <label htmlFor="order-website">Website</label>
            <input
              id="order-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>

          {/* Say plainly what this button does, so nobody thinks they have just
              placed and paid for an order inside the GrabFood/Foodpanda app. */}
          <p className="mt-8 border-t border-ink/10 pt-4 font-mono text-[11px] leading-relaxed text-ink/55">
            {`This sends your bag to the cafe\u2019s ${name} ordering automation so our team can pick it up. It does not place an order inside the ${name} app and nothing is charged now \u2014 we\u2019ll follow up to confirm.`}
          </p>

          <button
            type="submit"
            disabled={busy || items.length === 0}
            aria-busy={busy}
            className="mt-7 w-full rounded-full bg-forest px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors duration-300 hover:bg-gold hover:text-forest-deep disabled:opacity-60 disabled:hover:bg-forest disabled:hover:text-foam"
          >
            {busy ? "Connecting…" : `Send to ${name}`}
          </button>

          <p
            role="status"
            aria-live="polite"
            className={`mt-4 min-h-5 font-mono text-[11px] uppercase tracking-[0.2em] ${
              status === "error" ? "text-caramel" : "text-ink/50"
            }`}
          >
            {message}
          </p>
        </form>
      )}
    </Dialog>
  );
}
