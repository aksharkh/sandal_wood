"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, User, X } from "lucide-react";
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
 * Floating glass pill. Over the homepage hero it is smoked glass with light type;
 * everywhere else it is frosted porcelain. The announcement line folds away on scroll.
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
  const [y, setY] = useState(0);
  const [dark, setDark] = useState(pathname === "/");
  const { scrollY } = useScroll();
  // Smoked glass whenever the section under the pill is a night field (data-nav="dark").
  const probe = useCallback(() => {
    const under = document.elementsFromPoint(window.innerWidth / 2, 72).find((el) => !el.closest("header"));
    setDark(!!under?.closest('[data-nav="dark"]'));
  }, []);
  const settle = useRef<number | undefined>(undefined);
  useMotionValueEvent(scrollY, "change", (v) => {
    setY(v);
    probe();
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(probe, 120); // once smooth scrolling comes to rest
  });
  useEffect(() => {
    const id = requestAnimationFrame(probe);
    const late = window.setTimeout(probe, 400);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(late);
    };
  }, [pathname, probe]);
  const overHero = dark && !mega;
  const folded = y > 40;

  const link = (href: string, label: string, menu?: "collections" | "maison") => (
    <li onMouseEnter={() => setMega(menu ?? null)}>
      <Link
        href={href}
        className={cn(
          "rounded-full px-3.5 py-2 transition-colors",
          overHero ? "hover:bg-white/10" : "hover:bg-ink/5",
          pathname.startsWith(href) && (overHero ? "bg-white/10" : "bg-ink/5"),
        )}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50" onMouseLeave={() => setMega(null)}>
        <div className={cn("overflow-hidden text-center text-[11px] tracking-[0.08em] transition-all duration-500", folded ? "h-0 opacity-0" : "h-8 opacity-100", pathname === "/" ? "text-rose" : "text-muted")}>
          <p className="pt-2">{l(announcement)}</p>
        </div>
        <div className="px-3 md:px-6">
          <nav
            className={cn(
              "relative mx-auto mt-2 grid h-[60px] max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-full pl-2 pr-2 text-[13px] font-medium transition-[background-color,color,box-shadow] duration-500 md:pl-3",
              overHero ? "glass-dark text-cream" : "glass text-ink shadow-[0_20px_50px_-30px_rgba(60,20,10,.35)]",
            )}
          >
            <div className="flex items-center">
              <button className="rounded-full px-3 py-2 lg:hidden" onClick={() => setMobile(true)} aria-label="Menu">
                {zh ? "菜单" : "Menu"}
              </button>
              <ul className="hidden items-center lg:flex">
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

            <div className="flex items-center justify-end gap-1">
              <span className={cn("hidden items-center rounded-full p-1 lg:flex", overHero ? "bg-white/10" : "bg-ink/5")}>
                {(["en", "zh"] as const).map((lc) => (
                  <button
                    key={lc}
                    onClick={() => setLocale(lc)}
                    className={cn("rounded-full px-2.5 py-1 text-[12px] transition-colors", locale === lc ? (overHero ? "bg-cream text-ink" : "bg-ink text-cream") : "opacity-60 hover:opacity-100")}
                  >
                    {lc === "en" ? "EN" : "中文"}
                  </button>
                ))}
              </span>
              <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="hidden cursor-pointer appearance-none rounded-full bg-transparent px-3 py-2 text-[12px] outline-none xl:block">
                <option className="text-ink" value="INR">₹ INR</option>
                <option className="text-ink" value="CNY">¥ CNY</option>
                <option className="text-ink" value="USD">$ USD</option>
              </select>
              <button onClick={() => setSearchOpen(true)} className={cn("hidden rounded-full p-2.5 transition-colors md:block", overHero ? "hover:bg-white/10" : "hover:bg-ink/5")} aria-label={t("nav.search")}>
                <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
              <Link href="/account" className={cn("hidden rounded-full p-2.5 transition-colors md:block", overHero ? "hover:bg-white/10" : "hover:bg-ink/5")} aria-label={t("nav.account")}>
                <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Link>
              <button onClick={() => setBagOpen(true)} className={cn("flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 transition-colors", overHero ? "bg-cream text-ink" : "bg-ink text-cream hover:bg-vermilion")}>
                <span className="hidden sm:inline">{t("nav.bag")}</span>
                <span className={cn("grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-[12px] tabular-nums", overHero ? "bg-ink text-cream" : "bg-cream/15")}>{cartCount}</span>
              </button>
            </div>

            <AnimatePresence>
              {mega && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="absolute inset-x-0 top-[calc(100%+10px)] origin-top rounded-[32px] border border-white/60 bg-paper/95 text-ink shadow-[0_40px_80px_-40px_rgba(60,20,10,.45)] backdrop-blur-xl"
                >
                  <div className="grid grid-cols-12 gap-8 p-8">
                    {mega === "collections" ? (
                      <>
                        <ul className="col-span-3 space-y-1 text-[15px]">
                          <li>
                            <Link href="/collections" onClick={() => setMega(null)} className="block rounded-2xl px-4 py-2.5 hover:bg-stone">
                              {zh ? "全部作品" : "All objects"}
                            </Link>
                          </li>
                          {COLLECTIONS.map((c) => (
                            <li key={c.slug}>
                              <Link href={`/collections/${c.slug}`} onClick={() => setMega(null)} className="block rounded-2xl px-4 py-2.5 hover:bg-stone">
                                {l(c.name)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className="col-span-9 grid grid-cols-4 gap-4">
                          {COLLECTIONS.slice(0, 4).map((c) => (
                            <Link key={c.slug} href={`/collections/${c.slug}`} onClick={() => setMega(null)} className="group block">
                              <Photo src={c.image} alt={c.name.en} className="aspect-[3/4] rounded-[20px]" sizes="18vw" zoom />
                              <p className="mt-3 px-1 text-[13px] font-medium">{l(c.name)}</p>
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <ul className="col-span-3 space-y-1 text-[15px]">
                          {MAISON_LINKS.map((m) => (
                            <li key={m.href}>
                              <Link href={m.href} onClick={() => setMega(null)} className="block rounded-2xl px-4 py-2.5 hover:bg-stone">
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
                            <Photo src={img} alt={label} className="aspect-[3/4] rounded-[20px]" sizes="22vw" zoom />
                            <p className="mt-3 px-1 text-[13px] font-medium">{label}</p>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </header>
      {/* spacer so non-hero pages start below the floating header */}
      {pathname !== "/" && <div className="h-[112px]" aria-hidden />}

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
        <motion.div className="fixed inset-0 z-[70] flex flex-col bg-page px-6 pb-8 pt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
          <div className="flex items-center justify-between">
            <Wordmark compact />
            <button onClick={onClose} aria-label="Close">
              <X className="h-6 w-6" strokeWidth={1.2} />
            </button>
          </div>
          <ul className="mt-12 flex-1 overflow-y-auto">
            {links.map(([href, k]) => (
              <li key={href}>
                <Link href={href} onClick={onClose} className="block border-b border-line py-4 font-display text-3xl font-light tracking-[-0.03em]">
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
