"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Gift, Heart, Minus, Plus, ShieldCheck, Truck, X } from "lucide-react";
import { usePlacement, useShop, useT } from "@/lib/store";
import { quote, regionFromCurrency, useCart } from "@/lib/cart";

import { ProductCard } from "@/components/shop/ProductCard";
import { EASE, Button, Heading, ProductPhoto } from "@/components/motion/primitives";

export default function BagPage() {
  const { t, l, m, zh, currency } = useT();
  const lines = useCart();
  const setQty = useShop((s) => s.setQty);
  const removeLine = useShop((s) => s.removeLine);
  const toggleGift = useShop((s) => s.toggleGift);
  const toggleWish = useShop((s) => s.toggleWish);
  const q = quote(lines, regionFromCurrency(currency));
  const upsell = usePlacement("bag-upsell")
    .filter((p) => !lines.some((l) => l.productId === p.id))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-12 md:px-10">
      <Heading as="h1" className="text-5xl md:text-6xl">
        {t("bag.title")}
      </Heading>
      {lines.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl">{t("bag.empty")}</p>
          <p className="mt-3 text-graphite">{t("bag.emptySub")}</p>
          <Button href="/collections" className="mt-8">
            {t("cta.shop")}
          </Button>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px]">
          <ul className="divide-y divide-line border-y border-line">
            <AnimatePresence initial={false}>
              {lines.map((ln) => (
                <motion.li
                  key={ln.productId + ln.variantId}
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex gap-6 overflow-hidden py-8"
                >
                  <Link href={`/product/${ln.product.slug}`} className="h-40 w-32 shrink-0 overflow-hidden bg-paper sm:h-44 sm:w-40">
                    <ProductPhoto p={ln.product} className="h-full w-full" sizes="160px" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link href={`/product/${ln.product.slug}`} className="font-display text-2xl hover:underline hover:underline-offset-4">
                          {l(ln.product.name)}
                        </Link>
                        <p className="mt-1 text-sm text-graphite">{l(ln.variant.label)}</p>
                        <p className="mt-1 font-mono text-[12px] text-muted">
                          {ln.variant.sku} · {ln.product.provenance.batch}
                        </p>
                      </div>
                      <button
                        onClick={() => removeLine(ln.productId, ln.variantId)}
                        aria-label={t("bag.remove")}
                        className="h-8 w-8 shrink-0 text-muted hover:text-ink"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          className="grid h-10 w-10 place-items-center"
                          onClick={() => setQty(ln.productId, ln.variantId, ln.qty - 1)}
                          aria-label="Decrease"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{ln.qty}</span>
                        <button
                          className="grid h-10 w-10 place-items-center"
                          onClick={() => setQty(ln.productId, ln.variantId, ln.qty + 1)}
                          aria-label="Increase"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-5 text-[12px] uppercase tracking-[0.16em]">
                        <button
                          onClick={() => toggleGift(ln.productId, ln.variantId)}
                          className={
                            ln.giftWrap
                              ? "flex items-center gap-1.5 text-ink underline underline-offset-4"
                              : "flex items-center gap-1.5 text-muted hover:text-ink"
                          }
                        >
                          <Gift className="h-3.5 w-3.5" /> {t("bag.giftWrap")}
                        </button>
                        <button
                          onClick={() => {
                            toggleWish(ln.productId);
                            removeLine(ln.productId, ln.variantId);
                          }}
                          className="flex items-center gap-1.5 text-muted hover:text-ink"
                        >
                          <Heart className="h-3.5 w-3.5" /> {zh ? "移至心愿单" : "Save for later"}
                        </button>
                      </div>
                      <p className="font-display text-2xl">{m(ln.line)}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-paper p-7">
              <dl className="space-y-2 text-sm text-graphite">
                <div className="flex justify-between">
                  <dt>{t("bag.subtotal")}</dt>
                  <dd>{m(q.subtotal)}</dd>
                </div>
                {q.wrap > 0 && (
                  <div className="flex justify-between">
                    <dt>{t("bag.giftWrap")}</dt>
                    <dd>{m(q.wrap)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>{t("bag.shipping")}</dt>
                  <dd>{q.shipping ? m(q.shipping) : t("bag.free")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{q.taxIncluded ? (zh ? "含商品及服务税" : "Includes GST") : t("bag.tax")}</dt>
                  <dd>{m(q.tax)}</dd>
                </div>
              </dl>
              <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                <span className="text-[12px]">{t("bag.total")}</span>
                <span className="font-display text-3xl">{m(q.total)}</span>
              </div>
              <Button href="/checkout" className="mt-6 w-full" size="lg">
                {t("cta.checkout")}
              </Button>
              <div className="mt-6 space-y-3 text-xs text-graphite">
                <p className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-ink" strokeWidth={1.3} /> {zh ? "全程保价配送" : "Fully insured delivery"}
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-ink" strokeWidth={1.3} /> {zh ? "附真品证书与溯源卡" : "Certificate & provenance card included"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
      {upsell.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-4xl">{zh ? "完整您的仪式" : "Complete the ritual"}</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {upsell.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
