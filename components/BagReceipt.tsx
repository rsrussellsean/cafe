"use client";

import { forwardRef } from "react";
import { useBag, peso } from "@/lib/bag-context";
import { business } from "@/lib/data";

// Presentational receipt reused by the dropdown's save action and the /bag page.
// Captured to PNG by lib/save-image.ts, so it must render real DOM (no display:none).
const BagReceipt = forwardRef<HTMLDivElement>(function BagReceipt(_props, ref) {
  const { items, total } = useBag();

  const now = new Date();
  const date = now.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      ref={ref}
      className="receipt relative mx-auto w-full max-w-sm bg-foam px-7 pb-10 pt-8 font-mono text-ink shadow-xl shadow-ink/10"
    >
      <p className="text-center text-xs font-medium tracking-[0.2em]">
        KAT &amp; PERRY&rsquo;S KITCHENETTE
      </p>
      <p className="mt-1 text-center text-[10px] tracking-[0.15em] text-ink/50">
        TISA · CEBU CITY ✺ CASUNTINGAN · MANDAUE
      </p>

      <div className="mt-4 flex justify-between text-[10px] tracking-[0.15em] text-ink/50">
        <span>ORDER</span>
        <span>
          {date} · {time}
        </span>
      </div>

      <div className="my-5 border-t border-dashed border-ink/30" />

      {items.length === 0 ? (
        <p className="py-6 text-center text-[11px] tracking-[0.15em] text-ink/50">
          NO ITEMS YET
        </p>
      ) : (
        <ul className="space-y-4 text-[11px] tracking-[0.08em]">
          {items.map((i) => (
            <li key={i.name} className="flex justify-between gap-3">
              <span className="flex-1 uppercase leading-relaxed">
                <span className="text-ink/50">{i.qty}×</span> {i.name}
              </span>
              <span className="shrink-0 tabular-nums">
                ₱ {peso(Number(i.price) * i.qty)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="my-5 border-t border-dashed border-ink/30" />

      <div className="flex justify-between text-xs font-medium tracking-[0.1em]">
        <span>TOTAL</span>
        <span className="tabular-nums">₱ {peso(total)}</span>
      </div>

      <p className="mt-2 text-[9px] tracking-[0.1em] text-ink/40">
        Screenshot &amp; send to {business.email} to place your order.
      </p>

      <div className="my-6 border-t border-dashed border-ink/30" />

      <div
        className="mx-auto h-10 w-44"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #251a13 0 2px, transparent 2px 4px, #251a13 4px 7px, transparent 7px 9px)",
        }}
        aria-hidden
      />
      <p className="mt-4 text-center text-[10px] tracking-[0.3em] text-ink/60">
        THANK YOU ✺ COME AGAIN
      </p>
    </div>
  );
});

export default BagReceipt;
