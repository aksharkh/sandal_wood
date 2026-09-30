"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useShop, useT } from "@/lib/store";
import { Photo, Reveal, Tilt } from "../motion/primitives";
import { cn, stockOf } from "@/lib/utils";

export function ProductCard({ p, index = 0, tone = "light" }: { p: Product; index?: number; tone?: "light" | "dark" }) {
  const { l, m, t, zh } = useT();
  const wished = useShop((s) => s.wishlist.includes(p.id));
  const toggleWish = useShop((s) => s.toggleWish);
  const addToCart = useShop((s) => s.addToCart);
  const setBagOpen = useShop((s) => s.setBagOpen);
  const [added, setAdded] = useState(false);
  const minPrice = p.price + Math.min(...p.variants.map((v) => v.priceDelta));
  const hasRange = p.variants.some((v) => v.priceDelta !== p.variants[0].priceDelta);
  const stock = stockOf(p);
  const second = p.images?.[1];
  const note = stock > 0 && stock <= 8 ? (zh ? "仅剩少量" : "Few remaining") : p.tags.includes("limited") ? (zh ? "限量" : "Limited edition") : p.tags.includes("new") ? (zh ? "新品" : "New") : null;
  const dark = tone === "dark";

  return (
    <Reveal delay={(index % 4) * 0.07} className="group relative">
      <Tilt className="rounded-[24px]" max={6}>
        <div className="relative overflow-hidden rounded-[24px]">
          <Link href={`/product/${p.slug}`} className="block">
            <Photo src={p.images?.[0]} alt={l(p.name)} className="aspect-[4/5]" sizes="(min-width: 1024px) 25vw, 50vw" zoom />
            {second && (
              <Image
                src={second}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                unoptimized={second.startsWith("data:")}
              />
            )}
          </Link>
          {note && <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-medium text-ink">{note}</span>}
          <button onClick={() => toggleWish(p.id)} aria-label={t("nav.wishlist")} className={cn("glass absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-ink transition-opacity", wished ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
            <Heart className={cn("h-4 w-4", wished && "fill-vermilion text-vermilion")} strokeWidth={1.6} />
          </button>
          <button
            onClick={() => {
              addToCart(p.id, p.variants.find((v) => v.stock > 0)?.id ?? p.variants[0].id);
              setAdded(true);
              setTimeout(() => setAdded(false), 1400);
              setTimeout(() => setBagOpen(true), 300);
            }}
            className="glass absolute bottom-3 right-3 flex h-10 items-center gap-2 rounded-full pl-4 pr-1.5 text-[12px] font-medium text-ink opacity-0 transition-all duration-500 ease-[var(--ease-lux)] group-hover:opacity-100 max-md:opacity-100"
          >
            <span className="hidden md:inline">{added ? t("cta.added") : t("cta.add")}</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-cream">
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </button>
        </div>
      </Tilt>
      <Link href={`/product/${p.slug}`} className="mt-4 flex items-start justify-between gap-4 px-1">
        <span className="min-w-0">
          <span className={cn("block font-display text-[18px] font-light leading-tight tracking-[-0.01em]", dark ? "text-cream" : "text-ink")}>{l(p.name)}</span>
          <span className={cn("mt-1 block truncate text-[12px]", dark ? "text-rose" : "text-muted")}>{l(p.subtitle)}</span>
        </span>
        <span className={cn("shrink-0 pt-0.5 text-[13px] tabular-nums", dark ? "text-cream" : "text-ink")}>
          {hasRange && <span className={dark ? "text-rose" : "text-muted"}>{t("common.from")} </span>}
          {m(minPrice)}
        </span>
      </Link>
    </Reveal>
  );
}
