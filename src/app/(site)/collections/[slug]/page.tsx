import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalog } from "@/components/shop/Catalog";
import { COLLECTIONS } from "@/lib/data/products";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = COLLECTIONS.find((x) => x.slug === slug);
  return { title: c ? c.name.en : "Collection", description: c?.blurb.en };
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const c = COLLECTIONS.find((x) => x.slug === slug);
  if (!c) notFound();
  return <Catalog collection={c.slug} />;
}
