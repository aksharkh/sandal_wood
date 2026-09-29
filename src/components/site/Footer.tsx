"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useMaison, useT } from "@/lib/store";
import { rng } from "@/lib/utils";
import { Badge, Photo } from "../motion/primitives";

/** Placeholder QR until the client's WeChat account code is supplied. */
export function QrMark({ seed = 7, className }: { seed?: number; className?: string }) {
  const r = rng(seed);
  const n = 21;
  const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className={className} shapeRendering="crispEdges" aria-label="WeChat QR (placeholder)">
      <rect width={n} height={n} fill="#faf5ec" />
      {Array.from({ length: n * n }, (_, i) => {
        const x = i % n;
        const y = Math.floor(i / n);
        if (finder(x, y)) return null;
        return r() > 0.52 ? <rect key={i} x={x} y={y} width="1" height="1" fill="#2b1a13" /> : null;
      })}
      {[
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x} y={y} width="7" height="7" fill="#2b1a13" />
          <rect x={x + 1} y={y + 1} width="5" height="5" fill="#faf5ec" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#2b1a13" />
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
        ["/contact", zh ? "预约到访" : "Visit by appointment"],
        ["/account", zh ? "订单追踪" : "Track an order"],
        ["/legal/shipping", zh ? "配送" : "Shipping"],
        ["/legal/returns", zh ? "退换" : "Returns"],
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden rounded-t-[48px] bg-cocoa text-cream md:rounded-t-[80px]">
      <div className="mx-auto max-w-[1680px] px-5 pb-8 pt-20 md:px-10 md:pt-28">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.98]">
              {zh ? "加入" : "Join the"} <em className="text-ember">Santalum Circle</em>
            </p>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-rose">{t("footer.newsletterSub")}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setDone(true);
              }}
              className="mt-9 flex max-w-lg items-center rounded-full border border-cream/25 p-1.5 pl-6 focus-within:border-cream/60"
            >
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder={zh ? "您的电子邮箱" : "Your email address"} className="w-full bg-transparent text-[14px] outline-none placeholder:text-rose/70" />
              <button type="submit" className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-cream px-5 text-[13px] font-medium text-ink transition-colors hover:bg-rose">
                {done ? (zh ? "已订阅" : "Subscribed") : t("common.subscribe")}
              </button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-rose">{c.title}</p>
                <ul className="mt-5 space-y-3">
                  {c.links.map(([href, label]) => (
                    <li key={href + label}>
                      <Link href={href} className="text-[14px] text-cream/85 transition-colors hover:text-ember">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid items-center gap-10 border-t border-cream/15 pt-12 md:grid-cols-[auto_1fr_auto]">
          <Photo src="/images/e-temple-tower.jpg" alt="South Indian temple gopuram" shape="arch" className="hidden h-44 w-32 md:block" sizes="128px" />
          <div className="grid gap-6 text-[14px] sm:grid-cols-3">
            <a href={`https://wa.me/${content.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="group">
              <span className="block text-[11px] uppercase tracking-[0.22em] text-rose">WhatsApp</span>
              <span className="mt-2 flex items-center gap-1 group-hover:text-ember">
                {content.whatsapp} <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
            <div className="flex items-start gap-3">
              <QrMark className="h-14 w-14 rounded-md" />
              <div>
                <span className="block text-[11px] uppercase tracking-[0.22em] text-rose">{zh ? "微信" : "WeChat"}</span>
                <span className="mt-2 block">{content.wechat}</span>
              </div>
            </div>
            <a href={`mailto:${content.email}`} className="group">
              <span className="block text-[11px] uppercase tracking-[0.22em] text-rose">Email</span>
              <span className="mt-2 block group-hover:text-ember">{content.email}</span>
            </a>
          </div>
          <Badge text="Pterocarpus santalinus · 小叶紫檀 · India · " className="hidden text-rose md:grid" center={<span className="font-display text-3xl italic text-cream">S</span>} />
        </div>

        <p className="mt-16 select-none text-center font-display text-[22vw] leading-[0.8] tracking-[-0.03em] text-cream/[0.07] md:text-[17vw]">Santalum</p>

        <div className="mt-6 flex flex-col gap-4 border-t border-cream/15 pt-6 text-[12px] text-rose md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Santalum Maison · {zh ? "印度制造，全球寄送" : "Made in India, delivered worldwide"} · UPI · RuPay · Visa · 支付宝 · 微信支付 · 银联
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              ["privacy", zh ? "隐私政策" : "Privacy"],
              ["terms", zh ? "条款" : "Terms"],
              ["shipping", zh ? "配送" : "Shipping"],
              ["returns", zh ? "退换" : "Returns"],
              ["material-policy", zh ? "材料与采购政策" : "Material policy"],
            ].map(([s, label]) => (
              <Link key={s} href={`/legal/${s}`} className="hover:text-cream">
                {label}
              </Link>
            ))}
            <Link href="/admin" className="hover:text-cream">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
