import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BagDrawer } from "@/components/site/BagDrawer";
import { SearchOverlay } from "@/components/site/SearchOverlay";
import { Concierge, Cursor, Preloader, SmoothScroll } from "@/components/site/Chrome";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grain relative">
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Header />
      <main className="relative">{children}</main>
      <Footer />
      <BagDrawer />
      <SearchOverlay />
      <Concierge />
    </div>
  );
}
