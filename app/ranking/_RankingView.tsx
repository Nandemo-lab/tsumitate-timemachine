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
import { FUNDS, formatExpenseRatio } from "@/lib/funds";
import { FUND_SEO_MAP } from "@/lib/fund-seo";
import { simulate, formatCurrency } from "@/lib/simulation";
import SiteFooter from "@/components/layout/SiteFooter";
import { PageVisualStory } from "@/components/visual/VisualStory";
import { getReturnSeriesDefinition } from "@/lib/return-series";
import { NISA_LIMITS, NISA_SYSTEM_DISCLAIMER, formatManEn } from "@/lib/nisa";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

const BASE_URL = "https://tsumitate-timemachine.com";

// /[fundSlug]/monthly/[amount] ページが実際に生成されている銘柄のみ（lib/monthly-pages.ts の FUND_MONTHLY_CONFIG と一致させる）
const MONTHLY_PAGE_FUND_SLUGS = new Set(["orukan", "sp500", "nasdaq100"]);

interface Props {
  page: RankingPageData;
}

export default function RankingView({ page }: Props) {
  const isRoot = page.slug === "";
  const isNisa = page.slug === "nisa";
  const isHighDividend = page.slug === "high-dividend";
  const breadcrumbSlug = isRoot ? null : page.slug;
  const preparedEntries = page.funds.map((entry) => {
    const verified = getReturnSeriesDefinition(entry.fundId).quality === "A";
    const result = verified ? simulate({
      fundId: entry.fundId,
      startYear: page.simYear,
      startMonth: page.simMonth,
      monthlyAmount: page.simAmount,
    }) : null;
    return { entry, verified, result };
  });
  const rankedEntries = preparedEntries
    .filter((item) => item.verified && item.result)
    .map((item) => ({ ...item, result: item.result! }))
    .sort((a, b) => (b.result?.finalValue ?? 0) - (a.result?.finalValue ?? 0));
  const referenceEntries = preparedEntries.filter((item) => !item.verified || !item.result);
  const displayedCriteria = page.criteria;
  const displayedFaqs = page.faqs;
  const comparisonResult = rankedEntries[0]?.result;

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
    mainEntity: displayedFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-dvh bg-[#FAFAF7] text-[#263A53]">
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-8 space-y-10">

          <Breadcrumbs items={isRoot
            ? [{ label: "ランキング" }]
            : [{ label: "ランキング", href: "/ranking" }, { label: RANKING_LABELS[page.slug] }]}
          />

          {/* ── H1 ────────────────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-start gap-3">
              <Trophy className="h-6 w-6 flex-shrink-0 text-orange-600 mt-0.5" />
              <h1
                className="text-2xl font-black text-[#263A53] leading-tight"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                {page.h1}
              </h1>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{page.intro}</p>
          </section>

          <PageVisualStory kind="ranking" />

          {isRoot && (
            <section className="rounded-xl border border-[#D9E3E8] bg-white p-4 space-y-2">
              <h2 className="text-sm font-bold text-[#263A53]">初めて商品を比べるときの確認項目</h2>
              <p className="text-xs leading-relaxed text-slate-600">
                数値順位は初心者適性や推奨順ではありません。投資対象、費用、分散範囲に加え、生活費と分けた余裕資金か、資金を使う時期までの期間、許容できる値動きを確認してください。
              </p>
              <p className="text-xs leading-relaxed text-slate-500">
                NISAを使う場合は商品ごとの対象枠も確認します。制度条件は新NISAページ、正式商品と設定日は各商品詳細へ分けて掲載しています。
              </p>
            </section>
          )}

          <section className="rounded-xl border border-[#B9DCEB] bg-indigo-400/[0.05] p-4 space-y-2">
            <h2 className="text-xs font-bold text-[#236B8E]">{isHighDividend ? "実績と商品属性の分け方" : "数値順位の計算方法"}</h2>
            <p className="text-xs leading-relaxed text-slate-600">
              {isHighDividend
                ? `VYMは${page.simYear}年${page.simMonth}月から2026年9月まで月初に${formatCurrency(page.simAmount)}を積み立てたA品質の検証済み結果を表示します。SCHDはG品質のため評価額・利益・順位を表示せず、公式に確認できる商品属性だけを掲載します。`
                : `${page.simYear}年${page.simMonth}月から2026年9月まで、月初に${formatCurrency(page.simAmount)}を積み立てた期間末評価額の高い順です。元本は${comparisonResult ? formatCurrency(comparisonResult.totalPrincipal) : "対象結果で確認"}で、期間全体を計算できるA品質系列だけを順位付けし、商品設定前や欠損月を別系列で補いません。`}
            </p>
            <p className="text-xs leading-relaxed text-slate-500">
              候補商品はこのページの目的に沿って絞っています。順位は将来予測、推奨順位、価格変動の小ささを表すものではありません。G品質は順位外の参考情報として分けます。
            </p>
            <Link href="/about/data-sources" className="inline-flex items-center gap-1 text-xs font-bold text-[#236B8E] hover:text-[#236B8E]">
              対象系列と検証方法を見る<ArrowRight className="h-3 w-3" />
            </Link>
          </section>

          {isNisa && (
            <section className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4 space-y-3">
              <h2 className="text-sm font-bold text-emerald-200">新NISAの制度条件（2026年10月11日確認）</h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-black/20 p-3"><p className="text-slate-500">つみたて投資枠／年</p><p className="mt-1 font-bold text-[#263A53]">{formatManEn(NISA_LIMITS.tsumitateAnnual)}</p></div>
                <div className="rounded-lg bg-black/20 p-3"><p className="text-slate-500">成長投資枠／年</p><p className="mt-1 font-bold text-[#263A53]">{formatManEn(NISA_LIMITS.growthAnnual)}</p></div>
                <div className="rounded-lg bg-black/20 p-3"><p className="text-slate-500">非課税保有限度額</p><p className="mt-1 font-bold text-[#263A53]">{formatManEn(NISA_LIMITS.lifetimeTotal)}</p></div>
                <div className="rounded-lg bg-black/20 p-3"><p className="text-slate-500">うち成長投資枠</p><p className="mt-1 font-bold text-[#263A53]">{formatManEn(NISA_LIMITS.lifetimeGrowthOnly)}</p></div>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">制度対象かどうかと、過去の積立結果は別の判断材料です。対象商品は金融庁の一覧と利用する金融機関で商品単位に確認してください。</p>
              <p className="text-xs leading-relaxed text-slate-500">{NISA_SYSTEM_DISCLAIMER}</p>
              <a href="https://www.fsa.go.jp/policy/nisa2/know/index.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">金融庁「NISAを知る」<ArrowRight className="h-3 w-3" /></a>
            </section>
          )}

          {/* ── 評価基準 ─────────────────────────────────────── */}
          <section>
            <h2
              className="text-sm font-bold text-slate-600 mb-3"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              評価基準
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {displayedCriteria.map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl bg-white border border-[#DDE6EA] p-3 space-y-1"
                >
                  <p className="text-xs font-bold text-orange-600">{c.label}</p>
                  <p className="text-xs text-slate-500 leading-snug">{c.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── ランキング一覧 ────────────────────────────────── */}
          <section className="space-y-4">
            <h2
              className="text-base font-bold text-[#263A53]"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {isHighDividend ? "検証済み実績" : "条件別の比較結果"}
            </h2>
            {rankedEntries.map(({ entry, result }, index) => {
              const fund = FUNDS[entry.fundId];
              const enc = fund.encyclopedia;
              const isProfit = (result?.profit ?? 0) >= 0;
              const fundPageSlug = entry.fundSlug ?? FUND_SLUG_MAP[entry.fundId];

              return (
                <div
                  key={entry.fundId}
                  className="rounded-2xl border border-[#D9E3E8] overflow-hidden"
                  style={{ background: `${fund.color}08` }}
                >
                  {/* ランク＋銘柄名ヘッダー */}
                  <div className="px-4 pt-4 pb-3 space-y-2">
                    <div className="flex items-center gap-3">
                      {!isHighDividend && <span className="text-sm font-black text-amber-700">{index + 1}位</span>}
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-base font-black text-[#263A53]"
                          style={{ fontFamily: "var(--font-serif-jp), serif" }}
                        >
                          {enc.nickname}
                        </span>
                      </div>
                      <span
                        className="text-xs font-black px-2 py-0.5 rounded flex-shrink-0"
                        style={{ background: `${fund.color}25`, color: fund.color }}
                      >
                        {isHighDividend ? "A品質・検証済み実績" : "A品質・実績順位"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">
                      {fund.description}。構成は{fund.shareCount}、費用は{formatExpenseRatio(entry.fundId)}です。
                      {isNisa ? ` NISA対象は${enc.nisaSupport.tsumitate ? "つみたて投資枠・" : ""}${enc.nisaSupport.growth ? "成長投資枠" : "対象外"}です。` : ""}
                    </p>
                  </div>

                  {/* シミュレーション結果 */}
                  {result ? <div
                    className="mx-4 mb-3 rounded-xl px-3 py-2.5 space-y-1"
                    style={{ background: `${fund.color}12`, border: `1px solid ${fund.color}25` }}
                  >
                    <p className="text-[9px] text-slate-500">
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
                      <span className="text-xs text-slate-500 ml-auto">
                        評価額 {formatCurrency(result.finalValue)}
                      </span>
                    </div>
                  </div> : null}

                  <div className="px-4 pb-3 text-xs leading-relaxed text-slate-500">
                    数値順位とは別に、投資対象、費用、商品設定日、NISAの対象枠、許容できる値動きを商品詳細で確認してください。
                  </div>

                  {/* リンク行 */}
                  <div className={`border-t border-[#E1E8EC] ${fundPageSlug ? "grid grid-cols-2 divide-x divide-white/[0.06]" : "flex"}`}>
                    {fundPageSlug && (
                      <Link
                        href={`/fund/${fundPageSlug}`}
                        className="px-3 py-2.5 flex items-center justify-center gap-1 text-xs font-bold text-slate-700 hover:bg-[#EFF5F7] transition-colors"
                      >
                        {enc.nickname}とは？
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                    {entry.yearSlug ? (
                      <Link
                        href={`/${entry.yearSlug}/${page.simYear}`}
                        className="flex-1 px-3 py-2.5 flex items-center justify-center gap-1 text-xs font-bold text-[#236B8E] hover:bg-[#EFF5F7] transition-colors"
                      >
                        {page.simYear}年積立を見る
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : fundPageSlug && MONTHLY_PAGE_FUND_SLUGS.has(fundPageSlug) ? (
                      <Link
                        href={`/${fundPageSlug}/monthly/30000`}
                        className="flex-1 px-3 py-2.5 flex items-center justify-center gap-1 text-xs font-bold text-[#236B8E] hover:bg-[#EFF5F7] transition-colors"
                      >
                        月3万円を見る
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : fundPageSlug && FUND_SEO_MAP.has(fundPageSlug) ? (
                      <Link
                        href={`/${fundPageSlug}`}
                        className="flex-1 px-3 py-2.5 flex items-center justify-center gap-1 text-xs font-bold text-[#236B8E] hover:bg-[#EFF5F7] transition-colors"
                      >
                        詳しく見る
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </section>

          {referenceEntries.length > 0 && (
            <section className="space-y-3">
              <div>
                <h2 className="text-base font-bold text-[#263A53]">{isHighDividend ? "公式に確認できる商品属性" : "順位外の参考商品"}</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">原典未検証のG品質系列、または対象期間全体を計算できない商品です。商品属性は確認できますが、上の数値順位には混ぜません。</p>
              </div>
              {referenceEntries.map(({ entry }) => {
                const fund = FUNDS[entry.fundId];
                const fundPageSlug = entry.fundSlug ?? FUND_SLUG_MAP[entry.fundId];
                return (
                  <div key={entry.fundId} className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold" style={{ color: fund.color }}>{fund.shortName}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{fund.description}。費用は{formatExpenseRatio(entry.fundId)}です。</p>
                      </div>
                      <span className="shrink-0 rounded bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-700">G品質・数値比較外</span>
                    </div>
                    {fundPageSlug && <Link href={`/fund/${fundPageSlug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-200">商品属性を確認<ArrowRight className="h-3 w-3" /></Link>}
                  </div>
                );
              })}
            </section>
          )}

          {/* ── 関連比較ページ ───────────────────────────────── */}
          {page.relatedCompareSlugs.length > 0 && (
            <section>
              <h2
                className="text-base font-bold text-[#263A53] mb-4"
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
                      className="flex items-center justify-between rounded-xl bg-[#F7FAFB] border border-[#D9E3E8] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-bold text-[#263A53]">
                        <span style={{ color: fA.color }}>{fA.shortName}</span>
                        <span className="text-slate-500 text-xs">vs</span>
                        <span style={{ color: fB.color }}>{fB.shortName}</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── よくある質問 ─────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-[#263A53] mb-5"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              よくある質問
            </h2>
            <div className="space-y-4">
              {displayedFaqs.map((faq, i) => (
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

          {/* ── 他のランキング ───────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-[#263A53] mb-4"
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
                    className="flex items-center justify-between rounded-xl bg-[#F7FAFB] border border-[#D9E3E8] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="h-3.5 w-3.5 text-orange-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{RANKING_LABELS[rs]}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── 関連ガイド ───────────────────────────────────── */}
          <section>
            <h2
              className="text-sm font-bold text-slate-600 mb-3"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              関連する投資ガイド
            </h2>
            <div className="space-y-2">
              {[
                { label: "新NISAの商品比較ガイド",       href: "/guide/nisa-beginner" },
                { label: "インデックス投資とは？",        href: "/guide/index-investing" },
                { label: "積立投資の始め方",              href: "/guide/how-to-start" },
                { label: "ドルコスト平均法の効果",        href: "/guide/dollar-cost-averaging" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-xl bg-white border border-[#E1E8EC] px-4 py-3 hover:bg-[#EFF5F7] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 text-[#236B8E] flex-shrink-0" />
                    <span className="text-sm text-slate-700">{label}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          {/* ── CTA ────────────────────────────────────────── */}
          <section className="rounded-2xl bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/20 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-700" />
              <h2
                className="text-base font-bold text-[#263A53]"
                style={{ fontFamily: "var(--font-serif-jp), serif" }}
              >
                自分の条件でシミュレーション
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              気になった銘柄の積立開始年・月額を自由に変えて、あなただけの「たられば」を計算できます。
            </p>
            <Link
              href="/"
              className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-sm text-[#263A53] bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              積立タイムマシンで試す
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* ── 人気ページ ───────────────────────────────────── */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-600">人気ページ</h2>
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
                  className="flex items-center justify-between rounded-xl bg-white border border-[#E1E8EC] px-4 py-3 hover:bg-[#EFF5F7] transition-colors"
                >
                  <span className="text-sm text-slate-700">{label}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
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
