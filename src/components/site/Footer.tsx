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
      <rect width={n} height={n} fill="#fbf8f3" />
      {Array.from({ length: n * n }, (_, i) => {
        const x = i % n;
        const y = Math.floor(i / n);
        if (finder(x, y)) return null;
        return r() > 0.52 ? <rect key={i} x={x} y={y} width="1" height="1" fill="#1c1a17" /> : null;
      })}
      {[
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x} y={y} width="7" height="7" fill="#1c1a17" />
          <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fbf8f3" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#1c1a17" />
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
        ["/science", t("nav.science")],
        ["/sourcing", t("nav.sourcing")],
        ["/journal", t("nav.journal")],
      ],
    },
    {
      title: zh ? "客户服务" : "Client services",
      links: [
        ["/enquiries", t("nav.enquiries")],
        ["/gifting", zh ? "企业与婚礼礼赠" : "Corporate & wedding gifting"],
        ["/contact", zh ? "预约到访" : "Visit by appointment"],
        ["/account", zh ? "订单追踪" : "Track an order"],
        ["/legal/shipping", zh ? "配送" : "Shipping"],
        ["/legal/returns", zh ? "退换" : "Returns"],
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-stone text-ink">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-4xl leading-tight">{t("footer.newsletter")}</p>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-graphite">{t("footer.newsletterSub")}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setDone(true);
              }}
              className="mt-8 flex max-w-md border-b border-ink"
            >
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder={zh ? "电子邮箱" : "Email address"} className="w-full bg-transparent py-3 text-[14px] outline-none placeholder:text-muted" />
              <button type="submit" className="text-[13px] font-medium">{done ? "✓" : t("common.subscribe")}</button>
            </form>
            {done && <p className="mt-3 text-[13px] text-moss">{zh ? "欢迎加入。" : "Thank you — you're on the list."}</p>}
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{c.title}</p>
                <ul className="mt-5 space-y-2.5">
                  {c.links.map(([href, label]) => (
                    <li key={href + label}>
                      <Link href={href} className="text-[14px] text-graphite hover:text-ink">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-line pt-10 text-[14px] md:grid-cols-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">WhatsApp</p>
            <a className="mt-2 block hover:underline" href={`https://wa.me/${content.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{content.whatsapp}</a>
          </div>
          <div className="flex items-start gap-3">
            <QrMark className="h-14 w-14" />
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{zh ? "微信" : "WeChat"}</p>
              <p className="mt-2">{content.wechat}</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Email</p>
            <a className="mt-2 block hover:underline" href={`mailto:${content.email}`}>{content.email}</a>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{zh ? "支付方式" : "We accept"}</p>
            <p className="mt-2 text-graphite">UPI · RuPay · Visa · Mastercard · 支付宝 · 微信支付 · 银联</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-[12px] text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 Santalum Maison · {zh ? "印度制造" : "Made in India"}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              ["privacy", zh ? "隐私政策" : "Privacy"],
              ["terms", zh ? "条款" : "Terms"],
              ["shipping", zh ? "配送" : "Shipping"],
              ["returns", zh ? "退换" : "Returns"],
              ["material-policy", zh ? "材料与采购政策" : "Material & Sourcing Policy"],
            ].map(([s, label]) => (
              <Link key={s} href={`/legal/${s}`} className="hover:text-ink">{label}</Link>
            ))}
            <Link href="/admin" className="hover:text-ink">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
