"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BagReceipt from "@/components/BagReceipt";
import BagRow from "@/components/BagRow";
import { useBag, peso } from "@/lib/bag-context";
import { saveReceiptPng } from "@/lib/save-image";

export default function BagPage() {
  const { items, total, clear } = useBag();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!receiptRef.current || items.length === 0) return;
    setSaving(true);
    try {
      await saveReceiptPng(receiptRef.current);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="grain min-h-screen bg-forest text-foam">
      <Nav />

      <section className="px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/#menu"
            className="link-line font-mono text-xs uppercase tracking-[0.2em] text-gold"
          >
            ← Back to menu
          </Link>

          <h1 className="mt-6 font-display text-4xl leading-tight tracking-tight md:text-6xl">
            Your <em className="font-light text-gold">order</em>
          </h1>
          <p className="mt-3 max-w-md font-mono text-xs uppercase tracking-[0.2em] text-foam/50">
            {items.length === 0
              ? "Nothing here yet"
              : `${items.length} item${items.length === 1 ? "" : "s"} · ₱ ${peso(total)}`}
          </p>

          {items.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-foam/15 px-8 py-16 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-foam/60">
                Your bag is empty.
              </p>
              <Link
                href="/#menu"
                className="mt-6 inline-block rounded-full bg-gold px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-forest-deep transition-colors hover:bg-foam"
              >
                Browse the menu
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid items-start gap-12 md:grid-cols-[1.1fr_0.9fr]">
              {/* editable item list */}
              <div className="rounded-2xl bg-foam px-5 py-2 text-ink">
                <ul>
                  {items.map((i) => (
                    <BagRow key={i.name} item={i} />
                  ))}
                </ul>
              </div>

              {/* receipt + actions */}
              <div>
                <BagReceipt ref={receiptRef} />

                <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full rounded-full bg-gold px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-forest-deep transition-colors hover:bg-foam disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save as image"}
                  </button>
                  <button
                    type="button"
                    onClick={clear}
                    className="w-full rounded-full border border-foam/25 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foam/70 transition-colors hover:border-caramel hover:text-foam"
                  >
                    Clear bag
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
