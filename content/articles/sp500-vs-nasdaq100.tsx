import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Flag,
  Cpu,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { simulate, formatCurrency, CURRENT_YEAR, CURRENT_MONTH } from "@/lib/simulation";
import { formatAnnualReturn, formatExpenseRatio } from "@/lib/funds";
import { NISA_LIMITS, formatManEn, NISA_SYSTEM_DISCLAIMER } from "@/lib/nisa";
import GuideEeat from "@/components/guide/GuideEeat";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { SectionHeading, SpecCard, SimCard } from "@/components/articles/ArticleBlocks";
import ArticleToc from "@/components/articles/ArticleToc";
import type { ArticleMeta } from "@/lib/article-pages";

// ─── メタデータ ────────────────────────────────────────────────────────────

export const meta: ArticleMeta = {
  slug: "sp500-vs-nasdaq100",
  h1: "S&P500とNASDAQ100どっち？違い・過去実績・判断材料を比較",
  metaTitle: "S&P500とNASDAQ100どっち？違い・過去実績・どちらが向いているかを比較",
  metaDescription:
    "S&P500とNASDAQ100の対象業種・銘柄集中・費用・新NISAでの取扱いを整理。過去シミュレーションの条件と結果の読み方を確認できます。",
  lastUpdated: "2026年7月",
  publishedAt: "2026-07-03",
  category: "比較コラム",
  ogFundA: "sp500",
  ogFundB: "nasdaq100",
  ogYear: 2020,
  ogMonth: 1,
  ogAmount: 30000,
  relatedFunds: ["sp500", "nasdaq100"],
  relatedGuides: [
    "sp500-booraku-taisho",
    "nisa-beginner",
    "orukan-ippon-de-ii",
    "index-shippai-pattern",
    "nisa-wariate-osusume",
  ],
};

// ─── シミュレーションデータ ─────────────────────────────────────────────────

const simSp500      = simulate({ fundId: "sp500",     startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simNasdaq      = simulate({ fundId: "nasdaq100", startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simSp500Long   = simulate({ fundId: "sp500",     startYear: 2018, startMonth: 9, monthlyAmount: 30000 });
const simNasdaqLong  = simulate({ fundId: "nasdaq100", startYear: 2018, startMonth: 9, monthlyAmount: 30000 });

// ─── 目次 ────────────────────────────────────────────────────────────────────

const TOC = [
  "先に確認する3つの違い",
  "S&P500とは？特徴と仕組み",
  "NASDAQ100とは？特徴と仕組み",
  "S&P500とNASDAQ100の違いを比較",
  "過去の積立シミュレーションで比較",
  "暴落時の動き方の違い",
  "新NISAで確認する条件",
  "S&P500側の確認項目",
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
          <BookOpen className="h-3 w-3 text-[#236B8E]" />
          <span className="text-xs font-bold text-[#236B8E]">{meta.category}</span>
        </div>
        <h1
          className="text-2xl font-black text-[#263A53] leading-tight"
          style={{ fontFamily: "var(--font-serif-jp), serif" }}
        >
          {meta.h1}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          S&amp;P500とNASDAQ100はいずれも米国大型株が中心ですが、採用基準・対象業種・銘柄集中が異なります。この記事では商品構造と費用、2本を併用したときの重複、過去シミュレーションを読む際の条件を整理します。
        </p>
      </section>

      {/* E-E-A-T */}
      <GuideEeat lastUpdated={meta.lastUpdated} />

      <ArticleToc titles={TOC} />

      {/* 0. 結論 */}
      <section id="section-0" className="space-y-4">
        <SectionHeading index={0} title="先に確認する3つの違い" />
        <div className="rounded-xl bg-indigo-500/8 border border-indigo-500/20 p-5 space-y-3">
          <p className="text-sm font-bold text-[#236B8E]">先に結論をお伝えします。</p>
          <ul className="space-y-2">
            {[
              "対象範囲：S&P500は米国大型株の全業種、NASDAQ100は金融を除く大型株が中心",
              "重複：両指数の上位銘柄には重複があり、2本保有しても地域分散にはならない",
              "実績：同じ開始月・月額・終了月にそろえた結果は比較ページで再計算する",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-[#236B8E] flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            ※ どちらも米国株への投資であり、地域分散という意味では同じ制約を持ちます。優劣を断定できるものではありません。
          </p>
        </div>
      </section>

      {/* 1. S&P500とは */}
      <section id="section-1" className="space-y-4">
        <SectionHeading index={1} title="S&P500とは？特徴と仕組み" />
        <p className="text-sm text-slate-700 leading-relaxed">
          S&P500は、米国の代表的企業500社で構成される株価指数です。アップル・マイクロソフト・エヌビディア・アマゾン・メタといった大型企業に加え、金融・ヘルスケア・生活必需品など全業種をカバーします。本記事では「eMAXIS Slim米国株式（S&P500）」を比較対象にしています。
        </p>
        <SpecCard rows={[
          ["対象", "米国大型株500社（全業種）"],
          ["銘柄数", "約500銘柄"],
          ["業種分散", "全業種に分散"],
          ["信託報酬", formatExpenseRatio("sp500")],
          ["新NISA対応", "つみたて投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-slate-600 leading-relaxed">
          金融・ヘルスケアなど非テクノロジー業種も含み、NASDAQ100より対象業種と銘柄数が広い指数です。どちらも米国株式の値動きと為替の影響を受けます。
        </p>
      </section>

      {/* 2. NASDAQ100とは */}
      <section id="section-2" className="space-y-4">
        <SectionHeading index={2} title="NASDAQ100とは？特徴と仕組み" />
        <p className="text-sm text-slate-700 leading-relaxed">
          NASDAQ100は、米国ナスダック市場に上場する非金融企業のうち時価総額上位100社で構成される株価指数です。情報技術など一部業種と上位銘柄の比率が高く、日本では「iFreeNEXT NASDAQ100インデックス」などが連動を目指します。
        </p>
        <SpecCard rows={[
          ["対象", "米国ナスダック非金融上位100社"],
          ["銘柄数", "約100銘柄"],
          ["業種分散", "IT・ハイテク偏重（約60%）"],
          ["信託報酬", formatExpenseRatio("nasdaq100")],
          ["新NISA対応", "つみたて投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-slate-600 leading-relaxed">
          2020年は{formatAnnualReturn("nasdaq100", 2020)}、2023年は{formatAnnualReturn("nasdaq100", 2023)}と高い暦年リターンを記録した一方、2022年は{formatAnnualReturn("nasdaq100", 2022)}でした。いずれも円ベース・分配金再投資込みの暦年リターンです。金融株を含まないため、S&P500よりもテクノロジー分野への集中度が高い構造です。
        </p>
      </section>

      {/* 3. 比較表 */}
      <section id="section-3" className="space-y-4">
        <SectionHeading index={3} title="S&P500とNASDAQ100の違いを比較" />
        <div className="rounded-xl overflow-hidden border border-[#D9E3E8]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F4F7F8]">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-600 w-1/3">項目</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-orange-600">
                  <Flag className="h-3 w-3 inline mr-1" />S&P500
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold text-violet-400">
                  <Cpu className="h-3 w-3 inline mr-1" />NASDAQ100
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {[
                ["投資対象",   "米国大型株500社",          "ナスダック上場の非金融100社"],
                ["銘柄数",     "500銘柄",                  "100銘柄"],
                ["業種分散",   "○ 全業種に分散",           "△ IT・ハイテク偏重（約60%）"],
                ["リスク",     "中",                       "やや高"],
                ["2022年の暦年リターン", formatAnnualReturn("sp500", 2022), formatAnnualReturn("nasdaq100", 2022)],
                ["信託報酬",   formatExpenseRatio("sp500"), formatExpenseRatio("nasdaq100")],
                ["NISA対応",   "○ つみたて・成長両対応",    "○ つみたて・成長両対応"],
              ].map(([k, a, b]) => (
                <tr key={k} className="hover:bg-white transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-600 font-medium">{k}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">{a}</td>
                  <td className="px-4 py-3 text-xs text-slate-700">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          ※暦年リターンは円ベース・分配金再投資込みで、年中の高値から安値までの最大下落率ではありません。信託報酬はサイト共通の商品定義を参照し、最新値は各運用会社の交付目論見書でも確認してください。
        </p>
      </section>

      {/* 4. 過去シミュレーション */}
      <section id="section-4" className="space-y-4">
        <SectionHeading index={4} title="過去の積立シミュレーションで比較" />
        <p className="text-sm text-slate-700 leading-relaxed">
          両商品の公式な分配金再投資基準価額から検証した、商品設定後の月次実績を使った計算結果です。
        </p>
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-600">
            【2020年1月〜{CURRENT_YEAR}年{CURRENT_MONTH}月】毎月{formatCurrency(30000)}積立
          </p>
          <div className="grid grid-cols-2 gap-3">
            <SimCard name="S&P500" color="#f59e0b" sim={simSp500} />
            <SimCard name="NASDAQ100" color="#8b5cf6" sim={simNasdaq} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-600">
              【2018年9月〜{CURRENT_YEAR}年{CURRENT_MONTH}月】毎月{formatCurrency(30000)}積立（両商品の検証済み実績が揃う期間）
          </p>
          <div className="grid grid-cols-2 gap-3">
            <SimCard name="S&P500" color="#f59e0b" sim={simSp500Long} />
            <SimCard name="NASDAQ100" color="#8b5cf6" sim={simNasdaqLong} />
          </div>
        </div>
        <div className="rounded-xl bg-white border border-[#E1E8EC] p-4 space-y-1.5">
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-700" />
            読み取れること
          </p>
          <ul className="space-y-1.5 pl-5">
            {[
              "この表の2期間ではNASDAQ100の期末評価額がS&P500を上回った",
              "この表の2期間ではNASDAQ100の期末評価額がS&P500を上回った",
              "開始年・期間によって差は大きく変動する（特定の期間が未来を保証しない）",
            ].map((t, i) => (
              <li key={i} className="text-xs text-slate-600 list-disc">{t}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          ※両系列とも「A：公式月次データ」です。商品設定後の実績を使用しており、将来の成果を示すものではありません。
        </p>
      </section>

      {/* 5. 暴落時 */}
      <section id="section-5" className="space-y-4">
        <SectionHeading index={5} title="暴落時の動き方の違い" />
        <p className="text-sm text-slate-700 leading-relaxed">
          下落局面での値動きの差は、この2商品を比較するうえで重要なポイントです。
        </p>
        <div className="space-y-3">
          {[
            {
              event: "コロナショック（2020年2〜3月）",
              body: `2020年の円ベース・分配金再投資込みの暦年リターンは、S&P500が${formatAnnualReturn("sp500", 2020)}、NASDAQ100が${formatAnnualReturn("nasdaq100", 2020)}でした。この暦年値から、コロナショック時の日次最大下落率や回復期間の優劣は判定できません。`,
              diff: "暦年値と日次下落・回復は別指標",
              diffColor: "text-violet-400",
            },
            {
              event: "インフレ・利上げショック（2022年）",
              body: `2022年の円ベース・分配金再投資込みの暦年リターンは、NASDAQ100が${formatAnnualReturn("nasdaq100", 2022)}、S&P500が${formatAnnualReturn("sp500", 2022)}でした。これは年中の最大下落率ではありません。金利上昇局面ではグロース株中心のNASDAQ100が大きな影響を受けました。`,
              diff: "NASDAQ100が大きく劣後",
              diffColor: "text-orange-600",
            },
            {
              event: "2023年のテック株回復局面",
              body: `AI関連銘柄の上昇を背景に、2023年の円ベース・分配金再投資込みの暦年リターンはNASDAQ100が${formatAnnualReturn("nasdaq100", 2023)}でした。S&P500も上昇しましたが、暦年リターンには差がありました。`,
              diff: "2023年の暦年リターンはNASDAQ100が上回る",
              diffColor: "text-emerald-700",
            },
          ].map((item, i) => (
            <div key={i} className="rounded-xl bg-white border border-[#DDE6EA] p-4 space-y-2">
              <p className="text-xs font-bold text-[#263A53]">{item.event}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{item.body}</p>
              <p className={`text-xs font-bold ${item.diffColor}`}>▶ {item.diff}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-amber-500/8 border border-amber-500/20 p-4 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-700 leading-relaxed">
            NASDAQ100はS&amp;P500より対象業種と銘柄が集中しています。過去の単年リターンだけで将来の振れ幅や成果を決めつけず、資金を使う時期と保有商品の重複を確認します。
          </p>
        </div>
      </section>

      {/* 6. 新NISA */}
      <section id="section-6" className="space-y-4">
        <SectionHeading index={6} title="新NISAで確認する条件" />
        <p className="text-sm text-slate-700 leading-relaxed">
          新NISA（2024年〜）のつみたて投資枠は年間{formatManEn(NISA_LIMITS.tsumitateAnnual)}、成長投資枠と合わせた年間投資枠は{formatManEn(NISA_LIMITS.tsumitateAnnual + NISA_LIMITS.growthAnnual)}、生涯の非課税保有限度額は{formatManEn(NISA_LIMITS.lifetimeTotal)}です。{NISA_SYSTEM_DISCLAIMER}
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          どちらも米国大型株が中心で、2商品を併用すると上位銘柄が重複します。制度枠だけでなく、業種構成・重複・費用を同じ基準で確認します。
        </p>
        <div className="rounded-xl bg-white border border-[#DDE6EA] p-4 space-y-3">
          <p className="text-xs font-bold text-slate-700">新NISAで選ぶ際のポイント</p>
          <ul className="space-y-2">
            {[
              "どちらもつみたて投資枠・成長投資枠で購入可能",
              "毎月定額の積立ならどちらもドルコスト平均法の効果を受けられる",
              "2商品を併用する場合は上位銘柄の重複と配分を確認する",
              "一方だけを選ぶ場合も、対象業種と上位銘柄への集中度を確認する",
              "資金を使う時期と許容できる値動きを先に確認する",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#236B8E] flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. こんな人はS&P500 */}
      <section id="section-7" className="space-y-4">
        <SectionHeading index={7} title="S&P500側の確認項目" />
        <div className="rounded-xl bg-amber-500/6 border border-amber-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="h-4 w-4 text-orange-600" />
            <p className="text-sm font-bold text-amber-200">S&amp;P500側の確認項目</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "米国大型株を複数業種に分散する指数",
              "NASDAQ100にも含まれる上位銘柄を多く含む",
              "金融を含む業種構成と時価総額加重を採用",
              "現在の費用・設定日・対象指数はFund詳細で確認できる",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-orange-600 font-bold flex-shrink-0">→</span>
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
              "S&P500より業種と上位銘柄への集中度が高い",
              "S&P500と併用すると保有銘柄が重複する",
              "現在の費用・設定日・対象指数はFund詳細で確認できる",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-violet-400 font-bold flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* まとめ */}
      <div className="rounded-xl bg-white border border-[#DDE6EA] p-4 space-y-2">
        <p className="text-xs font-bold text-slate-700">まとめ：業種分散と集中度の違い</p>
        <p className="text-xs text-slate-600 leading-relaxed">
          S&amp;P500とNASDAQ100はいずれも米国大型株が中心ですが、対象業種と銘柄集中度が異なります。過去の結果は開始月と期間で変わるため、<strong className="text-slate-700">重複する上位銘柄、費用、許容できる値動き</strong>を分けて確認します。
        </p>
      </div>

      <DisclaimerBar />

      {/* 9. CTA */}
      <section id="section-9" className="space-y-4">
        <SectionHeading index={9} title="積立タイムマシンで実際に確かめよう" />
        <p className="text-sm text-slate-700 leading-relaxed">
          「もし○○年から積み立てていたら？」を、S&P500・NASDAQ100それぞれで実際に確かめてみましょう。
          開始年と毎月の積立額を変え、同じ条件で期末評価額と元本を再計算できます。
        </p>
        <Link
          href="/compare/sp500-vs-nasdaq100"
          className="block rounded-2xl p-5 space-y-2 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #f59e0b 0%, #7c3aed 50%, #4f46e5 100%)" }}
        >
          <p className="text-xs font-bold text-[#263A53]/80">積立タイムマシン 比較モード</p>
          <p className="text-lg font-black text-[#263A53] leading-tight">
            S&P500とNASDAQ100を<br />実際に比較してみませんか？
          </p>
          <p className="text-xs text-[#263A53]/70">開始年・積立額を自分で設定 ・ 差額をリアルタイム計算</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-sm font-black text-white">比較シミュレーションを開く</span>
            <ArrowRight className="h-4 w-4 text-[#263A53]" />
          </div>
        </Link>
        <Link
          href="/"
          className="block rounded-2xl border border-[#D2DEE4] bg-[#F4F7F8] p-5 space-y-2 transition-all hover:bg-white/[0.08] active:scale-[0.99]"
        >
          <p className="text-xs font-bold text-slate-600">積立タイムマシン</p>
          <p className="text-base font-black text-[#263A53] leading-tight">
            あの時から積み立てていたら<br />いくらになっていた？
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-white"
              style={{ background: "#236B8E" }}
            >
              無料でシミュレーションする
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
        <div className="rounded-xl bg-white border border-[#E1E8EC] p-4 space-y-2">
          <p className="text-xs font-bold text-slate-600">関連ページ</p>
          <ul className="space-y-2">
            {[
              { href: "/guide/sp500-booraku-taisho",  label: "S&P500の過去の下落局面を確認" },
              { href: "/guide/index-shippai-pattern",  label: "インデックス投資の失敗パターン" },
              { href: "/fund/sp500",                   label: "S&P500銘柄詳細ページ" },
              { href: "/fund/nasdaq100",                label: "NASDAQ100銘柄詳細ページ" },
              { href: "/articles/orukan-vs-nasdaq100",  label: "オルカン vs NASDAQ100 比較記事" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-700 transition-colors"
                >
                  <ArrowRight className="h-3 w-3 text-[#236B8E] flex-shrink-0" />
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
