"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDownUp, Check, Gift, MessageCircle, PackageCheck, Printer, Search, Truck, X } from "lucide-react";
import { useMaison } from "@/lib/store";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { Btn, Drawer, Field, PageHead, Panel, PayBadge, RegionTag, StatusBadge, Th, toast } from "@/components/admin/ui";
import { ExportMenu } from "@/components/admin/Shell";
import { orderRows } from "@/lib/export";
import { cn, fmtDateTime, money } from "@/lib/utils";

const TABS: (OrderStatus | "all")[] = ["all", "pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"];
const NEXT: Partial<Record<OrderStatus, OrderStatus>> = { pending: "confirmed", confirmed: "packed", packed: "shipped", shipped: "delivered" };
const inr = (n: number) => money(n, "INR");

function OrdersInner() {
  const params = useSearchParams();
  const orders = useMaison((s) => s.orders);
  const setOrderStatus = useMaison((s) => s.setOrderStatus);
  const [tab, setTab] = useState<OrderStatus | "all">((params.get("status") as OrderStatus) || "all");
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const [pay, setPay] = useState("all");
  const [sort, setSort] = useState<{ k: "date" | "total"; dir: 1 | -1 }>({ k: "date", dir: -1 });
  const [sel, setSel] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(params.get("open"));
  const [page, setPage] = useState(0);
  const PER = 15;

  const filterKey = `${tab}|${q}|${region}|${pay}`;
  const [prevKey, setPrevKey] = useState(filterKey);
  if (filterKey !== prevKey) {
    setPrevKey(filterKey);
    setPage(0);
  }

  const counts = useMemo(() => Object.fromEntries(TABS.map((t) => [t, t === "all" ? orders.length : orders.filter((o) => o.status === t).length])), [orders]);

  const list = useMemo(() => {
    const ql = q.toLowerCase();
    return orders
      .filter((o) => tab === "all" || o.status === tab)
      .filter((o) => region === "all" || o.region === region)
      .filter((o) => pay === "all" || o.payment === pay)
      .filter((o) => !q || [o.id, o.customerName, o.email, o.phone, o.tracking ?? "", ...o.lines.map((l) => l.name)].join(" ").toLowerCase().includes(ql))
      .sort((a, b) => (sort.k === "date" ? a.createdAt.localeCompare(b.createdAt) : a.total - b.total) * sort.dir);
  }, [orders, tab, region, pay, q, sort]);

  const pageRows = list.slice(page * PER, page * PER + PER);
  const open = orders.find((o) => o.id === openId) ?? null;
  const allSel = pageRows.length > 0 && pageRows.every((o) => sel.includes(o.id));

  const bulk = (status: OrderStatus) => {
    let n = 0;
    sel.forEach((id) => {
      const o = orders.find((x) => x.id === id);
      if (o && NEXT[o.status] === status) {
        setOrderStatus(id, status, "Bulk update");
        n++;
      }
    });
    toast(`${n} order${n === 1 ? "" : "s"} moved to ${status}`);
    setSel([]);
  };

  return (
    <div className="space-y-6">
      <PageHead
        title="Orders"
        sub={`${orders.length} orders · ${counts.pending} awaiting confirmation`}
        actions={<ExportMenu name="orders" sheet="Orders" rows={() => orderRows(sel.length ? orders.filter((o) => sel.includes(o.id)) : list)} />}
      />

      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-bone/[0.07]">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("relative shrink-0 px-4 pb-3 text-[13px] capitalize transition-colors", tab === t ? "text-bone" : "text-bone/45 hover:text-bone/80")}>
            {t} <span className="ml-1 text-[11px] text-bone/35 tabular-nums">{counts[t]}</span>
            {tab === t && <span className="absolute inset-x-2 -bottom-px h-px bg-gold" />}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 min-w-[260px] flex-1 items-center gap-2 rounded-xl border border-bone/10 bg-bone/[0.02] px-3 focus-within:border-gold/50">
          <Search className="h-4 w-4 text-bone/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order ID, customer, product, tracking…" className="w-full bg-transparent text-sm outline-none placeholder:text-bone/30" />
        </div>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="admin-input !w-auto">
          <option value="all">All regions</option>
          <option>India</option>
          <option>China</option>
          <option>International</option>
        </select>
        <select value={pay} onChange={(e) => setPay(e.target.value)} className="admin-input !w-auto">
          <option value="all">All payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {sel.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gold/25 bg-gold/[0.05] px-4 py-3 text-sm">
          <span className="mr-2 text-gold">{sel.length} selected</span>
          <Btn size="sm" variant="gold" onClick={() => bulk("confirmed")}><Check className="h-3.5 w-3.5" /> Confirm</Btn>
          <Btn size="sm" onClick={() => bulk("packed")}><PackageCheck className="h-3.5 w-3.5" /> Mark packed</Btn>
          <Btn size="sm" onClick={() => bulk("shipped")}><Truck className="h-3.5 w-3.5" /> Mark shipped</Btn>
          <Btn size="sm" variant="subtle" onClick={() => setSel([])}><X className="h-3.5 w-3.5" /> Clear</Btn>
        </div>
      )}

      <Panel pad={false}>
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b border-bone/[0.06]">
              <tr>
                <Th className="w-10 pl-6">
                  <input type="checkbox" checked={allSel} onChange={() => setSel(allSel ? sel.filter((id) => !pageRows.some((o) => o.id === id)) : [...new Set([...sel, ...pageRows.map((o) => o.id)])])} className="accent-[#c9a46a]" aria-label="Select page" />
                </Th>
                <Th>Order</Th>
                <Th onClick={() => setSort({ k: "date", dir: sort.k === "date" ? (sort.dir === 1 ? -1 : 1) : -1 })} active={sort.k === "date"}>
                  Date <ArrowDownUp className="ml-1 inline h-3 w-3" />
                </Th>
                <Th>Customer</Th>
                <Th>Items</Th>
                <Th>Payment</Th>
                <Th>Status</Th>
                <Th className="text-right" onClick={() => setSort({ k: "total", dir: sort.k === "total" ? (sort.dir === 1 ? -1 : 1) : -1 })} active={sort.k === "total"}>
                  Total <ArrowDownUp className="ml-1 inline h-3 w-3" />
                </Th>
                <Th className="pr-6" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((o) => (
                <tr key={o.id} onClick={() => setOpenId(o.id)} className={cn("cursor-pointer border-t border-bone/[0.04] transition-colors hover:bg-bone/[0.025]", sel.includes(o.id) && "bg-gold/[0.04]")}>
                  <td className="pl-6" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={sel.includes(o.id)} onChange={() => setSel(sel.includes(o.id) ? sel.filter((x) => x !== o.id) : [...sel, o.id])} className="accent-[#c9a46a]" aria-label={`Select ${o.id}`} />
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-gold">{o.id}</span>
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-bone/30">{o.channel}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-bone/60">{fmtDateTime(o.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-bone/85">{o.customerName}</p>
                    <RegionTag region={o.region} />
                  </td>
                  <td className="max-w-[220px] px-4 py-3.5">
                    <p className="truncate text-bone/70">{o.lines.map((l) => l.name).join(", ")}</p>
                    <p className="text-[11px] text-bone/35">{o.lines.reduce((s, l) => s + l.qty, 0)} units{o.giftWrap ? " · gift" : ""}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <PayBadge status={o.payment} />
                    <p className="text-[11px] text-bone/35">{o.method}</p>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    {inr(o.total)}
                    {o.currency !== "INR" && <p className="text-[11px] text-bone/35">{money(o.total, o.currency)}</p>}
                  </td>
                  <td className="pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    {NEXT[o.status] && o.payment === "paid" && (
                      <Btn size="sm" variant={o.status === "pending" ? "gold" : "ghost"} onClick={() => { setOrderStatus(o.id, NEXT[o.status]!); toast(`${o.id} → ${NEXT[o.status]}`); }}>
                        {o.status === "pending" ? "Confirm" : `Mark ${NEXT[o.status]}`}
                      </Btn>
                    )}
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr><td colSpan={9} className="py-16 text-center text-bone/40">No orders match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-bone/[0.06] px-6 py-3 text-xs text-bone/45">
          <span>
            {list.length ? page * PER + 1 : 0}–{Math.min(list.length, page * PER + PER)} of {list.length}
          </span>
          <div className="flex gap-2">
            <Btn size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Btn>
            <Btn size="sm" disabled={(page + 1) * PER >= list.length} onClick={() => setPage(page + 1)}>Next</Btn>
          </div>
        </div>
      </Panel>

      <OrderDrawer order={open} onClose={() => setOpenId(null)} />
    </div>
  );
}

function OrderDrawer({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const setOrderStatus = useMaison((s) => s.setOrderStatus);
  const patchOrder = useMaison((s) => s.patchOrder);
  const setPayment = useMaison((s) => s.setPayment);
  const [carrier, setCarrier] = useState("");
  const [tracking, setTracking] = useState("");
  const [note, setNote] = useState("");

  const [prevId, setPrevId] = useState<string | undefined>(undefined);
  if (order?.id !== prevId) {
    setPrevId(order?.id);
    setCarrier(order?.carrier ?? (order?.region === "China" ? "SF Express 顺丰" : order?.region === "India" ? "Blue Dart" : "FedEx"));
    setTracking(order?.tracking ?? "");
    setNote("");
  }

  if (!order) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;
  const next = NEXT[order.status];
  const cur = order.currency;
  const msg = encodeURIComponent(`Santalum Maison — your order ${order.id} is now ${order.status}.${order.tracking ? ` Tracking: ${order.carrier} ${order.tracking}` : ""}`);

  return (
    <Drawer
      open={!!order}
      onClose={onClose}
      width={620}
      title={
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xl text-gold">{order.id}</span>
          <StatusBadge status={order.status} />
          <PayBadge status={order.payment} />
        </div>
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Btn size="sm" variant="subtle" onClick={() => window.print()}><Printer className="h-3.5 w-3.5" /> Invoice</Btn>
            <a href={order.region === "China" ? "#" : `https://wa.me/${order.phone.replace(/\D/g, "")}?text=${msg}`} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-2 rounded-xl px-3 text-xs text-bone/60 hover:bg-bone/5 hover:text-bone">
              <MessageCircle className="h-3.5 w-3.5" /> {order.region === "China" ? "WeChat update" : "WhatsApp update"}
            </a>
          </div>
          <div className="flex gap-2">
            {!["cancelled", "returned", "delivered"].includes(order.status) && (
              <Btn size="sm" variant="danger" onClick={() => { setOrderStatus(order.id, "cancelled", note || "Cancelled by admin"); toast(`${order.id} cancelled · refund initiated`); }}>Cancel</Btn>
            )}
            {order.status === "delivered" && (
              <Btn size="sm" variant="danger" onClick={() => { setOrderStatus(order.id, "returned", note || "Return received"); toast("Return logged · refund initiated"); }}>Log return</Btn>
            )}
            {next && (
              <Btn
                size="sm"
                variant="gold"
                disabled={order.payment !== "paid" || (next === "shipped" && !tracking)}
                onClick={() => {
                  if (next === "shipped") patchOrder(order.id, { carrier, tracking });
                  setOrderStatus(order.id, next, note || undefined);
                  toast(`${order.id} → ${next}`);
                }}
              >
                {order.status === "pending" ? <><Check className="h-3.5 w-3.5" /> Confirm order</> : `Mark ${next}`}
              </Btn>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-2xl border border-bone/[0.07] p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-bone/40">Customer</p>
            <p className="mt-2 text-bone/90">{order.customerName}</p>
            <p className="text-xs text-bone/50">{order.email}</p>
            <p className="text-xs text-bone/50">{order.phone}</p>
            <div className="mt-2"><RegionTag region={order.region} /></div>
          </div>
          <div className="rounded-2xl border border-bone/[0.07] p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-bone/40">Ship to</p>
            <p className="mt-2 text-bone/90">{order.address.name}</p>
            <p className="text-xs text-bone/50">{order.address.line1}</p>
            <p className="text-xs text-bone/50">{order.address.city}, {order.address.state} {order.address.postcode}</p>
            <p className="text-xs text-bone/50">{order.address.country}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-bone/[0.07]">
          {order.lines.map((l, i) => (
            <div key={i} className="flex items-center justify-between gap-4 border-b border-bone/[0.05] px-4 py-3 text-sm last:border-b-0">
              <div>
                <p className="text-bone/90">{l.name}</p>
                <p className="text-[11px] text-bone/40">{l.variant} · <span className="font-mono">{l.sku}</span></p>
              </div>
              <p className="tabular-nums text-bone/70">×{l.qty} · {money(l.price * l.qty, cur)}</p>
            </div>
          ))}
          <dl className="space-y-1 border-t border-bone/[0.07] px-4 py-3 text-xs text-bone/55">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(order.subtotal, cur)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>−{money(order.discount, cur)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping & wrap</dt><dd>{money(order.shipping, cur)}</dd></div>
            <div className="flex justify-between"><dt>Tax</dt><dd>{money(order.tax, cur)}</dd></div>
            <div className="flex justify-between pt-1 text-sm text-bone"><dt>Total ({order.method})</dt><dd>{money(order.total, cur)} {cur !== "INR" && <span className="text-bone/40">· {inr(order.total)}</span>}</dd></div>
          </dl>
        </div>

        {(order.giftWrap || order.giftMessage) && (
          <div className="flex gap-3 rounded-2xl border border-gold/20 bg-gold/[0.04] p-4 text-sm">
            <Gift className="h-4 w-4 shrink-0 text-gold" />
            <div>
              <p className="text-bone/85">Lacquer gift case{order.giftMessage ? " + handwritten card" : ""}</p>
              {order.giftMessage && <p className="mt-1 font-display text-lg italic text-bone/70">“{order.giftMessage}”</p>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field label="Carrier">
            <select className="admin-input" value={carrier} onChange={(e) => setCarrier(e.target.value)}>
              {["Blue Dart", "Delhivery", "DHL Express", "SF Express 顺丰", "FedEx"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Tracking number" hint={order.status === "packed" ? "Required to mark as shipped" : undefined}>
            <input className="admin-input font-mono" value={tracking} onChange={(e) => setTracking(e.target.value)} onBlur={() => order.tracking !== tracking && tracking && patchOrder(order.id, { carrier, tracking })} placeholder="e.g. BD1234567890" />
          </Field>
          <Field label="Payment status">
            <select className="admin-input" value={order.payment} onChange={(e) => { setPayment(order.id, e.target.value as PaymentStatus); toast("Payment status updated"); }}>
              {["paid", "pending", "failed", "refunded"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Internal note">
            <input className="admin-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Attached to next status change" />
          </Field>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-bone/40">Timeline</p>
          <ol className="relative mt-4 space-y-4 before:absolute before:bottom-1 before:left-[5px] before:top-1 before:w-px before:bg-bone/10">
            {[...order.timeline].reverse().map((t, i) => (
              <li key={i} className="relative flex gap-4 pl-6 text-sm">
                <span className={cn("absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-[#120b09]", i === 0 ? "bg-gold" : "bg-bone/25")} />
                <div>
                  <p className="capitalize text-bone/85">{t.status}</p>
                  <p className="text-[11px] text-bone/40">{fmtDateTime(t.at)}{t.note ? ` · ${t.note}` : ""}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Drawer>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersInner />
    </Suspense>
  );
}
