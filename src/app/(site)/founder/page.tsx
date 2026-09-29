import type { Metadata } from "next";
import { FounderPage } from "@/components/pages/BrandPages";

export const metadata: Metadata = { title: "Why We Began", description: "A letter from the founder of Santalum Maison." };

export default function Page() {
  return <FounderPage />;
}
