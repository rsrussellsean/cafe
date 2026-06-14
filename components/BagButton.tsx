"use client";

import { useEffect, useRef, useState } from "react";
import { useBag } from "@/lib/bag-context";
import BagDropdown from "@/components/BagDropdown";

export default function BagButton({ scrolled }: { scrolled: boolean }) {
  const { count, isOpen, setOpen } = useBag();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pop, setPop] = useState(false);

  // close when clicking anywhere outside the button + dropdown, or on Escape.
  // Detection lives on the whole container so clicking the toggle button
  // itself counts as "inside" — the button's onClick handles the toggle
  // cleanly without a close-then-reopen race.
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Element;
      // Adding more from the menu shouldn't close an open bag.
      if (target?.closest?.("[data-bag-keep-open]")) return;
      if (containerRef.current && !containerRef.current.contains(target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setOpen]);

  // little pop on the badge whenever the item count changes
  useEffect(() => {
    if (count === 0) return;
    setPop(true);
    const t = window.setTimeout(() => setPop(false), 300);
    return () => window.clearTimeout(t);
  }, [count]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!isOpen)}
        aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
        aria-expanded={isOpen}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
          scrolled ? "text-foam hover:bg-foam/10" : "text-ink hover:bg-ink/5"
        }`}
      >
        <span
          className={`transition-transform duration-300 ease-out ${
            isOpen ? "scale-90" : "scale-100"
          }`}
        >
          <BagIcon />
        </span>
        {count > 0 && (
          <span
            className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 font-mono text-[10px] font-medium leading-none text-forest-deep transition-transform duration-300 ease-out ${
              pop ? "scale-125" : "scale-100"
            }`}
          >
            {count}
          </span>
        )}
      </button>

      <BagDropdown />
    </div>
  );
}

function BagIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
