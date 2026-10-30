import { notFound } from "next/navigation";
import GuideBodyText from "@/components/guide/GuideBodyText";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { getFundPage, FUND_PAGES } from "@/lib/fund-seo-pages";
import { getComparePage } from "@/lib/compare-pages";
import { FUNDS } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
import { YEAR_PAGES } from "@/lib/year-pages";
import SiteFooter from "@/components/layout/SiteFooter";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { PageVisualStory } from "@/components/visual/VisualStory";
import ReturnQualityPill from "@/components/common/ReturnQualityPill";
import PageRoleGuide from "@/components/common/PageRoleGuide";
import { getReturnSeriesDefinition } from "@/lib/return-series";

const BASE_URL = "https://tsumitate-timemachine.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return FUND_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getFundPage(slug);
  if (!page) return {};
  const fund = FUNDS[page.fundId];
  const ogUrl = getReturnSeriesDefinition(page.fundId).quality === "A"
    ? `${BASE_URL}/api/og?fund=${page.fundId}&year=${page.simYear}&amount=${page.simAmount}`
    : `${BASE_URL}/api/og?static=1`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `${BASE_URL}/fund/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${BASE_URL}/fund/${page.slug}`,
      type: "article",
      siteName: "積立タイムマシン",
      locale: "ja_JP",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: getReturnSeriesDefinition(page.fundId).quality === "A"
            ? `${fund.shortName} 積立シミュレーション`
            : `${fund.shortName} 商品情報・データ品質`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [
        ogUrl,
      ],
    },
  };
}

function NisaLabel({
  tsumitate,
  growth,
}: {
  tsumitate: boolean;
  growth: boolean;
}) {
  if (tsumitate && growth) return <>つみたて枠・成長投資枠</>;
  if (growth) return <>成長投資枠のみ</>;
  return <>非対応</>;
}

export default async function FundPage({ params }: Props) {
  const { slug } = await params;
  const page = getFundPage(slug);
  if (!page) notFound();

  const fund = FUNDS[page.fundId];
  const enc = fund.encyclopedia;

  const isVerifiedSeries = getReturnSeriesDefinition(page.fundId).quality === "A";
  const result = isVerifiedSeries ? simulate({
    fundId: page.fundId,
    startYear: page.simYear,
    startMonth: page.simMonth,
    monthlyAmount: page.simAmount,
  }) : null;

  const isProfit = (result?.profit ?? 0) >= 0;
  const totalPrincipal = result?.totalPrincipal ?? 0;

  // 関連比較ページ
  const relatedCompares = page.relatedCompareSlugs
    .map((s) => getComparePage(s))
    .filter(Boolean) as ReturnType<typeof getComparePage>[];

  // この銘柄の年別たらればページ
  const fundYearPages = YEAR_PAGES.filter((yp) => yp.fundId === page.fundId);

  // 関連銘柄ページ
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
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "銘柄解説", item: `${BASE_URL}/fund` },
      {
        "@type": "ListItem",
        position: 3,
        name: enc.nickname,
        item: `${BASE_URL}/fund/${slug}`,
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

      <div className="min-h-dvh bg-[#FAFAF7] text-[#263A53]">
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 space-y-10">

          {/* パンくず */}
          <nav className="flex items-center gap-1 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-700 transition-colors">ホーム</Link>
            <ChevronRight className="h-3 w-3" />
            <span>銘柄解説</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600">{enc.nickname}</span>
          </nav>

          {/* ── ファーストビュー ─────────────────────────────────── */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${fund.color}20` }}
              >
                <BookOpen className="h-6 w-6" style={{ color: fund.color }} />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-medium">{enc.formalName}</p>
                <h1
                  className="text-2xl font-black text-[#263A53] leading-tight"
                  style={{ fontFamily: "var(--font-serif-jp), serif" }}
                >
                  {page.h1 ?? page.metaTitle}
                </h1>
              </div>
            </div>

            {/* キャッチコピー */}
            <p
              className="text-sm font-bold leading-relaxed"
              style={{ color: fund.color }}
            >
              {enc.catchCopy}
            </p>

            {/* 特徴タグ */}
            <div className="flex flex-wrap gap-1.5">
              <ReturnQualityPill fundId={page.fundId} />
              {enc.features.map((f) => (
                <span
                  key={f}
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                  style={{ background: `${fund.color}20`, color: fund.color }}
                >
                  {f}
                </span>
              ))}
            </div>
          </section>

          <PageVisualStory kind="fund" />

          <PageRoleGuide
            label={page.fundId === "fangplus" ? "商品情報と積立結果を一つのページで確認する" : "正式商品・費用・データ品質を確認する資料"}
            description={page.fundId === "fangplus"
              ? "正式商品、設定日、費用、データ品質を確認し、このページの検証済み結果から条件変更シミュレーターへ進めます。"
              : "商品の設定日、投資対象、費用、NISA区分、検証できる実績期間と一次情報を確認します。積立条件を変える操作はシミュレーション入口に分けています。"}
            counterpartHref={page.fundId === "schd" ? "/compare/schd-vs-vym" : page.fundId === "vym" ? undefined : page.fundId === "fangplus" ? `/simulate/fangplus/${page.simYear}` : `/${page.fundId === "orcan" ? "orukan" : page.fundId}`}
            counterpartLabel={page.fundId === "schd" ? "SCHDとVYMの商品属性を比較する" : page.fundId === "vym" ? undefined : `${enc.nickname}の積立条件を変えて試す`}
          />

          {/* ── 基本情報テーブル ────────────────────────────────── */}
          {page.contextualComparison && <GuideBodyText body={page.contextualComparison} />}
          <section>
            <h2
              className="text-base font-bold text-[#263A53] mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {enc.nickname}の基本情報・信託報酬・NISA対応
            </h2>
            <div className="rounded-xl border border-[#D9E3E8] overflow-hidden">
              {[
                { label: "投資対象", value: fund.description },
                { label: page.fundId === "schd" ? "経費率" : "信託報酬・経費率", value: enc.managementFee },
                {
                  label: "NISA対応",
                  value: (
                    <NisaLabel
                      tsumitate={enc.nisaSupport.tsumitate}
                      growth={enc.nisaSupport.growth}
                    />
                  ),
                },
              ].filter(({ value }) => value !== null).map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`grid grid-cols-2 px-4 py-3 gap-4 ${
                    i % 2 === 0 ? "bg-white" : ""
                  }`}
                >
                  <span className="text-xs text-slate-500 self-center font-medium">
                    {label}
                  </span>
                  <span className="text-xs text-slate-700 self-center">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── メリット ────────────────────────────────────────── */}
          <section className="space-y-3">
            <h2
              className="text-base font-bold text-[#263A53]"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {enc.nickname}の商品設計・確認できる特徴
            </h2>
            <div className="space-y-2">
              {enc.pros.map((p) => (
                <div
                  key={p}
                  className="flex items-start gap-3 rounded-xl bg-white border border-[#E1E8EC] px-4 py-3"
                >
                  <CheckCircle2
                    className="h-4 w-4 flex-shrink-0 mt-0.5"
                    style={{ color: fund.color }}
                  />
                  <p className="text-sm text-slate-700">{p}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── デメリット ──────────────────────────────────────── */}
          <section className="space-y-3">
            <h2
              className="text-base font-bold text-[#263A53]"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {page.fundId === "fangplus" ? `${enc.nickname}を確認するときの注意点` : `${enc.nickname}のリスク・デメリット・注意点`}
            </h2>
            <div className="space-y-2">
              {enc.cons.map((c) => (
                <div
                  key={c}
                  className="flex items-start gap-3 rounded-xl bg-white border border-[#E1E8EC] px-4 py-3"
                >
                  <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{c}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── シミュレーション ─────────────────────────────────── */}
          {result ? <section
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: `${fund.color}10`,
              border: `1px solid ${fund.color}30`,
            }}
          >
            <ReturnQualityPill fundId={page.fundId} />
            <div>
              <p className="text-xs font-black tracking-widest uppercase text-slate-600 mb-1">
                もし{page.simYear}年から積み立てていたら？
              </p>
              <p className="text-xs text-slate-500">
                月{(page.simAmount / 10000).toFixed(0)}万円 / {page.simYear}年{page.simMonth}月スタート
              </p>
            </div>

            {/* 結果 */}
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-slate-600 mb-0.5">利益</p>
                  <div className="flex items-baseline gap-1.5">
                    <p
                      className="font-heading font-number text-3xl font-bold"
                      style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                    >
                      {isProfit ? "+" : ""}{formatCurrency(result.profit)}
                    </p>
                    <span
                      className="font-number text-sm font-bold"
                      style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                    >
                      （{isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%）
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-600 mb-0.5">期間末評価額</p>
                  <p className="text-sm font-bold text-slate-700">
                    {formatCurrency(result.finalValue)}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    元本 {formatCurrency(totalPrincipal)}
                  </p>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="h-2 rounded-full bg-[#EAF3F7] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    background: fund.color,
                    width: `${Math.min(100, Math.max(0, (result.finalValue / (totalPrincipal * 2)) * 100))}%`,
                  }}
                />
              </div>

              {/* 3カラム */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="text-center">
                  <p className="text-[9px] text-slate-500 mb-0.5">積立期間</p>
                  <p className="text-xs font-bold text-slate-700">
                    {Math.floor(result.monthsElapsed / 12)}年{result.monthsElapsed % 12}ヶ月
                  </p>
                </div>
                <div className="text-center border-x border-[#DDE6EA]">
                  <p className="text-[9px] text-slate-500 mb-0.5">評価額</p>
                  <p className="text-xs font-bold text-slate-700">
                    {formatCurrency(result.finalValue)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-slate-500 mb-0.5">リターン</p>
                  <p
                    className="text-xs font-bold"
                    style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                  >
                    {isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/simulate/${page.fundId}/${page.simYear}`}
              className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-[#263A53] transition-opacity hover:opacity-90"
              style={{ background: fund.color }}
            >
              自分の条件でシミュレーション
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section> : (
            <section className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-5 space-y-3">
              <ReturnQualityPill fundId={page.fundId} />
              <h2 className="text-base font-bold text-[#263A53]">参考系列のため積立評価額は掲載していません</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                SCHDの月次系列はG品質・原典未検証です。このページでは正式商品、指数設計、分配方針、費用など確認できる商品属性を掲載し、未検証系列から計算した評価額・利益・推移グラフは表示しません。
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href="/about/data-sources" className="inline-flex items-center justify-center gap-1 rounded-xl border border-amber-400/25 px-4 py-2.5 text-xs font-bold text-amber-200">
                  データ品質の基準を見る<ArrowRight className="h-3 w-3" />
                </Link>
                <Link href="/compare/schd-vs-vym" className="inline-flex items-center justify-center gap-1 rounded-xl border border-[#D2DEE4] px-4 py-2.5 text-xs font-bold text-slate-700">
                  商品属性を比較する<ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </section>
          )}

          {/* ── 商品選択時の確認事項 ─────────────────────────────── */}
          {enc.forWhom && <section className="space-y-3">
            <h2
              className="text-base font-bold text-[#263A53]"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              商品選択時の確認ポイント
            </h2>
            <div className="rounded-xl bg-white border border-[#DDE6EA] px-4 py-4 space-y-2">
              {enc.forWhom.split("・").map((w) => (
                <div key={w} className="flex items-center gap-2.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: fund.color }}
                  />
                  <p className="text-sm text-slate-700">{w}</p>
                </div>
              ))}
            </div>
          </section>}

          {/* ── よくある質問 ─────────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-[#263A53] mb-5"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {enc.nickname}に関するよくある質問
            </h2>
            <div className="space-y-4">
              {page.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white border border-[#DDE6EA] p-4 space-y-2"
                >
                  <p className="text-sm font-bold text-[#263A53]">Q. {faq.q}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">A. {faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 関連する比較ページ ───────────────────────────────── */}
          {relatedCompares.length > 0 && (
            <section>
              <h2
                className="text-base font-bold text-[#263A53] mb-4"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                {enc.nickname}の比較記事
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {relatedCompares.map((cp) => {
                  if (!cp) return null;
                  const fA = FUNDS[cp.fundAId];
                  const fB = FUNDS[cp.fundBId];
                  return (
                    <Link
                      key={cp.slug}
                      href={`/compare/${cp.slug}`}
                      className="flex flex-col gap-1 rounded-xl bg-[#F7FAFB] border border-[#D9E3E8] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold text-[#263A53]">
                        <span style={{ color: fA.color }}>{fA.shortName}</span>
                        <span className="text-slate-500 text-xs">vs</span>
                        <span style={{ color: fB.color }}>{fB.shortName}</span>
                      </span>
                      <span className="text-xs text-slate-500">{cp.relatedDescription}</span>
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
                className="text-base font-bold text-[#263A53] mb-4"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                関連する銘柄解説
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedFunds.map(({ slug: fSlug, fund: relFund }) => (
                  <Link
                    key={fSlug}
                    href={`/fund/${fSlug}`}
                    className="flex items-center gap-3 rounded-xl bg-[#F7FAFB] border border-[#D9E3E8] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                  >
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ background: relFund.color }}
                    />
                    <div>
                      <p className="text-sm font-bold text-[#263A53]">{relFund.shortName}</p>
                      <p className="text-[10px] text-slate-500">{relFund.encyclopedia.nickname}とは？</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-500 ml-auto" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── 年別たられば ─────────────────────────────────────── */}
          {fundYearPages.length > 0 && (
            <section>
              <h2
                className="text-base font-bold text-[#263A53] mb-4"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                {enc.nickname}のたられば：年別シミュレーション
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {fundYearPages.map((yp) => {
                  const r = simulate({
                    fundId: yp.fundId,
                    startYear: yp.year,
                    startMonth: yp.simMonth,
                    monthlyAmount: yp.simAmount,
                  });
                  return (
                    <Link
                      key={yp.year}
                      href={`/${yp.fundSlug}/${yp.year}`}
                      className="flex items-center justify-between rounded-xl bg-[#F7FAFB] border border-[#D9E3E8] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                          style={{ background: `${fund.color}20`, color: fund.color }}
                        >
                          {yp.year}年〜
                        </span>
                        <span className="text-sm text-slate-700">
                          {yp.year}年から積み立てていたら？
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold font-number flex-shrink-0"
                        style={{ color: r.profit >= 0 ? "#10b981" : "#ef4444" }}
                      >
                        {r.profit >= 0 ? "+" : ""}{r.returnRate.toFixed(1)}%
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── CTA ─────────────────────────────────────────────── */}
          {isVerifiedSeries && <section className="rounded-2xl bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/20 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-700" />
              <h2
                className="text-base font-bold text-[#263A53]"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                {enc.nickname}でシミュレーション
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              積立開始年・月額を変えて、あなたの「たられば」を計算できます。
            </p>
            <Link
              href={`/simulate/${page.fundId}/2020`}
              className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-sm text-[#263A53] transition-opacity hover:opacity-90"
              style={{ background: fund.color }}
            >
              {enc.nickname}でシミュレーション開始
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>}

          <DisclaimerBar />
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
