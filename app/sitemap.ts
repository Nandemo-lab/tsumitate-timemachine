import { MetadataRoute } from "next";
import { FUND_LIST } from "@/lib/funds";
import { FUND_SEO_PAGES } from "@/lib/fund-seo";
import { COMPARE_PAGES } from "@/lib/compare-pages";
import { FUND_PAGES } from "@/lib/fund-seo-pages";

const BASE_URL = "https://tsumitate-timemachine.vercel.app";
const YEARS = [2015, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/terms`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // 銘柄ランディングページ（SEO重点ページ）
  const fundLandingPages: MetadataRoute.Sitemap = FUND_SEO_PAGES.map((p) => ({
    url: `${BASE_URL}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // シミュレーション個別ページ
  const simPages: MetadataRoute.Sitemap = [];
  for (const fund of FUND_LIST) {
    for (const year of YEARS) {
      simPages.push({
        url: `${BASE_URL}/simulate/${fund.id}/${year}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // 比較ページ
  const comparePages: MetadataRoute.Sitemap = COMPARE_PAGES.map((p) => ({
    url: `${BASE_URL}/compare/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // 銘柄解説ページ（/fund/[slug]）
  const fundArticlePages: MetadataRoute.Sitemap = FUND_PAGES.map((p) => ({
    url: `${BASE_URL}/fund/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...fundLandingPages, ...fundArticlePages, ...comparePages, ...simPages];
}
