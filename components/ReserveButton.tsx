"use client";

import { useReservation } from "@/lib/reservation-context";

type Variant = "forest" | "gold" | "ghost" | "link" | "nav";

// The site's existing CTA class strings, collected in one place rather than
// repeated at each call site. Deliberately not a site-wide Button refactor.
const VARIANTS: Record<Variant, string> = {
  forest:
    "rounded-full bg-forest px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors duration-300 hover:bg-gold hover:text-forest-deep",
  gold: "rounded-full bg-gold px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-forest-deep transition-colors duration-300 hover:bg-foam",
  ghost:
    "rounded-full border border-ink/25 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-ink/70 transition-colors duration-300 hover:border-caramel hover:text-ink",
  link: "link-line font-mono text-xs uppercase tracking-[0.2em]",
  nav: "rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-300",
};

type Props = {
  variant?: Variant;
  label?: string;
  className?: string;
};

export default function ReserveButton({
  variant = "forest",
  label = "Reserve a Table",
  className = "",
}: Props) {
  const { open } = useReservation();

  return (
    <button type="button" onClick={open} className={`${VARIANTS[variant]} ${className}`}>
      {label}
    </button>
  );
}
