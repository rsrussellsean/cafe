"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-footer-word]", {
        yPercent: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: { trigger: "[data-footer-word]", start: "top 95%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={ref}
      className="overflow-hidden bg-espresso pt-20 text-foam"
    >
      <div className="flex items-center justify-between px-5 md:px-10">
        <div className="max-w-xs">
          <p className="font-display text-2xl italic leading-snug text-foam/90 md:text-3xl">
            “The coffee is the excuse. Stay for the room.”
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-foam/40">
            — a regular, probably
          </p>
        </div>
        <a
          href="#top"
          className="hidden rounded-full border border-foam/30 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-foam hover:text-ink md:block"
        >
          Back to top ↑
        </a>
      </div>

      <h2
        data-footer-word
        className="mt-16 select-none text-center font-display text-[14.5vw] leading-[0.8] tracking-tight text-foam/90"
      >
        katperry
      </h2>

      <div className="mt-[-2vw] flex flex-col items-center justify-between gap-3 border-t border-foam/15 px-5 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-foam/40 md:flex-row md:px-10">
        <span>© {new Date().getFullYear()} katperry coffee &amp; bakehouse</span>
        <span>brewed in quezon city ✺ open daily</span>
        <span>hello@katperry.coffee</span>
      </div>
    </footer>
  );
}
