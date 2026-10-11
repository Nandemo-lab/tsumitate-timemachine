import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const guides = read("lib/guide-pages.ts");
const years = read("lib/year-pages.ts");
const shareCard = read("components/simulation/ShareCard.tsx");
const sharePage = read("app/share/page.tsx");
const shareUrl = read("lib/utils/shareUrl.ts");
const compares = read("lib/compare-pages.ts");
const article = read("content/articles/orukan-vs-sp500.tsx");
const returnArticle = read("content/articles/sp500-vs-nasdaq100.tsx");
const schdVymArticle = read("content/articles/schd-vs-vym.tsx");
const schdSp500Article = read("content/articles/schd-vs-sp500.tsx");
const fundSeo = read("lib/fund-seo.ts");
const fundSeoPages = read("lib/fund-seo-pages.ts");
const home = read("components/views/HomeView.tsx");

assert(!guides.includes("評価額は約162万円"), "再現不能なNISA評価額が再混入");
assert(guides.includes("nisaMonthly10kExample.finalValue"), "NISA実績例がsimulate結果を参照していない");
assert(!years.includes("年間リターンは約−18%"), "S&P500の旧固定リターンが再混入");
assert(!years.includes("2023年に約+26%の反発"), "S&P500の旧固定リターンが再混入");
assert(years.includes("formatAnnualReturn(config.fundId, year)"), "年次リターンが動的SSOT参照ではない");
assert(!years.includes("yearFaqs"), "未使用の旧年次FAQ定義が残っている");
assert(shareCard.includes("buildShareUrl") && !shareCard.includes('const url = "https://tsumitate-timemachine.com"'), "ShareCardが条件付きURLを保持していない");
assert(shareUrl.includes("fundB?: FundId") && shareUrl.includes("endYear: number") && shareUrl.includes("endMonth: number"), "共有URLが比較商品または終了年月を保持していない");
assert(sharePage.includes("同じ条件で結果を再現") && sharePage.includes("G品質の参考系列を含むため、商品の優劣は表示しません"), "共有先の条件再現またはG品質境界が不足");
assert(!compares.includes("過去20年のデータではS&P500"), "商品設定前を含む比較主張が再混入");
assert(!article.includes("過去20年以上にわたり"), "記事に商品設定前を含む主張が再混入");
assert(home.includes("商品設定前の期間や欠損値は別系列で補いません"), "トップで独自の検証方針を説明していない");
assert(home.includes("実績期間：2026年8月まで"), "トップでデータ終端を開示していない");
for (const [source, text] of [
  ["年別ページ", years],
  ["比較ページ", compares],
  ["商品Landing", fundSeo],
  ["商品詳細", fundSeoPages],
]) {
  for (const phrase of ["今すぐ始めることが最善", "積み立てを続けること」が最善", "初心者にはおすすめしません"]) {
    assert(!text.includes(phrase), `${source}に未検証の投資行動・適性断定が再混入: ${phrase}`);
  }
}
assert(!guides.includes("損失になった事例はほぼゼロ"), "ガイドに条件不明の長期損失確率が再混入");
assert(!guides.includes("変えないことが成功の鍵"), "ガイドに未検証の成功断定が再混入");
assert(!returnArticle.includes("NASDAQ100の回復力が際立つ"), "暦年リターンを回復力として説明している");
assert(!schdVymArticle.includes('simulate({ fundId: "schd"'), "SCHDのG品質系列が記事の数値シミュレーションへ再混入");
assert(!schdSp500Article.includes('simulate({ fundId: "schd"'), "SCHDのG品質系列が記事の数値シミュレーションへ再混入");
assert(!compares.includes("★★★★★") && !compares.includes("★★★★") && !compares.includes("★★★"), "尺度のないリスク星が比較表へ再混入");
assert(!fundSeoPages.includes("過去40年以上の年平均リターンは約10%"), "商品ページに指数と商品の期間を混同する長期実績が再混入");
assert(!fundSeoPages.includes("10〜20年の長期保有を前提にすれば歴史的には回復"), "商品ページに根拠不明の回復主張が再混入");

if (fs.existsSync(path.join(root, ".next/server/app/guide/nisa-tsumitate-ikura.html"))) {
  const built = read(".next/server/app/guide/nisa-tsumitate-ikura.html");
  const ledger = JSON.parse(read("data/verified/orcan-monthly.json"));
  const returns = new Map(ledger.observations.map(({ month, monthlyReturn }) => [month, monthlyReturn]));
  let expectedValue = 0;
  for (const [month, monthlyReturn] of returns) {
    if (month < "2020-01") continue;
    expectedValue = (expectedValue + 10_000) * (1 + monthlyReturn);
  }
  const expectedDisplay = `${Math.round(expectedValue).toLocaleString("ja-JP")}円`;
  assert(!built.includes("約162万円"), "生成HTMLに旧評価額が残存");
  assert(built.includes(expectedDisplay), `生成HTMLにSSOT評価額（${expectedDisplay}）が見つからない`);
}

if (failures.length) {
  console.error(failures.map((message) => `ERROR: ${message}`).join("\n"));
  process.exit(1);
}
console.log("PASS: P0の数値整合、商品設定期間、データ終端と独自検証方針を確認");
