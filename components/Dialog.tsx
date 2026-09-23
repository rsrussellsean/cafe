"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const EXIT_MS = 220;
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  /**
   * `lg` widens the panel and lets it use nearly the full viewport height —
   * needed by the reservation form, whose date/time popovers are laid out
   * inside the scroll area and get clipped in a narrow panel.
   */
  size?: "md" | "lg";
  children: React.ReactNode;
};

const SIZES = {
  md: "sm:w-[min(36rem,calc(100vw-2rem))] sm:h-[min(42rem,calc(100dvh-3rem))]",
  lg: "sm:w-[min(64rem,calc(100vw-2rem))] sm:h-[min(48rem,calc(100dvh-2rem))]",
} as const;

/**
 * Shared modal shell for the reservation and delivery-order dialogs.
 *
 * The portal is not optional: the nav header uses `backdrop-blur`, which makes
 * it the containing block for any `position: fixed` descendant and would trap a
 * dialog inside the header bar. Rendering at the body level lets `fixed`
 * resolve against the viewport — same reasoning as BagDropdown.
 */
export default function Dialog({
  open,
  onClose,
  title,
  size = "md",
  children,
}: Props) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  // Mounting is DERIVED, never stored: the panel is in the DOM whenever it is
  // open or still animating out. An earlier version kept `render` in its own
  // state and cleared it on a timer, which let a stale exit timer unmount the
  // panel moments after it had been reopened.
  const [closing, setClosing] = useState(false);
  const [show, setShow] = useState(open);
  const [prevOpen, setPrevOpen] = useState(open);
  const render = open || closing;

  // Adjust state during render when `open` flips, rather than in an effect:
  // mounting must happen before paint, and a synchronous setState inside an
  // effect body would cascade an extra render.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setShow(false); // enter from the hidden transition state
      setClosing(false);
    } else {
      setShow(false);
      setClosing(true);
    }
  }

  useEffect(() => {
    if (open) {
      restoreTo.current = document.activeElement as HTMLElement | null;
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    }
    const t = window.setTimeout(() => setClosing(false), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  // Escape to close + a minimal tab trap, and lock body scroll while open.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) return;

      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  // Focus the first field on open; hand focus back to the trigger on close.
  useEffect(() => {
    if (!render) return;
    if (show) {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    } else {
      restoreTo.current?.focus?.();
    }
  }, [render, show]);

  if (!render) return null;

  return createPortal(
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-[65] bg-ink/40 transition-opacity duration-300 motion-reduce:transition-none ${
          show ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-app-dialog
        className={`fixed overflow-y-auto inset-x-0 bottom-0 z-[70] flex max-h-[calc(100dvh-1rem)] flex-col overflow-visible rounded-t-2xl border border-ink/10 bg-foam text-ink shadow-2xl shadow-forest-deep/25 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none sm:inset-x-0 sm:bottom-auto sm:top-1/2 sm:mx-auto sm:-translate-y-1/2 sm:rounded-2xl sm:duration-200 ${SIZES[size]} ${
          show
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "pointer-events-none translate-y-full opacity-100 sm:translate-y-[-48%] sm:scale-95 sm:opacity-0"
        }`}
      >
        {/* grab handle (mobile bottom-sheet affordance) */}
        <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-ink/15" />
        </div>

        <div className="flex shrink-0 items-center justify-between border-b border-ink/10 px-5 py-4 md:px-7">
          <p id={titleId} className="font-display text-xl tracking-tight">
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title.toLowerCase()}`}
            className="font-mono text-lg leading-none text-ink/50 transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>

        <div className="relative z-0 min-h-0 flex-1 overflow-y-auto overflow-x-visible px-5 py-6 md:px-9 md:py-7 overflow-y-auto ">
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
}
