import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight, IBM_Plex_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// next/font self-hosts every file at build time — no runtime calls to Google,
// which matters because fonts.googleapis.com is blocked in mainland China.
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: "variable", axes: ["wdth"] });
const inter = Inter_Tight({ variable: "--font-inter", subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const plex = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });
const notoSansSC = Noto_Sans_SC({ variable: "--font-noto-sans-sc", weight: ["400", "500", "700"], preload: false });

export const metadata: Metadata = {
  title: {
    default: "Santalum Maison — Red Sandalwood from India",
    template: "%s · Santalum Maison",
  },
  description:
    "Objects in red sandalwood (Pterocarpus santalinus) — jewellery, malas and everyday objects, selected, shaped and documented by hand in South India. 小叶紫檀 · 印度.",
  keywords: ["red sandalwood", "Pterocarpus santalinus", "小叶紫檀", "raktachandan", "sandalwood jewellery", "mala", "手串"],
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${plex.variable} ${notoSansSC.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
