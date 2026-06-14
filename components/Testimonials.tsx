"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

// alternating palettes for the stacking deck
const palettes = [
  { card: "bg-foam text-ink border-ink/10", stars: "text-gold", avatar: "bg-forest text-foam" },
  { card: "bg-forest-deep text-foam border-foam/10", stars: "text-gold", avatar: "bg-gold text-forest-deep" },
  { card: "bg-gold text-forest-deep border-forest-deep/15", stars: "text-forest-deep", avatar: "bg-forest-deep text-foam" },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-testi-head]", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="testimonials"
      ref={ref}
      className="bg-cream-dim px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <p
          data-testi-head
          className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-caramel"
        >
          ✺ Testimonials
        </p>
        <h2
          data-testi-head
          className="mt-5 text-center font-display text-5xl leading-tight tracking-tight text-ink md:text-7xl"
        >
          Our customers <em className="font-light text-forest">love us</em>
        </h2>
        <p
          data-testi-head
          className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-ink/40"
        >
          ( keep scrolling — they stack up )
        </p>

        {/* sticky stacking deck */}
        <div className="mt-14 md:mt-20">
          {testimonials.map((t, i) => {
            const p = palettes[i % palettes.length];
            return (
              <figure
                key={t.name}
                style={{ top: `${88 + i * 26}px` }}
                className={`sticky mb-10 flex min-h-[55vh] flex-col justify-between overflow-hidden rounded-[2rem] border p-8 shadow-xl shadow-ink/10 md:p-14 ${p.card} ${
                  i % 2 ? "rotate-[0.75deg]" : "rotate-[-0.75deg]"
                }`}
              >
                {/* giant decorative quote mark */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-10 right-6 select-none font-display text-[12rem] leading-none opacity-10"
                >
                  ”
                </span>

                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] opacity-70">
                  <span>
                    0{i + 1} / 0{testimonials.length}
                  </span>
                  <span className={p.stars} aria-label={`${t.rating} stars`}>
                    ★★★★★ {t.rating}
                  </span>
                </div>

                <blockquote className="relative py-10 md:py-12">
                  <h3 className="font-display text-3xl leading-tight tracking-tight md:text-5xl">
                    {t.headline}
                  </h3>
                  <p className="mt-6 max-w-2xl text-base leading-relaxed opacity-80 md:text-xl">
                    “{t.body}”
                  </p>
                </blockquote>

                <figcaption className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-display text-lg ${p.avatar}`}
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span className="font-display text-lg leading-tight">
                    {t.name}
                  </span>
                  <span className="ml-auto hidden font-mono text-[11px] uppercase tracking-[0.2em] opacity-50 md:block">
                    Verified regular
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
