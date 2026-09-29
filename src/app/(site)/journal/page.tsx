import type { Metadata } from "next";
import { JournalIndex } from "@/components/pages/ServicePages";

export const metadata: Metadata = { title: "Journal", description: "Notes on material, makers and context." };

export default function Page() {
  return <JournalIndex />;
}
