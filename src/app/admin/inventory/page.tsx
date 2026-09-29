"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Minus, PackagePlus, Plus, Search } from "lucide-react";
import { useMaison } from "@/lib/store";
import { Btn, PageHead, Panel, Th, toast } from "@/components/admin/ui";
import { ExportMenu } from "@/components/admin/Shell";
import { BarList } from "@/components/admin/charts";
import { ProductPhoto } from "@/components/motion/primitives";
import { productRows } from "@/lib/export";
import { cn, money } from "@/lib/utils";

type Log = { at: string; sku: string; name: string; delta: number; reason: string };

export default function InventoryPage() {
  const products = useMaison((s) => s.products);
  const orders = useMaison((s) => s.orders);
  const setVariantStock = useMaison((s) => s.setVariantStock);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [threshold, setThreshold] = useState(3);
  const [log, setLog] = useState<Log[]>([]);
  const [reason, setReason] = useState("Received from atelier");

  const [now] = useState(() => Date.now());
  const rows = useMemo(() => {
    const sold30 = new Map<string, number>();
    const cutoff = now - 30 * 864e5;
    orders
      .filter((o) => new Date(o.createdAt).getTime() > cutoff && o.status !== "cancelled")
      .forEach((o) => o.lines.forEach((l) => sold30.set(l.variantId, (sold30.get(l.variantId) ?? 0) + l.qty)));
    return products.flatMap((p) =>
      p.variants.map((v) => {
        const velocity = sold30.get(v.id) ?? 0;
        return { p, v, velocity, cover: velocity ? Math.round((v.stock / velocity) * 30) : null, value: (p.price + v.priceDelta) * v.stock };
      }),
    );
  }, [products, orders, now]);

  const list = rows
    .filter((r) => (filter === "low" ? r.v.stock > 0 && r.v.stock <= threshold : filter === "out" ? r.v.stock === 0 : true))
    .filter((r) => !q || (r.p.name.en + r.v.sku + r.p.provenance.batch).toLowerCase().includes(q.toLowerCase()));

  const totals = {
    units: rows.reduce((s, r) => s + r.v.stock, 0),
    value: rows.reduce((s, r) => s + r.value, 0),
    low: rows.filter((r) => r.v.stock > 0 && r.v.stock <= threshold).length,
    out: rows.filter((r) => r.v.stock === 0).length,
  };
  const byBatch = Object.entries(
    rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.p.provenance.batch] = (acc[r.p.provenance.batch] ?? 0) + r.v.stock;
      return acc;
    }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const adjust = (pid: string, vid: string, next: number, why = reason) => {
    const r = rows.find((x) => x.v.id === vid)!;
    const delta = next - r.v.stock;
    if (!delta) return;
    setVariantStock(pid, vid, next);
    setLog((l) =>
      [
        {
          at: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          sku: r.v.sku,
          name: `${r.p.name.en} · ${r.v.label.en}`,
          delta,
          reason: why,
        },
        ...l,
      ].slice(0, 30),
    );
  };

  return (
    <div className="space-y-6">
      <PageHead
        title="Inventory"
        sub="Per-variant stock, sell-through and batch balances"
        actions={<ExportMenu name="inventory" sheet="Inventory" rows={() => productRows(products)} />}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { k: "Units on hand", v: totals.units.toLocaleString("en-IN") },
          { k: "Stock value (retail)", v: money(totals.value, "INR", { compact: true }) },
          { k: `Low (≤${threshold})`, v: String(totals.low), warn: totals.low > 0, f: "low" as const },
          { k: "Out of stock", v: String(totals.out), warn: totals.out > 0, f: "out" as const },
        ].map((k) => (
          <button
            key={k.k}
            onClick={() => k.f && setFilter(filter === k.f ? "all" : k.f)}
            className={cn(
              "border p-5 text-left transition-colors",
              k.f && filter === k.f ? "border-clay/50 bg-clay/[0.05]" : k.warn ? "border-[#e2b340]/25 bg-[#e2b340]/[0.04]" : "border-line bg-stone",
            )}
          >
            <p className="text-[12px] uppercase tracking-[0.18em] text-muted">{k.k}</p>
            <p className="mt-3 font-display text-4xl tabular-nums">{k.v}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-10 min-w-[240px] flex-1 items-center gap-2 border border-line bg-stone px-3 focus-within:border-ink/50">
              <Search className="h-4 w-4 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Product, SKU or batch"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-graphite">
              Low-stock threshold
              <input
                type="number"
                min={1}
                value={threshold}
                onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))}
                className="admin-input !w-16"
              />
            </label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="admin-input !w-56"
              placeholder="Adjustment reason"
              aria-label="Adjustment reason"
            />
          </div>
          <Panel pad={false}>
            <div className="thin-scroll overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead className="border-b border-line">
                  <tr>
                    <Th className="pl-6">Item</Th>
                    <Th>SKU</Th>
                    <Th>Batch</Th>
                    <Th>Sold 30d</Th>
                    <Th>Days cover</Th>
                    <Th>On hand</Th>
                    <Th className="pr-6 text-right">Restock</Th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(({ p, v, velocity, cover }) => (
                    <tr key={v.id} className="border-t border-line hover:bg-stone">
                      <td className="py-2.5 pl-6">
                        <div className="flex items-center gap-3">
                          <span className="h-10 w-10 shrink-0 overflow-hidden bg-stone">
                            <ProductPhoto p={p} className="h-full w-full" sizes="96px" />
                          </span>
                          <span>
                            <span className="block text-ink">{p.name.en}</span>
                            <span className="text-[12px] text-muted">{v.label.en}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 font-mono text-xs text-graphite">{v.sku}</td>
                      <td className="px-4 font-mono text-xs text-graphite">{p.provenance.batch}</td>
                      <td className="px-4 tabular-nums text-graphite">{velocity}</td>
                      <td className="px-4">
                        {cover === null ? (
                          <span className="text-muted">—</span>
                        ) : (
                          <span className={cn("tabular-nums", cover < 14 ? "text-[#7d5a0e]" : "text-graphite")}>{cover}d</span>
                        )}
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => adjust(p.id, v.id, v.stock - 1, "Manual −1")}
                            className="grid h-7 w-7 place-items-center border border-line text-graphite hover:text-ink"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            key={v.stock}
                            defaultValue={v.stock}
                            onBlur={(e) => adjust(p.id, v.id, Math.max(0, Number(e.target.value) || 0))}
                            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                            className={cn(
                              "h-7 w-14 border border-line bg-transparent text-center tabular-nums outline-none focus:border-clay/50",
                              v.stock === 0 ? "text-[#a3362a]" : v.stock <= threshold ? "text-[#7d5a0e]" : "text-ink",
                            )}
                            aria-label={`Stock for ${v.sku}`}
                          />
                          <button
                            onClick={() => adjust(p.id, v.id, v.stock + 1, "Manual +1")}
                            className="grid h-7 w-7 place-items-center border border-line text-graphite hover:text-ink"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          {v.stock <= threshold && <AlertTriangle className="ml-1 h-3.5 w-3.5 text-[#7d5a0e]" aria-label="Low stock" />}
                        </div>
                      </td>
                      <td className="pr-6 text-right">
                        <Btn
                          size="sm"
                          onClick={() => {
                            adjust(p.id, v.id, v.stock + 10);
                            toast(`+10 × ${v.sku}`);
                          }}
                        >
                          <PackagePlus className="h-3.5 w-3.5" /> +10
                        </Btn>
                      </td>
                    </tr>
                  ))}
                  {list.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-14 text-center text-muted">
                        Nothing here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
        <div className="space-y-4">
          <Panel title="Units by batch">
            <BarList items={byBatch} format={(n) => `${n} u`} colorFor={() => "#4a4540"} />
          </Panel>
          <Panel title="Adjustment log (this session)">
            <ul className="thin-scroll max-h-[340px] space-y-3 overflow-y-auto text-xs">
              {log.map((l, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-ink">{l.name}</span>
                    <span className="text-muted">
                      {l.at} · {l.reason}
                    </span>
                  </span>
                  <span className={cn("shrink-0 tabular-nums", l.delta > 0 ? "text-[#2f6b45]" : "text-[#a3362a]")}>
                    {l.delta > 0 ? "+" : ""}
                    {l.delta}
                  </span>
                </li>
              ))}
              {log.length === 0 && <li className="text-muted">Stock changes you make appear here.</li>}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
