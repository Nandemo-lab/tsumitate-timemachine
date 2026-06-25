import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, CheckCircle2, ArrowRight, TrendingUp } from "lucide-react";
import { getComparePage, COMPARE_PAGES } from "@/lib/compare-pages";
import { FUNDS } from "@/lib/funds";
import { getFundPageSlug } from "@/lib/fund-seo-pages";
import { simulate, formatCurrency } from "@/lib/simulation";
import { YEAR_PAGES } from "@/lib/year-pages";
import SiteFooter from "@/components/layout/SiteFooter";
import ComparePageClient from "./ComparePageClient";

const BASE_URL = "https://tsumitate-timemachine.vercel.app";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return COMPARE_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) return {};
  const fundA = FUNDS[page.fundAId];
  const fundB = FUNDS[page.fundBId];
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `${BASE_URL}/compare/${page.slug}` },
    openGraph: {
      title: `${fundA.shortName} vs ${fundB.shortName} | 積立タイムマシン`,
      description: page.metaDescription,
      url: `${BASE_URL}/compare/${page.slug}`,
      type: "article",
      siteName: "積立タイムマシン",
      locale: "ja_JP",
      images: [
        {
          url: `${BASE_URL}/api/og?fund=${page.fundAId}&fundB=${page.fundBId}&year=${page.simYear}&amount=${page.simAmount}`,
          width: 1200,
          height: 630,
          alt: `${fundA.shortName} vs ${fundB.shortName} 積立比較`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${fundA.shortName} vs ${fundB.shortName} | 積立タイムマシン`,
      description: page.metaDescription,
      images: [
        `${BASE_URL}/api/og?fund=${page.fundAId}&fundB=${page.fundBId}&year=${page.simYear}&amount=${page.simAmount}`,
      ],
    },
  };
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();

  const fundA = FUNDS[page.fundAId];
  const fundB = FUNDS[page.fundBId];

  const resultA = simulate({
    fundId: page.fundAId,
    startYear: page.simYear,
    startMonth: page.simMonth,
    monthlyAmount: page.simAmount,
  });
  const resultB = simulate({
    fundId: page.fundBId,
    startYear: page.simYear,
    startMonth: page.simMonth,
    monthlyAmount: page.simAmount,
  });

  // JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "比較", item: `${BASE_URL}/compare` },
      { "@type": "ListItem", position: 3, name: `${fundA.shortName} vs ${fundB.shortName}`, item: `${BASE_URL}/compare/${slug}` },
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

      <div className="min-h-dvh bg-zinc-950 text-zinc-50">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-16 space-y-10">

          {/* パンくず */}
          <nav className="flex items-center gap-1 text-xs text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 transition-colors">ホーム</Link>
            <ChevronRight className="h-3 w-3" />
            <span>比較</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-400">{fundA.shortName} vs {fundB.shortName}</span>
          </nav>

          {/* ── ファーストビュー ────────────────────────────────── */}
          <section className="space-y-4">
            <h1
              className="text-2xl font-black leading-tight text-white"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {page.h1}
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">{page.intro}</p>

            {/* 結論カード */}
            <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 space-y-3">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">結論</p>
              {[
                { text: page.conclusionA, color: fundA.color },
                { text: page.conclusionB, color: fundB.color },
              ].map(({ text, color }) => (
                <div key={text} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color }} />
                  <span className="text-sm font-bold text-white">{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 積立シミュレーション比較（クライアント） ─────────── */}
          <ComparePageClient resultA={resultA} resultB={resultB} />

          {/* ── 比較表 ─────────────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {fundA.shortName} vs {fundB.shortName} スペック比較表
            </h2>
            <div className="rounded-xl border border-white/[0.08] overflow-hidden">
              {/* ヘッダー */}
              <div className="grid grid-cols-3 bg-white/[0.06] px-4 py-2.5">
                <span className="text-xs text-zinc-500">項目</span>
                <span className="text-xs font-bold" style={{ color: fundA.color }}>{fundA.shortName}</span>
                <span className="text-xs font-bold" style={{ color: fundB.color }}>{fundB.shortName}</span>
              </div>
              {page.specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`grid grid-cols-3 px-4 py-3 gap-2 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                >
                  <span className="text-xs text-zinc-500 self-center">{spec.label}</span>
                  <span className="text-xs text-zinc-300 self-center">{spec.a}</span>
                  <span className="text-xs text-zinc-300 self-center">{spec.b}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ────────────────────────────────────────────── */}
          <section className="rounded-2xl bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/20 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white" style={{ fontFamily: "var(--font-serif-jp), serif" }}>
                自分の条件でシミュレーション
              </h2>
            </div>
            <p className="text-sm text-zinc-400">
              積立開始年・月額を変えて、あなたの「たられば」を計算できます。
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href={`/simulate/${page.fundAId}/2020`}
                className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-sm text-white transition-opacity hover:opacity-90"
                style={{ background: fundA.color }}
              >
                {fundA.shortName}でシミュレーション
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/simulate/${page.fundBId}/2020`}
                className="flex items-center justify-between rounded-xl px-4 py-3 font-bold text-sm text-white transition-opacity hover:opacity-90"
                style={{ background: fundB.color }}
              >
                {fundB.shortName}でシミュレーション
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* ── FAQ ────────────────────────────────────────────── */}
          <section>
            <h2
              className="text-base font-bold text-white mb-5"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              {fundA.shortName}と{fundB.shortName}のよくある質問
            </h2>
            <div className="space-y-4">
              {page.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4 space-y-2"
                >
                  <p className="text-sm font-bold text-white">Q. {faq.q}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">A. {faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── 関連する比較 ────────────────────────────────────── */}
          {(() => {
            // 両銘柄に関連するものを優先、それ以外で補完して最大4件
            const involved = new Set([page.fundAId, page.fundBId]);
            const priority = COMPARE_PAGES.filter(
              (p) => p.slug !== page.slug && (involved.has(p.fundAId) || involved.has(p.fundBId))
            );
            const others = COMPARE_PAGES.filter(
              (p) => p.slug !== page.slug && !priority.includes(p)
            );
            const related = [...priority, ...others].slice(0, 4);
            if (related.length === 0) return null;
            return (
              <section>
                <h2
                  className="text-base font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-serif-jp), serif" }}
                >
                  次に読まれることが多い比較
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {related.map((p) => {
                    const fA = FUNDS[p.fundAId];
                    const fB = FUNDS[p.fundBId];
                    return (
                      <Link
                        key={p.slug}
                        href={`/compare/${p.slug}`}
                        className="flex flex-col gap-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                      >
                        <span className="flex items-center gap-2 text-sm font-bold text-white">
                          <span style={{ color: fA.color }}>{fA.shortName}</span>
                          <span className="text-zinc-500 text-xs">vs</span>
                          <span style={{ color: fB.color }}>{fB.shortName}</span>
                        </span>
                        <span className="text-xs text-zinc-500">{p.relatedDescription}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* ── 他の人気シミュレーション ──────────────────────────── */}
          {(() => {
            const involved = new Set([page.fundAId, page.fundBId]);
            const simLinks = YEAR_PAGES.filter((yp) => involved.has(yp.fundId)).slice(0, 4);
            if (simLinks.length === 0) return null;
            return (
              <section>
                <h2
                  className="text-base font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-serif-jp), serif" }}
                >
                  他の人気シミュレーション
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {simLinks.map((yp) => {
                    const f = FUNDS[yp.fundId];
                    const r = simulate({
                      fundId: yp.fundId,
                      startYear: yp.year,
                      startMonth: yp.simMonth,
                      monthlyAmount: yp.simAmount,
                    });
                    return (
                      <Link
                        key={`${yp.fundSlug}-${yp.year}`}
                        href={`/${yp.fundSlug}/${yp.year}`}
                        className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-2 w-2 rounded-full flex-shrink-0"
                            style={{ background: f.color }}
                          />
                          <span className="text-sm text-zinc-300">
                            {yp.year}年から{f.encyclopedia.nickname}を積み立てていたら
                          </span>
                        </div>
                        <span
                          className="text-xs font-bold font-number flex-shrink-0"
                          style={{ color: r.profit >= 0 ? "#10b981" : "#ef4444" }}
                        >
                          {r.profit >= 0 ? "+" : ""}{r.returnRate.toFixed(1)}%
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })()}

          {/* ── 関連する銘柄解説 ─────────────────────────────────── */}
          {(() => {
            const fundLinks = [
              { fundId: page.fundAId, fund: fundA },
              { fundId: page.fundBId, fund: fundB },
            ].flatMap(({ fundId, fund: f }) => {
              const s = getFundPageSlug(fundId);
              return s ? [{ slug: s, fund: f }] : [];
            });
            if (fundLinks.length === 0) return null;
            return (
              <section>
                <h2
                  className="text-base font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-serif-jp), serif" }}
                >
                  関連する銘柄解説
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fundLinks.map(({ slug: fSlug, fund: f }) => (
                    <Link
                      key={fSlug}
                      href={`/fund/${fSlug}`}
                      className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 hover:bg-white/[0.07] transition-colors"
                    >
                      <span
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ background: f.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{f.shortName}とは？</p>
                        <p className="text-[10px] text-zinc-500 truncate">{f.encyclopedia.catchCopy}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })()}

        </div>
        <SiteFooter />
      </div>
    </>
  );
}
