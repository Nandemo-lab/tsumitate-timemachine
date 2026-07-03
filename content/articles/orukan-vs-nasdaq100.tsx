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
import GuideEeat from "@/components/guide/GuideEeat";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import type { ArticleMeta } from "@/lib/article-pages";

// ─── メタデータ ────────────────────────────────────────────────────────────

export const meta: ArticleMeta = {
  slug: "orukan-vs-nasdaq100",
  h1: "オルカンとNASDAQ100どっち？違い・過去実績・向いている人を徹底比較",
  metaTitle: "オルカンとNASDAQ100どっち？違い・過去実績・どちらが向いているかを比較 | 積立タイムマシン",
  metaDescription:
    "オルカン（全世界株）とNASDAQ100の違いを過去シミュレーション・暴落耐性・コスト・新NISAでの選び方から徹底比較。ハイリターンと安定分散、どちらが自分に向いているか判断できます。",
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
const simOrcanLong  = simulate({ fundId: "orcan",     startYear: 2015, startMonth: 1, monthlyAmount: 30000 });
const simNasdaqLong = simulate({ fundId: "nasdaq100", startYear: 2015, startMonth: 1, monthlyAmount: 30000 });

// ─── 目次 ────────────────────────────────────────────────────────────────────

const TOC = [
  "結論：どちらを選ぶべきか",
  "オルカンとは？特徴と仕組み",
  "NASDAQ100とは？特徴と仕組み",
  "オルカンとNASDAQ100の違いを比較",
  "過去の積立シミュレーションで比較",
  "暴落時の動き方の違い",
  "新NISAではどちらが向いているか",
  "こんな人はオルカン",
  "こんな人はNASDAQ100",
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
          「オルカンで安定を取るか、NASDAQ100でリターンを狙うか」——新NISAで積立を始めた多くの人が一度は迷うポイントです。この記事では両者の違いを事実ベースで比較し、どちらが自分に向いているかを判断する材料を提供します。
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
              "「大きな下落局面でも積立を続けられる自信がある」→ NASDAQ100で攻める選択肢もある",
              "「値動きの大きさに不安を感じる」→ オルカンの世界分散が安心材料になる",
              "「どちらか迷っている」→ オルカンをメインに、NASDAQ100はサテライトとして少額から",
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
          ["銘柄数", "約3,000銘柄（2025年時点）"],
          ["米国比率", "約62%（最大だが1国ではない）"],
          ["信託報酬", "年0.05775%（業界最安水準）"],
          ["新NISA対応", "積立投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          世界中の企業へ自動的に分散されるため、「1本選ぶならまずこれ」という定番の位置づけを持つ商品です。特定のセクターに偏らないため、値動きの振れ幅も比較的穏やかです。
        </p>
      </section>

      {/* 2. NASDAQ100とは */}
      <section id="section-2" className="space-y-4">
        <SectionHeading index={2} title="NASDAQ100とは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          NASDAQ100は、米国ナスダック市場に上場する非金融企業のうち時価総額上位100社で構成される株価指数です。Apple・Microsoft・NVIDIA・Googleなどテクノロジー企業が上位を占め、AI・半導体・クラウドなど成長分野の恩恵を強く受けます。日本では「iFreeNEXT NASDAQ100インデックス」が代表的な商品です。
        </p>
        <SpecCard rows={[
          ["対象", "米国ナスダック非金融上位100社"],
          ["銘柄数", "約100銘柄"],
          ["セクター比率", "テクノロジー中心（金融除く）"],
          ["信託報酬", "年0.495%"],
          ["新NISA対応", "積立投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          2020年+48.8%、2023年+53.8%など爆発的なリターンを記録する年がある一方、2022年は-33.0%と大幅下落した年もあります。ハイリターン・ハイボラティリティという特徴を理解した上で活用することが重要です。
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
                ["銘柄数",     "約3,000銘柄",           "約100銘柄"],
                ["分散度",     "◎ 地域・業種とも分散",   "△ テック業種に集中"],
                ["過去リターン", "○ 安定的な水準",       "◎ 好調期は圧倒的に高い"],
                ["信託報酬",   "0.05775%",              "0.495%"],
                ["下落時の振れ幅", "比較的穏やか",       "非常に大きい（2022年-33%）"],
                ["向いている使い方", "コア（主力）向き",  "サテライト（一部）向き"],
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
          ※信託報酬はeMAXIS Slim全世界株式（オール・カントリー）、iFreeNEXT NASDAQ100インデックスの2025年6月時点の税込数値。
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
            <SimCard name="オルカン" color="#6366f1" sim={simOrcan} />
            <SimCard name="NASDAQ100" color="#8b5cf6" sim={simNasdaq} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400">
            【2015年1月〜2025年6月】毎月{formatCurrency(30000)}積立
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
              "過去の成績ではNASDAQ100がオルカンを大きく上回っている期間が多い",
              "ただしNASDAQ100は下落局面での振れ幅もオルカンよりはるかに大きい",
              "開始年・期間によって差は大きく変動する（特定の期間が未来を保証しない）",
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
        <SectionHeading index={5} title="暴落時の動き方の違い" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          下落局面での値動きの差は、この2商品を比較するうえで最も重要なポイントです。
        </p>
        <div className="space-y-3">
          {[
            {
              event: "コロナショック（2020年2〜3月）",
              body: "両者ともに急落しましたが、NASDAQ100の方が下落幅・回復速度ともに大きく、その後のテック株主導の急回復では圧倒的なリターンを記録しました。",
              diff: "NASDAQ100の方が振れ幅大",
              diffColor: "text-violet-400",
            },
            {
              event: "インフレ・利上げショック（2022年）",
              body: "NASDAQ100は約-33.0%の大幅下落。オルカンは-18〜20%程度に留まりました。金利上昇局面ではグロース株中心のNASDAQ100が特に大きな影響を受けます。",
              diff: "NASDAQ100が大きく劣後",
              diffColor: "text-amber-400",
            },
            {
              event: "2023年のテック株回復局面",
              body: "AI関連銘柄の急成長を背景に、NASDAQ100は+53.8%という高い回復を見せました。オルカンも上昇しましたが、回復幅では大きな差がつきました。",
              diff: "NASDAQ100の回復力が際立つ",
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
            NASDAQ100は好調期のリターンが大きい分、下落局面での振れ幅も非常に大きい商品です。「下がったときに積立をやめてしまう」ことが最大のリスクになります。続けられる金額・比率で保有することが重要です。
          </p>
        </div>
      </section>

      {/* 6. 新NISA */}
      <section id="section-6" className="space-y-4">
        <SectionHeading index={6} title="新NISAではどちらが向いているか" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          新NISA（2024年〜）の積立投資枠では、どちらも年間120万円まで非課税で積み立てられます。成長投資枠も合わせると年間360万円、生涯1,800万円の非課税枠を活用できます。
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          金融庁は「長期・積立・分散」の原則を推奨しています。この観点からは、まず47カ国・約3,000銘柄に分散するオルカンをコアに据え、NASDAQ100はリスク許容度に応じてサテライトとして組み合わせる方法が一般的です。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-300">新NISAで選ぶ際のポイント</p>
          <ul className="space-y-2">
            {[
              "どちらも積立投資枠・成長投資枠で購入可能",
              "毎月定額の積立ならどちらもドルコスト平均法の効果を受けられる",
              "「オルカンをコア、NASDAQ100をサテライト」という組み合わせも人気",
              "NASDAQ100を単独で全額投資するのは初心者にはリスクが高い",
              "どちらか一方に決めたら、下落時にも積立を続けられるかが最重要",
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
        <SectionHeading index={7} title="こんな人はオルカン" />
        <div className="rounded-xl bg-indigo-500/6 border border-indigo-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-4 w-4 text-indigo-400" />
            <p className="text-sm font-bold text-indigo-200">オルカンが向いている人</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "「大きな値下がりで不安になりたくない」人",
              "投資の細かい判断をできるだけ減らしたい初心者",
              "1本だけでシンプルに世界経済全体に投資したい人",
              "10〜20年以上の超長期でコツコツ資産形成したい人",
              "特定のセクターへの集中リスクを避けたい人",
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
        <SectionHeading index={8} title="こんな人はNASDAQ100" />
        <div className="rounded-xl bg-violet-500/6 border border-violet-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-4 w-4 text-violet-400" />
            <p className="text-sm font-bold text-violet-200">NASDAQ100が向いている人</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "「今後もAI・テクノロジーの成長が続く」と考える人",
              "オルカンより高いリターンを狙いたい上級者",
              "-30%クラスの下落でも積立を止めずに続けられる人",
              "長期（10年以上）保有を前提にできる人",
              "オルカンをコアに据えた上でサテライトとして活用したい人",
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
        <p className="text-xs font-bold text-zinc-300">まとめ：リスク許容度で選ぶ</p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          オルカンは世界分散による安定性、NASDAQ100はテクノロジー成長への集中による高リターンが特徴です。どちらが絶対に優れているという答えはなく、<strong className="text-zinc-200">下落局面でも積立を続けられるかどうか</strong>が最終的な選択基準になります。迷ったら、まずオルカンをコアにして始めるのが無難な出発点です。
        </p>
      </div>

      <DisclaimerBar />

      {/* 9. CTA */}
      <section id="section-9" className="space-y-4">
        <SectionHeading index={9} title="積立タイムマシンで実際に確かめよう" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          「もし○○年から積み立てていたら？」を、オルカン・NASDAQ100それぞれで実際に確かめてみましょう。
          あなた自身の開始年・毎月の積立額で、リアルな数字を体感できます。
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

// ─── 共通パーツ ──────────────────────────────────────────────────────────────

function SectionHeading({ index, title }: { index: number; title: string }) {
  return (
    <h2
      className="text-lg font-black text-white flex items-start gap-2 leading-tight"
      style={{ fontFamily: "var(--font-serif-jp), serif" }}
    >
      <span className="text-indigo-400 font-black text-base mt-0.5 flex-shrink-0">{index + 1}.</span>
      {title}
    </h2>
  );
}

function SpecCard({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
      <ul className="space-y-2">
        {rows.map(([k, v]) => (
          <li key={k} className="flex items-start gap-3 text-sm">
            <span className="text-zinc-500 w-20 flex-shrink-0">{k}</span>
            <span className="text-zinc-200">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SimCard({ name, color, sim }: {
  name: string;
  color: string;
  sim: { totalPrincipal: number; finalValue: number; profit: number; returnRate: number };
}) {
  return (
    <div
      className="rounded-xl p-4 space-y-2"
      style={{
        background: `linear-gradient(145deg, ${color}12 0%, transparent 70%)`,
        border: `1px solid ${color}30`,
      }}
    >
      <p className="text-[11px] font-bold" style={{ color }}>{name}</p>
      <p className="text-xl font-black text-emerald-400 leading-none">
        +{formatCurrency(sim.profit)}
      </p>
      <p className="text-[11px] text-emerald-300">+{sim.returnRate.toFixed(1)}%</p>
      <div className="pt-1 border-t border-white/[0.06] space-y-0.5">
        <p className="text-[10px] text-zinc-500">元本 {formatCurrency(sim.totalPrincipal)}</p>
        <p className="text-[10px] text-zinc-400">評価額 {formatCurrency(sim.finalValue)}</p>
      </div>
    </div>
  );
}
