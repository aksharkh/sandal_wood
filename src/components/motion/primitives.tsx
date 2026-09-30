"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Soft rise with a touch of depth on first view. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/** Line of display type that rises as one unit. */
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
 * Soft large radius by default; reveals by settling from a slight zoom and blur.
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
  const radius = shape === "rect" ? "" : shape === "circle" ? "rounded-full" : "rounded-[24px]";
  return (
    <div className={cn("relative isolate overflow-hidden bg-sand", radius, className)}>
      {src ? (
        <motion.div
          className="absolute inset-0"
          style={scale ? { scale } : undefined}
          initial={priority || scale ? false : { scale: 1.12, opacity: 0 }}
          whileInView={priority || scale ? undefined : { scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-4% 0px" }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            unoptimized={src.startsWith("data:")}
            className={cn("object-cover", zoom && "transition-transform duration-[1.6s] ease-[var(--ease-lux)] group-hover:scale-[1.06]")}
            style={position ? { objectPosition: position } : undefined}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 grid place-items-center text-[11px] uppercase tracking-[0.2em] text-muted">Photography to follow</div>
      )}
    </div>
  );
}

export function ProductPhoto({ p, index = 0, className, sizes, alt, shape }: { p: Product; index?: number; className?: string; sizes?: string; alt?: string; shape?: string }) {
  return <Photo src={p.images?.[index] ?? p.images?.[0]} alt={alt ?? p.name.en} className={className} sizes={sizes} zoom shape={shape === "rect" ? "rect" : undefined} />;
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

/** Pill button. With `arrow`, the arrow sits in its own disc and slides through on hover. */
export function Button({ children, href, variant = "solid", size = "md", className, onClick, type = "button", disabled, arrow }: BtnProps) {
  const sizes = { sm: "h-9 px-4 text-[12px]", md: "h-12 px-6 text-[13px]", lg: "h-14 px-8 text-[14px]" };
  const variants = {
    solid: "bg-ink text-cream hover:bg-vermilion",
    vermilion: "bg-vermilion text-cream hover:bg-vermilion-deep",
    clay: "bg-vermilion text-cream hover:bg-vermilion-deep",
    outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream",
    light: "bg-cream text-ink hover:bg-white",
    "ghost-light": "glass-dark text-cream hover:bg-cream hover:text-ink",
  };
  const disc = variant === "light" || variant === "outline" ? "bg-ink/10" : "bg-white/15";
  const cls = cn(
    "group/btn inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-medium tracking-[0.01em] transition-colors duration-500 ease-[var(--ease-lux)] disabled:pointer-events-none disabled:opacity-40",
    sizes[size],
    arrow && (size === "sm" ? "pr-1.5" : "pr-2"),
    variants[variant],
    className,
  );
  const inner = (
    <>
      {children}
      {arrow && (
        <span aria-hidden className={cn("relative grid place-items-center overflow-hidden rounded-full", size === "sm" ? "h-6 w-6" : "h-8 w-8", disc)}>
          <span className="transition-transform duration-500 ease-[var(--ease-lux)] group-hover/btn:translate-x-7">→</span>
          <span className="absolute -translate-x-7 transition-transform duration-500 ease-[var(--ease-lux)] group-hover/btn:translate-x-0">→</span>
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
    <p className={cn("inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {children}
    </p>
  );
}

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group/tl relative inline-flex items-center gap-2 pb-1 text-[13px] font-medium", className)}>
      {children}
      <span aria-hidden className="transition-transform duration-500 ease-[var(--ease-lux)] group-hover/tl:translate-x-1">
        →
      </span>
      <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-25" />
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-700 ease-[var(--ease-lux)] group-hover/tl:scale-x-100" />
    </Link>
  );
}

const TONES = {
  page: "bg-page text-ink",
  paper: "bg-paper text-ink",
  stone: "bg-stone text-ink",
  blush: "blush-glow text-ink",
  vermilion: "bg-vermilion text-cream",
  clay: "night-glow text-cream",
  maroon: "night-glow text-cream",
  cocoa: "night-glow text-cream",
};
export type Tone = keyof typeof TONES;

export function Section({ children, tone = "page", className, id, wide, dark }: { children: ReactNode; tone?: Tone; className?: string; id?: string; wide?: boolean; dark?: boolean }) {
  const night = dark ?? (tone === "clay" || tone === "maroon" || tone === "cocoa" || tone === "vermilion");
  return (
    <section id={id} data-nav={night ? "dark" : undefined} className={cn("relative", TONES[tone], className)}>
      <div className={cn("relative mx-auto px-5 md:px-10", wide ? "max-w-[1760px]" : "max-w-[1560px]")}>{children}</div>
    </section>
  );
}

/** Display type: light geometric sans, tight, sentence case. */
export function Heading({ children, className, as = "h2" }: { children: ReactNode; className?: string; as?: "h1" | "h2" | "h3" }) {
  const T = as;
  return <T className={cn("font-display font-light leading-[1.02] tracking-[-0.035em]", className)}>{children}</T>;
}

/**
 * Scroll-linked reading: each word brightens from a faint ghost to full
 * as the paragraph passes through the viewport.
 */
export function ScrollWords({ text, className, dim = "opacity-[0.16]" }: { text: string; className?: string; dim?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <ScrollWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} dim={dim}>
          {w}
        </ScrollWord>
      ))}
    </p>
  );
}
function ScrollWord({ children, progress, range, dim }: { children: string; progress: MotionValue<number>; range: [number, number]; dim: string }) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mr-[0.26em] inline-block">
      <span className={dim}>{children}</span>
      <motion.span style={{ opacity }} className="absolute inset-0">
        {children}
      </motion.span>
    </span>
  );
}

/**
 * 3D tilt: the card leans toward the pointer with a soft specular glare.
 * CSS transforms only — cheap, and inert on touch devices.
 */
export function Tilt({ children, className, max = 8, glare = true }: { children: ReactNode; className?: string; max?: number; glare?: boolean }) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cfg = { stiffness: 150, damping: 18, mass: 0.6 };
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), cfg);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), cfg);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const bg = useMotionTemplate`radial-gradient(480px circle at ${gx} ${gy}, rgba(255,244,236,.35), transparent 45%)`;
  return (
    <div className={cn("[perspective:1200px]", className)}>
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        className="relative h-full rounded-[inherit] will-change-transform"
      >
        {children}
        {glare && <motion.div aria-hidden style={{ background: bg }} className="pointer-events-none absolute inset-0 z-10 rounded-[24px] mix-blend-soft-light" />}
      </motion.div>
    </div>
  );
}

/** Kept for API compatibility; the design uses no tickers. */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  return <p className={className}>{items.join("  ·  ")}</p>;
}

/** Kept for API compatibility; renders nothing (no decorative badges in this design). */
export function Badge(props: { text: string; className?: string; center?: ReactNode }) {
  void props;
  return null;
}
