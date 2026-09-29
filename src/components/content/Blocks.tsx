"use client";

import type { ReactNode } from "react";
import { Button, Heading, Label, Photo, Reveal, Section } from "../motion/primitives";
import { cn } from "@/lib/utils";

export function PageHero({ eyebrow, title, lead, image, children }: { eyebrow: string; title: string; lead?: string; image?: string; children?: ReactNode }) {
  return (
    <section className="bg-page">
      <div className={cn("mx-auto grid max-w-[1440px] gap-10 px-5 pb-16 pt-12 md:px-10 md:pb-24", image && "lg:grid-cols-12 lg:gap-16")}>
        <div className={cn("flex flex-col justify-end", image ? "lg:col-span-6" : "max-w-4xl")}>
          <Reveal>
            <Label>{eyebrow}</Label>
            <Heading as="h1" className="mt-6 text-[clamp(3rem,6vw,6rem)]">{title}</Heading>
            {lead && <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-graphite">{lead}</p>}
            {children && <div className="mt-10">{children}</div>}
          </Reveal>
        </div>
        {image && (
          <div className="lg:col-span-5 lg:col-start-8">
            <Photo src={image} alt={title} priority className="aspect-[4/5]" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        )}
      </div>
    </section>
  );
}

export function Split({ eyebrow, title, children, image, flip, tone = "page" }: { eyebrow?: string; title: string; children: ReactNode; image: string; flip?: boolean; tone?: "page" | "stone" | "paper" }) {
  return (
    <Section tone={tone} className="py-24 md:py-32">
      <div className={cn("grid items-center gap-12 lg:grid-cols-12 lg:gap-16", flip && "lg:[&>*:first-child]:order-2")}>
        <Reveal className="lg:col-span-6">
          <Photo src={image} alt={title} className="aspect-[4/5]" />
        </Reveal>
        <div className={cn("lg:col-span-5", flip ? "" : "lg:col-start-8")}>
          {eyebrow && <Label>{eyebrow}</Label>}
          <Heading className="mt-4 text-[clamp(2.2rem,3.6vw,3.4rem)]">{title}</Heading>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-graphite">{children}</div>
        </div>
      </div>
    </Section>
  );
}

export function Statement({ children, cite }: { children: string; cite?: string }) {
  return (
    <Section tone="paper" className="py-24 md:py-36">
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="font-display text-[clamp(1.9rem,3.2vw,3rem)] leading-[1.2]">{children}</p>
        {cite && <p className="mt-8 text-[12px] uppercase tracking-[0.18em] text-muted">{cite}</p>}
      </Reveal>
    </Section>
  );
}

export function FactGrid({ items }: { items: { k: string; v: string; d?: string }[] }) {
  return (
    <Section className="py-16">
      <div className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <div key={it.k} className={cn("py-10 sm:px-8", i > 0 && "border-t border-line sm:border-t-0 sm:border-l", i === 0 && "sm:pl-0")}>
            <p className="text-[12px] text-muted">{it.k}</p>
            <p className="mt-3 font-display text-5xl">{it.v}</p>
            {it.d && <p className="mt-2 text-[13px] text-graphite">{it.d}</p>}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function CTABand({ title, href, label, sub }: { title: string; href: string; label: string; sub?: string }) {
  return (
    <Section tone="stone" className="py-24 text-center md:py-32">
      <Heading className="mx-auto max-w-3xl text-[clamp(2.2rem,3.6vw,3.4rem)]">{title}</Heading>
      {sub && <p className="mx-auto mt-4 max-w-lg text-[15px] text-graphite">{sub}</p>}
      <Button href={href} size="lg" className="mt-10">{label}</Button>
    </Section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-5 pb-24 text-[17px] leading-[1.8] text-graphite md:px-0 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-ink">
      {children}
    </div>
  );
}
