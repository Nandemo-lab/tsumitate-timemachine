import { writeFile } from "node:fs/promises";

const base = (process.argv[2] ?? "https://tsumitate-timemachine.com").replace(/\/$/, "");
const output = process.argv[3] ?? "docs/audits/page-value-ledger-2026-11-09.csv";

const yearPages = ["orukan", "sp500", "nasdaq100", "vti"].flatMap((fund) =>
  [2020, 2021, 2022, 2023, 2024].map((year) => `/${fund}/${year}`),
);
const monthlyPages = ["orukan", "sp500", "nasdaq100"].flatMap((fund) =>
  [10000, 30000, 50000, 100000].map((amount) => `/${fund}/monthly/${amount}`),
);
const otherPublicTools = ["/simulate/orcan/2020", "/share", "/__adsense-audit-404"];

const decode = (value) => value
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/\s+/g, " ").trim();
const csv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

function pageType(path) {
  if (path === "/__adsense-audit-404") return "404";
  if (path === "/") return "simulation-home";
  if (/^\/compare\/.+/.test(path)) return "compare";
  if (/^\/articles\/.+/.test(path)) return "comparison-article";
  if (/^\/fund\/.+/.test(path)) return "fund-reference";
  if (/^\/(orukan|sp500|nasdaq100|vti|vt)$/.test(path)) return "fund-simulation-landing";
  if (/^\/from\/.+/.test(path)) return "start-year-comparison";
  if (/^\/ranking/.test(path)) return "ranking";
  if (/\/monthly\//.test(path)) return "monthly-example";
  if (/^\/(orukan|sp500|nasdaq100|vti)\/20\d\d$/.test(path)) return "year-result-tool";
  if (/^\/guide\/(tax|system|booraku)$/.test(path) || ["/guide", "/compare", "/fund", "/articles"].includes(path)) return "discovery-hub";
  if (/^\/guide\/.+/.test(path)) return "guide";
  if (path === "/about" || path === "/about/data-sources") return "trust";
  if (["/privacy", "/terms", "/disclaimer", "/ad-policy", "/contact"].includes(path)) return "policy";
  if (/^\/simulate\//.test(path) || path === "/share") return "interactive-tool";
  return "other";
}

function valueDefinition(path, type, title) {
  if (path === "/ranking") return ["同じ期間・月額で対象商品を横断比較", "A品質対象の期間末評価額を同条件で並べる母集団", "維持"];
  if (path === "/ranking/nisa") return ["NISA候補を制度条件と実績に分けて確認", "NISA対象枠・制度上限・同条件実績を同じ画面で確認", "改善済み・観測"];
  if (path === "/ranking/high-return") return ["集中商品の実績と下落経路を比較", "NASDAQ100・FANG+・S&P500の期間末値、元本割れ月数、最大月末評価損", "改善"];
  if (path === "/ranking/high-dividend") return ["VYM実績とSCHD属性を品質別に確認", "A品質VYMとG品質SCHDを混ぜず、分配・税務・費用を確認", "維持"];
  const values = {
    "simulation-home": ["自分の条件で過去積立を検証", "開始月・月額・商品を変える操作と検証済み結果", "維持"],
    compare: ["2商品を同条件で比較", "共通期間の評価額・差額・月次経路・元本割れ分析", "維持"],
    "comparison-article": ["商品構造と数値の読み方を理解", "比較ツールとは別に投資対象・費用・リスクを編集解説", "維持"],
    "fund-reference": ["正式商品情報を確認", "正式名称・設定日・費用・NISA区分・一次資料・品質境界", "維持"],
    "fund-simulation-landing": ["商品別に積立条件を変えて検証", "条件変更と過去積立結果。正式商品資料はFundへ分離", "改善済み・観測"],
    "start-year-comparison": ["開始年ごとの商品横断比較", "開始年固有の回数・元本・9系列順位・元本割れ経路", "維持"],
    "monthly-example": ["特定月額の過去実績を確認", "月額固定の元本・評価額・利益と条件変更導線", "維持またはnoindexツール"],
    "year-result-tool": ["商品と開始年を固定した結果確認", "固定条件の計算結果。検索コンテンツではなくnoindexツール", "noindex維持"],
    guide: [`${title.replace(/ \|.*$/, "")}の疑問を解決`, "記事固有の結論・注意点・一次資料または判断手順", "維持"],
    "discovery-hub": ["目的に合う詳細ページを探す", "検索・カテゴリ・テーマ別導線", "維持"],
    trust: ["運営・計算・検証方法を確認", "raw・SHA・品質区分・編集工程・訂正窓口", "維持"],
    policy: ["利用条件と運営責任を確認", "法務・プライバシー・広告・連絡方法", "維持"],
    "interactive-tool": ["入力条件を変更・共有", "操作結果を返すnoindexの機能画面", "noindex維持"],
    404: ["存在しないURLから利用者を戻す", "HTTP 404と主要ページへの復帰導線", "維持"],
    other: [title, "固有役割を手動確認", "確認"],
  };
  return values[type] ?? values.other;
}

function readerAndIntent(type) {
  const definitions = {
    "simulation-home": ["過去の実データで自分の積立条件を確かめたい初心者", "銘柄・開始月・月額を変えた過去積立結果を知る"],
    compare: ["2商品を同じ条件で比べたい人", "共通期間で評価額差と途中リスクを比較する"],
    "comparison-article": ["商品の仕組みと実績差の理由を理解したい人", "商品構造・費用・集中度・実績の違いを学ぶ"],
    "fund-reference": ["購入前に正式商品情報と一次資料を確認したい人", "費用・設定日・NISA区分・品質境界を確認する"],
    "fund-simulation-landing": ["特定商品を条件変更して試したい人", "商品設定後の積立結果と途中リスクを確かめる"],
    "start-year-comparison": ["開始時期による商品差を確認したい人", "同じ開始年・同じ月額で9系列を比べる"],
    "monthly-example": ["特定月額の元本と過去結果を確認したい人", "月額固定の積立結果を確認する"],
    "year-result-tool": ["特定商品・開始年の結果を直接確認する利用者", "固定条件の計算結果を確認する"],
    guide: ["制度や投資の疑問を一つずつ解決したい初心者", "記事固有の疑問、注意点、確認手順を理解する"],
    "discovery-hub": ["読む記事や比較ページを探している人", "カテゴリ・検索・目的から次のページを見つける"],
    ranking: ["同条件の過去結果を横断して読みたい人", "順位と途中リスク、対象外系列を確認する"],
    trust: ["データと運営の信頼性を検証したい人", "原典・SHA・計算方法・訂正窓口を確認する"],
    policy: ["利用条件・広告・個人情報の扱いを確認したい人", "運営責任と問い合わせ方法を確認する"],
    "interactive-tool": ["共有URLや計算結果を操作する利用者", "入力条件を変更または共有する"],
    404: ["存在しないURLへ到達した利用者", "エラーを説明しサイト内へ戻る"],
    other: ["サイト利用者", "ページ固有の情報を確認する"],
  };
  return definitions[type] ?? definitions.other;
}

function evidenceDefinition(path, type, page) {
  const evidence = [];
  if (page.hasCalculation) evidence.push("元本・評価額・途中リスク等の計算表示");
  if (page.sourceCount > 0) evidence.push(`外部一次資料リンク${page.sourceCount}件`);
  if (page.hasUpdate) evidence.push("データ終端または確認日表示");
  if (/noindex/i.test(page.robots)) evidence.push("検索用コンテンツではなくnoindex機能画面");
  const problems = [];
  if (page.similarity >= 0.75 && !/noindex/i.test(page.robots)) problems.push(`同種ページとの本文類似度${page.similarity.toFixed(3)}`);
  if (["monthly-example", "year-result-tool"].includes(type)) problems.push("条件差し替え型の派生画面");
  if (path === "/ranking/high-dividend") problems.push("URL名はランキングだがSCHDはG品質のため数値順位を出せない");
  let improvement = "既存の固有機能・説明を維持";
  if (type === "fund-simulation-landing") improvement = "商品固有の結果解釈・リスク・分析限界を初期表示";
  if (type === "fund-reference") improvement = "Landingとの結果重複を外し、正式商品情報と一次資料へ役割分離";
  if (["monthly-example", "year-result-tool"].includes(type)) improvement = "原則noindex・sitemap外として検索用の大量派生を抑制";
  return {
    evidence: evidence.join(" / ") || "本文・ナビゲーションを手動確認",
    problem: problems.join(" / ") || "重大な固有価値欠落は機械検出されず",
    improvement,
  };
}

const sitemapXml = await (await fetch(`${base}/sitemap.xml`)).text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapSet = new Set(sitemapUrls.map((url) => new URL(url).pathname));
const paths = [...new Set([
  ...sitemapUrls.map((url) => new URL(url).pathname),
  ...yearPages, ...monthlyPages, ...otherPublicTools,
])];

const pages = [];
for (const path of paths) {
  const response = await fetch(`${base}${path}`, { redirect: "manual" });
  const html = await response.text();
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const h1 = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const text = decode(html);
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] ?? "";
  const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/i)?.[1] ?? "index (既定)";
  const sourceCount = [...html.matchAll(/<a[^>]+href="https?:\/\/([^"/]+)/gi)]
    .map((match) => match[1]).filter((host) => host !== "tsumitate-timemachine.com").length;
  const type = pageType(path);
  const [need, uniqueValue, treatment] = valueDefinition(path, type, title);
  const [reader, intent] = readerAndIntent(type);
  pages.push({
    path, status: response.status, sitemap: sitemapSet.has(path), type, title, h1,
    need, uniqueValue, treatment, reader, intent, canonical, robots, sourceCount,
    hasCalculation: /(元本|期間末評価額|積立回数|元本割れ|最大月末評価損)/.test(text),
    hasUpdate: /(最終更新|確認日|2026年9月|データ終端)/.test(text),
    text,
  });
}

const tokens = (text) => new Set(text.match(/[一-龠ぁ-んァ-ヶA-Za-z0-9]{2,}/g)?.filter((token) => token.length < 30) ?? []);
const sets = pages.map((page) => tokens(page.text));
pages.forEach((page, index) => {
  let peer = "";
  let similarity = 0;
  pages.forEach((candidate, otherIndex) => {
    if (index === otherIndex || page.type !== candidate.type) return;
    const common = [...sets[index]].filter((token) => sets[otherIndex].has(token)).length;
    const score = common / Math.max(1, sets[index].size + sets[otherIndex].size - common);
    if (score > similarity) { similarity = score; peer = candidate.path; }
  });
  page.peer = peer;
  page.similarity = similarity;
  page.audit = evidenceDefinition(page.path, page.type, page);
});

const headers = ["URL", "sitemap", "HTTP", "index状態", "canonical", "種別", "ページ目的", "想定読者", "検索意図", "固有情報・機能・分析", "出典数", "データ更新表示", "重複相手URL", "類似度", "低価値リスク・改善前の問題", "実施した改善", "改善後の実物証拠", "読者が持ち帰れる理解", "GSC流入", "被リンク", "最終処遇"];
const rows = pages.map((page) => [
  `${base}${page.path}`, page.sitemap, page.status, page.robots, page.canonical, page.type,
  page.need, page.reader, page.intent, page.uniqueValue, page.sourceCount,
  page.hasUpdate ? "あり" : "なし", page.peer, page.similarity.toFixed(3), page.audit.problem,
  page.audit.improvement, page.audit.evidence, page.need,
  "NOT MEASURED（公式GSC未接続）", "NOT MEASURED", page.treatment,
]);
await writeFile(output, `\uFEFF${[headers, ...rows].map((row) => row.map(csv).join(",")).join("\n")}\n`, "utf8");

console.log(JSON.stringify({
  output, rows: pages.length, sitemapEntries: sitemapUrls.length,
  sitemapUnique: new Set(sitemapUrls).size,
  indexableOutsideSitemap: pages.filter((page) => !page.sitemap && !/noindex/i.test(page.robots)).map((page) => page.path),
  treatments: Object.fromEntries([...new Set(pages.map((page) => page.treatment))].map((value) => [value, pages.filter((page) => page.treatment === value).length])),
}, null, 2));
