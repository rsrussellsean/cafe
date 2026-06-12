"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hours } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Visit() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-visit-reveal]", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="visit"
      ref={ref}
      className="grid gap-14 px-5 py-28 md:grid-cols-[1.2fr_1fr] md:gap-10 md:px-10 md:py-40"
    >
      <div>
        <p
          data-visit-reveal
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-caramel"
        >
          ✺ 04 — Visit
        </p>
        <h2
          data-visit-reveal
          className="mt-6 font-display text-6xl leading-[0.98] tracking-tight md:text-[7.5rem]"
        >
          Come
          <br />
          say <em className="font-light text-caramel">hi.</em>
        </h2>
        <div data-visit-reveal className="mt-10 max-w-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
            Find us
          </p>
          <p className="mt-3 font-display text-2xl leading-snug md:text-3xl">
            № 014 Maginhawa Street,
            <br />
            Teachers Village, Quezon City
          </p>
          <a
            href="https://maps.google.com/?q=Maginhawa+Street+Quezon+City"
            target="_blank"
            rel="noreferrer"
            className="link-line mt-5 inline-block font-mono text-xs uppercase tracking-[0.2em] text-caramel"
          >
            Open in maps ↗
          </a>
        </div>
      </div>

      <div className="md:pt-24">
        <div
          data-visit-reveal
          className="rounded-3xl border border-ink/15 bg-foam p-8 md:p-10"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
            Hours
          </p>
          <ul className="mt-6">
            {hours.map((h) => (
              <li
                key={h.days}
                className="flex items-baseline justify-between border-t border-ink/10 py-4 first:border-t-0"
              >
                <span className="font-display text-xl md:text-2xl">
                  {h.days}
                </span>
                <span className="font-mono text-sm text-ink/60">{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl bg-caramel/10 px-5 py-4 text-sm leading-relaxed text-ink/70">
            <span className="text-caramel">✺</span> Friday nights: vinyl
            listening sessions &amp; a pastry case that stays full till close.
          </p>
        </div>

        <div data-visit-reveal className="mt-6 flex gap-3">
          {["Instagram", "TikTok", "Spotify"].map((s) => (
            <a
              key={s}
              href="#"
              className="flex-1 rounded-full border border-ink/20 px-4 py-3 text-center font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 hover:bg-ink hover:text-foam"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
