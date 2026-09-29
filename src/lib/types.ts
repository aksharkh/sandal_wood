export type Locale = "en" | "zh";
export type Currency = "INR" | "CNY" | "USD";

/** Bilingual string. `zh` falls back to `en` when missing. */
export type L = { en: string; zh?: string };

export type CollectionSlug = "jewellery" | "beads-malas" | "everyday-objects" | "powder-material" | "gifting";

export type VisualKind =
  | "mala"
  | "bracelet"
  | "bangle"
  | "pendant"
  | "earrings"
  | "ring"
  | "cufflinks"
  | "comb"
  | "box"
  | "powder"
  | "incense"
  | "brooch";

export type ProductStatus = "active" | "draft" | "archived";

export type Variant = {
  id: string;
  label: L; // e.g. "8 mm bead"
  priceDelta: number; // INR, added to base price
  stock: number;
  sku: string;
};

export type Provenance = {
  batch: string;
  source: L;
  processing: L;
  certification: L;
  density: string; // g/cm³
  harvested: string;
};

export type Product = {
  id: string;
  slug: string;
  name: L;
  subtitle: L;
  description: L;
  collection: CollectionSlug;
  price: number; // INR
  compareAt?: number;
  status: ProductStatus;
  visual: VisualKind;
  tone: number; // 0..1 — shifts the rendered wood tone lighter/darker
  images?: string[]; // uploaded images (data URLs) override the generated visual
  variants: Variant[];
  tags: string[];
  badges?: L[];
  details: { label: L; value: L }[];
  provenance: Provenance;
  rating: number;
  reviewCount: number;
  createdAt: string;
  featured?: boolean;
  occasion?: string[];
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  city: string;
  country: "IN" | "CN" | "SG" | "AE" | "GB" | "US";
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
  variant?: string;
};

export type CartLine = {
  productId: string;
  variantId: string;
  qty: number;
  giftWrap?: boolean;
};

export type OrderStatus = "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled" | "returned";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";
export type PaymentMethod = "UPI" | "Card" | "NetBanking" | "Alipay" | "WeChat Pay" | "UnionPay" | "PayPal";

export type Address = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

export type OrderLine = {
  productId: string;
  variantId: string;
  name: string;
  variant: string;
  sku: string;
  qty: number;
  price: number; // INR unit price
};

export type OrderEvent = { at: string; status: OrderStatus | "note"; note?: string };

export type Order = {
  id: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  region: "India" | "China" | "International";
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number; // INR
  currency: Currency; // what the customer paid in
  status: OrderStatus;
  payment: PaymentStatus;
  method: PaymentMethod;
  address: Address;
  giftMessage?: string;
  giftWrap?: boolean;
  carrier?: string;
  tracking?: string;
  timeline: OrderEvent[];
  channel: "Web" | "WhatsApp" | "WeChat" | "Boutique";
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  region: "India" | "China" | "International";
  joined: string;
  tier: "Circle" | "Circle Gold" | "Guest";
  tags: string[];
  notes?: string;
};

export type EnquiryType = "Private" | "Gifting" | "Corporate" | "Designer" | "Hospitality" | "Other";
export type EnquiryStatus = "new" | "in-progress" | "quoted" | "won" | "closed";

export type Enquiry = {
  id: string;
  type: EnquiryType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country: string;
  budget?: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  assignee?: string;
  preferredChannel?: "Email" | "WhatsApp" | "WeChat" | "Phone";
};

export type Placement = "home-curated" | "pdp-pairs" | "bag-upsell" | "gifting-edit" | "china-edit";

export type Recommendation = {
  id: string;
  title: string;
  placement: Placement;
  productIds: string[];
  audience: "All" | "India" | "China" | "Circle members";
  active: boolean;
  startsAt: string;
  endsAt?: string;
  impressions: number;
  clicks: number;
  conversions: number;
};

export type JournalPost = {
  slug: string;
  title: L;
  excerpt: L;
  category: "Material" | "Making" | "People" | "Object" | "Indian Context";
  readMins: number;
  date: string;
  body: L[];
  visual: VisualKind;
  image: string;
};
