import fs from "fs";
import nodePath from "path";
import { Metadata } from "next";
import { FUND_PAGES } from "@/lib/fund-seo-pages";
import { YEAR_PAGES } from "@/lib/year-pages";
import { MONTHLY_PAGES } from "@/lib/monthly-pages";
import { COMPARE_PAGES } from "@/lib/compare-pages";
import { RANKING_PAGES } from "@/lib/ranking-pages";
import { GUIDE_PAGES } from "@/lib/guide-pages";
import SeoAdminClient, { type PageSeoData } from "./SeoAdminClient";

export const metadata: Metadata = {
  title: "SEO管理",
  description: "内部SEO管理用ダッシュボード（非公開）",
  alternates: { canonical: "https://tsumitate-timemachine.com/admin/seo" },
  robots: { index: false, follow: false },
};

const BASE_URL = "https://tsumitate-timemachine.com";

// ── 短縮ファンド名 ────────────────────────────────────────────────────
const FUND_SHORT: Record<string, string> = {
  orukan: "オルカン",
  sp500: "S&P500",
  nasdaq100: "NASDAQ100",
  vti: "VTI",
  schd: "SCHD",
  vym: "VYM",
  fangplus: "FANG+",
};

const FROM_YEAR_LABEL: Record<number, string> = {
  2019: "コロナ前夜",
  2020: "コロナ直後",
  2021: "コロナ回復",
  2022: "暴落スタート",
  2023: "AIブーム",
  2024: "新NISA元年",
};

const FROM_YEAR_DESC_PREFIX: Record<number, string> = {
  2019: "コロナ前夜の",
  2020: "コロナショック直後の",
  2021: "コロナ後の回復相場が続いた",
  2022: "株価暴落が続いた",
  2023: "生成AIブームに沸いた",
  2024: "新NISA元年の",
};

// ── 内部リンクカテゴリ定義（ページ種別 → 実際にリンクしているカテゴリ） ──
const LINK_CATS: Record<string, string[]> = {
  ホーム:     ["銘柄", "比較", "年別", "月額", "ランキング", "ガイド"],
  銘柄:       ["比較", "年別"],
  年別:       ["比較", "銘柄", "年別", "ガイド", "月額"],
  月額:       ["年別", "比較", "月額"],
  比較:       ["銘柄", "年別", "比較"],
  ランキング: ["比較", "ランキング", "銘柄"],
  ガイド:     ["ガイド", "銘柄", "比較"],
  年別比較:   ["年別", "銘柄"],
};

// ── ファイル更新日取得 ─────────────────────────────────────────────────
function mtime(relPath: string): string {
  try {
    // turbopackIgnore: true
    const abs = nodePath.join(process.cwd(), relPath);
    return fs.statSync(abs).mtime.toISOString().slice(0, 10);
  } catch {
    return "—";
  }
}

const LIB_MTIME: Record<string, string> = {
  銘柄:       mtime("lib/fund-seo-pages.ts"),
  年別:       mtime("lib/year-pages.ts"),
  月額:       mtime("lib/monthly-pages.ts"),
  比較:       mtime("lib/compare-pages.ts"),
  ランキング: mtime("lib/ranking-pages.ts"),
  ガイド:     mtime("lib/guide-pages.ts"),
  年別比較:   mtime("app/from/[year]/page.tsx"),
  ホーム:     mtime("app/page.tsx"),
};

// ── タイトル改善候補生成 ──────────────────────────────────────────────
function suggestTitle(
  pageType: string,
  currentTitle: string,
  opts: { fundSlug?: string; year?: number; amount?: number; compareSlug?: string; rankSlug?: string; guideSlug?: string },
): string | undefined {
  const fund = opts.fundSlug ? FUND_SHORT[opts.fundSlug] ?? opts.fundSlug : "";
  const year = opts.year;
  const amount = opts.amount;

  switch (pageType) {
    case "銘柄": {
      if (!fund) return undefined;
      const base = `${fund}積立実績｜新NISAでの評価額・リターンを公開`;
      return base.length >= 30 ? base : `${fund}とは？新NISA積立実績・評価額を解説`;
    }
    case "年別": {
      if (!fund || !year) return undefined;
      const label = FROM_YEAR_LABEL[year] ?? String(year);
      return `${year}年（${label}）から${fund}積立→評価額・実績公開`;
    }
    case "月額": {
      if (!fund || !amount) return undefined;
      const amt = amount >= 10000 ? `月${amount / 10000}万円` : `月${amount}円`;
      return `${amt}${fund}積立→評価額はいくら？実績データ公開`;
    }
    case "比較": {
      // "X vs Y どっちがいい？..."  → "Xと Yの違い｜積立実績・コスト比較"
      const m = currentTitle.match(/^(.+?) vs (.+?) /);
      if (!m) return undefined;
      return `${m[1]}と${m[2]}の違い｜積立実績・コスト比較`;
    }
    case "ランキング": {
      if (!opts.rankSlug) return `積立投資おすすめランキング【最新版】`;
      if (opts.rankSlug === "nisa") return `新NISA積立おすすめランキング【最新版】`;
      if (opts.rankSlug === "beginner") return `初心者向け積立投資おすすめランキング【最新版】`;
      if (opts.rankSlug === "high-return") return `リターン重視積立ランキング【最新版】NASDAQ100比較`;
      if (opts.rankSlug === "high-dividend") return `高配当ETFランキング【最新版】SCHD・VYM比較`;
      return undefined;
    }
    case "ガイド": {
      if (!opts.guideSlug) return undefined;
      if (opts.guideSlug === "nisa-beginner") return `新NISAおすすめ積立先3選｜初心者向け解説`;
      if (opts.guideSlug === "index-investing") return `インデックス投資とは？新NISA活用法を解説`;
      if (opts.guideSlug === "how-to-start") return `新NISA積立の始め方｜証券会社選びから設定まで`;
      if (opts.guideSlug === "dollar-cost-averaging") return `ドルコスト平均法とは？積立投資のメリット`;
      if (opts.guideSlug === "retirement-investing") return `老後のための積立投資｜新NISAで始める方法`;
      return undefined;
    }
    case "年別比較": {
      if (!year) return undefined;
      const label = FROM_YEAR_LABEL[year] ?? String(year);
      return `${year}年（${label}）から積立→全銘柄リターン比較`;
    }
    case "ホーム":
      return `積立タイムマシン｜オルカン・S&P500積立実績を確認`;
    default:
      return undefined;
  }
}

// ── description改善候補生成 ────────────────────────────────────────────
function suggestDesc(
  pageType: string,
  currentDesc: string,
  opts: { fundSlug?: string; year?: number; amount?: number },
): string | undefined {
  const fund = opts.fundSlug ? FUND_SHORT[opts.fundSlug] ?? opts.fundSlug : "";
  const year = opts.year;
  const amount = opts.amount;

  if (currentDesc.length >= 80 && currentDesc.length <= 140) return undefined; // 適正

  switch (pageType) {
    case "銘柄": {
      if (!fund) return undefined;
      if (currentDesc.length < 80)
        return `${fund}（eMAXIS Slim）の信託報酬・リターン・新NISA対応状況を解説。積立実績データも公開中。${fund}が選ばれる理由を今すぐ確認→`;
      // Too long: shorten
      return currentDesc.slice(0, 130) + "…今すぐ確認→";
    }
    case "年別": {
      if (!fund || !year) return undefined;
      const label = FROM_YEAR_LABEL[year] ?? String(year);
      return `${label}の${year}年から${fund}を月3万円積み立てた場合の評価額・利益・リターン率を実データで公開。今すぐ確認→`;
    }
    case "月額": {
      if (!fund || !amount) return undefined;
      const amt = amount >= 10000 ? `月${amount / 10000}万円` : `月${amount}円`;
      return `${amt}を${fund}に積み立てた場合の評価額・利益・リターン率を実データで公開。新NISAでの積立先選びの参考に→`;
    }
    case "年別比較": {
      if (!year) return undefined;
      const label = FROM_YEAR_LABEL[year] ?? String(year);
      return `${label}の${year}年から月3万円積立のリターンを全銘柄で比較。オルカン・S&P500・NASDAQ100の実績を今すぐ確認→`;
    }
    default:
      return undefined;
  }
}

// ── メインのページリスト生成 ──────────────────────────────────────────
function buildPages(): PageSeoData[] {
  const pages: PageSeoData[] = [];

  // ── ホーム ──────────────────────────────────────────────────────────
  pages.push({
    path: "/",
    pageType: "ホーム",
    title: "積立タイムマシン｜あの時から積み立てていたら？",
    description: "「あの時から積み立てていたら今いくら？」を過去データでシミュレーション。新NISAの積立先選びにご活用ください。",
    canonical: `${BASE_URL}/`,
    hasOgpImage: true,
    estimatedInternalLinks: 20,
    internalLinkCategories: LINK_CATS["ホーム"],
    suggestedTitle: suggestTitle("ホーム", "", {}),
    suggestedDescription: undefined,
    lastModified: LIB_MTIME["ホーム"],
  });

  // ── 銘柄ページ ──────────────────────────────────────────────────────
  for (const p of FUND_PAGES) {
    const yearCount = YEAR_PAGES.filter(y => y.fundSlug === p.slug).length;
    const opts = { fundSlug: p.slug };
    pages.push({
      path: `/fund/${p.slug}`,
      pageType: "銘柄",
      title: p.metaTitle,
      description: p.metaDescription,
      canonical: `${BASE_URL}/fund/${p.slug}`,
      hasOgpImage: true,
      estimatedInternalLinks: p.relatedCompareSlugs.length + p.relatedFundSlugs.length + yearCount + 2,
      internalLinkCategories: LINK_CATS["銘柄"],
      suggestedTitle: suggestTitle("銘柄", p.metaTitle, opts),
      suggestedDescription: suggestDesc("銘柄", p.metaDescription, opts),
      lastModified: LIB_MTIME["銘柄"],
    });
  }

  // ── 年別ページ ──────────────────────────────────────────────────────
  for (const p of YEAR_PAGES) {
    const opts = { fundSlug: p.fundSlug, year: p.year };
    pages.push({
      path: `/${p.fundSlug}/${p.year}`,
      pageType: "年別",
      title: p.metaTitle,
      description: p.metaDescription,
      canonical: `${BASE_URL}/${p.fundSlug}/${p.year}`,
      hasOgpImage: true,
      estimatedInternalLinks: p.relatedCompareSlugs.length + p.relatedFundSlugs.length + p.otherYears.length + 6,
      internalLinkCategories: LINK_CATS["年別"],
      suggestedTitle: suggestTitle("年別", p.metaTitle, opts),
      suggestedDescription: suggestDesc("年別", p.metaDescription, opts),
      lastModified: LIB_MTIME["年別"],
    });
  }

  // ── 月額ページ ──────────────────────────────────────────────────────
  for (const p of MONTHLY_PAGES) {
    const opts = { fundSlug: p.fundSlug, amount: p.amount };
    pages.push({
      path: `/${p.fundSlug}/monthly/${p.amount}`,
      pageType: "月額",
      title: p.metaTitle,
      description: p.metaDescription,
      canonical: `${BASE_URL}/${p.fundSlug}/monthly/${p.amount}`,
      hasOgpImage: true,
      estimatedInternalLinks: p.otherAmounts.length + p.yearLinks.length + p.relatedCompareSlugs.length + 2,
      internalLinkCategories: LINK_CATS["月額"],
      suggestedTitle: suggestTitle("月額", p.metaTitle, opts),
      suggestedDescription: suggestDesc("月額", p.metaDescription, opts),
      lastModified: LIB_MTIME["月額"],
    });
  }

  // ── 比較ページ ──────────────────────────────────────────────────────
  for (const p of COMPARE_PAGES) {
    pages.push({
      path: `/compare/${p.slug}`,
      pageType: "比較",
      title: p.metaTitle,
      description: p.metaDescription,
      canonical: `${BASE_URL}/compare/${p.slug}`,
      hasOgpImage: true,
      estimatedInternalLinks: 5 + p.faqs.length,
      internalLinkCategories: LINK_CATS["比較"],
      suggestedTitle: suggestTitle("比較", p.metaTitle, { compareSlug: p.slug }),
      suggestedDescription: undefined,
      lastModified: LIB_MTIME["比較"],
    });
  }

  // ── ランキングページ ────────────────────────────────────────────────
  for (const p of RANKING_PAGES) {
    const path = p.slug ? `/ranking/${p.slug}` : "/ranking";
    pages.push({
      path,
      pageType: "ランキング",
      title: p.metaTitle,
      description: p.metaDescription,
      canonical: `${BASE_URL}${path}`,
      hasOgpImage: true,
      estimatedInternalLinks: (p.relatedCompareSlugs?.length ?? 0) + (p.relatedRankingSlugs?.length ?? 0) + p.funds.length + 2,
      internalLinkCategories: LINK_CATS["ランキング"],
      suggestedTitle: suggestTitle("ランキング", p.metaTitle, { rankSlug: p.slug }),
      suggestedDescription: undefined,
      lastModified: LIB_MTIME["ランキング"],
    });
  }

  // ── ガイドページ ────────────────────────────────────────────────────
  for (const p of GUIDE_PAGES) {
    pages.push({
      path: `/guide/${p.slug}`,
      pageType: "ガイド",
      title: p.metaTitle,
      description: p.metaDescription,
      canonical: `${BASE_URL}/guide/${p.slug}`,
      hasOgpImage: true,
      estimatedInternalLinks: 6,
      internalLinkCategories: LINK_CATS["ガイド"],
      suggestedTitle: suggestTitle("ガイド", p.metaTitle, { guideSlug: p.slug }),
      suggestedDescription: undefined,
      lastModified: LIB_MTIME["ガイド"],
    });
  }

  // ── from/[year] ─────────────────────────────────────────────────────
  for (const year of [2019, 2020, 2021, 2022, 2023, 2024]) {
    const label = FROM_YEAR_LABEL[year] ?? String(year);
    const prefix = FROM_YEAR_DESC_PREFIX[year] ?? `${year}年から`;
    const title = `${year}年（${label}）から積み立てていたら？全銘柄リターンランキング`;
    const description = `${prefix}${year}年から月3万円を全銘柄に積み立てた場合のリターンをランキング形式で公開。オルカン・S&P500・NASDAQ100など主要ファンドの実績を今すぐ確認→`;
    const opts = { year };
    pages.push({
      path: `/from/${year}`,
      pageType: "年別比較",
      title,
      description,
      canonical: `${BASE_URL}/from/${year}`,
      hasOgpImage: true,
      estimatedInternalLinks: 12,
      internalLinkCategories: LINK_CATS["年別比較"],
      suggestedTitle: suggestTitle("年別比較", title, opts),
      suggestedDescription: suggestDesc("年別比較", description, opts),
      lastModified: LIB_MTIME["年別比較"],
    });
  }

  return pages;
}

export default function SeoAdminPage() {
  const pages = buildPages();
  return (
    <div className="min-h-screen bg-zinc-950">
      <SeoAdminClient pages={pages} baseUrl={BASE_URL} />
    </div>
  );
}
