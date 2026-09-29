"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Quiet fade-up on first view. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/** Line of display type that fades up as one unit (no per-word theatrics). */
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
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y, scale: 1 + speed * 2 }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Photograph through next/image (served from our own domain — reachable in mainland China).
 * Reveals with a clean upward wipe. The design is square; `shape` is accepted for compatibility.
 */
export function Photo({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  zoom = false,
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
  return (
    <div className={cn("relative overflow-hidden bg-sand", className)}>
      {src ? (
        <motion.div
          className="absolute inset-0"
          style={scale ? { scale } : undefined}
          initial={priority || scale ? false : { clipPath: "inset(100% 0 0 0)" }}
          whileInView={priority || scale ? undefined : { clipPath: "inset(0% 0 0 0)" }}
          viewport={{ once: true, margin: "-4% 0px" }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={src.startsWith("data:")}
            className={cn("object-cover", zoom && "transition-transform duration-[1.6s] ease-[var(--ease-lux)] group-hover:scale-[1.035]")}
            style={position ? { objectPosition: position } : undefined}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 grid place-items-center text-[11px] uppercase tracking-[0.2em] text-muted">Photography to follow</div>
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

/** Square, uppercase, quiet. Inverts on hover. */
export function Button({ children, href, variant = "solid", size = "md", className, onClick, type = "button", disabled, arrow }: BtnProps) {
  const sizes = { sm: "h-9 px-4", md: "h-12 px-7", lg: "h-14 px-9" };
  const variants = {
    solid: "bg-ink text-white border border-ink hover:bg-white hover:text-ink",
    vermilion: "bg-vermilion text-white border border-vermilion hover:bg-vermilion-deep hover:border-vermilion-deep",
    clay: "bg-vermilion text-white border border-vermilion hover:bg-vermilion-deep hover:border-vermilion-deep",
    outline: "border border-ink text-ink hover:bg-ink hover:text-white",
    light: "bg-white text-ink border border-white hover:bg-transparent hover:text-white",
    "ghost-light": "border border-white/60 text-white hover:bg-white hover:text-ink",
  };
  const cls = cn(
    "inline-flex items-center justify-center gap-3 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40",
    sizes[size],
    variants[variant],
    className,
  );
  const inner = (
    <>
      {children}
      {arrow && <span aria-hidden>→</span>}
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
  return <p className={cn("text-[11px] font-medium uppercase tracking-[0.18em] text-muted", className)}>{children}</p>;
}

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group relative inline-flex items-center gap-2 pb-1 text-[11px] font-medium uppercase tracking-[0.16em]", className)}>
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      <span className="absolute bottom-0 left-0 h-px w-full bg-current" />
    </Link>
  );
}

const TONES = {
  page: "bg-white text-ink",
  paper: "bg-white text-ink",
  stone: "bg-stone text-ink",
  blush: "bg-stone text-ink",
  vermilion: "bg-vermilion text-white",
  clay: "bg-ink text-white",
  maroon: "bg-ink text-white",
  cocoa: "bg-ink text-white",
};
export type Tone = keyof typeof TONES;

export function Section({ children, tone = "page", className, id, wide }: { children: ReactNode; tone?: Tone; className?: string; id?: string; wide?: boolean }) {
  return (
    <section id={id} className={cn(TONES[tone], className)}>
      <div className={cn("mx-auto px-5 md:px-10", wide ? "max-w-[1760px]" : "max-w-[1600px]")}>{children}</div>
    </section>
  );
}

/** Display type: grotesk, tight, sentence case. */
export function Heading({ children, className, as = "h2" }: { children: ReactNode; className?: string; as?: "h1" | "h2" | "h3" }) {
  const T = as;
  return <T className={cn("font-display font-[450] leading-[1.02] tracking-[-0.025em]", className)}>{children}</T>;
}

/** Kept for API compatibility; the Vermilion design uses no tickers. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  return <p className={className}>{items.join("  ·  ")}</p>;
}

/** Kept for API compatibility; renders nothing (no decorative badges in this design). */
export function Badge(props: { text: string; className?: string; center?: ReactNode }) {
  void props;
  return null;
}
