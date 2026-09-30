"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";
import { useMaison, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { EXPO } from "../motion/primitives";
import { cn } from "@/lib/utils";
import type { Currency } from "@/lib/types";
import type { DictKey } from "@/lib/i18n";

const MENU: { href: string; key: DictKey; img: string }[] = [
  { href: "/collections", key: "nav.collections", img: "/images/p-mala-red.jpg" },
  { href: "/maison", key: "nav.maison", img: "/images/e-temple-tower.jpg" },
  { href: "/material", key: "nav.material", img: "/images/e-grain-rich.jpg" },
  { href: "/craft", key: "nav.craft", img: "/images/e-chisel.jpg" },
  { href: "/provenance", key: "nav.provenance", img: "/images/e-hills-mist.jpg" },
  { href: "/gifting", key: "nav.gifting", img: "/images/p-wedding.jpg" },
  { href: "/journal", key: "nav.journal", img: "/images/e-smoke.jpg" },
];
const MORE: { href: string; key: DictKey }[] = [
  { href: "/founder", key: "nav.founder" },
  { href: "/sourcing", key: "nav.sourcing" },
  { href: "/science", key: "nav.science" },
  { href: "/enquiries", key: "nav.enquiries" },
  { href: "/account", key: "nav.account" },
];

/**
 * A thin bar set in difference blend, so it reads as light type over dark fields and
 * dark type over paper without any state. It tucks away on the way down the page and
 * returns on the way up. Navigation lives in a full-screen index.
 */
export function Header() {
  const { t, locale, currency } = useT();
  const pathname = usePathname();
  const cartCount = useShop((s) => s.cart.reduce((n, x) => n + x.qty, 0));
  const setBagOpen = useShop((s) => s.setBagOpen);
  const setSearchOpen = useShop((s) => s.setSearchOpen);
  const setLocale = useShop((s) => s.setLocale);
  const setCurrency = useShop((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 200 && y > prev);
  });

  return (
    <>
      <header className={cn("pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference transition-transform duration-700 ease-[var(--ease-expo)]", hidden && !open && "-translate-y-full")}>
        <nav className="cap pointer-events-auto mx-auto flex h-[72px] max-w-[1800px] items-center justify-between gap-6 px-5 font-medium md:px-10 [&_button]:uppercase">
          <Link href="/" aria-label="Santalum Maison — home">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {MENU.slice(0, 4).map((m) => (
              <li key={m.href}>
                <Link href={m.href} className={cn("relative py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:scale-x-100", pathname.startsWith(m.href) && "after:scale-x-100")}>
                  {t(m.key)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5 md:gap-6">
            <span className="hidden items-center gap-1.5 xl:flex">
              {(["en", "zh"] as const).map((lc, i) => (
                <span key={lc} className="flex items-center gap-1.5">
                  {i > 0 && <span className="opacity-40">/</span>}
                  <button onClick={() => setLocale(lc)} className={locale === lc ? "" : "opacity-50 hover:opacity-100"}>
                    {lc === "en" ? "EN" : "中文"}
                  </button>
                </span>
              ))}
            </span>
            <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="hidden cursor-pointer appearance-none bg-transparent uppercase outline-none xl:block">
              <option className="text-black" value="INR">INR ₹</option>
              <option className="text-black" value="CNY">CNY ¥</option>
              <option className="text-black" value="USD">USD $</option>
            </select>
            <button onClick={() => setSearchOpen(true)} className="hidden hover:opacity-60 md:block">
              {t("nav.search")}
            </button>
            <button onClick={() => setBagOpen(true)} className="hover:opacity-60">
              {t("nav.bag")} <span className="tabular-nums">({cartCount})</span>
            </button>
            <button onClick={() => setOpen(true)} className="flex items-center gap-2.5" aria-label="Open menu">
              <span className="hidden sm:inline">Menu</span>
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-6 bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </header>
      {/* spacer so non-hero pages start below the bar */}
      {pathname !== "/" && <div className="h-[72px]" aria-hidden />}

      <Index open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Index({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, l, zh, locale } = useT();
  const pathname = usePathname();
  const setLocale = useShop((s) => s.setLocale);
  const setCurrency = useShop((s) => s.setCurrency);
  const currency = useShop((s) => s.currency);
  const content = useMaison((s) => s.content);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-night text-cream"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease: EXPO }}
          data-lenis-prevent
        >
          <div className="cap mx-auto flex h-[72px] w-full max-w-[1800px] shrink-0 items-center justify-between px-5 font-medium md:px-10">
            <Link href="/" onClick={onClose}>
              <Wordmark />
            </Link>
            <button onClick={onClose} className="flex items-center gap-2.5 uppercase" aria-label="Close menu">
              {zh ? "关闭" : "Close"}
              <span className="relative block h-6 w-6">
                <span className="absolute left-0 top-1/2 block h-px w-6 rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 block h-px w-6 -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <div className="mx-auto grid w-full max-w-[1800px] flex-1 gap-10 overflow-y-auto px-5 pb-8 md:px-10 lg:grid-cols-12">
            <ul className="lg:col-span-7">
              {MENU.map((m, i) => (
                <li key={m.href} className="overflow-hidden border-b border-cream/15" onMouseEnter={() => setActive(i)}>
                  <motion.div initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: EXPO, delay: 0.25 + i * 0.05 }}>
                    <Link href={m.href} onClick={onClose} className="group flex items-baseline gap-5 py-3 md:py-4">
                      <span className="cap w-8 text-rose">{String(i + 1).padStart(2, "0")}</span>
                      <span className={cn("font-display text-[clamp(2.4rem,6.4vh,5.2rem)] leading-none tracking-[-0.03em] transition-[color,transform] duration-500 ease-[var(--ease-expo)] group-hover:translate-x-4", active === i ? "text-cream" : "text-cream/45", pathname.startsWith(m.href) && "italic")}>
                        {t(m.key)}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <div className="hidden lg:col-span-4 lg:col-start-9 lg:flex lg:flex-col">
              <div className="relative flex-1 overflow-hidden">
                {MENU.map((m, i) => (
                  <Image key={m.href} src={m.img} alt="" fill sizes="33vw" className={cn("object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-lux)]", active === i ? "scale-100 opacity-100" : "scale-110 opacity-0")} />
                ))}
              </div>
              <ul className="cap mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-rose">
                {COLLECTIONS.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/collections/${c.slug}`} onClick={onClose} className="hover:text-cream">
                      {l(c.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="cap mx-auto flex w-full max-w-[1800px] shrink-0 flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-cream/15 px-5 py-5 text-rose md:px-10">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {MORE.map((m) => (
                <Link key={m.href} href={m.href} onClick={onClose} className="hover:text-cream">
                  {t(m.key)}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <span className="flex gap-3">
                {(["en", "zh"] as const).map((lc) => (
                  <button key={lc} onClick={() => setLocale(lc)} className={cn("uppercase", locale === lc ? "text-cream underline underline-offset-4" : "hover:text-cream")}>
                    {lc === "en" ? "English" : "中文"}
                  </button>
                ))}
              </span>
              <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="bg-transparent uppercase text-cream outline-none" aria-label="Currency">
                <option className="text-black" value="INR">INR ₹</option>
                <option className="text-black" value="CNY">CNY ¥</option>
                <option className="text-black" value="USD">USD $</option>
              </select>
              <span className="hidden md:inline">{content.email}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
