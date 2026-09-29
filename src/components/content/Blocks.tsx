"use client";

import type { ReactNode } from "react";
import { Badge, Button, Heading, Label, Parallax, Photo, Reveal, Section, Words, type Tone } from "../motion/primitives";
import { cn } from "@/lib/utils";

/** Renders "A *word* b" with the starred part in the accent italic. */
function Title({ text, accent = "text-clay" }: { text: string; accent?: string }) {
  const nodes = text
    .split("*")
    .map((p, i) => ({ p: p.trim(), i }))
    .filter(({ p }) => p)
    .map(({ p, i }) =>
      i % 2 ? (
        <em key={i} className={accent}>
          <Words text={p} immediate delay={0.2} />
        </em>
      ) : (
        <Words key={i} text={p} immediate delay={0.1} />
      ),
    );
  return <>{nodes.flatMap((el, i) => (i ? [" ", el] : [el]))}</>;
}

export function PageHero({ eyebrow, title, lead, image, children }: { eyebrow: string; title: string; lead?: string; image?: string; children?: ReactNode }) {
  return (
    <section className="overflow-hidden bg-page">
      <div className={cn("mx-auto grid max-w-[1440px] items-end gap-12 px-5 pb-20 pt-16 md:px-10 md:pb-28 md:pt-20", image && "lg:grid-cols-12 lg:gap-16")}>
        <div className={image ? "lg:col-span-7" : "max-w-5xl"}>
          <Label>{eyebrow}</Label>
          <Heading as="h1" className="mt-7 text-[clamp(3.2rem,7vw,7.4rem)]">
            <Title text={title} />
          </Heading>
          {lead && (
            <Reveal delay={0.3}>
              <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-graphite">{lead}</p>
            </Reveal>
          )}
          {children && <Reveal delay={0.4} className="mt-10">{children}</Reveal>}
        </div>
        {image && (
          <div className="relative mx-auto w-full max-w-[460px] lg:col-span-5">
            <Photo src={image} alt={title.replace(/\*/g, "")} shape="arch" priority className="aspect-[3/4]" sizes="(min-width: 1024px) 36vw, 90vw" />
            <Badge text="Santalum Maison · 小叶紫檀 · India · " className="absolute -bottom-6 -left-6 bg-page text-graphite" center={<span className="h-2 w-2 rounded-full bg-clay" />} />
          </div>
        )}
      </div>
    </section>
  );
}

export function Split({
  eyebrow,
  title,
  children,
  image,
  secondImage,
  flip,
  tone = "page",
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  image: string;
  secondImage?: string;
  flip?: boolean;
  tone?: Tone;
}) {
  const dark = tone === "maroon" || tone === "cocoa" || tone === "clay";
  const ring = { page: "border-page", stone: "border-stone", paper: "border-paper", blush: "border-blush", maroon: "border-maroon", clay: "border-maroon", cocoa: "border-cocoa" }[tone];
  const parts = title.split("*");
  return (
    <Section tone={tone} className="overflow-hidden py-28 md:py-36">
      <div className={cn("grid items-center gap-16 lg:grid-cols-12 lg:gap-20", flip && "lg:[&>*:first-child]:order-2")}>
        <div className="relative mx-auto w-full max-w-[520px] lg:col-span-6">
          <Parallax speed={0.05}>
            <Photo src={image} alt={title.replace(/\*/g, "")} shape="arch" className="aspect-[3/4] w-[84%]" />
          </Parallax>
          {secondImage && (
            <Parallax speed={0.2} className="absolute -bottom-6 right-0 w-[42%]">
              <Photo src={secondImage} alt="" shape="circle" className={cn("aspect-square border-[10px]", ring)} sizes="240px" />
            </Parallax>
          )}
        </div>
        <div className="lg:col-span-5">
          {eyebrow && <Label className={dark ? "text-rose" : undefined}>{eyebrow}</Label>}
          <Heading className="mt-6 text-[clamp(2.6rem,4.6vw,4.6rem)]">
            {parts.map((p, i) => (i % 2 ? <em key={i} className={dark ? "text-ember" : "text-clay"}>{p}</em> : <span key={i}>{p}</span>))}
          </Heading>
          <div className={cn("mt-7 space-y-4 text-[16px] leading-relaxed", dark ? "text-rose" : "text-graphite")}>{children}</div>
        </div>
      </div>
    </Section>
  );
}

export function Statement({ children, cite }: { children: string; cite?: string }) {
  const parts = children.split("*");
  return (
    <Section tone="maroon" className="py-28 md:py-40">
      <Reveal className="mx-auto max-w-5xl text-center">
        <p className="font-display text-[clamp(2.2rem,4.4vw,4.4rem)] leading-[1.08]">
          {parts.map((p, i) => (i % 2 ? <em key={i} className="text-ember">{p}</em> : <span key={i}>{p}</span>))}
        </p>
        {cite && <p className="mt-8 text-[12px] uppercase tracking-[0.22em] text-rose">{cite}</p>}
      </Reveal>
    </Section>
  );
}

export function FactGrid({ items }: { items: { k: string; v: string; d?: string }[] }) {
  return (
    <Section className="py-20">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.k} delay={i * 0.06} className="flex aspect-square flex-col items-center justify-center rounded-full bg-stone p-8 text-center">
            <p className="text-[12px] uppercase tracking-[0.18em] text-muted">{it.k}</p>
            <p className="mt-3 font-display text-6xl">{it.v}</p>
            {it.d && <p className="mt-2 max-w-[180px] text-[13px] text-graphite">{it.d}</p>}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function CTABand({ title, href, label, sub }: { title: string; href: string; label: string; sub?: string }) {
  const parts = title.split("*");
  return (
    <section className="bg-page px-3 pb-28 md:px-5 md:pb-36">
      <div className="mx-auto max-w-[1680px] rounded-[48px] bg-maroon px-6 py-24 text-center text-cream md:rounded-[64px] md:py-32">
        <Heading className="mx-auto max-w-4xl text-[clamp(2.8rem,5.4vw,5.6rem)]">
          {parts.map((p, i) => (i % 2 ? <em key={i} className="text-ember">{p}</em> : <span key={i}>{p}</span>))}
        </Heading>
        {sub && <p className="mx-auto mt-5 max-w-lg text-[16px] text-rose">{sub}</p>}
        <Button href={href} variant="light" size="lg" arrow className="mt-10">
          {label}
        </Button>
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-5 pb-28 text-[18px] leading-[1.8] text-graphite md:px-0 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-4xl [&_h2]:text-ink">
      {children}
    </div>
  );
}
