"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
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

  const link = (href: string, label: string, menu?: "collections" | "maison") => (
    <li onMouseEnter={() => setMega(menu ?? null)}>
      <Link href={href} className={cn("py-2 text-[13px] transition-colors hover:text-ink", pathname.startsWith(href) ? "text-ink" : "text-graphite")}>
        {label}
      </Link>
    </li>
  );

  return (
    <>
      <header className="sticky top-0 z-50" onMouseLeave={() => setMega(null)}>
        <div className="bg-clay px-4 py-2 text-center text-[11px] tracking-[0.04em] text-paper">{l(announcement)}</div>
        <div className="border-b border-line bg-page/95 backdrop-blur-md">
          <nav className="mx-auto grid h-[76px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-10">
            <div className="flex items-center gap-8">
              <button className="lg:hidden" onClick={() => setMobile(true)} aria-label="Menu">
                <Menu className="h-5 w-5" strokeWidth={1.4} />
              </button>
              <ul className="hidden items-center gap-7 lg:flex">
                {link("/collections", t("nav.collections"), "collections")}
                {link("/maison", t("nav.maison"), "maison")}
                {link("/gifting", t("nav.gifting"))}
                {link("/journal", t("nav.journal"))}
              </ul>
            </div>

            <Link href="/" onMouseEnter={() => setMega(null)} aria-label="Santalum Maison — home" className="text-ink">
              <Wordmark />
            </Link>

            <div className="flex items-center justify-end gap-6 text-[13px] text-graphite">
              <Link href="/enquiries" className="hidden hover:text-ink xl:block">{t("nav.enquiries")}</Link>
              <div className="hidden items-center gap-2 md:flex">
                {(["en", "zh"] as const).map((lc, i) => (
                  <span key={lc} className="flex items-center gap-2">
                    {i > 0 && <span className="text-line">|</span>}
                    <button onClick={() => setLocale(lc)} className={locale === lc ? "text-ink underline underline-offset-4" : "hover:text-ink"}>
                      {lc === "en" ? "EN" : "中文"}
                    </button>
                  </span>
                ))}
              </div>
              <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="hidden cursor-pointer appearance-none bg-transparent outline-none hover:text-ink md:block">
                <option value="INR">₹ INR</option>
                <option value="CNY">¥ CNY</option>
                <option value="USD">$ USD</option>
              </select>
              <button onClick={() => setSearchOpen(true)} aria-label={t("nav.search")} className="hover:text-ink">
                <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
              </button>
              <Link href="/account" className="hidden hover:text-ink sm:block">{t("nav.account")}</Link>
              <button onClick={() => setBagOpen(true)} className="hover:text-ink">
                {t("nav.bag")} <span className="tabular-nums">({cartCount})</span>
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
                className="absolute inset-x-0 top-full border-b border-line bg-page"
              >
                <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-8 px-10 py-10">
                  {mega === "collections" ? (
                    <>
                      <ul className="col-span-3 space-y-3">
                        <li>
                          <Link href="/collections" onClick={() => setMega(null)} className="font-display text-2xl hover:text-clay">{zh ? "全部作品" : "All objects"}</Link>
                        </li>
                        {COLLECTIONS.map((c) => (
                          <li key={c.slug}>
                            <Link href={`/collections/${c.slug}`} onClick={() => setMega(null)} className="font-display text-2xl text-graphite hover:text-clay">
                              {l(c.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="col-span-9 grid grid-cols-3 gap-6">
                        {COLLECTIONS.slice(0, 3).map((c) => (
                          <Link key={c.slug} href={`/collections/${c.slug}`} onClick={() => setMega(null)} className="group block">
                            <Photo src={c.image} alt={c.name.en} className="aspect-[4/3]" sizes="25vw" zoom />
                            <p className="mt-3 text-[13px] text-graphite">{l(c.name)}</p>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <ul className="col-span-4 space-y-3">
                        {MAISON_LINKS.map((m) => (
                          <li key={m.href}>
                            <Link href={m.href} onClick={() => setMega(null)} className="font-display text-2xl text-graphite hover:text-clay">
                              {t(m.key)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href="/craft" onClick={() => setMega(null)} className="group col-span-4 block">
                        <Photo src="/images/e-chisel.jpg" alt="Carving heartwood by hand" className="aspect-[4/3]" sizes="30vw" zoom />
                        <p className="mt-3 text-[13px] text-graphite">{zh ? "走进工坊" : "Inside the atelier"}</p>
                      </Link>
                      <Link href="/provenance" onClick={() => setMega(null)} className="group col-span-4 block">
                        <Photo src="/images/e-hills-mist.jpg" alt="Hills of the Eastern Ghats" className="aspect-[4/3]" sizes="30vw" zoom />
                        <p className="mt-3 text-[13px] text-graphite">{zh ? "追溯一个批次" : "Trace a batch"}</p>
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
        <motion.div className="fixed inset-0 z-[70] flex flex-col bg-page px-6 pb-8 pt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
          <div className="flex items-center justify-between">
            <Wordmark compact />
            <button onClick={onClose} aria-label="Close">
              <X className="h-6 w-6" strokeWidth={1.3} />
            </button>
          </div>
          <ul className="mt-10 flex-1 overflow-y-auto">
            {links.map(([href, k]) => (
              <li key={href}>
                <Link href={href} onClick={onClose} className="block border-b border-line py-4 font-display text-3xl">
                  {t(k)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="flex gap-4">
              {(["en", "zh"] as const).map((lc) => (
                <button key={lc} onClick={() => setLocale(lc)} className={locale === lc ? "underline underline-offset-4" : "text-muted"}>
                  {lc === "en" ? "English" : "中文"}
                </button>
              ))}
            </div>
            <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="bg-transparent">
              <option value="INR">₹ INR</option>
              <option value="CNY">¥ CNY</option>
              <option value="USD">$ USD</option>
            </select>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
