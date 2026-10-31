import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, ArrowRight, Landmark, ShieldCheck } from "lucide-react";
import { getGuidePage } from "@/lib/guide-pages";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

const BASE_URL = SITE_URL;

// 制度クラスタ6記事。初心者にとって理解しやすい順に並べている。
const SYSTEM_CLUSTER_SLUGS = [
  "nisa-tsumitate-vs-seicho",
  "nisa-tsumitate-ikura",
  "nisa-wariate-osusume",
  "kyuu-nisa-kara-ikou",
  "junior-nisa-shuuryou-go",
  "nisa-kinyuukikan-henkou",
] as const;

// 関連する税金クラスタの記事（制度の非課税枠と表裏一体の税金の話）
const RELATED_TAX_SLUGS = [
  "nisa-vs-tokutei-tax",
  "nisa-waku-tsukaikitta-ato",
] as const;

const TITLE = "新NISA制度ガイド一覧｜投資枠・移行・手続きをまとめて解説";
const DESCRIPTION =
  "新NISAの投資枠の使い分けから、旧NISA・ジュニアNISAとの関係、金融機関変更の手続きまで、新NISA制度に関する記事をまとめて解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/guide/system` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/guide/system`,
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

export default function SystemGuideIndexPage() {
  const systemGuides: { order: number; slug: string; page: NonNullable<ReturnType<typeof getGuidePage>> }[] = [];
  SYSTEM_CLUSTER_SLUGS.forEach((slug, i) => {
    const page = getGuidePage(slug);
    if (page) systemGuides.push({ order: i + 1, slug, page });
  });

  const relatedGuides: { slug: string; page: NonNullable<ReturnType<typeof getGuidePage>> }[] = [];
  RELATED_TAX_SLUGS.forEach((slug) => {
    const page = getGuidePage(slug);
    if (page) relatedGuides.push({ slug, page });
  });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "新NISA制度ガイド一覧",
    itemListElement: systemGuides.map(({ order, slug, page }) => ({
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
      { "@type": "ListItem", position: 3, name: "制度ガイド一覧", item: `${BASE_URL}/guide/system` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-dvh bg-[#FAFAF7] text-[#263A53]">
        <nav className="border-b border-[#DDE6EA] px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
            <Link href="/" className="hover:text-slate-700 transition-colors">積立タイムマシン</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <Link href="/guide" className="text-slate-500 hover:text-slate-700 transition-colors">投資ガイド</Link>
            <ChevronRight className="h-3 w-3 flex-shrink-0" />
            <span className="text-slate-700">制度ガイド一覧</span>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-10 pb-20 space-y-10">
          <header className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1">
              <Landmark className="h-3 w-3 text-[#236B8E]" />
              <span className="text-xs font-bold text-[#236B8E]">制度ガイド</span>
            </div>
            <h1
              className="text-2xl font-black text-[#263A53] leading-tight"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              新NISA制度ガイド一覧
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              新NISAの投資枠の使い分けから、旧NISA・ジュニアNISAとの関係、金融機関変更の手続きまで、新NISA制度の仕組みを6つの記事に整理しています。積立額、投資枠、移行、変更手続きなど、確認したい制度項目から選べます。
            </p>
          </header>

          <section className="rounded-xl bg-indigo-500/[0.04] border border-indigo-500/15 p-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#236B8E] flex-shrink-0" />
              <p className="text-xs font-bold text-[#236B8E]">制度は将来変更される可能性があります</p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              各記事の制度上の数値は執筆時点の公式情報にもとづきます。最新情報は金融庁・お取引の証券会社等の公式情報をご確認ください。
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="system-route-heading">
            <h2 id="system-route-heading" className="text-sm font-bold text-[#263A53]">手続き・枠の疑問から選ぶ</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ["2つの投資枠を比べる", "/guide/nisa-tsumitate-vs-seicho", "対象商品と年間投資枠の違いを確認"],
                ["毎月の積立額を決める", "/guide/nisa-tsumitate-ikura", "家計と年間枠を分けて確認"],
                ["旧NISA資産がある", "/guide/kyuu-nisa-kara-ikou", "非課税期間と新NISAとの関係を確認"],
                ["金融機関を変更したい", "/guide/nisa-kinyuukikan-henkou", "変更時期・書類・保有商品の扱いを確認"],
              ].map(([label, href, detail]) => (
                <Link key={href} href={href} className="rounded-xl border border-[#D9E3E8] p-4 hover:bg-white transition-colors">
                  <p className="text-sm font-bold text-[#263A53]">{label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="space-y-3">
            {systemGuides.map(({ order, slug, page }) => (
              <Link
                key={slug}
                href={`/guide/${slug}`}
                className="block rounded-xl border border-[#D9E3E8] p-5 hover:bg-white transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-xs font-bold text-[#236B8E]">
                    {order}
                  </span>
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-base font-bold text-[#263A53] leading-snug">{page.h1}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{page.metaDescription}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-600 group-hover:text-slate-700 transition-colors">
                      続きを読む <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-[#263A53]">あわせて読みたい税金ガイド</h2>
            <div className="space-y-2">
              {relatedGuides.map(({ slug, page }) => (
                <Link
                  key={slug}
                  href={`/guide/${slug}`}
                  className="flex items-center justify-between rounded-lg border border-[#E1E8EC] px-4 py-3 hover:bg-white transition-colors group"
                >
                  <span className="text-sm text-slate-700">{page.h1}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-700 transition-colors flex-shrink-0" />
                </Link>
              ))}
              <Link
                href="/guide/tax"
                className="flex items-center justify-between rounded-lg border border-[#E1E8EC] px-4 py-3 hover:bg-white transition-colors group"
              >
                <span className="text-sm text-slate-700">税金ガイド一覧を見る</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-700 transition-colors flex-shrink-0" />
              </Link>
            </div>
          </section>
        </div>

        <SiteFooter />
      </div>
    </>
  );
}
