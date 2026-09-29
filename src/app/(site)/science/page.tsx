import type { Metadata } from "next";
import { SciencePage } from "@/components/pages/BrandPages";

export const metadata: Metadata = { title: "Science", description: "Santalin pigments, density and the float test." };

export default function Page() {
  return <SciencePage />;
}
