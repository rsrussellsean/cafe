"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

function Stars() {
  return (
    <span className="text-gold" aria-hidden>
      ★★★★★
    </span>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-testi-head]", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });
      gsap.from("[data-testi-card]", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-testi-grid]", start: "top 82%" },
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
      <div className="mx-auto max-w-6xl">
        <p
          data-testi-head
          className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-caramel"
        >
          ✺ Testimonials
        </p>
        <h2
          data-testi-head
          className="mt-5 text-center font-display text-4xl leading-tight tracking-tight text-ink md:text-6xl"
        >
          Our customers <em className="font-light text-forest">love us</em>
        </h2>

        <div
          data-testi-grid
          className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-8"
        >
          {testimonials.map((t) => (
            <figure
              key={t.name}
              data-testi-card
              className="flex flex-col rounded-3xl border border-ink/10 bg-foam p-8 shadow-sm shadow-ink/5"
            >
              <h3 className="font-display text-2xl tracking-tight text-ink">
                {t.headline}
              </h3>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
                “{t.body}”
              </blockquote>
              <hr className="my-6 border-ink/10" />
              <figcaption className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest font-display text-lg text-foam">
                  {t.name.charAt(0)}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-lg leading-tight text-ink">
                    {t.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-ink/50">
                    <Stars /> {t.rating}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
