"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { Drink } from "@/lib/data";

// One line in the bag. Keyed by drink name (unique & stable in lib/data.ts).
export type BagItem = {
  name: string;
  price: string;
  image: string;
  qty: number;
};

type Action =
  | { type: "hydrate"; items: BagItem[] }
  | { type: "add"; drink: Drink }
  | { type: "increment"; name: string }
  | { type: "decrement"; name: string }
  | { type: "remove"; name: string }
  | { type: "clear" };

const STORAGE_KEY = "kp-bag";

function reducer(state: BagItem[], action: Action): BagItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const { drink } = action;
      const existing = state.find((i) => i.name === drink.name);
      if (existing) {
        return state.map((i) =>
          i.name === drink.name ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [
        ...state,
        {
          name: drink.name,
          price: drink.price,
          image: drink.image,
          qty: 1,
        },
      ];
    }
    case "increment":
      return state.map((i) =>
        i.name === action.name ? { ...i, qty: i.qty + 1 } : i,
      );
    case "decrement":
      return state
        .map((i) =>
          i.name === action.name ? { ...i, qty: i.qty - 1 } : i,
        )
        .filter((i) => i.qty > 0);
    case "remove":
      return state.filter((i) => i.name !== action.name);
    case "clear":
      return [];
    default:
      return state;
  }
}

type BagContextValue = {
  items: BagItem[];
  count: number;
  total: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (drink: Drink) => void;
  increment: (name: string) => void;
  decrement: (name: string) => void;
  remove: (name: string) => void;
  clear: () => void;
};

const BagContext = createContext<BagContextValue | null>(null);

export function BagProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted bag after mount (avoids SSR/client markup mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BagItem[];
        if (Array.isArray(parsed)) dispatch({ type: "hydrate", items: parsed });
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist on every change (only after the initial hydrate).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [items, hydrated]);

  const value = useMemo<BagContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const total = items.reduce(
      (sum, i) => sum + Number(i.price) * i.qty,
      0,
    );
    return {
      items,
      count,
      total,
      isOpen,
      setOpen,
      add: (drink) => dispatch({ type: "add", drink }),
      increment: (name) => dispatch({ type: "increment", name }),
      decrement: (name) => dispatch({ type: "decrement", name }),
      remove: (name) => dispatch({ type: "remove", name }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [items, isOpen]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within a BagProvider");
  return ctx;
}

// Shared peso formatter (matches the "175.00" style in lib/data.ts).
export function peso(n: number) {
  return n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
