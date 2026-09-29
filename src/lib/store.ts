"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useCallback, useMemo } from "react";
import type {
  Address,
  CartLine,
  Currency,
  Customer,
  Enquiry,
  L,
  Locale,
  Order,
  OrderStatus,
  PaymentStatus,
  Placement,
  Product,
  Recommendation,
  Review,
} from "./types";
import { SEED_PRODUCTS } from "./data/products";
import { SEED_CUSTOMERS, SEED_ENQUIRIES, SEED_ORDERS, SEED_RECOMMENDATIONS } from "./data/ops";
import { translate, type DictKey } from "./i18n";
import { money, tx } from "./utils";

/* ─────────────────────────── Customer-side store ─────────────────────────── */

type ShopState = {
  locale: Locale;
  currency: Currency;
  cart: CartLine[];
  wishlist: string[];
  myOrders: string[];
  account: { name: string; email: string; phone: string } | null;
  addresses: Address[];
  bagOpen: boolean;
  searchOpen: boolean;
  setLocale: (l: Locale) => void;
  setCurrency: (c: Currency) => void;
  addToCart: (productId: string, variantId: string, qty?: number) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  removeLine: (productId: string, variantId: string) => void;
  toggleGift: (productId: string, variantId: string) => void;
  clearCart: () => void;
  toggleWish: (productId: string) => void;
  setBagOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  signIn: (a: { name: string; email: string; phone: string }) => void;
  signOut: () => void;
  saveAddress: (a: Address) => void;
  rememberOrder: (id: string) => void;
};

const same = (l: CartLine, p: string, v: string) => l.productId === p && l.variantId === v;

export const useShop = create<ShopState>()(
  persist(
    (set) => ({
      locale: "en",
      currency: "INR",
      cart: [],
      wishlist: [],
      myOrders: [],
      account: null,
      addresses: [],
      bagOpen: false,
      searchOpen: false,
      setLocale: (locale) => set({ locale }),
      setCurrency: (currency) => set({ currency }),
      addToCart: (productId, variantId, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((l) => same(l, productId, variantId));
          return {
            cart: existing
              ? s.cart.map((l) => (same(l, productId, variantId) ? { ...l, qty: Math.min(10, l.qty + qty) } : l))
              : [...s.cart, { productId, variantId, qty }],
          };
        }),
      setQty: (productId, variantId, qty) =>
        set((s) => ({
          cart: s.cart.map((l) => (same(l, productId, variantId) ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l)),
        })),
      removeLine: (productId, variantId) => set((s) => ({ cart: s.cart.filter((l) => !same(l, productId, variantId)) })),
      toggleGift: (productId, variantId) =>
        set((s) => ({ cart: s.cart.map((l) => (same(l, productId, variantId) ? { ...l, giftWrap: !l.giftWrap } : l)) })),
      clearCart: () => set({ cart: [] }),
      toggleWish: (id) =>
        set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] })),
      setBagOpen: (bagOpen) => set({ bagOpen }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      signIn: (account) => set({ account }),
      signOut: () => set({ account: null }),
      saveAddress: (a) => set((s) => ({ addresses: [a, ...s.addresses.filter((x) => x.line1 !== a.line1)].slice(0, 4) })),
      rememberOrder: (id) => set((s) => ({ myOrders: [id, ...s.myOrders] })),
    }),
    {
      name: "sm-shop",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      // UI overlays are session-only; everything else persists.
      partialize: (s) => Object.fromEntries(Object.entries(s).filter(([k]) => k !== "bagOpen" && k !== "searchOpen")) as Partial<ShopState>,
    },
  ),
);

/* ─────────────────────── Catalogue + operations store ───────────────────────
   Stands in for the backend until one is chosen: the storefront reads products
   from here, and orders placed at checkout land in the admin tracker. */

export type SiteContent = {
  announcement: L;
  heroTitle: L;
  heroSub: L;
  whatsapp: string;
  wechat: string;
  email: string;
};

const SEED_CONTENT: SiteContent = {
  announcement: {
    en: "Complimentary insured shipping across India · Now delivering to mainland China in 7–10 days",
    zh: "印度境内免费保价配送 · 现已直邮中国大陆，7–10 天送达",
  },
  heroTitle: { en: "The red heart of India", zh: "印度的赤色之心" },
  heroSub: {
    en: "Objects in red sandalwood — Pterocarpus santalinus — selected, shaped and documented by hand in South India.",
    zh: "小叶紫檀器物——在南印度，经手工选料、成形并逐一建档。",
  },
  whatsapp: "+91 98450 00000",
  wechat: "SantalumMaison",
  email: "atelier@santalummaison.com",
};

type MaisonState = {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  enquiries: Enquiry[];
  recommendations: Recommendation[];
  userReviews: Review[];
  content: SiteContent;
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  patchProduct: (id: string, patch: Partial<Product>) => void;
  setVariantStock: (productId: string, variantId: string, stock: number) => void;
  placeOrder: (o: Order) => void;
  setOrderStatus: (id: string, status: OrderStatus, note?: string) => void;
  patchOrder: (id: string, patch: Partial<Order>) => void;
  setPayment: (id: string, payment: PaymentStatus) => void;
  addEnquiry: (e: Enquiry) => void;
  patchEnquiry: (id: string, patch: Partial<Enquiry>) => void;
  upsertRecommendation: (r: Recommendation) => void;
  deleteRecommendation: (id: string) => void;
  addReview: (r: Review) => void;
  setContent: (c: Partial<SiteContent>) => void;
  resetDemo: () => void;
};

const seed = () => ({
  products: SEED_PRODUCTS,
  orders: SEED_ORDERS,
  customers: SEED_CUSTOMERS,
  enquiries: SEED_ENQUIRIES,
  recommendations: SEED_RECOMMENDATIONS,
  userReviews: [] as Review[],
  content: SEED_CONTENT,
});

export const useMaison = create<MaisonState>()(
  persist(
    (set) => ({
      ...seed(),
      upsertProduct: (p) =>
        set((s) => ({
          products: s.products.some((x) => x.id === p.id) ? s.products.map((x) => (x.id === p.id ? p : x)) : [p, ...s.products],
        })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      patchProduct: (id, patch) => set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      setVariantStock: (productId, variantId, stock) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === productId
              ? { ...p, variants: p.variants.map((v) => (v.id === variantId ? { ...v, stock: Math.max(0, stock) } : v)) }
              : p,
          ),
        })),
      placeOrder: (o) =>
        set((s) => {
          const products = s.products.map((p) => {
            const lines = o.lines.filter((l) => l.productId === p.id);
            if (!lines.length) return p;
            return {
              ...p,
              variants: p.variants.map((v) => {
                const l = lines.find((x) => x.variantId === v.id);
                return l ? { ...v, stock: Math.max(0, v.stock - l.qty) } : v;
              }),
            };
          });
          const known = s.customers.find((c) => c.email === o.email);
          const customers = known
            ? s.customers
            : [
                {
                  id: o.customerId,
                  name: o.customerName,
                  email: o.email,
                  phone: o.phone,
                  city: o.address.city,
                  country: o.address.country,
                  region: o.region,
                  joined: o.createdAt.slice(0, 10),
                  tier: "Guest" as const,
                  tags: ["Web"],
                },
                ...s.customers,
              ];
          return { orders: [{ ...o, customerId: known?.id ?? o.customerId }, ...s.orders], products, customers };
        }),
      setOrderStatus: (id, status, note) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  payment: status === "cancelled" || status === "returned" ? (o.payment === "paid" ? "refunded" : o.payment) : o.payment,
                  timeline: [...o.timeline, { at: new Date().toISOString(), status, note }],
                }
              : o,
          ),
        })),
      patchOrder: (id, patch) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) })),
      setPayment: (id, payment) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, payment } : o)) })),
      addEnquiry: (e) => set((s) => ({ enquiries: [e, ...s.enquiries] })),
      patchEnquiry: (id, patch) => set((s) => ({ enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
      upsertRecommendation: (r) =>
        set((s) => ({
          recommendations: s.recommendations.some((x) => x.id === r.id)
            ? s.recommendations.map((x) => (x.id === r.id ? r : x))
            : [r, ...s.recommendations],
        })),
      deleteRecommendation: (id) => set((s) => ({ recommendations: s.recommendations.filter((r) => r.id !== id) })),
      addReview: (r) => set((s) => ({ userReviews: [r, ...s.userReviews] })),
      setContent: (c) => set((s) => ({ content: { ...s.content, ...c } })),
      resetDemo: () => set(seed()),
    }),
    { name: "sm-maison-v3", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);

/* ─────────────────────────────── Helpers ─────────────────────────────── */

export function useT() {
  const locale = useShop((s) => s.locale);
  const currency = useShop((s) => s.currency);
  const t = useCallback((k: DictKey) => translate(k, locale), [locale]);
  const l = useCallback((x: L | undefined) => tx(x, locale), [locale]);
  const m = useCallback((inr: number) => money(inr, currency), [currency]);
  return { t, l, m, locale, currency, zh: locale === "zh" };
}

export const useProduct = (idOrSlug: string) =>
  useMaison((s) => s.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug));

export const useLiveProducts = () => useMaison((s) => s.products);

/** Active products pushed to a storefront placement from the admin Recommendations screen. */
export function usePlacement(placement: Placement, audience?: Recommendation["audience"]) {
  const recs = useMaison((s) => s.recommendations);
  const products = useMaison((s) => s.products);
  return useMemo(() => {
    const rec =
      recs.find((r) => r.placement === placement && r.active && audience && r.audience === audience) ??
      recs.find((r) => r.placement === placement && r.active);
    return (rec?.productIds ?? [])
      .map((id) => products.find((p) => p.id === id && p.status === "active"))
      .filter((p): p is Product => !!p);
  }, [recs, products, placement, audience]);
}

export const useActiveProducts = () => {
  const products = useMaison((s) => s.products);
  return useMemo(() => products.filter((p) => p.status === "active"), [products]);
};
