"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Heart, LogOut, MapPin, Package, Sparkles } from "lucide-react";
import { useMaison, useShop, useT } from "@/lib/store";
import { ProductCard } from "@/components/shop/ProductCard";
import { EASE, Label, Button } from "@/components/motion/primitives";

import { cn, fmtDate, money } from "@/lib/utils";

type Tab = "overview" | "orders" | "wishlist" | "addresses";

function AccountInner() {
  const { zh, locale } = useT();
  const params = useSearchParams();
  const router = useRouter();
  const account = useShop((s) => s.account);
  const signIn = useShop((s) => s.signIn);
  const signOut = useShop((s) => s.signOut);
  const myOrderIds = useShop((s) => s.myOrders);
  const wishlist = useShop((s) => s.wishlist);
  const addresses = useShop((s) => s.addresses);
  const orders = useMaison((s) => s.orders);
  const products = useMaison((s) => s.products);
  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) || "overview");
  const [form, setForm] = useState({ name: "", email: "", phone: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [track, setTrack] = useState("");

  const mine = useMemo(
    () => orders.filter((o) => myOrderIds.includes(o.id) || (account && o.email.toLowerCase() === account.email.toLowerCase())),
    [orders, myOrderIds, account],
  );
  const spent = mine.filter((o) => o.payment === "paid").reduce((s, o) => s + o.total, 0);
  const tier = spent >= 100000 ? "Circle Gold" : "Circle";
  const wished = products.filter((p) => wishlist.includes(p.id));

  if (!account && tab !== "wishlist") {
    return (
      <div className="mx-auto grid min-h-screen max-w-[1400px] gap-16 px-5 pb-24 pt-14 md:px-10 lg:grid-cols-2">
        <div>
          <Label>Santalum Circle</Label>
          <h1 className="mt-6 font-display text-5xl leading-[1] md:text-6xl">{zh ? "欢迎回来。" : "Welcome back."}</h1>
          <p className="mt-6 max-w-md text-graphite">
            {zh ? "使用手机或邮箱登录，无需密码。我们会发送一次性验证码。" : "Sign in with your email or mobile — no passwords. We'll send a one-time code."}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!otpSent) return setOtpSent(true);
              signIn({ name: form.name || form.email.split("@")[0], email: form.email, phone: form.phone });
              const next = params.get("next");
              if (next?.startsWith("/")) router.push(next);
            }}
            className="mt-10 max-w-md"
          >
            <AnimatePresence mode="wait">
              {!otpSent ? (
                <motion.div key="a" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <input className="field" placeholder={zh ? "姓名" : "Name"} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <input
                    className="field"
                    required
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <input
                    className="field"
                    placeholder={zh ? "手机号（用于 WhatsApp / 微信通知）" : "Mobile (for WhatsApp / WeChat updates)"}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </motion.div>
              ) : (
                <motion.div key="b" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="text-sm text-graphite">{zh ? `验证码已发送至 ${form.email}` : `We've sent a code to ${form.email}`}</p>
                  <input
                    className="field text-center font-mono text-2xl tracking-[0.6em]"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="······"
                    value={form.otp}
                    onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
                  />
                  <p className="mt-2 text-[12px] text-muted">{zh ? "演示版本：输入任意 6 位数字" : "Demo build: any 6 digits will do"}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <Button type="submit" className="mt-8" size="lg">
              {otpSent ? (zh ? "验证并登录" : "Verify & sign in") : zh ? "发送验证码" : "Send code"}
            </Button>
          </form>
        </div>
        <div className="space-y-6">
          <div className="relative overflow-hidden bg-stone p-8">
            <p className="text-[12px] text-muted">{zh ? "会员礼遇" : "Circle privileges"}</p>
            <ul className="mt-5 space-y-3 text-sm text-ink">
              {(zh
                ? ["限量批次优先购买", "终身免费油养", "生日礼遇", "专属顾问"]
                : ["First access to limited batches", "Lifetime re-oiling", "Birthday gift", "A dedicated advisor"]
              ).map((x) => (
                <li key={x} className="flex items-center gap-3">
                  <Sparkles className="h-3.5 w-3.5 text-ink" /> {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line p-8">
            <p className="text-[12px] text-muted">{zh ? "追踪订单（无需登录）" : "Track an order (no sign-in)"}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (track) router.push(`/order/${track.trim().toUpperCase()}`);
              }}
              className="mt-4 flex items-center border-b border-line focus-within:border-ink"
            >
              <input
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                placeholder="SM-26084"
                className="w-full bg-transparent py-3 font-mono text-sm uppercase outline-none placeholder:text-muted"
              />
              <button className="text-[13px] font-medium">{zh ? "查询" : "Track"}</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const tabs: [Tab, string, typeof Package][] = [
    ["overview", zh ? "概览" : "Overview", Sparkles],
    ["orders", zh ? "订单" : "Orders", Package],
    ["wishlist", zh ? "心愿单" : "Wishlist", Heart],
    ["addresses", zh ? "地址" : "Addresses", MapPin],
  ];

  return (
    <div className="mx-auto min-h-screen max-w-[1400px] px-5 pb-24 pt-14 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Label>{account ? tier : zh ? "心愿单" : "Wishlist"}</Label>
          <h1 className="mt-5 font-display text-5xl md:text-6xl">
            {account ? (zh ? `您好，${account.name}` : `Hello, ${account.name}`) : zh ? "心愿单" : "Your wishlist"}
          </h1>
        </div>
        {account && (
          <button onClick={signOut} className="flex items-center gap-2 text-[12px] text-graphite hover:text-ink">
            <LogOut className="h-3.5 w-3.5" /> {zh ? "退出" : "Sign out"}
          </button>
        )}
      </div>

      {account && (
        <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto border-b border-line">
          {tabs.map(([k, label, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 px-4 pb-4 text-sm transition-colors",
                tab === k ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.4} /> {label}
              {tab === k && <motion.span layoutId="acct-tab" className="absolute inset-x-0 -bottom-px h-px bg-ink" />}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-10"
        >
          {tab === "overview" && account && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="relative overflow-hidden bg-clay p-8 text-paper lg:col-span-2">
                <p className="text-[12px] text-rose">{tier}</p>
                <p className="mt-10 font-mono text-sm tracking-[0.3em] text-rose">
                  SM · {account.email.slice(0, 3).toUpperCase()} · {String(mine.length).padStart(4, "0")}
                </p>
                <p className="mt-2 font-display text-4xl">{account.name}</p>
                <div className="mt-8 max-w-md">
                  <div className="flex justify-between text-xs text-rose">
                    <span>{money(spent)}</span>
                    <span>
                      {zh ? "金卡门槛" : "Gold at"} {money(100000)}
                    </span>
                  </div>
                  <div className="mt-2 h-px bg-paper/30">
                    <motion.div
                      className="h-px bg-paper"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (spent / 100000) * 100)}%` }}
                      transition={{ duration: 1.4, ease: EASE }}
                    />{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid gap-6">
                <button onClick={() => setTab("orders")} className="border border-line p-8 text-left hover:border-line">
                  <p className="font-display text-5xl">{mine.length}</p>
                  <p className="mt-2 text-xs text-muted">{zh ? "订单" : "Orders"}</p>
                </button>
                <button onClick={() => setTab("wishlist")} className="border border-line p-8 text-left hover:border-line">
                  <p className="font-display text-5xl">{wished.length}</p>
                  <p className="mt-2 text-xs text-muted">{zh ? "心愿" : "Saved"}</p>
                </button>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-4">
              {mine.length === 0 && <p className="py-16 text-center text-graphite">{zh ? "暂无订单。" : "No orders yet."}</p>}
              {mine.map((o) => (
                <Link
                  key={o.id}
                  href={`/order/${o.id}`}
                  className="group flex flex-wrap items-center justify-between gap-4 border border-line p-6 transition-colors hover:border-ink"
                >
                  <div>
                    <p className="font-mono">{o.id}</p>
                    <p className="mt-1 text-xs text-muted">
                      {fmtDate(o.createdAt, locale)} · {o.lines.map((l) => l.name).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="rounded-full border border-line px-3 py-1 text-[12px] text-ink">{o.status}</span>
                    <span className="font-display text-2xl">{money(o.total, o.currency)}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === "wishlist" && (
            <>
              {wished.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-display text-3xl">{zh ? "心愿单是空的" : "Nothing saved yet"}</p>
                  <Button href="/collections" variant="outline" className="mt-6">
                    {zh ? "浏览系列" : "Browse collections"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
                  {wished.map((p, i) => (
                    <ProductCard key={p.id} p={p} index={i} />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "addresses" && (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.length === 0 && (
                <p className="text-graphite">{zh ? "结算时保存的地址会显示在这里。" : "Addresses you use at checkout will appear here."}</p>
              )}
              {addresses.map((a) => (
                <div key={a.line1} className="border border-line p-6 text-sm">
                  <p>{a.name}</p>
                  <p className="text-graphite">{a.line1}</p>
                  <p className="text-graphite">
                    {a.city}, {a.state} {a.postcode}
                  </p>
                  <p className="text-graphite">{a.country}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense>
      <AccountInner />
    </Suspense>
  );
}
