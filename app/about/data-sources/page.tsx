import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink, AlertCircle } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

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

const FUND_SOURCES = [
  {
    fund: "eMAXIS Slim 全世界株式（オルカン）",
    index: "MSCI ACWI（全世界株式指数）",
    source: "MSCI社公開データ・三菱UFJアセットマネジメント月次レポート",
    fee: "0.05775%（税込）",
    link: { label: "MSCI ACWI", href: "https://www.msci.com/our-solutions/indexes/acwi" },
  },
  {
    fund: "eMAXIS Slim 米国株式（S&P500）",
    index: "S&P 500指数",
    source: "S&P Dow Jones Indices公開データ・三菱UFJアセットマネジメント月次レポート",
    fee: "0.09372%（税込）",
    link: { label: "S&P 500", href: "https://www.spglobal.com/spdji/en/indices/equity/sp-500/" },
  },
  {
    fund: "eMAXIS Slim 米国株式（NASDAQ100）",
    index: "NASDAQ-100指数",
    source: "Nasdaq公開データ・三菱UFJアセットマネジメント月次レポート",
    fee: "0.2035%（税込）",
    link: { label: "NASDAQ-100", href: "https://www.nasdaq.com/nasdaq-100" },
  },
  {
    fund: "Vanguard Total World Stock ETF（VT）",
    index: "FTSE Global All Cap Index",
    source: "Vanguard社公開データ・ファクトシート",
    fee: "0.07%（年率）",
    link: { label: "VT", href: "https://investor.vanguard.com/investment-products/etfs/profile/vt" },
  },
  {
    fund: "SCHD（Schwab US Dividend Equity ETF）",
    index: "Dow Jones U.S. Dividend 100 Index",
    source: "Charles Schwab公開データ・ファクトシート",
    fee: "0.06%（年率）",
    link: { label: "SCHD", href: "https://www.schwabassetmanagement.com/products/schd" },
  },
  {
    fund: "VYM（Vanguard High Dividend Yield ETF）",
    index: "FTSE High Dividend Yield Index",
    source: "Vanguard社公開データ・ファクトシート",
    fee: "0.06%（年率）",
    link: { label: "VYM", href: "https://investor.vanguard.com/investment-products/etfs/profile/vym" },
  },
];

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
            積立タイムマシンで使用しているシミュレーションデータの出典・計算ロジック・更新方針を公開しています。「この数字はどこから？」という疑問にお答えします。
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
                毎月一定額を投資し、各年の年間リターンを12等分した月次リターンを複利で適用します。信託報酬は年次リターンデータに既に反映された形で使用しています（純資産ベースの実績リターン）。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-300">年次リターンデータの取得</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                各ファンドの1月〜12月の年間トータルリターン（円ベース）を使用しています。為替変動・分配金再投資を含む実績値をもとに構成しています。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-300">当年（2025年）のデータ</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                当年分は年途中の実績（1月〜直近月）を使用しています。年末までのデータが確定次第、更新します。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-zinc-300">税金・手数料について</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                シミュレーション結果には売却時の税金（約20.315%）は含まれていません。信託報酬は年次リターンデータに内包されています。実際の手取り額は税率や口座種別（NISA等）によって異なります。
              </p>
            </div>
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
            {FUND_SOURCES.map((s, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2.5"
              >
                <p className="text-sm font-bold text-zinc-200">{s.fund}</p>
                <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-16">連動指数</span>
                    <span className="text-zinc-400">{s.index}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-16">データ元</span>
                    <span className="text-zinc-400">{s.source}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-zinc-600 flex-shrink-0 w-16">信託報酬</span>
                    <span className="text-zinc-400">{s.fee}</span>
                  </div>
                </div>
                <a
                  href={s.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                  {s.link.label}（公式）
                </a>
              </div>
            ))}
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
              { label: "三菱UFJアセットマネジメント eMAXIS Slim", href: "https://emaxis.jp/lp/slim/index.html" },
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
              <p>数値は入手可能な公開情報をもとに独自に構成したものであり、公式の運用成績と完全に一致しない場合があります。</p>
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
