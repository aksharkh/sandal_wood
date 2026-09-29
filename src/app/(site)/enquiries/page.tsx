import type { Metadata } from "next";
import { Suspense } from "react";
import { EnquiriesPage } from "@/components/pages/ServicePages";

export const metadata: Metadata = { title: "Private Enquiries", description: "Commissions, collecting, corporate and hospitality enquiries." };

export default function Page() {
  return (
    <Suspense>
      <EnquiriesPage />
    </Suspense>
  );
}
