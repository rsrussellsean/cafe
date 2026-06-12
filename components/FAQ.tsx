"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { faqs } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-faq-reveal]", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-forest-deep px-5 py-24 text-foam md:px-10 md:py-32"
    >
      {/* subtle backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background:url('/images/faq-bg.jpg')_center/cover]"
      />
      <div className="absolute inset-0 bg-forest-deep/60" aria-hidden />

      <div className="relative mx-auto max-w-4xl">
        <p
          data-faq-reveal
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold"
        >
          ✺ Got questions?
        </p>
        <h2
          data-faq-reveal
          className="mt-5 font-display text-5xl leading-none tracking-tight md:text-7xl"
        >
          FAQ
        </h2>

        <div className="mt-12 divide-y divide-foam/15 border-y border-foam/15">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} data-faq-reveal>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-5 py-6 text-left"
                >
                  <span className="font-display text-2xl text-gold md:text-3xl">
                    Q
                  </span>
                  <span className="flex-1 font-display text-lg leading-snug tracking-tight md:text-xl">
                    {f.q}
                  </span>
                  <span
                    className={`shrink-0 font-mono text-xl transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex gap-5 pb-6">
                      <span className="font-display text-2xl text-forest-soft md:text-3xl">
                        A
                      </span>
                      <p className="flex-1 text-sm leading-relaxed text-foam/75">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
