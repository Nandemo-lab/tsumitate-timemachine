import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, ArrowRight, TrendingDown, AlertTriangle } from "lucide-react";
import { getGuidePage } from "@/lib/guide-pages";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

const BASE_URL = SITE_URL;

// 暴落クラスタ4記事。過去実績の解説→一般的な判断基準→新NISA固有の論点→
// 歴史的な最悪シナリオ、の順に理解しやすいよう並べている。
const BOORAKU_CLUSTER_SLUGS = [
  "sp500-booraku-taisho",
  "booraku-tsumitate-yameru",
  "shinnisa-booraku-dousuru",
  "lehman-kyuu-tsumitate-kensho",
] as const;

// 関連する運用クラスタの記事（暴落局面での行動判断に直結するテーマ）
const RELATED_SLUGS = [
  "dollar-cost-averaging",
  "index-shippai-pattern",
  "tsumitate-vs-ikkatu",
] as const;

const TITLE = "暴落ガイド一覧｜過去の暴落データと積立継続の考え方";
const DESCRIPTION =
  "S&P500の過去の暴落実績、暴落時に積立をやめるべきかの判断基準、新NISAでの対応、リーマンショック級の下落シナリオまで、暴落局面での積立の考え方を4つの記事にまとめています。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/guide/booraku` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/guide/booraku`,
    type: "website",
    siteName: SITE_NAME,
    locale: "ja_JP",
    images: [{ url: `${BASE_URL}/api/og?static=1`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${BASE_URL}/api/og?static=1`],
  },
};

export default function BoorakuGuideIndexPage() {
  const boorakuGuides: { order: number; slug: string; page: NonNullable<ReturnType<typeof getGuidePage>> }[] = [];
  BOORAKU_CLUSTER_SLUGS.forEach((slug, i) => {
    const page = getGuidePage(slug);
    if (page) boorakuGuides.push({ order: i + 1, slug, page });
  });

  const relatedGuides: { slug: string; page: NonNullable<ReturnType<typeof getGuidePage>> }[] = [];
  RELATED_SLUGS.forEach((slug) => {
    const page = getGuidePage(slug);
    if (page) relatedGuides.push({ slug, page });
  });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "暴落ガイド一覧",
    itemListElement: boorakuGuides.map(({ order, slug, page }) => ({
      "@type": "ListItem",
      position: order,
      name: page.h1,
      url: `${BASE_URL}/guide/${slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "投資ガイド", item: `${BASE_URL}/guide` },
      { "@type": "ListItem", position: 3, name: "暴落ガイド一覧", item: `${BASE_URL}/guide/booraku` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-dvh bg-[#FAFAF7] text-[#263A53]">
        <nav className="border-b border-[#DDE6EA] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
            <Link href="/" className="hover:text-slate-700 transition-colors">積立タイムマシン</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-slate-500">投資ガイド</span>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-slate-700">暴落ガイド一覧</span>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-10 pb-20 space-y-10">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1">
              <TrendingDown className="h-3 w-3 text-orange-600" />
              <span className="text-xs font-bold text-orange-600">暴落ガイド</span>
            </div>
            <h1
              className="text-2xl font-black text-[#263A53] leading-tight"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              暴落ガイド一覧
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              過去の暴落局面での実績データ、積立を止める場合の論点、新NISA特有の確認事項、リーマンショック級の下落シナリオを4つの記事に分けています。指数下落率、積立経過、制度上の扱いを混同せず、知りたい論点から選べます。
            </p>
          </header>

          <section className="rounded-xl bg-amber-500/[0.04] border border-amber-500/15 p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-600 flex-shrink-0" />
              <p className="text-xs font-bold text-amber-200">過去の実績は将来の成果を保証しません</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              各記事で扱う暴落データは過去の実績に基づくシミュレーションです。特定の期間の値動きが今後の暴落局面でも同様に再現されるとは限りません。
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="drawdown-route-heading">
            <h2 id="drawdown-route-heading" className="text-sm font-bold text-[#263A53]">確認したい数値・判断から選ぶ</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ["指数の過去下落率", "/guide/sp500-booraku-taisho", "米ドル建て配当込み指数のイベント期間を確認"],
                ["積立を止めるか迷う", "/guide/booraku-tsumitate-yameru", "停止・保有・売却を分けて確認"],
                ["NISA口座で下落した", "/guide/shinnisa-booraku-dousuru", "非課税枠と損失の制度上の扱いを確認"],
                ["積立経過を見たい", "/guide/lehman-kyuu-tsumitate-kensho", "指数下落率と積立評価額を別々に確認"],
              ].map(([label, href, detail]) => (
                <Link key={href} href={href} className="rounded-xl border border-[#D9E3E8] p-4 hover:bg-white transition-colors">
                  <p className="text-sm font-bold text-[#263A53]">{label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="space-y-3">
            {boorakuGuides.map(({ order, slug, page }) => (
              <Link
                key={slug}
                href={`/guide/${slug}`}
                className="block rounded-xl border border-[#D9E3E8] p-5 hover:bg-white transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-xs font-bold text-orange-600">
                    {order}
                  </span>
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-base font-bold text-[#263A53] leading-snug">{page.h1}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{page.metaDescription}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-600 group-hover:text-slate-700 transition-colors">
                      続きを読む <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-[#263A53]">あわせて読みたい運用ガイド</h2>
            <div className="space-y-2">
              {relatedGuides.map(({ slug, page }) => (
                <Link
                  key={slug}
                  href={`/guide/${slug}`}
                  className="flex items-center justify-between rounded-lg border border-[#E1E8EC] px-4 py-3 hover:bg-white transition-colors group"
                >
                  <span className="text-sm text-slate-700">{page.h1}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-700 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </>
  );
}
