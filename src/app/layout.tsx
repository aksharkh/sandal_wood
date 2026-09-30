import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Geist, Geist_Mono, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// next/font self-hosts every file at build time — no runtime calls to Google,
// which matters because fonts.googleapis.com is blocked in mainland China.
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], weight: "variable", style: ["normal", "italic"], axes: ["opsz"] });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoSansSC = Noto_Sans_SC({ variable: "--font-noto-sans-sc", weight: ["400", "500", "700"], preload: false });
const notoSerifSC = Noto_Serif_SC({ variable: "--font-noto-serif-sc", weight: ["400", "600"], preload: false });

export const metadata: Metadata = {
  title: {
    default: "Santalum Maison — Red Sandalwood from India",
    template: "%s · Santalum Maison",
  },
  description:
    "Objects in red sandalwood (Pterocarpus santalinus) — jewellery, malas and everyday objects, selected, shaped and documented by hand in South India. 小叶紫檀 · 印度.",
  keywords: ["red sandalwood", "Pterocarpus santalinus", "小叶紫檀", "raktachandan", "sandalwood jewellery", "mala", "手串"],
};

export const viewport: Viewport = { themeColor: "#0a110e" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bodoni.variable} ${geist.variable} ${geistMono.variable} ${notoSansSC.variable} ${notoSerifSC.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
