"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBag, peso } from "@/lib/bag-context";
import DeliveryButtons from "@/components/DeliveryButtons";
import ReserveButton from "@/components/ReserveButton";

gsap.registerPlugin(ScrollTrigger);

export default function OrderOnline() {
  const ref = useRef<HTMLElement>(null);
  const { count, total } = useBag();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-order-reveal]", {
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

  return (
    <section
      id="order-online"
      ref={ref}
      className="overflow-hidden bg-cream px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <div data-order-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-caramel">
              ✺ Order online
            </p>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-ink md:text-7xl">
              Have it <em className="font-light text-forest">delivered</em>.
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-ink/70 md:text-lg">
              Fill your bag from the menu, then send it over — our team picks it up
              and gets it moving.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
                Rather dine in?
              </p>
              <ReserveButton variant="ghost" className="!px-6 !py-3" />
            </div>
          </div>

          <div data-order-reveal>
            <div className="rounded-2xl border border-ink/10 bg-foam p-7 shadow-xl shadow-ink/5">
              <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
                <span>Your bag</span>
                <span className="tabular-nums text-ink">
                  {count} item{count === 1 ? "" : "s"} · ₱ {peso(total)}
                </span>
              </div>

              <div className="mt-6">
                <DeliveryButtons layout="stack" tone="light" />
              </div>

              <p className="mt-6 border-t border-ink/10 pt-4 font-mono text-[11px] leading-relaxed text-ink/55">
                These send your order to the cafe&rsquo;s ordering automation — they
                don&rsquo;t place an order inside the GrabFood or Foodpanda app, and
                nothing is charged here.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
