"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useShop, useT } from "@/lib/store";
import { Photo, Reveal } from "../motion/primitives";
import { cn, stockOf } from "@/lib/utils";

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
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
  const tag = p.badges?.[0];

  return (
    <Reveal delay={(index % 4) * 0.06} className="group relative">
      <div className="relative">
        <Link href={`/product/${p.slug}`} className="block">
          <Photo src={p.images?.[0]} alt={l(p.name)} className="aspect-[4/5]" sizes="(min-width: 1024px) 25vw, 50vw" />
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
        {(tag || (stock > 0 && stock <= 8)) && (
          <span className="absolute left-3 top-3 bg-paper px-2 py-1 text-[11px] text-ink">
            {stock > 0 && stock <= 8 ? (zh ? "仅剩少量" : "Few remaining") : l(tag)}
          </span>
        )}
        <button onClick={() => toggleWish(p.id)} aria-label={t("nav.wishlist")} className="absolute right-3 top-3 grid h-8 w-8 place-items-center bg-paper/90 text-ink">
          <Heart className={cn("h-4 w-4", wished && "fill-clay text-clay")} strokeWidth={1.4} />
        </button>
        <button
          onClick={() => {
            addToCart(p.id, p.variants.find((v) => v.stock > 0)?.id ?? p.variants[0].id);
            setAdded(true);
            setTimeout(() => setAdded(false), 1400);
            setTimeout(() => setBagOpen(true), 300);
          }}
          className="absolute inset-x-3 bottom-3 h-10 translate-y-2 bg-paper text-[12px] font-medium text-ink opacity-0 transition-all duration-300 hover:bg-ink hover:text-page group-hover:translate-y-0 group-hover:opacity-100"
        >
          {added ? t("cta.added") : t("cta.add")}
        </button>
      </div>
      <Link href={`/product/${p.slug}`} className="mt-4 block">
        <h3 className="text-[14px] font-medium">{l(p.name)}</h3>
        <p className="mt-0.5 text-[13px] text-muted">{l(p.subtitle)}</p>
        <p className="mt-1.5 text-[14px] tabular-nums">
          {hasRange && <span className="text-muted">{t("common.from")} </span>}
          {m(minPrice)}
          {p.compareAt && <span className="ml-2 text-muted line-through">{m(p.compareAt)}</span>}
        </p>
      </Link>
    </Reveal>
  );
}
