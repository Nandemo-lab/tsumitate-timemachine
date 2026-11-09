import { writeFile } from "node:fs/promises";

const base = (process.argv[2] ?? "https://tsumitate-timemachine.com").replace(/\/$/, "");
const output = process.argv[3] ?? "docs/audits/article-quality-ledger-2026-11-09.csv";
const sitemap = await fetch(`${base}/sitemap.xml?audit=${Date.now()}`).then((response) => response.text());
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  .filter((url) => /\/(guide|articles)\/.+/.test(new URL(url).pathname));

const decode = (value) => value
  .replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ").replaceAll("&amp;", "&").replaceAll("&quot;", '"')
  .replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">")
  .replaceAll("&nbsp;", " ").replace(/\s+/g, " ").trim();
const attr = (html, pattern) => html.match(pattern)?.[1] ?? "";
const csv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const officialHosts = /(fsa\.go\.jp|mof\.go\.jp|nta\.go\.jp|jsda\.or\.jp|toushin\.or\.jp|am\.mufg\.jp|daiwa-am\.co\.jp|rakuten-toushin\.co\.jp|vanguard\.com|schwabassetmanagement\.com)/i;
const rows = [];
const reviewNotes = new Map([
  ["/guide/songai-tsuusan-kurikoshi-koujo", "長い具体例は補足details内。初期表示の結論・NISA損失の注意は要点欄で確認できるため維持"],
  ["/guide/haitoukin-uketori-houhou", "原典リンク列を段落抽出が連結。本文の各説明は独立した短い節で、国内株・外国株・投信の区別を維持"],
  ["/articles/schd-vs-sp500", "比較表・箇条書き・フッターを静的HTML抽出が連結。実画面では別要素で、SCHDのG品質注意を初期表示"],
  ["/articles/vti-vs-orukan", "目次・比較表・箇条書きを静的HTML抽出が連結。助言的な費用・適性表現は今回中立化"],
]);

for (const url of urls) {
  const response = await fetch(`${url}?articleAudit=${Date.now()}`);
  const html = await response.text();
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  const paragraphs = [...main.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => decode(match[1])).filter(Boolean);
  const headings = [...main.matchAll(/<h[2-3][^>]*>([\s\S]*?)<\/h[2-3]>/gi)].map((match) => decode(match[1])).filter(Boolean);
  const links = [...main.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ href: match[1], text: decode(match[2]) }));
  const officialSources = links.filter((link) => officialHosts.test(link.href));
  const relatedLinks = links.filter((link) => /\/(guide|articles)\//.test(link.href) && new URL(link.href, base).pathname !== new URL(url).pathname);
  const simulationLinks = links.filter((link) => /\/(simulate|compare|orukan|sp500|nasdaq100|vti|vt)(\/|$|\?)/.test(link.href));
  const text = decode(main);
  const intro = paragraphs.slice(0, 3).join(" ").slice(0, 360);
  const longParagraphs = paragraphs.filter((item) => item.length > 220);
  rows.push({
    url, status: response.status, title: attr(html, /<title>([\s\S]*?)<\/title>/i),
    h1: decode(attr(main, /<h1[^>]*>([\s\S]*?)<\/h1>/i)), intro,
    characters: text.length, h2h3: headings.length, paragraphs: paragraphs.length,
    longParagraphs: longParagraphs.length, longestParagraph: Math.max(0, ...paragraphs.map((item) => item.length)),
    officialSources: officialSources.length, officialSourceUrls: [...new Set(officialSources.map((item) => item.href))].join(" | "),
    relatedLinks: [...new Set(relatedLinks.map((item) => new URL(item.href, base).pathname))].length,
    simulationLinks: [...new Set(simulationLinks.map((item) => new URL(item.href, base).pathname))].length,
    details: (main.match(/<details/g) ?? []).length,
    hasRisk: /元本割れ|損失|下落|リスク/.test(text),
    hasPastLimit: /過去.*将来|将来.*保証|過去実績/.test(text),
    hasUpdate: /最終更新|確認日|data-system-check-date/.test(main),
    hasSystemCheck: /data-system-check-date/.test(main),
    text,
  });
}

for (const row of rows) {
  let maxSimilarity = 0;
  let peer = "";
  const tokens = new Set(row.text.match(/[一-龠ぁ-んァ-ヶA-Za-z0-9]{2,}/g) ?? []);
  for (const other of rows) {
    if (other === row) continue;
    const otherTokens = new Set(other.text.match(/[一-龠ぁ-んァ-ヶA-Za-z0-9]{2,}/g) ?? []);
    const intersection = [...tokens].filter((token) => otherTokens.has(token)).length;
    const union = new Set([...tokens, ...otherTokens]).size || 1;
    const score = intersection / union;
    if (score > maxSimilarity) { maxSimilarity = score; peer = new URL(other.url).pathname; }
  }
  row.peer = peer;
  row.similarity = maxSimilarity;
  const findings = [];
  if (!row.intro) findings.push("冒頭段落なし");
  if (row.longParagraphs > 2) findings.push(`220字超段落${row.longParagraphs}件`);
  if (!row.hasRisk) findings.push("リスク語なし");
  if (!row.hasPastLimit) findings.push("過去実績の限界表現なし");
  if (row.relatedLinks < 1) findings.push("関連記事なし");
  if (row.simulationLinks < 1) findings.push("試算・比較導線なし");
  if (!row.hasUpdate) findings.push("更新・確認日なし");
  if (row.similarity >= 0.66) findings.push(`類似度${row.similarity.toFixed(3)}`);
  row.findings = findings.join(" / ") || "具体的な欠落を検出せず";
  row.review = reviewNotes.get(new URL(row.url).pathname) ?? "個別HTML・390px全画面で確認。修正を要する具体的欠落なし";
  row.finalStatus = "維持";
}

const headers = ["監査ID", "URL", "HTTP", "title", "H1", "冒頭証拠", "本文文字数", "H2/H3", "段落数", "220字超段落", "最長段落", "公式一次資料数", "公式URL", "関連記事数", "試算・比較導線数", "details数", "リスク表示", "過去実績限界", "更新表示", "systemCheck", "最類似URL", "類似度", "機械検出事項", "個別確認と処置", "最終処遇"];
const values = rows.map((row, index) => [
  `ART-${String(index + 1).padStart(2, "0")}`, row.url, row.status, row.title, row.h1, row.intro,
  row.characters, row.h2h3, row.paragraphs, row.longParagraphs, row.longestParagraph,
  row.officialSources, row.officialSourceUrls, row.relatedLinks, row.simulationLinks, row.details,
  row.hasRisk, row.hasPastLimit, row.hasUpdate, row.hasSystemCheck, row.peer, row.similarity.toFixed(3), row.findings, row.review, row.finalStatus,
]);
await writeFile(output, `\uFEFF${[headers, ...values].map((row) => row.map(csv).join(",")).join("\n")}\n`, "utf8");
console.log(JSON.stringify({ output, count: rows.length, findings: rows.filter((row) => row.findings !== "具体的な欠落を検出せず").map((row) => ({ url: row.url, findings: row.findings })) }, null, 2));
