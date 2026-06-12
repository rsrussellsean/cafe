"use client";

import { useEffect, useRef, useState } from "react";
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

export default function ContactForm() {
  const ref = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-contact-reveal]", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name || "website"}`);
    const body = encodeURIComponent(
      `${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`,
    );
    window.location.href = `mailto:${business.email}?subject=${subject}&body=${body}`;
  };

  const field =
    "w-full rounded-xl border border-ink/15 bg-foam px-4 py-3 text-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink/40 focus:border-forest";

  return (
    <section id="contact" ref={ref} className="bg-cream px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          {/* form */}
          <div data-contact-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-caramel">
              ✺ Get in touch
            </p>
            <h2 className="mt-5 font-display text-4xl leading-tight tracking-tight text-ink md:text-6xl">
              Contact <em className="font-light text-forest">us</em>
            </h2>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`mt-2 ${field}`}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`mt-2 ${field}`}
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`mt-2 resize-none ${field}`}
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-forest px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors duration-300 hover:bg-gold hover:text-forest-deep"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* info panel */}
          <div
            data-contact-reveal
            className="rounded-3xl border border-ink/10 bg-forest p-8 text-foam md:p-10"
          >
            <div className="space-y-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
                  Email Us
                </p>
                <a
                  href={`mailto:${business.email}`}
                  className="link-line mt-2 inline-block text-sm break-words text-foam/90"
                >
                  {business.email}
                </a>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
                  Contact Us
                </p>
                <a
                  href={`tel:${business.phone.replace(/\s/g, "")}`}
                  className="link-line mt-2 inline-block text-sm text-foam/90"
                >
                  {business.phone}
                </a>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
                  Follow
                </p>
                <div className="mt-3 flex gap-4">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="link-line font-mono text-[11px] uppercase tracking-[0.15em] text-foam/80"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
                  Visit Us
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-foam/90">
                  {business.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* map */}
        <a
          data-contact-reveal
          href={business.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="group relative mt-10 block aspect-[21/9] overflow-hidden rounded-3xl border border-ink/10"
        >
          <Image
            src="/images/contact-map.jpg"
            alt={`Map to ${business.name}`}
            fill
            sizes="(min-width: 768px) 72rem, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-5 left-5 rounded-full bg-forest-deep/90 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-foam backdrop-blur-sm">
            Open in maps ↗
          </span>
        </a>
      </div>
    </section>
  );
}
