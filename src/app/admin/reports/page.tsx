"use client";

import { useState } from "react";
import { ClipboardCopy, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { useMaison } from "@/lib/store";
import { Btn, PageHead, Panel, toast } from "@/components/admin/ui";
import { copyForSheets, customerRows, enquiryRows, exportCsv, exportXlsx, orderRows, productRows, type Row } from "@/lib/export";
import { cn, money } from "@/lib/utils";

type Key = "orders" | "lines" | "catalogue" | "customers" | "enquiries" | "summary";

export default function ReportsPage() {
  const orders = useMaison((s) => s.orders);
  const products = useMaison((s) => s.products);
  const customers = useMaison((s) => s.customers);
  const enquiries = useMaison((s) => s.enquiries);
  const [picked, setPicked] = useState<Key[]>(["orders", "lines", "catalogue", "customers", "summary"]);
  const [from, setFrom] = useState(() => new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [region, setRegion] = useState("all");

  const inRange = orders.filter((o) => o.createdAt.slice(0, 10) >= from && o.createdAt.slice(0, 10) <= to && (region === "all" || o.region === region));

  const datasets: Record<Key, { label: string; desc: string; rows: () => Row[] }> = {
    orders: { label: "Orders", desc: "One row per order — customer, payment, status, tracking", rows: () => orderRows(inRange) },
    lines: {
      label: "Order lines (who bought what)",
      desc: "One row per item sold — for purchase tracking & reconciliation",
      rows: () =>
        inRange.flatMap((o) =>
          o.lines.map((l) => ({
            "Order ID": o.id,
            Date: o.createdAt.slice(0, 10),
            Customer: o.customerName,
            Email: o.email,
            Region: o.region,
            Product: l.name,
            Variant: l.variant,
            SKU: l.sku,
            Qty: l.qty,
            "Unit price (INR)": l.price,
            "Line total (INR)": l.price * l.qty,
            Status: o.status,
            Payment: o.payment,
          })),
        ),
    },
    catalogue: { label: "Catalogue & inventory", desc: "Every variant with price, stock, batch", rows: () => productRows(products) },
    customers: { label: "Customers", desc: "Contact, tier, orders and lifetime value", rows: () => customerRows(customers, orders) },
    enquiries: { label: "Enquiries", desc: "Private, gifting and corporate pipeline", rows: () => enquiryRows(enquiries) },
    summary: {
      label: "Summary by month",
      desc: "Revenue, orders and AOV by month and region",
      rows: () => {
        const map = new Map<string, { orders: number; rev: number; IN: number; CN: number; INT: number }>();
        inRange
          .filter((o) => o.payment === "paid")
          .forEach((o) => {
            const k = o.createdAt.slice(0, 7);
            const m = map.get(k) ?? { orders: 0, rev: 0, IN: 0, CN: 0, INT: 0 };
            m.orders++;
            m.rev += o.total;
            if (o.region === "India") m.IN += o.total;
            else if (o.region === "China") m.CN += o.total;
            else m.INT += o.total;
            map.set(k, m);
          });
        return [...map.entries()]
          .sort()
          .map(([k, m]) => ({
            Month: k,
            Orders: m.orders,
            "Revenue (INR)": m.rev,
            "AOV (INR)": Math.round(m.rev / m.orders),
            "India (INR)": m.IN,
            "China (INR)": m.CN,
            "International (INR)": m.INT,
          }));
      },
    },
  };

  const run = async (kind: "xlsx" | "csv" | "sheets") => {
    if (!picked.length) return;
    if (kind === "xlsx") {
      await exportXlsx(Object.fromEntries(picked.map((k) => [datasets[k].label.split(" (")[0], datasets[k].rows()])), "santalum-report");
      toast(`Workbook with ${picked.length} sheets downloaded`);
    } else if (kind === "csv") {
      picked.forEach((k) => exportCsv(datasets[k].rows(), `santalum-${k}`));
      toast(`${picked.length} CSV file${picked.length > 1 ? "s" : ""} downloaded`);
    } else {
      await copyForSheets(datasets[picked[0]].rows());
      toast(`${datasets[picked[0]].label} copied — paste into Google Sheets`);
    }
  };

  const revenue = inRange.filter((o) => o.payment === "paid").reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <PageHead title="Reports & export" sub="Build a workbook for accounts, logistics or the founders — Excel, CSV or Google Sheets" />
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel title="1 · Choose data">
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(datasets) as Key[]).map((k) => {
              const on = picked.includes(k);
              return (
                <button
                  key={k}
                  onClick={() => setPicked(on ? picked.filter((x) => x !== k) : [...picked, k])}
                  className={cn("border p-4 text-left transition-colors", on ? "border-clay/50 bg-clay/[0.05]" : "border-line hover:border-line")}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink">{datasets[k].label}</span>
                    <span className={cn("grid h-5 w-5 place-items-center rounded-md border text-[12px]", on ? "border-clay bg-clay text-page" : "border-line")}>
                      {on ? "✓" : ""}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{datasets[k].desc}</p>
                  <p className="mt-2 font-mono text-[12px] text-muted">{datasets[k].rows().length} rows</p>
                </button>
              );
            })}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="text-xs text-graphite">
              From
              <input type="date" className="admin-input mt-1.5" value={from} onChange={(e) => setFrom(e.target.value)} />
            </label>
            <label className="text-xs text-graphite">
              To
              <input type="date" className="admin-input mt-1.5" value={to} onChange={(e) => setTo(e.target.value)} />
            </label>
            <label className="text-xs text-graphite">
              Region
              <select className="admin-input mt-1.5" value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="all">All</option>
                <option>India</option>
                <option>China</option>
                <option>International</option>
              </select>
            </label>
          </div>
          <p className="mt-4 text-xs text-muted">
            Date and region filters apply to orders, order lines and the monthly summary. {inRange.length} orders · {money(revenue)} paid revenue in range.
          </p>
        </Panel>
        <div className="space-y-4">
          <Panel title="2 · Export">
            <div className="space-y-2">
              <Btn variant="solid" className="w-full justify-start" disabled={!picked.length} onClick={() => run("xlsx")}>
                <FileSpreadsheet className="h-4 w-4" /> Excel workbook — one sheet each
              </Btn>
              <Btn className="w-full justify-start" disabled={!picked.length} onClick={() => run("csv")}>
                <FileText className="h-4 w-4" /> CSV files
              </Btn>
              <Btn className="w-full justify-start" disabled={!picked.length} onClick={() => run("sheets")}>
                <ClipboardCopy className="h-4 w-4" /> Copy first dataset for Google Sheets
              </Btn>
            </div>
          </Panel>
          <Panel title="Google Sheets">
            <ol className="space-y-2 text-xs leading-relaxed text-graphite">
              <li>
                <span className="text-ink">Quick:</span> “Copy for Google Sheets”, open a sheet, paste — columns land in place.
              </li>
              <li>
                <span className="text-ink">Full workbook:</span> Drive → New → File upload → the .xlsx, then “Open with Google Sheets”.
              </li>
              <li>
                <span className="text-ink">Live sync</span> (auto-updating sheet) is available once the backend is chosen, via the Sheets API.
              </li>
            </ol>
            <a href="https://sheets.new" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-clay hover:underline">
              <Sheet className="h-3.5 w-3.5" /> Open a new Google Sheet
            </a>
          </Panel>
        </div>
      </div>
    </div>
  );
}
