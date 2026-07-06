import type { ArticleMeta } from "@/lib/article-pages";

// Async server components are valid Next.js page components but TypeScript doesn't model
// them as React.ComponentType. Use ComponentType<{meta: ArticleMeta}> as the common contract.
export interface ArticleEntry {
  meta: ArticleMeta;
  Content: React.ComponentType<{ meta: ArticleMeta }>;
}

// ─── 記事の追加方法 ─────────────────────────────────────────────────────────
// 1. content/articles/<slug>.tsx を作成（meta + default export Content component）
// 2. 下の import を1行追加し、ARTICLE_REGISTRY に1エントリ追加する
// ──────────────────────────────────────────────────────────────────────────

import OrukanVsSp500, { meta as orukanVsSp500Meta } from "./orukan-vs-sp500";
import OrukanVsNasdaq100, { meta as orukanVsNasdaq100Meta } from "./orukan-vs-nasdaq100";
import Sp500VsNasdaq100, { meta as sp500VsNasdaq100Meta } from "./sp500-vs-nasdaq100";
import SchdVsVym, { meta as schdVsVymMeta } from "./schd-vs-vym";
import SchdVsSp500, { meta as schdVsSp500Meta } from "./schd-vs-sp500";

export const ARTICLE_REGISTRY: Record<string, ArticleEntry> = {
  "orukan-vs-sp500": {
    meta: orukanVsSp500Meta,
    Content: OrukanVsSp500,
  },
  "orukan-vs-nasdaq100": {
    meta: orukanVsNasdaq100Meta,
    Content: OrukanVsNasdaq100,
  },
  "sp500-vs-nasdaq100": {
    meta: sp500VsNasdaq100Meta,
    Content: Sp500VsNasdaq100,
  },
  "schd-vs-vym": {
    meta: schdVsVymMeta,
    Content: SchdVsVym,
  },
  "schd-vs-sp500": {
    meta: schdVsSp500Meta,
    Content: SchdVsSp500,
  },
  // "next-article-slug": { meta: nextMeta, Content: NextContent },
};
