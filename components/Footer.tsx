"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { business } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { label: "Instagram", href: business.social.instagram },
  { label: "Facebook", href: business.social.facebook },
  { label: "TikTok", href: business.social.tiktok },
];

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
    <footer ref={ref} className="overflow-hidden bg-forest-deep pt-20 text-foam">
      <div className="grid gap-10 px-5 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div className="flex items-start gap-4">
          <Image
            src="/images/logo.png"
            alt={`${business.name} logo`}
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
          />
          <div>
            <p className="font-display text-2xl leading-tight tracking-tight">
              Kat &amp; Perry&rsquo;s
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-foam/60">
              Handcrafted coffee, fresh donuts, and irresistible cakes — made
              with love in {business.city}.
            </p>
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
            Reach us
          </p>
          <a
            href={`mailto:${business.email}`}
            className="link-line mt-4 block text-sm text-foam/80 break-words"
          >
            {business.email}
          </a>
          <a
            href={`tel:${business.phone.replace(/\s/g, "")}`}
            className="link-line mt-2 block text-sm text-foam/80"
          >
            {business.phone}
          </a>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
            Visit
          </p>
          <p className="mt-4 max-w-[14rem] text-sm leading-relaxed text-foam/80">
            {business.address}
          </p>
          <div className="mt-4 flex gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="link-line font-mono text-[11px] uppercase tracking-[0.15em] text-foam/70"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <h2
        data-footer-word
        className="mt-16 select-none text-center font-display text-[13vw] leading-[0.8] tracking-tight text-foam/90"
      >
        kat &amp; perry&rsquo;s
      </h2>

      <div className="mt-[-1vw] flex flex-col items-center justify-between gap-3 border-t border-foam/15 px-5 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-foam/40 md:flex-row md:px-10">
        <span>© 2025 {business.name}</span>
        <span>brewed with love in {business.city}</span>
        <a href={`mailto:${business.email}`} className="break-all">
          {business.email}
        </a>
      </div>
    </footer>
  );
}
