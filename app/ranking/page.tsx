import { Metadata } from "next";
import { getRankingPage } from "@/lib/ranking-pages";
import RankingView from "./_RankingView";

const BASE_URL = "https://tsumitate-timemachine.com";

export const metadata: Metadata = (() => {
  const page = getRankingPage("")!;
  return {
    title: `${page.metaTitle} | 積立タイムマシン`,
    description: page.metaDescription,
    alternates: { canonical: `${BASE_URL}/ranking` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${BASE_URL}/ranking`,
      type: "article",
      siteName: "積立タイムマシン",
      locale: "ja_JP",
      images: [{ url: `${BASE_URL}/api/og?static=1`, width: 1200, height: 630, alt: page.metaTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [`${BASE_URL}/api/og?static=1`],
    },
  };
})();

export default function RankingIndexPage() {
  const page = getRankingPage("")!;
  return <RankingView page={page} />;
}
