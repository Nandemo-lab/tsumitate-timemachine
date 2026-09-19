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
import { FUNDS, formatExpenseRatio } from "@/lib/funds";
import { NISA_SYSTEM_DISCLAIMER } from "@/lib/nisa";
import GuideEeat from "@/components/guide/GuideEeat";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { SectionHeading, SpecCard, SimCard } from "@/components/articles/ArticleBlocks";
import type { ArticleMeta } from "@/lib/article-pages";

// ─── メタデータ ────────────────────────────────────────────────────────────

export const meta: ArticleMeta = {
  slug: "schd-vs-vym",
  h1: "SCHDとVYMどっち？銘柄選定・分散範囲・商品設計を比較",
  metaTitle: "SCHDとVYMどっち？銘柄選定・分散範囲・商品設計を比較",
  metaDescription:
    "米国ETF SCHDとVYMの配当方針・銘柄選定・コストを比較。SCHDの実績値は原典検証中の参考データとして分離して表示します。",
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
  "結論：比較時の確認点",
  "SCHDとは？特徴と仕組み",
  "VYMとは？特徴と仕組み",
  "SCHDとVYMの違いを比較",
  "過去の積立シミュレーションで比較",
  "分配方針と銘柄選定の違い",
  "新NISAで確認する点",
  "SCHDの商品属性",
  "VYMの商品属性",
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
          米国高配当ETFのSCHDとVYMについて、指数の銘柄選定方法・分散範囲・費用を整理します。SCHDのリターン系列はG品質のため、検証済み実績による優劣は判定しません。
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
        <SectionHeading index={0} title="結論：比較時の確認点" />
        <div className="rounded-xl bg-indigo-500/8 border border-indigo-500/20 p-5 space-y-3">
          <p className="text-sm font-bold text-indigo-200">先に結論をお伝えします。</p>
          <ul className="space-y-2">
            {[
              `財務比率等を用いて${FUNDS.schd.shareCount}を選定する指数への連動を重視する場合はSCHDの設計を確認`,
              "より広い銘柄分散を重視する場合はVYMの設計を確認",
              "分配利回りや増配率は基準日と集計期間をそろえて公式資料で確認",
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
          SCHD（Schwab U.S. Dividend Equity ETF）は、Schwab Asset Managementが運用するUSD建ての米国高配当ETFです。財務健全性や増配実績などを基準に銘柄を選定します。SCHDを主要投資対象とする国内投信は、米国ETF SCHDとは別商品です。
        </p>
        <SpecCard rows={[
          ["対象", "米国高配当株（財務比率等で選定）"],
          ["銘柄数", FUNDS.schd.shareCount],
          ["分配利回り", "時点により変動（公式値を確認）"],
          ["経費率", formatExpenseRatio("schd")],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          銘柄数を絞ることで「配当を増やし続けられる質の高い企業」に的を絞っているのが特徴です。その分、個別銘柄への集中度はVYMよりやや高くなります。
        </p>
      </section>

      {/* 2. VYMとは */}
      <section id="section-2" className="space-y-4">
        <SectionHeading index={2} title="VYMとは？特徴と仕組み" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          VYM（Vanguard High Dividend Yield ETF）は、バンガードが運用する米国高配当ETFです。配当利回りが平均以上の米国株、{FUNDS.vym.shareCount}に幅広く分散投資します。SCHDより銘柄数が多く、1社あたりの影響を受けにくい構造です。
        </p>
        <SpecCard rows={[
          ["対象", `米国高配当株（${FUNDS.vym.shareCount}）`],
          ["銘柄数", FUNDS.vym.shareCount],
          ["分配利回り", "時点により変動（公式値を確認）"],
          ["経費率", formatExpenseRatio("vym")],
        ]} />
        <p className="text-sm text-zinc-400 leading-relaxed">
          VYMはSCHDより多い銘柄へ分散します。ただし、銘柄数の違いだけで値動きの安定性や将来の成果は決まりません。
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
                ["投資対象",   "財務比率等で選定する高配当株", "配当利回りが平均以上の米国株"],
                ["銘柄数",     FUNDS.schd.shareCount,       FUNDS.vym.shareCount],
                ["分配利回り", "時点により変動",            "時点により変動"],
                ["分散範囲",   `${FUNDS.schd.shareCount}に分散`, `${FUNDS.vym.shareCount}に分散`],
              ["経費率", formatExpenseRatio("schd"), formatExpenseRatio("vym")],
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
          ※分配利回りは市場価格と分配実績により変動します。購入時点の各運用会社公式ページで同じ基準日の値をご確認ください。経費率はSSOTの登録値です。
        </p>
      </section>

      {/* 4. 過去シミュレーション */}
      <section id="section-4" className="space-y-4">
        <SectionHeading index={4} title="過去の積立シミュレーションで比較" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          VYMは検証済み月次実績、SCHDは原典未検証の参考系列を使った比較です。両者のデータ品質は同一ではありません。
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
              "VYMは検証済み月次実績、SCHDは原典未検証の参考系列で、表示差から優劣は判定できない",
              "両者は銘柄選定方法と分散範囲が異なるが、その違いだけで値動きの大小は断定できない",
              "開始年・期間によって参考結果は変わり、将来の成果を示すものではない",
            ].map((t, i) => (
              <li key={i} className="text-xs text-zinc-400 list-disc">{t}</li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          ※SCHDは「G：参考データ・原典未検証」です。VYMの「A：公式月次データ」と同じ精度の実績としては扱えません。詳しくはデータ出典ページをご確認ください。
        </p>
      </section>

      {/* 5. 配当・増配率 */}
      <section id="section-5" className="space-y-4">
        <SectionHeading index={5} title="分配方針と銘柄選定の違い" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          分配実績を比べる場合は、対象期間・基準日・集計方法をそろえる必要があります。このページでは同一条件の一次資料による増配率を確認していないため、商品設計の違いに限定して整理します。
        </p>
        <div className="space-y-3">
          {[
            {
              event: "現在の配当利回り",
              body: "両ETFの分配利回りは市場価格と分配実績により変動します。同じ基準日の各運用会社公式ページで確認する必要があります。",
              diff: "固定値では比較しない",
              diffColor: "text-emerald-400",
            },
            {
              event: "増配率の比較",
              body: "増配率は対象期間、分配金の集計方法、基準日によって変わります。同一条件の一次資料を確認していない数値は掲載せず、公式資料で個別に確認します。",
              diff: "数値による優劣は未判定",
              diffColor: "text-emerald-400",
            },
            {
              event: "銘柄数と組入比率",
              body: `SCHDは${FUNDS.schd.shareCount}、VYMは${FUNDS.vym.shareCount}で構成されます。銘柄数と組入比率の違いはありますが、それだけで値動きや将来成果の優劣は決まりません。`,
              diff: "構成銘柄と比率を公式資料で確認",
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
            分配利回りと増配率は市場環境や集計期間により変動します。過去の値が将来も続くことや、トータルリターンの優劣を保証するものではありません。
          </p>
        </div>
      </section>

      {/* 6. 新NISA */}
      <section id="section-6" className="space-y-4">
        <SectionHeading index={6} title="新NISAで確認する点" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          米国ETF SCHDとVYMは、取扱証券会社や商品区分を確認したうえで検討する必要があります。SCHDを主要投資対象とする国内投信は別商品で、積立設定・費用・NISA区分も異なります。{NISA_SYSTEM_DISCLAIMER}
        </p>
        <p className="text-sm text-zinc-300 leading-relaxed">
          NISA口座で米国ETFを保有する場合も、米国側の外国源泉税や取扱証券会社の分配金処理を確認する必要があります。分配金を受け取るか再投資するかも含めて商品性を確認してください。
        </p>
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-3">
          <p className="text-xs font-bold text-zinc-300">新NISAで選ぶ際のポイント</p>
          <ul className="space-y-2">
            {[
              "どちらも成長投資枠（ETF）またはそれに連動する投資信託で購入可能",
              "SCHDとVYMでは指数の銘柄選定方法と分散範囲が異なる",
              "両方を保有する場合は、重複銘柄と全体の組入比率を確認する",
              "商品を比較する際は、分配方針だけでなくトータルリターンの定義とデータ品質も確認する",
              "分配実績を比べる場合は、同じ基準日・期間・算出方法の公式資料を確認する",
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
        <SectionHeading index={7} title="SCHDの商品属性" />
        <div className="rounded-xl bg-emerald-500/6 border border-emerald-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-bold text-emerald-200">SCHDを確認する観点</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "財務比率等を用いる指数の銘柄選定方法を確認した人",
              "財務優良企業に絞った質の高い配当株を持ちたい人",
              "四半期分配を行う米国ETFの商品性を理解している人",
              "米国ETFを外貨建てで保有する方法を理解している人",
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
        <SectionHeading index={8} title="VYMの商品属性" />
        <div className="rounded-xl bg-sky-500/6 border border-sky-500/15 p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-4 w-4 text-sky-400" />
            <p className="text-sm font-bold text-sky-200">VYMを確認する観点</p>
          </div>
          <ul className="space-y-2.5">
            {[
              "より多くの銘柄へ分散する指数設計を確認した人",
              "配当利回りが平均以上の米国株を幅広く保有する設計を確認した人",
              "配当利回りより幅広い分散を優先したい人",
              "組入銘柄と比率を確認して保有商品との重複を判断したい人",
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
        <p className="text-xs font-bold text-zinc-300">まとめ：銘柄選定方法と分散範囲の違い</p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          SCHDは財務比率等を用いて{FUNDS.schd.shareCount}を選定し、VYMは{FUNDS.vym.shareCount}へ分散します。SCHDのリターン系列はG品質のため、<strong className="text-zinc-200">未検証の増配率やトータルリターンを根拠に優劣を判定しません</strong>。
        </p>
      </div>

      <DisclaimerBar />

      {/* 9. CTA */}
      <section id="section-9" className="space-y-4">
        <SectionHeading index={9} title="積立タイムマシンで実際に確かめよう" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          実際にSCHDとVYMを同じ条件で積み立てた場合の結果は、シミュレーションでも確認できます。
          開始年・毎月の積立額を変え、参考値と検証済み実績の品質差を確認できます。
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
              { href: "/schd",                          label: "米国ETF SCHDとは？特徴を解説" },
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

