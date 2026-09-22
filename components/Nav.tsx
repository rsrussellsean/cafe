"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { business } from "@/lib/data";
import BagButton from "@/components/BagButton";
import ReserveButton from "@/components/ReserveButton";

const links = [
  { label: "Home", href: "/#top" },
  { label: "Menu", href: "/#menu" },
  { label: "Order Online", href: "/#order-online" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Locations", href: "/#locations" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isBagPage = pathname === "/bag";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-forest-deep/95 text-foam backdrop-blur-md shadow-lg shadow-forest-deep/20"
          : isBagPage
            ? "text-foam"
            : "text-ink"
      }`}
    >


      <nav className="flex items-center justify-between px-5 py-3 md:px-10">
        <a
          href="/#top"
          data-nav-item
          className="flex items-center gap-3"
          aria-label={business.name}
        >
          <Image
            src="/images/logo.png"
            alt={`${business.name} logo`}
            width={48}
            height={48}
            priority
            className="h-11 w-11 object-contain"
          />
          <span className="hidden font-display text-lg leading-tight tracking-tight sm:block">
            Kat &amp; Perry&rsquo;s
            <span className="block font-mono text-[9px] uppercase tracking-[0.25em] opacity-60">
              Kitchenette
            </span>
          </span>
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

        <div data-nav-item className="flex items-center gap-2 md:gap-3">
          <BagButton scrolled={scrolled} />
          {/* Hidden on phones: the header already carries the logo, bag and
              "Order Now". Mobile visitors reach this from the hero CTA. */}
          <ReserveButton
            variant="nav"
            label="Reserve"
            className={`hidden sm:inline-flex ${
              scrolled || isBagPage
                ? "border border-foam/30 text-foam hover:bg-foam hover:text-forest-deep"
                : "border border-ink/25 text-ink hover:bg-forest hover:text-foam"
            }`}
          />
          <a
            href="/#menu"
            className={`rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
              scrolled
                ? "bg-gold text-forest-deep hover:bg-foam"
                : "bg-forest text-foam hover:bg-gold hover:text-forest-deep"
            }`}
          >
            Order Now
          </a>
        </div>
      </nav>
    </header>
  );
}
