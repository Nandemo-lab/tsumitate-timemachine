import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getRankingPage, RANKING_CATEGORY_SLUGS } from "@/lib/ranking-pages";
import RankingView from "../_RankingView";

const BASE_URL = "https://tsumitate-timemachine.vercel.app";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return RANKING_CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const page = getRankingPage(category);
  if (!page) return {};
  return {
    title: `${page.metaTitle} | 積立タイムマシン`,
    description: page.metaDescription,
    alternates: { canonical: `${BASE_URL}/ranking/${category}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${BASE_URL}/ranking/${category}`,
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
}

export default async function RankingCategoryPage({ params }: Props) {
  const { category } = await params;
  const page = getRankingPage(category);
  if (!page) notFound();
  return <RankingView page={page} />;
}
