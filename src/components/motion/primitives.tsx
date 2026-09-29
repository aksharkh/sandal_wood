"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade-up on first view. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/** Headline that rises word by word from behind a mask. CJK splits per character. */
export function Words({ text, className, delay = 0, immediate = false }: { text: string; className?: string; delay?: number; immediate?: boolean }) {
  const cjk = /[㐀-鿿]/.test(text);
  const parts = cjk ? Array.from(text) : text.split(" ");
  const trigger = immediate ? { animate: { y: "0%" } } : { whileInView: { y: "0%" }, viewport: { once: true, margin: "-6% 0px" } };
  return (
    <span className={className} aria-label={text}>
      {parts.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span className="inline-block" initial={{ y: "105%" }} {...trigger} transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.05 }}>
            {w}
            {!cjk && i < parts.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Vertical drift tied to scroll. Positive speed moves slower than the page. */
export function Parallax({ children, speed = 0.12, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Photograph served through next/image from our own domain (reachable in mainland China).
 * `shape` gives the temple-arch or circle frame that defines this design.
 */
export function Photo({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  zoom = false,
  shape = "rect",
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
  const shapes = { rect: "", arch: "arch", circle: "rounded-full", soft: "rounded-[28px]" };
  return (
    <div className={cn("relative overflow-hidden bg-sand", shapes[shape], className)}>
      {src ? (
        <motion.div
          className="absolute inset-0"
          style={scale ? { scale } : undefined}
          initial={priority || scale ? false : { scale: 1.08, opacity: 0 }}
          whileInView={priority || scale ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={src.startsWith("data:")}
            className={cn("object-cover", zoom && "transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.06]")}
            style={position ? { objectPosition: position } : undefined}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 grid place-items-center text-xs text-muted">Photography to follow</div>
      )}
    </div>
  );
}

export function ProductPhoto({ p, index = 0, className, sizes, alt, shape }: { p: Product; index?: number; className?: string; sizes?: string; alt?: string; shape?: "rect" | "arch" | "circle" | "soft" }) {
  return <Photo src={p.images?.[index] ?? p.images?.[0]} alt={alt ?? p.name.en} className={className} sizes={sizes} shape={shape} zoom />;
}

type BtnProps = {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "light" | "clay" | "ghost-light";
  size?: "md" | "lg" | "sm";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  arrow?: boolean;
};

/** Pill button; the arrow chip turns on hover. */
export function Button({ children, href, variant = "solid", size = "md", className, onClick, type = "button", disabled, arrow = false }: BtnProps) {
  const sizes = { sm: "h-9 pl-4 pr-4 text-[12px]", md: "h-12 pl-6 pr-6 text-[13px]", lg: "h-14 pl-7 pr-7 text-[14px]" };
  const variants = {
    solid: "bg-clay text-cream hover:bg-clay-deep",
    clay: "bg-clay text-cream hover:bg-clay-deep",
    outline: "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-cream",
    light: "bg-cream text-ink hover:bg-paper",
    "ghost-light": "border border-cream/40 text-cream hover:bg-cream hover:text-ink",
  };
  const cls = cn(
    "group inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40",
    sizes[size],
    arrow && size !== "sm" && "pr-2",
    variants[variant],
    className,
  );
  const inner = (
    <>
      {children}
      {arrow && (
        <span className={cn("grid place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45", size === "lg" ? "h-10 w-10" : "h-8 w-8", variant === "light" || variant === "outline" ? "bg-ink text-cream" : "bg-cream text-ink")}>
          <ArrowUpRight className="h-4 w-4" />
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
    <p className={cn("flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-muted", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </p>
  );
}

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group relative inline-flex items-center gap-2 pb-1 text-[13px] font-medium", className)}>
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" />
      <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-30" />
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-100" />
    </Link>
  );
}

const TONES = {
  page: "bg-page text-ink",
  stone: "bg-stone text-ink",
  paper: "bg-paper text-ink",
  blush: "bg-blush text-ink",
  clay: "bg-maroon text-cream",
  maroon: "bg-maroon text-cream",
  cocoa: "bg-cocoa text-cream",
};
export type Tone = keyof typeof TONES;

export function Section({ children, tone = "page", className, id, wide }: { children: ReactNode; tone?: Tone; className?: string; id?: string; wide?: boolean }) {
  return (
    <section id={id} className={cn(TONES[tone], className)}>
      <div className={cn("mx-auto px-5 md:px-10", wide ? "max-w-[1680px]" : "max-w-[1440px]")}>{children}</div>
    </section>
  );
}

export function Heading({ children, className, as = "h2" }: { children: ReactNode; className?: string; as?: "h1" | "h2" | "h3" }) {
  const T = as;
  return <T className={cn("font-display font-normal leading-[0.98] tracking-[-0.015em]", className)}>{children}</T>;
}

/** Infinite ticker of words. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (
    <span className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((w, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className={i % 2 ? "italic" : ""}>{w}</span>
          <span className="inline-block h-2 w-2 rotate-45 bg-current opacity-60" />
        </span>
      ))}
    </span>
  );
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)} aria-label={items.join(", ")}>
      <div className="flex w-max animate-marquee" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  );
}

/** Slowly rotating circular inscription with a centre glyph. */
export function Badge({ text, className, center }: { text: string; className?: string; center?: ReactNode }) {
  const id = `c${text.length}${text.charCodeAt(0)}`;
  return (
    <div className={cn("grid h-32 w-32 place-items-center rounded-full", !className?.includes("absolute") && "relative", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
        <defs>
          <path id={id} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        {/* textLength = circumference (2π·38 ≈ 238) so any inscription wraps the ring exactly once */}
        <text fontSize="7.4" fill="currentColor" style={{ textTransform: "uppercase" }}>
          <textPath href={`#${id}`} textLength="236" lengthAdjust="spacingAndGlyphs">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="relative">{center}</span>
    </div>
  );
}
