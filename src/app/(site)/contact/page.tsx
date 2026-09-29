import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactPage } from "@/components/pages/ServicePages";

export const metadata: Metadata = { title: "Contact", description: "Visit by appointment or reach us on WhatsApp and WeChat." };

export default function Page() {
  return (
    <Suspense>
      <ContactPage />
    </Suspense>
  );
}
