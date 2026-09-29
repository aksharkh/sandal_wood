"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check, ChevronLeft, CreditCard, Gift, Landmark, Loader2, Lock, QrCode, Smartphone, Wallet } from "lucide-react";
import { useMaison, useShop, useT } from "@/lib/store";
import { quote, regionFromCountry, useCart, type Region } from "@/lib/cart";
import { ProductVisual } from "../visual/ProductVisual";
import { EASE, LuxButton } from "../motion/primitives";
import { QrMark } from "../site/Footer";
import type { Order, PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

const COUNTRIES = ["India", "China", "Hong Kong", "Singapore", "United Arab Emirates", "United Kingdom", "United States"];
const IN_STATES = ["Andhra Pradesh", "Delhi", "Gujarat", "Haryana", "Karnataka", "Kerala", "Maharashtra", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];
const CN_PROVINCES = ["北京 Beijing", "上海 Shanghai", "广东 Guangdong", "浙江 Zhejiang", "江苏 Jiangsu", "四川 Sichuan", "福建 Fujian", "湖北 Hubei", "山东 Shandong"];

type PayOpt = { id: PaymentMethod; label: string; sub: string; icon: typeof CreditCard };
const payOptions = (region: Region, zh: boolean): PayOpt[] =>
  region === "India"
    ? [
        { id: "UPI", label: "UPI", sub: "Google Pay · PhonePe · Paytm · BHIM", icon: Smartphone },
        { id: "Card", label: zh ? "信用卡 / 借记卡" : "Credit / Debit card", sub: "Visa · Mastercard · RuPay · Amex — EMI available", icon: CreditCard },
        { id: "NetBanking", label: "Net banking", sub: "HDFC · ICICI · SBI · Axis + 50 more", icon: Landmark },
      ]
    : region === "China"
      ? [
          { id: "Alipay", label: "支付宝 Alipay", sub: zh ? "扫码或跳转支付宝完成付款" : "Scan or open the Alipay app", icon: Wallet },
          { id: "WeChat Pay", label: "微信支付 WeChat Pay", sub: zh ? "微信扫一扫" : "Scan with WeChat", icon: QrCode },
          { id: "UnionPay", label: "银联 UnionPay", sub: zh ? "银联卡在线支付" : "UnionPay debit & credit", icon: CreditCard },
        ]
      : [
          { id: "Card", label: "Card", sub: "Visa · Mastercard · Amex", icon: CreditCard },
          { id: "PayPal", label: "PayPal", sub: "Pay with your PayPal balance or card", icon: Wallet },
        ];

function newOrderIds() {
  return {
    id: `SM-${27000 + Math.floor(Math.random() * 900)}`,
    customerId: `C${Date.now().toString().slice(-5)}`,
    now: new Date().toISOString(),
  };
}

export function Checkout() {
  const { t, l, m, zh, currency } = useT();
  const router = useRouter();
  const lines = useCart();
  const account = useShop((s) => s.account);
  const clearCart = useShop((s) => s.clearCart);
  const rememberOrder = useShop((s) => s.rememberOrder);
  const saveAddress = useShop((s) => s.saveAddress);
  const placeOrder = useMaison((s) => s.placeOrder);

  const [step, setStep] = useState(0);
  const [contact, setContact] = useState({ email: "", phone: "", updates: true });
  const [addr, setAddr] = useState({
    country: currency === "CNY" ? "China" : currency === "INR" ? "India" : "Singapore",
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postcode: "",
  });
  const [gift, setGift] = useState({ on: false, message: "", hidePrice: true });
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState("");
  const region = regionFromCountry(addr.country);
  const options = payOptions(region, zh);
  const [chosen, setMethod] = useState<PaymentMethod>(options[0].id);
  // Switching country swaps the method list; fall back to its first option.
  const method = options.some((o) => o.id === chosen) ? chosen : options[0].id;
  const [paying, setPaying] = useState(false);

  // Prefill contact once the signed-in account rehydrates from storage.
  const [prevAccount, setPrevAccount] = useState(account);
  if (account !== prevAccount) {
    setPrevAccount(account);
    if (account) setContact((c) => ({ ...c, email: c.email || account.email, phone: c.phone || account.phone }));
  }

  const q = quote(lines.map((x) => ({ ...x, giftWrap: x.giftWrap || gift.on })), region, promoApplied);

  if (lines.length === 0 && !paying) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
        <ProductVisual kind="box" tone={0.4} className="h-48 w-48" />
        <p className="mt-4 font-display text-4xl">{t("bag.empty")}</p>
        <LuxButton href="/collections" className="mt-8" variant="ghost">{t("cta.shop")}</LuxButton>
      </div>
    );
  }

  const steps = [zh ? "联系方式" : "Contact", zh ? "配送" : "Delivery", zh ? "支付" : "Payment"];

  const pay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 2200));
    const { id, customerId, now } = newOrderIds();
    const order: Order = {
      id,
      createdAt: now,
      customerId,
      customerName: addr.name,
      email: contact.email,
      phone: contact.phone,
      region,
      lines: lines.map((x) => ({
        productId: x.productId,
        variantId: x.variantId,
        name: x.product.name.en,
        variant: x.variant.label.en,
        sku: x.variant.sku,
        qty: x.qty,
        price: x.unit,
      })),
      subtotal: q.subtotal,
      shipping: q.shipping + q.wrap,
      tax: q.tax,
      discount: q.discount,
      total: q.total,
      currency,
      status: "pending",
      payment: "paid",
      method,
      address: { name: addr.name, phone: contact.phone, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, postcode: addr.postcode, country: addr.country },
      giftWrap: gift.on || lines.some((x) => x.giftWrap),
      giftMessage: gift.message || undefined,
      timeline: [{ at: now, status: "pending", note: "Order placed · payment captured" }],
      channel: "Web",
    };
    placeOrder(order);
    rememberOrder(id);
    saveAddress(order.address);
    clearCart();
    router.push(`/order/${id}?new=1`);
  };

  const canContact = /\S+@\S+\.\S+/.test(contact.email) && contact.phone.replace(/\D/g, "").length >= 8;
  const canDeliver = addr.name && addr.line1 && addr.city && addr.postcode;

  return (
    <div className="mx-auto grid min-h-screen max-w-[1400px] gap-12 px-5 pb-24 pt-32 md:px-10 lg:grid-cols-[1fr_440px]">
      <div>
        <Link href="/bag" className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-bone/50 hover:text-bone">
          <ChevronLeft className="h-3.5 w-3.5" /> {zh ? "返回购物袋" : "Back to bag"}
        </Link>
        <h1 className="mt-6 font-display text-5xl font-light md:text-6xl">{zh ? "结算" : "Checkout"}</h1>

        <ol className="mt-10 flex items-center gap-3">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-3">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn("flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors", i === step ? "text-bone" : i < step ? "text-gold" : "text-bone/30")}
              >
                <span className={cn("grid h-7 w-7 place-items-center rounded-full border text-[10px]", i === step ? "border-bone" : i < step ? "border-gold bg-gold text-ink" : "border-bone/20")}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < steps.length - 1 && <span className={cn("h-px flex-1", i < step ? "bg-gold/50" : "bg-bone/10")} />}
            </li>
          ))}
        </ol>

        <div className="relative mt-12">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="c" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5, ease: EASE }}>
                {!account && (
                  <p className="mb-6 text-sm text-bone/50">
                    {zh ? "已是会员？" : "Already in the Circle?"}{" "}
                    <Link href="/account?next=/checkout" className="text-gold underline-offset-4 hover:underline">{zh ? "登录" : "Sign in"}</Link>
                    {zh ? " 以更快结算。" : " for faster checkout."}
                  </p>
                )}
                <div className="grid gap-x-8 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-bone/40">Email</span>
                    <input className="field" type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@example.com" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-bone/40">{zh ? "手机号码" : "Mobile"}</span>
                    <input className="field" type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder={region === "China" ? "+86 138 0000 0000" : "+91 98450 00000"} />
                  </label>
                </div>
                <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm text-bone/60">
                  <input type="checkbox" checked={contact.updates} onChange={(e) => setContact({ ...contact, updates: e.target.checked })} className="h-4 w-4 accent-[#c9a46a]" />
                  {region === "China" ? (zh ? "通过微信接收订单更新" : "Send order updates on WeChat") : zh ? "通过 WhatsApp 接收订单更新" : "Send order updates on WhatsApp"}
                </label>
                <LuxButton className="mt-10" size="lg" disabled={!canContact} onClick={() => setStep(1)} magnetic={false}>
                  {t("cta.continue")} →
                </LuxButton>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="d" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5, ease: EASE }}>
                <div className="grid gap-x-8 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-bone/40">{zh ? "国家 / 地区" : "Country / region"}</span>
                    <select className="field" value={addr.country} onChange={(e) => setAddr({ ...addr, country: e.target.value, state: "" })}>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-bone/40">{region === "China" ? (zh ? "收件人（须与身份证一致）" : "Recipient (as on Chinese ID, for customs)") : zh ? "收件人" : "Full name"}</span>
                    <input className="field" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-bone/40">{zh ? "详细地址" : "Address"}</span>
                    <input className="field" value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} placeholder={region === "China" ? "街道、门牌号、小区" : "House no., building, street"} />
                  </label>
                  <label className="block sm:col-span-2">
                    <input className="field" value={addr.line2} onChange={(e) => setAddr({ ...addr, line2: e.target.value })} placeholder={zh ? "补充信息（可选）" : "Landmark / area (optional)"} />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-bone/40">{zh ? "城市" : "City"}</span>
                    <input className="field" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-bone/40">{region === "China" ? "省份" : region === "India" ? "State" : zh ? "州 / 省" : "State / province"}</span>
                    {region === "India" || region === "China" ? (
                      <select className="field" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })}>
                        <option value="">—</option>
                        {(region === "India" ? IN_STATES : CN_PROVINCES).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <input className="field" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} />
                    )}
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-bone/40">{region === "India" ? "PIN code" : region === "China" ? "邮政编码" : "Postcode"}</span>
                    <input className="field" value={addr.postcode} onChange={(e) => setAddr({ ...addr, postcode: e.target.value })} inputMode="numeric" />
                  </label>
                </div>

                <div className="mt-10 rounded-3xl border border-bone/[0.08] p-6">
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="flex items-center gap-3 text-sm">
                      <Gift className="h-4 w-4 text-gold" strokeWidth={1.4} /> {zh ? "这是一份礼物" : "This is a gift"}
                    </span>
                    <input type="checkbox" checked={gift.on} onChange={(e) => setGift({ ...gift, on: e.target.checked })} className="h-4 w-4 accent-[#c9a46a]" />
                  </label>
                  <AnimatePresence>
                    {gift.on && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <textarea rows={3} maxLength={200} className="field mt-3 resize-none" value={gift.message} onChange={(e) => setGift({ ...gift, message: e.target.value })} placeholder={zh ? "手写卡片内容（我们的书法师将亲笔书写）" : "Your message — handwritten by our calligrapher"} />
                        <label className="mt-4 flex items-center gap-3 text-xs text-bone/60">
                          <input type="checkbox" checked={gift.hidePrice} onChange={(e) => setGift({ ...gift, hidePrice: e.target.checked })} className="accent-[#c9a46a]" />
                          {zh ? "包裹内不显示价格" : "Hide prices on the packing slip"}
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 rounded-3xl bg-bone/[0.03] p-5 text-xs leading-relaxed text-bone/55">
                  {region === "India" && (zh ? "印度境内：Blue Dart / Delhivery 保价配送，1–4 个工作日。" : "India: insured delivery via Blue Dart / Delhivery, 1–4 business days.")}
                  {region === "China" && (zh ? "中国大陆：DHL / 顺丰直邮，7–10 天。跨境综合税 9.1% 已在结算时预付，无需额外清关费用。" : "Mainland China: DHL / SF Express, 7–10 days. The 9.1% cross-border tax is prepaid at checkout — no customs fees on arrival.")}
                  {region === "International" && (zh ? "国际：FedEx，5–9 天，关税到付。" : "International: FedEx, 5–9 days. Import duties are payable on delivery.")}
                </div>
                <LuxButton className="mt-10" size="lg" disabled={!canDeliver} onClick={() => setStep(2)} magnetic={false}>
                  {zh ? "前往支付" : "Continue to payment"} →
                </LuxButton>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="p" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5, ease: EASE }}>
                <div className="space-y-3">
                  {options.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setMethod(o.id)}
                      className={cn("flex w-full items-center gap-4 rounded-3xl border p-5 text-left transition-all duration-300", method === o.id ? "border-gold bg-gold/[0.06]" : "border-bone/10 hover:border-bone/30")}
                    >
                      <span className={cn("grid h-11 w-11 place-items-center rounded-full", method === o.id ? "bg-gold text-ink" : "bg-bone/5 text-bone/70")}>
                        <o.icon className="h-5 w-5" strokeWidth={1.4} />
                      </span>
                      <span className="flex-1">
                        <span className="block">{o.label}</span>
                        <span className="text-xs text-bone/45">{o.sub}</span>
                      </span>
                      <span className={cn("h-4 w-4 rounded-full border", method === o.id ? "border-gold bg-gold shadow-[0_0_0_3px_#140c0a_inset]" : "border-bone/30")} />
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={method} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 rounded-3xl border border-bone/[0.08] p-6">
                    {method === "Card" || method === "UnionPay" ? (
                      <div className="grid gap-x-6 sm:grid-cols-2">
                        <input className="field sm:col-span-2" placeholder={zh ? "卡号" : "Card number"} inputMode="numeric" autoComplete="off" />
                        <input className="field" placeholder="MM / YY" autoComplete="off" />
                        <input className="field" placeholder="CVV" autoComplete="off" />
                        <p className="mt-4 text-[11px] text-bone/40 sm:col-span-2">{zh ? "卡信息将由支付网关安全处理，我们不会存储。" : "Card details are handled by the payment gateway's secure fields — never stored by us."}</p>
                      </div>
                    ) : method === "UPI" ? (
                      <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <QrMark seed={42} className="h-32 w-32 rounded-xl" />
                        <div className="flex-1">
                          <p className="text-sm">{zh ? "使用任意 UPI 应用扫码" : "Scan with any UPI app"}</p>
                          <p className="mt-1 text-xs text-bone/45">{zh ? "或输入您的 UPI ID" : "or enter your UPI ID"}</p>
                          <input className="field" placeholder="name@okhdfcbank" autoComplete="off" />
                        </div>
                      </div>
                    ) : method === "Alipay" || method === "WeChat Pay" ? (
                      <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <QrMark seed={method === "Alipay" ? 21 : 33} className="h-32 w-32 rounded-xl" />
                        <p className="text-sm text-bone/70">
                          {method === "Alipay" ? "打开支付宝扫一扫，确认支付" : "打开微信扫一扫，确认支付"}
                          <span className="mt-1 block text-xs text-bone/40">
                            {zh ? "以人民币结算：" : "Charged in CNY: "}
                            {new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(q.total * 0.0853)}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-bone/60">{zh ? "您将被转至银行页面完成支付。" : "You'll be redirected to complete payment securely."}</p>
                    )}
                  </motion.div>
                </AnimatePresence>

                <LuxButton className="mt-10 w-full sm:w-auto" size="lg" onClick={pay} disabled={paying} magnetic={false}>
                  <Lock className="h-3.5 w-3.5" /> {t("cta.place")} · {m(q.total)}
                </LuxButton>
                <p className="mt-4 text-[11px] text-bone/40">
                  {zh ? "提交订单即表示您同意我们的" : "By placing your order you agree to our "}
                  <Link href="/legal/terms" className="underline">{zh ? "条款" : "Terms"}</Link> {zh ? "与" : "and"} <Link href="/legal/returns" className="underline">{zh ? "退换政策" : "Returns Policy"}</Link>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[32px] border border-bone/[0.08] bg-umber p-7">
          <p className="text-[10px] uppercase tracking-[0.28em] text-bone/40">{zh ? "订单摘要" : "Order summary"}</p>
          <ul className="thin-scroll mt-5 max-h-[320px] space-y-4 overflow-y-auto pr-1">
            {lines.map((x) => (
              <li key={x.productId + x.variantId} className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-ink">
                  <ProductVisual kind={x.product.visual} tone={x.product.tone} image={x.product.images?.[0]} className="h-full w-full" glow={false} />
                  <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-bone px-1 text-[10px] text-ink">{x.qty}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg leading-tight">{l(x.product.name)}</p>
                  <p className="truncate text-xs text-bone/45">{l(x.variant.label)}</p>
                </div>
                <p className="text-sm">{m(x.line)}</p>
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPromoApplied(promo);
            }}
            className="mt-6 flex items-center border-b border-bone/15 focus-within:border-gold"
          >
            <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder={zh ? "优惠码" : "Promo code"} className="w-full bg-transparent py-3 text-sm uppercase outline-none placeholder:normal-case placeholder:text-bone/30" />
            <button className="text-[11px] uppercase tracking-[0.2em] text-gold">{zh ? "使用" : "Apply"}</button>
          </form>
          {promoApplied && (
            <p className={cn("mt-2 text-xs", q.discount ? "text-jade" : "text-danger")}>
              {q.discount ? (zh ? "会员优惠已生效" : "Circle 10% applied") : zh ? "优惠码无效" : "That code isn't valid"}
            </p>
          )}
          <dl className="mt-6 space-y-2 text-sm">
            <Row k={t("bag.subtotal")} v={m(q.subtotal)} />
            {q.discount > 0 && <Row k={zh ? "优惠" : "Discount"} v={`− ${m(q.discount)}`} accent />}
            {q.wrap > 0 && <Row k={t("bag.giftWrap")} v={m(q.wrap)} />}
            <Row k={t("bag.shipping")} v={q.shipping ? m(q.shipping) : t("bag.free")} />
            <Row k={region === "China" ? (zh ? "跨境综合税" : "Cross-border tax (9.1%)") : region === "India" ? (zh ? "含 GST (3%)" : "Includes GST (3%)") : zh ? "税费" : "Taxes"} v={q.tax ? m(q.tax) : "—"} />
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-bone/10 pt-5">
            <span className="text-[11px] uppercase tracking-[0.24em]">{t("bag.total")}</span>
            <span className="font-display text-3xl">{m(q.total)}</span>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[11px] text-bone/40">
            <Lock className="h-3.5 w-3.5" /> {zh ? "256 位 SSL 加密 · PCI DSS 合规网关" : "256-bit SSL · PCI-DSS compliant gateway"}
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {paying && (
          <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-ink/90 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-gold" strokeWidth={1.2} />
              <p className="mt-6 font-display text-3xl">{zh ? "正在确认付款…" : "Confirming your payment…"}</p>
              <p className="mt-2 text-sm text-bone/50">{method}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className={cn("flex justify-between", accent ? "text-jade" : "text-bone/60")}>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
