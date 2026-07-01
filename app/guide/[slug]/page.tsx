import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  BarChart2,
} from "lucide-react";
import { getGuidePage, GUIDE_PAGES } from "@/lib/guide-pages";
import { COMPARE_PAGES } from "@/lib/compare-pages";
import { FUNDS } from "@/lib/funds";
import { simulate, formatCurrency, formatYearMonth } from "@/lib/simulation";
import { FundId } from "@/types";
import SiteFooter from "@/components/layout/SiteFooter";
import GuideEeat from "@/components/guide/GuideEeat";
import GuideBodyText from "@/components/guide/GuideBodyText";
import DisclaimerBar from "@/components/common/DisclaimerBar";

const BASE_URL = "https://tsumitate-timemachine.com";

// fundSlug → fundId マッピング
const SLUG_TO_FUND_ID: Record<string, FundId> = {
  orukan:   "orcan",
  sp500:    "sp500",
  nasdaq100: "nasdaq100",
};

const GUIDE_LABELS: Record<string, string> = {
  "nisa-beginner":              "新NISAおすすめ",
  "index-investing":            "インデックス投資とは",
  "how-to-start":               "積立投資の始め方",
  "dollar-cost-averaging":      "ドルコスト平均法",
  "retirement-investing":       "老後資金の積立",
  "orukan-yameta-houga-ii":     "オルカンはやめたほうがいい？",
  "sp500-booraku-taisho":       "S&P500暴落リスクと対応",
  "orukan-ippon-de-ii":         "オルカン一本でいい？",
  "nisa-tsumitate-ikura":       "NISAは月いくら積立？",
  "nisa-wariate-osusume":       "NISAの割合・配分",
  "tsumitate-nansnen-keizoku":  "積立は何年続けるべき？",
  "index-shippai-pattern":      "インデックス投資の失敗パターン",
  "tsumitate-vs-ikkatu":        "積立vs一括投資",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GUIDE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuidePage(slug);
  if (!page) return {};
  return {
    title: `${page.metaTitle} | 積立タイムマシン`,
    description: page.metaDescription,
    alternates: { canonical: `${BASE_URL}/guide/${slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${BASE_URL}/guide/${slug}`,
      type: "article",
      siteName: "積立タイムマシン",
      locale: "ja_JP",
      images: [
        {
          url: `${BASE_URL}/api/og?static=1`,
          width: 1200,
          height: 630,
          alt: page.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [`${BASE_URL}/api/og?static=1`],
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const page = getGuidePage(slug);
  if (!page) notFound();

  // シミュレーション行の計算
  const simResults = page.simRows.map((row) => {
    const fundId = SLUG_TO_FUND_ID[row.fundSlug];
    const result = simulate({
      fundId,
      startYear: row.year,
      startMonth: row.month,
      monthlyAmount: row.amount,
    });
    return { row, result, fund: FUNDS[fundId] };
  });

  // 関連ガイドのラベル取得
  const relatedGuideItems = page.relatedGuides.map((s) => ({
    slug: s,
    label: GUIDE_LABELS[s] ?? s,
  }));

  // JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム",         item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "投資ガイド",     item: `${BASE_URL}/guide` },
      { "@type": "ListItem", position: 3, name: GUIDE_LABELS[slug] ?? slug, item: `${BASE_URL}/guide/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-dvh bg-zinc-950 text-zinc-50">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-16 space-y-10">

          {/* パンくず */}
          <nav className="flex items-center gap-1 text-xs text-zinc-500 flex-wrap">
            <Link href="/" className="hover:text-zinc-300 transition-colors">ホーム</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-zinc-500">投資ガイド</span>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-zinc-400">{GUIDE_LABELS[slug]}</span>
          </nav>

          {/* ── H1 ────────────────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <BookOpen className="h-6 w-6 flex-shrink-0 text-indigo-400 mt-0.5" />
              <h1
                className="text-2xl font-black text-white leading-tight"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                {page.h1}
              </h1>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{page.intro}</p>
          </section>

          {/* ── 要点3つ ──────────────────────────────────────── */}
          <section className="space-y-4">
            <h2
              className="text-base font-bold text-white"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              この記事のポイント
            </h2>
            {page.points.map((pt, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-indigo-400 mt-0.5" />
                  <p className="text-sm font-bold text-white">{pt.title}</p>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed pl-6">{pt.body}</p>
              </div>
            ))}
          </section>

          {/* ── E-E-A-T 編集部情報 ───────────────────────────── */}
          {page.lastUpdated && <GuideEeat lastUpdated={page.lastUpdated} />}

          {/* ── 目次 ────────────────────────────────────────── */}
          {page.sections && page.sections.length > 0 && (
            <nav className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2">
              <p className="text-xs font-bold text-zinc-300">目次</p>
              <ol className="space-y-1.5">
                {page.sections.map((sec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-indigo-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <a
                      href={`#section-${i}`}
                      className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors leading-snug"
                    >
                      {sec.h2}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* ── 本文セクション（H2・H3） ─────────────────────── */}
          {page.sections?.map((sec, i) => {
            const simEntry = sec.simCallout !== undefined ? simResults[sec.simCallout] : undefined;
            return (
              <section key={i} id={`section-${i}`} className="space-y-4">
                <h2
                  className="text-base font-bold text-white"
                  style={{ fontFamily: "var(--font-serif-jp), serif" }}
                >
                  {sec.h2}
                </h2>
                <GuideBodyText body={sec.body} />
                {sec.subsections?.map((sub, j) => (
                  <div key={j} className="pl-4 border-l-2 border-indigo-500/30 space-y-1.5">
                    <h3 className="text-sm font-bold text-zinc-200">{sub.h3}</h3>
                    <GuideBodyText body={sub.body} />
                  </div>
                ))}
                {/* シミュレーション実績カード */}
                {simEntry && (() => {
                  const { row, result, fund } = simEntry;
                  const isProfit = result.profit >= 0;
                  return (
                    <Link
                      href={`/${row.fundSlug}/${row.year}`}
                      className="block rounded-xl border border-white/[0.08] overflow-hidden hover:bg-white/[0.04] transition-colors"
                      style={{ background: `${fund.color}08` }}
                    >
                      <div className="px-4 py-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] font-black px-2 py-0.5 rounded"
                            style={{ background: `${fund.color}20`, color: fund.color }}
                          >
                            {fund.shortName}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {formatYearMonth(row.year, row.month)}〜2025年6月
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500">
                          月{row.amount >= 10000 ? `${row.amount / 10000}万円` : `${row.amount}円`}積立・積立タイムマシン実績データ
                        </p>
                        <div className="flex items-baseline gap-3">
                          <div>
                            <span className="text-[10px] text-zinc-500">利益</span>
                            <span
                              className="ml-1 text-lg font-black font-number"
                              style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                            >
                              {isProfit ? "+" : ""}{formatCurrency(result.profit)}
                            </span>
                            <span
                              className="ml-1 text-xs font-bold font-number"
                              style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                            >
                              （{isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%）
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-zinc-500">
                          <span>元本 <span className="font-bold text-zinc-300">{formatCurrency(result.totalPrincipal)}</span></span>
                          <span>評価額 <span className="font-bold text-zinc-300">{formatCurrency(result.finalValue)}</span></span>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-end">
                        <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                          詳細を見る <ArrowRight className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })()}
                {/* 一次情報ソースリンク */}
                {sec.sourceLinks && sec.sourceLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sec.sourceLinks.map((sl, k) => (
                      <a
                        key={k}
                        href={sl.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 bg-white/[0.03] border border-white/[0.07] rounded px-2 py-1 transition-colors"
                      >
                        <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
                        {sl.label}
                      </a>
                    ))}
                  </div>
                )}
                {/* 中間CTA（2番目のセクション後） */}
                {i === 1 && (
                  <div className="rounded-xl bg-indigo-500/[0.08] border border-indigo-500/20 p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-indigo-300">実際の数字をシミュレーションしてみる</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">自分の積立開始年・金額で試せます</p>
                    </div>
                    <Link
                      href="/"
                      className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-indigo-400 border border-indigo-500/30 rounded-lg px-3 py-1.5 hover:bg-indigo-500/10 transition-colors"
                    >
                      <BarChart2 className="h-3 w-3" />
                      試す
                    </Link>
                  </div>
                )}
              </section>
            );
          })}

          {/* ── シミュレーション結果 ─────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              実際の積立シミュレーション
            </h2>
            <div className="space-y-3">
              {simResults.map(({ row, result, fund }) => {
                const isProfit = result.profit >= 0;
                return (
                  <Link
                    key={`${row.fundSlug}-${row.year}-${row.amount}`}
                    href={`/${row.fundSlug}/${row.year}`}
                    className="block rounded-xl border border-white/[0.08] overflow-hidden hover:bg-white/[0.04] transition-colors"
                    style={{ background: `${fund.color}08` }}
                  >
                    <div className="px-4 py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[10px] font-black px-2 py-0.5 rounded"
                          style={{ background: `${fund.color}20`, color: fund.color }}
                        >
                          {fund.shortName}
                        </span>
                        <span className="text-[10px] text-zinc-500">{row.label.split(" ").slice(0, 2).join(" ")}</span>
                      </div>
                      <p className="text-xs text-zinc-400">{row.label}</p>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span
                            className="text-2xl font-black font-number"
                            style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                          >
                            {isProfit ? "+" : ""}{formatCurrency(result.profit)}
                          </span>
                          <span
                            className="text-sm font-bold font-number ml-2"
                            style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                          >
                            {isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-zinc-500">元本</p>
                          <p className="text-xs font-bold text-zinc-300">{formatCurrency(result.totalPrincipal)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500">評価額 {formatCurrency(result.finalValue)}</span>
                      <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                        詳細を見る <ArrowRight className="h-2.5 w-2.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 銘柄カード ──────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              おすすめ銘柄を詳しく見る
            </h2>
            <div className="space-y-3">
              {page.fundCards.map((card, i) => {
                const fundId = SLUG_TO_FUND_ID[card.fundSlug];
                const fund = FUNDS[fundId];
                const enc = fund.encyclopedia;
                const r = simulate({
                  fundId,
                  startYear: 2020,
                  startMonth: 1,
                  monthlyAmount: card.monthlyAmount,
                });
                const compareInfo = card.compareSlug
                  ? COMPARE_PAGES.find((p) => p.slug === card.compareSlug)
                  : undefined;
                const amtLabel =
                  card.monthlyAmount >= 10000
                    ? `月${card.monthlyAmount / 10000}万円`
                    : `月${card.monthlyAmount}円`;
                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/[0.08] overflow-hidden"
                    style={{ background: `${fund.color}08` }}
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-xs font-black px-2 py-0.5 rounded"
                          style={{ background: `${fund.color}25`, color: fund.color }}
                        >
                          {fund.shortName}
                        </span>
                        <span className="text-[10px] text-zinc-500">{enc.managementFee}</span>
                      </div>
                      <p className="text-sm font-bold text-white">{enc.catchCopy}</p>
                      <p className="text-[10px] text-zinc-500">2020年から{amtLabel}積立の場合</p>
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-xl font-black font-number"
                          style={{ color: r.profit >= 0 ? "#10b981" : "#ef4444" }}
                        >
                          {r.profit >= 0 ? "+" : ""}{formatCurrency(r.profit)}
                        </span>
                        <span
                          className="text-sm font-bold font-number"
                          style={{ color: r.profit >= 0 ? "#10b981" : "#ef4444" }}
                        >
                          {r.profit >= 0 ? "+" : ""}{r.returnRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-white/[0.06] grid grid-cols-2 divide-x divide-white/[0.06]">
                      <Link
                        href={`/fund/${card.fundSlug}`}
                        className="px-4 py-2.5 flex items-center justify-center gap-1 text-xs font-bold text-zinc-300 hover:bg-white/[0.06] transition-colors"
                      >
                        {enc.nickname}とは？
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                      <Link
                        href={`/${card.fundSlug}/monthly/${card.monthlyAmount}`}
                        className="px-4 py-2.5 flex items-center justify-center gap-1 text-xs font-bold text-indigo-400 hover:bg-white/[0.06] transition-colors"
                      >
                        {amtLabel}積立を見る
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                    {compareInfo && (
                      <div className="border-t border-white/[0.06] px-4 py-2">
                        <Link
                          href={`/compare/${compareInfo.slug}`}
                          className="flex items-center justify-end gap-1 text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {compareInfo.relatedDescription}
                          <ArrowRight className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── よくある質問 ─────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-5"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              よくある質問
            </h2>
            <div className="space-y-4">
              {page.faqs.map((faq, i) => (
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

          {/* ── こんな人におすすめ ──────────────────────────── */}
          {page.recommendFor && page.recommendFor.length > 0 && (
            <section className="space-y-3">
              <h2
                className="text-base font-bold text-white"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                こんな人におすすめ
              </h2>
              <div className="rounded-xl bg-indigo-500/[0.06] border border-indigo-500/20 p-4 space-y-2.5">
                {page.recommendFor.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 text-sm flex-shrink-0 mt-0.5">✓</span>
                    <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── よくある失敗 ─────────────────────────────────── */}
          {page.commonMistakes && page.commonMistakes.length > 0 && (
            <section className="space-y-3">
              <h2
                className="text-base font-bold text-white"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                よくある失敗パターン
              </h2>
              <div className="space-y-3">
                {page.commonMistakes.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-amber-500/[0.05] border border-amber-500/20 p-4 space-y-1.5"
                  >
                    <p className="text-sm font-bold text-amber-300">⚠ {m.label}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">{m.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── 関連ガイド ───────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              関連する投資ガイド
            </h2>
            <div className="space-y-2">
              {relatedGuideItems.map(({ slug: gs, label }) => (
                <Link
                  key={gs}
                  href={`/guide/${gs}`}
                  className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                    <span className="text-sm text-zinc-300">{label}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          {/* ── CTA ────────────────────────────────────────── */}
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
            <Link
              href="/"
              className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              積立タイムマシンで試す
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* ── 人気ページ ───────────────────────────────────── */}
          <section className="space-y-3">
            <h2
              className="text-sm font-bold text-zinc-400"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              人気ページ
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "オルカンとは？",           href: "/fund/orukan" },
                { label: "S&P500とは？",             href: "/fund/sp500" },
                { label: "オルカン vs S&P500",       href: "/compare/orukan-vs-sp500" },
                { label: "2020年からオルカン",        href: "/orukan/2020" },
                { label: "2020年からS&P500",          href: "/sp500/2020" },
                { label: "月3万円オルカン積立",       href: "/orukan/monthly/30000" },
                { label: "積立開始年ランキング",      href: "/from/2020" },
              ].map(({ label: lbl, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 hover:bg-white/[0.06] transition-colors"
                >
                  <span className="text-sm text-zinc-300">{lbl}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
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
