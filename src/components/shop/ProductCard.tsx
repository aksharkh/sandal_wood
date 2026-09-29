"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useShop, useT } from "@/lib/store";
import { Photo, Reveal } from "../motion/primitives";
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
  const note = stock > 0 && stock <= 8 ? (zh ? "仅剩少量" : "Few remaining") : p.tags.includes("limited") ? (zh ? "限量" : "Limited") : p.tags.includes("new") ? (zh ? "新品" : "New") : null;

  return (
    <Reveal delay={(index % 4) * 0.07} className="group relative">
      <div className="relative">
        <Link href={`/product/${p.slug}`} className="block">
          <div className="relative">
            <Photo src={p.images?.[0]} alt={l(p.name)} shape="arch" className="aspect-[3/4]" sizes="(min-width: 1024px) 25vw, 50vw" />
            {second && (
              <div className="arch absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <Image src={second} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="scale-105 object-cover transition-transform duration-[1.4s] group-hover:scale-100" unoptimized={second.startsWith("data:")} />
              </div>
            )}
          </div>
        </Link>
        {note && (
          <span className="absolute left-1/2 top-[18%] -translate-x-1/2 rounded-full bg-paper/90 px-3 py-1 text-[11px] text-ink backdrop-blur">{note}</span>
        )}
        <button
          onClick={() => toggleWish(p.id)}
          aria-label={t("nav.wishlist")}
          className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition-colors hover:bg-paper"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-clay text-clay")} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => {
            addToCart(p.id, p.variants.find((v) => v.stock > 0)?.id ?? p.variants[0].id);
            setAdded(true);
            setTimeout(() => setAdded(false), 1400);
            setTimeout(() => setBagOpen(true), 300);
          }}
          aria-label={t("cta.add")}
          className="absolute bottom-3 right-3 flex h-9 items-center overflow-hidden rounded-full bg-ink text-cream transition-all duration-500 ease-[var(--ease-lux)] hover:bg-clay"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center">
            <Plus className={cn("h-4 w-4 transition-transform duration-500", added && "rotate-45")} />
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[12px] transition-all duration-500 group-hover:max-w-[120px] group-hover:pr-4">
            {added ? t("cta.added") : t("cta.add")}
          </span>
        </button>
      </div>
      <Link href={`/product/${p.slug}`} className="mt-5 block text-center">
        <h3 className={cn("font-display text-[22px] leading-tight transition-colors", tone === "dark" ? "text-cream" : "group-hover:text-clay")}>{l(p.name)}</h3>
        <p className={cn("mt-1 text-[12px]", tone === "dark" ? "text-rose" : "text-muted")}>{l(p.subtitle)}</p>
        <p className={cn("mt-2 text-[14px] tabular-nums", tone === "dark" ? "text-cream" : "text-ink")}>
          {hasRange && <span className={tone === "dark" ? "text-rose" : "text-muted"}>{t("common.from")} </span>}
          {m(minPrice)}
          {p.compareAt && <span className={cn("ml-2 line-through", tone === "dark" ? "text-rose" : "text-muted")}>{m(p.compareAt)}</span>}
        </p>
      </Link>
    </Reveal>
  );
}
