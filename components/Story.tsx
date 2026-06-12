"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { img } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      gsap.to("[data-parallax-a]", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: ref.current, scrub: 1 },
      });
      gsap.to("[data-parallax-b]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: ref.current, scrub: 1 },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={ref}
      className="relative grid gap-14 px-5 py-28 md:grid-cols-2 md:gap-10 md:px-10 md:py-40"
    >
      {/* copy */}
      <div className="md:sticky md:top-32 md:self-start">
        <p
          data-reveal
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-caramel"
        >
          ✺ 01 — The Story
        </p>
        <h2
          data-reveal
          className="mt-6 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl"
        >
          Built on burnt
          <br />
          butter &amp; <em className="font-light text-caramel">patience.</em>
        </h2>
        <p
          data-reveal
          className="mt-8 max-w-md text-base leading-relaxed text-ink/70 md:text-lg"
        >
          katperry started as a folding table at a weekend market — one grinder,
          one kettle, and a stubborn belief that a neighborhood deserves coffee
          made like it matters.
        </p>
        <p
          data-reveal
          className="mt-5 max-w-md text-base leading-relaxed text-ink/70 md:text-lg"
        >
          Seven years on, the dough still proofs for three days, the beans are
          still roasted twenty minutes away, and the first croissant still
          leaves the oven before the sun is fully up.
        </p>
        <div data-reveal className="mt-10 flex gap-12">
          {[
            ["72h", "laminated dough"],
            ["18h", "cold brew steep"],
            ["07:00", "first bake daily"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-display text-3xl text-caramel md:text-4xl">
                {n}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">
                {l}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* images */}
      <div className="relative min-h-[120vw] md:min-h-[110vh]">
        <figure
          data-parallax-a
          data-reveal
          className="arch absolute left-0 top-0 aspect-3/4 w-[72%] overflow-hidden"
        >
          <Image
            src={img.interior}
            alt="Warm afternoon light inside the cafe"
            fill
            sizes="(min-width: 768px) 36vw, 72vw"
            className="object-cover"
          />
        </figure>
        <figure
          data-parallax-b
          data-reveal
          className="absolute bottom-0 right-0 aspect-4/5 w-[55%] rotate-2 overflow-hidden rounded-2xl shadow-2xl shadow-ink/20"
        >
          <Image
            src={img.beans}
            alt="Freshly roasted coffee beans"
            fill
            sizes="(min-width: 768px) 28vw, 55vw"
            className="object-cover"
          />
        </figure>
        <p
          data-reveal
          className="absolute bottom-[38%] left-2 -rotate-90 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50"
        >
          fig. a — the room, 4pm
        </p>
      </div>
    </section>
  );
}
