"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Button, Heading, Label, Reveal, Section, type Tone } from "../motion/primitives";
import { cn } from "@/lib/utils";

/** "A *b*" → the starred part is set in the secondary tone (two-tone headline). */
function TwoTone({ text, dark }: { text: string; dark?: boolean }) {
  return (
    <>
      {text.split("*").map((p, i) =>
        i % 2 ? (
          <span key={i} className={dark ? "text-rose" : "bg-gradient-to-r from-[#b5523b] to-[#7a2c1c] bg-clip-text text-transparent"}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function PageHero({ eyebrow, title, lead, image, children }: { eyebrow: string; title: string; lead?: string; image?: string; children?: ReactNode }) {
  if (!image) {
    return (
      <Section tone="blush" className="pb-20 pt-16 md:pb-28 md:pt-24">
        <Label>{eyebrow}</Label>
        <Heading as="h1" className="mt-6 max-w-5xl text-[clamp(3rem,7vw,7.4rem)] font-extralight">
          <TwoTone text={title} />
        </Heading>
        {lead && <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-graphite">{lead}</p>}
        {children && <div className="mt-10">{children}</div>}
      </Section>
    );
  }
  return (
    <section className="blush-glow grid gap-3 px-3 pb-3 md:px-6 lg:min-h-[calc(100svh-112px)] lg:grid-cols-2">
      <div className="flex flex-col justify-end px-3 pb-14 pt-10 md:px-6 lg:pb-16">
        <Label>{eyebrow}</Label>
        <Reveal>
          <Heading as="h1" className="mt-6 text-[clamp(3rem,5.8vw,6.6rem)] font-extralight">
            <TwoTone text={title} />
          </Heading>
          {lead && <p className="mt-8 max-w-lg text-[16px] leading-relaxed text-graphite">{lead}</p>}
          {children && <div className="mt-10">{children}</div>}
        </Reveal>
      </div>
      <div className="relative min-h-[60svh] overflow-hidden rounded-[32px] md:rounded-[44px]">
        <Image src={image} alt={title.replace(/\*/g, "")} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
    </section>
  );
}

/** 50/50: a rounded photograph floating on one side, text on the other. */
export function Split({ eyebrow, title, children, image, flip, tone = "page" }: { eyebrow?: string; title: string; children: ReactNode; image: string; secondImage?: string; flip?: boolean; tone?: Tone }) {
  const dark = tone === "maroon" || tone === "cocoa" || tone === "clay" || tone === "vermilion";
  const bg = { page: "bg-page", paper: "bg-paper", stone: "bg-stone", blush: "blush-glow", vermilion: "bg-vermilion text-cream", clay: "night-glow text-cream", maroon: "night-glow text-cream", cocoa: "night-glow text-cream" }[tone];
  return (
    <section className={cn("grid gap-3 p-3 md:p-6 lg:grid-cols-2", bg)}>
      <div className={cn("relative min-h-[70svh] overflow-hidden rounded-[32px] md:rounded-[44px] lg:min-h-[86svh]", flip && "lg:order-2")}>
        <Image src={image} alt={title.replace(/\*/g, "")} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center px-3 py-16 md:px-14">
        {eyebrow && <Label className={dark ? "text-rose" : undefined}>{eyebrow}</Label>}
        <Heading className="mt-5 max-w-xl text-[clamp(2.2rem,3.6vw,3.8rem)]">
          <TwoTone text={title} dark={dark} />
        </Heading>
        <div className={cn("mt-7 max-w-lg space-y-4 text-[15px] leading-relaxed", dark ? "text-cream/80" : "text-graphite")}>{children}</div>
      </div>
    </section>
  );
}

export function Statement({ children, cite }: { children: string; cite?: string }) {
  return (
    <Section tone="maroon" className="grain overflow-hidden py-28 md:py-40" dark>
      <Reveal className="max-w-5xl">
        <p className="font-display text-[clamp(2.2rem,4.6vw,4.8rem)] font-extralight leading-[1.06] tracking-[-0.035em]">
          <TwoTone text={children} dark />
        </p>
        {cite && <p className="mt-10 text-[12px] font-semibold uppercase tracking-[0.2em] text-rose">{cite}</p>}
      </Reveal>
    </Section>
  );
}

export function FactGrid({ items }: { items: { k: string; v: string; d?: string }[] }) {
  return (
    <Section className="py-20">
      <div className="grid gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.k} delay={i * 0.06} className="rounded-[28px] bg-stone p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{it.k}</p>
            <p className="mt-6 font-display text-[clamp(2.8rem,4vw,4rem)] font-extralight leading-none tracking-[-0.05em]">{it.v}</p>
            {it.d && <p className="mt-3 text-[13px] text-graphite">{it.d}</p>}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function CTABand({ title, href, label, sub }: { title: string; href: string; label: string; sub?: string }) {
  return (
    <Section className="pb-36 pt-10 md:pb-44">
      <div data-nav="dark" className="grain night-glow relative flex flex-col justify-between gap-10 overflow-hidden rounded-[36px] p-8 text-cream md:flex-row md:items-end md:rounded-[48px] md:p-16">
        <div className="relative">
          <Heading className="max-w-3xl text-[clamp(2.4rem,4.4vw,4.6rem)]">
            <TwoTone text={title} dark />
          </Heading>
          {sub && <p className="mt-5 max-w-lg text-[15px] text-cream/75">{sub}</p>}
        </div>
        <Button href={href} variant="light" size="lg" arrow className="relative">
          {label}
        </Button>
      </div>
    </Section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-5 pb-28 text-[17px] leading-[1.8] text-graphite md:px-0 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-4xl [&_h2]:font-light [&_h2]:tracking-[-0.03em] [&_h2]:text-ink">
      {children}
    </div>
  );
}
