"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useBag, peso, type BagItem } from "@/lib/bag-context";

const SWIPE_REVEAL = 72; // px the row shifts to expose the delete affordance
const SWIPE_DELETE = 140; // px past which a release deletes the row

export default function BagRow({ item }: { item: BagItem }) {
  const { increment, decrement, remove } = useBag();
  const [dx, setDx] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setSwiping(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - startX.current;
    // only allow swiping left
    setDx(Math.min(0, delta));
  };
  const onTouchEnd = () => {
    setSwiping(false);
    if (-dx >= SWIPE_DELETE) {
      remove(item.name);
      return;
    }
    setDx(-dx >= SWIPE_REVEAL ? -SWIPE_REVEAL : 0);
  };

  return (
    <li className="relative overflow-hidden border-b border-ink/10 last:border-b-0">
      {/* delete affordance revealed underneath when swiping (mobile) */}
      <button
        type="button"
        onClick={() => remove(item.name)}
        aria-label={`Remove ${item.name}`}
        className="absolute inset-y-0 right-0 flex w-[72px] items-center justify-center bg-caramel text-foam md:hidden"
      >
        <TrashIcon />
      </button>

      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ transform: `translateX(${dx}px)` }}
        className={`flex items-center gap-3 bg-foam py-3 ${
          swiping ? "" : "transition-transform duration-300 ease-out"
        }`}
      >
        <div className="product-shadow relative h-14 w-12 shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="3rem"
            className="object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm leading-tight text-ink">
            {item.name}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-ink/50">
            ₱ {peso(Number(item.price) * item.qty)}
          </p>
        </div>

        {/* quantity stepper */}
        <div className="flex items-center gap-2 font-mono">
          <button
            type="button"
            onClick={() => decrement(item.name)}
            aria-label={`Decrease ${item.name}`}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-colors hover:border-forest hover:text-forest"
          >
            −
          </button>
          <span className="w-4 text-center text-xs tabular-nums text-ink">
            {item.qty}
          </span>
          <button
            type="button"
            onClick={() => increment(item.name)}
            aria-label={`Increase ${item.name}`}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-colors hover:border-forest hover:text-forest"
          >
            +
          </button>
        </div>

        {/* trash (hover/desktop) */}
        <button
          type="button"
          onClick={() => remove(item.name)}
          aria-label={`Remove ${item.name}`}
          className="hidden text-ink/40 transition-colors hover:text-caramel md:block"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
