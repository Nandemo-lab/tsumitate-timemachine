import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import {
  ARTICLE_REGISTRY,
  ARTICLE_PAGES,
  getArticlePage,
  buildOgImageUrl,
} from "@/lib/article-pages";
import SiteFooter from "@/components/layout/SiteFooter";

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

      <div className="min-h-dvh bg-zinc-950 text-zinc-50">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-16 space-y-10">

          {/* パンくず */}
          <nav className="flex items-center gap-1 text-xs text-zinc-500 flex-wrap">
            <Link href="/" className="hover:text-zinc-300 transition-colors">ホーム</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-zinc-500">コラム</span>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-zinc-400 truncate max-w-[160px]">{meta.h1}</span>
          </nav>

          {/* 記事本文（各記事コンポーネントが H1〜CTA まで全て担う） */}
          <Content meta={meta} />

        </div>
        <SiteFooter />
      </div>
    </>
  );
}
