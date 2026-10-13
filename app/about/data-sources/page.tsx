import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink, AlertCircle } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";
import { FUND_LIST, formatExpenseRatio } from "@/lib/funds";
import { RETURN_DATA_SOURCES } from "@/lib/return-data-sources";

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  title: "データソース・計算方法",
  description:
    "積立タイムマシンで使用する検証済み月次リターンの取得元・計算方法・利用可能期間を公開しています。",
  alternates: { canonical: `${BASE_URL}/about/data-sources` },
  openGraph: {
    title: `データソース・計算方法 | ${SITE_NAME}`,
    description: "シミュレーションに使用する月次リターンの出典・計算方法を公開しています。",
    url: `${BASE_URL}/about/data-sources`,
    type: "article",
    siteName: SITE_NAME,
    locale: "ja_JP",
    images: [{ url: `${BASE_URL}/api/og?static=1`, width: 1200, height: 630, alt: "データソース・計算方法" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `データソース・計算方法 | ${SITE_NAME}`,
    description: "シミュレーションに使用する月次リターンの出典・計算方法を公開しています。",
    images: [`${BASE_URL}/api/og?static=1`],
  },
  robots: { index: true, follow: true },
};

export default function DataSourcesPage() {
  return (
    <div
      className="min-h-dvh bg-[#FAFAF7] text-[#263A53]"
      style={{ fontFamily: "var(--font-sans-jp), sans-serif" }}
    >
      {/* Breadcrumb */}
      <nav className="border-b border-[#DDE6EA] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
          <Link href="/" className="hover:text-slate-700 transition-colors">積立タイムマシン</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <Link href="/about" className="hover:text-slate-700 transition-colors">このサービスについて</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-slate-700">データソース・計算方法</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10 pb-20 space-y-10">

        {/* ヘッダー */}
        <header className="space-y-3">
          <h1
            className="text-2xl font-black text-[#263A53] leading-tight"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            データソース・計算方法
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            9系列は一次情報から作成した検証済み月次データを使用します。米国ETFは配当を含む公式の基準価額リターンを日本銀行の月末為替で円換算し、国内投信は商品設定後の分配金再投資基準価額を使用します。SCHDだけは月次原典の検証が未完了のため参考データとして分離しています。
          </p>
        </header>

        {/* 計算方法 */}
        <section className="space-y-4">
          <h2
            className="text-base font-bold text-[#263A53]"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            シミュレーションの計算方法
          </h2>
          <div className="rounded-xl bg-white border border-[#E1E8EC] p-5 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-700">基本的な計算ロジック</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                毎月月初に一定額を加えた後、前月末から当月末までの月次リターンを適用します。商品設定前や月次値が欠ける期間は計算しません。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-700">月次リターンデータの取得</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                ETF5系列は運用会社公式の配当込み基準価額リターンと、日本銀行の月末USD/JPYを使用します。国内投信4系列は運用会社公式の分配金再投資基準価額を使用します。ファンド内部の運用費用は参照値に反映されていますが、売買手数料、税金、実際の為替スプレッドは個別計算していません。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-700">収録最終月と更新履歴</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                現在の収録最終月は2026年9月です。2026年10月13日に9つのA系列を公式一次情報から再取得し、保存した元データのSHA-256、連続月、円換算式を再検証しました。各系列は同月までの値だけを使用し、未来データや年次値で補いません。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-700">税金・手数料について</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                シミュレーション結果には売却時の税金、売買手数料、為替コストを個別に反映していません。参照データに含まれる費用・配当の扱いもデータ種別により異なります。実際の手取り額は商品や口座種別（NISA等）によって異なります。
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#263A53]" style={{ fontFamily: "var(--font-serif-jp), serif" }}>
            先に確認してほしいこと
          </h2>
          <div className="rounded-xl bg-amber-500/[0.06] border border-amber-500/20 p-5 space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>VT・VTI・VYM・EEM・INDA・オルカン・S&amp;P500・NASDAQ100・FANG+は「A：公式月次データ」です。</p>
            <p>国内投信は商品設定後だけを公式実績として扱います。設定前の指数や別商品による補完は行いません。</p>
            <p>SCHDは商品定義を米国ETFへ統一していますが、月次原典の検証完了までは「G：参考データ・原典未検証」です。</p>
          </div>
        </section>

        {/* 銘柄別データソース */}
        <section className="space-y-4">
          <h2
            className="text-base font-bold text-[#263A53]"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            銘柄別データソース
          </h2>
          <div className="space-y-3">
            {FUND_LIST.map((fund) => {
              const source = RETURN_DATA_SOURCES[fund.id];
              return (
              <details
                key={fund.id}
                className="group rounded-2xl border border-[#E1E8EC] bg-white p-4 open:shadow-sm"
              >
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-700">{source.displayedProduct}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${source.sourceStatus === "verified" ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-orange-600"}`}>{source.sourceStatus === "verified" ? "A：公式月次データ" : "G：参考データ"}</span>
                </summary>
                <div className="mt-4 border-t border-[#E1E8EC] pt-4">
                <div className="grid grid-cols-1 gap-2 text-xs leading-relaxed">
                  <div className="flex gap-2">
                    <span className="text-slate-500 flex-shrink-0 w-20">運用会社</span>
                    <span className="text-slate-600">{source.manager}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 flex-shrink-0 w-20">使用系列</span>
                    <span className="text-slate-600">{source.storedSeries}</span>
                  </div>
                  {source.sourceStatus === "verified" && (
                    <>
                      <div className="flex gap-2">
                        <span className="text-slate-500 flex-shrink-0 w-20">データ粒度</span>
                        <span className="text-slate-600">{source.granularity}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500 flex-shrink-0 w-20">計算式</span>
                        <span className="text-slate-600">{source.calculationMethod}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500 flex-shrink-0 w-20">積立時点</span>
                        <span className="text-slate-600">{source.investmentTiming}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-slate-500 flex-shrink-0 w-20">欠損処理</span>
                        <span className="text-slate-600">{source.missingValueTreatment}</span>
                      </div>
                    </>
                  )}
                  <div className="flex gap-2">
                    <span className="text-slate-500 flex-shrink-0 w-20">識別情報</span>
                    <span className="text-slate-600">{source.identifier}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 flex-shrink-0 w-20">通貨・配当</span>
                    <span className="text-slate-600">{source.currency}／{source.dividendTreatment}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 flex-shrink-0 w-20">リターン種別</span>
                    <span className="text-slate-600">{source.returnType}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 flex-shrink-0 w-20">費用・為替</span>
                    <span className="text-slate-600">{source.feeTreatment}／{source.fxTreatment}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 flex-shrink-0 w-20">{source.sourceStatus === "verified" ? "収録期間" : "参考系列"}</span>
                    <span className="text-slate-600">{source.startMonth}〜{source.endMonth}</span>
                  </div>
                  {source.sourceStatus !== "verified" && (
                    <div className="flex gap-2">
                      <span className="text-slate-500 flex-shrink-0 w-20">公開計算</span>
                      <span className="text-amber-700">{source.dataThrough}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className="text-slate-500 flex-shrink-0 w-20">{source.sourceStatus === "verified" ? "台帳確認日" : "参考確認日"}</span>
                    <span className="text-slate-600">{source.retrievedAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 flex-shrink-0 w-20">表示コスト</span>
                    <span className="text-slate-600">
                      {formatExpenseRatio(fund.id)}（{source.sourceStatus === "verified" ? "参照する基準価額に反映済み・二重控除なし" : "シミュレーションへの反映は未特定"}）
                    </span>
                  </div>
                </div>
                <a
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 max-w-full items-center gap-1 rounded-lg px-2 text-left text-xs text-slate-600 hover:text-slate-700 transition-colors break-words"
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                  <span className="min-w-0 break-words">{source.sourceName}</span>
                </a>
                {source.rawDataUrl && source.rawDataUrl !== source.sourceUrl && (
                  <a href={source.rawDataUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 max-w-full items-center gap-1 rounded-lg px-2 text-left text-xs text-slate-600 hover:text-slate-700 transition-colors break-words">
                    <ExternalLink className="h-2.5 w-2.5" />
                    元データ
                  </a>
                )}
                {source.fxSourceUrl && (
                  <a href={source.fxSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 max-w-full items-center gap-1 rounded-lg px-2 text-left text-xs text-slate-600 hover:text-slate-700 transition-colors break-words">
                    <ExternalLink className="h-2.5 w-2.5" />
                    {source.fxSourceName}
                  </a>
                )}
                <p className="text-xs text-slate-500 leading-relaxed">{source.notes}</p>
                </div>
              </details>
            )})}
          </div>
        </section>

        {/* 更新頻度 */}
        <section className="space-y-3">
          <h2
            className="text-base font-bold text-[#263A53]"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            データ更新頻度
          </h2>
          <div className="rounded-xl bg-white border border-[#E1E8EC] p-5 space-y-3">
            <div className="flex gap-3 text-sm">
              <span className="text-slate-500 flex-shrink-0">年次データ</span>
              <span className="text-slate-600">翌年1〜3月を目安に更新（各ファンドの年次報告確定後）</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-slate-500 flex-shrink-0">当年データ</span>
              <span className="text-slate-600">半期ごと（6月・12月）を目安に更新</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-slate-500 flex-shrink-0">信託報酬</span>
              <span className="text-slate-600">各社の変更発表後に随時更新</span>
            </div>
          </div>
        </section>

        {/* 一次情報リンク */}
        <section className="space-y-3">
          <h2
            className="text-base font-bold text-[#263A53]"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            一次情報・参考リンク
          </h2>
          <div className="space-y-2">
            {[
              { label: "金融庁 NISAについて", href: "https://www.fsa.go.jp/policy/nisa2/index.html" },
              { label: "MSCI ACWI Index（MSCI公式）", href: "https://www.msci.com/our-solutions/indexes/acwi" },
              { label: "S&P 500 Index（S&P Dow Jones）", href: "https://www.spglobal.com/spdji/en/indices/equity/sp-500/" },
              { label: "SPIVA Japan Scorecard", href: "https://www.spglobal.com/spdji/en/research-insights/spiva/" },
              { label: "三菱UFJアセットマネジメント eMAXIS Slim", href: "https://emaxis.am.mufg.jp/lp/slim/pr3/" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-xl bg-white border border-[#E1E8EC] px-4 py-3 hover:bg-[#F7FAFB] transition-colors"
              >
                <span className="text-xs text-slate-600">{link.label}</span>
                <ExternalLink className="h-3 w-3 text-slate-500 flex-shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* 注意事項 */}
        <section>
          <div className="flex items-start gap-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 p-5">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>本シミュレーションは教育・情報提供を目的としており、投資助言ではありません。</p>
              <p>A系列は公式商品実績を基にしていますが、実際の約定価格、税金、売買手数料、為替スプレッドは個別計算していません。SCHDは原典未検証の参考データです。</p>
              <p>将来の運用成果を保証・示唆するものではありません。投資判断は必ずご自身でお願いします。</p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link href="/about" className="hover:text-slate-600 transition-colors">← サービスについて</Link>
          <Link href="/contact" className="hover:text-slate-600 transition-colors">お問い合わせ →</Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
