# Santalum Maison — web front-end

Premium red-sandalwood storefront + atelier admin console. Design direction: "Gallery light" (ivory/stone surfaces, near-black type, one sandalwood-red accent; Instrument Serif + Inter Tight). Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Motion, Zustand.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (64 routes, statically prerendered)
```

## What's here

| Area | Routes |
| --- | --- |
| Brand & content | `/` (17 homepage sections from the brief), `/maison`, `/founder`, `/material`, `/craft`, `/provenance` (batch lookup), `/science`, `/sourcing`, `/gifting`, `/journal`, `/journal/[slug]`, `/enquiries`, `/contact`, `/legal/[slug]` |
| Commerce | `/collections`, `/collections/[slug]`, `/product/[slug]` (variants, reviews, delivery check, offers), `/search`, `/bag`, `/checkout`, `/order/[id]` (tracking), `/account` |
| Admin | `/admin` (dashboard), `/admin/orders`, `/admin/products`, `/admin/inventory`, `/admin/customers`, `/admin/recommendations`, `/admin/enquiries`, `/admin/content`, `/admin/reports`, `/admin/settings` |

**India + China:** EN / 中文 toggle, ₹ / ¥ / $ display, UPI / cards / net-banking for India and Alipay / WeChat Pay / UnionPay for China, WhatsApp + WeChat contact, China duties-prepaid shipping. Fonts are self-hosted at build time via `next/font`, and no Google/third-party CDNs are called at runtime, so pages load behind the Great Firewall.

## Where the data lives (until a backend is chosen)

`src/lib/store.ts` holds two Zustand stores persisted to `localStorage`:

- `useShop`: cart, wishlist, locale, currency, account (customer side)
- `useMaison`: products, orders, customers, enquiries, recommendations, site content (the "backend")

The storefront reads products from `useMaison`, and checkout writes orders into it. Admin edits to price, stock, status and recommendations show up on the storefront straight away. To add a real backend, replace these store actions with API calls. The types in `src/lib/types.ts` are the contract.

Seed data: `src/lib/data/*`. Admin → Settings → *Reset demo data* restores it.

## Placeholders to replace

- **Photography:** 35 interim photos in `public/images/` from Unsplash (free commercial use under the Unsplash licence, no attribution required). They are stand-ins, not the client's products. Replace them with the client's shoot, either by swapping the files (same names) or per product in Admin → Catalogue → Media. Images are served from our own domain, so they load in mainland China.
- **Provenance records, legal copy, founder portrait, contact numbers, WeChat QR:** sample content, to be supplied by the client.
- **Payments, shipping and OTP sign-in:** the UI is complete but simulated. Wire them in during the integrations phase.
- **Tax rates** (India GST 3% inclusive, China CBEC 9.1%): indicative only. Confirm with the client's CA.
