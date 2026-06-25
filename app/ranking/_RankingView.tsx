import Link from "next/link";
import {
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Trophy,
  BookOpen,
} from "lucide-react";
import { RankingPageData, RANKING_LABELS } from "@/lib/ranking-pages";
import { COMPARE_PAGES } from "@/lib/compare-pages";
import { FUNDS } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
import SiteFooter from "@/components/layout/SiteFooter";

const BASE_URL = "https://tsumitate-timemachine.vercel.app";

const MEDALS = ["🥇", "🥈", "🥉"];

interface Props {
  page: RankingPageData;
}

export default function RankingView({ page }: Props) {
  const isRoot = page.slug === "";
  const breadcrumbSlug = isRoot ? null : page.slug;

  // fangplus には /fund/fangplus がある
  const FUND_SLUG_MAP: Record<string, string> = {
    orcan:    "orukan",
    sp500:    "sp500",
    nasdaq100:"nasdaq100",
    schd:     "schd",
    vym:      "vym",
    vti:      "vti",
    // vt has no /fund/ page — keep undefined so button is hidden
    fangplus: "fangplus",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム",         item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "ランキング",     item: `${BASE_URL}/ranking` },
      ...(breadcrumbSlug
        ? [{ "@type": "ListItem", position: 3, name: RANKING_LABELS[page.slug], item: `${BASE_URL}/ranking/${page.slug}` }]
        : []),
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-dvh bg-zinc-950 text-zinc-50">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-16 space-y-10">

          {/* パンくず */}
          <nav className="flex items-center gap-1 text-xs text-zinc-500 flex-wrap">
            <Link href="/" className="hover:text-zinc-300 transition-colors">ホーム</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            {isRoot ? (
              <span className="text-zinc-400">ランキング</span>
            ) : (
              <>
                <Link href="/ranking" className="hover:text-zinc-300 transition-colors">ランキング</Link>
                <ChevronRight className="h-3 w-3 flex-shrink-0" />
                <span className="text-zinc-400">{RANKING_LABELS[page.slug]}</span>
              </>
            )}
          </nav>

          {/* ── H1 ────────────────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <Trophy className="h-6 w-6 flex-shrink-0 text-amber-400 mt-0.5" />
              <h1
                className="text-2xl font-black text-white leading-tight"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                {page.h1}
              </h1>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">{page.intro}</p>
          </section>

          {/* ── 評価基準 ─────────────────────────────────────── */}
          <section>
            <h2
              className="text-sm font-bold text-zinc-400 mb-3"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              評価基準
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {page.criteria.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-3 space-y-1"
                >
                  <p className="text-xs font-bold text-amber-400">{c.label}</p>
                  <p className="text-[10px] text-zinc-500 leading-snug">{c.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── ランキング一覧 ────────────────────────────────── */}
          <section className="space-y-4">
            <h2
              className="text-base font-bold text-white"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              ランキング
            </h2>
            {page.funds.map((entry) => {
              const fund = FUNDS[entry.fundId];
              const enc = fund.encyclopedia;
              const result = simulate({
                fundId: entry.fundId,
                startYear: page.simYear,
                startMonth: page.simMonth,
                monthlyAmount: page.simAmount,
              });
              const isProfit = result.profit >= 0;
              const fundPageSlug = entry.fundSlug ?? FUND_SLUG_MAP[entry.fundId];

              return (
                <div
                  key={entry.fundId}
                  className="rounded-2xl border border-white/[0.08] overflow-hidden"
                  style={{ background: `${fund.color}08` }}
                >
                  {/* ランク＋銘柄名ヘッダー */}
                  <div className="px-4 pt-4 pb-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none">{entry.badge}</span>
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-base font-black text-white"
                          style={{ fontFamily: "var(--font-serif-jp), serif" }}
                        >
                          {enc.nickname}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded flex-shrink-0"
                        style={{ background: `${fund.color}25`, color: fund.color }}
                      >
                        {entry.metricValue}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-snug">{entry.highlight}</p>
                  </div>

                  {/* シミュレーション結果 */}
                  <div
                    className="mx-4 mb-3 rounded-xl px-3 py-2.5 space-y-1"
                    style={{ background: `${fund.color}12`, border: `1px solid ${fund.color}25` }}
                  >
                    <p className="text-[9px] text-zinc-500">
                      {page.simYear}年{page.simMonth}月から月{page.simAmount / 10000}万円積立の場合
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-xl font-black font-number"
                        style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                      >
                        {isProfit ? "+" : ""}{formatCurrency(result.profit)}
                      </span>
                      <span
                        className="text-sm font-bold font-number"
                        style={{ color: isProfit ? "#10b981" : "#ef4444" }}
                      >
                        {isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-zinc-500 ml-auto">
                        評価額 {formatCurrency(result.finalValue)}
                      </span>
                    </div>
                  </div>

                  {/* メリット・注意点 */}
                  <div className="px-4 pb-3 space-y-2">
                    <div className="space-y-1">
                      {entry.pros.map((p) => (
                        <div key={p} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 text-xs mt-0.5 flex-shrink-0">✓</span>
                          <p className="text-xs text-zinc-300">{p}</p>
                        </div>
                      ))}
                    </div>
                    {entry.cons.map((c) => (
                      <div key={c} className="flex items-start gap-1.5">
                        <span className="text-amber-400 text-xs mt-0.5 flex-shrink-0">!</span>
                        <p className="text-xs text-zinc-500">{c}</p>
                      </div>
                    ))}
                  </div>

                  {/* リンク行 */}
                  <div className={`border-t border-white/[0.06] ${fundPageSlug ? "grid grid-cols-2 divide-x divide-white/[0.06]" : "flex"}`}>
                    {fundPageSlug && (
                      <Link
                        href={`/fund/${fundPageSlug}`}
                        className="px-3 py-2.5 flex items-center justify-center gap-1 text-xs font-bold text-zinc-300 hover:bg-white/[0.06] transition-colors"
                      >
                        {enc.nickname}とは？
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                    {entry.yearSlug ? (
                      <Link
                        href={`/${entry.yearSlug}/${page.simYear}`}
                        className="flex-1 px-3 py-2.5 flex items-center justify-center gap-1 text-xs font-bold text-indigo-400 hover:bg-white/[0.06] transition-colors"
                      >
                        {page.simYear}年積立を見る
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : fundPageSlug ? (
                      <Link
                        href={`/${fundPageSlug}/monthly/30000`}
                        className="flex-1 px-3 py-2.5 flex items-center justify-center gap-1 text-xs font-bold text-indigo-400 hover:bg-white/[0.06] transition-colors"
                      >
                        月3万円を見る
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ── 関連比較ページ ───────────────────────────────── */}
          {page.relatedCompareSlugs.length > 0 && (
            <section>
              <h2
                className="text-base font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                詳しく比較する
              </h2>
              <div className="space-y-2">
                {page.relatedCompareSlugs.map((cs) => {
                  const cp = COMPARE_PAGES.find((p) => p.slug === cs);
                  if (!cp) return null;
                  const fA = FUNDS[cp.fundAId];
                  const fB = FUNDS[cp.fundBId];
                  return (
                    <Link
                      key={cs}
                      href={`/compare/${cs}`}
                      className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold text-white">
                        <span style={{ color: fA.color }}>{fA.shortName}</span>
                        <span className="text-zinc-500 text-xs">vs</span>
                        <span style={{ color: fB.color }}>{fB.shortName}</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

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

          {/* ── 他のランキング ───────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              他のランキングを見る
            </h2>
            <div className="space-y-2">
              {page.relatedRankingSlugs.map((rs) => {
                const href = rs === "" ? "/ranking" : `/ranking/${rs}`;
                return (
                  <Link
                    key={rs}
                    href={href}
                    className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-sm text-zinc-300">{RANKING_LABELS[rs]}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 関連ガイド ───────────────────────────────────── */}
          <section>
            <h2
              className="text-sm font-bold text-zinc-400 mb-3"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              関連する投資ガイド
            </h2>
            <div className="space-y-2">
              {[
                { label: "新NISAおすすめ銘柄ガイド",     href: "/guide/nisa-beginner" },
                { label: "インデックス投資とは？",        href: "/guide/index-investing" },
                { label: "積立投資の始め方",              href: "/guide/how-to-start" },
                { label: "ドルコスト平均法の効果",        href: "/guide/dollar-cost-averaging" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 hover:bg-white/[0.06] transition-colors"
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
              気になった銘柄の積立開始年・月額を自由に変えて、あなただけの「たられば」を計算できます。
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
            <h2 className="text-sm font-bold text-zinc-400">人気ページ</h2>
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: "オルカンとは？",         href: "/fund/orukan" },
                { label: "S&P500とは？",           href: "/fund/sp500" },
                { label: "オルカン vs S&P500",     href: "/compare/orukan-vs-sp500" },
                { label: "2020年からオルカン",      href: "/orukan/2020" },
                { label: "月3万円オルカン積立",     href: "/orukan/monthly/30000" },
                { label: "積立開始年ランキング",    href: "/from/2020" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 hover:bg-white/[0.06] transition-colors"
                >
                  <span className="text-sm text-zinc-300">{label}</span>
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
