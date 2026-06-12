"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { menu } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const flat = menu.flatMap((s) => s.items);

const sections = (() => {
  let i = 0;
  return menu.map((s) => ({
    label: s.label,
    items: s.items.map((item) => ({ ...item, index: i++ })),
  }));
})();

export default function Menu() {
  const ref = useRef<HTMLElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (floatRef.current) {
        xTo.current = gsap.quickTo(floatRef.current, "x", {
          duration: 0.5,
          ease: "power3",
        });
        yTo.current = gsap.quickTo(floatRef.current, "y", {
          duration: 0.5,
          ease: "power3",
        });
      }

      gsap.from("[data-menu-row]", {
        y: 40,
        opacity: 0,
        stagger: 0.06,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-menu-list]", start: "top 80%" },
      });

      gsap.from("[data-menu-title] > span", {
        yPercent: 110,
        duration: 1.1,
        ease: "power4.out",
        scrollTrigger: { trigger: "[data-menu-title]", start: "top 85%" },
      });

      // hide the floating preview whenever the section scrolls out of view,
      // since mouseleave doesn't fire when content moves under a still cursor
      const hideFloat = () => {
        if (!floatRef.current) return;
        gsap.to(floatRef.current, {
          opacity: 0,
          scale: 0.85,
          duration: 0.3,
          ease: "power3.out",
        });
      };
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onLeave: hideFloat,
        onLeaveBack: hideFloat,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const move = useCallback((e: React.MouseEvent) => {
    xTo.current?.(e.clientX - 120);
    yTo.current?.(e.clientY - 150);
  }, []);

  const show = useCallback((i: number) => {
    const el = floatRef.current;
    if (!el) return;
    el.querySelectorAll("[data-float-img]").forEach((node, idx) => {
      (node as HTMLElement).style.opacity = idx === i ? "1" : "0";
    });
    gsap.to(el, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
  }, []);

  const hide = useCallback(() => {
    if (!floatRef.current) return;
    gsap.to(floatRef.current, {
      opacity: 0,
      scale: 0.85,
      duration: 0.35,
      ease: "power3.out",
    });
  }, []);

  return (
    <section
      id="menu"
      ref={ref}
      className="bg-espresso px-5 py-28 text-foam md:px-10 md:py-40"
      onMouseMove={move}
      onMouseLeave={hide}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-caramel-soft">
        ✺ 02 — The Menu
      </p>
      <h2
        data-menu-title
        className="line-mask mt-6 font-display text-5xl leading-[1.02] tracking-tight md:text-8xl"
      >
        <span>
          Order the <em className="font-light text-caramel-soft">usual.</em>
        </span>
      </h2>
      <p className="mt-6 max-w-md text-foam/60">
        Prices in PHP. Everything brewed, baked, and whisked in-house — hover an
        item for a look.
      </p>

      <div data-menu-list className="mt-16 md:mt-24">
        {sections.map((section) => (
          <div key={section.label} className="mb-14 last:mb-0">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-foam/40">
              {section.label}
            </p>
            <ul>
              {section.items.map((item) => {
                return (
                  <li key={item.name} data-menu-row>
                    <div
                      className="group flex cursor-pointer items-baseline justify-between gap-6 border-t border-foam/15 py-6 transition-colors duration-300 last:border-b hover:border-caramel-soft/60 md:py-8"
                      onMouseEnter={() => show(item.index)}
                      onMouseLeave={hide}
                    >
                      <div className="flex flex-1 items-baseline gap-5">
                        <h3 className="font-display text-2xl tracking-tight transition-transform duration-300 group-hover:translate-x-3 group-hover:text-caramel-soft md:text-4xl">
                          {item.name}
                        </h3>
                        <p className="hidden font-mono text-xs text-foam/40 md:block">
                          {item.description}
                        </p>
                      </div>
                      <p className="font-mono text-sm text-foam/70 md:text-base">
                        ₱{item.price}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* cursor-following preview */}
      <div ref={floatRef} className="menu-float hidden md:block">
        {flat.map((item) => (
          <div
            key={item.name}
            data-float-img
            className="absolute inset-0 transition-opacity duration-200"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="240px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
