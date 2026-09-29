"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Gift, Minus, Plus, X } from "lucide-react";
import { useEffect } from "react";
import { usePlacement, useShop, useT } from "@/lib/store";
import { FREE_SHIP_INDIA, quote, regionFromCurrency, useCart } from "@/lib/cart";
import { ProductVisual } from "../visual/ProductVisual";
import { EASE, LuxButton } from "../motion/primitives";

export function BagDrawer() {
  const { t, l, m, zh, currency } = useT();
  const open = useShop((s) => s.bagOpen);
  const setOpen = useShop((s) => s.setBagOpen);
  const setQty = useShop((s) => s.setQty);
  const removeLine = useShop((s) => s.removeLine);
  const toggleGift = useShop((s) => s.toggleGift);
  const addToCart = useShop((s) => s.addToCart);
  const lines = useCart();
  const region = regionFromCurrency(currency);
  const q = quote(lines, region);

  const upsellShown = usePlacement("bag-upsell")
    .filter((p) => !lines.some((x) => x.productId === p.id))
    .slice(0, 2);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const progress = Math.min(1, q.subtotal / FREE_SHIP_INDIA);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[80] bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            data-lenis-prevent
            className="fixed right-0 top-0 z-[81] flex h-dvh w-full max-w-[480px] flex-col border-l border-bone/10 bg-umber"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="flex items-center justify-between px-7 pb-5 pt-7">
              <div>
                <h2 className="font-display text-3xl">{t("bag.title")}</h2>
                <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-bone/50">
                  {(() => {
                    const n = lines.reduce((sum, x) => sum + x.qty, 0);
                    return zh ? `${n} 件` : `${n} ${n === 1 ? "piece" : "pieces"}`;
                  })()}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-bone/15 hover:border-bone/50" aria-label="Close">
                <X className="h-4 w-4" strokeWidth={1.4} />
              </button>
            </div>

            {region === "India" && lines.length > 0 && (
              <div className="mx-7 mb-4">
                <p className="text-xs text-bone/60">
                  {progress >= 1
                    ? zh
                      ? "您已享受免费保价配送"
                      : "You've unlocked complimentary insured delivery."
                    : zh
                      ? `再购 ${m(FREE_SHIP_INDIA - q.subtotal)} 即享免费配送`
                      : `${m(FREE_SHIP_INDIA - q.subtotal)} away from complimentary delivery.`}
                </p>
                <div className="mt-2 h-px w-full bg-bone/10">
                  <motion.div className="h-px bg-gradient-to-r from-santal to-gold" initial={{ width: 0 }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 1, ease: EASE }} />
                </div>
              </div>
            )}

            <div className="thin-scroll flex-1 overflow-y-auto px-7">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ProductVisual kind="bracelet" tone={0.4} className="h-48 w-48 opacity-70" />
                  <p className="mt-4 font-display text-2xl">{t("bag.empty")}</p>
                  <p className="mt-2 max-w-xs text-sm text-bone/50">{t("bag.emptySub")}</p>
                  <LuxButton href="/collections" onClick={() => setOpen(false)} className="mt-8" variant="ghost">
                    {t("cta.shop")}
                  </LuxButton>
                </div>
              ) : (
                <ul className="divide-y divide-bone/[0.07]">
                  <AnimatePresence initial={false}>
                    {lines.map((ln) => (
                      <motion.li
                        key={ln.productId + ln.variantId}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="flex gap-4 overflow-hidden py-5"
                      >
                        <Link href={`/product/${ln.product.slug}`} onClick={() => setOpen(false)} className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-ink">
                          <ProductVisual kind={ln.product.visual} tone={ln.product.tone} image={ln.product.images?.[0]} className="h-full w-full" glow={false} />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate font-display text-lg leading-tight">{l(ln.product.name)}</p>
                              <p className="mt-0.5 text-xs text-bone/50">{l(ln.variant.label)}</p>
                            </div>
                            <p className="shrink-0 text-sm">{m(ln.line)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center rounded-full border border-bone/15">
                              <button className="grid h-8 w-8 place-items-center text-bone/70 hover:text-bone" onClick={() => setQty(ln.productId, ln.variantId, ln.qty - 1)} aria-label="Decrease">
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center text-xs tabular-nums">{ln.qty}</span>
                              <button className="grid h-8 w-8 place-items-center text-bone/70 hover:text-bone" onClick={() => setQty(ln.productId, ln.variantId, ln.qty + 1)} aria-label="Increase">
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => toggleGift(ln.productId, ln.variantId)}
                              className={`flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${ln.giftWrap ? "text-gold" : "text-bone/40 hover:text-bone/80"}`}
                            >
                              <Gift className="h-3.5 w-3.5" strokeWidth={1.4} /> {t("bag.giftWrap")}
                            </button>
                            <button onClick={() => removeLine(ln.productId, ln.variantId)} className="text-[10px] uppercase tracking-[0.16em] text-bone/40 underline-offset-4 hover:text-danger hover:underline">
                              {t("bag.remove")}
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {lines.length > 0 && upsellShown.length > 0 && (
                <div className="mb-6 mt-2 rounded-2xl border border-bone/[0.07] p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gold">{zh ? "完整您的仪式" : "Complete the ritual"}</p>
                  <div className="mt-3 space-y-3">
                    {upsellShown.map((p) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ink">
                          <ProductVisual kind={p.visual} tone={p.tone} className="h-full w-full" glow={false} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{l(p.name)}</p>
                          <p className="text-xs text-bone/50">{m(p.price + p.variants[0].priceDelta)}</p>
                        </div>
                        <button
                          onClick={() => addToCart(p.id, p.variants[0].id)}
                          className="rounded-full border border-bone/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] hover:border-gold hover:text-gold"
                        >
                          + {zh ? "添加" : "Add"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-bone/10 px-7 pb-7 pt-5">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-bone/60">
                    <dt>{t("bag.subtotal")}</dt>
                    <dd>{m(q.subtotal)}</dd>
                  </div>
                  {q.wrap > 0 && (
                    <div className="flex justify-between text-bone/60">
                      <dt>{t("bag.giftWrap")}</dt>
                      <dd>{m(q.wrap)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-bone/60">
                    <dt>{t("bag.shipping")}</dt>
                    <dd>{q.shipping === 0 ? t("bag.free") : m(q.shipping)}</dd>
                  </div>
                  {q.tax > 0 && (
                    <div className="flex justify-between text-bone/60">
                      <dt>{region === "China" ? (zh ? "跨境综合税" : "Cross-border tax") : zh ? "含商品及服务税" : "Includes GST"}</dt>
                      <dd>{m(q.tax)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 font-display text-2xl">
                    <dt>{t("bag.total")}</dt>
                    <dd>{m(q.total)}</dd>
                  </div>
                </dl>
                <p className="mt-1 text-[11px] text-bone/40">
                  {region === "China"
                    ? zh
                      ? "含跨境综合税（9.1%），清关由我们代为办理"
                      : "Includes cross-border tax (9.1%) — duties prepaid, we handle customs."
                    : region === "India"
                      ? zh
                        ? "印度境内全程保价配送"
                        : "Fully insured delivery across India."
                      : "Duties may apply on delivery."}
                </p>
                <LuxButton href="/checkout" onClick={() => setOpen(false)} className="mt-5 w-full" size="lg" magnetic={false}>
                  {t("cta.checkout")} →
                </LuxButton>
                <Link href="/bag" onClick={() => setOpen(false)} className="mt-3 block text-center text-[10px] uppercase tracking-[0.24em] text-bone/50 hover:text-bone">
                  {zh ? "查看完整购物袋" : "View full bag"}
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
