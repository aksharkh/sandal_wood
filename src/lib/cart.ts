"use client";

import { useMemo } from "react";
import { useMaison, useShop } from "./store";
import type { CartLine, Currency, Product, Variant } from "./types";

export type Region = "India" | "China" | "International";
export const GIFT_WRAP_PRICE = 450;
export const FREE_SHIP_INDIA = 5000;

export type ResolvedLine = CartLine & { product: Product; variant: Variant; unit: number; line: number };

export const regionFromCurrency = (c: Currency): Region => (c === "INR" ? "India" : c === "CNY" ? "China" : "International");

export const regionFromCountry = (country: string): Region =>
  country === "India" ? "India" : ["China", "Hong Kong", "Macau"].includes(country) ? "China" : "International";

/** Shipping, duties and taxes are indicative placeholders until a logistics provider is selected. */
export function quote(lines: ResolvedLine[], region: Region, promo?: string) {
  const subtotal = lines.reduce((s, l) => s + l.line, 0);
  const wrap = lines.filter((l) => l.giftWrap).length * GIFT_WRAP_PRICE;
  const shipping =
    subtotal === 0 ? 0 : region === "India" ? (subtotal >= FREE_SHIP_INDIA ? 0 : 250) : region === "China" ? (subtotal >= 30000 ? 0 : 1800) : 2600;
  const discount = promo?.toUpperCase() === "CIRCLE10" ? Math.round(subtotal * 0.1) : 0;
  // Indian prices are GST-inclusive (MRP convention); China's cross-border tax is added and prepaid (DDP).
  const taxIncluded = region === "India";
  const taxRate = region === "India" ? 0.03 : region === "China" ? 0.091 : 0;
  const base = subtotal - discount + wrap;
  const tax = Math.round(taxIncluded ? base - base / (1 + taxRate) : base * taxRate);
  return { subtotal, wrap, shipping, discount, tax, taxRate, taxIncluded, total: base + shipping + (taxIncluded ? 0 : tax) };
}

export function useCart() {
  const cart = useShop((s) => s.cart);
  const products = useMaison((s) => s.products);
  return useMemo(() => {
    const lines: ResolvedLine[] = [];
    for (const c of cart) {
      const product = products.find((p) => p.id === c.productId);
      const variant = product?.variants.find((v) => v.id === c.variantId);
      if (!product || !variant) continue;
      const unit = product.price + variant.priceDelta;
      lines.push({ ...c, product, variant, unit, line: unit * c.qty });
    }
    return lines;
  }, [cart, products]);
}
