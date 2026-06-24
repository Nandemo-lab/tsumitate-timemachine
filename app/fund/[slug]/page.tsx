import { notFound } from "next/navigation";
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
import SiteFooter from "@/components/layout/SiteFooter";

const BASE_URL = "https://tsumitate-timemachine.vercel.app";

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
  return {
    title: `${page.metaTitle} | 積立タイムマシン`,
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
          url: `${BASE_URL}/api/og?fund=${page.fundId}&year=${page.simYear}&amount=${page.simAmount}`,
          width: 1200,
          height: 630,
          alt: `${fund.shortName} 積立シミュレーション`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [
        `${BASE_URL}/api/og?fund=${page.fundId}&year=${page.simYear}&amount=${page.simAmount}`,
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

const RISK_LABELS: Record<number, string> = {
  1: "超安定（★☆☆☆☆）",
  2: "安定（★★☆☆☆）",
  3: "標準（★★★☆☆）",
  4: "高リスク（★★★★☆）",
  5: "超高リスク（★★★★★）",
};

export default async function FundPage({ params }: Props) {
  const { slug } = await params;
  const page = getFundPage(slug);
  if (!page) notFound();

  const fund = FUNDS[page.fundId];
  const enc = fund.encyclopedia;

  const result = simulate({
    fundId: page.fundId,
    startYear: page.simYear,
    startMonth: page.simMonth,
    monthlyAmount: page.simAmount,
  });

  const isProfit = result.profit >= 0;
  const totalPrincipal = result.totalPrincipal;

  // 関連比較ページ
  const relatedCompares = page.relatedCompareSlugs
    .map((s) => getComparePage(s))
    .filter(Boolean) as ReturnType<typeof getComparePage>[];

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

      <div className="min-h-dvh bg-zinc-950 text-zinc-50">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-16 space-y-10">

          {/* パンくず */}
          <nav className="flex items-center gap-1 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 transition-colors">ホーム</Link>
            <ChevronRight className="h-3 w-3" />
            <span>銘柄解説</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-400">{enc.nickname}</span>
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
                <p className="text-xs text-zinc-400 font-medium">{enc.formalName}</p>
                <h1
                  className="text-2xl font-black text-white leading-tight"
                  style={{ fontFamily: "var(--font-serif-jp), serif" }}
                >
                  {page.metaTitle.split("｜")[0] ?? `${enc.nickname}とは？`}
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

          {/* ── 基本情報テーブル ────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {enc.nickname}の基本情報
            </h2>
            <div className="rounded-xl border border-white/[0.08] overflow-hidden">
              {[
                { label: "投資対象", value: fund.description },
                { label: "信託報酬", value: enc.managementFee },
                {
                  label: "NISA対応",
                  value: (
                    <NisaLabel
                      tsumitate={enc.nisaSupport.tsumitate}
                      growth={enc.nisaSupport.growth}
                    />
                  ),
                },
                { label: "ボラティリティ", value: enc.volatility },
                { label: "リスクレベル", value: RISK_LABELS[fund.riskLevel] },
                { label: "推奨投資期間", value: enc.expectedHorizon },
              ].map(({ label, value }, i) => (
                <div
                  key={label}
                  className={`grid grid-cols-2 px-4 py-3 gap-4 ${
                    i % 2 === 0 ? "bg-white/[0.02]" : ""
                  }`}
                >
                  <span className="text-xs text-zinc-500 self-center font-medium">
                    {label}
                  </span>
                  <span className="text-xs text-zinc-300 self-center">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── メリット ────────────────────────────────────────── */}
          <section className="space-y-3">
            <h2
              className="text-base font-bold text-white"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {enc.nickname}のメリット
            </h2>
            <div className="space-y-2">
              {enc.pros.map((p) => (
                <div
                  key={p}
                  className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3"
                >
                  <CheckCircle2
                    className="h-4 w-4 flex-shrink-0 mt-0.5"
                    style={{ color: fund.color }}
                  />
                  <p className="text-sm text-zinc-300">{p}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── デメリット ──────────────────────────────────────── */}
          <section className="space-y-3">
            <h2
              className="text-base font-bold text-white"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {enc.nickname}のデメリット・注意点
            </h2>
            <div className="space-y-2">
              {enc.cons.map((c) => (
                <div
                  key={c}
                  className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-zinc-300">{c}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── シミュレーション ─────────────────────────────────── */}
          <section
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: `${fund.color}10`,
              border: `1px solid ${fund.color}30`,
            }}
          >
            <div>
              <p className="text-xs font-black tracking-widest uppercase text-zinc-400 mb-1">
                もし{page.simYear}年から積み立てていたら？
              </p>
              <p className="text-xs text-zinc-500">
                月{(page.simAmount / 10000).toFixed(0)}万円 / {page.simYear}年{page.simMonth}月スタート
              </p>
            </div>

            {/* 結果 */}
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 mb-0.5">利益</p>
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
                  <p className="text-[10px] text-zinc-400 mb-0.5">現在資産</p>
                  <p className="text-sm font-bold text-zinc-300">
                    {formatCurrency(result.finalValue)}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    元本 {formatCurrency(totalPrincipal)}
                  </p>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="h-2 rounded-full bg-white/8 overflow-hidden">
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
                  <p className="text-[9px] text-zinc-500 mb-0.5">積立期間</p>
                  <p className="text-xs font-bold text-zinc-300">
                    {Math.floor(result.monthsElapsed / 12)}年{result.monthsElapsed % 12}ヶ月
                  </p>
                </div>
                <div className="text-center border-x border-white/[0.07]">
                  <p className="text-[9px] text-zinc-500 mb-0.5">評価額</p>
                  <p className="text-xs font-bold text-zinc-300">
                    {formatCurrency(result.finalValue)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-zinc-500 mb-0.5">リターン</p>
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
              className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: fund.color }}
            >
              自分の条件でシミュレーション
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* ── こんな人におすすめ ───────────────────────────────── */}
          <section className="space-y-3">
            <h2
              className="text-base font-bold text-white"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              こんな人におすすめ
            </h2>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-4 space-y-2">
              {enc.forWhom.split("・").map((w) => (
                <div key={w} className="flex items-center gap-2.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: fund.color }}
                  />
                  <p className="text-sm text-zinc-300">{w}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── よくある質問 ─────────────────────────────────────── */}
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

          {/* ── 関連する比較ページ ───────────────────────────────── */}
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
                  if (!cp) return null;
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                      <p className="text-sm font-bold text-white">{relFund.shortName}</p>
                      <p className="text-[10px] text-zinc-500">{relFund.encyclopedia.nickname}とは？</p>
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
                {enc.nickname}でシミュレーション
              </h2>
            </div>
            <p className="text-sm text-zinc-400">
              積立開始年・月額を変えて、あなたの「たられば」を計算できます。
            </p>
            <Link
              href={`/simulate/${page.fundId}/2020`}
              className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: fund.color }}
            >
              {enc.nickname}でシミュレーション開始
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

        </div>
        <SiteFooter />
      </div>
    </>
  );
}
