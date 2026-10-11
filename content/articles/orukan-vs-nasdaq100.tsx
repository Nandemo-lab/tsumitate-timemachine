import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Globe,
  Cpu,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { simulate, formatCurrency } from "@/lib/simulation";
import { FUNDS, formatAnnualReturn, formatExpenseRatio } from "@/lib/funds";
import { NISA_LIMITS, formatManEn, NISA_SYSTEM_DISCLAIMER } from "@/lib/nisa";
import GuideEeat from "@/components/guide/GuideEeat";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { SectionHeading, SpecCard, SimCard } from "@/components/articles/ArticleBlocks";
import type { ArticleMeta } from "@/lib/article-pages";

// ─── メタデータ ────────────────────────────────────────────────────────────

export const meta: ArticleMeta = {
  slug: "orukan-vs-nasdaq100",
  h1: "オルカンとNASDAQ100どっち？違い・過去実績・向いている人を徹底比較",
  metaTitle: "オルカンとNASDAQ100どっち？違い・過去実績・どちらが向いているかを比較",
  metaDescription:
    "オルカン（全世界株）とNASDAQ100の投資範囲・銘柄集中・費用・新NISAでの取扱いを整理。過去シミュレーションの条件と結果の読み方を確認できます。",
  lastUpdated: "2026年7月",
  publishedAt: "2026-07-03",
  category: "比較コラム",
  ogFundA: "orcan",
  ogFundB: "nasdaq100",
  ogYear: 2020,
  ogMonth: 1,
  ogAmount: 30000,
  relatedFunds: ["orcan", "nasdaq100"],
  relatedGuides: [
    "orukan-ippon-de-ii",
    "nisa-beginner",
    "sp500-booraku-taisho",
    "nisa-wariate-osusume",
    "index-shippai-pattern",
  ],
};

// ─── シミュレーションデータ ─────────────────────────────────────────────────

const simOrcan      = simulate({ fundId: "orcan",     startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simNasdaq     = simulate({ fundId: "nasdaq100", startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simOrcanLong  = simulate({ fundId: "orcan",     startYear: 2018, startMonth: 11, monthlyAmount: 30000 });
const simNasdaqLong = simulate({ fundId: "nasdaq100", startYear: 2018, startMonth: 11, monthlyAmount: 30000 });

// ─── 目次 ────────────────────────────────────────────────────────────────────

const TOC = [
  "先に確認する3つの違い",
  "オルカンとは？特徴と仕組み",
  "NASDAQ100とは？特徴と仕組み",
  "オルカンとNASDAQ100の違いを比較",
  "過去の積立シミュレーションで比較",
  "暴落時の動き方の違い",
  "新NISAで確認する条件",
  "オルカン側の確認項目",
  "NASDAQ100側の確認項目",
  "積立タイムマシンで実際に確かめよう",
];

// ─── 記事コンテンツコンポーネント ────────────────────────────────────────────

export default function ArticleContent({ meta }: { meta: ArticleMeta }) {
  return (
    <div className="space-y-10">

      {/* カテゴリバッジ + H1 + 導入 */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1">
          <BookOpen className="h-3 w-3 text-indigo-400" />
          <span className="text-[11px] font-bold text-indigo-400">{meta.category}</span>
        </div>
        <h1
          className="text-2xl font-black text-white leading-tight"
          style={{ fontFamily: "var(--font-serif-jp), serif" }}
        >
          {meta.h1}
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          オルカンとNASDAQ100は、投資する国・業種・銘柄数が異なります。この記事では商品構造と費用、2本を併用したときの重複、過去シミュレーションを読む際の条件を整理します。
        </p>
      </section>

      {/* E-E-A-T */}
      <GuideEeat lastUpdated={meta.lastUpdated} />

      {/* 目次 */}
      <nav className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2">
        <p className="text-xs font-bold text-zinc-300">目次</p>
        <ol className="space-y-1.5">
          {TOC.map((title, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[10px] font-bold text-indigo-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
              <a
                href={`#section-${i}`}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors leading-snug"
              >
                {title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 0. 結論 */}
      <section id="section-0" className="space-y-4">
        <SectionHeading index={0} title="先に確認する3つの違い" />
        <div className="rounded-xl bg-indigo-500/8 border border-indigo-500/20 p-5 space-y-3">
          <p className="text-sm font-bold text-indigo-200">先に結論をお伝えします。</p>
          <ul className="space-y-2">
            {[
              "投資範囲：オルカンは全世界、NASDAQ100は米国の非金融大型株が中心",
              "集中度：NASDAQ100は業種・上位銘柄への集中が相対的に高い",
              "2本を併用すると米国大型テクノロジー株の重複が増えるため、配分前に重複を確認する",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500 leading-relaxed pt-1">
            ※ NASDAQ100は過去の高リターンで注目されますが、ボラティリティも高い商品です。「必ずNASDAQ100の方が得」とは言えません。
          </p>
        </div>
      </section>

      {/* 1. オルカンとは */}
      <section id="section-1" className="space-y-4">
        <SectionHeading index={1} title="オルカンとは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          「オルカン」は<strong className="text-white">「eMAXIS Slim全世界株式（オール・カントリー）」</strong>の愛称で、MSCI ACWI（All Country World Index）に連動する投資信託です。先進国23カ国・新興国24カ国を合わせた約47カ国・約3,000銘柄をカバーし、時価総額の比率に応じて世界全体に分散投資できます。
        </p>
        <SpecCard rows={[
          ["対象", "先進国23カ国＋新興国24カ国（約47カ国）"],
          ["銘柄数", FUNDS.orcan.shareCount],
          ["米国比率", "構成国で最大（比率は月次で変動）"],
          ["信託報酬", formatExpenseRatio("orcan")],
          ["新NISA対応", "つみたて投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          世界中の企業へ時価総額比率で投資する商品です。NASDAQ100と比べて対象地域・業種が広い一方、株式市場や為替の影響は受けます。
        </p>
      </section>

      {/* 2. NASDAQ100とは */}
      <section id="section-2" className="space-y-4">
        <SectionHeading index={2} title="NASDAQ100とは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          NASDAQ100は、米国ナスダック市場に上場する非金融企業のうち時価総額上位100社で構成される株価指数です。情報技術など一部業種と上位銘柄の比率が高く、日本では「iFreeNEXT NASDAQ100インデックス」などが連動を目指します。
        </p>
        <SpecCard rows={[
          ["対象", "米国ナスダック非金融上位100社"],
          ["銘柄数", FUNDS.nasdaq100.shareCount],
          ["セクター比率", "テクノロジー中心（金融除く）"],
          ["信託報酬", formatExpenseRatio("nasdaq100")],
          ["新NISA対応", "つみたて投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          2020年は{formatAnnualReturn("nasdaq100", 2020)}、2023年は{formatAnnualReturn("nasdaq100", 2023)}と高い暦年リターンを記録した一方、2022年は{formatAnnualReturn("nasdaq100", 2022)}でした。いずれも円ベース・分配金再投資込みの暦年リターンであり、年中の最大下落率ではありません。
        </p>
      </section>

      {/* 3. 比較表 */}
      <section id="section-3" className="space-y-4">
        <SectionHeading index={3} title="オルカンとNASDAQ100の違いを比較" />
        <div className="rounded-xl overflow-hidden border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.05]">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-zinc-400 w-1/3">項目</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-indigo-400">
                  <Globe className="h-3 w-3 inline mr-1" />オルカン
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-violet-400">
                  <Cpu className="h-3 w-3 inline mr-1" />NASDAQ100
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {[
                ["対象国",     "約47カ国（全世界）",     "米国のみ"],
                ["銘柄数",     FUNDS.orcan.shareCount,    FUNDS.nasdaq100.shareCount],
                ["分散度",     "◎ 地域・業種とも分散",   "△ テック業種に集中"],
                ["実績の確認", "共通条件で再計算",       "共通条件で再計算"],
                ["信託報酬",   formatExpenseRatio("orcan"), formatExpenseRatio("nasdaq100")],
                ["2022年の暦年リターン", formatAnnualReturn("orcan", 2022), formatAnnualReturn("nasdaq100", 2022)],
                ["保有時の確認", "米国を含む全世界分散",  "非金融大型株への集中"],
              ].map(([k, o, s]) => (
                <tr key={k} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-xs text-zinc-400 font-medium">{k}</td>
                  <td className="px-4 py-3 text-xs text-zinc-200">{o}</td>
                  <td className="px-4 py-3 text-xs text-zinc-200">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          ※暦年リターンは円ベース・分配金再投資込みで、年中の高値から安値までの最大下落率ではありません。信託報酬はeMAXIS Slim全世界株式（オール・カントリー）、iFreeNEXT NASDAQ100インデックスの2025年6月時点の税込数値。
        </p>
      </section>

      {/* 4. 過去シミュレーション */}
      <section id="section-4" className="space-y-4">
        <SectionHeading index={4} title="過去の積立シミュレーションで比較" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          両商品の公式な分配金再投資基準価額から検証した、商品設定後の月次実績を使った計算結果です。
        </p>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400">
            【2020年1月〜2025年6月】毎月{formatCurrency(30000)}積立
          </p>
          <div className="grid grid-cols-2 gap-3">
            <SimCard name="オルカン" color="#6366f1" sim={simOrcan} />
            <SimCard name="NASDAQ100" color="#8b5cf6" sim={simNasdaq} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400">
              【2018年11月〜2025年6月】毎月{formatCurrency(30000)}積立（両商品の公式実績が揃う期間）
          </p>
          <div className="grid grid-cols-2 gap-3">
            <SimCard name="オルカン" color="#6366f1" sim={simOrcanLong} />
            <SimCard name="NASDAQ100" color="#8b5cf6" sim={simNasdaqLong} />
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-1.5">
          <p className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            読み取れること
          </p>
          <ul className="space-y-1.5 pl-5">
            {[
              "この表の2期間ではNASDAQ100の期末評価額がオルカンを上回った",
              "この結果だけから、別の開始月や将来の順位は判断できない",
              "開始年・期間によって差は大きく変動する（特定の期間が未来を保証しない）",
            ].map((t, i) => (
              <li key={i} className="text-xs text-zinc-400 list-disc">{t}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          ※両系列とも「A：公式月次データ」です。商品設定後の実績を使用しており、将来の成果を示すものではありません。
        </p>
      </section>

      {/* 5. 暴落時 */}
      <section id="section-5" className="space-y-4">
        <SectionHeading index={5} title="暴落時の動き方の違い" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          下落局面での値動きの差は、この2商品を比較するうえで最も重要なポイントです。
        </p>
        <div className="space-y-3">
          {[
            {
              event: "コロナショック（2020年2〜3月）",
              body: `2020年の円ベース・分配金再投資込みの暦年リターンは、オルカンが${formatAnnualReturn("orcan", 2020)}、NASDAQ100が${formatAnnualReturn("nasdaq100", 2020)}でした。暦年リターンだけでは、年中の最大下落率や回復までの期間は判断できません。`,
              diff: "年中の下落・回復期間とは別の指標",
              diffColor: "text-violet-400",
            },
            {
              event: "インフレ・利上げショック（2022年）",
              body: `2022年の円ベース・分配金再投資込みの暦年リターンは、オルカンが${formatAnnualReturn("orcan", 2022)}、NASDAQ100が${formatAnnualReturn("nasdaq100", 2022)}でした。これは年中の最大下落率ではありません。`,
              diff: "NASDAQ100が大きく劣後",
              diffColor: "text-amber-400",
            },
            {
              event: "2023年のテック株回復局面",
              body: `2023年の円ベース・分配金再投資込みの暦年リターンは、オルカンが${formatAnnualReturn("orcan", 2023)}、NASDAQ100が${formatAnnualReturn("nasdaq100", 2023)}でした。単年の暦年リターンは、下落前の水準までの回復期間を示すものではありません。`,
              diff: "NASDAQ100の暦年リターンが上回った年",
              diffColor: "text-emerald-400",
            },
          ].map((item, i) => (
            <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2">
              <p className="text-xs font-bold text-white">{item.event}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.body}</p>
              <p className={`text-[11px] font-bold ${item.diffColor}`}>▶ {item.diff}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-amber-500/8 border border-amber-500/20 p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-300 leading-relaxed">
            NASDAQ100は対象業種と上位銘柄への集中度が高い商品です。暦年リターンだけでは年中の最大下落率や回復期間を判断できないため、商品構造、資金を使う時期、許容できる値動きを分けて確認します。
          </p>
        </div>
      </section>

      {/* 6. 新NISA */}
      <section id="section-6" className="space-y-4">
        <SectionHeading index={6} title="新NISAで確認する条件" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          新NISA（2024年〜）のつみたて投資枠は年間{formatManEn(NISA_LIMITS.tsumitateAnnual)}、成長投資枠と合わせた年間投資枠は{formatManEn(NISA_LIMITS.tsumitateAnnual + NISA_LIMITS.growthAnnual)}、生涯の非課税保有限度額は{formatManEn(NISA_LIMITS.lifetimeTotal)}です。{NISA_SYSTEM_DISCLAIMER}
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          金融庁は資産形成の基本として長期・積立・分散を説明しています。2商品を併用すると米国大型株の重複が増えるため、商品名だけでなく投資地域・業種・上位銘柄の重なりを確認します。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-300">新NISAで選ぶ際のポイント</p>
          <ul className="space-y-2">
            {[
              "どちらもつみたて投資枠・成長投資枠で購入可能",
              "毎月定額の積立ならどちらもドルコスト平均法の効果を受けられる",
              "2商品を併用する場合は米国大型株の重複と配分を確認する",
              "一方だけを選ぶ場合も、集中度と資金を使う時期を確認する",
              "資金を使う時期と許容できる値動きを先に確認する",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. こんな人はオルカン */}
      <section id="section-7" className="space-y-4">
        <SectionHeading index={7} title="オルカン側の確認項目" />
        <div className="rounded-xl bg-indigo-500/6 border border-indigo-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-4 w-4 text-indigo-400" />
            <p className="text-sm font-bold text-indigo-200">オルカン側の確認項目</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "先進国・新興国を含む全世界株式が対象",
              "時価総額の変化に応じて国・地域の比率が変わる",
              "NASDAQ100にも含まれる米国大型株を多く含む",
              "現在の費用・設定日・対象指数はFund詳細で確認できる",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-indigo-400 font-bold flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. こんな人はNASDAQ100 */}
      <section id="section-8" className="space-y-4">
        <SectionHeading index={8} title="NASDAQ100側の確認項目" />
        <div className="rounded-xl bg-violet-500/6 border border-violet-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-4 w-4 text-violet-400" />
            <p className="text-sm font-bold text-violet-200">NASDAQ100側の確認項目</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "ナスダック上場の非金融大型株が対象",
              "業種と上位銘柄への集中度が高い",
              "オルカンと併用すると保有銘柄が重複する",
              "現在の費用・設定日・対象指数はFund詳細で確認できる",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-violet-400 font-bold flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* まとめ */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2">
        <p className="text-xs font-bold text-zinc-300">まとめ：投資範囲と集中度を確認する</p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          オルカンは全世界株式、NASDAQ100は米国の非金融大型株が中心で、分散範囲と集中度が異なります。過去の結果は開始月と期間で変わるため、<strong className="text-zinc-200">保有商品の重複、資金を使う時期、許容できる値動き</strong>を分けて確認します。
        </p>
      </div>

      <DisclaimerBar />

      {/* 9. CTA */}
      <section id="section-9" className="space-y-4">
        <SectionHeading index={9} title="積立タイムマシンで実際に確かめよう" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          「もし○○年から積み立てていたら？」を、オルカン・NASDAQ100それぞれで実際に確かめてみましょう。
          開始年と毎月の積立額を変え、同じ条件で期末評価額と元本を再計算できます。
        </p>
        <Link
          href="/compare/orukan-vs-nasdaq100"
          className="block rounded-2xl p-5 space-y-2 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #f59e0b 100%)" }}
        >
          <p className="text-xs font-bold text-white/80">積立タイムマシン 比較モード</p>
          <p className="text-lg font-black text-white leading-tight">
            オルカンとNASDAQ100を<br />実際に比較してみませんか？
          </p>
          <p className="text-xs text-white/70">開始年・積立額を自分で設定 ・ 差額をリアルタイム計算</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-sm font-black text-white">比較シミュレーションを開く</span>
            <ArrowRight className="h-4 w-4 text-white" />
          </div>
        </Link>
        <Link
          href="/"
          className="block rounded-2xl border border-white/10 bg-white/[0.05] p-5 space-y-2 transition-all hover:bg-white/[0.08] active:scale-[0.99]"
        >
          <p className="text-xs font-bold text-zinc-400">積立タイムマシン</p>
          <p className="text-base font-black text-white leading-tight">
            あの時から積み立てていたら<br />いくらになっていた？
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-white"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              無料でシミュレーションする
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-2">
          <p className="text-[11px] font-bold text-zinc-400">関連ページ</p>
          <ul className="space-y-2">
            {[
              { href: "/guide/orukan-ippon-de-ii",   label: "オルカン一本でいい？詳しく解説" },
              { href: "/guide/index-shippai-pattern", label: "インデックス投資の失敗パターン" },
              { href: "/fund/orukan",                 label: "オルカン銘柄詳細ページ" },
              { href: "/fund/nasdaq100",               label: "NASDAQ100銘柄詳細ページ" },
              { href: "/compare/sp500-vs-nasdaq100",  label: "S&P500 vs NASDAQ100 比較" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <ArrowRight className="h-3 w-3 text-indigo-400 flex-shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

