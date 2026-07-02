export interface ArticleMeta {
  slug: string;
  /** <h1> 表示タイトル */
  h1: string;
  /** <title> タグ（サフィックスなし） */
  metaTitle: string;
  metaDescription: string;
  lastUpdated: string;
  /** サイトマップ用 lastModified (ISO 8601) */
  publishedAt: string;
  category: string;
  /** OG画像生成パラメータ。未設定時は static OG を使用 */
  ogFundA?: string;
  ogFundB?: string;
  ogYear?: number;
  ogMonth?: number;
  ogAmount?: number;
  /** この記事が関連する fundId のリスト（比較・銘柄ページからの内部リンク用） */
  relatedFunds?: string[];
  /** この記事が関連する guide スラッグのリスト（ガイドページからの内部リンク用） */
  relatedGuides?: string[];
}

// ─── レジストリ ─────────────────────────────────────────────────────────────
// 記事を追加するときは content/articles/<slug>.tsx を作成し、ここに1行追加する

import { ARTICLE_REGISTRY } from "@/content/articles/index";

export { ARTICLE_REGISTRY };
export type { ArticleEntry } from "@/content/articles/index";

/** サイトマップ・generateStaticParams 用の全記事メタ配列 */
export const ARTICLE_PAGES: ArticleMeta[] = Object.values(ARTICLE_REGISTRY).map(
  (e) => e.meta
);

export function getArticlePage(slug: string): ArticleMeta | undefined {
  return ARTICLE_REGISTRY[slug]?.meta;
}

/** compare/fund ページ向け: 指定 fundId を含む記事を返す */
export function getArticlesRelatedToFunds(fundIds: string[]): ArticleMeta[] {
  return ARTICLE_PAGES.filter((a) =>
    a.relatedFunds?.some((f) => fundIds.includes(f))
  );
}

/** guide ページ向け: 指定 guide スラッグに紐づく記事を返す */
export function getArticlesRelatedToGuide(guideSlug: string): ArticleMeta[] {
  return ARTICLE_PAGES.filter((a) => a.relatedGuides?.includes(guideSlug));
}

/** OG 画像 URL を生成（BASE_URL を引数で受け取り依存注入を避ける） */
export function buildOgImageUrl(meta: ArticleMeta, baseUrl: string): string {
  if (!meta.ogFundA) return `${baseUrl}/api/og?static=1`;
  const params = new URLSearchParams({
    fund: meta.ogFundA,
    year: String(meta.ogYear ?? 2020),
    month: String(meta.ogMonth ?? 1),
    amount: String(meta.ogAmount ?? 30000),
  });
  if (meta.ogFundB) params.set("fundB", meta.ogFundB);
  return `${baseUrl}/api/og?${params.toString()}`;
}
