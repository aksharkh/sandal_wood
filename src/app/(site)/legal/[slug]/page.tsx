import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/pages/ServicePages";
import { LEGAL } from "@/lib/data/legal";

export function generateStaticParams() {
  return Object.keys(LEGAL).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: LEGAL[slug]?.title ?? "Policies" };
}

export default async function Page(props: PageProps<"/legal/[slug]">) {
  const { slug } = await props.params;
  if (!LEGAL[slug]) notFound();
  return <LegalPage slug={slug} />;
}
