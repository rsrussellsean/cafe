"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const links = [
  { label: "Story", href: "#story" },
  { label: "Menu", href: "#menu" },
  { label: "Space", href: "#space" },
  { label: "Visit", href: "#visit" },
];

export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-nav-item]", {
        y: -24,
        opacity: 0,
        stagger: 0.07,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.4,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-50 mix-blend-difference text-foam"
    >
      <nav className="flex items-center justify-between px-5 py-5 md:px-10">
        <a
          href="#top"
          data-nav-item
          className="font-display text-xl tracking-tight"
        >
          katperry<sup className="font-mono text-[10px]">®</sup>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href} data-nav-item>
              <a
                href={l.href}
                className="link-line font-mono text-xs uppercase tracking-[0.2em]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#visit"
          data-nav-item
          className="rounded-full border border-foam/60 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-300 hover:bg-foam hover:text-ink"
        >
          Order pickup
        </a>
      </nav>
    </header>
  );
}
