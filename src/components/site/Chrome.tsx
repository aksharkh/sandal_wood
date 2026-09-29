"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { MessageCircle, X } from "lucide-react";
import { useMaison, useT } from "@/lib/store";
import { Monogram } from "./Logo";
import { QrMark } from "./Footer";
import { EASE } from "../motion/primitives";

export function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  useEffect(() => {
    (window as unknown as { __lenis?: Lenis }).__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);
  return null;
}

/** Soft cursor: ember dot + trailing ring that swells over interactive elements. Desktop only. */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 180, damping: 22, mass: 0.5 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;
      setHover(!!el.closest("a, button, [role=button], input, select, textarea, label"));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <div className="hidden pointer-fine:block">
      <motion.div className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember" style={{ x, y }} />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50 mix-blend-difference"
        style={{ x: rx, y: ry }}
        animate={{ width: hover ? 56 : 30, height: hover ? 56 : 30, opacity: hover ? 1 : 0.6 }}
        transition={{ duration: 0.35, ease: EASE }}
      />
    </div>
  );
}

/** First-visit intro: growth rings draw, a counter runs, the curtain lifts. */
export function Preloader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    if (sessionStorage.getItem("sm-intro")) {
      raf = requestAnimationFrame(() => setShow(false));
      return () => cancelAnimationFrame(raf);
    }
    sessionStorage.setItem("sm-intro", "1");
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1900);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setShow(false), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <Monogram animate className="h-24 w-24 text-gold" />
          <p className="mt-8 font-display text-sm tracking-[0.6em] text-bone/70">SANTALUM MAISON</p>
          <p className="mt-2 text-[10px] tracking-[0.4em] text-gold/60">PTEROCARPUS SANTALINUS · 小叶紫檀</p>
          <p className="absolute bottom-10 right-10 font-display text-7xl font-light tabular-nums text-bone/80">{n}</p>
          <div className="absolute bottom-0 left-0 h-px bg-gold" style={{ width: `${n}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Floating concierge: WhatsApp for India, WeChat for China. */
export function Concierge() {
  const { zh } = useT();
  const content = useMaison((s) => s.content);
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-[55] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="glass w-72 rounded-3xl p-5 shadow-2xl shadow-black/60"
          >
            <p className="font-display text-xl">{zh ? "私人顾问" : "Private concierge"}</p>
            <p className="mt-1 text-xs text-bone/55">{zh ? "我们的顾问在工作时间内 10 分钟内回复。" : "An advisor replies within 10 minutes, 10am–8pm IST."}</p>
            <a href={`https://wa.me/${content.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-between rounded-2xl bg-jade/15 px-4 py-3 text-sm text-jade hover:bg-jade/25">
              WhatsApp <span className="text-xs text-bone/60">{content.whatsapp}</span>
            </a>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-bone/5 px-4 py-3">
              <QrMark className="h-14 w-14 rounded" seed={11} />
              <div className="text-sm">
                {zh ? "微信扫码" : "WeChat"}
                <p className="text-xs text-bone/50">ID: {content.wechat}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-santal text-bone shadow-xl shadow-santal/30 transition-transform hover:scale-105"
        aria-label="Concierge"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-santal/40 [animation-duration:3s]" />
        {open ? <X className="relative h-5 w-5" /> : <MessageCircle className="relative h-5 w-5" />}
      </button>
    </div>
  );
}
