import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, IBM_Plex_Mono, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// next/font self-hosts every file at build time — no runtime calls to Google,
// which matters because fonts.googleapis.com is blocked in mainland China.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });
const plex = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });
const notoSerifSC = Noto_Serif_SC({ variable: "--font-noto-serif-sc", weight: ["400", "600"], preload: false });
const notoSansSC = Noto_Sans_SC({ variable: "--font-noto-sans-sc", weight: ["400", "500"], preload: false });

export const metadata: Metadata = {
  title: {
    default: "Santalum Maison — Red Sandalwood from India",
    template: "%s · Santalum Maison",
  },
  description:
    "Objects in red sandalwood (Pterocarpus santalinus) — jewellery, malas and everyday objects, selected, shaped and documented by hand in South India. 小叶紫檀 · 印度.",
  keywords: ["red sandalwood", "Pterocarpus santalinus", "小叶紫檀", "raktachandan", "sandalwood jewellery", "mala", "手串"],
};

export const viewport: Viewport = { themeColor: "#0b0706" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${plex.variable} ${notoSerifSC.variable} ${notoSansSC.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
