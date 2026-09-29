"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useActiveProducts, useT } from "@/lib/store";
import { searchProducts } from "@/lib/search";
import { ProductCard } from "@/components/shop/ProductCard";

function SearchInner() {
  const { t, zh } = useT();
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";
  const [q, setQ] = useState(initial);
  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setQ(initial);
  }
  const products = useActiveProducts();
  const results = useMemo(() => (initial ? searchProducts(products, initial) : products), [products, initial]);

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-32 pt-40 md:px-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/search?q=${encodeURIComponent(q)}`);
        }}
        className="flex items-center gap-4 border-b border-bone/20 pb-4 focus-within:border-gold"
      >
        <Search className="h-7 w-7 text-gold" strokeWidth={1.2} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search.placeholder")} className="w-full bg-transparent font-display text-4xl outline-none placeholder:text-bone/25 md:text-6xl" />
      </form>
      <p className="mt-6 text-sm text-bone/50">
        {initial ? (zh ? `“${initial}” 共 ${results.length} 件结果` : `${results.length} results for “${initial}”`) : zh ? "全部作品" : "All objects"}
      </p>
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:grid-cols-4">
        {results.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}
