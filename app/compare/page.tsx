import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, ArrowRight, GitCompareArrows } from "lucide-react";
import { COMPARE_PAGES } from "@/lib/compare-pages";
import { FUNDS } from "@/lib/funds";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

const BASE_URL = SITE_URL;

const PAGE_TITLE = "銘柄比較一覧";
const TITLE = `${PAGE_TITLE}｜${SITE_NAME}`;
const DESCRIPTION =
  "オルカン・S&P500・NASDAQ100・SCHD・VYM・VTIなど、人気銘柄同士の過去実績・コスト・NISA対応を比較したページ一覧です。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/compare` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/compare`,
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

export default function CompareIndexPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "比較", item: `${BASE_URL}/compare` },
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
            <span className="text-zinc-200">比較</span>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-10 pb-20 space-y-8">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1">
              <GitCompareArrows className="h-3 w-3 text-violet-400" />
              <span className="text-[11px] font-bold text-violet-400">比較</span>
            </div>
            <h1
              className="text-2xl font-black text-white leading-tight"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              銘柄比較一覧
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              人気銘柄同士の過去実績・コスト・NISA対応を比較したページ一覧です。気になる2銘柄を選んで、過去データで違いを確認できます。
            </p>
          </header>

          <div className="space-y-2">
            {COMPARE_PAGES.map((cp) => {
              const fA = FUNDS[cp.fundAId];
              const fB = FUNDS[cp.fundBId];
              return (
                <Link
                  key={cp.slug}
                  href={`/compare/${cp.slug}`}
                  className="block rounded-xl border border-white/[0.08] p-4 hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-bold" style={{ color: fA.color }}>{fA.shortName}</span>
                    <span className="text-xs text-zinc-500">vs</span>
                    <span className="text-sm font-bold" style={{ color: fB.color }}>{fB.shortName}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors ml-auto flex-shrink-0" />
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{cp.relatedDescription}</p>
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
