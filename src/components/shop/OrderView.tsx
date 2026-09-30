"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Check, Package, PackageCheck, Truck, Home, ClipboardCheck } from "lucide-react";
import { useMaison, useT } from "@/lib/store";

import { EASE, Button, ProductPhoto } from "../motion/primitives";
import { cn, fmtDateTime, money } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const FLOW: { s: OrderStatus; en: string; zh: string; icon: typeof Check }[] = [
  { s: "pending", en: "Placed", zh: "已下单", icon: ClipboardCheck },
  { s: "confirmed", en: "Confirmed", zh: "已确认", icon: Check },
  { s: "packed", en: "Packed", zh: "已包装", icon: Package },
  { s: "shipped", en: "Shipped", zh: "已发货", icon: Truck },
  { s: "delivered", en: "Delivered", zh: "已送达", icon: Home },
];

export function OrderView({ id }: { id: string }) {
  const { zh } = useT();
  const order = useMaison((s) => s.orders.find((o) => o.id === id));
  const products = useMaison((s) => s.products);
  const fresh = useSearchParams().get("new");

  if (!order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <p className="font-display text-4xl">{zh ? "正在查找订单…" : "Looking up this order…"}</p>
        <p className="mt-3 text-sm text-graphite">{zh ? "若长时间未显示，请检查订单号。" : "If nothing appears, please check the order number."}</p>
      </div>
    );
  }

  const cur = order.currency;
  const idx = FLOW.findIndex((f) => f.s === order.status);
  const cancelled = order.status === "cancelled" || order.status === "returned";

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-32 pt-16 md:px-10">
      {fresh && (
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative grid h-20 w-20 place-items-center rounded-full border border-ink"
          >
            <svg viewBox="0 0 52 52" className="h-12 w-12">
              <motion.path
                d="M14 27 l8 8 l16 -18"
                fill="none"
                stroke="#1c1a17"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
              />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: EASE }}
            className="mt-10 font-display text-5xl md:text-6xl"
          >
            {zh ? "谢谢您。" : "Thank you."}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-4 max-w-md text-graphite">
            {zh
              ? `您的订单已确认付款。确认邮件已发送至 ${order.email}，我们也会通过${order.region === "China" ? "微信" : "WhatsApp"}通知您发货进度。`
              : `Your payment is confirmed. A receipt is on its way to ${order.email}, and we'll send dispatch updates on ${order.region === "China" ? "WeChat" : "WhatsApp"}.`}
          </motion.p>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] text-muted">{zh ? "订单" : "Order"}</p>
          <p className="mt-2 font-mono text-3xl">{order.id}</p>
          <p className="mt-1 text-xs text-muted">{fmtDateTime(order.createdAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-muted">{zh ? "合计" : "Total"}</p>
          <p className="mt-2 font-display text-3xl">{money(order.total, cur)}</p>
          <p className="text-xs text-muted">
            {order.method} · {order.payment}
          </p>
        </div>
      </div>

      {/* tracker */}
      <div className="mt-12 rounded-[32px] border border-line bg-paper p-8">
        {cancelled ? (
          <p className="text-center font-display text-2xl">
            {order.status === "cancelled" ? (zh ? "订单已取消，款项已退回" : "Cancelled — payment refunded") : zh ? "已退货退款" : "Returned — refund issued"}
          </p>
        ) : (
          <div className="relative grid grid-cols-5">
            <div className="absolute left-[10%] right-[10%] top-5 h-px bg-stone" />
            <motion.div
              className="absolute left-[10%] top-5 h-px bg-ink"
              initial={{ width: 0 }}
              animate={{ width: `${(idx / (FLOW.length - 1)) * 80}%` }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
            />{" "}
            {FLOW.map((f, i) => (
              <div key={f.s} className="relative flex flex-col items-center text-center">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.12 }}
                  className={cn(
                    "relative z-10 grid h-10 w-10 place-items-center rounded-full border",
                    i <= idx ? "border-ink bg-ink text-page" : "border-line bg-page text-muted",
                  )}
                >
                  <f.icon className="h-4 w-4" strokeWidth={1.6} />
                </motion.span>
                <span className={cn("mt-3 text-[12px] uppercase tracking-[0.18em]", i <= idx ? "text-ink" : "text-muted")}>{zh ? f.zh : f.en}</span>
                <span className="mt-1 hidden text-[12px] text-muted sm:block">
                  {order.timeline.find((t) => t.status === f.s) ? fmtDateTime(order.timeline.find((t) => t.status === f.s)!.at) : ""}
                </span>
              </div>
            ))}
          </div>
        )}
        {order.tracking && (
          <p className="mt-8 text-center text-sm text-graphite">
            {order.carrier} · <span className="font-mono">{order.tracking}</span>
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[28px] border border-line bg-paper p-7">
          <ul className="divide-y divide-line">
            {order.lines.map((ln, i) => {
              const p = products.find((x) => x.id === ln.productId);
              return (
                <li key={i} className="flex items-center gap-4 py-4">
                  <div className="h-16 w-16 overflow-hidden bg-paper">{p && <ProductPhoto p={p} className="h-full w-full" sizes="64px" />}</div>
                  <div className="flex-1">
                    <p className="font-display text-lg">{zh && p?.name.zh ? p.name.zh : ln.name}</p>
                    <p className="text-xs text-muted">
                      {ln.variant} · ×{ln.qty}
                    </p>
                  </div>
                  <p className="text-sm">{money(ln.price * ln.qty, cur)}</p>
                </li>
              );
            })}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm text-graphite">
            <div className="flex justify-between">
              <dt>{zh ? "小计" : "Subtotal"}</dt>
              <dd>{money(order.subtotal, cur)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-moss">
                <dt>{zh ? "优惠" : "Discount"}</dt>
                <dd>− {money(order.discount, cur)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>{zh ? "运费与礼装" : "Shipping & wrap"}</dt>
              <dd>{order.shipping ? money(order.shipping, cur) : zh ? "免费" : "Complimentary"}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{zh ? "税费" : "Taxes"}</dt>
              <dd>{money(order.tax, cur)}</dd>
            </div>
          </dl>
        </div>
        <div className="space-y-4">
          <div className="rounded-[28px] border border-line bg-paper p-7 text-sm">
            <p className="text-[12px] text-muted">{zh ? "配送至" : "Delivering to"}</p>
            <p className="mt-3">{order.address.name}</p>
            <p className="text-graphite">{order.address.line1}</p>
            {order.address.line2 && <p className="text-graphite">{order.address.line2}</p>}
            <p className="text-graphite">
              {order.address.city}, {order.address.state} {order.address.postcode}
            </p>
            <p className="text-graphite">{order.address.country}</p>
          </div>
          {order.giftMessage && (
            <div className="bg-stone p-7">
              <p className="text-[12px] text-muted">{zh ? "手写卡片" : "Handwritten card"}</p>
              <p className="mt-3 font-display text-xl italic">“{order.giftMessage}”</p>
            </div>
          )}
          <div className="flex items-center gap-3 bg-stone p-5 text-xs text-graphite">
            <PackageCheck className="h-5 w-5 text-ink" strokeWidth={1.3} />{" "}
            {zh ? "每件作品附溯源卡与真品证书。" : "Each piece ships with its provenance card and certificate."}
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Button href="/collections" variant="outline">
          {zh ? "继续选购" : "Continue shopping"}
        </Button>
        <Button href="/account?tab=orders" variant="outline" className="border-transparent">
          {zh ? "我的订单" : "My orders"} →
        </Button>
      </div>
      <p className="mt-10 text-center text-xs text-muted">
        {zh ? "需要帮助？" : "Need help? "}{" "}
        <Link href="/contact" className="underline">
          {zh ? "联系顾问" : "Contact an advisor"}
        </Link>
      </p>
    </div>
  );
}
