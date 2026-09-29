"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Wordmark } from "./Logo";
import { useMaison, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { EASE, Photo } from "../motion/primitives";
import { cn } from "@/lib/utils";
import type { Currency } from "@/lib/types";
import type { DictKey } from "@/lib/i18n";

const MAISON_LINKS: { href: string; key: DictKey }[] = [
  { href: "/maison", key: "nav.maison" },
  { href: "/founder", key: "nav.founder" },
  { href: "/material", key: "nav.material" },
  { href: "/craft", key: "nav.craft" },
  { href: "/provenance", key: "nav.provenance" },
  { href: "/sourcing", key: "nav.sourcing" },
  { href: "/science", key: "nav.science" },
];

export function Header() {
  const { t, l, zh, locale, currency } = useT();
  const pathname = usePathname();
  const cartCount = useShop((s) => s.cart.reduce((n, x) => n + x.qty, 0));
  const setBagOpen = useShop((s) => s.setBagOpen);
  const setSearchOpen = useShop((s) => s.setSearchOpen);
  const setLocale = useShop((s) => s.setLocale);
  const setCurrency = useShop((s) => s.setCurrency);
  const announcement = useMaison((s) => s.content.announcement);
  const [mega, setMega] = useState<null | "collections" | "maison">(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60));

  const link = (href: string, label: string, menu?: "collections" | "maison") => (
    <li onMouseEnter={() => setMega(menu ?? null)}>
      <Link
        href={href}
        className={cn(
          "relative rounded-full px-3.5 py-2 text-[13px] transition-colors hover:bg-ink/[0.06]",
          pathname.startsWith(href) ? "text-ink" : "text-graphite",
        )}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <>
      <motion.div
        animate={{ height: scrolled ? 0 : "auto", opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="overflow-hidden bg-maroon text-center text-[11px] tracking-[0.04em] text-cream"
      >
        <p className="px-4 py-2">{l(announcement)}</p>
      </motion.div>

      <header className="sticky top-0 z-50 px-3 pt-3 md:px-5" onMouseLeave={() => setMega(null)}>
        <div
          className={cn(
            "relative mx-auto max-w-[1680px] rounded-full transition-[background,box-shadow,backdrop-filter] duration-500",
            scrolled || mega ? "bg-paper/85 shadow-[0_10px_40px_-18px_rgba(43,26,19,0.35)] backdrop-blur-xl" : "bg-transparent",
          )}
        >
          <nav className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-3 md:px-4">
            <div className="flex items-center gap-2">
              <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/[0.06] lg:hidden" onClick={() => setMobile(true)} aria-label="Menu">
                <Menu className="h-5 w-5" strokeWidth={1.4} />
              </button>
              <ul className="hidden items-center lg:flex">
                {link("/collections", t("nav.collections"), "collections")}
                {link("/maison", t("nav.maison"), "maison")}
                {link("/gifting", t("nav.gifting"))}
                {link("/journal", t("nav.journal"))}
              </ul>
            </div>

            <Link href="/" onMouseEnter={() => setMega(null)} aria-label="Santalum Maison — home" className="text-ink">
              <Wordmark />
            </Link>

            <div className="flex items-center justify-end gap-1 text-[13px] text-graphite">
              <Link href="/enquiries" className="hidden rounded-full px-3.5 py-2 hover:bg-ink/[0.06] hover:text-ink xl:block">
                {t("nav.enquiries")}
              </Link>
              <div className="mx-1 hidden items-center rounded-full bg-ink/[0.05] p-1 md:flex">
                {(["en", "zh"] as const).map((lc) => (
                  <button
                    key={lc}
                    onClick={() => setLocale(lc)}
                    className={cn("relative rounded-full px-2.5 py-1 text-[12px]", locale === lc ? "text-cream" : "text-graphite hover:text-ink")}
                  >
                    {locale === lc && <motion.span layoutId="lc-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.35, ease: EASE }} />}
                    <span className="relative">{lc === "en" ? "EN" : "中文"}</span>
                  </button>
                ))}
              </div>
              <select
                aria-label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="hidden cursor-pointer appearance-none rounded-full bg-transparent px-2 py-2 outline-none hover:text-ink md:block"
              >
                <option value="INR">₹ INR</option>
                <option value="CNY">¥ CNY</option>
                <option value="USD">$ USD</option>
              </select>
              <button onClick={() => setSearchOpen(true)} aria-label={t("nav.search")} className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/[0.06] hover:text-ink">
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
              <Link href="/account" className="hidden rounded-full px-3 py-2 hover:bg-ink/[0.06] hover:text-ink sm:block">
                {t("nav.account")}
              </Link>
              <button onClick={() => setBagOpen(true)} className="relative flex h-10 items-center gap-2 rounded-full bg-ink pl-3.5 pr-4 text-cream transition-colors hover:bg-clay" aria-label={t("nav.bag")}>
                <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
                <span className="tabular-nums">{cartCount}</span>
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {mega && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute inset-x-0 top-[calc(100%+10px)] overflow-hidden rounded-[32px] bg-paper shadow-[0_30px_80px_-30px_rgba(43,26,19,0.45)]"
              >
                <div className="grid grid-cols-12 gap-8 p-10">
                  {mega === "collections" ? (
                    <>
                      <ul className="col-span-4 space-y-1">
                        <li>
                          <Link href="/collections" onClick={() => setMega(null)} className="block py-1 font-display text-3xl hover:italic hover:text-clay">
                            {zh ? "全部作品" : "All objects"}
                          </Link>
                        </li>
                        {COLLECTIONS.map((c) => (
                          <li key={c.slug}>
                            <Link href={`/collections/${c.slug}`} onClick={() => setMega(null)} className="block py-1 font-display text-3xl text-graphite transition-colors hover:italic hover:text-clay">
                              {l(c.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="col-span-8 grid grid-cols-3 gap-5">
                        {COLLECTIONS.slice(0, 3).map((c) => (
                          <Link key={c.slug} href={`/collections/${c.slug}`} onClick={() => setMega(null)} className="group block text-center">
                            <Photo src={c.image} alt={c.name.en} shape="arch" className="aspect-[3/4]" sizes="22vw" zoom />
                            <p className="mt-3 font-display text-xl">{l(c.name)}</p>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <ul className="col-span-4 space-y-1">
                        {MAISON_LINKS.map((m) => (
                          <li key={m.href}>
                            <Link href={m.href} onClick={() => setMega(null)} className="block py-1 font-display text-3xl text-graphite transition-colors hover:italic hover:text-clay">
                              {t(m.key)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href="/craft" onClick={() => setMega(null)} className="group col-span-4 block text-center">
                        <Photo src="/images/e-chisel.jpg" alt="Carving heartwood by hand" shape="arch" className="aspect-[4/5]" sizes="28vw" zoom />
                        <p className="mt-3 font-display text-xl">{zh ? "走进工坊" : "Inside the atelier"}</p>
                      </Link>
                      <Link href="/provenance" onClick={() => setMega(null)} className="group col-span-4 block text-center">
                        <Photo src="/images/e-hills-mist.jpg" alt="Hills of the Eastern Ghats" shape="arch" className="aspect-[4/5]" sizes="28vw" zoom />
                        <p className="mt-3 font-display text-xl">{zh ? "追溯一个批次" : "Trace a batch"}</p>
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

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
          className="fixed inset-0 z-[70] flex flex-col bg-maroon px-6 pb-8 pt-6 text-cream"
          initial={{ clipPath: "circle(0% at 32px 32px)" }}
          animate={{ clipPath: "circle(150% at 32px 32px)" }}
          exit={{ clipPath: "circle(0% at 32px 32px)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="flex items-center justify-between">
            <Wordmark compact />
            <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full border border-cream/30">
              <X className="h-5 w-5" strokeWidth={1.3} />
            </button>
          </div>
          <ul className="mt-10 flex-1 overflow-y-auto">
            {links.map(([href, k], i) => (
              <motion.li key={href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.04, duration: 0.6, ease: EASE }}>
                <Link href={href} onClick={onClose} className="flex items-baseline justify-between border-b border-cream/15 py-3.5 font-display text-4xl">
                  {t(k)}
                  <span className="font-sans text-[11px] text-rose">0{i + 1}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="flex gap-2">
              {(["en", "zh"] as const).map((lc) => (
                <button key={lc} onClick={() => setLocale(lc)} className={cn("rounded-full border px-4 py-1.5", locale === lc ? "border-cream bg-cream text-ink" : "border-cream/30")}>
                  {lc === "en" ? "English" : "中文"}
                </button>
              ))}
            </div>
            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="rounded-full border border-cream/30 bg-transparent px-3 py-1.5">
              <option className="text-ink" value="INR">₹ INR</option>
              <option className="text-ink" value="CNY">¥ CNY</option>
              <option className="text-ink" value="USD">$ USD</option>
            </select>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
