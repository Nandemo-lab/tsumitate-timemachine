import type { Metadata } from "next";
import ShareClient from "./ShareClient";

const BASE_URL = "https://tsumitate-timemachine.com";
const title = "共有された積立条件を確認";
const description = "共有URLに保存された銘柄・期間・毎月の積立額を読み取り、過去の月次実績から結果を再計算します。金額と損益は共有ページでご確認ください。";

// A generic, accurate card for every amount and comparison. The old
// personalized OG would require unbounded server-side calculation.
export const metadata: Metadata = {
  title, description,
  openGraph: { title, description, url: `${BASE_URL}/share`, siteName: "積立タイムマシン", locale: "ja_JP", type: "website", images: [{ url: `${BASE_URL}/api/og?static=1`, width: 1200, height: 630, alt: "過去の積立条件を確認" }] },
  twitter: { card: "summary_large_image", title, description, images: [`${BASE_URL}/api/og?static=1`] },
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function SharePage() {
  return <ShareClient />;
}
