"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { branches } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Locations() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-loc-head]", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      gsap.from("[data-loc-card]", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="locations"
      ref={ref}
      className="relative overflow-hidden bg-forest-deep px-5 py-24 text-foam md:px-10 md:py-32"
    >
      {/* giant backdrop word */}
      <span
        aria-hidden
        className="text-outline pointer-events-none absolute -top-4 left-[-2vw] select-none font-display italic leading-none text-[24vw]"
      >
        Cebu
      </span>

      <div className="relative mx-auto max-w-6xl">
        <p
          data-loc-head
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold"
        >
          ✺ Our Branches
        </p>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h2
            data-loc-head
            className="font-display text-4xl leading-tight tracking-tight md:text-6xl"
          >
            Find us in <em className="font-light text-gold">two</em> cities
          </h2>
          <p
            data-loc-head
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-foam/50"
          >
            ( same brew, twice the love )
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-10">
          {branches.map((b, i) => (
            <article
              key={b.name}
              data-loc-card
              className={`group isolate overflow-hidden rounded-[2rem] bg-foam text-ink shadow-xl shadow-black/25 ${
                i % 2 ? "md:rotate-[0.5deg]" : "md:rotate-[-0.5deg]"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-[2rem]">
                <Image
                  src={b.image}
                  alt={`${b.name} branch storefront`}
                  fill
                  sizes="(min-width: 768px) 36rem, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-5 top-5 rounded-full bg-forest-deep/90 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foam backdrop-blur-sm">
                  {b.tag}
                </span>
                <span className="absolute right-5 top-5 font-mono text-xs uppercase tracking-[0.25em] text-foam drop-shadow">
                  0{i + 1}
                </span>
              </div>

              <div className="flex items-start justify-between gap-6 p-7 md:p-8">
                <div>
                  <h3 className="font-display text-3xl tracking-tight md:text-4xl">
                    {b.name}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink/60">
                    {b.address}
                  </p>
                </div>
                <a
                  href={b.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-line mt-2 shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-forest"
                >
                  Directions ↗
                </a>
              </div>

              <iframe
                src={b.embedUrl}
                title={`Map to ${b.name} branch`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-64 w-full rounded-b-[2rem] border-0 grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
