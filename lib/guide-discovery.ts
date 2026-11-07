import type { ArticleMeta } from "@/lib/article-pages";
import type { GuidePage } from "@/lib/guide-pages";

export type DiscoveryContentType = "guide" | "article";

export interface GuideDiscoveryCategory {
  id: string;
  label: string;
  description: string;
}

export interface GuideDiscoveryItem {
  id: string;
  href: string;
  title: string;
  description: string;
  reason: string;
  categoryId: string;
  contentType: DiscoveryContentType;
  searchText: string;
  isNew?: boolean;
}

export const GUIDE_DISCOVERY_CATEGORIES: GuideDiscoveryCategory[] = [
  { id: "first", label: "はじめての投資", description: "貯金との違い、商品の仕組み、始める前のお金を整理" },
  { id: "nisa", label: "NISAの基本", description: "投資枠、口座、税金、手続を公式情報から確認" },
  { id: "children", label: "子どものお金", description: "こどもNISA、教育費、年齢と使う時期を確認" },
  { id: "compare", label: "商品を比べる", description: "投資対象・費用・商品形態の違いを比較" },
  { id: "continue", label: "積立を続ける", description: "月額、期間、停止、取り崩しを考える" },
  { id: "risk", label: "損失・リスク", description: "元本割れ、暴落、集中投資の注意を確認" },
  { id: "tax", label: "制度・税金", description: "課税口座、配当、申告、制度変更を確認" },
];

const CATEGORY_SLUGS: Record<string, string[]> = {
  first: [
    "saving-vs-investing", "stock-fund-etf-difference", "money-not-to-invest",
    "index-investing", "how-to-start", "nisa-beginner", "index-shippai-pattern",
  ],
  nisa: [
    "nisa-tsumitate-vs-seicho", "nisa-tsumitate-ikura", "nisa-wariate-osusume",
    "nisa-kinyuukikan-henkou", "kyuu-nisa-kara-ikou", "junior-nisa-shuuryou-go",
  ],
  children: [
    "kodomo-nisa", "kodomo-nisa-tsumitate-ikura", "kodomo-nisa-orukan-vs-sp500",
    "kodomo-nisa-vs-gakushi-hoken", "kodomo-nisa-hikidashi",
    "kodomo-nisa-daigaku-shikin-deguchi", "kodomo-nisa-nansai-kara",
    "kodomo-nisa-oya-nisa-tsukaiwake",
  ],
  compare: [
    "orukan-ippon-de-ii", "orukan-yameta-houga-ii", "shinnisa-schd-kaeru",
    "tsumitate-vs-ikkatu", "ikkatsu-vs-tsumitate-booraku",
  ],
  continue: [
    "dollar-cost-averaging", "retirement-investing", "nisa-tsumitate-ikura",
    "tsumitate-nansnen-keizoku", "tsumitate-torikuzushi",
  ],
  risk: [
    "sp500-booraku-taisho", "booraku-tsumitate-yameru", "shinnisa-booraku-dousuru",
    "lehman-kyuu-tsumitate-kensho", "ikkatsu-vs-tsumitate-booraku", "index-shippai-pattern",
  ],
  tax: [
    "nisa-vs-tokutei-tax", "nisa-waku-tsukaikitta-ato", "bunpaikin-to-zeikin",
    "songai-tsuusan-kurikoshi-koujo", "gaikoku-zeigaku-koujo",
    "tokutei-ippan-nisa-kouza-chigai", "haitoukin-uketori-houhou",
    "toushi-kakuteishinkoku-necessary-cases",
  ],
};

const SEARCH_ALIASES: Record<string, string> = {
  "saving-vs-investing": "貯蓄 預金 どっち お金を増やす",
  "stock-fund-etf-difference": "株 投信 上場投資信託 違い",
  "money-not-to-invest": "生活防衛資金 余裕資金 緊急資金 近く使うお金",
  "kodomo-nisa": "子供NISA 未成年NISA 2027",
  "kodomo-nisa-hikidashi": "途中引き出し 払い出し 売却",
  "nisa-tsumitate-ikura": "毎月いくら 積立額 月1万円 月3万円",
  "sp500-booraku-taisho": "下落 損する 元本割れ",
  "orukan-yameta-houga-ii": "オールカントリー やばい やめとけ",
  "index-investing": "指数 パッシブ 投資信託",
};

function categoryForSlug(slug: string) {
  for (const category of GUIDE_DISCOVERY_CATEGORIES) {
    if (CATEGORY_SLUGS[category.id]?.includes(slug)) return category.id;
  }
  return "continue";
}

export function buildGuideDiscoveryItems(guides: GuidePage[], articles: ArticleMeta[]): GuideDiscoveryItem[] {
  const guideItems = guides.map((guide) => {
    const categoryId = categoryForSlug(guide.slug);
    return {
      id: `guide:${guide.slug}`,
      href: `/guide/${guide.slug}`,
      title: guide.h1,
      description: guide.metaDescription,
      reason: guide.tldr?.bullets[0] ?? guide.conclusion?.[0] ?? guide.points[0]?.title ?? "疑問を整理できます。",
      categoryId,
      contentType: "guide" as const,
      searchText: [guide.h1, guide.metaTitle, guide.metaDescription, SEARCH_ALIASES[guide.slug] ?? ""].join(" "),
      isNew: ["saving-vs-investing", "stock-fund-etf-difference", "money-not-to-invest"].includes(guide.slug),
    };
  });

  const articleItems = articles.map((article) => ({
    id: `article:${article.slug}`,
    href: `/articles/${article.slug}`,
    title: article.h1,
    description: article.metaDescription,
    reason: "商品構造と同条件の過去実績を分けて確認できます。",
    categoryId: "compare",
    contentType: "article" as const,
    searchText: [article.h1, article.metaTitle, article.metaDescription, article.category, "比較 どっち 違い"].join(" "),
  }));

  return [...guideItems, ...articleItems];
}
