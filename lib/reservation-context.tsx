"use client";

import { createContext, useContext, useMemo, useState } from "react";

type ReservationContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ReservationContext = createContext<ReservationContextValue | null>(null);

/**
 * Open/close state for the single reservation modal, so the Reserve CTAs in the
 * nav, hero, locations and footer all drive one instance without prop drilling.
 * Nothing is persisted — unlike the bag, this is per-visit UI state.
 *
 * The modal itself is mounted in app/layout.tsx rather than here: importing the
 * component from this module while the component imports `useReservation` back
 * would be a circular import, which leaves ReservationModal undefined at render
 * time and silently mounts nothing.
 */
export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<ReservationContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return (
    <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>
  );
}

export function useReservation() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error("useReservation must be used within a ReservationProvider");
  return ctx;
}
