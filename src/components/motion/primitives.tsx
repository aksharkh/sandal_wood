"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform, type HTMLMotionProps } from "motion/react";
import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade/lift into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/** Splits a line into words that rise from a mask — the editorial headline effect. */
export function SplitReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}) {
  // CJK has no spaces — split per character so it still animates.
  const cjk = /[㐀-鿿]/.test(text);
  const parts = cjk ? Array.from(text) : text.split(" ");
  const anim = immediate ? { animate: { y: "0%" } } : { whileInView: { y: "0%" }, viewport: { once: true, margin: "-5% 0px" } };
  return (
    <span className={cn("inline", className)} aria-label={text}>
      {parts.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "110%" }}
            {...anim}
            transition={{ duration: 1.2, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
            {!cjk && i < parts.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Scroll-linked vertical drift. */
export function Parallax({ children, speed = 0.15, className }: { children: ReactNode; speed?: number; className?: string }) {
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

/** Button/link that leans toward the cursor. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
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

type BtnProps = {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "ghost" | "gold" | "light";
  size?: "md" | "lg" | "sm";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  magnetic?: boolean;
};

/** Primary call-to-action: pill with a liquid fill sweep on hover. */
export function LuxButton({ children, href, variant = "solid", size = "md", className, onClick, type = "button", disabled, magnetic = true }: BtnProps) {
  const base =
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium tracking-[0.18em] uppercase transition-[color,border-color,opacity] duration-500 ease-[var(--ease-lux)] disabled:pointer-events-none disabled:opacity-40";
  const sizes = { sm: "h-10 px-5 text-[10px]", md: "h-12 px-7 text-[11px]", lg: "h-14 px-9 text-[11px]" };
  const variants = {
    solid: "bg-santal text-bone hover:text-ink",
    gold: "bg-gold text-ink hover:text-bone",
    ghost: "border border-bone/25 text-bone hover:text-ink hover:border-bone",
    light: "bg-bone text-ink hover:text-bone",
  };
  const sweep = { solid: "bg-bone", gold: "bg-santal", ghost: "bg-bone", light: "bg-santal" };
  const inner = (
    <>
      <span className={cn("absolute inset-0 translate-y-[101%] rounded-full transition-transform duration-700 ease-[var(--ease-lux)] group-hover:translate-y-0", sweep[variant])} />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </>
  );
  const cls = cn(base, sizes[size], variants[variant], className);
  const el = href ? (
    <Link href={href} className={cls} onClick={onClick}>
      {inner}
    </Link>
  ) : (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
  return magnetic ? <Magnetic strength={0.2}>{el}</Magnetic> : el;
}

/** Small uppercase label with a leading hairline. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-gold", className)}>
      <span className="h-px w-8 bg-gold/60" />
      {children}
    </div>
  );
}

/** Underlined text link that draws its underline on hover. */
export function LineLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group relative inline-flex items-center gap-2 pb-1 text-[11px] uppercase tracking-[0.24em]", className)}>
      {children}
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 bg-current opacity-30" />
      <span className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-700 ease-[var(--ease-lux)] group-hover:origin-left group-hover:scale-x-100" />
    </Link>
  );
}

export function Tilt({ children, className, ...rest }: { children: ReactNode; className?: string } & HTMLMotionProps<"div">) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  return (
    <motion.div
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
