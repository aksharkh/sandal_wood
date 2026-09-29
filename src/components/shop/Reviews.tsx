"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Star, X } from "lucide-react";
import type { Product, Review } from "@/lib/types";
import { useMaison, useT } from "@/lib/store";
import { Button, EASE, Heading } from "../motion/primitives";
import { cn, fmtDate } from "@/lib/utils";

const COUNTRY: Record<Review["country"], string> = { IN: "India", CN: "中国", SG: "Singapore", AE: "UAE", GB: "UK", US: "USA" };

const Stars = ({ n, size = "h-3.5 w-3.5" }: { n: number; size?: string }) => (
  <span className="flex gap-0.5" aria-label={`${n} of 5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={cn(size, i < Math.round(n) ? "fill-ink text-ink" : "text-line")} />
    ))}
  </span>
);

export function Reviews({ product, base }: { product: Product; base: Review[] }) {
  const { t, zh, locale } = useT();
  const userReviews = useMaison((s) => s.userReviews);
  const addReview = useMaison((s) => s.addReview);
  const [filter, setFilter] = useState<"all" | "5" | "zh" | "verified">("all");
  const [sort, setSort] = useState<"helpful" | "recent">("helpful");
  const [voted, setVoted] = useState<string[]>([]);
  const [writing, setWriting] = useState(false);

  const all = useMemo(() => [...userReviews.filter((r) => r.productId === product.id), ...base], [userReviews, base, product.id]);
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
    <section id="reviews" className="mt-24 scroll-mt-32 bg-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Heading className="text-4xl">{t("pdp.reviews")}</Heading>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-display text-6xl">{product.rating.toFixed(1)}</span>
            <div>
              <Stars n={product.rating} size="h-4 w-4" />
              <p className="mt-1 text-[13px] text-muted">{product.reviewCount} {zh ? "条评价" : "ratings"}</p>
            </div>
          </div>
          <ul className="mt-6 space-y-2">
            {dist.map((n, i) => (
              <li key={i} className="flex items-center gap-3 text-[12px]">
                <span className="w-4 text-graphite">{5 - i}</span>
                <span className="relative h-[3px] flex-1 bg-line">
                  <span className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${(n / product.reviewCount) * 100}%` }} />
                </span>
                <span className="w-8 text-right tabular-nums text-muted">{n}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" className="mt-8 w-full" onClick={() => setWriting(true)}>{t("pdp.writeReview")}</Button>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 text-[13px]">
            <div className="flex flex-wrap gap-5">
              {(
                [
                  ["all", zh ? "全部" : "All"],
                  ["5", zh ? "五星" : "5 stars"],
                  ["verified", zh ? "已验证购买" : "Verified buyers"],
                  ["zh", "中文评价"],
                ] as const
              ).map(([k, label]) => (
                <button key={k} onClick={() => setFilter(k)} className={filter === k ? "text-ink underline underline-offset-[6px]" : "text-graphite hover:text-ink"}>
                  {label}
                </button>
              ))}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as "helpful" | "recent")} className="bg-transparent outline-none">
              <option value="helpful">{zh ? "最有帮助" : "Most helpful"}</option>
              <option value="recent">{zh ? "最新" : "Most recent"}</option>
            </select>
          </div>
          <ul className="divide-y divide-line">
            {shown.map((r) => (
              <li key={r.id} className="py-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Stars n={r.rating} />
                  <span className="text-[12px] text-muted">{fmtDate(r.date, locale)}</span>
                </div>
                <p className="mt-3 font-display text-2xl">{r.title}</p>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-graphite">{r.body}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted">
                  <span className="text-ink">{r.author}</span>
                  <span>{r.city}, {COUNTRY[r.country]}</span>
                  {r.verified && <span className="text-moss">{t("pdp.verified")}</span>}
                  <button onClick={() => setVoted((v) => (v.includes(r.id) ? v : [...v, r.id]))} className={voted.includes(r.id) ? "text-ink" : "hover:text-ink"}>
                    {t("pdp.helpful")} ({r.helpful + (voted.includes(r.id) ? 1 : 0)})
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {shown.length === 0 && <p className="py-10 text-[14px] text-muted">{zh ? "暂无符合条件的评价。" : "No reviews match this filter."}</p>}
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
  const [form, setForm] = useState({ author: "", city: "", title: "", body: "" });
  return (
    <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-ink/30 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.form
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ ...form, rating, country: zh ? "CN" : "IN" });
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative w-full max-w-lg bg-paper p-8 md:p-10"
      >
        <button type="button" onClick={onClose} className="absolute right-6 top-6" aria-label="Close"><X className="h-5 w-5" strokeWidth={1.4} /></button>
        <Heading className="text-3xl">{zh ? "撰写评价" : "Write a review"}</Heading>
        <div className="mt-6 flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button type="button" key={i} onClick={() => setRating(i + 1)} aria-label={`${i + 1} stars`}>
              <Star className={cn("h-6 w-6", i < rating ? "fill-ink text-ink" : "text-line")} />
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-6">
          <input required className="field" placeholder={zh ? "姓名" : "Name"} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
          <input required className="field" placeholder={zh ? "城市" : "City"} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </div>
        <input required className="field" placeholder={zh ? "标题" : "Title"} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea required rows={4} className="field resize-none" placeholder={zh ? "您的体验" : "Your experience"} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <Button type="submit" className="mt-8 w-full">{zh ? "提交" : "Submit review"}</Button>
      </motion.form>
    </motion.div>
  );
}
