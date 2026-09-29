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
          <span key={i} className={dark ? "text-white/55" : "text-muted"}>
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
      <Section className="pb-20 pt-20 md:pb-28 md:pt-28">
        <Label>{eyebrow}</Label>
        <Heading as="h1" className="mt-6 max-w-5xl text-[clamp(2.8rem,6vw,6.4rem)]">
          <TwoTone text={title} />
        </Heading>
        {lead && <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-graphite">{lead}</p>}
        {children && <div className="mt-10">{children}</div>}
      </Section>
    );
  }
  return (
    <section className="grid border-b border-line lg:min-h-[calc(100svh-97px)] lg:grid-cols-2">
      <div className="flex flex-col justify-end px-5 pb-14 pt-16 md:px-10 lg:pb-20">
        <Label>{eyebrow}</Label>
        <Reveal>
          <Heading as="h1" className="mt-6 text-[clamp(2.8rem,5.4vw,6rem)]">
            <TwoTone text={title} />
          </Heading>
          {lead && <p className="mt-8 max-w-lg text-[16px] leading-relaxed text-graphite">{lead}</p>}
          {children && <div className="mt-10">{children}</div>}
        </Reveal>
      </div>
      <div className="relative min-h-[60svh]">
        <Image src={image} alt={title.replace(/\*/g, "")} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
    </section>
  );
}

/** Full-height 50/50: photograph on one side, text on a quiet field on the other. */
export function Split({ eyebrow, title, children, image, flip, tone = "page" }: { eyebrow?: string; title: string; children: ReactNode; image: string; secondImage?: string; flip?: boolean; tone?: Tone }) {
  const dark = tone === "maroon" || tone === "cocoa" || tone === "clay" || tone === "vermilion";
  const bg = { page: "bg-white", paper: "bg-white", stone: "bg-stone", blush: "bg-stone", vermilion: "bg-vermilion text-white", clay: "bg-ink text-white", maroon: "bg-ink text-white", cocoa: "bg-ink text-white" }[tone];
  return (
    <section className={cn("grid lg:grid-cols-2", bg)}>
      <div className={cn("relative min-h-[70svh] lg:min-h-[90svh]", flip && "lg:order-2")}>
        <Image src={image} alt={title.replace(/\*/g, "")} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center px-5 py-20 md:px-16">
        {eyebrow && <Label className={dark ? "text-white/75" : undefined}>{eyebrow}</Label>}
        <Heading className="mt-5 max-w-xl text-[clamp(2.2rem,3.6vw,3.8rem)]">
          <TwoTone text={title} dark={dark} />
        </Heading>
        <div className={cn("mt-7 max-w-lg space-y-4 text-[15px] leading-relaxed", dark ? "text-white/85" : "text-graphite")}>{children}</div>
      </div>
    </section>
  );
}

export function Statement({ children, cite }: { children: string; cite?: string }) {
  return (
    <Section tone="vermilion" className="py-28 md:py-40">
      <Reveal className="max-w-5xl">
        <p className="font-display text-[clamp(2rem,4.2vw,4.4rem)] font-[400] leading-[1.08] tracking-[-0.025em]">
          <TwoTone text={children} dark />
        </p>
        {cite && <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">{cite}</p>}
      </Reveal>
    </Section>
  );
}

export function FactGrid({ items }: { items: { k: string; v: string; d?: string }[] }) {
  return (
    <Section className="py-20">
      <div className="grid border-y border-ink sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.k} delay={i * 0.05} className={cn("py-10 sm:px-8", i > 0 && "border-t border-line sm:border-l sm:border-t-0", i === 0 && "sm:pl-0")}>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{it.k}</p>
            <p className="mt-4 font-display text-[clamp(2.8rem,4vw,4rem)] font-[400] leading-none tracking-[-0.04em]">{it.v}</p>
            {it.d && <p className="mt-3 text-[13px] text-graphite">{it.d}</p>}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function CTABand({ title, href, label, sub }: { title: string; href: string; label: string; sub?: string }) {
  return (
    <Section tone="stone" className="py-24 md:py-32">
      <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
        <div>
          <Heading className="max-w-3xl text-[clamp(2.4rem,4.4vw,4.6rem)]">
            <TwoTone text={title} />
          </Heading>
          {sub && <p className="mt-5 max-w-lg text-[15px] text-graphite">{sub}</p>}
        </div>
        <Button href={href} variant="vermilion" size="lg">
          {label}
        </Button>
      </div>
    </Section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-5 pb-28 text-[17px] leading-[1.8] text-graphite md:px-0 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-[450] [&_h2]:tracking-[-0.02em] [&_h2]:text-ink">
      {children}
    </div>
  );
}
