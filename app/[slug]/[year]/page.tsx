import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Calendar,
  Home,
  Wallet,
  BookOpen,
} from "lucide-react";
import { getYearPage, YEAR_PAGES } from "@/lib/year-pages";
import { getComparePage, COMPARE_PAGES } from "@/lib/compare-pages";
import { FUND_PAGES } from "@/lib/fund-seo-pages";
import { FUNDS } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
import { FundId } from "@/types";
import SiteFooter from "@/components/layout/SiteFooter";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { MONTHLY_AMOUNTS } from "@/lib/monthly-pages";

const BASE_URL = "https://tsumitate-timemachine.com";

interface Props {
  params: Promise<{ slug: string; year: string }>;
}

export function generateStaticParams() {
  return YEAR_PAGES.map((p) => ({ slug: p.fundSlug, year: String(p.year) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, year } = await params;
  const page = getYearPage(slug, year);
  if (!page) return {};
  const fund = FUNDS[page.fundId];
  return {
    title: `${page.metaTitle} | 積立タイムマシン`,
    description: page.metaDescription,
    alternates: { canonical: `${BASE_URL}/${page.fundSlug}/${page.year}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${BASE_URL}/${page.fundSlug}/${page.year}`,
      type: "article",
      siteName: "積立タイムマシン",
      locale: "ja_JP",
      images: [
        {
          url: `${BASE_URL}/api/og?fund=${page.fundId}&year=${page.year}&amount=${page.simAmount}`,
          width: 1200,
          height: 630,
          alt: `${year}年から${fund.shortName}を積み立てていたら`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [
        `${BASE_URL}/api/og?fund=${page.fundId}&year=${page.year}&amount=${page.simAmount}`,
      ],
    },
  };
}

export default async function YearPage({ params }: Props) {
  const { slug, year } = await params;
  const page = getYearPage(slug, year);
  if (!page) notFound();

  const fund = FUNDS[page.fundId];
  const enc = fund.encyclopedia;

  const result = simulate({
    fundId: page.fundId,
    startYear: page.year,
    startMonth: page.simMonth,
    monthlyAmount: page.simAmount,
  });

  const isProfit = result.profit >= 0;
  const years = Math.floor(result.monthsElapsed / 12);
  const months = result.monthsElapsed % 12;

  // 動的FAQ（シミュレーション結果を含む）
  const dynamicFaq = {
    q: `${page.year}年から${enc.nickname}を毎月3万円積み立てていたらいくらになった？`,
    a: `${page.year}年1月から毎月3万円を積み立てた場合、元本${formatCurrency(result.totalPrincipal)}に対して現在の評価額は${formatCurrency(result.finalValue)}、利益は${isProfit ? "+" : ""}${formatCurrency(result.profit)}（リターン${result.returnRate.toFixed(1)}%）となっています（積立タイムマシン調べ・最新データ基準）。`,
  };
  const allFaqs = [dynamicFaq, ...page.faqs];

  // 関連比較ページ
  const relatedCompares = page.relatedCompareSlugs
    .map((s) => getComparePage(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getComparePage>>[];

  // 比較ページ検索（2銘柄IDから）
  const findCompareSlug = (a: FundId, b: FundId): string | null => {
    const cp = COMPARE_PAGES.find(
      (p) => (p.fundAId === a && p.fundBId === b) || (p.fundAId === b && p.fundBId === a)
    );
    return cp ? cp.slug : null;
  };

  // 同じ年・他銘柄のクロスリンク（リターン率降順・上位5件）
  const crossFundPages = YEAR_PAGES.filter(
    (yp) => yp.year === page.year && yp.fundSlug !== page.fundSlug
  )
    .map((yp) => ({
      yp,
      result: simulate({
        fundId: yp.fundId,
        startYear: yp.year,
        startMonth: yp.simMonth,
        monthlyAmount: yp.simAmount,
      }),
      compareSlug: findCompareSlug(page.fundId, yp.fundId),
    }))
    .sort((a, b) => b.result.returnRate - a.result.returnRate)
    .slice(0, 5);

  // 関連銘柄ページ（/fund/[slug]）
  const relatedFunds = page.relatedFundSlugs
    .map((s) => {
      const fp = FUND_PAGES.find((p) => p.slug === s);
      return fp ? { slug: s, fund: FUNDS[fp.fundId] } : null;
    })
    .filter(Boolean) as { slug: string; fund: (typeof FUNDS)[keyof typeof FUNDS] }[];

  // JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: enc.nickname,
        item: `${BASE_URL}/${slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${page.year}年から積み立てていたら`,
        item: `${BASE_URL}/${slug}/${year}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-dvh bg-zinc-950 text-zinc-50">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-16 space-y-10">

          {/* パンくず */}
          <nav className="flex items-center gap-1 text-xs text-zinc-500 flex-wrap">
            <Link href="/" className="hover:text-zinc-300 transition-colors">ホーム</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link href={`/${slug}`} className="hover:text-zinc-300 transition-colors">
              {enc.nickname}
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-zinc-400">{page.year}年から積み立てていたら</span>
          </nav>

          {/* ── H1 ───────────────────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 flex-shrink-0" style={{ color: fund.color }} />
              <h1
                className="text-2xl font-black text-white leading-tight"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                {page.year}年から{enc.nickname}を<br />積み立てていたら？
              </h1>
            </div>
            <p className="text-sm text-zinc-400">
              月{(page.simAmount / 10000).toFixed(0)}万円 / {page.year}年{page.simMonth}月スタートの場合
            </p>
          </section>

          {/* ── メイン結果カード ─────────────────────────────────── */}
          <section
            className="rounded-2xl p-5 space-y-5"
            style={{
              background: `${fund.color}12`,
              border: `1px solid ${fund.color}35`,
            }}
          >
            {/* 利益（主役） */}
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-1">
                利益
              </p>
              <div className="flex items-baseline gap-2">
                <p
                  className="font-heading font-number text-4xl font-bold"
                  style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                >
                  {isProfit ? "+" : ""}{formatCurrency(result.profit)}
                </p>
                <span
                  className="font-number text-lg font-bold"
                  style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                >
                  {isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* プログレスバー */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>元本</span>
                <span>元本×2</span>
              </div>
              <div className="h-3 rounded-full bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    background: isProfit
                      ? `linear-gradient(90deg, ${fund.color}90, ${fund.color})`
                      : "#ef444490",
                    width: `${Math.min(100, Math.max(2, (result.finalValue / (result.totalPrincipal * 2)) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* 3カラム詳細 */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="text-center rounded-xl bg-white/[0.04] py-3">
                <p className="text-[9px] text-zinc-500 mb-1">評価額</p>
                <p className="text-sm font-bold text-zinc-200">
                  {formatCurrency(result.finalValue)}
                </p>
              </div>
              <div className="text-center rounded-xl bg-white/[0.04] py-3">
                <p className="text-[9px] text-zinc-500 mb-1">投資元本</p>
                <p className="text-sm font-bold text-zinc-200">
                  {formatCurrency(result.totalPrincipal)}
                </p>
              </div>
              <div className="text-center rounded-xl bg-white/[0.04] py-3">
                <p className="text-[9px] text-zinc-500 mb-1">積立期間</p>
                <p className="text-sm font-bold text-zinc-200">
                  {years}年{months > 0 ? `${months}ヶ月` : ""}
                </p>
              </div>
            </div>
          </section>

          {/* ── 年の解説 ─────────────────────────────────────────── */}
          <section
            className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-black px-2 py-0.5 rounded"
                style={{ background: `${fund.color}20`, color: fund.color }}
              >
                {page.year}年の市場
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{page.yearContext}</p>
            <p className="text-sm text-zinc-300 leading-relaxed">
              この年の{page.simMonth}月から毎月{(page.simAmount / 10000).toFixed(0)}万円を
              {enc.nickname}に積み立てていた場合、
              現在の評価額は
              <span className="font-bold" style={{ color: isProfit ? "#10b981" : "#ef4444" }}>
                {formatCurrency(result.finalValue)}
              </span>
              、利益は
              <span className="font-bold" style={{ color: isProfit ? "#10b981" : "#ef4444" }}>
                {isProfit ? "+" : ""}{formatCurrency(result.profit)}（{isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%）
              </span>
              になっています。
            </p>
          </section>

          {/* ── 同銘柄・他の年度 ─────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {enc.nickname}の他の年から積み立てていたら？
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {page.otherYears.map((y) => {
                const otherResult = simulate({
                  fundId: page.fundId,
                  startYear: y,
                  startMonth: page.simMonth,
                  monthlyAmount: page.simAmount,
                });
                const otherProfit = otherResult.profit >= 0;
                return (
                  <Link
                    key={y}
                    href={`/${slug}/${y}`}
                    className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ background: `${fund.color}20`, color: fund.color }}
                      >
                        {y}年〜
                      </span>
                      <span className="text-sm text-zinc-300">
                        {enc.nickname}を積み立てていたら
                      </span>
                    </div>
                    <span
                      className="text-xs font-bold font-number flex-shrink-0"
                      style={{ color: otherProfit ? "#10b981" : "#ef4444" }}
                    >
                      {otherProfit ? "+" : ""}{otherResult.returnRate.toFixed(1)}%
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 関連比較ページ ───────────────────────────────────── */}
          {relatedCompares.length > 0 && (
            <section>
              <h2
                className="text-base font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                {enc.nickname}の比較記事
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {relatedCompares.map((cp) => {
                  const fA = FUNDS[cp.fundAId];
                  const fB = FUNDS[cp.fundBId];
                  return (
                    <Link
                      key={cp.slug}
                      href={`/compare/${cp.slug}`}
                      className="flex flex-col gap-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold text-white">
                        <span style={{ color: fA.color }}>{fA.shortName}</span>
                        <span className="text-zinc-500 text-xs">vs</span>
                        <span style={{ color: fB.color }}>{fB.shortName}</span>
                      </span>
                      <span className="text-xs text-zinc-500">{cp.relatedDescription}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── 関連銘柄解説 ─────────────────────────────────────── */}
          {relatedFunds.length > 0 && (
            <section>
              <h2
                className="text-base font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                関連する銘柄解説
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedFunds.map(({ slug: fSlug, fund: relFund }) => (
                  <Link
                    key={fSlug}
                    href={`/fund/${fSlug}`}
                    className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                  >
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ background: relFund.color }}
                    />
                    <div>
                      <p className="text-sm font-bold text-white">{relFund.shortName}とは？</p>
                      <p className="text-[10px] text-zinc-500">{relFund.encyclopedia.catchCopy}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-500 ml-auto" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── CTA ─────────────────────────────────────────────── */}
          <section className="rounded-2xl bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/20 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h2
                className="text-base font-bold text-white"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                自分の条件でシミュレーション
              </h2>
            </div>
            <p className="text-sm text-zinc-400">
              積立開始年・月額を自由に変えて、あなただけの「たられば」を計算できます。
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  積立タイムマシンで試す
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/simulate/${page.fundId}/${page.year}`}
                className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-sm text-white transition-opacity hover:opacity-90"
                style={{ background: fund.color }}
              >
                {enc.nickname}×{page.year}年でシミュレーション
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* ── よくある質問 ─────────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-5"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {page.year}年積立に関するよくある質問
            </h2>
            <div className="space-y-4">
              {allFaqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2"
                >
                  <p className="text-sm font-bold text-white">Q. {faq.q}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">A. {faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 他の人気シミュレーション（同年・他銘柄） ─────────── */}
          {crossFundPages.length > 0 && (
            <section>
              <h2
                className="text-base font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                {page.year}年から他の銘柄を積み立てていたら？
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {crossFundPages.map(({ yp, result: r, compareSlug }, i) => {
                  const f = FUNDS[yp.fundId];
                  const MEDALS = ["🥇", "🥈", "🥉"];
                  const medal = MEDALS[i] ?? null;
                  return (
                    <div
                      key={yp.fundSlug}
                      className="rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden"
                    >
                      <Link
                        href={`/${yp.fundSlug}/${yp.year}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition-colors"
                      >
                        {medal ? (
                          <span className="text-sm w-5 text-center flex-shrink-0">{medal}</span>
                        ) : (
                          <span className="text-xs text-zinc-500 w-5 text-center flex-shrink-0">{i + 1}</span>
                        )}
                        <span
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ background: f.color }}
                        />
                        <span className="text-sm text-zinc-300 flex-1 min-w-0">
                          {f.encyclopedia.nickname}
                        </span>
                        <span
                          className="text-sm font-bold font-number flex-shrink-0"
                          style={{ color: r.profit >= 0 ? "#10b981" : "#ef4444" }}
                        >
                          {r.profit >= 0 ? "+" : ""}{r.returnRate.toFixed(1)}%
                        </span>
                      </Link>
                      {compareSlug && (
                        <div className="border-t border-white/[0.06] px-4 py-2">
                          <Link
                            href={`/compare/${compareSlug}`}
                            className="flex items-center justify-end gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            {enc.nickname} vs {f.encyclopedia.nickname}を比較する
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── 月額別シミュレーション ────────────────────────────── */}
          {["orukan", "sp500", "nasdaq100"].includes(slug) && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="h-4 w-4 text-violet-400" />
                <h2
                  className="text-base font-bold text-white"
                  style={{ fontFamily: "var(--font-serif-jp), serif" }}
                >
                  {enc.nickname}の月額別シミュレーション
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {MONTHLY_AMOUNTS.map((amt) => {
                  const label = amt >= 10000 ? `月${amt / 10000}万円` : `月${amt}円`;
                  return (
                    <Link
                      key={amt}
                      href={`/${slug}/monthly/${amt}`}
                      className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.07] px-3 py-2.5 hover:bg-white/[0.06] transition-colors"
                    >
                      <span className="text-sm text-zinc-300">{label}</span>
                      <ChevronRight className="h-3 w-3 text-zinc-500" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── 関連ガイド ────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <h2
                className="text-base font-bold text-white"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                投資ガイド・おすすめ記事
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "新NISAのおすすめ積立先は？オルカン・S&P500・NASDAQ100を比較",  href: "/guide/nisa-beginner" },
                { label: "インデックス投資とは？初心者向け解説",       href: "/guide/index-investing" },
                { label: "ドルコスト平均法とは？定額積立のメリット",       href: "/guide/dollar-cost-averaging" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-2.5 hover:bg-white/[0.06] transition-colors"
                >
                  <span className="text-sm text-zinc-400">{label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                </Link>
              ))}
            </div>
          </section>

          {/* ── 人気ページ ──────────────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              人気の積立シミュレーション
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "オルカン（全世界株式）とは？特徴・メリット",           href: "/fund/orukan" },
                { label: "S&P500とは？積立実績・メリット・オルカンとの違い",     href: "/fund/sp500" },
                { label: "NASDAQ100とは？S&P500との違い・リスク",               href: "/fund/nasdaq100" },
                { label: "オルカン vs S&P500 どっちがいい？",                   href: "/compare/orukan-vs-sp500" },
                { label: "S&P500 vs NASDAQ100 どっちがいい？",                  href: "/compare/sp500-vs-nasdaq100" },
                { label: "2020年（コロナ直後）からオルカン積立→実績確認",       href: "/orukan/2020" },
                { label: "2020年（コロナ直後）からS&P500積立→実績確認",        href: "/sp500/2020" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
                >
                  {label}
                  <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          <DisclaimerBar />
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
