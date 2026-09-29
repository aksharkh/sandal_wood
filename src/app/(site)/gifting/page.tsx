import type { Metadata } from "next";
import { GiftingPage } from "@/components/pages/BrandPages";

export const metadata: Metadata = { title: "Gifting", description: "Personal, corporate, milestone and hospitality gifting." };

export default function Page() {
  return <GiftingPage />;
}
