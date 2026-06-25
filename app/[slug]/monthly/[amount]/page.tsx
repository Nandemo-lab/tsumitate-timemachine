import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Wallet,
  Home,
} from "lucide-react";
import { getMonthlyPage, MONTHLY_PAGES, MONTHLY_SIM_YEAR, MONTHLY_SIM_MONTH } from "@/lib/monthly-pages";
import { getComparePage, COMPARE_PAGES } from "@/lib/compare-pages";
import { FUNDS } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
import SiteFooter from "@/components/layout/SiteFooter";

const BASE_URL = "https://tsumitate-timemachine.vercel.app";

interface Props {
  params: Promise<{ slug: string; amount: string }>;
}

export function generateStaticParams() {
  return MONTHLY_PAGES.map((p) => ({
    slug: p.fundSlug,
    amount: String(p.amount),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, amount } = await params;
  const page = getMonthlyPage(slug, amount);
  if (!page) return {};
  const fund = FUNDS[page.fundId];
  return {
    title: `${page.metaTitle} | 積立タイムマシン`,
    description: page.metaDescription,
    alternates: {
      canonical: `${BASE_URL}/${page.fundSlug}/monthly/${page.amount}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${BASE_URL}/${page.fundSlug}/monthly/${page.amount}`,
      type: "article",
      siteName: "積立タイムマシン",
      locale: "ja_JP",
      images: [
        {
          url: `${BASE_URL}/api/og?fund=${page.fundId}&year=${MONTHLY_SIM_YEAR}&amount=${page.amount}`,
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
      images: [
        `${BASE_URL}/api/og?fund=${page.fundId}&year=${MONTHLY_SIM_YEAR}&amount=${page.amount}`,
      ],
    },
  };
}

const amountLabel = (n: number) =>
  n >= 10000 ? `月${n / 10000}万円` : `月${n}円`;

export default async function MonthlyAmountPage({ params }: Props) {
  const { slug, amount } = await params;
  const page = getMonthlyPage(slug, amount);
  if (!page) notFound();

  const fund = FUNDS[page.fundId];
  const enc = fund.encyclopedia;

  const result = simulate({
    fundId: page.fundId,
    startYear: MONTHLY_SIM_YEAR,
    startMonth: MONTHLY_SIM_MONTH,
    monthlyAmount: page.amount,
  });

  const isProfit = result.profit >= 0;
  const years = Math.floor(result.monthsElapsed / 12);
  const months = result.monthsElapsed % 12;
  const label = amountLabel(page.amount);

  // 関連比較ページ
  const relatedCompares = page.relatedCompareSlugs
    .map((s) => getComparePage(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getComparePage>>[];

  // JSON-LD
  const dynamicFaq = {
    q: `${label}${enc.nickname}を積み立てていたらいくらになりましたか？`,
    a: `${MONTHLY_SIM_YEAR}年${MONTHLY_SIM_MONTH}月から${label}を積み立てた場合、元本${formatCurrency(result.totalPrincipal)}に対して現在の評価額は${formatCurrency(result.finalValue)}、利益は${isProfit ? "+" : ""}${formatCurrency(result.profit)}（リターン${result.returnRate.toFixed(1)}%）となっています（積立タイムマシン調べ・最新データ基準）。`,
  };
  const allFaqs = [dynamicFaq, ...page.faqs];

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
        name: page.metaTitle,
        item: `${BASE_URL}/${slug}/monthly/${page.amount}`,
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
            <span className="text-zinc-400">{label}積み立てていたら</span>
          </nav>

          {/* ── H1 ────────────────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 flex-shrink-0" style={{ color: fund.color }} />
              <h1
                className="text-2xl font-black text-white leading-tight"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                {label}{enc.nickname}を<br />積み立てていたら？
              </h1>
            </div>
            <p className="text-sm text-zinc-400">
              {MONTHLY_SIM_YEAR}年{MONTHLY_SIM_MONTH}月スタート / {label} の場合
            </p>
          </section>

          {/* ── メイン結果カード ─────────────────────────────── */}
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

          {/* ── 解説テキスト ─────────────────────────────────── */}
          <section className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-black px-2 py-0.5 rounded"
                style={{ background: `${fund.color}20`, color: fund.color }}
              >
                {label}積立シミュレーション
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {MONTHLY_SIM_YEAR}年{MONTHLY_SIM_MONTH}月から{label}を{enc.nickname}に積み立てた場合、
              現在の評価額は
              <span className="font-bold" style={{ color: isProfit ? "#10b981" : "#ef4444" }}>
                {formatCurrency(result.finalValue)}
              </span>
              、利益は
              <span className="font-bold" style={{ color: isProfit ? "#10b981" : "#ef4444" }}>
                {isProfit ? "+" : ""}{formatCurrency(result.profit)}（{isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%）
              </span>
              になっています。積立期間{years}年{months > 0 ? `${months}ヶ月` : ""}の結果です（積立タイムマシン調べ・最新データ基準）。
            </p>
          </section>

          {/* ── こんな人におすすめ ───────────────────────────── */}
          <section className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-5 space-y-3">
            <h2
              className="text-sm font-bold text-white"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {label}積立はこんな人に向いています
            </h2>
            <ul className="space-y-2">
              {page.amount === 10000 && [
                "投資初心者・まず少額から試したい方",
                "新NISAを始めたばかりで慣れたい方",
                "副業・節約で生み出した余裕資金を活用したい方",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: fund.color }} />
                  {t}
                </li>
              ))}
              {page.amount === 30000 && [
                "月2〜3万円の余裕資金がある会社員・共働き世帯",
                "新NISAのつみたて投資枠を活用したい方",
                "コツコツ長期積立で老後資金を準備したい方",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: fund.color }} />
                  {t}
                </li>
              ))}
              {page.amount === 50000 && [
                "ある程度収入が安定しており余裕資金が多い方",
                "新NISAのつみたて投資枠を半額以上活用したい方",
                "老後資金を本格的に積み上げたい30〜40代の方",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: fund.color }} />
                  {t}
                </li>
              ))}
              {page.amount === 100000 && [
                "新NISAつみたて投資枠（月10万円）を最大活用したい方",
                "世帯収入が高く余裕資金が十分にある方",
                "早期リタイア・セミリタイアを目指している方",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: fund.color }} />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* ── 他の月額でシミュレーション ──────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              他の金額で{enc.nickname}を積み立てていたら？
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {page.otherAmounts.map((a) => {
                const otherResult = simulate({
                  fundId: page.fundId,
                  startYear: MONTHLY_SIM_YEAR,
                  startMonth: MONTHLY_SIM_MONTH,
                  monthlyAmount: a,
                });
                const otherProfit = otherResult.profit >= 0;
                return (
                  <Link
                    key={a}
                    href={`/${slug}/monthly/${a}`}
                    className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ background: `${fund.color}20`, color: fund.color }}
                      >
                        {amountLabel(a)}
                      </span>
                      <span className="text-sm text-zinc-300">
                        {enc.nickname}を積み立てていたら
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className="text-xs font-bold font-number"
                        style={{ color: otherProfit ? "#10b981" : "#ef4444" }}
                      >
                        {otherProfit ? "+" : ""}{otherResult.returnRate.toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        利益 {otherProfit ? "+" : ""}{formatCurrency(otherResult.profit)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 年別ページへのリンク ─────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {enc.nickname}を年別で見る
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {page.yearLinks.map((y) => {
                const yearResult = simulate({
                  fundId: page.fundId,
                  startYear: y,
                  startMonth: 1,
                  monthlyAmount: 30000,
                });
                const yProfit = yearResult.profit >= 0;
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
                        {y}年から{enc.nickname}を積み立てていたら
                      </span>
                    </div>
                    <span
                      className="text-xs font-bold font-number flex-shrink-0"
                      style={{ color: yProfit ? "#10b981" : "#ef4444" }}
                    >
                      {yProfit ? "+" : ""}{yearResult.returnRate.toFixed(1)}%
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 関連比較ページ ───────────────────────────────── */}
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
                href={`/simulate/${page.fundId}/${MONTHLY_SIM_YEAR}`}
                className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-sm text-white transition-opacity hover:opacity-90"
                style={{ background: fund.color }}
              >
                {enc.nickname}でシミュレーション
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                { label: "NASDAQ100とは？",           href: "/fund/nasdaq100" },
                { label: "オルカン vs S&P500",       href: "/compare/orukan-vs-sp500" },
                { label: "S&P500 vs NASDAQ100",       href: "/compare/sp500-vs-nasdaq100" },
                { label: "2020年からオルカン",        href: "/orukan/2020" },
                { label: "2020年からS&P500",          href: "/sp500/2020" },
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

        </div>
        <SiteFooter />
      </div>
    </>
  );
}
