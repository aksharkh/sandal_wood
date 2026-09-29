import clsx, { type ClassValue } from "clsx";
import type { Currency, L, Locale, Product } from "./types";

export const cn = (...c: ClassValue[]) => clsx(c);

/** Deterministic PRNG (mulberry32) so seeded demo data is identical on server and client. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** INR is the ledger currency; display rates are indicative and editable in admin settings later. */
export const RATES: Record<Currency, number> = { INR: 1, CNY: 0.0853, USD: 0.01195 };

export function money(inr: number, currency: Currency = "INR", opts: { compact?: boolean } = {}) {
  const value = inr * RATES[currency];
  const locale = currency === "INR" ? "en-IN" : currency === "CNY" ? "zh-CN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" || opts.compact ? 0 : currency === "CNY" ? 0 : 2,
    notation: opts.compact ? "compact" : "standard",
  }).format(value);
}

export const tx = (l: L | undefined, locale: Locale) => (l ? (locale === "zh" && l.zh) || l.en : "");

export function priceOf(p: Product, variantId?: string) {
  const v = p.variants.find((x) => x.id === variantId) ?? p.variants[0];
  return p.price + (v?.priceDelta ?? 0);
}

export const stockOf = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0);

export function fmtDate(iso: string, locale: Locale = "en") {
  return new Date(iso).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export const uid = (prefix: string) => `${prefix}${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296).toString(36).toUpperCase()}`;
