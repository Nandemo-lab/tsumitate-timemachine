import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const BASE_URL = "https://tsumitate-timemachine.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "積立タイムマシン｜もしあの時から積み立てていたら？",
    template: "%s | 積立タイムマシン",
  },
  description:
    "「もしあの時から積み立てていたら？」を過去の実績データで体験。S&P500・オルカン・NASDAQ100など主要インデックスの積立投資シミュレーター。",
  keywords: [
    "積立投資", "シミュレーター", "NISA", "新NISA", "S&P500",
    "オルカン", "NASDAQ100", "インデックス投資", "資産形成",
    "積立NISA", "投資信託", "ETF", "たられば",
  ],
  authors: [{ name: "積立タイムマシン" }],
  creator: "積立タイムマシン",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: BASE_URL,
    siteName: "積立タイムマシン",
    title: "積立タイムマシン｜もしあの時から積み立てていたら？",
    description: "過去の実績で「たられば」を体験する積立投資シミュレーター",
    images: [
      {
        url: `${BASE_URL}/api/og?fund=sp500&year=2020&amount=30000`,
        width: 1200,
        height: 630,
        alt: "積立タイムマシン",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "積立タイムマシン｜もしあの時から積み立てていたら？",
    description: "過去の実績で「たられば」を体験する積立投資シミュレーター",
    images: [`${BASE_URL}/api/og?fund=sp500&year=2020&amount=30000`],
    creator: "@tsumitate_tm",
  },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
