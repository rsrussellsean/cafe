"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { branches, business } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { label: "Instagram", href: business.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: business.social.facebook, Icon: FacebookIcon },
  { label: "TikTok", href: business.social.tiktok, Icon: TikTokIcon },
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
    "w-full border-b border-ink/20 bg-transparent pb-3 text-base text-ink outline-none transition-colors duration-300 placeholder:text-ink/30 focus:border-forest";
  const label =
    "font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50";

  return (
    <section
      id="contact"
      ref={ref}
      className="overflow-hidden bg-cream px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-14 md:grid-cols-[1.25fr_1fr] md:gap-16">
          {/* form */}
          <div data-contact-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-caramel">
              ✺ Get in touch
            </p>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-ink md:text-7xl">
              Say <em className="font-light text-forest">hi</em> —
              <br />
              we&rsquo;re nearby.
            </h2>

            <form onSubmit={onSubmit} className="mt-12">
              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <label className={label} htmlFor="contact-name">
                    01 — Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`mt-3 ${field}`}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={label} htmlFor="contact-email">
                    02 — Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`mt-3 ${field}`}
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div className="mt-10">
                <label className={label} htmlFor="contact-message">
                  03 — Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`mt-3 resize-none ${field}`}
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="group mt-10 inline-flex items-center gap-3 rounded-full bg-forest px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-foam transition-colors duration-300 hover:bg-gold hover:text-forest-deep"
              >
                Send message
                <span
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </button>
            </form>
          </div>

          {/* receipt card */}
          <div
            data-contact-reveal
            className="receipt relative mx-auto w-full max-w-sm rotate-[1.5deg] bg-foam px-7 pb-10 pt-8 font-mono text-ink shadow-xl shadow-ink/10"
          >
            <p className="text-center text-xs font-medium tracking-[0.2em]">
              KAT &amp; PERRY&rsquo;S KITCHENETTE
            </p>
            <p className="mt-1 text-center text-[10px] tracking-[0.15em] text-ink/50">
              TISA · CEBU CITY ✺ CASUNTINGAN · MANDAUE
            </p>

            <div className="my-6 border-t border-dashed border-ink/30" />

            <dl className="space-y-5 text-[11px] tracking-[0.1em]">
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-ink/50">EMAIL</dt>
                <dd className="break-all text-right">
                  <a className="link-line" href={`mailto:${business.email}`}>
                    {business.email}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">PHONE</dt>
                <dd>
                  <a
                    className="link-line"
                    href={`tel:${business.phone.replace(/\s/g, "")}`}
                  >
                    {business.phone}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/50">HOURS</dt>
                <dd>OPEN DAILY</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink/50">FOLLOW</dt>
                <dd className="flex gap-2">
                  {socials.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-foam transition-colors duration-300 hover:bg-gold hover:text-forest-deep"
                    >
                      <Icon />
                    </a>
                  ))}
                </dd>
              </div>
              {branches.map((b) => (
                <div key={b.name} className="flex justify-between gap-4">
                  <dt className="shrink-0 text-ink/50">
                    {b.name.toUpperCase()}
                  </dt>
                  <dd className="max-w-48 text-right uppercase leading-relaxed">
                    <a className="link-line" href="#locations">
                      {b.address}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="my-6 border-t border-dashed border-ink/30" />

            <div
              className="mx-auto h-10 w-44"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #251a13 0 2px, transparent 2px 4px, #251a13 4px 7px, transparent 7px 9px)",
              }}
              aria-hidden
            />
            <p className="mt-4 text-center text-[10px] tracking-[0.3em] text-ink/60">
              THANK YOU ✺ COME AGAIN
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.6-1.5h1.4V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.5V21h3.1z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 5.82a3.6 3.6 0 0 1-1.7-2.82h-2.78v11.04a2.13 2.13 0 1 1-2.14-2.13c.22 0 .43.03.63.1V9.5a5 5 0 1 0 4.35 4.96V8.66a6.5 6.5 0 0 0 3.5 1.02V6.9a3.6 3.6 0 0 1-1.86-1.08z" />
    </svg>
  );
}
