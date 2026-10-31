import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ARTICLE_REGISTRY,
  ARTICLE_PAGES,
  getArticlePage,
  buildOgImageUrl,
} from "@/lib/article-pages";
import SiteFooter from "@/components/layout/SiteFooter";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { ArticleComparisonVisual } from "@/components/visual/VisualStory";
import PageRoleGuide from "@/components/common/PageRoleGuide";

const BASE_URL = "https://tsumitate-timemachine.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ARTICLE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticlePage(slug);
  if (!article) return {};

  const ogImageUrl = buildOgImageUrl(article, BASE_URL);

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `${BASE_URL}/articles/${slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `${BASE_URL}/articles/${slug}`,
      type: "article",
      siteName: "積立タイムマシン",
      locale: "ja_JP",
      publishedTime: article.publishedAt,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const entry = ARTICLE_REGISTRY[slug];
  if (!entry) notFound();

  const { meta, Content } = entry;
  const relatedFunds = meta.relatedFunds ?? [];
  const comparisonHref = relatedFunds.length >= 2
    ? `/compare/${relatedFunds[0] === "orcan" ? "orukan" : relatedFunds[0]}-vs-${relatedFunds[1] === "orcan" ? "orukan" : relatedFunds[1]}`
    : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.h1,
    description: meta.metaDescription,
    author: {
      "@type": "Organization",
      name: "積立タイムマシン編集部",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "積立タイムマシン",
    },
    datePublished: meta.publishedAt,
    dateModified: meta.publishedAt,
    image: buildOgImageUrl(meta, BASE_URL),
    url: `${BASE_URL}/articles/${slug}`,
    inLanguage: "ja",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム",   item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "コラム",   item: `${BASE_URL}/articles` },
      { "@type": "ListItem", position: 3, name: meta.h1,    item: `${BASE_URL}/articles/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-dvh bg-[#FAFAF7] text-[#263A53]">
        <div className="tm-editorial-page mx-auto max-w-3xl px-4 pb-16 pt-5 md:pt-8">

          <Breadcrumbs items={[{ label: "コラム", href: "/articles" }, { label: meta.h1 }]} />

          <header className="tm-article-header">
            <p>{meta.category}</p>
            <h1>{meta.h1}</h1>
            <span>更新：{meta.lastUpdated}</span>
          </header>

          <PageRoleGuide
            label="商品の仕組みと比較結果の読み方を整理する"
            description="数値の勝ち負けではなく、投資対象、商品形態、費用、分配方針、データ品質を確認します。同条件の数値計算は比較ページに分けています。"
            counterpartHref={comparisonHref}
            counterpartLabel={comparisonHref ? "同じ条件の積立比較を開く" : undefined}
          />

          <ArticleComparisonVisual fundIds={relatedFunds} />

          <details className="tm-article-details">
            <summary>
              <span>商品構造・過去実績・リスクを詳しく読む</span>
              <small>約7分</small>
            </summary>
            <div className="tm-article-body"><Content meta={meta} /></div>
          </details>

        </div>
        <SiteFooter />
      </div>
    </>
  );
}
