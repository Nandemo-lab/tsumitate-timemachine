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
import { simulate, formatCurrency } from "@/lib/simulation";
import GuideEeat from "@/components/guide/GuideEeat";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { SectionHeading, SpecCard, SimCard } from "@/components/articles/ArticleBlocks";
import type { ArticleMeta } from "@/lib/article-pages";

// ─── メタデータ ────────────────────────────────────────────────────────────

export const meta: ArticleMeta = {
  slug: "sp500-vs-nasdaq100",
  h1: "S&P500とNASDAQ100どっち？違い・過去実績・向いている人を徹底比較",
  metaTitle: "S&P500とNASDAQ100どっち？違い・過去実績・どちらが向いているかを比較",
  metaDescription:
    "S&P500とNASDAQ100の違いを過去シミュレーション・暴落耐性・コスト・新NISAでの選び方から徹底比較。安定分散とハイテク集中、どちらが自分に向いているか判断できます。",
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
const simSp500Long   = simulate({ fundId: "sp500",     startYear: 2015, startMonth: 1, monthlyAmount: 30000 });
const simNasdaqLong  = simulate({ fundId: "nasdaq100", startYear: 2015, startMonth: 1, monthlyAmount: 30000 });

// ─── 目次 ────────────────────────────────────────────────────────────────────

const TOC = [
  "結論：どちらを選ぶべきか",
  "S&P500とは？特徴と仕組み",
  "NASDAQ100とは？特徴と仕組み",
  "S&P500とNASDAQ100の違いを比較",
  "過去の積立シミュレーションで比較",
  "暴落時の動き方の違い",
  "新NISAではどちらが向いているか",
  "こんな人はS&P500",
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
          米国株への積立で人気の2大インデックス、「S&P500」と「NASDAQ100」。どちらも新NISAの対象商品ですが、業種の分散度合いや下落局面での値動きに違いがあります。この記事では両者の違いを事実ベースで比較し、どちらが自分に向いているかを判断する材料を提供します。
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
              "「業種の集中リスクを抑えたい」→ 全業種に分散するS&P500が向いている",
              "「テクノロジー分野の成長に強気で、下落にも耐えられる」→ NASDAQ100が向いている",
              "「どちらか迷っている」→ 米国株の定番であるS&P500から始めるのがシンプル",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500 leading-relaxed pt-1">
            ※ どちらも米国株への投資であり、地域分散という意味では同じ制約を持ちます。優劣を断定できるものではありません。
          </p>
        </div>
      </section>

      {/* 1. S&P500とは */}
      <section id="section-1" className="space-y-4">
        <SectionHeading index={1} title="S&P500とは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          S&P500は、米国の代表的企業500社で構成される株価指数です。アップル・マイクロソフト・エヌビディア・アマゾン・メタといった大型企業に加え、金融・ヘルスケア・生活必需品など全業種をカバーします。日本では「eMAXIS Slim米国株式（S&P500）」が最も人気のある商品です。
        </p>
        <SpecCard rows={[
          ["対象", "米国大型株500社（全業種）"],
          ["銘柄数", "約500銘柄"],
          ["業種分散", "全業種に分散"],
          ["信託報酬", "年0.09372%"],
          ["新NISA対応", "積立投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          過去数十年にわたり、世界の主要指数の中でも高いリターンを誇ってきた実績があります。金融・ヘルスケアなど非テクノロジー業種も含むため、NASDAQ100と比べると値動きは比較的穏やかです。
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
          ["業種分散", "IT・ハイテク偏重（約60%）"],
          ["信託報酬", "年0.2035%"],
          ["新NISA対応", "積立投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          2020年+48.8%、2023年+53.8%など高いリターンを記録する年がある一方、2022年は約-33%と大幅下落した年もあります。金融株を含まないため、S&P500よりもテクノロジー分野への集中度が高い構造です。
        </p>
      </section>

      {/* 3. 比較表 */}
      <section id="section-3" className="space-y-4">
        <SectionHeading index={3} title="S&P500とNASDAQ100の違いを比較" />
        <div className="rounded-xl overflow-hidden border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.05]">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-zinc-400 w-1/3">項目</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-amber-400">
                  <Flag className="h-3 w-3 inline mr-1" />S&P500
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-violet-400">
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
                ["最大下落幅（2022年）", "約-18%",         "約-33%"],
                ["信託報酬",   "0.09372%",                 "0.2035%"],
                ["NISA対応",   "○ つみたて・成長両対応",    "○ つみたて・成長両対応"],
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
          ※信託報酬はeMAXIS Slim米国株式（S&P500）、iFreeNEXT NASDAQ100インデックスの2025年6月時点の税込数値。
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
            <SimCard name="S&P500" color="#f59e0b" sim={simSp500} />
            <SimCard name="NASDAQ100" color="#8b5cf6" sim={simNasdaq} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400">
            【2015年1月〜2025年6月】毎月{formatCurrency(30000)}積立
          </p>
          <div className="grid grid-cols-2 gap-3">
            <SimCard name="S&P500" color="#f59e0b" sim={simSp500Long} />
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
              "過去の成績ではNASDAQ100がS&P500を上回っている期間が多い",
              "NASDAQ100の下落局面での振れ幅はS&P500よりも大きい",
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
          下落局面での値動きの差は、この2商品を比較するうえで重要なポイントです。
        </p>
        <div className="space-y-3">
          {[
            {
              event: "コロナショック（2020年2〜3月）",
              body: "両者ともに急落しましたが、下落幅・回復速度ともにNASDAQ100の方が大きく、その後のテック株主導の急回復では高いリターンを記録しました。",
              diff: "NASDAQ100の方が振れ幅大",
              diffColor: "text-violet-400",
            },
            {
              event: "インフレ・利上げショック（2022年）",
              body: "NASDAQ100は約-33%の下落。S&P500は約-18%に留まりました。金利上昇局面ではグロース株中心のNASDAQ100が特に大きな影響を受けます。",
              diff: "NASDAQ100が大きく劣後",
              diffColor: "text-amber-400",
            },
            {
              event: "2023年のテック株回復局面",
              body: "AI関連銘柄の急成長を背景に、NASDAQ100は+53.8%という高い回復を見せました。S&P500も上昇しましたが、回復幅では差がつきました。",
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
            NASDAQ100は好調期のリターンが大きい分、下落局面での振れ幅もS&P500より大きい商品です。積立を継続できる金額・比率で保有することが、長期的な成果につながります。
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
          残高・購入額の実績ではS&P500が上位を占めており、まずS&P500をコアに据え、NASDAQ100はリスク許容度に応じてサテライトとして組み合わせる方法が一般的です。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-300">新NISAで選ぶ際のポイント</p>
          <ul className="space-y-2">
            {[
              "どちらも積立投資枠・成長投資枠で購入可能",
              "毎月定額の積立ならどちらもドルコスト平均法の効果を受けられる",
              "「S&P500をコア、NASDAQ100をサテライト」という組み合わせも一般的",
              "NASDAQ100を単独で全額投資する場合は下落局面の振れ幅を理解しておく",
              "どちらか一方に決めたら、下落時にも積立を続けられるかが重要",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. こんな人はS&P500 */}
      <section id="section-7" className="space-y-4">
        <SectionHeading index={7} title="こんな人はS&P500" />
        <div className="rounded-xl bg-amber-500/6 border border-amber-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-bold text-amber-200">S&P500が向いている人</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "業種の集中リスクを抑えて米国株に投資したい人",
              "大きな値下がりで不安になりたくない人",
              "米国株の定番として長期実績を重視する人",
              "投資の細かい判断をできるだけ減らしたい初心者",
              "オルカンに加えて米国比率を高めたい人",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-amber-400 font-bold flex-shrink-0">→</span>
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
              "S&P500より高いリターンを狙いたい上級者",
              "-30%クラスの下落でも積立を止めずに続けられる人",
              "長期（10年以上）保有を前提にできる人",
              "S&P500をコアに据えた上でサテライトとして活用したい人",
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
        <p className="text-xs font-bold text-zinc-300">まとめ：業種分散と集中度の違い</p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          S&P500は全業種に分散した安定性、NASDAQ100はテクノロジー分野への集中による高リターンが特徴です。どちらが絶対に優れているという答えはなく、<strong className="text-zinc-200">下落局面でも積立を続けられるかどうか</strong>が選択の分かれ目になります。
        </p>
      </div>

      <DisclaimerBar />

      {/* 9. CTA */}
      <section id="section-9" className="space-y-4">
        <SectionHeading index={9} title="積立タイムマシンで実際に確かめよう" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          「もし○○年から積み立てていたら？」を、S&P500・NASDAQ100それぞれで実際に確かめてみましょう。
          あなた自身の開始年・毎月の積立額で、リアルな数字を体感できます。
        </p>
        <Link
          href="/compare/sp500-vs-nasdaq100"
          className="block rounded-2xl p-5 space-y-2 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #f59e0b 0%, #7c3aed 50%, #4f46e5 100%)" }}
        >
          <p className="text-xs font-bold text-white/80">積立タイムマシン 比較モード</p>
          <p className="text-lg font-black text-white leading-tight">
            S&P500とNASDAQ100を<br />実際に比較してみませんか？
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
              { href: "/guide/sp500-booraku-taisho",  label: "S&P500の暴落耐性を解説" },
              { href: "/guide/index-shippai-pattern",  label: "インデックス投資の失敗パターン" },
              { href: "/fund/sp500",                   label: "S&P500銘柄詳細ページ" },
              { href: "/fund/nasdaq100",                label: "NASDAQ100銘柄詳細ページ" },
              { href: "/articles/orukan-vs-nasdaq100",  label: "オルカン vs NASDAQ100 比較記事" },
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

