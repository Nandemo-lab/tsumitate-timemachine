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
    "積立タイムマシンで使用している年率リターンデータの取得元・計算方法・更新頻度・注意事項を公開しています。",
  alternates: { canonical: `${BASE_URL}/about/data-sources` },
  openGraph: {
    title: `データソース・計算方法 | ${SITE_NAME}`,
    description: "シミュレーションに使用する年率リターンの出典・計算方法を公開しています。",
    url: `${BASE_URL}/about/data-sources`,
    type: "article",
    siteName: SITE_NAME,
    locale: "ja_JP",
    images: [{ url: `${BASE_URL}/api/og?static=1`, width: 1200, height: 630, alt: "データソース・計算方法" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `データソース・計算方法 | ${SITE_NAME}`,
    description: "シミュレーションに使用する年率リターンの出典・計算方法を公開しています。",
    images: [`${BASE_URL}/api/og?static=1`],
  },
  robots: { index: true, follow: true },
};

export default function DataSourcesPage() {
  return (
    <div
      className="min-h-dvh bg-zinc-950 text-zinc-50"
      style={{ fontFamily: "var(--font-sans-jp), sans-serif" }}
    >
      {/* Breadcrumb */}
      <nav className="border-b border-white/[0.07] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400 flex-wrap">
          <Link href="/" className="hover:text-zinc-200 transition-colors">積立タイムマシン</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <Link href="/about" className="hover:text-zinc-200 transition-colors">このサービスについて</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-zinc-200">データソース・計算方法</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10 pb-20 space-y-10">

        {/* ヘッダー */}
        <header className="space-y-3">
          <h1
            className="text-2xl font-black text-white leading-tight"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            データソース・計算方法
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            シミュレーションは10系列・各11年分の年次リターンを使用しています。VTは公式NAV Total Returnを値ごとに照合済みです。その他9系列は取得記録が残っていないため、公式実績とは表示せず監査状況も含めて公開します。
          </p>
        </header>

        {/* 計算方法 */}
        <section className="space-y-4">
          <h2
            className="text-base font-bold text-white"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            シミュレーションの計算方法
          </h2>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-300">基本的な計算ロジック</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                毎月一定額を投資し、銘柄ごとに収録した年次参考リターンから、複利計算で同じ年率になる一定の月次率を算出して適用します。実際の各月の基準価額や取引価格を再現する計算ではありません。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-300">年次リターンデータの取得</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                年次参考リターンは、各指数・運用会社・ETF運用会社の公開情報を参照して独自に整理しています。投資信託、ETF、指数では通貨・配当・費用の扱いが異なるため、個別商品の円建て基準価額による厳密な運用実績とは一致しません。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-300">収録最終年（2025年）のデータ</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                現在のシミュレーション収録期間は2025年6月までです。VTは2025年の公式通年率、その他9系列は収録時点までの原典未特定の参考値です。いずれも年率を一定月次率へ換算するため、実際の2025年上期実績を再現しません。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-300">税金・手数料について</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                シミュレーション結果には売却時の税金、売買手数料、為替コストを個別に反映していません。参照データに含まれる費用・配当の扱いもデータ種別により異なります。実際の手取り額は商品や口座種別（NISA等）によって異なります。
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-serif-jp), serif" }}>
            先に確認してほしいこと
          </h2>
          <div className="rounded-xl bg-amber-500/[0.06] border border-amber-500/20 p-5 space-y-2 text-xs text-zinc-400 leading-relaxed">
            <p>VTの11個の年次値は一次情報まで追跡できます。残る99個は、原典・通貨・配当・費用・為替処理を値ごとに遡れる記録がありません。</p>
            <p>そのためVTは「A：公式商品実績」、その他9系列は「G：原典未特定」です。G系列の公式URLは今後照合する候補であり、現行値の直接根拠ではありません。</p>
            <p>商品設定前の年を含む系列は、商品の基準価額実績ではなく参考系列です。</p>
          </div>
        </section>

        {/* 銘柄別データソース */}
        <section className="space-y-4">
          <h2
            className="text-base font-bold text-white"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            銘柄別データソース
          </h2>
          <div className="space-y-3">
            {FUND_LIST.map((fund) => {
              const source = RETURN_DATA_SOURCES[fund.id];
              return (
              <div
                key={fund.id}
                className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-zinc-200">{source.displayedProduct}</p>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${source.sourceStatus === "verified" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                    {source.sourceStatus === "verified" ? "A：公式商品実績" : "G：原典未特定"}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-20">使用系列</span>
                    <span className="text-zinc-400">{source.storedSeries}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-20">識別情報</span>
                    <span className="text-zinc-400">{source.identifier}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-20">通貨・配当</span>
                    <span className="text-zinc-400">{source.currency}／{source.dividendTreatment}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-20">リターン種別</span>
                    <span className="text-zinc-400">{source.returnType}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-20">費用・為替</span>
                    <span className="text-zinc-400">{source.feeTreatment}／{source.fxTreatment}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-20">収録期間</span>
                    <span className="text-zinc-400">2015年〜{source.dataThrough}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-20">台帳確認日</span>
                    <span className="text-zinc-400">{source.retrievedAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-20">表示コスト</span>
                    <span className="text-zinc-400">
                      {formatExpenseRatio(fund.id)}（{source.sourceStatus === "verified" ? "公式NAVリターンに反映済み" : "シミュレーションへの反映は未特定"}）
                    </span>
                  </div>
                </div>
                <a
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                  {source.sourceName}
                </a>
                <p className="text-[10px] text-zinc-600 leading-relaxed">{source.notes}</p>
              </div>
            )})}
          </div>
        </section>

        {/* 更新頻度 */}
        <section className="space-y-3">
          <h2
            className="text-base font-bold text-white"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            データ更新頻度
          </h2>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-3">
            <div className="flex gap-3 text-sm">
              <span className="text-zinc-600 flex-shrink-0">年次データ</span>
              <span className="text-zinc-400">翌年1〜3月を目安に更新（各ファンドの年次報告確定後）</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-zinc-600 flex-shrink-0">当年データ</span>
              <span className="text-zinc-400">半期ごと（6月・12月）を目安に更新</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-zinc-600 flex-shrink-0">信託報酬</span>
              <span className="text-zinc-400">各社の変更発表後に随時更新</span>
            </div>
          </div>
        </section>

        {/* 一次情報リンク */}
        <section className="space-y-3">
          <h2
            className="text-base font-bold text-white"
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
                className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.025] border border-white/[0.06] px-4 py-3 hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-xs text-zinc-400">{link.label}</span>
                <ExternalLink className="h-3 w-3 text-zinc-600 flex-shrink-0" />
              </a>
            ))}
          </div>
        </section>

        {/* 注意事項 */}
        <section>
          <div className="flex items-start gap-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 p-5">
            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
              <p>本シミュレーションは教育・情報提供を目的としており、投資助言ではありません。</p>
              <p>VT以外の参考系列は、公式の運用成績と完全に一致しない場合があります。VTも円換算後の実際の購入結果や月次推移を再現するものではありません。</p>
              <p>将来の運用成果を保証・示唆するものではありません。投資判断は必ずご自身でお願いします。</p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between text-xs text-zinc-600">
          <Link href="/about" className="hover:text-zinc-400 transition-colors">← サービスについて</Link>
          <Link href="/contact" className="hover:text-zinc-400 transition-colors">お問い合わせ →</Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
