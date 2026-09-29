"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Check, Inbox } from "lucide-react";
import { useMaison } from "@/lib/store";
import { AreaChart, BarList, SegmentBar, Sparkline } from "@/components/admin/charts";
import { Btn, PageHead, Panel, PayBadge, REGION_COLORS, RegionTag, StatusBadge, toast } from "@/components/admin/ui";
import { ExportMenu } from "@/components/admin/Shell";
import { orderRows } from "@/lib/export";
import { EASE } from "@/components/motion/primitives";
import { cn, fmtDateTime, money } from "@/lib/utils";

const DAY = 864e5;
const inr = (n: number) => money(n, "INR");
const compact = (n: number) => money(n, "INR", { compact: true });

export default function Dashboard() {
  const orders = useMaison((s) => s.orders);
  const products = useMaison((s) => s.products);
  const enquiries = useMaison((s) => s.enquiries);
  const setOrderStatus = useMaison((s) => s.setOrderStatus);
  const [range, setRange] = useState(30);

  const [now] = useState(() => Date.now());
  const m = useMemo(() => {
    const live = orders.filter((o) => o.status !== "cancelled" && o.payment !== "failed");
    const within = (a: number, b: number) => live.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t > now - a * DAY && t <= now - b * DAY;
    });
    const cur = within(range, 0);
    const prev = within(range * 2, range);
    const rev = cur.reduce((s, o) => s + o.total, 0);
    const prevRev = prev.reduce((s, o) => s + o.total, 0);
    const series = Array.from({ length: range }, (_, i) => {
      const start = now - (range - i) * DAY;
      const v = live.filter((o) => {
        const t = new Date(o.createdAt).getTime();
        return t > start && t <= start + DAY;
      }).reduce((s, o) => s + o.total, 0);
      return { label: new Date(start + DAY).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), value: v };
    });
    const byRegion = (["India", "China", "International"] as const).map((r) => ({ label: r, value: cur.filter((o) => o.region === r).reduce((s, o) => s + o.total, 0), color: REGION_COLORS[r] }));
    const prodRev = new Map<string, number>();
    cur.forEach((o) => o.lines.forEach((l) => prodRev.set(l.name, (prodRev.get(l.name) ?? 0) + l.price * l.qty)));
    const top = [...prodRev.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value }));
    const pct = (a: number, b: number) => (b ? ((a - b) / b) * 100 : 0);
    return {
      rev,
      revDelta: pct(rev, prevRev),
      count: cur.length,
      countDelta: pct(cur.length, prev.length),
      aov: cur.length ? rev / cur.length : 0,
      aovDelta: pct(cur.length ? rev / cur.length : 0, prev.length ? prevRev / prev.length : 0),
      series,
      byRegion,
      top,
    };
  }, [orders, range, now]);

  const pending = orders.filter((o) => o.status === "pending");
  const low = products.flatMap((p) => p.variants.filter((v) => v.stock <= 3).map((v) => ({ p, v }))).slice(0, 6);
  const newEnq = enquiries.filter((e) => e.status === "new");
  const spark = m.series.map((s) => s.value);

  const kpis = [
    { k: "Revenue", v: compact(m.rev), d: m.revDelta, spark },
    { k: "Orders", v: String(m.count), d: m.countDelta, spark: m.series.map((s) => (s.value ? 1 : 0)) },
    { k: "Avg. order value", v: compact(m.aov), d: m.aovDelta },
    { k: "Awaiting confirmation", v: String(pending.length), warn: pending.length > 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHead
        title="Good afternoon, Meera."
        sub={`${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} · here is the atelier at a glance`}
        actions={
          <>
            <div className="flex rounded-xl border border-bone/10 p-1">
              {[7, 30, 90].map((r) => (
                <button key={r} onClick={() => setRange(r)} className={cn("relative rounded-lg px-3 py-1.5 text-xs", range === r ? "text-ink" : "text-bone/60 hover:text-bone")}>
                  {range === r && <motion.span layoutId="range" className="absolute inset-0 rounded-lg bg-bone" transition={{ duration: 0.35, ease: EASE }} />}
                  <span className="relative">{r}d</span>
                </button>
              ))}
            </div>
            <ExportMenu name="orders" sheet="Orders" rows={() => orderRows(orders)} />
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }} className={cn("relative overflow-hidden rounded-3xl border p-5", k.warn ? "border-ember/30 bg-ember/[0.06]" : "border-bone/[0.07] bg-bone/[0.02]")}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-bone/45">{k.k}</p>
            <div className="mt-3 flex items-end justify-between gap-2">
              <p className="font-display text-4xl font-light tabular-nums">{k.v}</p>
              {k.spark && <Sparkline values={k.spark} />}
            </div>
            {k.d !== undefined ? (
              <p className={cn("mt-2 flex items-center gap-1 text-xs", k.d >= 0 ? "text-[#7ee8a3]" : "text-[#fa9a9a]")}>
                {k.d >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {Math.abs(k.d).toFixed(1)}% <span className="text-bone/35">vs previous {range}d</span>
              </p>
            ) : (
              <Link href="/admin/orders?status=pending" className="mt-2 inline-block text-xs text-blush hover:underline">Review now →</Link>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title={`Revenue · last ${range} days (INR)`} className="xl:col-span-2">
          <AreaChart data={m.series} format={inr} />
        </Panel>
        <Panel title="Revenue by region">
          <SegmentBar parts={m.byRegion} format={compact} />
          <p className="mt-6 text-[11px] leading-relaxed text-bone/35">Ledger in INR. China orders are charged in CNY at checkout via Alipay / WeChat Pay / UnionPay.</p>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Awaiting confirmation" action={<Link href="/admin/orders?status=pending" className="text-xs text-gold hover:underline">All orders</Link>} className="xl:col-span-2" pad={false}>
          <div className="thin-scroll overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <tbody>
                {pending.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-t border-bone/[0.05] first:border-t-0">
                    <td className="px-6 py-3.5">
                      <Link href={`/admin/orders?open=${o.id}`} className="font-mono text-gold hover:underline">{o.id}</Link>
                      <p className="text-[11px] text-bone/35">{fmtDateTime(o.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-bone/85">{o.customerName}</p>
                      <RegionTag region={o.region} />
                    </td>
                    <td className="px-4 py-3.5"><PayBadge status={o.payment} /></td>
                    <td className="px-4 py-3.5 text-right tabular-nums">{inr(o.total)}</td>
                    <td className="px-6 py-3.5 text-right">
                      <Btn size="sm" variant="gold" disabled={o.payment !== "paid"} onClick={() => { setOrderStatus(o.id, "confirmed", "Confirmed from dashboard"); toast(`${o.id} confirmed`); }}>
                        <Check className="h-3.5 w-3.5" /> Confirm
                      </Btn>
                    </td>
                  </tr>
                ))}
                {pending.length === 0 && (
                  <tr><td className="px-6 py-10 text-center text-bone/40">All caught up — nothing waiting.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Top objects · revenue">
          <BarList items={m.top} format={compact} />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Low stock" action={<Link href="/admin/inventory" className="text-xs text-gold hover:underline">Inventory</Link>}>
          <ul className="space-y-3">
            {low.map(({ p, v }) => (
              <li key={v.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="block truncate text-bone/85">{p.name.en}</span>
                  <span className="text-[11px] text-bone/40">{v.label.en} · {v.sku}</span>
                </span>
                <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs tabular-nums", v.stock === 0 ? "bg-[#f87171]/12 text-[#fa9a9a]" : "bg-[#e2b340]/12 text-[#e8c264]")}>
                  <AlertTriangle className="h-3 w-3" /> {v.stock}
                </span>
              </li>
            ))}
            {low.length === 0 && <li className="text-sm text-bone/40">Stock levels healthy.</li>}
          </ul>
        </Panel>
        <Panel title="New enquiries" action={<Link href="/admin/enquiries" className="text-xs text-gold hover:underline">Pipeline</Link>}>
          <ul className="space-y-3">
            {newEnq.slice(0, 5).map((e) => (
              <li key={e.id} className="flex gap-3 text-sm">
                <Inbox className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <span className="min-w-0">
                  <span className="block truncate text-bone/85">{e.name} · <span className="text-bone/45">{e.type}</span></span>
                  <span className="line-clamp-1 text-[11px] text-bone/40">{e.message}</span>
                </span>
              </li>
            ))}
            {newEnq.length === 0 && <li className="text-sm text-bone/40">Inbox zero.</li>}
          </ul>
        </Panel>
        <Panel title="Recent activity">
          <ul className="space-y-3">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-bone/75">
                  <span className="font-mono text-gold">{o.id}</span> · {o.customerName}
                </span>
                <StatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
