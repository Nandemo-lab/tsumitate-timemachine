import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Noto_Serif_JP, Geist_Mono } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});
const notoSerifJP = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  display: "swap",
});
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const BASE_URL = "https://tsumitate-timemachine.vercel.app";
const OG_IMAGE = `${BASE_URL}/api/og`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "積立タイムマシン｜もしあの時から積み立てていたら？",
    template: "%s | 積立タイムマシン",
  },
  description:
    "過去の実績データをもとに、オルカン・S&P500・NASDAQ100などの積立結果をシミュレーション。もし数年前から投資していたら今いくらになっていたかを無料で確認できます。",
  keywords: [
    "積立投資", "シミュレーター", "たられば投資", "NISA", "新NISA", "S&P500",
    "オルカン", "全世界株", "NASDAQ100", "インデックス投資", "資産形成",
    "積立NISA", "投資信託", "ETF", "過去シミュレーション", "積立計算",
  ],
  authors: [{ name: "積立タイムマシン" }],
  creator: "積立タイムマシン",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: BASE_URL,
    siteName: "積立タイムマシン",
    title: "もし2020年から積み立てていたら？",
    description: "オルカン・S&P500・NASDAQ100の積立結果を無料シミュレーション",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "積立タイムマシン｜もし2020年から積み立てていたら？ +110万円",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "もし2020年から積み立てていたら？",
    description: "オルカン・S&P500・NASDAQ100の積立結果を無料シミュレーション",
    images: [OG_IMAGE],
  },
  verification: { google: "cRn8VxxoWtUthqHWNPZRw8NNbK813gzFn70_S7gw9oQ" },
  alternates: { canonical: BASE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "積立タイムマシン",
  url: "https://tsumitate-timemachine.vercel.app",
  description: "過去の実績データをもとに、オルカン・S&P500・NASDAQ100などの積立投資シミュレーションを無料で体験できるWebアプリ。",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  inLanguage: "ja",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  creator: { "@type": "Organization", name: "積立タイムマシン" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${notoSerifJP.variable} ${geistMono.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
