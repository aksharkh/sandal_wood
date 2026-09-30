"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EXPO = [0.87, 0, 0.13, 1] as const;
export const OUT = [0.16, 1, 0.3, 1] as const;

/** Quiet fade-up on first view. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-6% 0px" }} transition={{ duration: 1, ease: EASE, delay }}>
      {children}
    </M>
  );
}

/** A line of type that rises out of a mask — the signature text entrance. */
export function MaskLine({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  // the mask (not the hidden line) is what gets observed, otherwise it could never come into view
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-5% 0px" });
  return (
    <span ref={ref} className={cn("block overflow-hidden pb-[0.12em]", className)}>
      <motion.span className="block" initial={{ y: "115%" }} animate={{ y: seen ? "0%" : "115%" }} transition={{ duration: 1.1, ease: OUT, delay }}>
        {children}
      </motion.span>
    </span>
  );
}

/** Kept for API compatibility: a line that rises as one unit. */
export function Words({ text, className, delay = 0, immediate = false }: { text: string; className?: string; delay?: number; immediate?: boolean }) {
  const trigger = immediate ? { animate: { opacity: 1, y: 0 } } : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };
  return (
    <motion.span className={cn("inline-block", className)} initial={{ opacity: 0, y: 12 }} {...trigger} transition={{ duration: 0.9, ease: EASE, delay }}>
      {text}
    </motion.span>
  );
}

export function Parallax({ children, speed = 0.08, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, (p) => `${(0.5 - p) * speed * 200}%`);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y, scale: 1 + speed * 2.4 }} className="relative h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Photograph through next/image (served from our own domain — reachable in mainland China).
 * Unveils with an upward wipe while the image settles from a slight zoom.
 */
export function Photo({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  zoom = false,
  shape,
  position,
  scale,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  zoom?: boolean;
  shape?: "rect" | "arch" | "circle" | "soft";
  position?: string;
  scale?: MotionValue<number>;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const seen = useInView(frame, { once: true, margin: "-4% 0px" });
  const still = priority || !!scale;
  const radius = shape === "circle" || shape === "arch" ? "rounded-full" : shape === "rect" ? "" : "rounded-[22px]";
  return (
    <div ref={frame} className={cn("relative isolate overflow-hidden bg-sand", radius, className)}>
      {src ? (
        <motion.div
          className="absolute inset-0"
          style={scale ? { scale } : undefined}
          initial={still ? false : { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 }}
          animate={still ? undefined : seen ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 } : { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 }}
          transition={{ duration: 1.2, ease: OUT }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={src.startsWith("data:")}
            className={cn("object-cover", zoom && "transition-transform duration-[1.6s] ease-[var(--ease-lux)] group-hover:scale-[1.05]")}
            style={position ? { objectPosition: position } : undefined}
          />
        </motion.div>
      ) : (
        <div className="cap absolute inset-0 grid place-items-center text-muted">Photography to follow</div>
      )}
    </div>
  );
}

export function ProductPhoto({ p, index = 0, className, sizes, alt }: { p: Product; index?: number; className?: string; sizes?: string; alt?: string; shape?: string }) {
  return <Photo src={p.images?.[index] ?? p.images?.[0]} alt={alt ?? p.name.en} className={className} sizes={sizes} zoom />;
}

type BtnProps = {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "light" | "clay" | "ghost-light" | "vermilion";
  size?: "md" | "lg" | "sm";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  arrow?: boolean;
};

/** Monospace label that rolls to its twin on hover; a colour plate wipes up behind it. */
export function Button({ children, href, variant = "solid", size = "md", className, onClick, type = "button", disabled, arrow }: BtnProps) {
  const sizes = { sm: "h-9 px-4 text-[13px]", md: "h-12 px-7", lg: "h-14 px-9 text-[15px]" };
  const variants = {
    solid: "bg-ink text-cream [--plate:var(--color-vermilion)]",
    vermilion: "bg-vermilion text-cream [--plate:var(--color-ink)]",
    clay: "bg-vermilion text-cream [--plate:var(--color-ink)]",
    outline: "border border-ink/30 text-ink hover:text-cream [--plate:var(--color-ink)]",
    light: "bg-cream text-ink [--plate:var(--color-copper)]",
    "ghost-light": "border border-cream/35 text-cream hover:text-ink [--plate:var(--color-cream)]",
  };
  const cls = cn(
    "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full text-[14px] font-medium transition-colors duration-500 disabled:pointer-events-none disabled:opacity-40",
    sizes[size],
    variants[variant],
    className,
  );
  const inner = (
    <>
      <span aria-hidden className="absolute inset-0 translate-y-full rounded-full bg-[var(--plate)] transition-transform duration-500 ease-[var(--ease-lux)] group-hover/btn:translate-y-0" />
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:-translate-y-full">{children}</span>
        <span aria-hidden className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-y-0">
          {children}
        </span>
      </span>
      {arrow && (
        <span aria-hidden className="relative transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-x-1">
          →
        </span>
      )}
    </>
  );
  return href ? (
    <Link href={href} className={cls} onClick={onClick}>
      {inner}
    </Link>
  ) : (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("cap inline-flex items-center gap-2.5 text-muted", className)}>
      <span aria-hidden className="h-2 w-2 rounded-full bg-vermilion" />
      {children}
    </p>
  );
}

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group/tl relative inline-flex items-center gap-2 pb-1.5 text-[14px] font-medium", className)}>
      {children}
      <span aria-hidden className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover/tl:translate-x-1">
        →
      </span>
      <span className="absolute bottom-0 left-0 h-px w-full origin-right bg-current transition-transform duration-500 ease-[var(--ease-expo)] group-hover/tl:scale-x-0" />
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform delay-200 duration-500 ease-[var(--ease-expo)] group-hover/tl:scale-x-100" />
    </Link>
  );
}

const TONES = {
  page: "bg-page text-ink",
  paper: "bg-paper text-ink",
  stone: "bg-stone text-ink",
  blush: "bg-stone text-ink",
  vermilion: "bg-forest text-cream",
  clay: "bg-night text-cream",
  maroon: "bg-night text-cream",
  cocoa: "bg-night text-cream",
};
export type Tone = keyof typeof TONES;

export function Section({ children, tone = "page", className, id, wide }: { children: ReactNode; tone?: Tone; className?: string; id?: string; wide?: boolean }) {
  return (
    <section id={id} className={cn("relative", TONES[tone], className)}>
      <div className={cn("relative mx-auto px-5 md:px-10", wide ? "max-w-[1800px]" : "max-w-[1640px]")}>{children}</div>
    </section>
  );
}

/** Display type: high-contrast serif, tight. */
export function Heading({ children, className, as = "h2" }: { children: ReactNode; className?: string; as?: "h1" | "h2" | "h3" }) {
  const T = as;
  return <T className={cn("font-display font-semibold leading-[0.96] tracking-[-0.035em]", className)}>{children}</T>;
}

/** Scroll-linked reading: each word inks in as the paragraph passes through the viewport. */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrollWord key={i} progress={scrollYProgress} a={i / words.length} b={(i + 1) / words.length}>
          {w}
        </ScrollWord>
      ))}
    </p>
  );
}
function ScrollWord({ children, progress, a, b }: { children: string; progress: MotionValue<number>; a: number; b: number }) {
  const opacity = useTransform(progress, (p) => 0.14 + 0.86 * Math.min(1, Math.max(0, (p - a) / (b - a))));
  return (
    <motion.span style={{ opacity }} className="mr-[0.24em] inline-block">
      {children}
    </motion.span>
  );
}

/** Element that leans toward the pointer, then springs back. */
export function Magnetic({ children, className, strength = 0.35 }: { children: ReactNode; className?: string; strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  return (
    <motion.div
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Endless line of display type; it speeds up and leans with the scroll. */
export function Marquee({ items, className, speed = 0.0018 }: { items: string[]; className?: string; speed?: number }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const v = useSpring(useVelocity(scrollY), { stiffness: 60, damping: 20 });
  const skew = useTransform(v, (n) => `${Math.max(-5, Math.min(5, n / 500))}deg`);
  useAnimationFrame((_, dt) => {
    const vel = v.get();
    const boost = 1 + Math.min(6, Math.abs(vel) / 300);
    let n = x.get() - speed * boost * Math.min(dt, 50) * (vel < -20 ? -1 : 1);
    if (n <= -50) n += 50;
    if (n > 0) n -= 50;
    x.set(n);
  });
  const tx = useTransform(x, (n) => `${n}%`);
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)} aria-hidden>
      <motion.div style={{ x: tx, skewX: skew }} className="inline-flex w-max">
        {[0, 1].map((k) => (
          <span key={k} className="inline-flex shrink-0">
            {items.map((t, i) => (
              <span key={i} className="inline-flex items-center">
                <span className={i % 2 ? "stroke" : undefined}>{t}</span>
                <span className="mx-[0.4em] inline-block h-[0.1em] w-[0.1em] rounded-full bg-current opacity-60" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/** Kept for API compatibility; renders nothing. */
export function Badge(props: { text: string; className?: string; center?: ReactNode }) {
  void props;
  return null;
}
