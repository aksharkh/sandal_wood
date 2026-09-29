"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  Gift,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { useMaison, usePlacement, useProduct, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { reviewsFor } from "@/lib/data/reviews";
import { ProductVisual } from "../visual/ProductVisual";
import { ProductCard } from "./ProductCard";
import { EASE, Eyebrow, LuxButton } from "../motion/primitives";
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
  const [view, setView] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState<string | null>("details");
  const [pin, setPin] = useState("");
  const [eta, setEta] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [sticky, setSticky] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setSticky(y > 900));

  const baseReviews = useMemo(() => (p ? reviewsFor(p.id) : []), [p]);

  if (!p) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
        <p className="font-display text-4xl">{zh ? "未找到该作品" : "This piece could not be found"}</p>
        <LuxButton href="/collections" variant="ghost" className="mt-8">{t("cta.shop")}</LuxButton>
      </div>
    );
  }

  const variant = p.variants.find((v) => v.id === variantId) ?? p.variants.find((v) => v.stock > 0) ?? p.variants[0];
  const price = priceOf(p, variant.id);
  const coll = COLLECTIONS.find((c) => c.slug === p.collection);
  const off = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  const related = products.filter((x) => x.collection === p.collection && x.id !== p.id && x.status === "active").slice(0, 4);
  const pairList = pairs.filter((x) => x.id !== p.id).slice(0, 4);
  const views = [
    { tone: p.tone, seed: 1, scale: 1 },
    { tone: Math.min(1, p.tone + 0.18), seed: 5, scale: 1.25 },
    { tone: Math.max(0, p.tone - 0.15), seed: 9, scale: 1.7 },
    { tone: p.tone, seed: 13, scale: 0.85 },
  ];

  const add = (buy = false) => {
    addToCart(p.id, variant.id, qty);
    if (buy) {
      router.push("/checkout");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    setTimeout(() => setBagOpen(true), 500);
  };

  const checkDelivery = () => {
    const days = currency === "CNY" ? "7–10" : /^\d{6}$/.test(pin) ? (["5", "6"].includes(pin[0]) ? "1–2" : "2–4") : null;
    if (!days) {
      setEta(zh ? "请输入有效的 6 位邮编" : "Enter a valid 6-digit PIN code");
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + Number(days.split("–")[1]));
    setEta(
      (zh ? `预计 ${days} 天送达 · 最晚 ` : `Arrives in ${days} days · by `) +
        d.toLocaleDateString(zh ? "zh-CN" : "en-IN", { weekday: "short", day: "numeric", month: "short" }),
    );
  };

  const sections = [
    {
      id: "details",
      title: t("pdp.details"),
      body: (
        <dl className="divide-y divide-bone/[0.06]">
          {p.details.map((d) => (
            <div key={d.label.en} className="flex justify-between gap-6 py-3 text-sm">
              <dt className="text-bone/45">{l(d.label)}</dt>
              <dd className="text-right text-bone/85">{l(d.value)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-6 py-3 text-sm">
            <dt className="text-bone/45">SKU</dt>
            <dd className="font-mono text-bone/70">{variant.sku}</dd>
          </div>
        </dl>
      ),
    },
    {
      id: "provenance",
      title: t("pdp.provenance"),
      body: (
        <div className="space-y-3 text-sm">
          <p className="font-mono text-gold">{p.provenance.batch}</p>
          <p className="text-bone/70">{l(p.provenance.source)}</p>
          <p className="text-bone/70">{l(p.provenance.processing)}</p>
          <p className="text-bone/70">{l(p.provenance.certification)}</p>
          <Link href={`/provenance?batch=${p.provenance.batch}`} className="inline-block pt-1 text-[11px] uppercase tracking-[0.2em] text-gold hover:text-bone">
            {zh ? "查看完整档案 →" : "View full record →"}
          </Link>
        </div>
      ),
    },
    {
      id: "care",
      title: t("pdp.care"),
      body: (
        <p className="text-sm leading-relaxed text-bone/70">
          {zh
            ? "避免长时间浸水与香水直接接触。每月以干软布擦拭，偶尔用少量核桃油养护。颜色会随时间自然加深——这是好木料的标志。会员享终身免费油养服务。"
            : "Keep away from prolonged water and direct perfume. Wipe monthly with a dry soft cloth, and oil lightly with walnut oil now and then. The colour will deepen naturally — a sign of good wood. Circle members receive complimentary lifetime re-oiling."}
        </p>
      ),
    },
    {
      id: "delivery",
      title: t("pdp.delivery"),
      body: (
        <ul className="space-y-2 text-sm text-bone/70">
          <li>{zh ? "印度：免费保价配送，1–4 个工作日" : "India: complimentary insured delivery, 1–4 business days"}</li>
          <li>{zh ? "中国大陆：DHL / 顺丰，7–10 天，税费已预付，无需额外清关" : "Mainland China: DHL / SF Express, 7–10 days, duties prepaid — no customs surprises"}</li>
          <li>{zh ? "其他地区：5–9 天，关税到付" : "Rest of world: 5–9 days, duties payable on arrival"}</li>
          <li>{zh ? "14 天无忧退换（定制刻字除外）" : "14-day returns (engraved pieces excepted)"}</li>
        </ul>
      ),
    },
  ];

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pt-32 md:px-10 md:pt-36">
        <nav className="text-[10px] uppercase tracking-[0.24em] text-bone/40">
          <Link href="/" className="hover:text-bone">Santalum</Link> / <Link href="/collections" className="hover:text-bone">{t("nav.collections")}</Link> /{" "}
          <Link href={`/collections/${p.collection}`} className="hover:text-bone">{l(coll?.name)}</Link> / <span className="text-gold">{l(p.name)}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-col-reverse gap-4 md:flex-row">
              <div className="no-scrollbar flex gap-3 overflow-x-auto md:flex-col">
                {views.map((v, i) => (
                  <button key={i} onClick={() => setView(i)} className={cn("relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-umber transition-colors", view === i ? "border-gold" : "border-bone/10 hover:border-bone/30")}>
                    <div className="h-full w-full" style={{ transform: `scale(${v.scale})` }}>
                      <ProductVisual kind={p.visual} tone={v.tone} seed={v.seed} image={i === 0 ? p.images?.[0] : p.images?.[i]} className="h-full w-full" glow={false} />
                    </div>
                  </button>
                ))}
              </div>
              <div
                className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-[32px] bg-gradient-to-b from-cocoa to-umber"
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
                }}
                onPointerLeave={() => setZoom(null)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <div
                      className="h-full w-full transition-transform duration-500 ease-out"
                      style={{
                        transform: `scale(${views[view].scale * (zoom ? 1.8 : 1)})`,
                        transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "50% 50%",
                      }}
                    >
                      <ProductVisual kind={p.visual} tone={views[view].tone} seed={views[view].seed} image={p.images?.[view]} label={l(p.name)} className="h-full w-full" />
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                  {p.badges?.map((b) => (
                    <span key={b.en} className="rounded-full border border-gold/30 bg-ink/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold backdrop-blur">{l(b)}</span>
                  ))}
                </div>
                <div className="absolute bottom-5 left-5 font-mono text-[10px] text-bone/40">
                  {p.provenance.batch} · ρ {p.provenance.density}
                </div>
                <div className="absolute bottom-5 right-5 rounded-full bg-ink/50 px-3 py-1 text-[10px] text-bone/60 backdrop-blur">{zh ? "悬停放大" : "Hover to zoom"}</div>
              </div>
            </div>
          </div>

          {/* Buy box */}
          <div>
            <Eyebrow>{l(coll?.name)}</Eyebrow>
            <h1 className="mt-4 font-display text-5xl font-light leading-[1] md:text-6xl">{l(p.name)}</h1>
            <p className="mt-3 text-bone/55">{l(p.subtitle)}</p>

            <a href="#reviews" className="mt-5 inline-flex items-center gap-3 text-sm">
              <span className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < Math.round(p.rating) ? "fill-gold text-gold" : "text-bone/20")} />
                ))}
              </span>
              <span className="text-bone/80">{p.rating.toFixed(1)}</span>
              <span className="text-bone/40 underline-offset-4 hover:underline">
                {p.reviewCount} {t("pdp.reviews")}
              </span>
            </a>

            <div className="mt-8 flex items-baseline gap-4">
              <span className="font-display text-4xl">{m(price)}</span>
              {p.compareAt && variant.priceDelta === 0 && (
                <>
                  <span className="text-bone/35 line-through">{m(p.compareAt)}</span>
                  <span className="rounded-full bg-jade/15 px-2.5 py-1 text-xs text-jade">−{off}%</span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-bone/40">
              {currency === "CNY" ? (zh ? "含跨境税 · 税费预付" : "Duties prepaid · cross-border tax included at checkout") : zh ? "含商品及服务税" : "Inclusive of all taxes"}
            </p>

            <div className="mt-10">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.28em] text-bone/50">{zh ? "规格" : "Select"}</p>
                {p.collection === "jewellery" && (
                  <button className="text-[10px] uppercase tracking-[0.2em] text-gold/80 underline-offset-4 hover:underline">{zh ? "尺寸指南" : "Size guide"}</button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    disabled={v.stock === 0}
                    className={cn(
                      "relative rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-300",
                      variant.id === v.id ? "border-gold bg-gold/10 text-bone" : "border-bone/15 text-bone/70 hover:border-bone/40",
                      v.stock === 0 && "cursor-not-allowed opacity-40 line-through",
                    )}
                  >
                    {l(v.label)}
                    {v.priceDelta !== 0 && <span className="ml-2 text-xs text-bone/40">{m(p.price + v.priceDelta)}</span>}
                    {variant.id === v.id && <motion.span layoutId="variant-ring" className="absolute inset-0 rounded-2xl ring-1 ring-gold" />}
                  </button>
                ))}
              </div>
              <p className={cn("mt-3 flex items-center gap-2 text-xs", variant.stock === 0 ? "text-bone/50" : variant.stock <= 5 ? "text-blush" : "text-jade")}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {variant.stock === 0 ? t("pdp.out") : variant.stock <= 5 ? `${t("pdp.low")} — ${variant.stock}` : t("pdp.inStock")}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex h-14 items-center rounded-full border border-bone/15">
                <button className="grid h-14 w-12 place-items-center text-bone/70 hover:text-bone" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center tabular-nums">{qty}</span>
                <button className="grid h-14 w-12 place-items-center text-bone/70 hover:text-bone" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <LuxButton onClick={() => add()} size="lg" className="min-w-[200px] flex-1" magnetic={false}>
                {added ? `✓ ${t("cta.added")}` : t("cta.add")}
              </LuxButton>
              <button onClick={() => toggleWish(p.id)} aria-label={t("nav.wishlist")} className="grid h-14 w-14 place-items-center rounded-full border border-bone/15 hover:border-bone/50">
                <Heart className={cn("h-5 w-5", wished && "fill-ember text-ember")} strokeWidth={1.4} />
              </button>
            </div>
            <button onClick={() => add(true)} className="mt-3 h-14 w-full rounded-full border border-gold/40 text-[11px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-ink">
              {t("cta.buy")}
            </button>

            {/* delivery check */}
            <div className="mt-8 rounded-3xl border border-bone/[0.08] p-5">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-gold" strokeWidth={1.4} />
                {currency === "CNY" ? (zh ? "配送至中国大陆" : "Delivering to mainland China") : zh ? "查询配送时间" : "Check delivery"}
              </div>
              {currency !== "CNY" ? (
                <div className="mt-3 flex items-center border-b border-bone/15 focus-within:border-gold">
                  <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder={zh ? "输入 PIN 邮编" : "Enter PIN code"} className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-bone/30" />
                  <button onClick={checkDelivery} className="text-[11px] uppercase tracking-[0.2em] text-gold">{t("pdp.check")}</button>
                </div>
              ) : (
                <button onClick={checkDelivery} className="mt-3 text-[11px] uppercase tracking-[0.2em] text-gold">{zh ? "计算送达时间" : "Estimate arrival"}</button>
              )}
              {eta && <p className="mt-3 text-xs text-jade">{eta}</p>}
            </div>

            {/* offers */}
            <div className="mt-4 space-y-2">
              {[
                { icon: Sparkles, en: "Circle members save 10% — code CIRCLE10", zh: "会员立享九折——优惠码 CIRCLE10" },
                { icon: Gift, en: "Complimentary lacquer gift case & handwritten card", zh: "免费漆盒礼装与手写卡片" },
                currency === "CNY"
                  ? { icon: BadgeCheck, en: "Pay with Alipay, WeChat Pay or UnionPay", zh: "支持支付宝、微信支付、银联" }
                  : { icon: BadgeCheck, en: "No-cost EMI on cards above ₹10,000 · UPI accepted", zh: "₹10,000 以上信用卡免息分期 · 支持 UPI" },
              ].map((o) => (
                <div key={o.en} className="flex items-center gap-3 rounded-2xl bg-bone/[0.03] px-4 py-3 text-xs text-bone/70">
                  <o.icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} /> {zh ? o.zh : o.en}
                </div>
              ))}
            </div>

            <p className="mt-10 text-[15px] leading-relaxed text-bone/70">{l(p.description)}</p>

            <div className="mt-10 border-t border-bone/10">
              {sections.map((s) => (
                <div key={s.id} className="border-b border-bone/10">
                  <button onClick={() => setOpen(open === s.id ? null : s.id)} className="flex w-full items-center justify-between py-5 text-left">
                    <span className="text-[11px] uppercase tracking-[0.24em]">{s.title}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-500", open === s.id && "rotate-180")} strokeWidth={1.4} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open === s.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="overflow-hidden">
                        <div className="pb-6">{s.body}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-bone/60 sm:grid-cols-4">
              {[
                { icon: ShieldCheck, en: "Certificate of authenticity", zh: "真品证书" },
                { icon: PackageCheck, en: "Insured delivery", zh: "全程保价" },
                { icon: RotateCcw, en: "14-day returns", zh: "14 天退换" },
                { icon: Sparkles, en: "Lifetime care", zh: "终身养护" },
              ].map((x) => (
                <div key={x.en} className="flex flex-col items-center gap-2 rounded-2xl border border-bone/[0.06] px-2 py-4 text-center">
                  <x.icon className="h-5 w-5 text-gold" strokeWidth={1.2} />
                  {zh ? x.zh : x.en}
                </div>
              ))}
            </div>
            <button
              onClick={() => navigator.share?.({ title: l(p.name), url: location.href }).catch(() => {})}
              className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bone/50 hover:text-bone"
            >
              <Share2 className="h-3.5 w-3.5" /> {zh ? "分享" : "Share"}
            </button>
          </div>
        </div>
      </section>

      <Reviews product={p} base={baseReviews} />

      {pairList.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
          <h2 className="font-display text-4xl font-light md:text-5xl">{t("pdp.pairs")}</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {pairList.map((x, i) => (
              <ProductCard key={x.id} p={x} index={i} />
            ))}
          </div>
        </section>
      )}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-32 md:px-10">
          <h2 className="font-display text-4xl font-light md:text-5xl">{zh ? "同系列作品" : `More from ${l(coll?.name)}`}</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {related.map((x, i) => (
              <ProductCard key={x.id} p={x} index={i} />
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {sticky && (
          <motion.div initial={{ y: 120 }} animate={{ y: 0 }} exit={{ y: 120 }} transition={{ duration: 0.6, ease: EASE }} className="fixed inset-x-0 bottom-0 z-40 border-t border-bone/10 bg-ink/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-3 pr-24 md:px-10 md:pr-28">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-umber">
                <ProductVisual kind={p.visual} tone={p.tone} image={p.images?.[0]} className="h-full w-full" glow={false} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg">{l(p.name)}</p>
                <p className="truncate text-xs text-bone/50">{l(variant.label)} · {m(price)}</p>
              </div>
              <LuxButton onClick={() => add()} magnetic={false}>{t("cta.add")}</LuxButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
