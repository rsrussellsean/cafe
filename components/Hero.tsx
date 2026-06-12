"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { img } from "@/lib/data";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-line > span", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.12,
      })
        .from(
          "[data-hero-fade]",
          { opacity: 0, y: 20, duration: 1, stagger: 0.1 },
          "-=0.7",
        )
        .from(
          "[data-hero-img]",
          {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.4,
            ease: "expo.out",
          },
          "-=1",
        )
        .from(
          "[data-hero-badge]",
          { scale: 0, duration: 0.9, ease: "back.out(1.7)" },
          "-=0.8",
        );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pt-32"
    >
      {/* topline */}
      <div
        data-hero-fade
        className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60"
      >
        <span>Est. 2019 — Quezon City</span>
        <span className="hidden md:block">Coffee · Bread · Slow mornings</span>
        <span>☕ Open daily</span>
      </div>

      {/* headline */}
      <div className="relative z-10 mt-10 md:mt-0">
        <h1 className="font-display leading-[0.95] tracking-tight text-ink">
          <span className="line-mask hero-line text-[15vw] md:text-[10.5vw]">
            <span>Morning,</span>
          </span>
          <span className="line-mask hero-line text-[15vw] italic font-light text-caramel md:text-[10.5vw]">
            <span>poured slowly.</span>
          </span>
        </h1>

        <p
          data-hero-fade
          className="mt-8 max-w-sm text-base leading-relaxed text-ink/70 md:text-lg"
        >
          A neighborhood coffee &amp; bakehouse. Single-origin espresso,
          72-hour croissants, and a sunlit corner with your name on it.
        </p>

        <div data-hero-fade className="mt-8 flex items-center gap-4">
          <a
            href="#menu"
            className="rounded-full bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors duration-300 hover:bg-caramel"
          >
            See the menu
          </a>
          <a
            href="#story"
            className="link-line font-mono text-xs uppercase tracking-[0.2em] text-ink"
          >
            Our story ↓
          </a>
        </div>
      </div>

      {/* hero image — arched, right side */}
      <div
        data-hero-img
        className="arch absolute bottom-0 right-5 hidden h-[72%] w-[34%] overflow-hidden md:right-10 md:block"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <Image
          src={img.pour}
          alt="Barista pouring a slow morning coffee"
          fill
          priority
          sizes="(min-width: 768px) 34vw, 100vw"
          className="object-cover"
        />
        {/* steam */}
        <div className="absolute left-1/2 top-6 flex -translate-x-1/2 gap-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="steam-line h-10 w-[3px] rounded-full bg-foam/70"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}
        </div>
      </div>

      {/* rotating badge */}
      <div
        data-hero-badge
        className="absolute bottom-24 right-[30%] z-20 hidden h-32 w-32 md:block"
      >
        <svg viewBox="0 0 100 100" className="spin-slow h-full w-full">
          <defs>
            <path
              id="circ"
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <circle cx="50" cy="50" r="49" className="fill-caramel" />
          <text className="fill-foam font-mono text-[8.5px] uppercase tracking-[2.5px]">
            <textPath href="#circ">
              freshly roasted · baked at dawn · katperry ·
            </textPath>
          </text>
          <text
            x="50"
            y="55"
            textAnchor="middle"
            className="fill-foam text-[16px]"
          >
            ✺
          </text>
        </svg>
      </div>

      {/* bottom row */}
      <div
        data-hero-fade
        className="mt-12 flex items-end justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60"
      >
        <span>Scroll ↓</span>
        <span className="md:mr-[38%]">№ 014 Maginhawa St.</span>
      </div>
    </section>
  );
}
