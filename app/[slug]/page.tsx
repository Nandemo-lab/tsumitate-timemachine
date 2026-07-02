import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, TrendingUp, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { getFundSeoPage, FUND_SEO_PAGES, FundSeoPage } from "@/lib/fund-seo";
import { FUNDS } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
import SiteFooter from "@/components/layout/SiteFooter";
import DisclaimerBar from "@/components/common/DisclaimerBar";

const BASE_URL = "https://tsumitate-timemachine.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return FUND_SEO_PAGES.map((p) => ({ slug: p.slug }));
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
      className="text-lg font-bold text-white mb-5"
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
    mainEntity: page.faqs.map((faq) => ({
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
        className="min-h-dvh bg-zinc-950 text-zinc-50"
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
        <nav className="relative border-b border-white/8 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">
              積立タイムマシン
            </Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-zinc-200">{fund.shortName}</span>
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
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-serif-jp), serif", letterSpacing: "0.01em" }}
            >
              {page.heroTitle}
            </h1>
            <p className="text-base text-zinc-400 mb-4">{page.heroSubtitle}</p>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto mb-8">
              {page.heroDescription}
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

          {/* ── Features ─────────────────────────────────────────── */}
          <section className="mb-12">
            <SectionHeading>{fund.shortName}の特徴・メリット</SectionHeading>
            <div className="grid grid-cols-2 gap-3">
              {page.features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-white/8 p-4"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <span className="text-2xl mb-2 block">{f.icon}</span>
                  <p className="font-bold text-white text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── For Whom ─────────────────────────────────────────── */}
          <section className="mb-12">
            <SectionHeading>こんな人におすすめ</SectionHeading>
            <div
              className="rounded-2xl border border-white/10 p-5 space-y-3"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {page.forWhom.map((w) => (
                <div key={w} className="flex items-start gap-3">
                  <CheckCircle2
                    className="h-4 w-4 mt-0.5 flex-shrink-0"
                    style={{ color: fund.color }}
                  />
                  <p className="text-sm text-zinc-200 leading-relaxed">{w}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Simulation Result ─────────────────────────────────── */}
          <section className="mb-12">
            <SectionHeading>過去実績シミュレーション</SectionHeading>
            <p className="text-xs text-zinc-400 mb-4">
              {page.simYear}年{page.simMonth}月から毎月{formatCurrency(page.simAmount)}を積み立てた場合（2025年6月時点）
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
                <p className="text-lg font-bold text-emerald-400">
                  （+{result.returnRate.toFixed(1)}%）
                </p>
              </div>

              {/* Sub numbers */}
              <div className="flex items-center gap-3 text-xs text-zinc-400 mt-3">
                <span>元本 {formatCurrency(result.totalPrincipal)}</span>
                <span>→</span>
                <span className="text-zinc-200 font-bold">{formatCurrency(result.finalValue)}</span>
              </div>

              {/* Trust line */}
              <div className="mt-4 pt-3 border-t border-white/8 flex items-center gap-1.5 text-[10px] text-zinc-500">
                <ShieldCheck className="h-3 w-3 flex-shrink-0" />
                <span>2015〜2025年の実データ使用・配当再投資込み・手数料・税金は考慮外</span>
              </div>
            </div>

            <Link
              href={`/simulate/${page.fundId}/${page.simYear}`}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-bold text-zinc-200 hover:bg-white/8 transition-colors"
            >
              自分の条件でシミュレーションしてみる
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

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
                    className="rounded-xl border border-white/8 p-4 text-center hover:bg-white/5 transition-colors group"
                    style={{ background: "rgba(255,255,255,0.02)" }}
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
                    <p className="text-[10px] text-zinc-400 leading-tight">{rp.heroSubtitle}</p>
                    <p className="text-xs font-bold text-emerald-400 mt-1.5">
                      +{rResult.returnRate.toFixed(0)}%
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── All Funds Footer Links ────────────────────────────── */}
          <section className="mb-12">
            <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-3">
              その他の銘柄を見る
            </p>
            <div className="flex flex-wrap gap-2">
              {FUND_SEO_PAGES.filter((p) => p.slug !== page.slug).map((p) => {
                const f = FUNDS[p.fundId];
                return (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-xs font-bold hover:bg-white/6 transition-colors"
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
              {page.faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-white/8 p-5"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  <p className="font-bold text-white text-sm mb-2 leading-snug">
                    Q. {faq.q}
                  </p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Bottom CTA ───────────────────────────────────────── */}
          <section
            className="rounded-2xl border border-white/10 p-8 text-center"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p
              className="text-lg font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              もし積み立てていたら、いくらになった？
            </p>
            <p className="text-sm text-zinc-400 mb-6">
              開始年・積立額・銘柄を選んでシミュレーション
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #f59e0b 100%)",
                boxShadow: "0 8px 24px #6366f130",
              }}
            >
              積立タイムマシンで試してみる
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-[10px] text-zinc-500 mt-4">
              ※ 過去実績に基づくシミュレーションです。将来の運用成果を保証しません。
            </p>
          </section>
          <DisclaimerBar />
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
