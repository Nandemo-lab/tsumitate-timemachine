import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Globe,
  Flag,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { simulate, formatCurrency } from "@/lib/simulation";
import { FUNDS, formatAnnualReturn, formatExpenseRatio } from "@/lib/funds";
import GuideEeat from "@/components/guide/GuideEeat";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { SectionHeading, SpecCard, SimCard } from "@/components/articles/ArticleBlocks";
import type { ArticleMeta } from "@/lib/article-pages";

// ─── メタデータ ────────────────────────────────────────────────────────────

export const meta: ArticleMeta = {
  slug: "vti-vs-orukan",
  h1: "VTIとオルカンどっち？ETFと投資信託・米国集中と全世界分散を比較",
  metaTitle: "VTIとオルカンどっち？ETFと投資信託、米国集中と全世界分散の違いを比較",
  metaDescription:
    "VTI（バンガード・トータル・ストック・マーケットETF）とオルカン（全世界株式）の違いを過去実績・銘柄数・買い方から比較。ETFと投資信託どちらが積立に向いているか判断材料を整理しました。",
  lastUpdated: "2026年8月",
  publishedAt: "2026-08-04",
  category: "比較コラム",
  ogFundA: "vti",
  ogFundB: "orcan",
  ogYear: 2020,
  ogMonth: 1,
  ogAmount: 30000,
  relatedFunds: ["vti", "orcan"],
  relatedGuides: [
    "nisa-beginner",
    "orukan-ippon-de-ii",
    "nisa-tsumitate-vs-seicho",
    "index-shippai-pattern",
  ],
};

// ─── シミュレーションデータ（lib/funds.ts のみを参照。数値のハードコード禁止） ───

const simVti      = simulate({ fundId: "vti",   startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simOrcan     = simulate({ fundId: "orcan", startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simVtiLong   = simulate({ fundId: "vti",   startYear: 2015, startMonth: 1, monthlyAmount: 30000 });
const simOrcanLong = simulate({ fundId: "orcan", startYear: 2015, startMonth: 1, monthlyAmount: 30000 });

// ─── 目次 ────────────────────────────────────────────────────────────────────

const TOC = [
  "結論：どちらを選ぶべきか",
  "VTIとは？特徴と仕組み",
  "オルカンとは？特徴と仕組み",
  "VTIとオルカンの違いを比較",
  "過去の積立シミュレーションで比較",
  "2022年など暴落時の違い",
  "ETFと投資信託、買い方の違い",
  "新NISAではどちらが向いているか",
  "こんな人はVTI",
  "こんな人はオルカン",
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
          「米国市場全体に投資するETF」VTIと「全世界に分散する投資信託」オルカン。どちらも長期積立の定番として名前が挙がりますが、投資対象の範囲だけでなく、ETFと投資信託という買い方そのものが異なります。この記事では両者の違いを事実ベースで比較し、判断材料を整理します。
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
              "「米国市場にまとめて投資したい」→ VTIが選択肢になる",
              "「世界全体に分散し、証券会社の自動積立で手間をかけたくない」→ オルカンが選択肢になる",
              "「どちらか迷っている」→ つみたて投資枠にも対応するオルカンをコアにし、VTIは成長投資枠で追加する組み合わせもある",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500 leading-relaxed pt-1">
            ※ どちらも低コストで長期積立に使われる商品であり、優劣を断定できるものではありません。投資対象の範囲と買い方の違いで選択が分かれます。
          </p>
        </div>
      </section>

      {/* 1. VTIとは */}
      <section id="section-1" className="space-y-4">
        <SectionHeading index={1} title="VTIとは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          VTI（バンガード・トータル・ストック・マーケットETF）は、バンガード社が運用するETFで、米国の上場株式ほぼ全銘柄を対象にしています。大型株中心のS&P500と異なり、中小型株も含めて{FUNDS.vti.shareCount}をカバーする点が特徴です。日本では楽天証券の「楽天・全米株式インデックス・ファンド（楽天VTI）」として投資信託化されており、証券会社を通じて円建てで積み立てることもできます。
        </p>
        <SpecCard rows={[
          ["対象", "米国上場株式ほぼ全銘柄（1ヵ国）"],
          ["銘柄数", FUNDS.vti.shareCount],
          ["リターン", `2022年 ${formatAnnualReturn("vti", 2022)}`],
          ["経費率", `${formatExpenseRatio("vti")}（ETFとして世界最低水準）`],
          ["新NISA対応", "成長投資枠（ETF）／楽天VTIはつみたて投資枠にも対応"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          米国市場を「1銘柄漏らさずまとめて買う」設計のため、S&P500より裾野の広い米国分散ができます。ETF本体（VTI）は米国市場での売買が必要ですが、楽天VTIのような投資信託経由であれば国内証券会社から円貨で積立設定ができます。
        </p>
      </section>

      {/* 2. オルカンとは */}
      <section id="section-2" className="space-y-4">
        <SectionHeading index={2} title="オルカンとは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          「オルカン」は<strong className="text-white">「eMAXIS Slim全世界株式（オール・カントリー）」</strong>の愛称で、MSCI ACWI（All Country World Index）に連動する投資信託です。先進国・新興国を合わせた{FUNDS.orcan.shareCount}をカバーし、時価総額の比率に応じて世界全体に自動で分散投資します。
        </p>
        <SpecCard rows={[
          ["対象", "先進国・新興国（全世界）"],
          ["銘柄数", FUNDS.orcan.shareCount],
          ["リターン", `2022年 ${formatAnnualReturn("orcan", 2022)}`],
          ["経費率", `${formatExpenseRatio("orcan")}（投資信託として最安クラス）`],
          ["新NISA対応", "積立投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          米国だけでなく日本・欧州・新興国も含めて世界全体へ分散されるのが最大の特徴です。証券会社の100円からの自動積立に対応しており、投資信託として購入・売却の手間が少ない設計になっています。
        </p>
      </section>

      {/* 3. 比較表 */}
      <section id="section-3" className="space-y-4">
        <SectionHeading index={3} title="VTIとオルカンの違いを比較" />
        <div className="rounded-xl overflow-hidden border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.05]">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-zinc-400 w-1/3">項目</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-blue-400">
                  <Flag className="h-3 w-3 inline mr-1" />VTI
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-indigo-400">
                  <Globe className="h-3 w-3 inline mr-1" />オルカン
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {[
                ["投資対象",       "米国上場株式ほぼ全銘柄（1ヵ国）",     "先進国・新興国（全世界）"],
                ["銘柄数",         FUNDS.vti.shareCount,                 FUNDS.orcan.shareCount],
                ["形式",           "ETF（楽天VTIは投資信託）",            "投資信託"],
                ["2022年リターン", formatAnnualReturn("vti", 2022),       formatAnnualReturn("orcan", 2022)],
                ["2023年リターン", formatAnnualReturn("vti", 2023),       formatAnnualReturn("orcan", 2023)],
                ["経費率",         formatExpenseRatio("vti"),             formatExpenseRatio("orcan")],
                ["NISA対応",       "○ 成長投資枠（楽天VTIはつみたても可）", "○ つみたて・成長両対応"],
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
          ※経費率・年間リターンはlib/funds.tsのデータに基づく参考値です。ETF本体VTIの経費率は米国上場ETFとしての水準、楽天VTI（投資信託）は別途信託報酬が設定されています。
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
            <SimCard name="VTI" color={FUNDS.vti.color} sim={simVti} />
            <SimCard name="オルカン" color={FUNDS.orcan.color} sim={simOrcan} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400">
            【2015年1月〜2025年6月】毎月{formatCurrency(30000)}積立
          </p>
          <div className="grid grid-cols-2 gap-3">
            <SimCard name="VTI" color={FUNDS.vti.color} sim={simVtiLong} />
            <SimCard name="オルカン" color={FUNDS.orcan.color} sim={simOrcanLong} />
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-1.5">
          <p className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            読み取れること
          </p>
          <ul className="space-y-1.5 pl-5">
            {[
              "過去の成績では米国集中のVTIが全世界分散のオルカンを上回っている期間が多い",
              "両者は値動きの傾向が近く、大きな乖離が続くわけではない",
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
              body: `2022年のVTIは${formatAnnualReturn("vti", 2022)}、オルカンは${formatAnnualReturn("orcan", 2022)}でした。米国市場全体が下落した局面では、米国比率が約6割のオルカンも連動して下落しますが、非米国資産を含む分だけ振れ幅がやや異なります。`,
              diff: "両者とも下落、振れ幅に差",
              diffColor: "text-amber-400",
            },
            {
              event: "コロナショック後の回復局面（2020年）",
              body: `2020年のVTIは${formatAnnualReturn("vti", 2020)}、オルカンは${formatAnnualReturn("orcan", 2020)}でした。米国株比率が高いオルカンも米国市場の回復の恩恵を受けましたが、VTIは米国100%であるためより直接的に反映されました。`,
              diff: "VTIの方が米国相場に直結",
              diffColor: "text-blue-400",
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
            VTIは米国市場に100%連動するため、米国の景気動向・金利政策の影響を直接受けます。オルカンは非米国資産も含むため、米国以外の地域の動きが下支え・下押しの両方に働くことがあります。
          </p>
        </div>
      </section>

      {/* 6. ETFと投資信託の違い */}
      <section id="section-6" className="space-y-4">
        <SectionHeading index={6} title="ETFと投資信託、買い方の違い" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          VTIとオルカンを比較するうえで、投資対象の違いと同じくらい重要なのが「買い方」の違いです。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <ul className="space-y-2">
            {[
              "VTI（ETF本体）は米国市場の取引時間中に、株式と同じように口数単位で売買する",
              "オルカンは投資信託のため、証券会社で金額指定・100円から自動積立の設定ができる",
              "楽天VTIのようにVTIを投資信託化した商品であれば、オルカンと同じ感覚で円貨積立ができる",
              "ETF本体は購入のたびに為替（円→ドル）が発生し、投資信託は基準価格ベースで円建て取引になる",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          「自動積立の手軽さ」を重視する場合はオルカン、または投資信託化された楽天VTIが選ばれます。「ETFとして自分のタイミングで売買したい」場合はVTI本体が選択肢になります。
        </p>
      </section>

      {/* 7. 新NISA */}
      <section id="section-7" className="space-y-4">
        <SectionHeading index={7} title="新NISAではどちらが向いているか" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          新NISA（2024年〜）のつみたて投資枠は、金融庁の基準を満たした投資信託・ETFのみが対象です。オルカンはつみたて投資枠・成長投資枠の両方で購入できますが、VTI（ETF本体）は成長投資枠での購入となります。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-300">新NISAで選ぶ際のポイント</p>
          <ul className="space-y-2">
            {[
              "オルカンはつみたて投資枠（年120万円）・成長投資枠の両方で積立設定が可能",
              "VTI（ETF本体）は成長投資枠（年240万円）内での購入となる",
              "楽天VTI（投資信託）はつみたて投資枠での積立にも対応する商品として扱われている場合がある",
              "証券会社によって取扱商品が異なるため、購入前に対応状況の確認が必要",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. こんな人はVTI */}
      <section id="section-8" className="space-y-4">
        <SectionHeading index={8} title="こんな人はVTI" />
        <div className="rounded-xl bg-blue-500/6 border border-blue-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="h-4 w-4 text-blue-400" />
            <p className="text-sm font-bold text-blue-200">VTIが向いている人</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "米国市場に集中して投資したい人",
              "S&P500より広く、中小型株も含めて米国全体をカバーしたい人",
              "ETFとして自分のタイミングで売買したい人",
              "米国が今後も世界経済をけん引すると考える人",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-blue-400 font-bold flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9. こんな人はオルカン */}
      <section id="section-9" className="space-y-4">
        <SectionHeading index={9} title="こんな人はオルカン" />
        <div className="rounded-xl bg-indigo-500/6 border border-indigo-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-4 w-4 text-indigo-400" />
            <p className="text-sm font-bold text-indigo-200">オルカンが向いている人</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "米国以外の地域にも分散したい人",
              "証券会社の自動積立で手間をかけずに続けたい初心者",
              "つみたて投資枠をフル活用したい人",
              "1本でシンプルに世界経済全体に投資したい人",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-indigo-400 font-bold flex-shrink-0">→</span>
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
              q: "VTIとオルカンの違いは何ですか？",
              a: `VTI（バンガード・トータル・ストック・マーケットETF）は米国の上場株式ほぼ全銘柄（${FUNDS.vti.shareCount}）に投資するETFです。オルカン（eMAXIS Slim 全世界株式）は先進国・新興国合わせて${FUNDS.orcan.shareCount}に投資する投資信託です。VTIは米国100%、オルカンは全世界分散という点が最大の違いです。`,
            },
            {
              q: "分散性が高いのはVTIとオルカンのどちらですか？",
              a: "国際分散という意味ではオルカンが上です。オルカンは米国以外の先進国・新興国にも投資しています。一方VTIは米国のみですが、米国内では中小型株も含めた幅広い銘柄分散が行われています。「世界全体への分散」ならオルカン、「米国内での徹底分散」ならVTIという違いです。",
            },
            {
              q: "初心者にはVTIとオルカンのどちらが購入しやすいですか？",
              a: "オルカンは証券会社で100円から金額指定・自動積立ができ、新NISAのつみたて投資枠でも購入できます。VTI（ETF本体）は米国市場での口数単位の売買が必要です。ただし楽天VTIのように投資信託化された商品を選べば、オルカンと同じ感覚で円貨積立ができます。",
            },
            {
              q: "新NISAならVTIとオルカンどちらが向いていますか？",
              a: "つみたて投資枠を使って毎月自動積立したい場合はオルカンが使いやすい商品です。VTI（ETF本体）は成長投資枠での購入となります。証券会社によっては楽天VTIのようにつみたて投資枠に対応した投資信託形態も選べるため、購入前に取扱商品を確認する必要があります。",
            },
            {
              q: "手数料はVTIとオルカンのどちらが安いですか？",
              a: `経費率ではETF本体のVTIが${formatExpenseRatio("vti")}、オルカンは${formatExpenseRatio("orcan")}です。どちらも業界最低水準に位置しており、手数料の差が長期的な結果を大きく左右する水準ではありません。`,
            },
            {
              q: "VTIとオルカンを両方持つのはありですか？",
              a: "見られる組み合わせの一つです。オルカンをコアとして世界分散を確保しつつ、VTIで米国への配分を厚くする方法です。ただしオルカンにも米国株が含まれるため、両方持つと結果的に米国比率がさらに高まる点は理解しておく必要があります。",
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
        <p className="text-xs font-bold text-zinc-300">まとめ：投資対象の範囲と買い方の違い</p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          VTIは米国市場への集中投資、オルカンは全世界への分散投資という違いに加え、ETFと投資信託という買い方の違いもあります。どちらが絶対に優れているという答えはなく、<strong className="text-zinc-200">投資対象の範囲をどこまで広げたいか、自動積立の手軽さを重視するか</strong>で選択が分かれます。
        </p>
      </div>

      <DisclaimerBar />

      {/* 11. CTA */}
      <section id="section-11" className="space-y-4">
        <SectionHeading index={11} title="積立タイムマシンで実際に確かめよう" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          実際にVTIとオルカンを同じ条件で積み立てた場合の結果は、シミュレーションでも確認できます。
          あなた自身の開始年・毎月の積立額で、リアルな数字を体感できます。
        </p>
        <Link
          href="/compare/vti-vs-orukan"
          className="block rounded-2xl p-5 space-y-2 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #4f46e5 100%)" }}
        >
          <p className="text-xs font-bold text-white/80">積立タイムマシン 比較モード</p>
          <p className="text-lg font-black text-white leading-tight">
            VTIとオルカンを<br />実際に比較してみませんか？
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
              { href: "/guide/orukan-ippon-de-ii",          label: "オルカン一本でいい？詳しく解説" },
              { href: "/guide/nisa-tsumitate-vs-seicho",    label: "つみたて投資枠 vs 成長投資枠" },
              { href: "/fund/vti",                          label: "VTI銘柄詳細ページ" },
              { href: "/fund/orukan",                       label: "オルカン銘柄詳細ページ" },
              { href: "/compare/vti-vs-sp500",              label: "VTI vs S&P500 比較" },
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
