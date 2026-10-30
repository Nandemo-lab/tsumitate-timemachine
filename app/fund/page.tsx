import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, ArrowRight, BookOpen } from "lucide-react";
import { FUND_PAGES } from "@/lib/fund-seo-pages";
import { FUNDS, FUND_CATEGORIES } from "@/lib/funds";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";
import { PageVisualStory } from "@/components/visual/VisualStory";

const BASE_URL = SITE_URL;

const PAGE_TITLE = "銘柄解説一覧";
const TITLE = `${PAGE_TITLE}｜${SITE_NAME}`;
const DESCRIPTION =
  "オルカン・S&P500・NASDAQ100・SCHD・VYM・VTI・FANG+など、人気銘柄の特徴・信託報酬・NISA対応・積立実績を解説したページ一覧です。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/fund` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/fund`,
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

export default function FundIndexPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "銘柄解説", item: `${BASE_URL}/fund` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-dvh bg-[#FAFAF7] text-[#263A53]">
        <nav className="border-b border-[#DDE6EA] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-slate-600">
            <Link href="/" className="hover:text-slate-700 transition-colors">積立タイムマシン</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-slate-700">銘柄解説</span>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-10 pb-20 space-y-8">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
              <BookOpen className="h-3 w-3 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-700">銘柄解説</span>
            </div>
            <h1
              className="text-2xl font-black text-[#263A53] leading-tight"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              銘柄解説一覧
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              人気銘柄の特徴・信託報酬・NISA対応・積立実績を1銘柄ずつ解説しています。
            </p>
          </header>

          <PageVisualStory kind="fund" />

          <section className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4 space-y-2">
            <h2 className="text-xs font-bold text-emerald-200">知りたい項目から銘柄を選ぶ</h2>
            <p className="text-xs leading-relaxed text-slate-600">
              Fund詳細では、正式商品名、投資対象、費用、NISA区分、設定日、検証可能な実績期間、一次情報を確認できます。利益額の違いは商品landingや比較ページで条件をそろえて確認します。
            </p>
            <Link href="/about/data-sources" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
              データ品質と更新履歴を見る<ArrowRight className="h-3 w-3" />
            </Link>
          </section>

          <div className="space-y-2">
            {FUND_PAGES.map((fp) => {
              const fund = FUNDS[fp.fundId];
              return (
                <Link
                  key={fp.slug}
                  href={`/fund/${fp.slug}`}
                  className="flex items-center justify-between rounded-xl border border-[#D9E3E8] p-4 hover:bg-white transition-colors group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs">{FUND_CATEGORIES[fund.category].emoji}</span>
                      <span className="text-sm font-bold" style={{ color: fund.color }}>{fund.shortName}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{fp.h1 ?? fp.metaTitle}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-700 transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

        <SiteFooter />
      </div>
    </>
  );
}
