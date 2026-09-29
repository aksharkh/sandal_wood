"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Plus, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useShop, useT } from "@/lib/store";
import { ProductVisual } from "../visual/ProductVisual";
import { EASE } from "../motion/primitives";
import { cn, stockOf } from "@/lib/utils";

export function ProductCard({ p, index = 0, size = "md" }: { p: Product; index?: number; size?: "md" | "lg" }) {
  const { l, m, t, zh } = useT();
  const wished = useShop((s) => s.wishlist.includes(p.id));
  const toggleWish = useShop((s) => s.toggleWish);
  const addToCart = useShop((s) => s.addToCart);
  const setBagOpen = useShop((s) => s.setBagOpen);
  const [added, setAdded] = useState(false);
  const minPrice = p.price + Math.min(...p.variants.map((v) => v.priceDelta));
  const hasRange = p.variants.some((v) => v.priceDelta !== p.variants[0].priceDelta);
  const stock = stockOf(p);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 1, ease: EASE, delay: (index % 4) * 0.08 }}
      className="group relative"
    >
      <Link href={`/product/${p.slug}`} className="block">
        <div className={cn("relative overflow-hidden rounded-[22px] bg-gradient-to-b from-cocoa to-umber", size === "lg" ? "aspect-[4/5]" : "aspect-[4/5]")}>
          <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" style={{ background: "radial-gradient(70% 60% at 50% 45%, rgba(200,85,58,.28), transparent 70%)" }} />
          <ProductVisual
            kind={p.visual}
            tone={p.tone}
            seed={Number(p.id.slice(1))}
            image={p.images?.[0]}
            label={l(p.name)}
            glow={false}
            className="absolute inset-[6%] transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.07] group-hover:-rotate-2"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            {p.badges?.slice(0, 2).map((b) => (
              <span key={b.en} className="rounded-full border border-gold/30 bg-ink/40 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-gold backdrop-blur">
                {l(b)}
              </span>
            ))}
            {stock > 0 && stock <= 8 && (
              <span className="rounded-full bg-ember/15 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-blush backdrop-blur">{t("pdp.low")}</span>
            )}
          </div>
          <div className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between opacity-0 transition-all duration-500 ease-[var(--ease-lux)] group-hover:translate-y-0 group-hover:opacity-100">
            <span className="font-mono text-[10px] text-bone/50">{p.provenance.batch}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-bone/80">{zh ? "查看" : "Discover"} →</span>
          </div>
        </div>
      </Link>

      <button
        onClick={() => toggleWish(p.id)}
        aria-label={t("nav.wishlist")}
        className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ink/40 backdrop-blur transition-colors hover:bg-ink/70"
      >
        <motion.span animate={{ scale: wished ? [1, 1.35, 1] : 1 }} transition={{ duration: 0.4 }}>
          <Heart className={cn("h-4 w-4", wished ? "fill-ember text-ember" : "text-bone/80")} strokeWidth={1.4} />
        </motion.span>
      </button>

      <div className="mt-4 flex items-start justify-between gap-3">
        <Link href={`/product/${p.slug}`} className="min-w-0">
          <h3 className="font-display text-[22px] leading-tight text-bone">{l(p.name)}</h3>
          <p className="mt-1 truncate text-xs text-bone/50">{l(p.subtitle)}</p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span>
              {hasRange && <span className="text-bone/50">{t("common.from")} </span>}
              {m(minPrice)}
            </span>
            {p.compareAt && <span className="text-xs text-bone/35 line-through">{m(p.compareAt)}</span>}
            <span className="flex items-center gap-1 text-xs text-bone/50">
              <Star className="h-3 w-3 fill-gold text-gold" /> {p.rating.toFixed(1)}
            </span>
          </div>
        </Link>
        <button
          onClick={() => {
            addToCart(p.id, p.variants.find((v) => v.stock > 0)?.id ?? p.variants[0].id);
            setAdded(true);
            setTimeout(() => setAdded(false), 1400);
            setTimeout(() => setBagOpen(true), 350);
          }}
          aria-label={t("cta.add")}
          className={cn(
            "mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500",
            added ? "border-gold bg-gold text-ink" : "border-bone/20 text-bone hover:border-bone hover:bg-bone hover:text-ink",
          )}
        >
          <Plus className={cn("h-4 w-4 transition-transform duration-500", added && "rotate-45")} strokeWidth={1.5} />
        </button>
      </div>
    </motion.article>
  );
}
