"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Crown, Mail, MessageCircle, Search } from "lucide-react";
import { useMaison } from "@/lib/store";
import type { Customer } from "@/lib/types";
import { Drawer, PageHead, Panel, RegionTag, StatusBadge, Th } from "@/components/admin/ui";
import { ExportMenu } from "@/components/admin/Shell";
import { customerRows } from "@/lib/export";
import { cn, fmtDate, money } from "@/lib/utils";

const inr = (n: number) => money(n, "INR");

function CustomersInner() {
  const params = useSearchParams();
  const customers = useMaison((s) => s.customers);
  const orders = useMaison((s) => s.orders);
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const [tier, setTier] = useState("all");
  const [sort, setSort] = useState<"ltv" | "orders" | "recent">("ltv");
  const [openId, setOpenId] = useState<string | null>(params.get("open"));

  const enriched = useMemo(
    () =>
      customers.map((c) => {
        const mine = orders.filter((o) => o.customerId === c.id || o.email === c.email);
        const paid = mine.filter((o) => o.payment === "paid");
        return { c, orders: mine, ltv: paid.reduce((s, o) => s + o.total, 0), last: mine[0]?.createdAt ?? "" };
      }),
    [customers, orders],
  );

  const list = enriched
    .filter((r) => region === "all" || r.c.region === region)
    .filter((r) => tier === "all" || r.c.tier === tier)
    .filter((r) => !q || (r.c.name + r.c.email + r.c.phone + r.c.city).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === "ltv" ? b.ltv - a.ltv : sort === "orders" ? b.orders.length - a.orders.length : b.last.localeCompare(a.last)));

  const open = enriched.find((r) => r.c.id === openId);
  const repeat = enriched.filter((r) => r.orders.length > 1).length;

  return (
    <div className="space-y-6">
      <PageHead title="Customers" sub={`${customers.length} clients · ${repeat} repeat buyers · ${Math.round((repeat / Math.max(1, customers.length)) * 100)}% repeat rate`} actions={<ExportMenu name="customers" sheet="Customers" rows={() => customerRows(list.map((r) => r.c), orders)} />} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-bone/10 bg-bone/[0.02] px-3 focus-within:border-gold/50">
          <Search className="h-4 w-4 text-bone/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, phone, city" className="w-full bg-transparent text-sm outline-none placeholder:text-bone/30" />
        </div>
        <select className="admin-input !w-auto" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="all">All regions</option>
          <option>India</option>
          <option>China</option>
          <option>International</option>
        </select>
        <select className="admin-input !w-auto" value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value="all">All tiers</option>
          <option>Circle Gold</option>
          <option>Circle</option>
          <option>Guest</option>
        </select>
        <select className="admin-input !w-auto" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="ltv">Sort: lifetime value</option>
          <option value="orders">Sort: orders</option>
          <option value="recent">Sort: most recent</option>
        </select>
      </div>

      <Panel pad={false}>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-bone/[0.06]">
              <tr>
                <Th className="pl-6">Client</Th>
                <Th>Location</Th>
                <Th>Tier</Th>
                <Th>Orders</Th>
                <Th>Last order</Th>
                <Th className="pr-6 text-right">Lifetime value</Th>
              </tr>
            </thead>
            <tbody>
              {list.map(({ c, orders: o, ltv, last }) => (
                <tr key={c.id} onClick={() => setOpenId(c.id)} className="cursor-pointer border-t border-bone/[0.04] hover:bg-bone/[0.025]">
                  <td className="py-3 pl-6">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-santal/70 to-oxblood font-display">{c.name.slice(0, 1)}</span>
                      <span>
                        <span className="block text-bone/90">{c.name}</span>
                        <span className="text-[11px] text-bone/40">{c.email}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4">
                    <span className="block text-bone/70">{c.city}</span>
                    <RegionTag region={c.region} />
                  </td>
                  <td className="px-4">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px]", c.tier === "Circle Gold" ? "bg-gold/15 text-gold" : c.tier === "Circle" ? "bg-bone/[0.06] text-bone/70" : "text-bone/40")}>
                      {c.tier === "Circle Gold" && <Crown className="h-3 w-3" />} {c.tier}
                    </span>
                  </td>
                  <td className="px-4 tabular-nums text-bone/70">{o.length}</td>
                  <td className="px-4 text-bone/55">{last ? fmtDate(last) : "—"}</td>
                  <td className="pr-6 text-right tabular-nums">{inr(ltv)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <CustomerDrawer data={open} onClose={() => setOpenId(null)} />
    </div>
  );
}

function CustomerDrawer({ data, onClose }: { data?: { c: Customer; orders: ReturnType<typeof useMaison.getState>["orders"]; ltv: number }; onClose: () => void }) {
  if (!data) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;
  const { c, orders, ltv } = data;
  return (
    <Drawer
      open
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-santal to-oxblood font-display text-lg">{c.name.slice(0, 1)}</span>
          <div>
            <p className="font-display text-2xl">{c.name}</p>
            <p className="text-xs text-bone/45">{c.id} · client since {fmtDate(c.joined)}</p>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Lifetime value", inr(ltv)],
          ["Orders", String(orders.length)],
          ["Avg. order", inr(orders.length ? ltv / orders.length : 0)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-bone/[0.07] p-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-bone/40">{k}</p>
            <p className="mt-2 font-display text-2xl tabular-nums">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-2 rounded-2xl border border-bone/[0.07] p-4 text-sm">
        <p className="flex items-center gap-2 text-bone/75"><Mail className="h-4 w-4 text-gold" /> {c.email}</p>
        <p className="flex items-center gap-2 text-bone/75"><MessageCircle className="h-4 w-4 text-gold" /> {c.phone} · {c.region === "China" ? "WeChat" : "WhatsApp"}</p>
        <p className="text-bone/55">{c.city}, {c.country}</p>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {c.tags.map((t) => <span key={t} className="rounded-full bg-bone/[0.06] px-2.5 py-1 text-[11px] text-bone/65">{t}</span>)}
        </div>
      </div>
      <p className="mt-8 text-[10px] uppercase tracking-[0.16em] text-bone/40">Order history</p>
      <ul className="mt-3 space-y-2">
        {orders.map((o) => (
          <li key={o.id}>
            <a href={`/admin/orders?open=${o.id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-bone/[0.06] px-4 py-3 text-sm hover:border-gold/30">
              <span>
                <span className="font-mono text-gold">{o.id}</span>
                <span className="block text-[11px] text-bone/40">{fmtDate(o.createdAt)} · {o.lines.map((l) => l.name).join(", ")}</span>
              </span>
              <span className="flex items-center gap-3">
                <StatusBadge status={o.status} />
                <span className="tabular-nums text-bone/70">{inr(o.total)}</span>
              </span>
            </a>
          </li>
        ))}
        {orders.length === 0 && <li className="text-sm text-bone/40">No orders yet.</li>}
      </ul>
    </Drawer>
  );
}

export default function CustomersPage() {
  return (
    <Suspense>
      <CustomersInner />
    </Suspense>
  );
}
