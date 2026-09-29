"use client";

import Link from "next/link";
import { useState } from "react";
import { useMaison, useT } from "@/lib/store";
import { rng } from "@/lib/utils";

/** Placeholder QR until the client's WeChat account code is supplied. */
export function QrMark({ seed = 7, className }: { seed?: number; className?: string }) {
  const r = rng(seed);
  const n = 21;
  const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className={className} shapeRendering="crispEdges" aria-label="WeChat QR (placeholder)">
      <rect width={n} height={n} fill="#ffffff" />
      {Array.from({ length: n * n }, (_, i) => {
        const x = i % n;
        const y = Math.floor(i / n);
        if (finder(x, y)) return null;
        return r() > 0.52 ? <rect key={i} x={x} y={y} width="1" height="1" fill="#0e0e0e" /> : null;
      })}
      {[
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x} y={y} width="7" height="7" fill="#0e0e0e" />
          <rect x={x + 1} y={y + 1} width="5" height="5" fill="#ffffff" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#0e0e0e" />
        </g>
      ))}
    </svg>
  );
}

export function Footer() {
  const { t, zh } = useT();
  const content = useMaison((s) => s.content);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const cols: { title: string; links: [string, string][] }[] = [
    {
      title: t("nav.collections"),
      links: [
        ["/collections/jewellery", zh ? "珠宝饰品" : "Jewellery"],
        ["/collections/beads-malas", zh ? "念珠与手串" : "Beads & Malas"],
        ["/collections/everyday-objects", zh ? "日常器物" : "Everyday Objects"],
        ["/collections/powder-material", zh ? "檀粉与原料" : "Powder & Material"],
        ["/collections/gifting", zh ? "礼赠" : "Gifting"],
      ],
    },
    {
      title: t("nav.maison"),
      links: [
        ["/maison", t("nav.maison")],
        ["/founder", t("nav.founder")],
        ["/material", t("nav.material")],
        ["/craft", t("nav.craft")],
        ["/provenance", t("nav.provenance")],
        ["/journal", t("nav.journal")],
      ],
    },
    {
      title: zh ? "客户服务" : "Client services",
      links: [
        ["/enquiries", t("nav.enquiries")],
        ["/contact", zh ? "预约到访" : "Book an appointment"],
        ["/account", zh ? "订单追踪" : "Track an order"],
        ["/legal/shipping", zh ? "配送" : "Shipping"],
        ["/legal/returns", zh ? "退换" : "Returns"],
        ["/legal/material-policy", zh ? "材料政策" : "Material policy"],
      ],
    },
    {
      title: zh ? "联系" : "Contact",
      links: [
        [`https://wa.me/${content.whatsapp.replace(/\D/g, "")}`, `WhatsApp ${content.whatsapp}`],
        [`mailto:${content.email}`, content.email],
        ["/contact", `${zh ? "微信" : "WeChat"} ${content.wechat}`],
        ["/contact", "Lavelle Road, Bengaluru"],
      ],
    },
  ];

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1760px] px-5 pt-20 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-rose">{t("footer.newsletter")}</p>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/80">{t("footer.newsletterSub")}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setDone(true);
              }}
              className="mt-8 flex max-w-sm border-b border-white/40 focus-within:border-white"
            >
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder={zh ? "电子邮箱" : "Email address"} className="w-full bg-transparent py-3 text-[14px] outline-none placeholder:text-white/40" />
              <button type="submit" className="text-[11px] font-medium uppercase tracking-[0.16em]">
                {done ? (zh ? "已订阅" : "Subscribed") : t("common.subscribe")}
              </button>
            </form>
            <div className="mt-8 flex items-center gap-4 text-[12px] text-rose">
              <QrMark className="h-16 w-16" />
              {zh ? "扫码添加微信顾问" : "Scan to reach our Mandarin-speaking advisor"}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:col-span-8">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-rose">{c.title}</p>
                <ul className="mt-5 space-y-2.5">
                  {c.links.map(([href, label]) => (
                    <li key={href + label}>
                      <Link href={href} className="text-[13px] text-white/85 transition-colors hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 py-6 text-[11px] uppercase tracking-[0.14em] text-rose md:flex-row md:items-center md:justify-between">
          <p>© 2026 Santalum Maison · {zh ? "印度制造" : "Made in India"}</p>
          <p>UPI · RuPay · Visa · Mastercard · 支付宝 · 微信支付 · 银联</p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="hover:text-white">{zh ? "隐私" : "Privacy"}</Link>
            <Link href="/legal/terms" className="hover:text-white">{zh ? "条款" : "Terms"}</Link>
            <Link href="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>
      <p className="font-wide select-none overflow-hidden whitespace-nowrap px-5 pb-3 text-center text-[12.6vw] font-semibold leading-[0.8] tracking-[-0.01em] text-white md:px-10" aria-hidden>
        SANTALUM
      </p>
    </footer>
  );
}
