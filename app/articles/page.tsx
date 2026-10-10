import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, ArrowRight, BookOpen } from "lucide-react";
import { ARTICLE_PAGES } from "@/lib/article-pages";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: "コラム一覧",
  description: "オルカン・S&P500・NASDAQ100・SCHDなど人気銘柄の比較コラムを過去データとともに解説します。",
  alternates: { canonical: `${BASE_URL}/articles` },
  openGraph: {
    title: `コラム一覧 | ${SITE_NAME}`,
    description: "人気銘柄の比較コラムを過去データとともに解説します。",
    url: `${BASE_URL}/articles`,
    type: "website",
    siteName: SITE_NAME,
    locale: "ja_JP",
    images: [{ url: `${BASE_URL}/api/og?static=1`, width: 1200, height: 630, alt: "コラム一覧" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `コラム一覧 | ${SITE_NAME}`,
    description: "人気銘柄の比較コラムを過去データとともに解説します。",
    images: [`${BASE_URL}/api/og?static=1`],
  },
};

export default function ArticlesIndexPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "コラム", item: `${BASE_URL}/articles` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-dvh bg-zinc-950 text-zinc-50">
        <nav className="border-b border-white/[0.07] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">積立タイムマシン</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-zinc-200">コラム</span>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-10 pb-20 space-y-8">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1">
              <BookOpen className="h-3 w-3 text-indigo-400" />
              <span className="text-[11px] font-bold text-indigo-400">コラム</span>
            </div>
            <h1
              className="text-2xl font-black text-white leading-tight"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              コラム一覧
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              人気銘柄の違いを、過去データをもとに整理した比較コラムです。
            </p>
          </header>

          <section className="rounded-xl border border-indigo-400/20 bg-indigo-400/[0.05] p-4 space-y-2">
            <h2 className="text-xs font-bold text-indigo-200">コラムで確認すること</h2>
            <p className="text-xs leading-relaxed text-zinc-400">
              商品形態、投資対象、費用、分配方針、重複する投資先など、数値差が生じる背景を整理します。同条件の評価額・元本・グラフは対応する比較ページで再計算できます。
            </p>
            <Link href="/compare" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-300">
              数値を同条件で比較する<ArrowRight className="h-3 w-3" />
            </Link>
          </section>

          <div className="space-y-3">
            {ARTICLE_PAGES.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="block rounded-xl border border-white/[0.08] p-5 hover:bg-white/[0.03] transition-colors group"
              >
                <p className="text-[10px] font-bold text-indigo-400 mb-1.5">{article.category}</p>
                <p className="text-base font-bold text-white leading-snug mb-1.5">{article.h1}</p>
                <p className="text-xs text-zinc-500">{article.lastUpdated}更新</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  続きを読む <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <SiteFooter />
      </div>
    </>
  );
}
