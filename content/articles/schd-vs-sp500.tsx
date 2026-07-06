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
import GuideEeat from "@/components/guide/GuideEeat";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { SectionHeading, SpecCard, SimCard } from "@/components/articles/ArticleBlocks";
import type { ArticleMeta } from "@/lib/article-pages";

// ─── メタデータ ────────────────────────────────────────────────────────────

export const meta: ArticleMeta = {
  slug: "schd-vs-sp500",
  h1: "SCHDとS&P500どっち？配当重視と成長重視を過去実績で比較",
  metaTitle: "SCHDとS&P500どっち？配当重視と成長重視、どちらが向いているかを比較 | 積立タイムマシン",
  metaDescription:
    "楽天SCHDとS&P500のトータルリターン・配当利回り・暴落耐性を過去データで比較。配当収入を重視するか、資産の最大化を重視するか、判断材料を整理しました。",
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
const simSchdLong  = simulate({ fundId: "schd",  startYear: 2016, startMonth: 1, monthlyAmount: 30000 });
const simSp500Long = simulate({ fundId: "sp500", startYear: 2016, startMonth: 1, monthlyAmount: 30000 });

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
              "「配当を定期的な収入として受け取りたい」→ SCHDが向いている",
              "「トータルリターン・資産の最大化を優先したい」→ S&P500が向いている",
              "「どちらか迷っている」→ 資産形成期はS&P500、取り崩し期にSCHDという段階的な使い分けもある",
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
          SCHD（Schwab U.S. Dividend Equity ETF）は、シュワブが運用する米国高配当ETFです。配当利回りだけでなく財務健全性・増配継続実績を重視したスクリーニングで約100銘柄に絞り込んでいます。日本では「楽天・高配当株式・米国ファンド（楽天SCHD）」として投資信託化されています。
        </p>
        <SpecCard rows={[
          ["対象", "米国高配当株（財務優良約100社）"],
          ["銘柄数", "約100銘柄"],
          ["配当利回り", "約3.5〜4.0%（目安）"],
          ["信託報酬", "年0.192%（投資信託）"],
          ["新NISA対応", "成長投資枠（投信もあり）"],
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
          ["銘柄数", "500銘柄"],
          ["配当利回り", "約1.2〜1.5%（目安）"],
          ["信託報酬", "年0.09372%"],
          ["新NISA対応", "積立投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          配当よりも企業の成長・値上がり益を反映する設計のため、配当利回りはSCHDより低めです。過去数十年にわたり世界の主要指数の中でも高いトータルリターンを記録してきた実績があります。
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
                ["銘柄数",       "約100銘柄",                      "500銘柄"],
                ["配当利回り",   "約3.5〜4.0%",                    "約1.2〜1.5%"],
                ["リターン特性", "配当中心・値上がりやや低め",       "値上がり重視・配当は低め"],
                ["リスク",       "中低",                            "中"],
                ["信託報酬",     "0.192%（投信）",                  "0.09372%"],
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
          ※信託報酬は楽天・高配当株式・米国ファンド、eMAXIS Slim米国株式（S&P500）の2025年6月時点の税込水準に基づく参考値。
        </p>
      </section>

      {/* 4. 過去シミュレーション */}
      <section id="section-4" className="space-y-4">
        <SectionHeading index={4} title="過去の積立シミュレーションで比較" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          実際の運用成績データをもとに、積立タイムマシンのシミュレーション機能で計算した結果です。
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
            【2016年1月〜2025年6月】毎月{formatCurrency(30000)}積立
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
              "過去の成績ではS&P500がSCHDを上回っている期間が多い",
              "SCHDはS&P500と比べて値動きが穏やかな傾向がある",
              "開始年・期間によって差は変動する（特定の期間が未来を保証しない）",
            ].map((t, i) => (
              <li key={i} className="text-xs text-zinc-400 list-disc">{t}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          ※過去の実績データに基づくシミュレーションです。配当再投資込み・手数料・税金は考慮外。将来の成果を保証するものではありません。
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
              body: "2022年のSCHDは約−3.4%の下落に留まったのに対し、S&P500は約−18.4%と大きく下落しました。財務優良な高配当株（公益・生活必需品・金融など）を多く含むSCHDは、テック株主導の下落局面で相対的に穏やかに推移しました。",
              diff: "SCHDの下落幅が小さい",
              diffColor: "text-emerald-400",
            },
            {
              event: "コロナショック（2020年2〜3月）",
              body: "両者ともに急落しましたが、その後の回復局面ではテクノロジー株の比率が高いS&P500の方が急速に回復しました。SCHDは財務優良株中心のため、回復ペースはS&P500よりやや緩やかでした。",
              diff: "S&P500の回復が速い",
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
            SCHDの下落耐性は過去の特定局面（2022年）で見られた傾向であり、あらゆる下落局面で同様の結果になるとは限りません。
          </p>
        </div>
      </section>

      {/* 6. 配当金の違い */}
      <section id="section-6" className="space-y-4">
        <SectionHeading index={6} title="配当金の違い" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          配当投資かインデックス投資かを選ぶ際、最も分かりやすい違いが配当利回りです。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <ul className="space-y-2">
            {[
              "SCHDの配当利回りは約3.5〜4.0%（目安）で、四半期ごとに分配金を受け取れる",
              "S&P500の配当利回りは約1.2〜1.5%（目安）で、値上がり益中心の設計",
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
          資産を最大化する観点では、配当を都度受け取るより値上がり益として保有し続ける方が複利効果を得やすいとされています。一方で、配当という形で現金収入を定期的に得られる点は、生活費の補填を目的とする場合に活用されています。
        </p>
      </section>

      {/* 7. 新NISA */}
      <section id="section-7" className="space-y-4">
        <SectionHeading index={7} title="新NISAではどちらが向いているか" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          新NISA（2024年〜）では、S&P500はつみたて投資枠・成長投資枠の両方で購入できます。SCHD（楽天SCHD）は成長投資枠での購入となり、つみたて投資枠には対応していません。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-300">新NISAで選ぶ際のポイント</p>
          <ul className="space-y-2">
            {[
              "S&P500はつみたて投資枠・成長投資枠の両方で積立設定が可能",
              "SCHD（楽天SCHD）は成長投資枠（年240万円）内での購入となる",
              "資産形成期はS&P500、取り崩し期にSCHDを組み合わせる段階的な使い分けもある",
              "両方を組み合わせ、コアをS&P500・配当ポケットをSCHDとする配分も見られる",
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
              "下落局面での値動きの穏やかさを重視したい人",
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
              "資産の最大化・トータルリターンを重視したい人",
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
              a: "過去のデータではS&P500が上回る期間が多く見られます。SCHDは高い配当を出す分、株価の値上がりはS&P500より抑えられる傾向があります。ただし配当を再投資せず生活費に使う場合の「手取り収入」という観点ではSCHDが優位です。",
            },
            {
              q: "配当投資とインデックス投資はどちらが得ですか？",
              a: "資産の最大化という観点では、配当に税金がかかる分だけ再投資効率が下がるため、S&P500のようなインデックス投資が有利とされています。一方SCHDは定期的な現金収入が得られるため、生活費補填や心理的な安定感という点で活用されています。",
            },
            {
              q: "新NISAではSCHDとS&P500どちらが有利ですか？",
              a: "トータルリターンの最大化を目指すならS&P500（つみたて投資枠対応・再投資で複利効果）。配当を非課税で受け取りたい場合はNISA口座でSCHD（楽天SCHD・成長投資枠）という使い方もあります。ただしNISAでも米国側の外国源泉税（10%）は控除されるため、配当が完全非課税にはなりません。",
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
          SCHDは配当収入を重視した安定志向、S&P500は資産の最大化を重視した成長志向という違いがあります。どちらが絶対に優れているという答えはなく、<strong className="text-zinc-200">配当という形の現金収入を重視するか、トータルリターンを重視するか</strong>で選択が分かれます。
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
              { href: "/schd",                          label: "楽天SCHDとは？特徴を解説" },
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
