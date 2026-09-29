import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/Shell";

export const metadata: Metadata = {
  title: { default: "Atelier Console", template: "%s · Atelier Console" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
