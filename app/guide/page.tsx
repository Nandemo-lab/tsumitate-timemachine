import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { getGuidePage, GUIDE_SERIES } from "@/lib/guide-pages";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

const BASE_URL = SITE_URL;

// クラスタハブページが無いテーマの個別ガイド一覧。
// 税金・制度・暴落クラスタは専用ハブ（GUIDE_SERIES）があるためここには含めない。
const BEGINNER_SLUGS = ["nisa-beginner", "index-investing", "how-to-start", "index-shippai-pattern"] as const;
const OPERATION_SLUGS = [
  "dollar-cost-averaging",
  "orukan-ippon-de-ii",
  "tsumitate-nansnen-keizoku",
  "tsumitate-vs-ikkatu",
  "orukan-yameta-houga-ii",
  "shinnisa-schd-kaeru",
] as const;
const EXIT_SLUGS = ["tsumitate-torikuzushi", "retirement-investing"] as const;
const KODOMO_NISA_SLUGS = [
  "kodomo-nisa",
  "kodomo-nisa-tsumitate-ikura",
  "kodomo-nisa-orukan-vs-sp500",
  "kodomo-nisa-vs-gakushi-hoken",
  "kodomo-nisa-hikidashi",
  "kodomo-nisa-daigaku-shikin-deguchi",
] as const;

const SECTIONS = [
  { key: "kodomo-nisa", label: "こどもNISAクラスタ", slugs: KODOMO_NISA_SLUGS },
  { key: "beginner",  label: "初心者クラスタ",       slugs: BEGINNER_SLUGS },
  { key: "operation",  label: "運用クラスタ",         slugs: OPERATION_SLUGS },
  { key: "exit",       label: "出口戦略・家計クラスタ", slugs: EXIT_SLUGS },
] as const;

const PAGE_TITLE = "投資ガイド一覧";
const TITLE = `${PAGE_TITLE}｜${SITE_NAME}`;
const DESCRIPTION =
  "新NISA・税金・制度・暴落対応から、初心者向けの始め方、運用中の判断基準、出口戦略まで、積立投資に関するガイド記事をテーマ別にまとめています。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/guide` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/guide`,
    type: "website",
    siteName: SITE_NAME,
    locale: "ja_JP",
    images: [{ url: `${BASE_URL}/api/og?static=1`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${BASE_URL}/api/og?static=1`],
  },
};

export default function GuideIndexPage() {
  const clusterHubs = Object.values(GUIDE_SERIES)
    .filter((series) => series.hubSlug)
    .map((series) => ({
      href: `/guide/${series.hubSlug}`,
      label: series.label,
      count: series.slugs.length,
    }));

  const sections = SECTIONS.map(({ key, label, slugs }) => {
    const guides: { slug: string; page: NonNullable<ReturnType<typeof getGuidePage>> }[] = [];
    slugs.forEach((slug) => {
      const page = getGuidePage(slug);
      if (page) guides.push({ slug, page });
    });
    return { key, label, guides };
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "投資ガイド", item: `${BASE_URL}/guide` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-dvh bg-zinc-950 text-zinc-50">
        <nav className="border-b border-white/[0.07] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400">
            <Link href="/" className="hover:text-zinc-200 transition-colors">積立タイムマシン</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-zinc-200">投資ガイド</span>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-10 pb-20 space-y-10">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1">
              <BookOpen className="h-3 w-3 text-indigo-400" />
              <span className="text-[11px] font-bold text-indigo-400">投資ガイド</span>
            </div>
            <h1
              className="text-2xl font-black text-white leading-tight"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              投資ガイド一覧
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              新NISA・税金・制度・暴落対応から、初心者向けの始め方、運用中の判断基準、出口戦略まで、テーマ別に整理しています。
            </p>
          </header>

          {/* クラスタハブ（税金・制度・暴落） */}
          <section className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">まとめて読む</h2>
            </div>
            <div className="space-y-2">
              {clusterHubs.map(({ href, label, count }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-xl border border-white/[0.08] p-5 hover:bg-white/[0.03] transition-colors group"
                >
                  <div>
                    <p className="text-base font-bold text-white leading-snug">{label}一覧</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{count}記事をまとめて読む</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          {/* テーマ別セクション */}
          {sections.map(({ key, label, guides }) => (
            <section key={key} className="space-y-3">
              <h2 className="text-sm font-bold text-white">{label}</h2>
              <div className="space-y-2">
                {guides.map(({ slug, page }) => (
                  <Link
                    key={slug}
                    href={`/guide/${slug}`}
                    className="block rounded-xl border border-white/[0.08] p-4 hover:bg-white/[0.03] transition-colors group"
                  >
                    <p className="text-sm font-bold text-white leading-snug">{page.h1}</p>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">{page.metaDescription}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <SiteFooter />
      </div>
    </>
  );
}
