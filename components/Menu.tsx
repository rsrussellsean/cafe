"use client";

import {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drinks, type Drink } from "@/lib/data";
import { useBag } from "@/lib/bag-context";

gsap.registerPlugin(ScrollTrigger);

const tabs = ["Coffee", "Cakes", "Donuts"] as const;
type Tab = (typeof tabs)[number];

export default function Menu() {
  const ref = useRef<HTMLElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("Coffee");
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-menu-head]", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      gsap.from("[data-menu-row]", {
        y: 36,
        opacity: 0,
        stagger: 0.07,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });
    }, ref);

    // cursor-following preview card (desktop, motion-safe only)
    let removeMove: (() => void) | undefined;
    const el = floatRef.current;
    const fine = window.matchMedia(
      "(hover: hover) and (prefers-reduced-motion: no-preference)",
    );
    if (el && fine.matches) {
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
      const onMove = (e: MouseEvent) => {
        // hide the preview while the pointer is over the bag dropdown
        if ((e.target as Element)?.closest?.("[data-bag-dropdown]")) {
          gsap.to(el, { opacity: 0, scale: 0.85, duration: 0.3 });
          return;
        }
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        // section-relative coords since the float is absolute inside it
        xTo(e.clientX - r.left - 120);
        yTo(e.clientY - r.top - 160);
      };
      // mouseleave doesn't fire while scrolling, so hide on scroll too
      const onScroll = () =>
        gsap.to(el, { opacity: 0, scale: 0.85, duration: 0.3 });
      window.addEventListener("mousemove", onMove);
      window.addEventListener("scroll", onScroll, { passive: true });
      removeMove = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", onScroll);
      };
    }

    return () => {
      removeMove?.();
      ctx.revert();
    };
  }, []);

  const showFloat = (i: number) => {
    const el = floatRef.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    gsap.to(el, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
    el.querySelectorAll("[data-float-img]").forEach((img, j) =>
      gsap.to(img, { opacity: j === i ? 1 : 0, duration: 0.3 }),
    );
  };

  const hideFloat = () => {
    if (!floatRef.current) return;
    gsap.to(floatRef.current, { opacity: 0, scale: 0.85, duration: 0.3 });
  };

  return (
    <section
      id="menu"
      ref={ref}
      className="relative overflow-hidden bg-forest px-5 py-24 text-foam md:px-10 md:py-32"
    >
      {/* giant backdrop word */}
      <span
        aria-hidden
        className="text-outline pointer-events-none absolute -top-6 right-[-2vw] select-none font-display italic leading-none text-[26vw]"
      >
        Menu
      </span>

      <div className="relative mx-auto max-w-6xl">
        <p
          data-menu-head
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold"
        >
          ✺ Our Menu
        </p>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h2
            data-menu-head
            className="font-display text-4xl leading-tight tracking-tight md:text-6xl"
          >
            What&rsquo;s <em className="font-light text-gold">brewing</em>
          </h2>

          {/* tabs */}
          <div data-menu-head className="flex flex-wrap gap-3">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                  tab === t
                    ? "bg-gold text-forest-deep"
                    : "border border-foam/25 text-foam/70 hover:border-gold hover:text-foam"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === "Coffee" ? (
          <ol className="mt-10 md:mt-14" onMouseLeave={hideFloat}>
            {drinks.map((d, i) => (
              <li key={d.name} data-menu-row className="border-b border-foam/15">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  onMouseEnter={() => showFloat(i)}
                  aria-expanded={open === i}
                  className="group flex w-full items-baseline gap-4 py-6 text-left md:gap-8 md:py-7"
                >
                  <span className="font-mono text-xs text-gold">
                    0{i + 1}
                  </span>
                  <span
                    className={`flex-1 font-display text-3xl tracking-tight transition-all duration-300 group-hover:translate-x-2 group-hover:text-gold md:text-5xl ${
                      open === i ? "text-gold" : ""
                    }`}
                  >
                    {d.name}
                  </span>
                  <span className="font-mono text-sm text-foam/60 md:text-base">
                    ₱ {d.price}
                  </span>
                  <span
                    className="hidden w-4 text-center font-mono text-lg text-foam/40 transition-transform duration-300 md:block"
                    aria-hidden
                  >
                    {open === i ? "−" : "+"}
                  </span>
                </button>

                {/* accordion detail */}
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                    open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-6 pb-8 md:pl-12">
                      <div className="product-shadow relative h-36 w-28 shrink-0 md:hidden">
                        <Image
                          src={d.image}
                          alt={d.name}
                          fill
                          sizes="7rem"
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="max-w-xl text-sm leading-relaxed text-foam/70">
                          {d.description}
                        </p>
                        <div
                          onMouseEnter={hideFloat}
                          className="mt-5 flex flex-wrap items-center gap-5"
                        >
                          <AddToBagButton drink={d} />
                          <a
                            href="#contact"
                            className="link-line inline-block font-mono text-xs uppercase tracking-[0.2em] text-foam/60"
                          >
                            Order this ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-[1.2fr_1fr]">
            <div>
              <h3 className="font-display text-4xl leading-tight tracking-tight md:text-6xl">
                Freshly baked{" "}
                <em className="font-light text-gold">{tab.toLowerCase()}</em>,
                every morning.
              </h3>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-foam/70">
                Our {tab.toLowerCase()} are made fresh daily and sell out fast.
                Drop by the store or message us to see today&rsquo;s selection
                and reserve yours — available per piece or per slice.
              </p>
              <a
                href="#contact"
                className="mt-7 inline-block rounded-full bg-gold px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-forest-deep transition-colors duration-300 hover:bg-foam"
              >
                Message to order
              </a>
            </div>
            <div className="arch relative mx-auto h-72 w-60 overflow-hidden bg-foam/10 md:h-96 md:w-72">
              <Image
                src="/images/hero-cake.png"
                alt={`${tab} at Kat & Perry's`}
                fill
                sizes="18rem"
                className="product-shadow object-contain px-5 py-8"
              />
            </div>
          </div>
        )}
      </div>

      {/* cursor-following preview */}
      <div ref={floatRef} className="menu-float bg-gold" aria-hidden>
        {drinks.map((d) => (
          <div key={d.name} data-float-img className="absolute inset-0">
            <Image
              src={d.image}
              alt=""
              fill
              sizes="240px"
              className="object-contain p-4 pb-2"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function AddToBagButton({ drink }: { drink: Drink }) {
  const { add, setOpen, items } = useBag();
  const qty = items.find((i) => i.name === drink.name)?.qty ?? 0;
  // Optimistic count: bumps instantly on click, then reconciles to real state.
  const [optimisticQty, bumpOptimistic] = useOptimistic(qty, (c) => c + 1);
  const [, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // Only the first time an item enters the bag should we pop the dropdown open.
    // Re-adding an item that's already in the bag respects the current open state:
    // if it's closed it stays closed (just increments + badge), if it's open it
    // stays open. data-bag-keep-open stops the outside-click from closing it.
    const isNew = qty === 0;
    startTransition(() => {
      bumpOptimistic(drink.name);
      add(drink);
    });
    setAdded(true);
    if (isNew) setOpen(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const label = added
    ? `Added ✓ · ${optimisticQty}`
    : optimisticQty > 0
      ? `+ Add more · ${optimisticQty}`
      : "+ Add to bag";

  return (
    <button
      type="button"
      onClick={handleAdd}
      data-bag-keep-open
      className="rounded-full bg-gold px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-forest-deep transition-colors duration-300 hover:bg-foam"
    >
      {label}
    </button>
  );
}
