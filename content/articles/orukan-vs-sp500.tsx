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
import GuideEeat from "@/components/guide/GuideEeat";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { SectionHeading, SpecCard, SimCard } from "@/components/articles/ArticleBlocks";
import type { ArticleMeta } from "@/lib/article-pages";

// ─── メタデータ（フロントマター相当） ────────────────────────────────────────

export const meta: ArticleMeta = {
  slug: "orukan-vs-sp500",
  h1: "オルカンとS&P500どっち？違い・過去実績・向いている人を徹底比較",
  metaTitle: "オルカンとS&P500どっち？違い・過去実績・どちらが向いているかを比較 | 積立タイムマシン",
  metaDescription:
    "オルカン（全世界株）とS&P500の違いを過去シミュレーション・暴落耐性・コスト・新NISAでの選び方から徹底比較。初心者にも分かりやすく中立的に解説します。",
  lastUpdated: "2025年6月",
  publishedAt: "2025-06-01",
  category: "比較コラム",
  ogFundA: "orcan",
  ogFundB: "sp500",
  ogYear: 2020,
  ogMonth: 1,
  ogAmount: 30000,
  relatedFunds: ["orcan", "sp500"],
  relatedGuides: [
    "orukan-ippon-de-ii",
    "nisa-beginner",
    "sp500-booraku-taisho",
    "nisa-wariate-osusume",
    "orukan-yameta-houga-ii",
  ],
};

// ─── シミュレーションデータ（ビルド時に計算・SSGで静的化） ────────────────────

const simOrcan      = simulate({ fundId: "orcan",  startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simSp500      = simulate({ fundId: "sp500",  startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simOrcanLong  = simulate({ fundId: "orcan",  startYear: 2015, startMonth: 1, monthlyAmount: 30000 });
const simSp500Long  = simulate({ fundId: "sp500",  startYear: 2015, startMonth: 1, monthlyAmount: 30000 });

// ─── 目次 ────────────────────────────────────────────────────────────────────

const TOC = [
  "結論：どちらを選ぶべきか",
  "オルカンとは？特徴と仕組み",
  "S&P500とは？特徴と仕組み",
  "オルカンとS&P500の違いを比較",
  "過去の積立シミュレーションで比較",
  "暴落時の動き方の違い",
  "新NISAではどちらが向いているか",
  "こんな人はオルカン",
  "こんな人はS&P500",
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
          新NISAで積立を始めようとしたとき、多くの人が「オルカンとS&P500、どちらを選べばいい？」と悩みます。この記事では両者の違いを事実ベースで比較し、どちらが自分に向いているかを判断する材料を提供します。
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
              "「米国1国への集中リスクが気になる」→ オルカンが向いている",
              "「過去の実績と成長力で米国を信頼している」→ S&P500が向いている",
              "「どちらか迷っている」→ オルカン1本が最もシンプルで損のない選択",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500 leading-relaxed pt-1">
            ※ どちらも長期的に世界経済の成長を享受できる優良なインデックスです。どちらが必ず良い・悪いと断言できるものではありません。
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
          米国の比率が最も高い（約62%）のは、現在の世界の時価総額で米国企業が最大シェアを占めているためです。将来的に別の国や地域が台頭すれば、自動的にその比率が上昇します。いわば「世界経済全体に乗る」インデックスです。
        </p>
      </section>

      {/* 2. S&P500とは */}
      <section id="section-2" className="space-y-4">
        <SectionHeading index={2} title="S&P500とは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          S&P500は、米国の代表的企業500社で構成される株価指数です。アップル・マイクロソフト・エヌビディア・アマゾン・メタといったテクノロジー大企業が上位を占め、米国経済の動向をほぼそのまま反映します。日本では「eMAXIS Slim米国株式（S&P500）」が最も人気のある商品です。
        </p>
        <SpecCard rows={[
          ["対象", "米国企業500社のみ"],
          ["銘柄数", "約500銘柄"],
          ["米国比率", "100%"],
          ["信託報酬", "年0.09372%"],
          ["新NISA対応", "積立投資枠・成長投資枠ともに対象"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          過去20年以上にわたり、世界の主要指数の中でも高いリターンを誇ってきた実績があります。一方で、米国1カ国への集中という点では分散が効いておらず、米国経済が低迷した際の影響を受けやすい構造でもあります。
        </p>
      </section>

      {/* 3. 比較表 */}
      <section id="section-3" className="space-y-4">
        <SectionHeading index={3} title="オルカンとS&P500の違いを比較" />
        <div className="rounded-xl overflow-hidden border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.05]">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-zinc-400 w-1/3">項目</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-indigo-400">
                  <Globe className="h-3 w-3 inline mr-1" />オルカン
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-amber-400">
                  <Flag className="h-3 w-3 inline mr-1" />S&P500
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {[
                ["対象国",     "約47カ国（全世界）",     "米国のみ"],
                ["銘柄数",     "約3,000銘柄",           "約500銘柄"],
                ["分散度",     "◎ 地域・国際分散",      "△ 米国集中"],
                ["過去リターン", "○ 高水準",             "◎ さらに高水準"],
                ["信託報酬",   "0.05775%",              "0.09372%"],
                ["暴落リスク", "やや緩和（米国外分散）",  "米国に連動"],
                ["シンプルさ", "◎ 1本で世界完結",        "◎ 米国特化で明快"],
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
          ※信託報酬はeMAXIS Slim全世界株式（オール・カントリー）、eMAXIS Slim米国株式（S&P500）の2025年6月時点の税込数値。
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
            <SimCard name="S&P500"   color="#f59e0b" sim={simSp500} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400">
            【2015年1月〜2025年6月】毎月{formatCurrency(30000)}積立
          </p>
          <div className="grid grid-cols-2 gap-3">
            <SimCard name="オルカン" color="#6366f1" sim={simOrcanLong} />
            <SimCard name="S&P500"   color="#f59e0b" sim={simSp500Long} />
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-1.5">
          <p className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            読み取れること
          </p>
          <ul className="space-y-1.5 pl-5">
            {[
              "過去の成績ではS&P500がオルカンをやや上回っている",
              "両者とも長期積立で元本の大幅な増加が見られた",
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
        <SectionHeading index={5} title="暴落時の動き方の違い" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          下落局面では両者ともに大きく動きますが、状況によって差が生まれることもあります。
        </p>
        <div className="space-y-3">
          {[
            {
              event: "コロナショック（2020年2〜3月）",
              body: "両者ともに約-30%前後の急落。回復速度も同水準で、米国テクノロジー株主導の急回復を両者ともに享受しました。この局面ではほぼ差はありませんでした。",
              diff: "ほぼ差なし",
              diffColor: "text-zinc-400",
            },
            {
              event: "インフレ・利上げショック（2022年）",
              body: "米国グロース株が大きく下落し、S&P500は約-19%。オルカンも同水準の-18〜20%程度で推移しました。欧州や新興国も下落したため、地域分散の恩恵は限定的でした。",
              diff: "ほぼ同等の下落",
              diffColor: "text-zinc-400",
            },
            {
              event: "新興国・中国リスクが顕在化した局面",
              body: "中国株の下落が大きかった2021〜2022年の一部期間では、新興国比率を持つオルカンの方がやや下落幅が大きい局面もありました。",
              diff: "オルカンが若干不利な場合も",
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
            過去の大きな下落局面では、オルカンとS&P500の下落幅はほぼ同水準でした。「オルカンの方が必ず安全」とは言えません。分散の効果は長期的に見て発揮されるものです。
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
          金融庁は「長期・積立・分散」の原則を推奨しています。この観点からは、47カ国・約3,000銘柄に分散するオルカンは原則に沿った選択といえます。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-300">新NISAで選ぶ際のポイント</p>
          <ul className="space-y-2">
            {[
              "どちらも積立投資枠・成長投資枠で購入可能",
              "毎月定額の積立ならどちらもドルコスト平均法の効果を受けられる",
              "「迷ったらオルカン」が多くのFPが挙げるシンプルな答え",
              "S&P500への強い確信があれば、それも合理的な選択",
              "どちらか一方に決めたら、長期で保有し続けることが最重要",
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
              "「米国1国への集中リスクが気になる」人",
              "「将来どの国・地域が成長するか分からない」と考える人",
              "なるべくシンプルに、1本だけで済ませたい人",
              "10〜20年以上の超長期で世界経済全体の成長を取り込みたい人",
              "投資の細かい判断をできるだけ減らしたい初心者",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-indigo-400 font-bold flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. こんな人はS&P500 */}
      <section id="section-8" className="space-y-4">
        <SectionHeading index={8} title="こんな人はS&P500" />
        <div className="rounded-xl bg-amber-500/6 border border-amber-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-bold text-amber-200">S&P500が向いている人</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "「今後もAI・テクノロジーを中心に米国が世界を牽引する」と考える人",
              "過去の長期リターンを重視し、米国株の実績に強い確信がある人",
              "オルカンの新興国・欧州部分は不要と考える人",
              "「将来的にS&P500と他の地域ETFを組み合わせたい」と考えている人",
              "すでに日本株や他の資産を持っており、米国株で補いたい人",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-amber-400 font-bold flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* まとめ */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2">
        <p className="text-xs font-bold text-zinc-300">まとめ：どちらも「正解」</p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          オルカンもS&P500も、長期積立に適した低コストのインデックスファンドです。どちらが絶対に優れているという答えはなく、自分のリスク観・投資観に合った方を選び、<strong className="text-zinc-200">長期で続けること</strong>が最も大切です。よく分からなければ、金融庁も推奨する分散投資の観点からオルカン1本が無難な出発点です。
        </p>
      </div>

      <DisclaimerBar />

      {/* 9. CTA */}
      <section id="section-9" className="space-y-4">
        <SectionHeading index={9} title="積立タイムマシンで実際に確かめよう" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          「もし○○年から積み立てていたら？」を、オルカン・S&P500それぞれで実際に確かめてみましょう。
          あなた自身の開始年・毎月の積立額で、リアルな数字を体感できます。
        </p>
        <Link
          href="/compare/orukan-vs-sp500"
          className="block rounded-2xl p-5 space-y-2 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #f59e0b 100%)" }}
        >
          <p className="text-xs font-bold text-white/80">積立タイムマシン 比較モード</p>
          <p className="text-lg font-black text-white leading-tight">
            オルカンとS&P500を<br />実際に比較してみませんか？
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
              { href: "/guide/nisa-beginner",         label: "新NISAのおすすめ銘柄を解説" },
              { href: "/fund/orukan",                 label: "オルカン銘柄詳細ページ" },
              { href: "/fund/sp500",                  label: "S&P500銘柄詳細ページ" },
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

