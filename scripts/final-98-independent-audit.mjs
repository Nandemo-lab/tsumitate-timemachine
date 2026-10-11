import { writeFile } from "node:fs/promises";

const baseUrl = (process.argv[2] || "https://tsumitate-timemachine.com").replace(/\/$/, "");
const output = "docs/audits/final-98-independent-audit-2026-10-11.csv";

const decode = (value) => value
  .replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">")
  .replaceAll("&quot;", '"').replaceAll("&#39;", "'");
const textOf = (html) => decode(html
  .replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
const cleanMain = (html) => textOf(html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html);
const csv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const official = /(fsa\.go\.jp|nta\.go\.jp|mof\.go\.jp|boj\.or\.jp|daiwa-am\.co\.jp|emaxis\.am\.mufg\.jp|rakuten-toushin\.co\.jp|vanguard\.com|ishares\.com|spglobal\.com|nasdaq\.com|nyse\.com)/i;

function typeOf(path) {
  if (path === "/") return "tool";
  if (path.startsWith("/fund/")) return "fund";
  if (path.startsWith("/compare/")) return "compare";
  if (path.startsWith("/articles/")) return "article";
  if (path.startsWith("/from/")) return "from";
  if (path.startsWith("/ranking")) return "ranking";
  if (path.includes("/monthly/")) return "monthly";
  if (/^\/(orukan|sp500|nasdaq100|vti|vt|schd)$/.test(path)) return "landing";
  if (path.startsWith("/guide/")) return "guide";
  if (["/guide", "/fund", "/compare", "/articles"].includes(path)) return "hub";
  if (["/about", "/about/data-sources"].includes(path)) return "trust";
  if (["/privacy", "/terms", "/disclaimer", "/ad-policy", "/contact"].includes(path)) return "policy";
  return "other";
}

function intent(path, title, type) {
  if (type === "tool") return "過去の月次実績で積立条件を変更・比較する";
  if (type === "fund") return "正式商品、費用、設定日、データ品質と積立結果を確認する";
  if (type === "landing") return "商品別の積立条件を変更して結果を確認する";
  if (type === "compare") return "同条件・共通期間の2商品積立結果を比較する";
  if (type === "article") return "商品構造・費用・比較結果の読み方を理解する";
  if (type === "from") return "特定開始年の積立経路・元本割れ期間・順位を確認する";
  if (type === "ranking") return "条件と対象を固定した過去実績順位を確認する";
  if (type === "monthly") return "特定月額の検証済み積立結果と条件を確認する";
  if (type === "hub") return "疑問に対応する詳細ページを選ぶ";
  if (type === "guide") return title.replace(/ \|.*$/, "") || "制度・運用上の疑問を解決する";
  if (type === "trust") return "運営・データ・計算方法と検証範囲を確認する";
  if (type === "policy") return "利用条件・編集責任・広告方針・連絡先を確認する";
  return title.replace(/ \|.*$/, "");
}

function roleAssessment(path, type, text) {
  if (type === "policy") return ["KEEP", "法務・運営上の必要情報であり、一般記事とは別役割"];
  if (type === "hub") return [text.includes("確認") ? "KEEP" : "IMPROVE", "検索流入よりも疑問別ナビゲーションとして評価"];
  if (type === "fund") return ["KEEP", "正式商品・費用・品質・固定条件結果を一か所で確認"];
  if (type === "landing") return ["ROLE SEPARATION", "商品詳細ではなく条件変更・結果確認の入口"];
  if (type === "compare") return ["KEEP", "同条件の数値・グラフ・共通期間比較"];
  if (type === "article") return ["ROLE SEPARATION", "構造・費用・判断材料・数値の読み方"];
  if (type === "from") return [text.includes("元本割れ月数") ? "KEEP" : "IMPROVE", "開始年固有の月次経路を再計算"];
  if (type === "ranking") return [text.includes("数値順位の計算方法") ? "KEEP" : "IMPROVE", "条件・品質・除外理由を明示した順位"];
  return ["KEEP", "独立した疑問または計算条件へ回答"];
}

const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.length !== 98) throw new Error(`expected 98 sitemap URLs, found ${urls.length}`);

const pages = [];
for (const url of urls) {
  const response = await fetch(url, { redirect: "manual" });
  const html = await response.text();
  const path = new URL(url).pathname;
  const type = typeOf(path);
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
  const description = decode(html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1] || "");
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] || "";
  const mainText = cleanMain(html);
  const links = [...html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)].map((match) => match[1]);
  const sources = links.filter((href) => official.test(href));
  const hasCalculation = /(元本|評価額|リターン|積立回数|元本割れ月数|月末の最大乖離|シミュレーション)/.test(mainText);
  const hasQuality = /(A：公式月次データ|G：参考データ|データ品質|検証済み月次)/.test(mainText);
  const hasFreshness = /(2026年8月|更新日|最終更新|確認日|データ終端)/.test(mainText);
  const [treatment, necessity] = roleAssessment(path, type, mainText);
  pages.push({ url, path, type, status: response.status, title, description, canonical, mainText, links, sources, hasCalculation, hasQuality, hasFreshness, treatment, necessity });
}

const tokens = (text) => new Set(text.match(/[一-龠ぁ-んァ-ヶA-Za-z0-9]{2,}/g)?.filter((token) => token.length < 24) || []);
const sets = pages.map((page) => tokens(page.mainText));
for (let i = 0; i < pages.length; i += 1) {
  let best = { score: 0, path: "" };
  for (let j = 0; j < pages.length; j += 1) {
    if (i === j) continue;
    const common = [...sets[i]].filter((token) => sets[j].has(token)).length;
    const score = common / Math.max(1, sets[i].size + sets[j].size - common);
    if (score > best.score) best = { score, path: pages[j].path };
  }
  pages[i].similarity = best;
}

const headers = ["URL", "種別", "HTTP", "検索意図", "本文文字数", "独自計算・分析", "一次情報リンク数", "品質表示", "鮮度表示", "内部リンク数", "canonical", "最大類似URL", "類似度", "処遇", "独立URLの理由", "読者価値上の確認事項"];
const rows = pages.map((page) => {
  const concern = page.status !== 200 ? `HTTP ${page.status}`
    : page.mainText.length < 500 && !["policy", "hub"].includes(page.type) ? "本文が短く、独立回答の意味確認が必要"
    : page.similarity.score >= 0.72 ? "類似度が高く、役割差を人が確認する必要"
    : page.sources.length === 0 && ["guide", "fund", "article"].includes(page.type) ? "公式一次情報への直接導線を確認"
    : "重大な機械的欠落なし。意味監査対象";
  return [page.url, page.type, page.status, intent(page.path, page.title, page.type), page.mainText.length, page.hasCalculation ? "あり" : "なし", page.sources.length, page.hasQuality ? "あり" : "なし", page.hasFreshness ? "あり" : "なし", page.links.filter((href) => href.startsWith("/") || href.startsWith(baseUrl)).length, page.canonical, page.similarity.path, page.similarity.score.toFixed(3), page.treatment, page.necessity, concern];
});
await writeFile(output, `\uFEFF${[headers, ...rows].map((row) => row.map(csv).join(",")).join("\n")}\n`, "utf8");

const summary = {
  urls: pages.length,
  statuses: Object.fromEntries([...new Set(pages.map((page) => page.status))].map((status) => [status, pages.filter((page) => page.status === status).length])),
  types: Object.fromEntries([...new Set(pages.map((page) => page.type))].map((type) => [type, pages.filter((page) => page.type === type).length])),
  treatments: Object.fromEntries([...new Set(pages.map((page) => page.treatment))].map((value) => [value, pages.filter((page) => page.treatment === value).length])),
  noOfficialSource: pages.filter((page) => page.sources.length === 0 && ["guide", "fund", "article"].includes(page.type)).map((page) => page.path),
  highSimilarity: pages.filter((page) => page.similarity.score >= 0.72).map((page) => ({ path: page.path, peer: page.similarity.path, score: page.similarity.score.toFixed(3) })),
  output,
};
console.log(JSON.stringify(summary, null, 2));
