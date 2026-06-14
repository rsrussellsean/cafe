"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useBag, peso } from "@/lib/bag-context";
import { saveReceiptPng } from "@/lib/save-image";
import BagRow from "@/components/BagRow";
import BagReceipt from "@/components/BagReceipt";

export default function BagDropdown() {
  const { items, total, isOpen, setOpen } = useBag();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  // Keep the panel mounted through its exit animation: `render` controls
  // mounting, `show` toggles the visible/hidden transition classes.
  const [render, setRender] = useState(isOpen);
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    }
    setShow(false);
    const t = window.setTimeout(() => setRender(false), 220);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  const handleSave = async () => {
    if (!receiptRef.current || items.length === 0) return;
    setSaving(true);
    try {
      await saveReceiptPng(receiptRef.current);
    } finally {
      setSaving(false);
    }
  };

  if (!render) return null;

  return (
    <div
      role="dialog"
      aria-label="Your bag"
      data-bag-dropdown
      className={`absolute right-0 top-full mt-3 w-[min(22rem,calc(100vw-2rem))] origin-top-right rounded-2xl border border-ink/10 bg-foam text-ink shadow-2xl shadow-forest-deep/25 transition-all duration-200 ease-out ${
        show
          ? "scale-100 opacity-100 translate-y-0"
          : "pointer-events-none -translate-y-1 scale-95 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
        <p className="font-display text-lg tracking-tight">Your Bag</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close bag"
          className="font-mono text-lg leading-none text-ink/50 hover:text-ink"
        >
          ×
        </button>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
            Your bag is empty
          </p>
          <Link
            href="/#menu"
            onClick={() => setOpen(false)}
            className="link-line mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-forest"
          >
            Browse the menu ↗
          </Link>
        </div>
      ) : (
        <>
          <ul className="no-scrollbar max-h-72 overflow-y-auto px-5">
            {items.map((i) => (
              <BagRow key={i.name} item={i} />
            ))}
          </ul>

          <div className="border-t border-ink/10 px-5 py-4">
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="uppercase tracking-[0.2em] text-ink/60">
                Total
              </span>
              <span className="tabular-nums">₱ {peso(total)}</span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="mt-4 w-full rounded-full bg-forest px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors hover:bg-forest-deep disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save as image"}
            </button>

            <Link
              href="/bag"
              onClick={() => setOpen(false)}
              className="link-line mt-3 block text-center font-mono text-xs uppercase tracking-[0.2em] text-forest"
            >
              View all items →
            </Link>
          </div>
        </>
      )}

      {/* offscreen receipt used only for PNG capture */}
      <div className="pointer-events-none absolute -left-[9999px] top-0" aria-hidden>
        <BagReceipt ref={receiptRef} />
      </div>
    </div>
  );
}
