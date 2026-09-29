"use client";

import type { Customer, Enquiry, Order, Product } from "./types";
import { stockOf } from "./utils";

export type Row = Record<string, string | number | boolean | undefined>;

export const orderRows = (orders: Order[]): Row[] =>
  orders.map((o) => ({
    "Order ID": o.id,
    Date: o.createdAt.slice(0, 10),
    Time: o.createdAt.slice(11, 16),
    Customer: o.customerName,
    Email: o.email,
    Phone: o.phone,
    Region: o.region,
    Country: o.address.country,
    City: o.address.city,
    Items: o.lines.map((l) => `${l.name} (${l.variant}) ×${l.qty}`).join("; "),
    SKUs: o.lines.map((l) => l.sku).join("; "),
    Units: o.lines.reduce((s, l) => s + l.qty, 0),
    "Subtotal (INR)": o.subtotal,
    "Shipping (INR)": o.shipping,
    "Tax (INR)": o.tax,
    "Discount (INR)": o.discount,
    "Total (INR)": o.total,
    "Paid in": o.currency,
    "Payment method": o.method,
    "Payment status": o.payment,
    Status: o.status,
    Channel: o.channel,
    Carrier: o.carrier ?? "",
    Tracking: o.tracking ?? "",
    "Gift message": o.giftMessage ?? "",
  }));

export const productRows = (products: Product[]): Row[] =>
  products.flatMap((p) =>
    p.variants.map((v) => ({
      "Product ID": p.id,
      Product: p.name.en,
      "Product (中文)": p.name.zh ?? "",
      Collection: p.collection,
      Variant: v.label.en,
      SKU: v.sku,
      "Price (INR)": p.price + v.priceDelta,
      "Compare at (INR)": p.compareAt ?? "",
      Stock: v.stock,
      "Product stock": stockOf(p),
      Status: p.status,
      Batch: p.provenance.batch,
      Density: p.provenance.density,
      Rating: p.rating,
      Reviews: p.reviewCount,
    })),
  );

export const customerRows = (customers: Customer[], orders: Order[]): Row[] =>
  customers.map((c) => {
    const mine = orders.filter((o) => o.customerId === c.id || o.email === c.email);
    const paid = mine.filter((o) => o.payment === "paid");
    return {
      "Customer ID": c.id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      City: c.city,
      Country: c.country,
      Region: c.region,
      Tier: c.tier,
      Joined: c.joined,
      Orders: mine.length,
      "Lifetime value (INR)": paid.reduce((s, o) => s + o.total, 0),
      "Last order": mine[0]?.createdAt.slice(0, 10) ?? "",
      Tags: c.tags.join(", "),
    };
  });

export const enquiryRows = (enquiries: Enquiry[]): Row[] =>
  enquiries.map((e) => ({
    ID: e.id,
    Date: e.createdAt,
    Type: e.type,
    Name: e.name,
    Company: e.company ?? "",
    Email: e.email,
    Phone: e.phone ?? "",
    Country: e.country,
    Budget: e.budget ?? "",
    Channel: e.preferredChannel ?? "",
    Status: e.status,
    Assignee: e.assignee ?? "",
    Message: e.message,
  }));

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const stamp = () => new Date().toISOString().slice(0, 10);

/** Multi-sheet Excel workbook. SheetJS is loaded only when an export is requested. */
export async function exportXlsx(sheets: Record<string, Row[]>, name = "santalum-export") {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  for (const [sheet, rows] of Object.entries(sheets)) {
    const ws = XLSX.utils.json_to_sheet(rows);
    const keys = Object.keys(rows[0] ?? {});
    ws["!cols"] = keys.map((k) => ({ wch: Math.min(48, Math.max(k.length, ...rows.slice(0, 200).map((r) => String(r[k] ?? "").length)) + 2) }));
    XLSX.utils.book_append_sheet(wb, ws, sheet.slice(0, 31));
  }
  XLSX.writeFile(wb, `${name}-${stamp()}.xlsx`);
}

const esc = (v: unknown, sep: string) => {
  const s = String(v ?? "");
  return s.includes(sep) || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
};

function toDelimited(rows: Row[], sep: string) {
  const keys = Object.keys(rows[0] ?? {});
  return [keys.map((k) => esc(k, sep)).join(sep), ...rows.map((r) => keys.map((k) => esc(r[k], sep)).join(sep))].join("\n");
}

/** CSV with a BOM so Excel opens 中文 correctly; imports cleanly into Google Sheets. */
export function exportCsv(rows: Row[], name = "santalum-export") {
  download(new Blob(["﻿" + toDelimited(rows, ",")], { type: "text/csv;charset=utf-8" }), `${name}-${stamp()}.csv`);
}

/** Tab-separated text on the clipboard pastes straight into Google Sheets as cells. */
export async function copyForSheets(rows: Row[]) {
  await navigator.clipboard.writeText(toDelimited(rows, "\t"));
}
