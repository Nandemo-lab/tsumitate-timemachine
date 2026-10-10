/**
 * Content-quality inventory for the pages exposed in sitemap.xml.
 *
 * This is deliberately separate from technical QA: HTTP 200 and valid metadata
 * are recorded, but they do not award a page a high editorial-quality score.
 * Usage: node scripts/content-quality-audit.mjs [baseUrl] [outputCsv]
 */

import { writeFile } from "node:fs/promises";

const baseUrl = (process.argv[2] || "https://tsumitate-timemachine.com").replace(/\/$/, "");
const output = process.argv[3] || "docs/audits/content-quality-2026-10-11.csv";

const GSC = new Map([
  ["/", { clicks: 7, impressions: 14, source: "2026-09-13 GSC screenshot" }],
  ["/compare/orukan-vs-schd", { clicks: 29, impressions: 603, source: "2026-09-13 GSC screenshot" }],
  ["/compare/vt-vs-orukan", { clicks: 12, impressions: 195, source: "2026-09-13 GSC screenshot" }],
  ["/compare/vti-vs-nasdaq100", { clicks: 6, impressions: 55, source: "2026-09-13 GSC screenshot" }],
  ["/orukan/monthly/30000", { clicks: 5, impressions: 130, source: "2026-09-13 GSC screenshot (www URL consolidated)" }],
  ["/compare/schd-vs-sp500", { clicks: 5, impressions: 38, source: "2026-09-13 GSC screenshot" }],
  ["/guide/nisa-wariate-osusume", { clicks: 2, impressions: 144, source: "2026-08-14 exported GSC CSV" }],
  ["/compare/orukan-vs-nasdaq100", { clicks: 2, impressions: 55, source: "2026-08-14 exported GSC CSV" }],
]);

function decode(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/\s+/g, " ")
    .trim();
}

function typeOf(path) {
  if (path === "/") return "tool-home";
  if (/^\/compare\/.+/.test(path)) return "compare";
  if (/^\/articles\/.+/.test(path)) return "article";
  if (/^\/fund\/.+/.test(path)) return "fund-detail";
  if (/^\/(orukan|sp500|nasdaq100|fangplus|vt|vti|vym|schd|emerging|india)$/.test(path)) return "fund-landing";
  if (/^\/from\//.test(path)) return "from-year";
  if (/\/monthly\//.test(path)) return "monthly";
  if (/^\/ranking\//.test(path) || path === "/ranking") return "ranking";
  if (/^\/guide\/(tax|system|booraku)$/.test(path) || ["/guide", "/compare", "/fund", "/articles"].includes(path)) return "hub";
  if (/^\/guide\//.test(path)) return "guide";
  if (["/about", "/about/data-sources"].includes(path)) return "trust";
  if (["/privacy", "/terms", "/disclaimer", "/ad-policy", "/contact"].includes(path)) return "policy";
  return "other";
}

function intentOf(path, title) {
  const type = typeOf(path);
  const intents = {
    "tool-home": "過去の実績条件を変えて積立結果を検証する",
    compare: "2商品の違いと同条件の過去実績を比較する",
    article: "2商品を選ぶ際の論点を文章で理解する",
    "fund-detail": "商品の正式情報・費用・実績品質を確認する",
    "fund-landing": "商品概要から積立検証へ進む",
    "from-year": "開始年別の積立実績順位を確認する",
    monthly: "特定月額の過去積立実績を確認する",
    ranking: "条件別ランキングを確認する",
    guide: "投資・制度上の疑問を根拠付きで解決する",
    hub: "関連ページを目的別に探す",
    trust: "運営・データ・検証方法を確認する",
    policy: "運営上の方針・連絡方法を確認する",
    other: title,
  };
  return intents[type];
}

function editorialScore(page) {
  const { type, chars, headings, sourceLinks, hasTool, hasGraph, hasTable, hasDataDate, stale } = page;
  const originalByType = {
    "tool-home": 25, compare: 23, article: 14, "fund-detail": 16,
    "fund-landing": 11, "from-year": 18, monthly: 17, ranking: 15,
    guide: 15, hub: 8, trust: 18, policy: 10, other: 8,
  }[type] ?? 8;
  const intent = Math.min(20, 6 + Math.min(9, Math.floor(chars / 700)) + Math.min(5, headings));
  const evidence = Math.min(20, 4 + Math.min(10, sourceLinks * 2) + (hasDataDate ? 4 : 0) + (type === "policy" ? 4 : 0));
  const tool = Math.min(15, (hasTool ? 9 : 0) + (hasGraph ? 4 : 0) + (hasTable ? 2 : 0));
  const differentiation = ({ article: 4, "fund-landing": 3, hub: 4, "from-year": 6, monthly: 6 }[type] ?? 8);
  const freshness = stale ? 2 : hasDataDate ? 8 : 5;
  return Math.min(100, originalByType + intent + evidence + tool + differentiation + freshness);
}

function classification(page) {
  if (page.type === "article" || page.type === "fund-landing") return "C";
  if (["from-year", "ranking", "hub"].includes(page.type) && page.score < 65) return "D";
  if (page.score >= 80) return "A";
  if (page.score >= 65) return "B";
  if (page.score >= 55) return "C";
  if (page.score >= 40) return "D";
  return "E";
}

function recommendation(page) {
  const actions = {
    A: "維持。更新日と独自計算の検証を継続",
    B: "維持して改善。一次情報・読後の次行動・更新時点を補強",
    C: "役割重複を解消。対になるページと検索意図を分担し統合可否を要判断",
    D: "大幅改善。固有の問い・分析・利用場面を追加し、改善不能ならindex方針を承認審議",
    E: "統合・noindex・削除候補。GSC・被リンク・履歴を確認後に承認審議",
  };
  return actions[page.classification];
}

function csv(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`sitemap ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!urls.length) throw new Error("sitemap contained no URLs");

const pages = [];
for (const url of urls) {
  const response = await fetch(url, { redirect: "manual" });
  const html = await response.text();
  const path = new URL(url).pathname;
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const text = decode(html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html);
  const type = typeOf(path);
  const sourceLinks = [...html.matchAll(/<a[^>]+href="https?:\/\/([^"/]+)/gi)]
    .map((match) => match[1])
    .filter((host) => host !== "tsumitate-timemachine.com").length;
  const page = {
    url,
    path,
    type,
    status: response.status,
    title,
    intent: intentOf(path, title),
    chars: [...text].length,
    headings: (html.match(/<h[1-3][^>]*>/gi) ?? []).length,
    sourceLinks,
    hasTool: type === "tool-home" || ["compare", "from-year", "monthly", "ranking"].includes(type) || /シミュレーション結果|現在資産|評価額/.test(text),
    hasGraph: /recharts|<svg/i.test(html),
    hasTable: /<table/i.test(html),
    hasDataDate: /最終更新|確認日|収録期間|2025年6月|2025-06/.test(text),
    stale: /2025年6月|2025-06/.test(text),
    gsc: GSC.get(path),
  };
  page.score = editorialScore(page);
  page.classification = classification(page);
  page.recommendation = recommendation(page);
  pages.push(page);
}

const headers = [
  "URL", "ページ種別", "検索意図", "品質点", "分類", "HTTP",
  "実質文字数", "見出し数", "外部一次情報リンク数", "独自計算・ツール", "グラフ", "表",
  "更新時点表示", "2025-06終端表示", "GSCクリック", "GSC表示回数", "GSC根拠", "推奨対応",
];
const rows = pages.map((page) => [
  page.url, page.type, page.intent, page.score, page.classification, page.status,
  page.chars, page.headings, page.sourceLinks, page.hasTool, page.hasGraph, page.hasTable,
  page.hasDataDate, page.stale, page.gsc?.clicks ?? "未取得", page.gsc?.impressions ?? "未取得",
  page.gsc?.source ?? "現在のエクスポートなし", page.recommendation,
]);
await writeFile(output, `\uFEFF${[headers, ...rows].map((row) => row.map(csv).join(",")).join("\n")}\n`, "utf8");

const counts = Object.fromEntries(["A", "B", "C", "D", "E"].map((key) => [key, pages.filter((page) => page.classification === key).length]));
console.log(JSON.stringify({ baseUrl, output, pages: pages.length, counts, average: Math.round(pages.reduce((sum, page) => sum + page.score, 0) / pages.length) }, null, 2));
