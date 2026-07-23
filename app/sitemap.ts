import { MetadataRoute } from "next";
import { FUND_LIST } from "@/lib/funds";
import { FUND_SEO_PAGES } from "@/lib/fund-seo";
import { COMPARE_PAGES } from "@/lib/compare-pages";
import { FUND_PAGES } from "@/lib/fund-seo-pages";
import { YEAR_PAGES } from "@/lib/year-pages";
import { MONTHLY_PAGES } from "@/lib/monthly-pages";
import { GUIDE_PAGES } from "@/lib/guide-pages";
import { RANKING_CATEGORY_SLUGS } from "@/lib/ranking-pages";
import { ARTICLE_PAGES } from "@/lib/article-pages";

const BASE_URL = "https://tsumitate-timemachine.com";
const YEARS = [2015, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                               lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/about`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about/data-sources`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/terms`,                    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/privacy`,                  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/contact`,                  lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
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

  // 年別たられば記事（/[fundSlug]/[year]）
  const yearArticlePages: MetadataRoute.Sitemap = YEAR_PAGES.map((p) => ({
    url: `${BASE_URL}/${p.fundSlug}/${p.year}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // 年別総合ランキングページ（/from/[year]）
  const fromYearPages: MetadataRoute.Sitemap = [2019, 2020, 2021, 2022, 2023, 2024].map((y) => ({
    url: `${BASE_URL}/from/${y}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // 月額別シミュレーションページ（/[slug]/monthly/[amount]）
  const monthlyAmountPages: MetadataRoute.Sitemap = MONTHLY_PAGES.map((p) => ({
    url: `${BASE_URL}/${p.fundSlug}/monthly/${p.amount}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ランキングページ（/ranking, /ranking/[category]）
  const rankingPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/ranking`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    ...RANKING_CATEGORY_SLUGS.map((s) => ({
      url: `${BASE_URL}/ranking/${s}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];

  // 目的別ガイドページ（/guide/[slug]）
  const guideArticlePages: MetadataRoute.Sitemap = GUIDE_PAGES.map((p) => ({
    url: `${BASE_URL}/guide/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // 税金ガイド一覧（/guide/tax）
  const taxGuideIndexPage: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/guide/tax`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.85 },
  ];

  // 制度ガイド一覧（/guide/system）
  const systemGuideIndexPage: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/guide/system`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.85 },
  ];

  // コラム一覧（/articles）
  const articleIndexPage: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  // コラム記事（/articles/[slug]）
  const articlePages: MetadataRoute.Sitemap = ARTICLE_PAGES.map((p) => ({
    url: `${BASE_URL}/articles/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [
    ...staticPages,
    ...fundLandingPages,
    ...fundArticlePages,
    ...yearArticlePages,
    ...comparePages,
    ...fromYearPages,
    ...monthlyAmountPages,
    ...guideArticlePages,
    ...taxGuideIndexPage,
    ...systemGuideIndexPage,
    ...articleIndexPage,
    ...articlePages,
    ...rankingPages,
    ...simPages,
  ];
}
