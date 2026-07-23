import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, ArrowRight, Landmark, ShieldCheck } from "lucide-react";
import { getGuidePage } from "@/lib/guide-pages";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

const BASE_URL = SITE_URL;

// 税金クラスタ8記事。初心者にとって理解しやすい順に並べている。
const TAX_CLUSTER_SLUGS = [
  "nisa-vs-tokutei-tax",
  "nisa-waku-tsukaikitta-ato",
  "bunpaikin-to-zeikin",
  "songai-tsuusan-kurikoshi-koujo",
  "gaikoku-zeigaku-koujo",
  "tokutei-ippan-nisa-kouza-chigai",
  "haitoukin-uketori-houhou",
  "toushi-kakuteishinkoku-necessary-cases",
] as const;

// 関連する制度クラスタの記事（税金の前提となる非課税枠・口座の話）
const RELATED_SYSTEM_SLUGS = [
  "nisa-tsumitate-vs-seicho",
  "kyuu-nisa-kara-ikou",
  "nisa-kinyuukikan-henkou",
] as const;

const TITLE = "新NISAの税金ガイド一覧｜非課税・確定申告をまとめて解説";
const DESCRIPTION =
  "新NISAと課税口座の税率の違いから、分配金・損益通算・外国税額控除・確定申告まで、投資の税金に関する記事をまとめて解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/guide/tax` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/guide/tax`,
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

export default function TaxGuideIndexPage() {
  const taxGuides: { order: number; slug: string; page: NonNullable<ReturnType<typeof getGuidePage>> }[] = [];
  TAX_CLUSTER_SLUGS.forEach((slug, i) => {
    const page = getGuidePage(slug);
    if (page) taxGuides.push({ order: i + 1, slug, page });
  });

  const relatedGuides: { slug: string; page: NonNullable<ReturnType<typeof getGuidePage>> }[] = [];
  RELATED_SYSTEM_SLUGS.forEach((slug) => {
    const page = getGuidePage(slug);
    if (page) relatedGuides.push({ slug, page });
  });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "新NISAの税金ガイド一覧",
    itemListElement: taxGuides.map(({ order, slug, page }) => ({
      "@type": "ListItem",
      position: order,
      name: page.h1,
      url: `${BASE_URL}/guide/${slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "投資ガイド", item: `${BASE_URL}/guide` },
      { "@type": "ListItem", position: 3, name: "税金ガイド一覧", item: `${BASE_URL}/guide/tax` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-dvh bg-zinc-950 text-zinc-50">
        <nav className="border-b border-white/[0.07] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400 flex-wrap">
            <Link href="/" className="hover:text-zinc-200 transition-colors">積立タイムマシン</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-zinc-500">投資ガイド</span>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-zinc-200">税金ガイド一覧</span>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-10 pb-20 space-y-10">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
              <Landmark className="h-3 w-3 text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-400">税金ガイド</span>
            </div>
            <h1
              className="text-2xl font-black text-white leading-tight"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              新NISAの税金ガイド一覧
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              新NISAと課税口座の税率の違いから、分配金・損益通算・外国税額控除・確定申告まで、投資にまつわる税金の仕組みを8つの記事に整理しています。まずはじめて読む方は、上から順番に読み進めることをおすすめします。
            </p>
          </header>

          <section className="rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15 p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <p className="text-xs font-bold text-emerald-200">制度は将来変更される可能性があります</p>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              各記事の税率・制度上の数値は執筆時点の公式情報にもとづきます。最新情報は金融庁・国税庁・お取引の証券会社等の公式情報をご確認ください。
            </p>
          </section>

          <div className="space-y-3">
            {taxGuides.map(({ order, slug, page }) => (
              <Link
                key={slug}
                href={`/guide/${slug}`}
                className="block rounded-xl border border-white/[0.08] p-5 hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-[11px] font-bold text-emerald-400">
                    {order}
                  </span>
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-base font-bold text-white leading-snug">{page.h1}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{page.metaDescription}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
                      続きを読む <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-white">あわせて読みたい制度ガイド</h2>
            <div className="space-y-2">
              {relatedGuides.map(({ slug, page }) => (
                <Link
                  key={slug}
                  href={`/guide/${slug}`}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] px-4 py-3 hover:bg-white/[0.03] transition-colors group"
                >
                  <span className="text-sm text-zinc-300">{page.h1}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </>
  );
}
