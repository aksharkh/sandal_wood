"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import { useEffect } from "react";
import { usePlacement, useShop, useT } from "@/lib/store";
import { FREE_SHIP_INDIA, quote, regionFromCurrency, useCart } from "@/lib/cart";
import { Button, EASE, ProductPhoto } from "../motion/primitives";

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
  const upsell = usePlacement("bag-upsell")
    .filter((p) => !lines.some((x) => x.productId === p.id))
    .slice(0, 2);
  const count = lines.reduce((sum, x) => sum + x.qty, 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[80] bg-ink/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            data-lenis-prevent
            className="fixed right-0 top-0 z-[81] flex h-dvh w-full max-w-[460px] flex-col bg-paper text-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-line px-7 py-5">
              <h2 className="text-[13px] font-medium">
                {t("bag.title")} <span className="text-muted">({zh ? `${count} 件` : count})</span>
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-graphite hover:text-ink">
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>

            {region === "India" && lines.length > 0 && (
              <p className="border-b border-line bg-page px-7 py-3 text-[12px] text-graphite">
                {q.subtotal >= FREE_SHIP_INDIA
                  ? zh ? "您的订单享受免费保价配送。" : "Your order ships free, fully insured."
                  : zh ? `再购 ${m(FREE_SHIP_INDIA - q.subtotal)} 即享免费配送。` : `Add ${m(FREE_SHIP_INDIA - q.subtotal)} for complimentary delivery.`}
              </p>
            )}

            <div className="thin-scroll flex-1 overflow-y-auto px-7">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-3xl">{t("bag.empty")}</p>
                  <p className="mt-3 max-w-xs text-[14px] text-graphite">{t("bag.emptySub")}</p>
                  <Button href="/collections" onClick={() => setOpen(false)} className="mt-8" variant="outline">
                    {t("cta.shop")}
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {lines.map((ln) => (
                    <li key={ln.productId + ln.variantId} className="flex gap-5 py-6">
                      <Link href={`/product/${ln.product.slug}`} onClick={() => setOpen(false)} className="group block w-24 shrink-0">
                        <ProductPhoto p={ln.product} className="aspect-[4/5]" sizes="96px" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col text-[14px]">
                        <div className="flex justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium">{l(ln.product.name)}</p>
                            <p className="mt-0.5 text-[13px] text-muted">{l(ln.variant.label)}</p>
                          </div>
                          <p className="shrink-0 tabular-nums">{m(ln.line)}</p>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3 text-[12px]">
                          <div className="flex items-center border border-line">
                            <button className="grid h-8 w-8 place-items-center" onClick={() => setQty(ln.productId, ln.variantId, ln.qty - 1)} aria-label="Decrease">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center tabular-nums">{ln.qty}</span>
                            <button className="grid h-8 w-8 place-items-center" onClick={() => setQty(ln.productId, ln.variantId, ln.qty + 1)} aria-label="Increase">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <label className="flex cursor-pointer items-center gap-2 text-graphite">
                            <input type="checkbox" checked={!!ln.giftWrap} onChange={() => toggleGift(ln.productId, ln.variantId)} className="accent-[#1c1a17]" />
                            {t("bag.giftWrap")}
                          </label>
                          <button onClick={() => removeLine(ln.productId, ln.variantId)} className="text-muted underline underline-offset-4 hover:text-ink">
                            {t("bag.remove")}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {lines.length > 0 && upsell.length > 0 && (
                <div className="border-t border-line py-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{zh ? "搭配推荐" : "You may also consider"}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {upsell.map((p) => (
                      <div key={p.id} className="group">
                        <ProductPhoto p={p} className="aspect-square" sizes="180px" />
                        <p className="mt-2 text-[13px]">{l(p.name)}</p>
                        <div className="flex items-center justify-between text-[13px] text-muted">
                          {m(p.price + p.variants[0].priceDelta)}
                          <button onClick={() => addToCart(p.id, p.variants[0].id)} className="text-ink underline underline-offset-4">
                            {zh ? "添加" : "Add"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-7 pb-7 pt-5 text-[14px]">
                <dl className="space-y-1.5 text-graphite">
                  <div className="flex justify-between"><dt>{t("bag.subtotal")}</dt><dd className="tabular-nums">{m(q.subtotal)}</dd></div>
                  {q.wrap > 0 && <div className="flex justify-between"><dt>{t("bag.giftWrap")}</dt><dd className="tabular-nums">{m(q.wrap)}</dd></div>}
                  <div className="flex justify-between"><dt>{t("bag.shipping")}</dt><dd>{q.shipping === 0 ? t("bag.free") : m(q.shipping)}</dd></div>
                  {q.tax > 0 && (
                    <div className="flex justify-between">
                      <dt>{region === "China" ? (zh ? "跨境综合税" : "Cross-border tax") : zh ? "含商品及服务税" : "Includes GST"}</dt>
                      <dd className="tabular-nums">{m(q.tax)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-[16px] font-medium text-ink"><dt>{t("bag.total")}</dt><dd className="tabular-nums">{m(q.total)}</dd></div>
                </dl>
                <Button href="/checkout" onClick={() => setOpen(false)} className="mt-5 w-full" size="lg">
                  {t("cta.checkout")}
                </Button>
                <Link href="/bag" onClick={() => setOpen(false)} className="mt-3 block text-center text-[13px] text-graphite underline underline-offset-4 hover:text-ink">
                  {zh ? "查看购物袋" : "View bag"}
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
