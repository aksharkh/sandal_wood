"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Wordmark } from "./Logo";
import { useMaison, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { ProductVisual } from "../visual/ProductVisual";
import { EASE } from "../motion/primitives";
import { cn } from "@/lib/utils";
import type { Currency } from "@/lib/types";
import type { DictKey } from "@/lib/i18n";

const MAISON_LINKS: { href: string; key: DictKey; note: { en: string; zh: string } }[] = [
  { href: "/maison", key: "nav.maison", note: { en: "Who we are", zh: "我们是谁" } },
  { href: "/founder", key: "nav.founder", note: { en: "The founder's letter", zh: "创始人手记" } },
  { href: "/craft", key: "nav.craft", note: { en: "Select · Shape · Finish · Inspect · Present", zh: "选料 · 成形 · 打磨 · 检验 · 呈献" } },
  { href: "/provenance", key: "nav.provenance", note: { en: "Trace any batch", zh: "追溯任意批次" } },
  { href: "/sourcing", key: "nav.sourcing", note: { en: "Our material policy", zh: "我们的材料政策" } },
  { href: "/science", key: "nav.science", note: { en: "Density, colour, chemistry", zh: "密度 · 色泽 · 化学" } },
];

export function Header() {
  const { t, l, zh, locale, currency } = useT();
  const pathname = usePathname();
  const cartCount = useShop((s) => s.cart.reduce((n, x) => n + x.qty, 0));
  const wishCount = useShop((s) => s.wishlist.length);
  const setBagOpen = useShop((s) => s.setBagOpen);
  const setSearchOpen = useShop((s) => s.setSearchOpen);
  const setLocale = useShop((s) => s.setLocale);
  const setCurrency = useShop((s) => s.setCurrency);
  const announcement = useMaison((s) => s.content.announcement);

  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [mega, setMega] = useState<null | "collections" | "maison">(null);
  const [mobile, setMobile] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240 && !mega);
    setSolid(y > 40);
  });

  const navItem = (href: string, label: string, menu?: "collections" | "maison") => (
    <li
      onMouseEnter={() => setMega(menu ?? null)}
      className="relative"
    >
      <Link
        href={href}
        className={cn(
          "relative py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-bone/80 transition-colors hover:text-bone",
          pathname.startsWith(href) && "text-bone",
        )}
      >
        {label}
        {pathname.startsWith(href) && <motion.span layoutId="nav-dot" className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ember" />}
      </Link>
    </li>
  );

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        onMouseLeave={() => setMega(null)}
      >
        <div className="relative overflow-hidden border-b border-bone/5 bg-oxblood/70 py-2 text-center text-[10px] tracking-[0.2em] text-bone/80 backdrop-blur">
          <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="flex items-center gap-16">
                {l(announcement).toUpperCase()}
                <span className="text-gold">✦</span>
              </span>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "transition-[background,border-color,backdrop-filter] duration-700",
            solid || mega ? "border-b border-bone/[0.07] bg-ink/75 backdrop-blur-xl" : "border-b border-transparent",
          )}
        >
          <nav className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 md:px-10">
            <div className="flex flex-1 items-center gap-8">
              <button className="lg:hidden" onClick={() => setMobile(true)} aria-label="Menu">
                <Menu className="h-5 w-5" strokeWidth={1.3} />
              </button>
              <ul className="hidden items-center gap-8 lg:flex">
                {navItem("/collections", t("nav.collections"), "collections")}
                {navItem("/maison", t("nav.maison"), "maison")}
                {navItem("/material", t("nav.material"))}
                {navItem("/journal", t("nav.journal"))}
              </ul>
            </div>

            <Link href="/" className="shrink-0" onMouseEnter={() => setMega(null)} aria-label="Santalum Maison — home">
              <Wordmark />
            </Link>

            <div className="flex flex-1 items-center justify-end gap-5">
              <ul className="hidden items-center gap-8 xl:flex">{navItem("/enquiries", t("nav.enquiries"))}</ul>
              <div className="hidden items-center gap-1 rounded-full border border-bone/10 p-0.5 text-[10px] md:flex">
                {(["en", "zh"] as const).map((lc) => (
                  <button
                    key={lc}
                    onClick={() => setLocale(lc)}
                    className={cn("relative rounded-full px-2.5 py-1 transition-colors", locale === lc ? "text-ink" : "text-bone/60 hover:text-bone")}
                  >
                    {locale === lc && <motion.span layoutId="lc" className="absolute inset-0 rounded-full bg-bone" transition={{ duration: 0.5, ease: EASE }} />}
                    <span className="relative">{lc === "en" ? "EN" : "中文"}</span>
                  </button>
                ))}
              </div>
              <select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="hidden cursor-pointer appearance-none bg-transparent text-[10px] tracking-[0.2em] text-bone/70 outline-none hover:text-bone md:block"
              >
                <option className="bg-umber" value="INR">₹ INR</option>
                <option className="bg-umber" value="CNY">¥ CNY</option>
                <option className="bg-umber" value="USD">$ USD</option>
              </select>
              <button onClick={() => setSearchOpen(true)} aria-label={t("nav.search")} className="text-bone/80 hover:text-bone">
                <Search className="h-[18px] w-[18px]" strokeWidth={1.3} />
              </button>
              <Link href="/account?tab=wishlist" aria-label={t("nav.wishlist")} className="relative hidden text-bone/80 hover:text-bone sm:block">
                <Heart className="h-[18px] w-[18px]" strokeWidth={1.3} />
                {wishCount > 0 && <span className="absolute -right-1.5 -top-1 h-1.5 w-1.5 rounded-full bg-ember" />}
              </Link>
              <Link href="/account" aria-label={t("nav.account")} className="hidden text-bone/80 hover:text-bone sm:block">
                <User className="h-[18px] w-[18px]" strokeWidth={1.3} />
              </Link>
              <button onClick={() => setBagOpen(true)} aria-label={t("nav.bag")} className="relative text-bone/80 hover:text-bone">
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.3} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[9px] font-semibold text-ink"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {mega && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="overflow-hidden border-t border-bone/[0.06]"
              >
                <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-8 px-10 py-10">
                  {mega === "collections" ? (
                    <>
                      <div className="col-span-3">
                        <p className="font-display text-3xl italic text-bone/90">{zh ? "五个系列，同一种木" : "Five collections, one material."}</p>
                        <Link href="/collections" className="mt-6 inline-block text-[11px] uppercase tracking-[0.24em] text-gold hover:text-bone" onClick={() => setMega(null)}>
                          {t("cta.viewAll")} →
                        </Link>
                      </div>
                      <div className="col-span-9 grid grid-cols-5 gap-4">
                        {COLLECTIONS.map((c, i) => (
                          <motion.div key={c.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.1, duration: 0.7, ease: EASE }}>
                            <Link href={`/collections/${c.slug}`} onClick={() => setMega(null)} className="group block">
                              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-umber">
                                <ProductVisual kind={c.visual} tone={0.3 + i * 0.1} seed={i + 2} className="h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-110" />
                              </div>
                              <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-gold/80">{l(c.kicker)}</p>
                              <p className="font-display text-xl text-bone">{l(c.name)}</p>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-4">
                        <p className="font-display text-3xl italic leading-tight text-bone/90">
                          {zh ? "材质、工艺与克制。" : "Material, craft, and restraint."}
                        </p>
                      </div>
                      <ul className="col-span-8 grid grid-cols-3 gap-x-8 gap-y-6">
                        {MAISON_LINKS.map((m, i) => (
                          <motion.li key={m.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i + 0.1, duration: 0.6, ease: EASE }}>
                            <Link href={m.href} onClick={() => setMega(null)} className="group block border-t border-bone/10 pt-4">
                              <span className="font-display text-2xl text-bone transition-colors group-hover:text-ember">{t(m.key)}</span>
                              <span className="mt-1 block text-xs text-bone/50">{zh ? m.note.zh : m.note.en}</span>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, locale } = useT();
  const setLocale = useShop((s) => s.setLocale);
  const setCurrency = useShop((s) => s.setCurrency);
  const currency = useShop((s) => s.currency);
  const links: [string, DictKey][] = [
    ["/collections", "nav.collections"],
    ["/maison", "nav.maison"],
    ["/material", "nav.material"],
    ["/craft", "nav.craft"],
    ["/provenance", "nav.provenance"],
    ["/gifting", "nav.gifting"],
    ["/journal", "nav.journal"],
    ["/enquiries", "nav.enquiries"],
    ["/account", "nav.account"],
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-ink px-6 pb-8 pt-6"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="flex items-center justify-between">
            <Wordmark compact />
            <button onClick={onClose} aria-label="Close">
              <X className="h-6 w-6" strokeWidth={1.2} />
            </button>
          </div>
          <ul className="mt-12 flex-1 space-y-3 overflow-y-auto">
            {links.map(([href, k], i) => (
              <motion.li key={href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.8, ease: EASE }}>
                <Link href={href} onClick={onClose} className="flex items-baseline justify-between border-b border-bone/[0.07] pb-3 font-display text-4xl text-bone">
                  {t(k)}
                  <span className="font-mono text-[10px] text-gold/70">0{i + 1}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between text-xs">
            <div className="flex gap-2">
              {(["en", "zh"] as const).map((lc) => (
                <button key={lc} onClick={() => setLocale(lc)} className={cn("rounded-full border px-3 py-1.5", locale === lc ? "border-bone bg-bone text-ink" : "border-bone/20")}>
                  {lc === "en" ? "English" : "中文"}
                </button>
              ))}
            </div>
            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="rounded-full border border-bone/20 bg-transparent px-3 py-1.5">
              <option className="bg-umber" value="INR">₹ INR</option>
              <option className="bg-umber" value="CNY">¥ CNY</option>
              <option className="bg-umber" value="USD">$ USD</option>
            </select>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
