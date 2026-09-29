"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { LayoutGrid, Rows3, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductVisual } from "../visual/ProductVisual";
import { EASE, Eyebrow, SplitReveal } from "../motion/primitives";
import { useActiveProducts, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import type { CollectionSlug } from "@/lib/types";
import { cn, stockOf } from "@/lib/utils";

const OCCASIONS = [
  { k: "gift", en: "Gift", zh: "礼物" },
  { k: "wedding", en: "Wedding", zh: "婚礼" },
  { k: "ritual", en: "Ritual", zh: "修持" },
  { k: "spring-festival", en: "Spring Festival", zh: "春节" },
  { k: "diwali", en: "Diwali", zh: "排灯节" },
  { k: "corporate", en: "Corporate", zh: "企业" },
  { k: "collector", en: "Collector", zh: "收藏" },
];

const PRICE_BANDS = [
  { k: "u5", en: "Under ₹5,000", zh: "₹5,000 以下", min: 0, max: 5000 },
  { k: "5-15", en: "₹5,000 – 15,000", zh: "₹5,000 – 15,000", min: 5000, max: 15000 },
  { k: "15-30", en: "₹15,000 – 30,000", zh: "₹15,000 – 30,000", min: 15000, max: 30000 },
  { k: "30+", en: "₹30,000 +", zh: "₹30,000 以上", min: 30000, max: Infinity },
];

type Sort = "featured" | "new" | "price-asc" | "price-desc" | "rating";

export function Catalog({ collection }: { collection?: CollectionSlug }) {
  const { l, t, zh } = useT();
  const all = useActiveProducts();
  const info = COLLECTIONS.find((c) => c.slug === collection);
  const [sort, setSort] = useState<Sort>("featured");
  const [occ, setOcc] = useState<string[]>([]);
  const [band, setBand] = useState<string | null>(null);
  const [inStock, setInStock] = useState(false);
  const [dense, setDense] = useState(false);
  const [panel, setPanel] = useState(false);

  const list = useMemo(() => {
    let r = all.filter((p) => !collection || p.collection === collection);
    if (occ.length) r = r.filter((p) => occ.some((o) => p.occasion?.includes(o)));
    const b = PRICE_BANDS.find((x) => x.k === band);
    if (b) r = r.filter((p) => p.price >= b.min && p.price < b.max);
    if (inStock) r = r.filter((p) => stockOf(p) > 0);
    const sorted = [...r];
    if (sort === "new") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "featured") sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.reviewCount - a.reviewCount);
    return sorted;
  }, [all, collection, occ, band, inStock, sort]);

  const activeFilters = occ.length + (band ? 1 : 0) + (inStock ? 1 : 0);

  return (
    <>
      <section className="relative overflow-hidden pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,rgba(158,47,31,.28),transparent_70%)]" />
        <div className="relative mx-auto grid max-w-[1600px] gap-10 px-5 pb-16 md:px-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <nav className="text-[10px] uppercase tracking-[0.24em] text-bone/40">
              <Link href="/" className="hover:text-bone">Santalum</Link> / <Link href="/collections" className="hover:text-bone">{t("nav.collections")}</Link>
              {info && <> / <span className="text-gold">{l(info.name)}</span></>}
            </nav>
            <Eyebrow className="mt-10">{info ? l(info.kicker) : zh ? "全部作品" : "All objects"}</Eyebrow>
            <h1 className="mt-5 font-display text-6xl font-light leading-[0.95] md:text-8xl">
              <SplitReveal text={info ? l(info.name) : zh ? "系列" : "The Collections"} immediate />
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="mt-6 max-w-lg text-[15px] leading-relaxed text-bone/60">
              {info ? l(info.blurb) : zh ? "五个系列，皆以同一种木材制作——小叶紫檀心材，逐件建档。" : "Five collections, one material — red sandalwood heartwood, every piece documented."}
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: EASE }} className="relative hidden aspect-[4/3] lg:block">
            <ProductVisual kind={info?.visual ?? "mala"} tone={0.45} seed={77} className="absolute inset-0 animate-float" />
          </motion.div>
        </div>
        <div className="no-scrollbar mx-auto flex max-w-[1600px] gap-2 overflow-x-auto px-5 md:px-10">
          <Link href="/collections" className={cn("shrink-0 rounded-full border px-4 py-2 text-xs transition-colors", !collection ? "border-bone bg-bone text-ink" : "border-bone/15 text-bone/70 hover:border-bone/50")}>
            {t("common.all")}
          </Link>
          {COLLECTIONS.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className={cn("shrink-0 rounded-full border px-4 py-2 text-xs transition-colors", collection === c.slug ? "border-bone bg-bone text-ink" : "border-bone/15 text-bone/70 hover:border-bone/50")}>
              {l(c.name)}
            </Link>
          ))}
        </div>
      </section>

      <div className="sticky top-[104px] z-30 mt-8 border-y border-bone/[0.06] bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-5 md:px-10">
          <button onClick={() => setPanel(true)} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bone/80 hover:text-bone">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.4} /> {t("common.filter")}
            {activeFilters > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-ember text-[10px] text-ink">{activeFilters}</span>}
          </button>
          <p className="hidden text-xs text-bone/40 sm:block">
            {list.length} {t("common.results")}
          </p>
          <div className="flex items-center gap-4">
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="cursor-pointer bg-transparent text-[11px] uppercase tracking-[0.18em] text-bone/80 outline-none">
              <option className="bg-umber" value="featured">{zh ? "精选" : "Featured"}</option>
              <option className="bg-umber" value="new">{zh ? "最新" : "Newest"}</option>
              <option className="bg-umber" value="price-asc">{zh ? "价格从低到高" : "Price: low to high"}</option>
              <option className="bg-umber" value="price-desc">{zh ? "价格从高到低" : "Price: high to low"}</option>
              <option className="bg-umber" value="rating">{zh ? "评分最高" : "Top rated"}</option>
            </select>
            <div className="hidden items-center gap-1 md:flex">
              <button onClick={() => setDense(false)} className={cn("p-1.5", !dense ? "text-bone" : "text-bone/30")} aria-label="Large grid">
                <Rows3 className="h-4 w-4" />
              </button>
              <button onClick={() => setDense(true)} className={cn("p-1.5", dense ? "text-bone" : "text-bone/30")} aria-label="Dense grid">
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1600px] px-5 pb-32 pt-12 md:px-10">
        <motion.div layout className={cn("grid gap-x-4 gap-y-14 md:gap-x-6", dense ? "grid-cols-2 md:grid-cols-4 xl:grid-cols-5" : "grid-cols-2 lg:grid-cols-3")}>
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, ease: EASE }}>
                <ProductCard p={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-3xl">{zh ? "没有符合条件的作品" : "Nothing matches — yet."}</p>
            <button onClick={() => { setOcc([]); setBand(null); setInStock(false); }} className="mt-4 text-xs uppercase tracking-[0.2em] text-gold">
              {zh ? "清除筛选" : "Clear filters"}
            </button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {panel && (
          <>
            <motion.div className="fixed inset-0 z-[80] bg-ink/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)} />
            <motion.aside data-lenis-prevent initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.7, ease: EASE }} className="fixed left-0 top-0 z-[81] flex h-dvh w-full max-w-[400px] flex-col border-r border-bone/10 bg-umber p-7">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl">{t("common.filter")}</h2>
                <button onClick={() => setPanel(false)} className="grid h-10 w-10 place-items-center rounded-full border border-bone/15" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="thin-scroll mt-8 flex-1 space-y-10 overflow-y-auto">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-bone/40">{zh ? "场合" : "Occasion"}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {OCCASIONS.map((o) => (
                      <button key={o.k} onClick={() => setOcc((x) => (x.includes(o.k) ? x.filter((y) => y !== o.k) : [...x, o.k]))} className={cn("rounded-full border px-3.5 py-2 text-xs transition-colors", occ.includes(o.k) ? "border-gold bg-gold/15 text-gold" : "border-bone/15 text-bone/70 hover:border-bone/40")}>
                        {zh ? o.zh : o.en}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-bone/40">{zh ? "价格" : "Price"}</p>
                  <div className="mt-4 space-y-1">
                    {PRICE_BANDS.map((b) => (
                      <button key={b.k} onClick={() => setBand(band === b.k ? null : b.k)} className="flex w-full items-center justify-between border-b border-bone/[0.06] py-3 text-sm">
                        <span className={band === b.k ? "text-bone" : "text-bone/65"}>{zh ? b.zh : b.en}</span>
                        <span className={cn("h-3.5 w-3.5 rounded-full border", band === b.k ? "border-gold bg-gold" : "border-bone/30")} />
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex cursor-pointer items-center justify-between text-sm">
                  <span>{zh ? "仅显示有货" : "In stock only"}</span>
                  <button onClick={() => setInStock((v) => !v)} className={cn("relative h-6 w-11 rounded-full transition-colors", inStock ? "bg-gold" : "bg-bone/15")} role="switch" aria-checked={inStock}>
                    <motion.span layout className={cn("absolute top-1 h-4 w-4 rounded-full bg-ink", inStock ? "right-1" : "left-1")} />
                  </button>
                </label>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => { setOcc([]); setBand(null); setInStock(false); }} className="h-12 flex-1 rounded-full border border-bone/20 text-[11px] uppercase tracking-[0.2em]">
                  {zh ? "清除" : "Clear"}
                </button>
                <button onClick={() => setPanel(false)} className="h-12 flex-1 rounded-full bg-bone text-[11px] uppercase tracking-[0.2em] text-ink">
                  {zh ? `查看 ${list.length} 件` : `Show ${list.length}`}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
