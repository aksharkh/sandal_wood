import type { Metadata } from "next";
import { MaisonPage } from "@/components/pages/BrandPages";

export const metadata: Metadata = { title: "The Maison", description: "A house devoted to one material — red sandalwood from South India." };

export default function Page() {
  return <MaisonPage />;
}
