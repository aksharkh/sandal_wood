import type { Metadata } from "next";
import { Catalog } from "@/components/shop/Catalog";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return <Catalog />;
}
