"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button, EASE, Heading, Label, Photo } from "../motion/primitives";
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
  { k: "30+", en: "Above ₹30,000", zh: "₹30,000 以上", min: 30000, max: Infinity },
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
  const clear = () => {
    setOcc([]);
    setBand(null);
    setInStock(false);
  };

  return (
    <>
      <section className="bg-page">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-12 pt-10 md:px-10 lg:grid-cols-12">
          <div className="flex flex-col justify-end lg:col-span-6">
            <nav className="text-[12px] text-muted">
              <Link href="/" className="hover:text-ink">Santalum</Link> / <Link href="/collections" className="hover:text-ink">{t("nav.collections")}</Link>
              {info && <> / <span className="text-ink">{l(info.name)}</span></>}
            </nav>
            <Heading as="h1" className="mt-8 text-[clamp(3rem,6vw,6rem)]">{info ? l(info.name) : zh ? "全部作品" : "All objects"}</Heading>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-graphite">
              {info ? l(info.blurb) : zh ? "五个系列，同一种木材——小叶紫檀心材，逐件建档。" : "Five collections in one material — red sandalwood heartwood, every piece documented."}
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Photo src={info?.image ?? "/images/p-grain-red.jpg"} alt={info?.name.en ?? "Red sandalwood"} priority className="aspect-[4/3]" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </div>
      </section>

      <div className="sticky top-[84px] z-30 py-2">
        <div className="mx-3 flex h-14 max-w-[1440px] items-center justify-between gap-4 rounded-full border border-white/60 bg-paper/80 pl-2 pr-5 text-[13px] shadow-[0_20px_50px_-35px_rgba(60,20,10,.4)] backdrop-blur-xl md:mx-auto md:w-[calc(100%-5rem)]">
          <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
            <Link href="/collections" className={cn("shrink-0 rounded-full px-4 py-2 text-[13px] transition-colors", !collection ? "bg-ink text-cream" : "text-graphite hover:bg-ink/5")}>
              {t("common.all")}
            </Link>
            {COLLECTIONS.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className={cn("shrink-0 rounded-full px-4 py-2 text-[13px] transition-colors", collection === c.slug ? "bg-ink text-cream" : "text-graphite hover:bg-ink/5")}>
                {l(c.name)}
              </Link>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-6">
            <span className="hidden text-muted md:inline">{list.length} {t("common.results")}</span>
            <button onClick={() => setPanel(true)} className="text-ink">
              {t("common.filter")}
              {activeFilters > 0 && ` (${activeFilters})`}
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="cursor-pointer bg-transparent text-ink outline-none" aria-label={t("common.sort")}>
              <option value="featured">{zh ? "精选" : "Featured"}</option>
              <option value="new">{zh ? "最新" : "Newest"}</option>
              <option value="price-asc">{zh ? "价格从低到高" : "Price, low to high"}</option>
              <option value="price-desc">{zh ? "价格从高到低" : "Price, high to low"}</option>
              <option value="rating">{zh ? "评分最高" : "Top rated"}</option>
            </select>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1440px] px-5 pb-28 pt-16 md:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-16 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </div>
        {list.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-3xl">{zh ? "没有符合条件的作品" : "Nothing matches these filters"}</p>
            <button onClick={clear} className="mt-4 text-[13px] underline underline-offset-4">{zh ? "清除筛选" : "Clear filters"}</button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {panel && (
          <>
            <motion.div className="fixed inset-0 z-[80] bg-ink/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)} />
            <motion.aside data-lenis-prevent initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.45, ease: EASE }} className="fixed right-0 top-0 z-[81] flex h-dvh w-full max-w-[400px] flex-col bg-paper">
              <div className="flex items-center justify-between border-b border-line px-7 py-5">
                <h2 className="text-[13px] font-medium">{t("common.filter")}</h2>
                <button onClick={() => setPanel(false)} aria-label="Close"><X className="h-5 w-5" strokeWidth={1.4} /></button>
              </div>
              <div className="thin-scroll flex-1 space-y-10 overflow-y-auto px-7 py-8 text-[14px]">
                <fieldset>
                  <Label>{zh ? "场合" : "Occasion"}</Label>
                  <div className="mt-4 space-y-3">
                    {OCCASIONS.map((o) => (
                      <label key={o.k} className="flex cursor-pointer items-center gap-3">
                        <input type="checkbox" checked={occ.includes(o.k)} onChange={() => setOcc((x) => (x.includes(o.k) ? x.filter((y) => y !== o.k) : [...x, o.k]))} className="h-4 w-4 accent-[#1c1a17]" />
                        {zh ? o.zh : o.en}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <Label>{zh ? "价格" : "Price"}</Label>
                  <div className="mt-4 space-y-3">
                    {PRICE_BANDS.map((b) => (
                      <label key={b.k} className="flex cursor-pointer items-center gap-3">
                        <input type="radio" name="band" checked={band === b.k} onChange={() => setBand(b.k)} className="h-4 w-4 accent-[#1c1a17]" />
                        {zh ? b.zh : b.en}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-[#1c1a17]" />
                  {zh ? "仅显示有货" : "In stock only"}
                </label>
              </div>
              <div className="flex gap-3 border-t border-line px-7 py-5">
                <Button variant="outline" className="flex-1" onClick={clear}>{zh ? "清除" : "Clear"}</Button>
                <Button className="flex-1" onClick={() => setPanel(false)}>{zh ? `查看 ${list.length} 件` : `Show ${list.length}`}</Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
