import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalArticle } from "@/components/pages/ServicePages";
import { JOURNAL } from "@/lib/data/journal";

export function generateStaticParams() {
  return JOURNAL.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata(props: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const j = JOURNAL.find((x) => x.slug === slug);
  return { title: j?.title.en ?? "Journal", description: j?.excerpt.en };
}

export default async function Page(props: PageProps<"/journal/[slug]">) {
  const { slug } = await props.params;
  if (!JOURNAL.some((j) => j.slug === slug)) notFound();
  return <JournalArticle slug={slug} />;
}
