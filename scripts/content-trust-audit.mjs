import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const guides = read("lib/guide-pages.ts");
const years = read("lib/year-pages.ts");
const compares = read("lib/compare-pages.ts");
const article = read("content/articles/orukan-vs-sp500.tsx");
const home = read("components/views/HomeView.tsx");

assert(!guides.includes("評価額は約162万円"), "再現不能なNISA評価額が再混入");
assert(guides.includes("nisaMonthly10kExample.finalValue"), "NISA実績例がsimulate結果を参照していない");
assert(!years.includes("年間リターンは約−18%"), "S&P500の旧固定リターンが再混入");
assert(!years.includes("2023年に約+26%の反発"), "S&P500の旧固定リターンが再混入");
assert(years.includes('formatAnnualReturn("sp500", 2022)'), "2022年リターンがSSOTを参照していない");
assert(years.includes('formatAnnualReturn("sp500", 2023)'), "2023年リターンがSSOTを参照していない");
assert(!compares.includes("過去20年のデータではS&P500"), "商品設定前を含む比較主張が再混入");
assert(!article.includes("過去20年以上にわたり"), "記事に商品設定前を含む主張が再混入");
assert(home.includes("商品設定前の期間や欠損値は別系列で補いません"), "トップで独自の検証方針を説明していない");
assert(home.includes("実績期間：2025年6月まで"), "トップでデータ終端を開示していない");

if (fs.existsSync(path.join(root, ".next/server/app/guide/nisa-tsumitate-ikura.html"))) {
  const built = read(".next/server/app/guide/nisa-tsumitate-ikura.html");
  assert(!built.includes("約162万円"), "生成HTMLに旧評価額が残存");
  assert(built.includes("1,100,108円"), "生成HTMLにSSOT評価額が見つからない");
}

if (failures.length) {
  console.error(failures.map((message) => `ERROR: ${message}`).join("\n"));
  process.exit(1);
}
console.log("PASS: P0の数値整合、商品設定期間、データ終端と独自検証方針を確認");
