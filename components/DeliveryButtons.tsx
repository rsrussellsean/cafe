"use client";

import { useState } from "react";
import Link from "next/link";
import { useBag } from "@/lib/bag-context";
import OrderDialog, { type Platform } from "@/components/OrderDialog";

type Props = {
  /** "row" side-by-side from sm upward; "stack" always full-width. */
  layout?: "row" | "stack";
  /** Which surface this sits on, so the empty-bag hint stays legible. */
  tone?: "light" | "dark";
  className?: string;
};

// GrabFood green / Foodpanda pink would clash with the cafe palette, so each
// platform gets a brand-adjacent tone drawn from the existing theme tokens.
// The fills are per-surface: the forest green that reads as "GrabFood" on the
// cream sections would vanish into the forest background of /bag.
const PLATFORM_CLASS: Record<"light" | "dark", Record<Platform, string>> = {
  light: {
    grabfood: "bg-forest text-foam hover:bg-forest-deep",
    foodpanda: "bg-pink-500 text-white hover:bg-pink-600",
  },
  dark: {
    grabfood: "bg-foam text-forest-deep hover:bg-gold",
    foodpanda: "bg-pink-500 text-white hover:bg-pink-600",
  },
};

const LABEL: Record<Platform, string> = {
  grabfood: "Order via GrabFood",
  foodpanda: "Order via Foodpanda",
};

export default function DeliveryButtons({
  layout = "row",
  tone = "light",
  className = "",
}: Props) {
  const { items } = useBag();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const empty = items.length === 0;

  if (empty) {
    return (
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
          tone === "dark" ? "text-foam/50" : "text-ink/50"
        } ${className}`}
      >
        Add something from the menu first —{" "}
        <Link
          href="/#menu"
          className={`link-line ${tone === "dark" ? "text-gold" : "text-forest"}`}
        >
          browse the menu ↗
        </Link>
      </p>
    );
  }

  return (
    <>
      <div
        className={`flex gap-3 ${
          layout === "row" ? "flex-col sm:flex-row sm:gap-4" : "flex-col"
        } ${className}`}
      >
        {(["grabfood", "foodpanda"] as Platform[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            className={`rounded-full cursor-pointer px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${PLATFORM_CLASS[tone][p]} ${
              layout === "row" ? "sm:flex-1" : "w-full"
            }`}
          >
            {LABEL[p]}
          </button>
        ))}
      </div>

      <OrderDialog platform={platform} onClose={() => setPlatform(null)} />
    </>
  );
}
