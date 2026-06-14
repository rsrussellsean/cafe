"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { business } from "@/lib/data";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-line > span", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.13,
      })
        .from(
          "[data-hero-pill]",
          {
            width: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.15,
            clearProps: "width",
          },
          "-=0.85",
        )
        .from(
          "[data-hero-img]",
          {
            opacity: 0,
            y: 80,
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.12,
          },
          "-=0.9",
        )
        .from(
          "[data-hero-fade]",
          { opacity: 0, y: 22, duration: 0.9, stagger: 0.08 },
          "-=1",
        )
        .from(
          "[data-hero-badge]",
          { scale: 0, rotation: -120, duration: 0.9, ease: "back.out(1.6)" },
          "-=0.7",
        );
    }, ref);

    // cursor parallax on the floating cutouts (desktop, motion-safe only)
    let removeMove: (() => void) | undefined;
    const fine = window.matchMedia(
      "(hover: hover) and (prefers-reduced-motion: no-preference)",
    );
    if (fine.matches && ref.current) {
      const layers = gsap.utils
        .toArray<HTMLElement>("[data-depth]", ref.current)
        .map((el) => ({
          depth: parseFloat(el.dataset.depth ?? "0"),
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
        }));
      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * -52 * l.depth);
          l.y(ny * -36 * l.depth);
        });
      };
      window.addEventListener("mousemove", onMove);
      removeMove = () => window.removeEventListener("mousemove", onMove);
    }

    return () => {
      removeMove?.();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh flex-col overflow-hidden px-5 pb-8 pt-28 md:px-10"
    >
      {/* topline */}
      {/* <div
        data-hero-fade
        className="flex items-center justify-between border-b border-ink/10 pb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60"
      >
        <span>{business.city}</span>
        <span className="hidden md:block">Coffee · Cakes · Donuts</span>
        <span>☕ Open daily</span>
      </div> */}

      {/* floating drink cutout, behind the type */}
      {/* <div className="pointer-events-none absolute -right-10 top-[14%] z-0 w-44 md:right-[5vw] md:top-[16%] md:w-[16vw] md:max-w-72">
        <div data-depth="0.5">
          <div data-hero-img>
            <div className="bob product-shadow">
              <Image
                src="/images/hero-drink.png"
                alt=""
                aria-hidden
                width={520}
                height={680}
                priority
                className="h-auto w-full rotate-6"
              />
            </div>
          </div>
        </div>
      </div> */}
      {/* <p
        data-hero-fade
        className="pointer-events-none absolute right-[5vw] top-[58%] hidden font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50 md:block"
      >
        ↖ our brown-sugar bestseller
      </p> */}

      {/* floating cake cutout, bottom-left */}
      {/* <div className="pointer-events-none absolute -left-8 bottom-[12%] z-0 w-36 md:left-[6vw] md:bottom-[18%] md:w-[11vw] md:max-w-52">
        <div data-depth="0.9">
          <div data-hero-img>
            <div
              className="bob product-shadow"
              style={{ animationDelay: "-2.4s" }}
            >
              <Image
                src="/images/hero-cake.png"
                alt=""
                aria-hidden
                width={420}
                height={320}
                className="h-auto w-full -rotate-3"
              />
            </div>
          </div>
        </div>
      </div> */}

      {/* rotating badge, top-left counterweight */}
      {/* <div
        data-hero-badge
        className="absolute left-[6vw] top-[19%] z-20 hidden h-24 w-24 md:block"
      >
        <svg viewBox="0 0 100 100" className="spin-slow h-full w-full">
          <defs>
            <path
              id="circ"
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <circle cx="50" cy="50" r="49" className="fill-forest-deep" />
          <text className="fill-foam font-mono text-[8px] uppercase tracking-[2px]">
            <textPath href="#circ">
              kat &amp; perry&rsquo;s · handcrafted daily ·
            </textPath>
          </text>
          <text
            x="50"
            y="56"
            textAnchor="middle"
            className="fill-gold text-[18px]"
          >
            ✺
          </text>
        </svg>
      </div> */}

      {/* centered editorial headline */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-12 text-center">
        <p
          data-hero-fade
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-caramel"
        >
          ✺ Kat &amp; Perry&rsquo;s Kitchenette
        </p>

        <h1 className="mt-6 font-display leading-[1.02] tracking-tight text-ink">
          <span className="line-mask hero-line text-[12vw] md:text-[7.2vw]">
            <span>
              Brewed to{" "}
              <span
                data-hero-pill
                className="relative inline-flex h-[0.68em] w-[1.5em] translate-y-[0.06em] overflow-hidden rounded-full bg-forest align-baseline"
              >
                <Image
                  src="/images/hero-drink.png"
                  alt="Iced coffee"
                  fill
                  sizes="12rem"
                  className="scale-[1.7] object-contain object-center"
                />
              </span>
            </span>
          </span>
          <span className="line-mask hero-line text-[12vw] md:text-[7.2vw]">
            <span>
              <em className="font-light text-forest">perfection,</em> baked
            </span>
          </span>
          <span className="line-mask hero-line text-[12vw] md:text-[7.2vw]">
            <span>
              with{" "}
              <span
                data-hero-pill
                className="relative inline-flex h-[0.68em] w-[1.5em] translate-y-[0.06em] overflow-hidden rounded-full bg-gold align-baseline"
              >
                <Image
                  src="/images/hero-cake.png"
                  alt="Cheesecake slice"
                  fill
                  sizes="12rem"
                  className="scale-[1.45] object-contain object-center"
                />
              </span>{" "}
              <em className="font-light text-caramel">love</em>
            </span>
          </span>
        </h1>

        <p
          data-hero-fade
          className="mt-8 max-w-md text-base leading-relaxed text-ink/70 md:text-lg"
        >
          Wake up your taste buds with our handcrafted coffee, fresh donuts, and
          irresistible cakes.
        </p>

        <div data-hero-fade className="mt-8 flex items-center gap-5">
          <a
            href="#menu"
            className="rounded-full bg-forest px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors duration-300 hover:bg-gold hover:text-forest-deep"
          >
            Order Now
          </a>
          <a
            href="#testimonials"
            className="link-line font-mono text-xs uppercase tracking-[0.2em] text-ink"
          >
            Read reviews ↓
          </a>
        </div>
      </div>

      {/* bottom row */}
      <div
        data-hero-fade
        className="relative z-10 flex items-center justify-between border-t border-ink/10 pt-5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60"
      >
        <span>Tisa · Mandaue</span>
        <span className="hidden md:block">Coffee · Cakes · Donuts</span>
        <span>Scroll ↓</span>
      </div>
    </section>
  );
}
