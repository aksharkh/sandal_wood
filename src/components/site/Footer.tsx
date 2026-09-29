"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, Mail, MessageCircle } from "lucide-react";
import { useMaison, useT } from "@/lib/store";
import { Monogram } from "./Logo";
import { EASE } from "../motion/primitives";
import { rng } from "@/lib/utils";

export function QrMark({ seed = 7, className }: { seed?: number; className?: string }) {
  const r = rng(seed);
  const n = 21;
  const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className={className} shapeRendering="crispEdges" aria-label="WeChat QR (placeholder)">
      <rect width={n} height={n} fill="#efe6d8" />
      {Array.from({ length: n * n }, (_, i) => {
        const x = i % n;
        const y = Math.floor(i / n);
        if (finder(x, y)) return null;
        return r() > 0.52 ? <rect key={i} x={x} y={y} width="1" height="1" fill="#140c0a" /> : null;
      })}
      {[
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <rect x={x} y={y} width="7" height="7" fill="#140c0a" />
          <rect x={x + 1} y={y + 1} width="5" height="5" fill="#efe6d8" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#9e2f1f" />
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
      ],
    },
    {
      title: zh ? "服务" : "Client care",
      links: [
        ["/enquiries", t("nav.enquiries")],
        ["/gifting", zh ? "企业与婚礼礼赠" : "Corporate & wedding gifting"],
        ["/contact", zh ? "预约到访" : "Visit by appointment"],
        ["/account", zh ? "订单追踪" : "Track an order"],
        ["/legal/shipping", zh ? "配送政策" : "Shipping"],
        ["/legal/returns", zh ? "退换政策" : "Returns"],
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-bone/[0.06] bg-ink pt-24">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-santal/20 blur-[120px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold">Santalum Circle</p>
            <h3 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">{t("footer.newsletter")}</h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-bone/55">{t("footer.newsletterSub")}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setDone(true);
              }}
              className="mt-8 flex max-w-md items-center border-b border-bone/20 focus-within:border-gold"
            >
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder={zh ? "您的电子邮箱" : "Your email"} className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-bone/30" />
              <button type="submit" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold" aria-label={t("common.subscribe")}>
                {done ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
            {done && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-xs text-jade">
                {zh ? "欢迎加入。第一封信将于本周寄出。" : "Welcome to the Circle. Your first letter arrives this week."}
              </motion.p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="text-[10px] uppercase tracking-[0.3em] text-bone/40">{c.title}</p>
                <ul className="mt-5 space-y-3">
                  {c.links.map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="text-sm text-bone/70 transition-colors hover:text-bone">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-6 rounded-3xl border border-bone/[0.07] p-6 md:grid-cols-4 md:p-8">
          <a href={`https://wa.me/${content.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="group flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-jade/15 text-jade"><MessageCircle className="h-5 w-5" /></span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.24em] text-bone/40">WhatsApp</span>
              <span className="text-sm group-hover:text-gold">{content.whatsapp}</span>
            </span>
          </a>
          <div className="flex items-center gap-4">
            <QrMark className="h-12 w-12 rounded" />
            <span>
              <span className="block text-[10px] uppercase tracking-[0.24em] text-bone/40">{zh ? "微信" : "WeChat"}</span>
              <span className="text-sm">{content.wechat}</span>
            </span>
          </div>
          <a href={`mailto:${content.email}`} className="group flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold"><Mail className="h-5 w-5" /></span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.24em] text-bone/40">Email</span>
              <span className="text-sm group-hover:text-gold">{content.email}</span>
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-1.5 md:justify-end">
            {["UPI", "RuPay", "Visa", "Mastercard", "支付宝", "微信支付", "银联"].map((p) => (
              <span key={p} className="rounded-md border border-bone/10 px-2 py-1 text-[10px] text-bone/60">{p}</span>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="mt-20 flex items-end justify-between gap-6 overflow-hidden"
        >
          <p className="select-none font-display text-[18vw] font-light leading-[0.78] tracking-[-0.02em] text-bone/[0.07] lg:text-[15vw]">Santalum</p>
          <Monogram className="mb-[3vw] hidden h-[8vw] w-[8vw] text-gold/40 md:block" />
        </motion.div>

        <div className="flex flex-col gap-4 border-t border-bone/[0.06] py-8 text-[11px] text-bone/40 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Santalum Maison. {zh ? "印度制造，全球寄送。" : "Made in India. Shipped worldwide."}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              ["privacy", zh ? "隐私政策" : "Privacy"],
              ["terms", zh ? "条款" : "Terms"],
              ["shipping", zh ? "配送" : "Shipping"],
              ["returns", zh ? "退换" : "Returns"],
              ["material-policy", zh ? "材料与采购政策" : "Material & Sourcing Policy"],
            ].map(([s, label]) => (
              <Link key={s} href={`/legal/${s}`} className="hover:text-bone">
                {label}
              </Link>
            ))}
            <Link href="/admin" className="hover:text-bone">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
