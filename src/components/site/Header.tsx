"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { X } from "lucide-react";
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

/**
 * Fixed header. Over the homepage hero it is transparent with white type; everywhere
 * else (and once scrolled) it is solid white with black type.
 */
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
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));
  const overHero = pathname === "/" && !scrolled && !mega;

  const link = (href: string, label: string, menu?: "collections" | "maison") => (
    <li onMouseEnter={() => setMega(menu ?? null)}>
      <Link href={href} className={cn("relative py-2 transition-opacity hover:opacity-60", pathname.startsWith(href) && "underline underline-offset-[6px]")}>
        {label}
      </Link>
    </li>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50" onMouseLeave={() => setMega(null)}>
        <div className="bg-vermilion px-4 py-2 text-center text-[11px] tracking-[0.06em] text-white">{l(announcement)}</div>
        <div className={cn("transition-colors duration-500", overHero ? "bg-transparent text-white" : "border-b border-line bg-white text-ink")}>
          <nav className="mx-auto grid h-[64px] max-w-[1760px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 text-[11px] font-medium uppercase tracking-[0.14em] md:px-10 [&_button]:uppercase [&_select]:uppercase">
            <div className="flex items-center gap-8">
              <button className="lg:hidden" onClick={() => setMobile(true)} aria-label="Menu">
                {zh ? "菜单" : "Menu"}
              </button>
              <ul className="hidden items-center gap-7 lg:flex">
                {link("/collections", t("nav.collections"), "collections")}
                {link("/maison", t("nav.maison"), "maison")}
                <span className="hidden xl:contents">
                  {link("/gifting", t("nav.gifting"))}
                  {link("/journal", t("nav.journal"))}
                </span>
              </ul>
            </div>

            <Link href="/" onMouseEnter={() => setMega(null)} aria-label="Santalum Maison — home">
              <Wordmark />
            </Link>

            <div className="flex items-center justify-end gap-6">
              <Link href="/enquiries" className="hidden transition-opacity hover:opacity-60 xl:block">
                {t("nav.enquiries")}
              </Link>
              <span className="hidden items-center gap-2 lg:flex">
                {(["en", "zh"] as const).map((lc, i) => (
                  <span key={lc} className="flex items-center gap-2">
                    {i > 0 && <span className="opacity-40">/</span>}
                    <button onClick={() => setLocale(lc)} className={locale === lc ? "" : "opacity-50 hover:opacity-100"}>
                      {lc === "en" ? "EN" : "中文"}
                    </button>
                  </span>
                ))}
              </span>
              <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="hidden cursor-pointer appearance-none bg-transparent uppercase outline-none lg:block">
                <option className="text-ink" value="INR">INR ₹</option>
                <option className="text-ink" value="CNY">CNY ¥</option>
                <option className="text-ink" value="USD">USD $</option>
              </select>
              <button onClick={() => setSearchOpen(true)} className="hidden transition-opacity hover:opacity-60 md:block">
                {t("nav.search")}
              </button>
              <Link href="/account" className="hidden transition-opacity hover:opacity-60 xl:block">
                {t("nav.account")}
              </Link>
              <button onClick={() => setBagOpen(true)} className="transition-opacity hover:opacity-60">
                {t("nav.bag")} <span className="tabular-nums">[{cartCount}]</span>
              </button>
            </div>
          </nav>

          <AnimatePresence>
            {mega && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-x-0 top-full border-b border-line bg-white text-ink"
              >
                <div className="mx-auto grid max-w-[1760px] grid-cols-12 gap-10 px-10 py-12">
                  {mega === "collections" ? (
                    <>
                      <ul className="col-span-3 space-y-3 text-[13px]">
                        <li>
                          <Link href="/collections" onClick={() => setMega(null)} className="hover:text-vermilion">
                            {zh ? "全部作品" : "All objects"}
                          </Link>
                        </li>
                        {COLLECTIONS.map((c) => (
                          <li key={c.slug}>
                            <Link href={`/collections/${c.slug}`} onClick={() => setMega(null)} className="hover:text-vermilion">
                              {l(c.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="col-span-9 grid grid-cols-4 gap-4">
                        {COLLECTIONS.slice(0, 4).map((c) => (
                          <Link key={c.slug} href={`/collections/${c.slug}`} onClick={() => setMega(null)} className="group block">
                            <Photo src={c.image} alt={c.name.en} className="aspect-[3/4]" sizes="18vw" zoom />
                            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em]">{l(c.name)}</p>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <ul className="col-span-3 space-y-3 text-[13px]">
                        {MAISON_LINKS.map((m) => (
                          <li key={m.href}>
                            <Link href={m.href} onClick={() => setMega(null)} className="hover:text-vermilion">
                              {t(m.key)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {[
                        ["/craft", "/images/e-chisel.jpg", zh ? "走进工坊" : "Inside the atelier"],
                        ["/provenance", "/images/e-hills-mist.jpg", zh ? "追溯一个批次" : "Trace a batch"],
                        ["/founder", "/images/e-elder-mala.jpg", zh ? "创始人手记" : "The founder's letter"],
                      ].map(([href, img, label]) => (
                        <Link key={href} href={href} onClick={() => setMega(null)} className="group col-span-3 block">
                          <Photo src={img} alt={label} className="aspect-[3/4]" sizes="22vw" zoom />
                          <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em]">{label}</p>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      {/* spacer so non-hero pages start below the fixed header */}
      {pathname !== "/" && <div className="h-[97px]" aria-hidden />}

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
        <motion.div className="fixed inset-0 z-[70] flex flex-col bg-white px-6 pb-8 pt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
          <div className="flex items-center justify-between">
            <Wordmark compact />
            <button onClick={onClose} aria-label="Close">
              <X className="h-6 w-6" strokeWidth={1.2} />
            </button>
          </div>
          <ul className="mt-12 flex-1 overflow-y-auto">
            {links.map(([href, k]) => (
              <li key={href}>
                <Link href={href} onClick={onClose} className="block border-b border-line py-4 font-display text-2xl tracking-[-0.02em]">
                  {t(k)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em]">
            <div className="flex gap-4">
              {(["en", "zh"] as const).map((lc) => (
                <button key={lc} onClick={() => setLocale(lc)} className={locale === lc ? "underline underline-offset-4" : "text-muted"}>
                  {lc === "en" ? "English" : "中文"}
                </button>
              ))}
            </div>
            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="bg-transparent uppercase">
              <option value="INR">INR ₹</option>
              <option value="CNY">CNY ¥</option>
              <option value="USD">USD $</option>
            </select>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
