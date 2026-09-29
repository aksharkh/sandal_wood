import type { Metadata } from "next";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { SEED_PRODUCTS } from "@/lib/data/products";

export function generateStaticParams() {
  return SEED_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = SEED_PRODUCTS.find((x) => x.slug === slug);
  return { title: p ? `${p.name.en} · ${p.name.zh}` : "Product", description: p?.description.en };
}

// Products added in the admin panel aren't in the static list; they render on demand
// and are resolved client-side from the catalogue store.
export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  return <ProductDetail slug={slug} />;
}
