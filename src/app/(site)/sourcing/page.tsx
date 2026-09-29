import type { Metadata } from "next";
import { SourcingPage } from "@/components/pages/BrandPages";

export const metadata: Metadata = { title: "Responsible Sourcing", description: "Legal, documented, CITES-compliant red sandalwood." };

export default function Page() {
  return <SourcingPage />;
}
