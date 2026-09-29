"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { BadgeCheck, Camera, Star, ThumbsUp, X } from "lucide-react";
import type { Product, Review } from "@/lib/types";
import { useMaison, useT } from "@/lib/store";
import { EASE, LuxButton } from "../motion/primitives";
import { cn, fmtDate } from "@/lib/utils";

const FLAG: Record<Review["country"], string> = { IN: "India", CN: "中国", SG: "Singapore", AE: "UAE", GB: "UK", US: "USA" };

export function Reviews({ product, base }: { product: Product; base: Review[] }) {
  const { t, zh, locale } = useT();
  const userReviews = useMaison((s) => s.userReviews);
  const addReview = useMaison((s) => s.addReview);
  const [filter, setFilter] = useState<"all" | "5" | "zh" | "verified">("all");
  const [sort, setSort] = useState<"helpful" | "recent">("helpful");
  const [voted, setVoted] = useState<string[]>([]);
  const [writing, setWriting] = useState(false);

  const all = useMemo(() => [...userReviews.filter((r) => r.productId === product.id), ...base], [userReviews, base, product.id]);

  // Distribution is modelled on the headline rating so the bars agree with the stars.
  const dist = useMemo(() => {
    const r = product.rating;
    const five = Math.round(product.reviewCount * Math.min(0.95, (r - 3.6) / 1.5));
    const four = Math.round((product.reviewCount - five) * 0.7);
    const three = Math.round((product.reviewCount - five - four) * 0.6);
    const two = Math.round((product.reviewCount - five - four - three) * 0.5);
    return [five, four, three, two, Math.max(0, product.reviewCount - five - four - three - two)];
  }, [product]);

  const shown = all
    .filter((r) => (filter === "5" ? r.rating === 5 : filter === "zh" ? r.country === "CN" : filter === "verified" ? r.verified : true))
    .sort((a, b) => (sort === "recent" ? b.date.localeCompare(a.date) : b.helpful - a.helpful));

  return (
    <section id="reviews" className="mx-auto mt-24 max-w-[1600px] scroll-mt-32 px-5 md:px-10">
      <div className="grid gap-12 border-t border-bone/10 pt-16 lg:grid-cols-[360px_1fr]">
        <div>
          <h2 className="font-display text-4xl font-light md:text-5xl">{t("pdp.reviews")}</h2>
          <div className="mt-6 flex items-end gap-4">
            <span className="font-display text-7xl font-light">{product.rating.toFixed(1)}</span>
            <div className="pb-3">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating) ? "fill-gold text-gold" : "text-bone/20")} />
                ))}
              </div>
              <p className="mt-1 text-xs text-bone/50">
                {product.reviewCount + userReviews.filter((r) => r.productId === product.id).length} {zh ? "条评价" : "ratings"}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            {dist.map((n, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="w-6 text-bone/60">{5 - i}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bone/[0.07]">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${(n / product.reviewCount) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.08, ease: EASE }} className="h-full rounded-full bg-gradient-to-r from-santal to-gold" />
                </div>
                <span className="w-8 text-right tabular-nums text-bone/40">{n}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-3xl border border-bone/[0.08] p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-bone/40">{zh ? "买家最常提及" : "Buyers mention"}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(zh ? ["密度高", "金星明显", "包装精美", "适合送礼", "木香淡雅"] : ["Density", "Gold star", "Packaging", "Gift-worthy", "Fragrance"]).map((x) => (
                <span key={x} className="rounded-full bg-bone/[0.05] px-3 py-1.5 text-xs text-bone/70">{x}</span>
              ))}
            </div>
          </div>
          <LuxButton variant="ghost" className="mt-8 w-full" onClick={() => setWriting(true)} magnetic={false}>
            {t("pdp.writeReview")}
          </LuxButton>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", zh ? "全部" : "All"],
                  ["5", zh ? "五星" : "5 stars"],
                  ["verified", zh ? "已验证购买" : "Verified"],
                  ["zh", "中文评价"],
                ] as const
              ).map(([k, label]) => (
                <button key={k} onClick={() => setFilter(k)} className={cn("rounded-full border px-4 py-2 text-xs transition-colors", filter === k ? "border-bone bg-bone text-ink" : "border-bone/15 text-bone/70 hover:border-bone/40")}>
                  {label}
                </button>
              ))}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as "helpful" | "recent")} className="bg-transparent text-xs text-bone/70 outline-none">
              <option className="bg-umber" value="helpful">{zh ? "最有帮助" : "Most helpful"}</option>
              <option className="bg-umber" value="recent">{zh ? "最新" : "Most recent"}</option>
            </select>
          </div>

          <ul className="mt-6 divide-y divide-bone/[0.07]">
            <AnimatePresence initial={false}>
              {shown.map((r) => (
                <motion.li key={r.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="py-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-santal to-oxblood font-display text-lg">{r.author.slice(0, 1)}</span>
                      <div>
                        <p className="text-sm">{r.author}</p>
                        <p className="text-xs text-bone/40">
                          {r.city} · {FLAG[r.country]}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-bone/40">{fmtDate(r.date, locale)}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-gold text-gold" : "text-bone/20")} />
                      ))}
                    </span>
                    {r.verified && (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-jade">
                        <BadgeCheck className="h-3.5 w-3.5" /> {t("pdp.verified")}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-display text-xl">{r.title}</p>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-bone/65">{r.body}</p>
                  <button
                    onClick={() => setVoted((v) => (v.includes(r.id) ? v : [...v, r.id]))}
                    className={cn("mt-4 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors", voted.includes(r.id) ? "border-gold text-gold" : "border-bone/15 text-bone/50 hover:text-bone")}
                  >
                    <ThumbsUp className="h-3 w-3" /> {t("pdp.helpful")} · {r.helpful + (voted.includes(r.id) ? 1 : 0)}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          {shown.length === 0 && <p className="py-10 text-sm text-bone/50">{zh ? "暂无符合条件的评价。" : "No reviews match this filter."}</p>}
        </div>
      </div>

      <AnimatePresence>
        {writing && (
          <WriteReview
            onClose={() => setWriting(false)}
            onSubmit={(r) => {
              addReview({ ...r, id: `u${Date.now()}`, productId: product.id, date: new Date().toISOString().slice(0, 10), helpful: 0, verified: false });
              setWriting(false);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function WriteReview({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: Omit<Review, "id" | "productId" | "date" | "helpful" | "verified">) => void }) {
  const { zh } = useT();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ author: "", city: "", title: "", body: "" });
  return (
    <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.form
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ ...form, rating, country: zh ? "CN" : "IN" });
        }}
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative w-full max-w-lg rounded-[32px] border border-bone/10 bg-umber p-8"
      >
        <button type="button" onClick={onClose} className="absolute right-6 top-6 text-bone/50 hover:text-bone" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        <h3 className="font-display text-3xl">{zh ? "分享您的体验" : "Share your experience"}</h3>
        <div className="mt-6 flex gap-1" onMouseLeave={() => setHover(0)}>
          {Array.from({ length: 5 }, (_, i) => (
            <button type="button" key={i} onMouseEnter={() => setHover(i + 1)} onClick={() => setRating(i + 1)} aria-label={`${i + 1} stars`}>
              <Star className={cn("h-7 w-7 transition-transform hover:scale-110", i < (hover || rating) ? "fill-gold text-gold" : "text-bone/20")} />
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-6">
          <input required className="field" placeholder={zh ? "您的名字" : "Your name"} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <input required className="field" placeholder={zh ? "城市" : "City"} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <input required className="field" placeholder={zh ? "标题" : "Headline"} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea required rows={4} className="field resize-none" placeholder={zh ? "您喜欢它的哪些方面？" : "What did you notice about it?"} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <button type="button" className="mt-4 flex items-center gap-2 text-xs text-bone/50 hover:text-bone">
          <Camera className="h-4 w-4" /> {zh ? "添加照片" : "Add photos"}
        </button>
        <LuxButton type="submit" className="mt-8 w-full" magnetic={false}>{zh ? "提交评价" : "Submit review"}</LuxButton>
        <p className="mt-3 text-center text-[11px] text-bone/40">{zh ? "评价将在审核后显示“已验证”标识。" : "Reviews show a Verified badge once matched to an order."}</p>
      </motion.form>
    </motion.div>
  );
}
