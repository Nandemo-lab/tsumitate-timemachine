import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Coins,
  Flag,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { simulate, formatCurrency } from "@/lib/simulation";
import { FUNDS, formatAnnualReturn, formatExpenseRatio } from "@/lib/funds";
import { NISA_SYSTEM_DISCLAIMER } from "@/lib/nisa";
import GuideEeat from "@/components/guide/GuideEeat";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { SectionHeading, SpecCard, SimCard } from "@/components/articles/ArticleBlocks";
import type { ArticleMeta } from "@/lib/article-pages";

// ─── メタデータ ────────────────────────────────────────────────────────────

export const meta: ArticleMeta = {
  slug: "schd-vs-sp500",
  h1: "SCHDとS&P500どっち？配当重視と成長重視を過去実績で比較",
  metaTitle: "SCHDとS&P500どっち？配当重視と成長重視、どちらが向いているかを比較",
  metaDescription:
    "米国ETF SCHDとS&P500連動投信の特徴・配当・値動きを比較。SCHDの実績値は原典検証中の参考データとして分離して表示します。",
  lastUpdated: "2026年7月",
  publishedAt: "2026-07-06",
  category: "比較コラム",
  ogFundA: "schd",
  ogFundB: "sp500",
  ogYear: 2020,
  ogMonth: 1,
  ogAmount: 30000,
  relatedFunds: ["schd", "sp500"],
  relatedGuides: [
    "nisa-beginner",
    "sp500-booraku-taisho",
    "nisa-wariate-osusume",
    "tsumitate-nansnen-keizoku",
  ],
};

// ─── シミュレーションデータ ─────────────────────────────────────────────────

const simSchd     = simulate({ fundId: "schd",  startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simSp500    = simulate({ fundId: "sp500", startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simSchdLong  = simulate({ fundId: "schd",  startYear: 2018, startMonth: 8, monthlyAmount: 30000 });
const simSp500Long = simulate({ fundId: "sp500", startYear: 2018, startMonth: 8, monthlyAmount: 30000 });

// ─── 目次 ────────────────────────────────────────────────────────────────────

const TOC = [
  "結論：どちらを選ぶべきか",
  "SCHDとは？特徴と仕組み",
  "S&P500とは？特徴と仕組み",
  "SCHDとS&P500の違いを比較",
  "過去の積立シミュレーションで比較",
  "2022年など暴落時の違い",
  "配当金の違い",
  "新NISAではどちらが向いているか",
  "こんな人はSCHD",
  "こんな人はS&P500",
  "よくある質問",
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
          「配当を受け取りながら育てるSCHD」と「値上がり益で資産を最大化するS&P500」。どちらも新NISAで人気の米国株投資先ですが、リターンの出方や下落局面での動きに違いがあります。この記事では両者の違いを事実ベースで比較し、どちらが自分の投資目的に合っているかを判断する材料を提供します。
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
        <SectionHeading index={0} title="結論：どちらを選ぶべきか" />
        <div className="rounded-xl bg-indigo-500/8 border border-indigo-500/20 p-5 space-y-3">
          <p className="text-sm font-bold text-indigo-200">先に結論をお伝えします。</p>
          <ul className="space-y-2">
            {[
              "四半期分配を行うUSD建て米国ETFを検討する場合はSCHDの商品性を確認",
              "分配金をファンド内で再投資する円建て国内投信を利用したい場合はS&P500の商品性を確認",
              "商品形態・通貨・分配方針が異なり、未検証の実績値から優劣や配分を決めない",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500 leading-relaxed pt-1">
            ※ どちらも米国株への投資であり、優劣を断定できるものではありません。配当収入を重視するか、資産の最大化を重視するかで選択が分かれます。
          </p>
        </div>
      </section>

      {/* 1. SCHDとは */}
      <section id="section-1" className="space-y-4">
        <SectionHeading index={1} title="SCHDとは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          SCHD（Schwab U.S. Dividend Equity ETF）は、Schwab Asset Managementが運用するUSD建ての米国高配当ETFです。Dow Jones U.S. Dividend 100 Indexへの連動を目指し、財務健全性や増配実績などを基準に銘柄を選定します。SCHDを主要投資対象とする国内投信は、米国ETF SCHDとは別商品です。
        </p>
        <SpecCard rows={[
          ["対象", "米国高配当株（財務優良約100社）"],
          ["銘柄数", FUNDS.schd.shareCount],
          ["分配利回り", "時点により変動（公式値を確認）"],
          ["経費率", formatExpenseRatio("schd")],
          ["商品形態", "USD建て米国ETF"],
          ["データ品質", "G：参考データ・原典未検証"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          「配当を増やし続けられる財務優良企業」に的を絞っているのが特徴です。値上がり益より配当収入を重視する設計のため、S&P500と比べると株価の伸びは穏やかになる傾向があります。
        </p>
      </section>

      {/* 2. S&P500とは */}
      <section id="section-2" className="space-y-4">
        <SectionHeading index={2} title="S&P500とは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          S&P500は、米国の代表的企業500社で構成される株価指数です。アップル・マイクロソフト・エヌビディア・アマゾンといった大型企業に加え、金融・ヘルスケア・生活必需品など全業種をカバーします。日本では「eMAXIS Slim米国株式（S&P500）」が最も人気のある商品です。
        </p>
        <SpecCard rows={[
          ["対象", "米国大型株500社（全業種）"],
          ["銘柄数", FUNDS.sp500.shareCount],
          ["分配方針", "ファンド内で再投資"],
          ["信託報酬", formatExpenseRatio("sp500")],
          ["新NISA対応", "つみたて投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          このページで扱うeMAXIS Slim 米国株式（S&amp;P500）は、分配金再投資基準価額を用いて商品設定後の実績を検証しています。米国ETF SCHDとは商品形態・通貨・分配方針が異なります。
        </p>
      </section>

      {/* 3. 比較表 */}
      <section id="section-3" className="space-y-4">
        <SectionHeading index={3} title="SCHDとS&P500の違いを比較" />
        <div className="rounded-xl overflow-hidden border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.05]">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-zinc-400 w-1/3">項目</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-emerald-400">
                  <Coins className="h-3 w-3 inline mr-1" />SCHD
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-amber-400">
                  <Flag className="h-3 w-3 inline mr-1" />S&P500
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {[
                ["投資対象",     "米国高配当株（財務優良約100社）", "米国大型株500社（全業種）"],
                ["銘柄数",       FUNDS.schd.shareCount,             FUNDS.sp500.shareCount],
                ["分配・配当",   "四半期分配（利回りは変動）",     "ファンド内で再投資"],
                ["リターン特性", "配当中心・値上がりやや低め",       "値上がり重視・配当は低め"],
                ["リスク",       "中低",                            "中"],
              ["信託報酬・経費率", formatExpenseRatio("schd"), formatExpenseRatio("sp500")],
                ["NISA対応",     "○ 成長投資枠（投信もあり）",       "○ つみたて・成長両対応"],
              ].map(([k, a, b]) => (
                <tr key={k} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-xs text-zinc-400 font-medium">{k}</td>
                  <td className="px-4 py-3 text-xs text-zinc-200">{a}</td>
                  <td className="px-4 py-3 text-xs text-zinc-200">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
            ※SCHDは米国ETFの経費率、S&amp;P500はeMAXIS Slim米国株式（S&amp;P500）の信託報酬です。楽天SCHDは別商品です。
        </p>
      </section>

      {/* 4. 過去シミュレーション */}
      <section id="section-4" className="space-y-4">
        <SectionHeading index={4} title="過去の積立シミュレーションで比較" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          S&amp;P500は検証済み月次実績、SCHDは原典未検証の参考系列を使った比較です。両者のデータ品質は同一ではありません。
        </p>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400">
            【2020年1月〜2025年6月】毎月{formatCurrency(30000)}積立
          </p>
          <div className="grid grid-cols-2 gap-3">
            <SimCard name="SCHD" color="#10b981" sim={simSchd} />
            <SimCard name="S&P500" color="#f59e0b" sim={simSp500} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400">
              【2018年8月〜2025年6月】毎月{formatCurrency(30000)}積立（S&amp;P500投信の公式実績開始後）
          </p>
          <div className="grid grid-cols-2 gap-3">
            <SimCard name="SCHD" color="#10b981" sim={simSchdLong} />
            <SimCard name="S&P500" color="#f59e0b" sim={simSp500Long} />
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-1.5">
          <p className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            読み取れること
          </p>
          <ul className="space-y-1.5 pl-5">
            {[
              "S&P500は検証済み月次実績、SCHDは原典未検証の参考系列であり、同じ確度では比較できない",
              "SCHDの参考値は、検証済み実績ランキングや優劣判断には使用しない",
              "開始年・期間によって差は変動する（特定の期間が未来を保証しない）",
            ].map((t, i) => (
              <li key={i} className="text-xs text-zinc-400 list-disc">{t}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          ※SCHDは「G：参考データ・原典未検証」です。S&amp;P500の「A：公式月次データ」と同じ精度の実績としては扱えません。詳しくはデータ出典ページをご確認ください。
        </p>
      </section>

      {/* 5. 暴落時 */}
      <section id="section-5" className="space-y-4">
        <SectionHeading index={5} title="2022年など暴落時の違い" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          下落局面での値動きの差は、この2商品を比較するうえで重要なポイントです。
        </p>
        <div className="space-y-3">
          {[
            {
              event: "インフレ・利上げショック（2022年）",
              body: `eMAXIS Slim 米国株式（S&P500）の2022年の円ベース・分配金再投資込みの暦年リターンは${formatAnnualReturn("sp500", 2022)}でした。一方、当サイトのSCHD系列はG品質（参考データ・原典未検証）のため、同じ条件・確度の数値として直接比較できません。暦年リターンは年中の最大下落率でもありません。`,
              diff: "SCHDは検証済み数値との直接比較対象外",
              diffColor: "text-emerald-400",
            },
            {
              event: "コロナショック（2020年2〜3月）",
              body: "コロナショック時の最大下落率や回復期間を、現在の検証済み月次台帳では同一条件で比較していません。SCHDはG品質のため、回復速度の優劣を実績として断定しません。",
              diff: "回復期間は同一条件で未検証",
              diffColor: "text-amber-400",
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
            高配当株中心という商品特性だけで、将来の下落耐性や回復速度が保証されるわけではありません。SCHDの検証済み月次実績が揃うまでは、S&amp;P500との数値比較を参考情報としても優劣判断に使用しません。
          </p>
        </div>
      </section>

      {/* 6. 配当金の違い */}
      <section id="section-6" className="space-y-4">
        <SectionHeading index={6} title="配当金の違い" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          SCHDは四半期分配を行う米国ETF、eMAXIS Slim 米国株式（S&amp;P500）はファンド内で分配金を再投資する円建て国内投信です。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <ul className="space-y-2">
            {[
              "SCHDは四半期ごとに分配金を受け取る商品設計で、分配利回りは市場価格と分配実績により変動する",
              "eMAXIS Slim 米国株式（S&P500）は分配金再投資基準価額で実績を検証している",
              "配当は受け取った時点で課税対象となり、再投資しない場合は複利効果が限定的になる",
              "NISA口座では国内課税は非課税になるが、米国側の外国源泉税（10%）は控除される",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          分配金を受け取るかファンド内で再投資するかにより、資金の受取方法と税務が異なります。将来の資産額は市場環境・税務・再投資の有無で変わるため、商品形態だけから優劣は断定できません。
        </p>
      </section>

      {/* 7. 新NISA */}
      <section id="section-7" className="space-y-4">
        <SectionHeading index={7} title="新NISAではどちらが向いているか" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          eMAXIS Slim 米国株式（S&amp;P500）は、つみたて投資枠と成長投資枠の対象です。米国ETF SCHDの取扱い・NISA区分は証券会社で確認が必要です。SCHDを主要投資対象とする国内投信は別商品で、商品ごとに取扱いと対象枠が異なります。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-300">新NISAで選ぶ際のポイント</p>
          <ul className="space-y-2">
            {[
              "S&P500はつみたて投資枠・成長投資枠の両方で積立設定が可能",
              `米国ETF SCHDとSCHD連動国内投信は別商品で、NISA区分・費用・税務も異なる。${NISA_SYSTEM_DISCLAIMER}`,
              "SCHDは分配金を受け取る米国ETF、S&P500投信はファンド内再投資という商品形態の違いがある",
              "保有目的・税務・外貨での売買を確認し、一律の配分を前提にしない",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. こんな人はSCHD */}
      <section id="section-8" className="space-y-4">
        <SectionHeading index={8} title="こんな人はSCHD" />
        <div className="rounded-xl bg-emerald-500/6 border border-emerald-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-bold text-emerald-200">SCHDが向いている人</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "配当という形で定期的な現金収入を得たい人",
              "老後の生活費補填を見据えた運用を考えている人",
              "Dow Jones U.S. Dividend 100 Indexの銘柄選定方法を確認した人",
              "財務優良企業に絞った銘柄選定を重視する人",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-emerald-400 font-bold flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9. こんな人はS&P500 */}
      <section id="section-9" className="space-y-4">
        <SectionHeading index={9} title="こんな人はS&P500" />
        <div className="rounded-xl bg-amber-500/6 border border-amber-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-bold text-amber-200">S&P500が向いている人</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "分配金をファンド内で再投資する国内投信を利用したい人",
              "つみたて投資枠を使って新NISAをフル活用したい人",
              "配当より値上がり益による複利効果を重視したい人",
              "資産形成期（20〜50代）で長期積立を続けたい人",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-amber-400 font-bold flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 10. よくある質問 */}
      <section id="section-10" className="space-y-4">
        <SectionHeading index={10} title="よくある質問" />
        <div className="space-y-3">
          {[
            {
              q: "SCHDとS&P500はトータルリターンでどちらが高いですか？",
              a: "当サイトでは、S&P500はA品質の検証済み月次実績、SCHDはG品質の原典未検証データです。このため、両者のトータルリターンの優劣を同じ確度で判定していません。配当を受け取るか再投資するかでも結果は変わります。",
            },
            {
              q: "配当投資とインデックス投資はどちらが得ですか？",
              a: "商品形態、分配金の扱い、税務、保有期間によって結果は変わります。SCHDは四半期分配を行う米国ETF、eMAXIS Slim 米国株式（S&P500）はファンド内で分配金を再投資する国内投信です。この違いだけから将来の資産額の優劣は断定できません。",
            },
            {
              q: "新NISAではSCHDとS&P500どちらが有利ですか？",
              a: "eMAXIS Slim 米国株式（S&P500）と米国ETF SCHDでは、商品形態・通貨・分配方針が異なります。NISAでの取扱いも同一ではないため、利用する証券会社の商品ページで確認してください。SCHD連動国内投信は米国ETF SCHDとは別商品です。",
            },
            {
              q: "SCHDとS&P500を両方持つのはありですか？",
              a: "見られる組み合わせの一つです。S&P500で資産成長を狙いながら、SCHDで配当収入を確保する方法です。ただし両者は重複する銘柄も含まれるため、完全な分散にはならない点に注意が必要です。",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-white/8 p-5"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <p className="font-bold text-white text-sm mb-2 leading-snug">Q. {faq.q}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* まとめ */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2">
        <p className="text-xs font-bold text-zinc-300">まとめ：配当重視と成長重視の違い</p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          SCHDは四半期分配を行うUSD建て米国ETF、eMAXIS Slim 米国株式（S&amp;P500）はファンド内で分配金を再投資する円建て国内投信です。SCHDの系列はG品質のため、<strong className="text-zinc-200">両者のトータルリターンや将来の資産額の優劣は判定していません</strong>。
        </p>
      </div>

      <DisclaimerBar />

      {/* 11. CTA */}
      <section id="section-11" className="space-y-4">
        <SectionHeading index={11} title="積立タイムマシンで実際に確かめよう" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          実際にSCHDとS&P500を同じ条件で積み立てた場合の結果は、シミュレーションでも確認できます。
          あなた自身の開始年・毎月の積立額で、リアルな数字を体感できます。
        </p>
        <Link
          href="/compare/schd-vs-sp500"
          className="block rounded-2xl p-5 space-y-2 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #10b981 0%, #f59e0b 50%, #4f46e5 100%)" }}
        >
          <p className="text-xs font-bold text-white/80">積立タイムマシン 比較モード</p>
          <p className="text-lg font-black text-white leading-tight">
            SCHDとS&P500を<br />実際に比較してみませんか？
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
              { href: "/schd",                          label: "米国ETF SCHDとは？特徴を解説" },
              { href: "/compare/schd-vs-vym",           label: "SCHD vs VYM 比較" },
              { href: "/fund/schd",                     label: "SCHD銘柄詳細ページ" },
              { href: "/fund/sp500",                    label: "S&P500銘柄詳細ページ" },
              { href: "/articles/schd-vs-vym",          label: "SCHD vs VYM 比較記事" },
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
