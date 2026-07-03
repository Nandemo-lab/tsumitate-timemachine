import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Coins,
  Layers,
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
  slug: "schd-vs-vym",
  h1: "SCHDとVYMどっち？配当利回り・増配率・過去実績を徹底比較",
  metaTitle: "SCHDとVYMどっち？配当利回り・増配率・どちらが向いているかを比較 | 積立タイムマシン",
  metaDescription:
    "楽天SCHDとVYMの配当利回り・増配率・積立実績を過去シミュレーション・コスト・新NISAでの選び方から徹底比較。増配重視と分散重視、どちらが自分に向いているか判断できます。",
  lastUpdated: "2026年7月",
  publishedAt: "2026-07-03",
  category: "比較コラム",
  ogFundA: "schd",
  ogFundB: "vym",
  ogYear: 2020,
  ogMonth: 1,
  ogAmount: 30000,
  relatedFunds: ["schd", "vym"],
  relatedGuides: [
    "nisa-beginner",
    "nisa-wariate-osusume",
    "index-shippai-pattern",
    "tsumitate-nansnen-keizoku",
  ],
};

// ─── シミュレーションデータ ─────────────────────────────────────────────────

const simSchd     = simulate({ fundId: "schd", startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simVym      = simulate({ fundId: "vym",  startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simSchdLong = simulate({ fundId: "schd", startYear: 2016, startMonth: 1, monthlyAmount: 30000 });
const simVymLong  = simulate({ fundId: "vym",  startYear: 2016, startMonth: 1, monthlyAmount: 30000 });

// ─── 目次 ────────────────────────────────────────────────────────────────────

const TOC = [
  "結論：どちらを選ぶべきか",
  "SCHDとは？特徴と仕組み",
  "VYMとは？特徴と仕組み",
  "SCHDとVYMの違いを比較",
  "過去の積立シミュレーションで比較",
  "配当・増配率の違い",
  "新NISAではどちらが向いているか",
  "こんな人はSCHD",
  "こんな人はVYM",
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
          米国高配当ETFの代表格として並んで語られる「SCHD」と「VYM」。どちらも配当収入を重視した投資先ですが、銘柄数の絞り込み方や増配率に違いがあります。この記事では両者の違いを事実ベースで比較し、どちらが自分の配当投資に向いているかを判断する材料を提供します。
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
              "「増配率・トータルリターンを重視したい」→ SCHDが向いている",
              "「より多くの銘柄に分散して安定を重視したい」→ VYMが向いている",
              "「どちらか迷っている」→ 増配実績を重視するかどうかで選ぶ",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-500 leading-relaxed pt-1">
            ※ どちらも米国高配当株への投資であり、優劣を断定できるものではありません。銘柄選定の思想の違いを理解した上で選ぶことが重要です。
          </p>
        </div>
      </section>

      {/* 1. SCHDとは */}
      <section id="section-1" className="space-y-4">
        <SectionHeading index={1} title="SCHDとは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          SCHD（Schwab U.S. Dividend Equity ETF）は、シュワブが運用する米国高配当ETFです。単なる配当利回りだけでなく、財務健全性・増配継続実績を重視したスクリーニングで約100銘柄に絞り込んでいます。日本では「楽天・高配当株式・米国ファンド（楽天SCHD）」として投資信託化されています。
        </p>
        <SpecCard rows={[
          ["対象", "米国高配当株（財務優良100社）"],
          ["銘柄数", "約100銘柄"],
          ["配当利回り", "約3.5〜4.0%（目安）"],
          ["増配率（10年平均）", "約11〜12%"],
          ["経費率", "年0.192%（投資信託）"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          銘柄数を絞ることで「配当を増やし続けられる質の高い企業」に的を絞っているのが特徴です。その分、個別銘柄への集中度はVYMよりやや高くなります。
        </p>
      </section>

      {/* 2. VYMとは */}
      <section id="section-2" className="space-y-4">
        <SectionHeading index={2} title="VYMとは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          VYM（Vanguard High Dividend Yield ETF）は、バンガードが運用する米国高配当ETFです。配当利回りが平均以上の米国株、約400銘柄に幅広く分散投資します。SCHDより銘柄数が多く、1社あたりの影響を受けにくい構造です。
        </p>
        <SpecCard rows={[
          ["対象", "米国高配当株（約400社）"],
          ["銘柄数", "約400銘柄"],
          ["配当利回り", "約2.8〜3.2%（目安）"],
          ["増配率（10年平均）", "約6〜7%"],
          ["経費率", "年0.06%"],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          幅広い銘柄に分散するため、SCHDと比べて安定感のある値動きが期待できます。一方で、増配率という点ではSCHDに一歩譲る傾向があります。
        </p>
      </section>

      {/* 3. 比較表 */}
      <section id="section-3" className="space-y-4">
        <SectionHeading index={3} title="SCHDとVYMの違いを比較" />
        <div className="rounded-xl overflow-hidden border border-white/[0.08]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.05]">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-zinc-400 w-1/3">項目</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-emerald-400">
                  <Coins className="h-3 w-3 inline mr-1" />SCHD
                </th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-sky-400">
                  <Layers className="h-3 w-3 inline mr-1" />VYM
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {[
                ["投資対象",   "財務優良な高配当株100社",   "高配当株約400社"],
                ["銘柄数",     "約100銘柄",                "約400銘柄"],
                ["配当利回り", "約3.5〜4.0%",              "約2.8〜3.2%"],
                ["増配率（10年平均）", "約11〜12%",         "約6〜7%"],
                ["分散度",     "△ やや集中",               "◎ 広く分散"],
                ["経費率",     "0.192%（投信）",            "0.06%"],
                ["NISA対応",   "○ 成長投資枠（ETF）",       "○ 成長投資枠（ETF）"],
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
          ※配当利回り・増配率は目安値。経費率はSCHD・VYMともに2025年6月時点の税込水準に基づく参考値。
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
            <SimCard name="VYM" color="#38bdf8" sim={simVym} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-400">
            【2016年1月〜2025年6月】毎月{formatCurrency(30000)}積立
          </p>
          <div className="grid grid-cols-2 gap-3">
            <SimCard name="SCHD" color="#10b981" sim={simSchdLong} />
            <SimCard name="VYM" color="#38bdf8" sim={simVymLong} />
          </div>
        </div>
        <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-1.5">
          <p className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            読み取れること
          </p>
          <ul className="space-y-1.5 pl-5">
            {[
              "過去の成績ではSCHDがVYMをやや上回っている期間が多い",
              "両者ともS&P500やNASDAQ100と比べて値動きは穏やか",
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

      {/* 5. 配当・増配率 */}
      <section id="section-5" className="space-y-4">
        <SectionHeading index={5} title="配当・増配率の違い" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          配当投資では「今の利回り」だけでなく、「将来にわたって配当がどれだけ増えるか」という増配率も重要な判断材料になります。
        </p>
        <div className="space-y-3">
          {[
            {
              event: "現在の配当利回り",
              body: "SCHDは約3.5〜4.0%、VYMは約2.8〜3.2%が目安です。SCHDの方がやや高い利回りですが、株価変動により購入時点の実際の利回りは変わります。",
              diff: "SCHDがやや高い",
              diffColor: "text-emerald-400",
            },
            {
              event: "10年平均の増配率",
              body: "SCHDは年約11〜12%、VYMは年約6〜7%というデータがあります。増配率が高いほど、長期保有時の取得価格に対する利回り（YOC）が向上していきます。",
              diff: "SCHDが大きく上回る",
              diffColor: "text-emerald-400",
            },
            {
              event: "銘柄集中度によるリスク",
              body: "SCHDは約100銘柄への集中のため、個別銘柄の業績悪化の影響を受けやすい面があります。VYMは約400銘柄と幅広く、1社の影響が相対的に小さくなります。",
              diff: "VYMの方が分散効果は大きい",
              diffColor: "text-sky-400",
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
            配当利回り・増配率は市場環境により変動します。過去の実績が将来も継続する保証はなく、あくまで参考値としてご覧ください。
          </p>
        </div>
      </section>

      {/* 6. 新NISA */}
      <section id="section-6" className="space-y-4">
        <SectionHeading index={6} title="新NISAではどちらが向いているか" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          新NISA（2024年〜）では、SCHD・VYMともに成長投資枠（年240万円）で購入できます。楽天SCHDのように投資信託化された商品であれば積立設定も可能です。
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          NISA口座では国内課税が非課税になりますが、米国側の外国源泉税（10%）は控除される点に注意が必要です。配当を非課税で受け取れることは変わらず、長期の配当投資との相性は良好です。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-300">新NISAで選ぶ際のポイント</p>
          <ul className="space-y-2">
            {[
              "どちらも成長投資枠（ETF）またはそれに連動する投資信託で購入可能",
              "配当を重視するならSCHD、分散を重視するならVYM",
              "SCHDとVYMを組み合わせて保有する投資家も一定数いる",
              "配当よりトータルリターンを重視するなら成長株型インデックスも選択肢",
              "どちらを選んでも、長期保有が配当・増配の効果を活かす前提となる",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. こんな人はSCHD */}
      <section id="section-7" className="space-y-4">
        <SectionHeading index={7} title="こんな人はSCHD" />
        <div className="rounded-xl bg-emerald-500/6 border border-emerald-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-bold text-emerald-200">SCHDが向いている人</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "増配率・トータルリターンを重視したい人",
              "財務優良企業に絞った質の高い配当株を持ちたい人",
              "長期保有で取得利回り（YOC）の向上を狙いたい人",
              "楽天SCHDとして投資信託で積立設定したい人",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-emerald-400 font-bold flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. こんな人はVYM */}
      <section id="section-8" className="space-y-4">
        <SectionHeading index={8} title="こんな人はVYM" />
        <div className="rounded-xl bg-sky-500/6 border border-sky-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-sky-400" />
            <p className="text-sm font-bold text-sky-200">VYMが向いている人</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "より多くの銘柄に分散して安定を重視したい人",
              "個別銘柄の業績悪化リスクを抑えたい人",
              "配当利回りより幅広い分散を優先したい人",
              "SCHDと組み合わせてポートフォリオを構築したい人",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="text-sky-400 font-bold flex-shrink-0">→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* まとめ */}
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2">
        <p className="text-xs font-bold text-zinc-300">まとめ：増配率と分散度の違い</p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          SCHDは財務優良企業に絞った高い増配率、VYMは幅広い銘柄への分散が特徴です。どちらが絶対に優れているという答えはなく、<strong className="text-zinc-200">増配ペースを重視するか、分散の広さを重視するか</strong>で選択が分かれます。
        </p>
      </div>

      <DisclaimerBar />

      {/* 9. CTA */}
      <section id="section-9" className="space-y-4">
        <SectionHeading index={9} title="積立タイムマシンで実際に確かめよう" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          実際にSCHDとVYMを同じ条件で積み立てた場合の結果は、シミュレーションでも確認できます。
          あなた自身の開始年・毎月の積立額で、リアルな数字を体感できます。
        </p>
        <Link
          href="/compare/schd-vs-vym"
          className="block rounded-2xl p-5 space-y-2 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #10b981 0%, #0ea5e9 50%, #4f46e5 100%)" }}
        >
          <p className="text-xs font-bold text-white/80">積立タイムマシン 比較モード</p>
          <p className="text-lg font-black text-white leading-tight">
            SCHDとVYMを<br />実際に比較してみませんか？
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
              { href: "/compare/schd-vs-sp500",         label: "SCHD vs S&P500 比較" },
              { href: "/fund/schd",                     label: "SCHD銘柄詳細ページ" },
              { href: "/fund/vym",                      label: "VYM銘柄詳細ページ" },
              { href: "/guide/nisa-wariate-osusume",    label: "新NISAのおすすめポートフォリオ割合" },
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

