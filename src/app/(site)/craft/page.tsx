import type { Metadata } from "next";
import { CraftPage } from "@/components/pages/BrandPages";

export const metadata: Metadata = { title: "Making", description: "Select, shape, finish, inspect, present." };

export default function Page() {
  return <CraftPage />;
}
