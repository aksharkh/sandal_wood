"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, User } from "lucide-react";
import { Monogram, Wordmark } from "./Logo";
import { useMaison, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { OUT } from "../motion/primitives";
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
 * Navigation lives in a fixed rail down the left edge (a top bar on small screens),
 * so the page itself is free to travel sideways.
 */
export function Header() {
  const { t, zh, locale, currency } = useT();
  const cartCount = useShop((s) => s.cart.reduce((n, x) => n + x.qty, 0));
  const setBagOpen = useShop((s) => s.setBagOpen);
  const setSearchOpen = useShop((s) => s.setSearchOpen);
  const setLocale = useShop((s) => s.setLocale);
  const setCurrency = useShop((s) => s.setCurrency);
  const [open, setOpen] = useState(false);
  const next: Record<Currency, Currency> = { INR: "CNY", CNY: "USD", USD: "INR" };
  const sym: Record<Currency, string> = { INR: "₹", CNY: "¥", USD: "$" };
  const round = "grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-cream/10";

  return (
    <>
      {/* desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-[60] hidden w-[var(--rail)] flex-col items-center justify-between bg-night py-5 text-cream lg:flex">
        <Link href="/" aria-label="Santalum Maison — home" onClick={() => setOpen(false)}>
          <Monogram className="h-11 w-11 text-[20px]" />
        </Link>

        <button onClick={() => setOpen((v) => !v)} className="group flex flex-col items-center gap-4" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          <span className="relative block h-5 w-7">
            <span className={cn("absolute left-0 block h-[2px] w-7 rounded bg-current transition-transform duration-500 ease-[var(--ease-lux)]", open ? "top-[9px] rotate-45" : "top-[5px]")} />
            <span className={cn("absolute left-0 block h-[2px] w-7 rounded bg-current transition-transform duration-500 ease-[var(--ease-lux)]", open ? "top-[9px] -rotate-45" : "top-[13px]")} />
          </span>
          <span className="cap upright text-rose transition-colors group-hover:text-cream">{open ? (zh ? "关闭" : "Close") : zh ? "菜单" : "Menu"}</span>
        </button>

        <div className="flex flex-col items-center gap-1">
          <button onClick={() => setSearchOpen(true)} className={round} aria-label={t("nav.search")}>
            <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </button>
          <Link href="/account" className={round} aria-label={t("nav.account")}>
            <User className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </Link>
          <button onClick={() => setBagOpen(true)} className={cn(round, "relative")} aria-label={t("nav.bag")}>
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
            <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-vermilion px-1 text-[10px] font-bold tabular-nums text-cream">{cartCount}</span>
          </button>
          <span className="my-2 h-px w-6 bg-cream/20" />
          <button onClick={() => setLocale(locale === "en" ? "zh" : "en")} className={cn(round, "text-[12px] font-semibold")} aria-label="Language">
            {locale === "en" ? "中" : "EN"}
          </button>
          <button onClick={() => setCurrency(next[currency])} className={cn(round, "text-[14px] font-semibold")} aria-label={`Currency: ${currency}`} title={currency}>
            {sym[currency]}
          </button>
        </div>
      </aside>

      {/* small screens */}
      <header className="fixed inset-x-0 top-0 z-[60] flex h-[60px] items-center justify-between bg-night px-4 text-cream lg:hidden">
        <Link href="/" aria-label="Santalum Maison — home" onClick={() => setOpen(false)}>
          <Wordmark compact />
        </Link>
        <div className="flex items-center gap-1">
          <button onClick={() => setSearchOpen(true)} className={round} aria-label={t("nav.search")}>
            <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </button>
          <button onClick={() => setBagOpen(true)} className={cn(round, "relative")} aria-label={t("nav.bag")}>
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
            <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-vermilion px-1 text-[10px] font-bold tabular-nums">{cartCount}</span>
          </button>
          <button onClick={() => setOpen((v) => !v)} className={round} aria-label="Menu" aria-expanded={open}>
            <span className="relative block h-4 w-6">
              <span className={cn("absolute left-0 block h-[2px] w-6 rounded bg-current transition-transform duration-500", open ? "top-[7px] rotate-45" : "top-[3px]")} />
              <span className={cn("absolute left-0 block h-[2px] w-6 rounded bg-current transition-transform duration-500", open ? "top-[7px] -rotate-45" : "top-[11px]")} />
            </span>
          </button>
        </div>
      </header>
      <div className="h-[60px] lg:hidden" aria-hidden />

      <Index open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Index({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, l, locale } = useT();
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
        <>
          <motion.button aria-label="Close menu" onClick={onClose} className="fixed inset-0 z-[54] bg-night/50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
          <motion.div
            className="fixed inset-y-0 left-0 z-[55] flex w-full flex-col bg-forest pt-[60px] text-cream lg:w-[min(920px,78vw)] lg:pl-[var(--rail)] lg:pt-0"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.8, ease: OUT }}
            data-lenis-prevent
          >
            <div className="grid flex-1 gap-8 overflow-y-auto p-6 md:p-10 lg:grid-cols-[1fr_260px]">
              <ul className="flex flex-col justify-center">
                {MENU.map((m, i) => (
                  <li key={m.href} className="overflow-hidden" onMouseEnter={() => setActive(i)}>
                    <motion.div initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: OUT, delay: 0.2 + i * 0.05 }}>
                      <Link href={m.href} onClick={onClose} className="group flex items-center gap-4 py-1.5">
                        <span className={cn("h-3 w-3 shrink-0 rounded-full transition-colors duration-300", active === i || pathname.startsWith(m.href) ? "bg-copper" : "bg-cream/20")} />
                        <span className={cn("font-display text-[clamp(2.2rem,6.6vh,4.6rem)] font-semibold leading-[1.05] tracking-[-0.045em] transition-[color,transform] duration-500 ease-[var(--ease-lux)] group-hover:translate-x-3", active === i ? "text-cream" : "text-cream/45")}>
                          {t(m.key)}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <div className="hidden flex-col justify-center gap-6 lg:flex">
                <div className="relative aspect-[3/5] overflow-hidden rounded-full">
                  {MENU.map((m, i) => (
                    <Image key={m.href} src={m.img} alt="" fill sizes="260px" className={cn("object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-lux)]", active === i ? "scale-100 opacity-100" : "scale-110 opacity-0")} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-cream/15 p-6 text-[13px] text-rose md:px-10">
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {COLLECTIONS.map((c) => (
                  <Link key={c.slug} href={`/collections/${c.slug}`} onClick={onClose} className="hover:text-cream">
                    {l(c.name)}
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {MORE.map((m) => (
                  <Link key={m.href} href={m.href} onClick={onClose} className="hover:text-cream">
                    {t(m.key)}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-5">
                {(["en", "zh"] as const).map((lc) => (
                  <button key={lc} onClick={() => setLocale(lc)} className={locale === lc ? "text-cream underline underline-offset-4" : "hover:text-cream"}>
                    {lc === "en" ? "English" : "中文"}
                  </button>
                ))}
                <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="bg-transparent text-cream outline-none" aria-label="Currency">
                  <option className="text-black" value="INR">INR ₹</option>
                  <option className="text-black" value="CNY">CNY ¥</option>
                  <option className="text-black" value="USD">USD $</option>
                </select>
                <span className="hidden xl:inline">{content.email}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
