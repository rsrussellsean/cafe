"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drinks } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const tabs = ["Coffee", "Cakes", "Donuts"] as const;
type Tab = (typeof tabs)[number];

export default function Menu() {
  const ref = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("Coffee");
  const [active, setActive] = useState(0);

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
      gsap.from("[data-menu-thumb]", {
        scale: 0.8,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: "[data-menu-grid]", start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  // soft fade/swap when the featured drink changes
  useEffect(() => {
    if (!featuredRef.current) return;
    gsap.fromTo(
      featuredRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
    );
  }, [active, tab]);

  const drink = drinks[active];

  return (
    <section
      id="menu"
      ref={ref}
      className="bg-forest px-5 py-24 text-foam md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p
          data-menu-head
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold"
        >
          ✺ Our Menu
        </p>

        {/* tabs */}
        <div data-menu-head className="mt-6 flex flex-wrap gap-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                tab === t
                  ? "bg-gold text-forest-deep"
                  : "border border-foam/25 text-foam/70 hover:border-gold hover:text-foam"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Coffee" ? (
          <div className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-2 md:gap-16">
            {/* featured */}
            <div
              ref={featuredRef}
              className="flex flex-col items-center gap-8 md:flex-row md:items-center"
            >
              <div className="product-shadow relative h-72 w-56 shrink-0">
                <Image
                  src={drink.image}
                  alt={drink.name}
                  fill
                  sizes="(min-width: 768px) 14rem, 14rem"
                  className="object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-display text-4xl leading-tight tracking-tight md:text-5xl">
                  {drink.name}
                </h3>
                <p className="mt-3 font-mono text-2xl text-gold">
                  ₱ {drink.price}
                </p>
                <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-foam/70 md:mx-0">
                  {drink.description}
                </p>
                <a
                  href="#contact"
                  className="mt-7 inline-block rounded-full bg-gold px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-forest-deep transition-colors duration-300 hover:bg-foam"
                >
                  Order Now
                </a>
              </div>
            </div>

            {/* thumbnail selector */}
            <div data-menu-grid className="grid grid-cols-3 gap-4 md:gap-5">
              {drinks.map((d, i) => (
                <button
                  key={d.name}
                  data-menu-thumb
                  onClick={() => setActive(i)}
                  aria-label={d.name}
                  className={`group relative aspect-square overflow-hidden rounded-2xl border transition-all duration-300 ${
                    i === active
                      ? "border-gold bg-foam/10"
                      : "border-foam/15 bg-foam/5 hover:border-foam/40"
                  }`}
                >
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    sizes="120px"
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-8 rounded-3xl border border-foam/15 bg-foam/5 px-6 py-16 text-center md:mt-16 md:flex-row md:justify-center md:gap-12 md:text-left">
            <div className="product-shadow relative h-56 w-64 shrink-0">
              <Image
                src="/images/hero-cake.png"
                alt={`${tab} at Kat & Perry's`}
                fill
                sizes="16rem"
                className="object-contain"
              />
            </div>
            <div className="max-w-md">
              <h3 className="font-display text-3xl tracking-tight md:text-4xl">
                Freshly baked {tab.toLowerCase()}, daily.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-foam/70">
                Our {tab.toLowerCase()} are made fresh every morning and sell out
                fast. Drop by the store or message us to see today&rsquo;s
                selection and reserve yours — available per piece or per slice.
              </p>
              <a
                href="#contact"
                className="mt-6 inline-block rounded-full bg-gold px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-forest-deep transition-colors duration-300 hover:bg-foam"
              >
                Message to order
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
