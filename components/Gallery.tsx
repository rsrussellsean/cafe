"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { img } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const frames = [
  { src: img.window, caption: "the window seat" },
  { src: img.latteArt, caption: "your usual, remembered" },
  { src: img.friends, caption: "third place energy" },
  { src: img.barista, caption: "behind the bar" },
  { src: img.croissant, caption: "7am, every day" },
];

export default function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      if (!track) return;

      const scrollWidth = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -scrollWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => `+=${scrollWidth()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="space" ref={ref} className="overflow-hidden bg-cream-dim">
      <div className="px-5 pt-24 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-caramel">
          ✺ 03 — The Space
        </p>
        <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight md:text-6xl">
          Stay a <em className="font-light text-caramel">while.</em>
        </h2>
      </div>

      <div
        ref={trackRef}
        className="mt-12 flex flex-col gap-6 px-5 pb-24 md:mt-8 md:w-max md:flex-row md:items-end md:gap-10 md:px-10 md:pb-10"
      >
        {frames.map((f, i) => (
          <figure
            key={f.caption}
            className={`relative shrink-0 overflow-hidden ${
              i % 2 === 0
                ? "arch aspect-3/4 w-full md:h-[52svh] md:w-auto"
                : "aspect-4/3 w-full rounded-2xl md:mb-10 md:h-[38svh] md:w-auto"
            }`}
          >
            <Image
              src={f.src}
              alt={f.caption}
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-espresso/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foam backdrop-blur-sm">
              {String(i + 1).padStart(2, "0")} — {f.caption}
            </figcaption>
          </figure>
        ))}

        <div className="flex shrink-0 items-center px-6 md:px-16">
          <p className="font-display text-4xl italic text-ink/70 md:text-6xl">
            …and stay
            <br />a little longer.
          </p>
        </div>
      </div>
    </section>
  );
}
