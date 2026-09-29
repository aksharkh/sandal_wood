import type { Metadata } from "next";
import { MaterialPage } from "@/components/pages/BrandPages";

export const metadata: Metadata = { title: "The Material", description: "Pterocarpus santalinus: grain, colour, touch and density." };

export default function Page() {
  return <MaterialPage />;
}
