import type { Metadata } from "next";
import { Suspense } from "react";
import { ProvenancePage } from "@/components/pages/ServicePages";

export const metadata: Metadata = { title: "Provenance", description: "Trace any batch: source, processing and certification." };

export default function Page() {
  return (
    <Suspense>
      <ProvenancePage />
    </Suspense>
  );
}
