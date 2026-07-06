#!/usr/bin/env node
/**
 * 新規比較記事のスキャフォールドを生成するスクリプト。
 *
 * 使い方:
 *   node scripts/new-article.mjs --slug schd-vs-vt --fundA schd --fundB vt \
 *     --title "SCHDとVTどっち？配当重視と全世界分散を比較" \
 *     --description "楽天SCHDとVTの配当利回り・分散性・過去実績を比較。配当収入か世界分散か、判断材料を整理しました。"
 *
 * 生成されるもの:
 *   content/articles/<slug>.tsx （ArticleBlocks共通コンポーネントを使うひな形）
 *   content/articles/index.ts への登録案内（自動編集はしない。手動で1行追加する）
 *
 * 生成後は AGENTS.md に明記された以下の手順を必ず実施すること。
 *   1. content/articles/index.ts に ARTICLE_REGISTRY のエントリを追加
 *   2. lib/funds.ts の実データで本文・数値を埋める（ハードコード厳禁）
 *   3. npm run build
 *   4. node scripts/qa-check.mjs
 *   5. PC確認・スマホ確認（ブラウザで実際に開く）
 *   6. Search Console登録
 *   7. X投稿文の作成
 */
import fs from "fs";
import path from "path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      out[key] = argv[i + 1];
      i++;
    }
  }
  return out;
}

const opts = parseArgs(process.argv.slice(2));
const { slug, fundA, fundB, title, description } = opts;

if (!slug || !fundA || !fundB || !title || !description) {
  console.error(
    "使い方: node scripts/new-article.mjs --slug <slug> --fundA <fundId> --fundB <fundId> --title \"...\" --description \"...\""
  );
  process.exit(1);
}

const outPath = path.join(process.cwd(), "content", "articles", `${slug}.tsx`);
if (fs.existsSync(outPath)) {
  console.error(`✗ 既に存在します: ${outPath}`);
  process.exit(1);
}

const componentName = slug
  .split("-")
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join("");

const today = new Date();
const publishedAt = today.toISOString().slice(0, 10);
const lastUpdated = `${today.getFullYear()}年${today.getMonth() + 1}月`;

const template = `import Link from "next/link";
import { CheckCircle2, AlertTriangle, TrendingUp, BookOpen, ArrowRight } from "lucide-react";
import { simulate, formatCurrency } from "@/lib/simulation";
import { FUNDS, formatAnnualReturn, formatExpenseRatio } from "@/lib/funds";
import GuideEeat from "@/components/guide/GuideEeat";
import DisclaimerBar from "@/components/common/DisclaimerBar";
import { SectionHeading, SpecCard, SimCard } from "@/components/articles/ArticleBlocks";
import type { ArticleMeta } from "@/lib/article-pages";

// ─── メタデータ ────────────────────────────────────────────────────────────
// 【重要】metaTitle にサイト名サフィックス「 | 積立タイムマシン」を書かないこと。
// root layout の title.template が自動付与するため、直書きすると二重表示になる。

export const meta: ArticleMeta = {
  slug: "${slug}",
  h1: "${title}",
  metaTitle: "${title}",
  metaDescription: "${description}",
  lastUpdated: "${lastUpdated}",
  publishedAt: "${publishedAt}",
  category: "比較コラム",
  ogFundA: "${fundA}",
  ogFundB: "${fundB}",
  ogYear: 2020,
  ogMonth: 1,
  ogAmount: 30000,
  relatedFunds: ["${fundA}", "${fundB}"],
  relatedGuides: [
    // TODO: lib/guide-pages.ts の既存slugから関連性の高いものを2〜5件選ぶ
  ],
};

// ─── シミュレーションデータ（lib/funds.ts のみを参照。数値のハードコード禁止） ───

const simA = simulate({ fundId: "${fundA}", startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
const simB = simulate({ fundId: "${fundB}", startYear: 2020, startMonth: 1, monthlyAmount: 30000 });

// ─── 目次 ────────────────────────────────────────────────────────────────────

const TOC = [
  "結論：どちらを選ぶべきか",
  "${fundA.toUpperCase()}とは？特徴と仕組み",
  "${fundB.toUpperCase()}とは？特徴と仕組み",
  "違いを比較",
  "過去の積立シミュレーションで比較",
  "暴落時の動き方の違い",
  "新NISAではどちらが向いているか",
  "よくある質問",
  "積立タイムマシンで実際に確かめよう",
];

// ─── 記事コンテンツコンポーネント ────────────────────────────────────────────
// TODO: 以下は最小限のひな形。既存記事（content/articles/schd-vs-vym.tsx 等）を
// 参考に、本文・比較表・FAQを事実ベースで肉付けすること。
// 助言的表現（〜べき・おすすめ・一択）は使わない。将来予測ではなく過去実績として書く。

export default function ArticleContent({ meta }: { meta: ArticleMeta }) {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1">
          <BookOpen className="h-3 w-3 text-indigo-400" />
          <span className="text-[11px] font-bold text-indigo-400">{meta.category}</span>
        </div>
        <h1
          className="text-2xl font-black text-white leading-tight"
          style={{ fontFamily: "var(--font-serif-jp), serif" }}
        >
          {meta.h1}
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {/* TODO: 導入文（事実ベース・助言表現なし） */}
        </p>
      </section>

      <GuideEeat lastUpdated={meta.lastUpdated} />

      <nav className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2">
        <p className="text-xs font-bold text-zinc-300">目次</p>
        <ol className="space-y-1.5">
          {TOC.map((title, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[10px] font-bold text-indigo-400 mt-0.5 flex-shrink-0">{i + 1}.</span>
              <a href={\`#section-\${i}\`} className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors leading-snug">
                {title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* TODO: section-0〜section-N を既存記事の構成に合わせて実装 */}
      <section id="section-0" className="space-y-4">
        <SectionHeading index={0} title="結論：どちらを選ぶべきか" />
        {/* TODO */}
      </section>

      <section id="section-4" className="space-y-4">
        <SectionHeading index={4} title="過去の積立シミュレーションで比較" />
        <div className="grid grid-cols-2 gap-3">
          <SimCard name="${fundA.toUpperCase()}" color={FUNDS.${fundA}.color} sim={simA} />
          <SimCard name="${fundB.toUpperCase()}" color={FUNDS.${fundB}.color} sim={simB} />
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          ※過去の実績データに基づくシミュレーションです。配当再投資込み・手数料・税金は考慮外。将来の成果を保証するものではありません。
        </p>
      </section>

      <DisclaimerBar />

      <section className="space-y-4">
        <SectionHeading index={8} title="積立タイムマシンで実際に確かめよう" />
        <p className="text-sm text-zinc-300 leading-relaxed">
          実際に${fundA.toUpperCase()}と${fundB.toUpperCase()}を同じ条件で積み立てた場合の結果は、シミュレーションでも確認できます。
        </p>
        <Link
          href="/compare/${slug}"
          className="block rounded-2xl p-5 space-y-2 transition-all hover:opacity-90 active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #f59e0b 100%)" }}
        >
          <p className="text-xs font-bold text-white/80">積立タイムマシン 比較モード</p>
          <p className="text-lg font-black text-white leading-tight">
            比較シミュレーションを開く
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            <ArrowRight className="h-4 w-4 text-white" />
          </div>
        </Link>
      </section>
    </div>
  );
}
`;

fs.writeFileSync(outPath, template, "utf-8");

console.log(`✓ 生成しました: ${outPath}\n`);
console.log("次にやること（AGENTS.md記載の必須手順）:");
console.log(`
1. content/articles/index.ts に以下を追加する:

   import ${componentName}, { meta as ${slug.replace(/-/g, "")}Meta } from "./${slug}";

   そして ARTICLE_REGISTRY に:
   "${slug}": { meta: ${slug.replace(/-/g, "")}Meta, Content: ${componentName} },

2. 本文・比較表・FAQをlib/funds.tsの実データのみを参照して肉付けする
   （formatAnnualReturn / formatExpenseRatio / FUNDS[id].shareCount を使用）
3. npm run build
4. node scripts/qa-check.mjs   （エラー0件を確認）
5. PC確認・スマホ確認（ブラウザで実際に開く）
6. Search Console登録（sitemap反映・URL検査でインデックス登録をリクエスト）
7. X投稿文の作成
`);
