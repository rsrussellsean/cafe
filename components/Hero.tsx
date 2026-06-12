"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { business } from "@/lib/data";

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
            opacity: 0,
            y: 60,
            scale: 0.9,
            duration: 1.3,
            stagger: 0.15,
            ease: "expo.out",
          },
          "-=1",
        )
        .from(
          "[data-hero-badge]",
          { scale: 0, duration: 0.9, ease: "back.out(1.7)" },
          "-=0.9",
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
        <span>{business.city}</span>
        <span className="hidden md:block">Coffee · Cakes · Donuts</span>
        <span>☕ Open daily</span>
      </div>

      {/* headline — spans full width */}
      <div className="relative z-10 mt-10 md:mt-8">
        <h1 className="font-display leading-[0.92] tracking-tight text-ink">
          <span className="line-mask hero-line text-[12.5vw] md:text-[6.6vw]">
            <span>
              Brewed to{" "}
              <em className="font-light not-italic text-forest">perfection</em>
            </span>
          </span>
          <span className="line-mask hero-line text-[12.5vw] md:text-[6.6vw]">
            <span>
              Baked with <em className="font-light text-caramel">love</em>
            </span>
          </span>
        </h1>
      </div>

      {/* lower region: copy on the left, products on the right */}
      <div className="relative mt-10 flex-1 md:mt-0">
        <div className="relative z-10 max-w-md md:absolute md:bottom-2 md:left-0">
          <p
            data-hero-fade
            className="text-base leading-relaxed text-ink/70 md:text-lg"
          >
            Wake up your taste buds with our handcrafted coffee, fresh donuts,
            and irresistible cakes.
          </p>

          <div data-hero-fade className="mt-8 flex items-center gap-4">
            <a
              href="#menu"
              className="rounded-full bg-forest px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors duration-300 hover:bg-gold hover:text-forest-deep"
            >
              Order Now
            </a>
            <a
              href="#testimonials"
              className="link-line font-mono text-xs uppercase tracking-[0.2em] text-ink"
            >
              Read reviews ↓
            </a>
          </div>
        </div>

        {/* floating product cutouts */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 hidden md:block">
          <div
            data-hero-img
            className="bob product-shadow absolute right-[14%] top-0 h-[78%] w-[34%]"
          >
            <Image
              src="/images/hero-drink.png"
              alt="Biscoff caramel iced coffee"
              fill
              priority
              sizes="30vw"
              className="object-contain object-bottom"
            />
          </div>
          <div
            data-hero-img
            className="bob product-shadow absolute bottom-0 right-0 h-[42%] w-[24%]"
            style={{ animationDelay: "0.8s" }}
          >
            <Image
              src="/images/hero-cake.png"
              alt="Burnt basque cheesecake slice"
              fill
              sizes="22vw"
              className="object-contain object-bottom"
            />
          </div>

          {/* rotating badge */}
          <div
            data-hero-badge
            className="absolute bottom-[20%] right-[46%] z-20 h-24 w-24"
          >
            <svg viewBox="0 0 100 100" className="spin-slow h-full w-full">
              <defs>
                <path
                  id="circ"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <circle cx="50" cy="50" r="49" className="fill-forest" />
              <text className="fill-foam font-mono text-[8px] uppercase tracking-[2px]">
                <textPath href="#circ">
                  kat &amp; perry&rsquo;s · handcrafted daily ·
                </textPath>
              </text>
              <text
                x="50"
                y="56"
                textAnchor="middle"
                className="fill-gold text-[18px]"
              >
                ✺
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* bottom row */}
      <div
        data-hero-fade
        className="mt-12 flex items-end justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60"
      >
        <span>Scroll ↓</span>
        <span className="hidden max-w-[36%] text-right normal-case tracking-[0.15em] md:block">
          {business.address}
        </span>
      </div>
    </section>
  );
}
