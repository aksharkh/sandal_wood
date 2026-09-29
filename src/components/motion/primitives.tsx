"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Quiet fade-up on first view. The only entrance motion used on the storefront. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/**
 * Photograph with a slow settle-in. Local files go through next/image (resized,
 * modern formats, served from our own domain — reachable from mainland China).
 */
export function Photo({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  zoom = false,
  position,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  zoom?: boolean;
  position?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-sand", className)}>
      {src ? (
        <motion.div
          className="absolute inset-0"
          initial={priority ? false : { scale: 1.05, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
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
            className={cn("object-cover", zoom && "transition-transform duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-[1.04]")}
            style={position ? { objectPosition: position } : undefined}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.2em] text-muted">Photography to follow</div>
      )}
    </div>
  );
}

export function ProductPhoto({ p, index = 0, className, sizes, alt }: { p: Product; index?: number; className?: string; sizes?: string; alt?: string }) {
  return <Photo src={p.images?.[index] ?? p.images?.[0]} alt={alt ?? p.name.en} className={className} sizes={sizes} zoom />;
}

type BtnProps = {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "light" | "clay";
  size?: "md" | "lg" | "sm";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

/** Rectangular, restrained. Colour inverts on hover — no sweeps, no glow. */
export function Button({ children, href, variant = "solid", size = "md", className, onClick, type = "button", disabled }: BtnProps) {
  const sizes = { sm: "h-9 px-4 text-[12px]", md: "h-12 px-7 text-[13px]", lg: "h-14 px-9 text-[13px]" };
  const variants = {
    solid: "bg-ink text-page border border-ink hover:bg-transparent hover:text-ink",
    outline: "border border-ink text-ink hover:bg-ink hover:text-page",
    light: "bg-page text-ink border border-page hover:bg-transparent hover:text-page",
    clay: "bg-clay text-paper border border-clay hover:bg-clay-deep hover:border-clay-deep",
  };
  const cls = cn(
    "inline-flex items-center justify-center gap-2.5 font-medium tracking-[0.02em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40",
    sizes[size],
    variants[variant],
    className,
  );
  return href ? (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  ) : (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/** Small uppercase label that sits above headings. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[11px] font-medium uppercase tracking-[0.18em] text-muted", className)}>{children}</p>;
}

/** Text link with an underline that draws in on hover. */
export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group relative inline-flex items-center gap-2 pb-1 text-[13px] font-medium", className)}>
      {children}
      <span aria-hidden>→</span>
      <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-25" />
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-100" />
    </Link>
  );
}

/** Section wrapper with consistent gutters and optional surface colour. */
export function Section({ children, tone = "page", className, id }: { children: ReactNode; tone?: "page" | "stone" | "paper" | "clay"; className?: string; id?: string }) {
  const tones = { page: "bg-page text-ink", stone: "bg-stone text-ink", paper: "bg-paper text-ink", clay: "bg-clay text-paper" };
  return (
    <section id={id} className={cn(tones[tone], className)}>
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">{children}</div>
    </section>
  );
}

export function Heading({ children, className, as = "h2" }: { children: ReactNode; className?: string; as?: "h1" | "h2" | "h3" }) {
  const T = as;
  return <T className={cn("font-display font-normal leading-[1.02] tracking-[-0.01em]", className)}>{children}</T>;
}
