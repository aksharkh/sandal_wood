"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { VisualKind } from "@/lib/types";
import { ProductVisual } from "../visual/ProductVisual";
import { EASE, Eyebrow, LuxButton, Parallax, Reveal, SplitReveal } from "../motion/primitives";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  lead,
  visual,
  tone = 0.45,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  visual?: VisualKind;
  tone?: number;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-20 pt-44 md:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_75%_30%,rgba(158,47,31,.32),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-[1600px] items-center gap-12 px-5 md:px-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE }}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </motion.div>
          <h1 className="mt-6 font-display text-[13vw] font-light leading-[0.92] tracking-[-0.015em] sm:text-7xl lg:text-[6.4vw]">
            <SplitReveal text={title} immediate delay={0.15} />
          </h1>
          {lead && (
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1.1, ease: EASE }} className="mt-8 max-w-xl text-[16px] leading-relaxed text-bone/60">
              {lead}
            </motion.p>
          )}
          {children && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-10">
              {children}
            </motion.div>
          )}
        </div>
        {visual && (
          <motion.div initial={{ opacity: 0, scale: 0.85, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.6, ease: EASE }} className="relative mx-auto aspect-square w-full max-w-[560px]">
            <div className="absolute inset-0 rounded-full border border-bone/[0.06]" />
            <div className="absolute inset-[8%] animate-spin-slow rounded-full border border-dashed border-gold/15" />
            <ProductVisual kind={visual} tone={tone} seed={88} className="absolute inset-[10%] animate-float" />
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function Split({
  eyebrow,
  title,
  children,
  visual,
  tone = 0.4,
  flip,
  light,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  visual: VisualKind;
  tone?: number;
  flip?: boolean;
  light?: boolean;
}) {
  return (
    <section className={cn(light && "bg-bone text-ink")}>
      <div className={cn("mx-auto grid max-w-[1600px] items-center gap-14 px-5 py-24 md:px-10 md:py-32 lg:grid-cols-2", flip && "lg:[&>*:first-child]:order-2")}>
        <Reveal>
          <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[32px]", light ? "bg-gradient-to-br from-santal via-oxblood to-ink" : "bg-gradient-to-br from-cocoa to-ink")}>
            <Parallax speed={0.1} className="absolute inset-0">
              <ProductVisual kind={visual} tone={tone} seed={60} className="h-full w-full scale-110" />
            </Parallax>
          </div>
        </Reveal>
        <div>
          {eyebrow && <Eyebrow className={light ? "text-santal [&>span]:bg-santal/60" : undefined}>{eyebrow}</Eyebrow>}
          <h2 className="mt-6 font-display text-4xl font-light leading-[1.04] md:text-6xl">
            <SplitReveal text={title} />
          </h2>
          <Reveal delay={0.15}>
            <div className={cn("mt-8 space-y-5 text-[15px] leading-relaxed", light ? "text-ink/65" : "text-bone/60")}>{children}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Statement({ children, cite }: { children: string; cite?: string }) {
  return (
    <section className="mx-auto max-w-[1300px] px-5 py-28 text-center md:px-10 md:py-40">
      <p className="font-display text-4xl font-light italic leading-[1.15] md:text-6xl">
        <SplitReveal text={children} stagger={0.03} />
      </p>
      {cite && (
        <Reveal delay={0.4}>
          <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-gold">{cite}</p>
        </Reveal>
      )}
    </section>
  );
}

export function FactGrid({ items }: { items: { k: string; v: string; d?: string }[] }) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10">
      <div className="grid gap-px overflow-hidden rounded-[28px] border border-bone/[0.07] bg-bone/[0.07] sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.k} delay={i * 0.08} className="bg-ink p-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-bone/40">{it.k}</p>
            <p className="mt-4 font-display text-4xl font-light text-gradient-gold">{it.v}</p>
            {it.d && <p className="mt-3 text-xs leading-relaxed text-bone/50">{it.d}</p>}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function CTABand({ title, href, label, sub }: { title: string; href: string; label: string; sub?: string }) {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
      <div className="relative overflow-hidden rounded-[36px] border border-bone/[0.07] bg-gradient-to-br from-oxblood via-cocoa to-ink px-8 py-16 text-center md:py-24">
        <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-ember/20 blur-[100px]" />
        <h2 className="relative mx-auto max-w-3xl font-display text-4xl font-light md:text-6xl">
          <SplitReveal text={title} />
        </h2>
        {sub && <p className="relative mx-auto mt-5 max-w-lg text-bone/60">{sub}</p>}
        <div className="relative mt-10">
          <LuxButton href={href} size="lg">{label}</LuxButton>
        </div>
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-3xl space-y-6 px-5 pb-24 text-[16px] leading-[1.85] text-bone/70 md:px-0 [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:text-bone [&_li]:ml-5 [&_li]:list-disc">{children}</div>;
}
