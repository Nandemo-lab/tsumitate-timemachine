import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";
import { getFundSeoPage, FUND_SEO_PAGES, FundSeoPage } from "@/lib/fund-seo";
import { FUNDS } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
import SiteFooter from "@/components/layout/SiteFooter";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import ReturnQualityPill from "@/components/common/ReturnQualityPill";
import PageRoleGuide from "@/components/common/PageRoleGuide";
import { getReturnSeriesDefinition } from "@/lib/return-series";
import { getFundPageSlug } from "@/lib/fund-seo-pages";

const BASE_URL = "https://tsumitate-timemachine.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return FUND_SEO_PAGES.filter((p) => p.slug !== "schd").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getFundSeoPage(slug);
  if (!page) return {};
  const fund = FUNDS[page.fundId];
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `${BASE_URL}/${page.slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${BASE_URL}/${page.slug}`,
      type: "article",
      siteName: "積立タイムマシン",
      locale: "ja_JP",
      images: [
        {
          url: `${BASE_URL}/api/og?fund=${page.fundId}&year=${page.simYear}&amount=${page.simAmount}`,
          width: 1200,
          height: 630,
          alt: `${fund.shortName}の積立シミュレーション結果`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [`${BASE_URL}/api/og?fund=${page.fundId}&year=${page.simYear}&amount=${page.simAmount}`],
    },
  };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-lg font-bold text-[#263A53] mb-5"
      style={{ fontFamily: "var(--font-serif-jp), serif", letterSpacing: "0.01em" }}
    >
      {children}
    </h2>
  );
}

export default async function FundLandingPage({ params }: Props) {
  const { slug } = await params;
  const page = getFundSeoPage(slug);
  if (!page) notFound();

  const fund = FUNDS[page.fundId];
  const fundDetailSlug = getFundPageSlug(page.fundId);
  const returnDefinition = getReturnSeriesDefinition(page.fundId);
  const objectiveFeatures = [
    { title: "投資対象", description: fund.description },
    { title: "構成銘柄数", description: fund.shareCount },
    { title: "費用", description: fund.encyclopedia.managementFee },
    { title: "検証できる実績期間", description: returnDefinition.quality === "A" ? `${returnDefinition.startMonth}〜${returnDefinition.endMonth}` : "参考データ・月次原典未検証" },
  ];
  const displayedFaqs = [
    { q: `${fund.shortName}を確認するときの要点は？`, a: `投資対象は${fund.description}、構成は${fund.shareCount}、費用は${fund.encyclopedia.managementFee}です。商品設定日、NISA対象区分、許容できる値動きも正式資料で確認してください。` },
    { q: "このページの積立結果は将来予測ですか？", a: "いいえ。商品設定後の収録済み月次データに同じ計算条件を適用した過去結果です。税金、売買手数料、実際の約定価格は個別計算していません。" },
    { q: "データ品質はどこで確認できますか？", a: returnDefinition.quality === "A" ? `A品質です。${returnDefinition.seriesName}を${returnDefinition.startMonth}から${returnDefinition.endMonth}まで収録しています。` : "G品質（参考データ・原典未検証）です。検証済み実績と同じ確度の数値比較には使用しません。" },
  ];
  const result = simulate({
    fundId: page.fundId,
    startYear: page.simYear,
    startMonth: page.simMonth,
    monthlyAmount: page.simAmount,
  });

  const relatedPages = page.relatedSlugs
    .map((s) => FUND_SEO_PAGES.find((p) => p.slug === s))
    .filter((p): p is FundSeoPage => p !== undefined);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: displayedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "積立タイムマシン", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: page.heroTitle, item: `${BASE_URL}/${page.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div
        className="min-h-dvh bg-[#FAFAF7] text-[#263A53]"
        style={{ fontFamily: "var(--font-sans-jp), sans-serif" }}
      >
        {/* Background glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl"
            style={{ background: `radial-gradient(ellipse, ${fund.color}10 0%, transparent 70%)` }}
          />
        </div>

        {/* Breadcrumb nav */}
        <nav className="relative border-b border-[#D9E3E8] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-slate-600">
            <Link href="/" className="hover:text-slate-700 transition-colors">
              積立タイムマシン
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-slate-700">{fund.shortName}</span>
          </div>
        </nav>

        <div className="relative max-w-2xl mx-auto px-4 pb-20">

          {/* ── Hero ─────────────────────────────────────────────── */}
          <section className="pt-10 pb-10 text-center">
            <div
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold mb-5"
              style={{
                borderColor: `${fund.color}55`,
                color: fund.color,
                background: `${fund.color}12`,
              }}
            >
              {fund.shortName} · {fund.encyclopedia.managementFee}
            </div>
            <h1
              className="text-3xl font-bold text-[#263A53] mb-2"
              style={{ fontFamily: "var(--font-serif-jp), serif", letterSpacing: "0.01em" }}
            >
              {page.heroTitle}
            </h1>
            <p className="text-base text-slate-600 mb-4">{fund.encyclopedia.formalName}</p>
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto mb-8">
              {fund.description}。このページでは商品設定後の収録データだけを使い、開始年と積立額を変えて期間末評価額を確認できます。
            </p>
            <Link
              href={`/simulate/${page.fundId}/${page.simYear}`}
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-98"
              style={{
                background: `linear-gradient(135deg, ${fund.color} 0%, ${fund.color}cc 100%)`,
                boxShadow: `0 8px 24px ${fund.color}30`,
              }}
            >
              <TrendingUp className="h-4 w-4" />
              積立シミュレーションをしてみる
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          <PageRoleGuide
            label="条件を変えて積立結果を確かめる入口"
            description="開始年と月額を変え、検証済み月次実績による元本・期間末評価額・利益を確認します。商品仕様や一次情報は銘柄詳細に分けています。"
            counterpartHref={fundDetailSlug ? `/fund/${fundDetailSlug}` : undefined}
            counterpartLabel={fundDetailSlug ? `${fund.shortName}の正式商品・費用・データ品質を見る` : undefined}
          />

          {/* ── Features ─────────────────────────────────────────── */}
          <section className="mb-12">
            <SectionHeading>{fund.shortName}の確認できる商品情報</SectionHeading>
            <div className="grid grid-cols-2 gap-3">
              {objectiveFeatures.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-[#D9E3E8] p-4"
                  style={{ background: "#FFFFFF" }}
                >
                  <p className="font-bold text-[#263A53] text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── For Whom ─────────────────────────────────────────── */}
          <section className="mb-12">
            <SectionHeading>商品選択時の確認ポイント</SectionHeading>
            <div
              className="rounded-2xl border border-[#D2DEE4] p-5 space-y-3"
              style={{ background: "#F8FBFC" }}
            >
              <p className="text-sm text-slate-700 leading-relaxed">投資対象、構成銘柄数、費用、商品設定日、NISA対象区分、資金を使う時期、許容できる値動きを確認してください。過去の一期間の結果だけでは、将来の成果や個人への適性は判断できません。</p>
            </div>
          </section>

          {/* ── Simulation Result ─────────────────────────────────── */}
          {returnDefinition.quality === "A" ? <section className="mb-12">
            <SectionHeading>{returnDefinition.quality === "A" ? "公式月次データによるシミュレーション" : "参考データによるシミュレーション"}</SectionHeading>
            <div className="mb-3"><ReturnQualityPill fundId={page.fundId} /></div>
            <p className="text-xs text-slate-600 mb-4">
              {page.simYear}年{page.simMonth}月から毎月{formatCurrency(page.simAmount)}を積み立てた場合（{result.dataPoints.at(-1)?.date.replace("/", "年")}月時点）
            </p>
            <div
              className="rounded-2xl border p-6 mb-4"
              style={{
                background: `linear-gradient(145deg, ${fund.color}14 0%, transparent 70%)`,
                borderColor: `${fund.color}40`,
              }}
            >
              {/* Fund name */}
              <p
                className="text-sm font-bold mb-3"
                style={{ color: fund.color, fontFamily: "var(--font-serif-jp), serif" }}
              >
                {fund.shortName}
              </p>

              {/* Profit hero */}
              <div className="flex items-baseline gap-2 mb-2">
                <p
                  className="text-5xl font-bold"
                  style={{
                    color: "#10b981",
                    fontFamily: "var(--font-geist-mono), monospace",
                    letterSpacing: "-0.02em",
                    filter: "drop-shadow(0 0 12px #10b98140)",
                  }}
                >
                  +{formatCurrency(result.profit)}
                </p>
                <p className="text-lg font-bold text-emerald-700">
                  （+{result.returnRate.toFixed(1)}%）
                </p>
              </div>

              {/* Sub numbers */}
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-3">
                <span>元本 {formatCurrency(result.totalPrincipal)}</span>
                <span>→</span>
                <span className="text-slate-700 font-bold">{formatCurrency(result.finalValue)}</span>
              </div>

              {/* Trust line */}
              <div className="mt-4 pt-3 border-t border-[#D9E3E8] flex items-center gap-1.5 text-[10px] text-slate-500">
                <ShieldCheck className="h-3 w-3 flex-shrink-0" />
                <span>{returnDefinition.quality === "A" ? `${returnDefinition.seriesName}（${returnDefinition.startMonth}〜${returnDefinition.endMonth}）` : "参考データ・原典未検証。A品質の実績順位には使用していません"}</span>
              </div>
            </div>

            <Link
              href={`/simulate/${page.fundId}/${page.simYear}`}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#D2DEE4] bg-[#F4F7F8] py-3.5 text-sm font-bold text-slate-700 hover:bg-[#EAF3F7] transition-colors"
            >
              自分の条件でシミュレーションしてみる
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section> : <section className="mb-12 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5 space-y-2">
            <ReturnQualityPill fundId={page.fundId} />
            <p className="text-sm font-bold text-amber-200">参考系列の評価額は表示しません</p>
            <p className="text-xs leading-relaxed text-slate-600">月次原典、通貨、配当、費用、為替の扱いが未検証のため、積立評価額・利益・推移を検証済み実績として表示しません。商品属性と一次情報を確認できます。</p>
          </section>}

          {/* ── Related Funds ─────────────────────────────────────── */}
          <section className="mb-12">
            <SectionHeading>{fund.shortName}と比較される銘柄</SectionHeading>
            <div className="grid grid-cols-3 gap-3">
              {relatedPages.map((rp) => {
                const rf = FUNDS[rp.fundId];
                const rResult = simulate({
                  fundId: rp.fundId,
                  startYear: rp.simYear,
                  startMonth: rp.simMonth,
                  monthlyAmount: rp.simAmount,
                });
                return (
                  <Link
                    key={rp.slug}
                    href={`/${rp.slug}`}
                    className="rounded-xl border border-[#D9E3E8] p-4 text-center hover:bg-[#F4F7F8] transition-colors group"
                    style={{ background: "#FFFFFF" }}
                  >
                    <div
                      className="h-2 w-2 rounded-full mx-auto mb-2"
                      style={{ background: rf.color }}
                    />
                    <p
                      className="text-sm font-bold mb-1 group-hover:opacity-90 transition-opacity"
                      style={{ color: rf.color }}
                    >
                      {rf.shortName}
                    </p>
                    <p className="text-[10px] text-slate-600 leading-tight">{rp.heroSubtitle}</p>
                    <p className="text-xs font-bold text-emerald-700 mt-1.5">
                      +{rResult.returnRate.toFixed(0)}%
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── All Funds Footer Links ────────────────────────────── */}
          <section className="mb-12">
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3">
              その他の銘柄を見る
            </p>
            <div className="flex flex-wrap gap-2">
              {FUND_SEO_PAGES.filter((p) => p.slug !== page.slug && p.slug !== "schd").map((p) => {
                const f = FUNDS[p.fundId];
                return (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="flex items-center gap-1.5 rounded-full border border-[#D9E3E8] bg-white/3 px-3 py-1.5 text-xs font-bold hover:bg-white/6 transition-colors"
                    style={{ color: f.color, borderColor: `${f.color}30` }}
                  >
                    {f.shortName}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── FAQ ──────────────────────────────────────────────── */}
          <section className="mb-12">
            <SectionHeading>よくある質問（FAQ）</SectionHeading>
            <div className="space-y-3">
              {displayedFaqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-[#D9E3E8] p-5"
                  style={{ background: "#FFFFFF" }}
                >
                  <p className="font-bold text-[#263A53] text-sm mb-2 leading-snug">
                    Q. {faq.q}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Bottom CTA ───────────────────────────────────────── */}
          <section
            className="rounded-2xl border border-[#D2DEE4] p-8 text-center"
            style={{ background: "#F8FBFC" }}
          >
            <p
              className="text-lg font-bold text-[#263A53] mb-2"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              もし積み立てていたら、いくらになった？
            </p>
            <p className="text-sm text-slate-600 mb-6">
              開始年・積立額・銘柄を選んでシミュレーション
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{
                background: "#236B8E",
                boxShadow: "0 8px 24px #6366f130",
              }}
            >
              積立タイムマシンで試してみる
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-[10px] text-slate-500 mt-4">
              {returnDefinition.quality === "A" ? "※ 一次情報から検証した月次実績を使用しています。税金・売買コスト等は個別計算していません。" : "※ 参考データ・原典未検証の系列です。公式月次データとして扱わず、将来の運用成果を示すものではありません。"}
            </p>
          </section>
          <DisclaimerBar />
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
