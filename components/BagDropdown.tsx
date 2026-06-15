"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useBag, peso } from "@/lib/bag-context";
import { saveReceiptPng } from "@/lib/save-image";
import BagRow from "@/components/BagRow";
import BagReceipt from "@/components/BagReceipt";

export default function BagDropdown() {
  const { items, total, isOpen, setOpen, clear } = useBag();
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

  // Portal to <body>: the nav header uses `backdrop-blur`, which makes it the
  // containing block for any `position: fixed` descendant — that would trap this
  // panel inside the header bar. Rendering at the body level lets `fixed` resolve
  // against the viewport so the mobile bottom sheet and desktop card sit correctly.
  return createPortal(
    <>
      {/* mobile-only scrim behind the bottom sheet; tap to dismiss */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-[55] bg-ink/30 transition-opacity duration-300 sm:hidden ${
          show ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-label="Your bag"
        data-bag-dropdown
        className={`fixed inset-x-0 bottom-0 z-[60] flex max-h-[calc(100dvh-4rem)] flex-col rounded-t-2xl border border-ink/10 bg-foam text-ink shadow-2xl shadow-forest-deep/25 transition-all duration-300 ease-out sm:inset-x-auto sm:bottom-auto sm:right-5 sm:top-[4.75rem] sm:max-h-[calc(100dvh-6rem)] sm:w-[22rem] sm:origin-top-right sm:rounded-2xl sm:duration-200 md:right-10 ${
          show
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "pointer-events-none translate-y-full opacity-100 sm:-translate-y-1 sm:scale-95 sm:opacity-0"
        }`}
      >
        {/* grab handle (mobile bottom-sheet affordance) */}
        <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-ink/15" />
        </div>

        <div className="flex shrink-0 items-center justify-between border-b border-ink/10 px-5 py-4">
        <div className="flex items-baseline gap-2">
          <p className="font-display text-lg tracking-tight">Your Bag</p>
          {items.length > 0 && (
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45">
              {items.reduce((n, i) => n + i.qty, 0)} item
              {items.reduce((n, i) => n + i.qty, 0) === 1 ? "" : "s"}
            </span>
          )}
        </div>
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
          <ul className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5">
            {items.map((i) => (
              <BagRow key={i.name} item={i} />
            ))}
          </ul>

          <div className="shrink-0 border-t border-ink/10 px-5 py-4">
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

            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={clear}
                className="link-line font-mono text-[11px] uppercase tracking-[0.2em] text-ink/45 hover:text-caramel"
              >
                Clear all
              </button>
              <Link
                href="/bag"
                onClick={() => setOpen(false)}
                className="link-line font-mono text-[11px] uppercase tracking-[0.2em] text-forest"
              >
                View all items →
              </Link>
            </div>
          </div>
        </>
      )}

        {/* offscreen receipt used only for PNG capture */}
        <div className="pointer-events-none absolute -left-[9999px] top-0" aria-hidden>
          <BagReceipt ref={receiptRef} />
        </div>
      </div>
    </>,
    document.body,
  );
}
