"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useActiveProducts, useShop, useT } from "@/lib/store";
import { JOURNAL } from "@/lib/data/journal";
import { ProductPhoto } from "../motion/primitives";
import { searchProducts } from "@/lib/search";

const POPULAR = [
  { en: "Bracelet", zh: "手串" },
  { en: "Mala", zh: "念珠" },
  { en: "Bangle", zh: "手镯" },
  { en: "Gift under 10000", zh: "一万元以下礼物" },
  { en: "Wedding", zh: "婚礼" },
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
    if (open) setTimeout(() => input.current?.focus(), 150);
  }, [open]);

  const results = useMemo(() => (q.trim() ? searchProducts(products, q).slice(0, 4) : []), [q, products]);
  const posts = useMemo(() => (q.trim() ? JOURNAL.filter((j) => (j.title.en + (j.title.zh ?? "")).toLowerCase().includes(q.toLowerCase())).slice(0, 3) : []), [q]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[89] bg-ink/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.div
            data-lenis-prevent
            className="fixed inset-x-0 top-0 z-[90] max-h-[90vh] overflow-y-auto border-b border-line bg-page"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 md:px-10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (q.trim()) {
                    setOpen(false);
                    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
                  }
                }}
                className="flex items-center gap-4 border-b border-ink pb-3"
              >
                <Search className="h-5 w-5" strokeWidth={1.4} />
                <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search.placeholder")} className="w-full bg-transparent font-display text-3xl outline-none placeholder:text-muted md:text-4xl" />
                <button type="button" onClick={() => setOpen(false)} aria-label="Close"><X className="h-5 w-5" strokeWidth={1.4} /></button>
              </form>

              {!q ? (
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px]">
                  <span className="text-muted">{zh ? "热门：" : "Popular:"}</span>
                  {POPULAR.map((p) => (
                    <button key={p.en} onClick={() => setQ(zh ? p.zh : p.en)} className="text-graphite underline-offset-4 hover:text-ink hover:underline">
                      {zh ? p.zh : p.en}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-10 grid gap-10 md:grid-cols-[1fr_300px]">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{results.length} {zh ? "件作品" : "objects"}</p>
                    <ul className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
                      {results.map((p) => (
                        <li key={p.id}>
                          <Link href={`/product/${p.slug}`} onClick={() => setOpen(false)} className="group block">
                            <ProductPhoto p={p} className="aspect-[4/5]" sizes="200px" />
                            <p className="mt-3 text-[14px]">{l(p.name)}</p>
                            <p className="text-[13px] text-muted">{m(p.price)}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {results.length === 0 && <p className="mt-4 text-graphite">{zh ? "暂无结果。" : "No results — try “bracelet” or “手串”."}</p>}
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{t("nav.journal")}</p>
                    <ul className="mt-5 space-y-3">
                      {posts.map((j) => (
                        <li key={j.slug}>
                          <Link href={`/journal/${j.slug}`} onClick={() => setOpen(false)} className="font-display text-xl hover:text-clay">{l(j.title)}</Link>
                        </li>
                      ))}
                      {posts.length === 0 && <li className="text-[14px] text-muted">—</li>}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
