import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import { GUIDE_PAGES } from "@/lib/guide-pages";
import { ARTICLE_PAGES } from "@/lib/article-pages";
import { buildGuideDiscoveryItems, GUIDE_DISCOVERY_CATEGORIES } from "@/lib/guide-discovery";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import GuideDiscovery from "@/components/guide/GuideDiscovery";

const BASE_URL = SITE_URL;
const PAGE_TITLE = "投資ガイド一覧";
const TITLE = `${PAGE_TITLE}｜${SITE_NAME}`;
const DESCRIPTION = "投資初心者の疑問を、はじめ方・NISA・子どものお金・商品比較・リスク・税金に分けて探せるガイドです。記事から同じ条件の積立試算へ進めます。";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/guide` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${BASE_URL}/guide`, type: "website", siteName: SITE_NAME, locale: "ja_JP", images: [{ url: `${BASE_URL}/api/og?static=1`, width: 1200, height: 630, alt: TITLE }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/api/og?static=1`] },
};

export default function GuideIndexPage() {
  const items = buildGuideDiscoveryItems(GUIDE_PAGES, ARTICLE_PAGES);
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
      <div className="min-h-dvh bg-[#FAFAF7] text-[#263A53]">
        <div className="mx-auto max-w-3xl px-4 pt-5"><Breadcrumbs items={[{ label: "投資ガイド" }]} /></div>
        <main className="mx-auto max-w-3xl space-y-12 px-4 pb-20 pt-8">
          <header className="grid gap-7 border-b border-[#D9E3E8] pb-9 md:grid-cols-[1.25fr_.75fr] md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-[#236B8E]"><BookOpen className="h-4 w-4" aria-hidden="true" />投資ガイド</div>
              <h1 className="mt-3 text-3xl font-black leading-tight text-[#263A53] md:text-4xl">知りたいことから、<br className="hidden sm:block" />数字で確かめるまで。</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">難しい言葉を順番に覚える必要はありません。今の疑問から記事を選び、必要なら公式月次データの試算で確かめられます。</p>
            </div>
            <Link href="/" className="group flex min-h-12 items-center justify-between border-y border-[#B9CBD4] py-3 text-sm font-bold text-[#236B8E]">先に積立結果を試す<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
          </header>

          <section className="grid gap-5 border-b border-[#D9E3E8] pb-10 sm:grid-cols-3" aria-label="最初に選ぶ入口">
            {[
              ["初めて投資を知る", "貯金との違いから確認", "#guide-discovery-title"],
              ["子どものお金を考える", "制度・年齢・使う時期を確認", "/guide/kodomo-nisa"],
              ["商品を同条件で比べる", "投資先と過去の積立経路を確認", "/compare"],
            ].map(([title, body, href]) => (
              <Link key={title} href={href} className="group min-h-24 border-l-2 border-[#B9DCEB] pl-4">
                <strong className="block text-base leading-6 text-[#263A53] group-hover:text-[#236B8E]">{title}</strong>
                <span className="mt-2 block text-sm leading-6 text-slate-600">{body}</span>
              </Link>
            ))}
          </section>

          <GuideDiscovery items={items} categories={GUIDE_DISCOVERY_CATEGORIES} />

          <aside className="border-y border-[#D9E3E8] py-6" aria-label="比較コラムへの案内">
            <p className="text-xs font-bold text-[#236B8E]">比較を深く読む</p>
            <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm leading-6 text-slate-600">商品の仕組み・費用・投資対象を詳しく確認したい場合は、比較コラムだけをまとめた一覧も使えます。</p>
              <Link href="/articles" className="inline-flex min-h-11 flex-none items-center gap-2 text-sm font-bold text-[#236B8E]">比較コラム一覧 <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </aside>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
