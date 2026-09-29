"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, CircleDashed, Clock, PackageCheck, RotateCcw, Truck, X, XCircle } from "lucide-react";
import { EASE } from "../motion/primitives";
import { cn } from "@/lib/utils";
import type { EnquiryStatus, OrderStatus, PaymentStatus } from "@/lib/types";

/** Validated categorical order (light surface): India, China, International. */
export const REGION_COLORS = { India: "#9e3a26", China: "#1f72a8", International: "#b8860b" } as const;

export function Panel({
  title,
  action,
  children,
  className,
  pad = true,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <section className={cn("border border-line bg-white", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 px-6 pt-5">
          <h3 className="text-[12px] font-medium text-graphite">{title}</h3>
          {action}
        </header>
      )}
      <div className={cn(pad && "p-6")}>{children}</div>
    </section>
  );
}

export function Btn({
  children,
  onClick,
  variant = "ghost",
  className,
  type = "button",
  disabled,
  size = "md",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "solid" | "ghost" | "gold" | "danger" | "subtle";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const v = {
    primary: "bg-ink text-page hover:bg-graphite",
    solid: "bg-ink text-page hover:bg-graphite",
    gold: "bg-ink text-page hover:bg-graphite",
    ghost: "border border-line bg-white text-ink hover:border-ink",
    danger: "border border-danger/40 text-danger hover:bg-danger/10",
    subtle: "text-graphite hover:bg-stone hover:text-ink",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-[13px]",
        v,
        className,
      )}
    >
      {children}
    </button>
  );
}

const ORDER_STATUS: Record<OrderStatus, { label: string; cls: string; icon: typeof Clock }> = {
  pending: { label: "Pending", cls: "bg-[#e2b340]/12 text-[#7d5a0e]", icon: Clock },
  confirmed: { label: "Confirmed", cls: "bg-[#6aa5ff]/12 text-[#2f5fae]", icon: CheckCircle2 },
  packed: { label: "Packed", cls: "bg-[#a78bfa]/12 text-[#5b3fa0]", icon: PackageCheck },
  shipped: { label: "Shipped", cls: "bg-[#38bdf8]/12 text-[#1f6a8e]", icon: Truck },
  delivered: { label: "Delivered", cls: "bg-[#4ade80]/12 text-[#2f6b45]", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", cls: "bg-stone text-graphite", icon: XCircle },
  returned: { label: "Returned", cls: "bg-[#f87171]/12 text-[#a3362a]", icon: RotateCcw },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = ORDER_STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium", s.cls)}>
      <s.icon className="h-3 w-3" /> {s.label}
    </span>
  );
}

const PAY: Record<PaymentStatus, { cls: string; icon: typeof Clock }> = {
  paid: { cls: "text-[#2f6b45]", icon: CheckCircle2 },
  pending: { cls: "text-[#7d5a0e]", icon: CircleDashed },
  failed: { cls: "text-[#a3362a]", icon: AlertTriangle },
  refunded: { cls: "text-graphite", icon: RotateCcw },
};

export function PayBadge({ status }: { status: PaymentStatus }) {
  const s = PAY[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs capitalize", s.cls)}>
      <s.icon className="h-3.5 w-3.5" /> {status}
    </span>
  );
}

const ENQ: Record<EnquiryStatus, string> = {
  new: "bg-clay/15 text-clay",
  "in-progress": "bg-[#6aa5ff]/12 text-[#2f5fae]",
  quoted: "bg-[#a78bfa]/12 text-[#5b3fa0]",
  won: "bg-[#4ade80]/12 text-[#2f6b45]",
  closed: "bg-stone text-graphite",
};
export function EnquiryBadge({ status }: { status: EnquiryStatus }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium capitalize", ENQ[status])}>{status.replace("-", " ")}</span>;
}

export function RegionTag({ region }: { region: keyof typeof REGION_COLORS }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink">
      <span className="h-2 w-2 rounded-full" style={{ background: REGION_COLORS[region] }} />
      {region}
    </span>
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  width = 560,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  width?: number;
  footer?: ReactNode;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[80] bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{ maxWidth: width }}
            className="fixed right-0 top-0 z-[81] flex h-dvh w-full flex-col border-l border-line bg-paper"
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <div className="min-w-0 flex-1">{title}</div>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center text-graphite hover:bg-stone hover:text-ink" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="thin-scroll flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer && <footer className="border-t border-line px-6 py-4">{footer}</footer>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function Field({ label, children, hint, className }: { label: string; children: ReactNode; hint?: string; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.14em] text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="inline-flex items-center gap-2" role="switch" aria-checked={on}>
      <span className={cn("relative h-5 w-9 rounded-full transition-colors", on ? "bg-clay" : "bg-ink/15")}>
        <motion.span layout transition={{ duration: 0.25 }} className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-page", on ? "right-0.5" : "left-0.5")} />
      </span>
      {label && <span className="text-sm text-ink">{label}</span>}
    </button>
  );
}

/* Tiny toast bus */
type ToastMsg = { id: number; text: string };
let push: (t: string) => void = () => {};
export const toast = (t: string) => push(t);
export function Toaster() {
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    push = (text) => {
      const id = Date.now() + Math.random();
      setItems((x) => [...x, { id, text }]);
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 2800);
    };
  }, []);
  return (
    <div className="fixed bottom-6 left-1/2 z-[120] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-2 border border-line bg-paper px-4 py-3 text-sm"
          >
            <CheckCircle2 className="h-4 w-4 text-[#2f6b45]" /> {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-4xl tracking-tight md:text-5xl">{title}</h1>
        {sub && <p className="mt-1.5 text-sm text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Th({ children, className, onClick, active }: { children?: ReactNode; className?: string; onClick?: () => void; active?: boolean }) {
  return (
    <th
      onClick={onClick}
      className={cn(
        "whitespace-nowrap px-4 py-3 text-left text-[12px] font-medium uppercase tracking-[0.16em] text-muted",
        onClick && "cursor-pointer select-none hover:text-ink",
        active && "text-clay",
        className,
      )}
    >
      {children}
    </th>
  );
}
