"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useMemo, useState } from "react";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { useMaison, usePlacement, useProduct, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { reviewsFor } from "@/lib/data/reviews";
import { ProductCard } from "./ProductCard";
import { Button, EASE, Heading, Label, Photo } from "../motion/primitives";
import { Reviews } from "./Reviews";
import { cn, priceOf } from "@/lib/utils";

export function ProductDetail({ slug }: { slug: string }) {
  const p = useProduct(slug);
  const { t, l, m, zh, currency } = useT();
  const router = useRouter();
  const addToCart = useShop((s) => s.addToCart);
  const setBagOpen = useShop((s) => s.setBagOpen);
  const wished = useShop((s) => (p ? s.wishlist.includes(p.id) : false));
  const toggleWish = useShop((s) => s.toggleWish);
  const products = useMaison((s) => s.products);
  const pairs = usePlacement("pdp-pairs");
  const [variantId, setVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<string | null>("details");
  const [pin, setPin] = useState("");
  const [eta, setEta] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [sticky, setSticky] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setSticky(y > 1100));
  const baseReviews = useMemo(() => (p ? reviewsFor(p.id) : []), [p]);

  if (!p) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="font-display text-4xl">{zh ? "未找到该作品" : "This piece could not be found"}</p>
        <Button href="/collections" variant="outline" className="mt-8">{t("cta.shop")}</Button>
      </div>
    );
  }

  const variant = p.variants.find((v) => v.id === variantId) ?? p.variants.find((v) => v.stock > 0) ?? p.variants[0];
  const price = priceOf(p, variant.id);
  const coll = COLLECTIONS.find((c) => c.slug === p.collection);
  const related = products.filter((x) => x.collection === p.collection && x.id !== p.id && x.status === "active").slice(0, 4);
  const pairList = pairs.filter((x) => x.id !== p.id).slice(0, 4);
  const gallery = p.images?.length ? p.images : [undefined];

  const add = (buy = false) => {
    addToCart(p.id, variant.id, qty);
    if (buy) return router.push("/checkout");
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    setTimeout(() => setBagOpen(true), 400);
  };

  const checkDelivery = () => {
    const days = currency === "CNY" ? "7–10" : /^\d{6}$/.test(pin) ? (["5", "6"].includes(pin[0]) ? "1–2" : "2–4") : null;
    if (!days) return setEta(zh ? "请输入有效的 6 位邮编" : "Please enter a valid 6-digit PIN code");
    const d = new Date();
    d.setDate(d.getDate() + Number(days.split("–")[1]));
    setEta((zh ? `预计 ${days} 天送达，最晚 ` : `Delivered in ${days} days — by `) + d.toLocaleDateString(zh ? "zh-CN" : "en-IN", { weekday: "long", day: "numeric", month: "long" }));
  };

  const sections = [
    {
      id: "details",
      title: t("pdp.details"),
      body: (
        <>
          <p className="mb-5 text-[14px] leading-relaxed text-graphite">{l(p.description)}</p>
          <dl className="border-t border-line">
            {p.details.map((d) => (
              <div key={d.label.en} className="flex justify-between gap-6 border-b border-line py-2.5 text-[13px]">
                <dt className="text-muted">{l(d.label)}</dt>
                <dd className="text-right">{l(d.value)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-6 border-b border-line py-2.5 text-[13px]">
              <dt className="text-muted">SKU</dt>
              <dd className="font-mono">{variant.sku}</dd>
            </div>
          </dl>
        </>
      ),
    },
    {
      id: "provenance",
      title: t("pdp.provenance"),
      body: (
        <div className="space-y-2 text-[13px] text-graphite">
          <p className="font-mono text-ink">{p.provenance.batch} · ρ {p.provenance.density}</p>
          <p>{l(p.provenance.source)}</p>
          <p>{l(p.provenance.processing)}</p>
          <p>{l(p.provenance.certification)}</p>
          <Link href={`/provenance?batch=${p.provenance.batch}`} className="inline-block pt-2 text-ink underline underline-offset-4">
            {zh ? "查看完整档案" : "View the full record"}
          </Link>
        </div>
      ),
    },
    {
      id: "care",
      title: t("pdp.care"),
      body: (
        <p className="text-[13px] leading-relaxed text-graphite">
          {zh
            ? "避免长时间浸水与香水直接接触。每月以干软布擦拭，偶尔用少量核桃油养护。颜色会随时间自然加深。会员享终身免费油养服务。"
            : "Keep away from prolonged water and direct perfume. Wipe monthly with a soft dry cloth; oil lightly with walnut oil now and then. The colour will deepen naturally with time. Circle members receive complimentary lifetime re-oiling."}
        </p>
      ),
    },
    {
      id: "delivery",
      title: t("pdp.delivery"),
      body: (
        <ul className="space-y-1.5 text-[13px] text-graphite">
          <li>{zh ? "印度：免费保价配送，1–4 个工作日" : "India — complimentary insured delivery, 1–4 business days"}</li>
          <li>{zh ? "中国大陆：DHL / 顺丰，7–10 天，税费已预付" : "Mainland China — DHL / SF Express, 7–10 days, duties prepaid"}</li>
          <li>{zh ? "其他地区：5–9 天，关税到付" : "Rest of world — 5–9 days, duties payable on arrival"}</li>
          <li>{zh ? "14 天退换（刻字作品除外）" : "Returns within 14 days (engraved pieces excepted)"}</li>
        </ul>
      ),
    },
  ];

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-5 pt-6 md:px-10">
        <nav className="text-[12px] text-muted">
          <Link href="/collections" className="hover:text-ink">{t("nav.collections")}</Link> / <Link href={`/collections/${p.collection}`} className="hover:text-ink">{l(coll?.name)}</Link> / <span className="text-ink">{l(p.name)}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="grid gap-3 md:grid-cols-2">
              {gallery.map((src, i) => (
                <Photo key={i} src={src} alt={`${l(p.name)} — ${i + 1}`} priority={i === 0} className={cn(i === 0 ? "aspect-[4/5] md:col-span-2" : "aspect-[4/5]")} sizes={i === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 29vw, 50vw"} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[140px]">
              <Label>{l(coll?.name)}</Label>
              <Heading as="h1" className="mt-3 text-[clamp(2.4rem,3.6vw,3.4rem)]">{l(p.name)}</Heading>
              <p className="mt-2 text-[14px] text-graphite">{l(p.subtitle)}</p>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-[18px] tabular-nums">
                  {m(price)}
                  {p.compareAt && variant.priceDelta === 0 && <span className="ml-3 text-[14px] text-muted line-through">{m(p.compareAt)}</span>}
                </p>
                <a href="#reviews" className="flex items-center gap-2 text-[13px] text-graphite hover:text-ink">
                  <Star className="h-3.5 w-3.5 fill-ink text-ink" /> {p.rating.toFixed(1)} · {p.reviewCount} {t("pdp.reviews").toLowerCase()}
                </a>
              </div>
              <p className="mt-1 text-[12px] text-muted">
                {currency === "CNY" ? (zh ? "跨境税将在结算时计算，税费预付" : "Cross-border tax calculated at checkout; duties prepaid") : zh ? "含所有税费" : "Inclusive of all taxes"}
              </p>

              <div className="mt-8 border-t border-line pt-6">
                <div className="flex items-center justify-between text-[13px]">
                  <span>{zh ? "规格" : "Size"}: <span className="text-graphite">{l(variant.label)}</span></span>
                  {p.collection === "jewellery" && <button className="text-muted underline underline-offset-4 hover:text-ink">{zh ? "尺寸指南" : "Size guide"}</button>}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      disabled={v.stock === 0}
                      className={cn(
                        "border px-4 py-2.5 text-[13px] transition-colors",
                        variant.id === v.id ? "border-ink bg-ink text-page" : "border-line hover:border-ink",
                        v.stock === 0 && "cursor-not-allowed text-muted line-through",
                      )}
                    >
                      {l(v.label)}
                    </button>
                  ))}
                </div>
                <p className={cn("mt-3 text-[12px]", variant.stock === 0 ? "text-muted" : variant.stock <= 5 ? "text-clay" : "text-moss")}>
                  {variant.stock === 0 ? t("pdp.out") : variant.stock <= 5 ? (zh ? `仅剩 ${variant.stock} 件` : `Only ${variant.stock} remaining`) : t("pdp.inStock")}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <div className="flex h-14 items-center border border-line">
                  <button className="grid h-full w-11 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-6 text-center tabular-nums">{qty}</span>
                  <button className="grid h-full w-11 place-items-center" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                </div>
                <Button onClick={() => add()} size="lg" className="flex-1">{added ? t("cta.added") : t("cta.add")}</Button>
                <button onClick={() => toggleWish(p.id)} aria-label={t("nav.wishlist")} className="grid h-14 w-14 place-items-center border border-line hover:border-ink">
                  <Heart className={cn("h-5 w-5", wished && "fill-clay text-clay")} strokeWidth={1.4} />
                </button>
              </div>
              <Button onClick={() => add(true)} variant="outline" size="lg" className="mt-3 w-full">{t("cta.buy")}</Button>

              <div className="mt-6 bg-stone p-5 text-[13px]">
                {currency !== "CNY" ? (
                  <>
                    <p className="text-graphite">{zh ? "查询送达时间" : "Check delivery date"}</p>
                    <div className="mt-2 flex border-b border-ink">
                      <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder={zh ? "PIN 邮编" : "PIN code"} className="w-full bg-transparent py-2 outline-none placeholder:text-muted" />
                      <button onClick={checkDelivery} className="font-medium">{t("pdp.check")}</button>
                    </div>
                  </>
                ) : (
                  <button onClick={checkDelivery} className="font-medium underline underline-offset-4">{zh ? "计算送达中国大陆的时间" : "Estimate delivery to mainland China"}</button>
                )}
                {eta && <p className="mt-2 text-moss">{eta}</p>}
                <ul className="mt-4 space-y-1 border-t border-line pt-4 text-graphite">
                  <li>— {zh ? "会员立享九折（优惠码 CIRCLE10）" : "Circle members save 10% with code CIRCLE10"}</li>
                  <li>— {zh ? "免费漆盒礼装与手写卡片" : "Complimentary gift case and handwritten card"}</li>
                  <li>— {currency === "CNY" ? (zh ? "支持支付宝、微信支付、银联" : "Alipay, WeChat Pay and UnionPay accepted") : zh ? "支持 UPI 与免息分期" : "UPI and no-cost EMI above ₹10,000"}</li>
                </ul>
              </div>

              <div className="mt-8 border-t border-line">
                {sections.map((s) => (
                  <div key={s.id} className="border-b border-line">
                    <button onClick={() => setOpen(open === s.id ? null : s.id)} className="flex w-full items-center justify-between py-4 text-left text-[13px] font-medium">
                      {s.title}
                      <span className="text-lg font-light">{open === s.id ? "−" : "+"}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open === s.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="overflow-hidden">
                          <div className="pb-6">{s.body}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[12px] leading-relaxed text-muted">
                {zh ? "每件作品附真品证书与溯源卡 · 全程保价配送 · 14 天退换" : "Certificate of authenticity and provenance card · Fully insured delivery · 14-day returns"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Reviews product={p} base={baseReviews} />

      {pairList.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10">
          <Heading className="text-4xl">{t("pdp.pairs")}</Heading>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {pairList.map((x, i) => <ProductCard key={x.id} p={x} index={i} />)}
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
          <Heading className="text-4xl">{zh ? "同系列作品" : `More from ${l(coll?.name)}`}</Heading>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {related.map((x, i) => <ProductCard key={x.id} p={x} index={i} />)}
          </div>
        </section>
      )}

      <AnimatePresence>
        {sticky && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ duration: 0.4, ease: EASE }} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper">
            <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 py-3 md:px-10">
              <div className="min-w-0 flex-1 text-[13px]">
                <p className="truncate font-medium">{l(p.name)}</p>
                <p className="truncate text-muted">{l(variant.label)} · {m(price)}</p>
              </div>
              <Button onClick={() => add()}>{t("cta.add")}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
