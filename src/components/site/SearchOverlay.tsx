"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useActiveProducts, useShop, useT } from "@/lib/store";
import { JOURNAL } from "@/lib/data/journal";
import { ProductVisual } from "../visual/ProductVisual";
import { EASE } from "../motion/primitives";
import { searchProducts } from "@/lib/search";

const POPULAR = [
  { en: "Gold star bracelet", zh: "金星手串" },
  { en: "108 mala", zh: "念珠" },
  { en: "Bangle", zh: "手镯" },
  { en: "Gift under ₹10,000", zh: "万元以下礼物" },
  { en: "Wedding", zh: "婚礼" },
  { en: "Powder", zh: "红檀粉" },
];

export function SearchOverlay() {
  const { t, l, m, zh } = useT();
  const open = useShop((s) => s.searchOpen);
  const setOpen = useShop((s) => s.setSearchOpen);
  const products = useActiveProducts();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 300);
  }, [open]);

  const results = useMemo(() => (q.trim() ? searchProducts(products, q).slice(0, 6) : []), [q, products]);
  const posts = useMemo(
    () => (q.trim() ? JOURNAL.filter((j) => (j.title.en + (j.title.zh ?? "")).toLowerCase().includes(q.toLowerCase())).slice(0, 3) : []),
    [q],
  );

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-[90] overflow-y-auto bg-ink/95 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto max-w-5xl px-6 pb-20 pt-10">
            <div className="flex justify-end">
              <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-bone/15 hover:border-bone/50" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <motion.form
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`);
              }}
              className="mt-10 flex items-center gap-4 border-b border-bone/20 pb-4 focus-within:border-gold"
            >
              <Search className="h-7 w-7 text-gold" strokeWidth={1.2} />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full bg-transparent font-display text-4xl text-bone outline-none placeholder:text-bone/25 md:text-6xl"
              />
              <kbd className="hidden rounded border border-bone/15 px-2 py-1 font-mono text-[10px] text-bone/40 md:block">ESC</kbd>
            </motion.form>

            {!q && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-bone/40">{zh ? "热门搜索" : "Popular"}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {POPULAR.map((p) => (
                    <button key={p.en} onClick={() => setQ(zh ? p.zh : p.en)} className="rounded-full border border-bone/15 px-4 py-2 text-sm text-bone/80 transition-colors hover:border-gold hover:text-gold">
                      {zh ? p.zh : p.en}
                    </button>
                  ))}
                </div>
                <p className="mt-10 text-xs text-bone/40">
                  {zh ? "试试自然语言：" : "Try natural language: "}
                  <button onClick={() => setQ("gift under 10000")} className="text-gold underline-offset-4 hover:underline">
                    {zh ? "“一万元以下的礼物”" : "“gift under 10000”"}
                  </button>
                </p>
              </motion.div>
            )}

            {q && (
              <div className="mt-10 grid gap-10 md:grid-cols-[1fr_280px]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-bone/40">
                    {results.length} {zh ? "件作品" : "objects"}
                  </p>
                  <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {results.map((p, i) => (
                      <motion.li key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.5, ease: EASE }}>
                        <Link href={`/product/${p.slug}`} onClick={() => setOpen(false)} className="group block">
                          <div className="aspect-square overflow-hidden rounded-2xl bg-umber">
                            <ProductVisual kind={p.visual} tone={p.tone} image={p.images?.[0]} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                          </div>
                          <p className="mt-2 font-display text-lg leading-tight">{l(p.name)}</p>
                          <p className="text-xs text-bone/50">{m(p.price)}</p>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                  {results.length === 0 && <p className="mt-4 text-bone/50">{zh ? "暂无结果，试试“手串”或“bangle”。" : "Nothing yet — try “bracelet” or “手串”."}</p>}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-bone/40">{t("nav.journal")}</p>
                  <ul className="mt-4 space-y-3">
                    {posts.map((j) => (
                      <li key={j.slug}>
                        <Link href={`/journal/${j.slug}`} onClick={() => setOpen(false)} className="group flex items-start justify-between gap-2 border-b border-bone/10 pb-3 text-sm text-bone/80 hover:text-bone">
                          {l(j.title)}
                          <ArrowUpRight className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                    {posts.length === 0 && <li className="text-sm text-bone/40">—</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
