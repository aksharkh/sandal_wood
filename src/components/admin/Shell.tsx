"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Bell,
  Boxes,
  ChevronDown,
  ClipboardCopy,
  Command,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Inbox,
  LayoutDashboard,
  Megaphone,
  Menu,
  Package,
  PanelsTopLeft,
  Search,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { Monogram } from "../site/Logo";
import { EASE } from "../motion/primitives";
import { useMaison } from "@/lib/store";
import { copyForSheets, exportCsv, exportXlsx, type Row } from "@/lib/export";
import { Toaster, toast } from "./ui";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, badge: "pending" as const },
  { href: "/admin/products", label: "Catalogue", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes, badge: "low" as const },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/recommendations", label: "Recommendations", icon: Megaphone },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, badge: "enq" as const },
  { href: "/admin/content", label: "Content", icon: PanelsTopLeft },
  { href: "/admin/reports", label: "Reports & export", icon: FileSpreadsheet },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [palette, setPalette] = useState(false);
  const orders = useMaison((s) => s.orders);
  const products = useMaison((s) => s.products);
  const enquiries = useMaison((s) => s.enquiries);
  const counts = useMemo(
    () => ({
      pending: orders.filter((o) => o.status === "pending").length,
      low: products.reduce((n, p) => n + p.variants.filter((v) => v.stock <= 3).length, 0),
      enq: enquiries.filter((e) => e.status === "new").length,
    }),
    [orders, products, enquiries],
  );

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const nav = (
    <nav className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-3 px-5 py-6">
        <Monogram className="text-ink" />
        <span className="leading-none">
          <span className="block font-display text-lg tracking-[0.28em]">SANTALUM</span>
          <span className="mt-1 block text-[12px] uppercase tracking-[0.3em] text-muted">Atelier console</span>
        </span>
      </Link>
      <ul className="thin-scroll flex-1 space-y-0.5 overflow-y-auto px-3">
        {NAV.map((n) => {
          const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
          const count = n.badge ? counts[n.badge] : 0;
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                onClick={() => setMobile(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] transition-colors",
                  active ? "font-medium text-ink" : "text-graphite hover:text-ink",
                )}
              >
                {active && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-md bg-stone" transition={{ duration: 0.3, ease: EASE }} />}
                <n.icon className="relative h-4 w-4" strokeWidth={1.6} />
                <span className="relative flex-1">{n.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      "relative rounded-full px-1.5 py-0.5 text-[12px] tabular-nums",
                      n.badge === "low" ? "bg-[#e2b340]/15 text-[#7d5a0e]" : "bg-clay text-paper",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="m-3 border border-line bg-stone p-4">
        <p className="text-[12px] text-muted">Storefront</p>
        <Link href="/" target="_blank" className="mt-2 flex items-center justify-between text-sm text-ink hover:underline">
          santalummaison.com <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <p className="mt-3 flex items-center gap-2 text-[12px] text-[#2f6b45]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#4ade80]/60" />
            <span className="relative h-2 w-2 rounded-full bg-[#4ade80]" />
          </span>
          Live · IN & CN
        </p>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-page text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-paper lg:block">{nav}</aside>
      <AnimatePresence>
        {mobile && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobile(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease: EASE }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-paper lg:hidden"
            >
              {nav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="relative lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-page/80 px-4 md:px-8">
          <button className="lg:hidden" onClick={() => setMobile(true)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => setPalette(true)}
            className="flex h-10 max-w-md flex-1 items-center gap-3 border border-line bg-stone px-3 text-sm text-muted hover:border-line"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search orders, products, customers…</span>
            <kbd className="hidden items-center gap-1 rounded-md border border-line px-1.5 py-0.5 font-mono text-[12px] sm:flex">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/admin/orders?status=pending"
              className="relative grid h-10 w-10 place-items-center text-graphite hover:bg-stone hover:text-ink"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {counts.pending > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-clay" />}
            </Link>
            <div className="flex items-center gap-3 py-1 pl-1 pr-3 hover:bg-stone">
              <span className="grid h-8 w-8 place-items-center bg-paper font-display">M</span>
              <span className="hidden text-left text-xs leading-tight sm:block">
                Meera Iyer
                <span className="block text-muted">Owner</span>
              </span>
            </div>
          </div>
        </header>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="px-4 py-8 md:px-8 md:py-10"
        >
          {children}
        </motion.main>
      </div>
      <CommandPalette open={palette} onClose={() => setPalette(false)} />
      <Toaster />
    </div>
  );
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const orders = useMaison((s) => s.orders);
  const products = useMaison((s) => s.products);
  const customers = useMaison((s) => s.customers);
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setQ("");
  }
  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 50);
  }, [open]);
  const ql = q.toLowerCase();
  const results = q
    ? [
        ...orders
          .filter((o) => o.id.toLowerCase().includes(ql) || o.customerName.toLowerCase().includes(ql))
          .slice(0, 5)
          .map((o) => ({ k: o.id, label: `${o.id} · ${o.customerName}`, group: "Order", href: `/admin/orders?open=${o.id}` })),
        ...products
          .filter((p) => (p.name.en + (p.name.zh ?? "")).toLowerCase().includes(ql))
          .slice(0, 5)
          .map((p) => ({ k: p.id, label: p.name.en, group: "Product", href: `/admin/products?edit=${p.id}` })),
        ...customers
          .filter((c) => (c.name + c.email).toLowerCase().includes(ql))
          .slice(0, 5)
          .map((c) => ({ k: c.id, label: `${c.name} · ${c.email}`, group: "Customer", href: `/admin/customers?open=${c.id}` })),
      ]
    : NAV.map((n) => ({ k: n.href, label: n.label, group: "Go to", href: n.href }));
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="w-full max-w-xl overflow-hidden border border-line bg-paper"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 text-clay" />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results[0]) {
                    router.push(results[0].href);
                    onClose();
                  }
                  if (e.key === "Escape") onClose();
                }}
                className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted"
                placeholder="Type an order ID, product or customer…"
              />
              <button onClick={onClose} aria-label="Close">
                <X className="h-4 w-4 text-muted" />
              </button>
            </div>
            <ul className="thin-scroll max-h-[50vh] overflow-y-auto p-2">
              {results.map((r) => (
                <li key={r.group + r.k}>
                  <button
                    onClick={() => {
                      router.push(r.href);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-ink hover:bg-stone hover:text-ink"
                  >
                    {r.label}
                    <span className="text-[12px] uppercase tracking-[0.16em] text-muted">{r.group}</span>
                  </button>
                </li>
              ))}
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No matches</li>}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Export dropdown used across admin tables: Excel, CSV, or copy for Google Sheets. */
export function ExportMenu({ rows, name, sheet = "Data" }: { rows: () => Row[]; name: string; sheet?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 items-center gap-2 border border-ink/12 px-4 text-[13px] text-ink hover:border-line"
      >
        <Download className="h-4 w-4" /> Export <ChevronDown className="h-3.5 w-3.5 opacity-50" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute right-0 z-50 mt-2 w-64 overflow-hidden border border-line bg-paper p-1.5"
            >
              {[
                { icon: FileSpreadsheet, label: "Excel workbook (.xlsx)", run: () => exportXlsx({ [sheet]: rows() }, name) },
                { icon: FileText, label: "CSV (Excel / Numbers)", run: () => exportCsv(rows(), name) },
                {
                  icon: ClipboardCopy,
                  label: "Copy for Google Sheets",
                  run: async () => {
                    await copyForSheets(rows());
                    toast("Copied — paste into any Google Sheet (Ctrl/⌘ V)");
                  },
                },
              ].map((o) => (
                <button
                  key={o.label}
                  onClick={async () => {
                    setOpen(false);
                    await o.run();
                    if (!o.label.startsWith("Copy")) toast(`${rows().length} rows exported`);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-ink hover:bg-stone hover:text-ink"
                >
                  <o.icon className="h-4 w-4 text-clay" /> {o.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
