import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BagDrawer } from "@/components/site/BagDrawer";
import { SearchOverlay } from "@/components/site/SearchOverlay";
import { SmoothScroll } from "@/components/site/Chrome";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative bg-page text-ink">
      <SmoothScroll />
      <Header />
      <main className="relative">{children}</main>
      <Footer />
      <BagDrawer />
      <SearchOverlay />
    </div>
  );
}
