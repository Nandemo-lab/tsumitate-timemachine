import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
};

const simulation = read("lib/simulation.ts");
const returnSeries = read("lib/return-series.ts");
const simulatePage = read("app/simulate/[fund]/[year]/page.tsx");
const comparePage = read("app/compare/[slug]/page.tsx");
const selector = read("components/simulation/FundSelector.tsx");
const advanced = read("components/simulation/AdvancedSimulation.tsx");
const encyclopedia = read("components/simulation/FundEncyclopedia.tsx");
const sharePage = read("app/share/page.tsx");

assert(/if \(!isVerifiedReturnSeries\(fundId\)\) throw new UnverifiedReturnSeriesError/.test(simulation), "simulate() rejects every non-A return series");
assert(/unverifiedFund[\s\S]*throw new UnverifiedReturnSeriesError/.test(simulation), "advanced simulation rejects every non-A return series");
assert(/getMonthlyJpyReturn[\s\S]*if \(!isVerifiedReturnSeries\(fundId\)\) throw new UnverifiedReturnSeriesError/.test(returnSeries), "monthly return access rejects non-A series");
assert(/if \(!isVerifiedReturnSeries\(fund\)\)[\s\S]*未検証の積立結果は表示していません/.test(simulatePage), "direct simulator renders the G-quality boundary instead of results");
assert(!/G品質[\s\S]{0,300}simulate\(\{/.test(simulatePage), "direct G-quality branch contains no simulation call");
assert(/isVerifiedReturnSeries\(page\.fundAId\)[\s\S]*商品属性を見る/.test(comparePage), "comparison CTA sends non-A products to product attributes");
assert(/filter\(\(fund\) => isVerifiedReturnSeries\(fund\.id\)\)/.test(selector), "interactive fund selector exposes only verified series");
assert(/FUND_LIST\.filter\(\(f\) => isVerifiedReturnSeries\(f\.id\)\)/.test(advanced), "advanced simulator exposes only verified series");
assert(/G品質・数値シミュレーション対象外/.test(encyclopedia), "fund encyclopedia replaces G-quality results with a quality notice");
assert(
  /robots: \{ index: false, follow: true \}[\s\S]*alternates: \{ canonical: null \}/.test(sharePage),
  "rejected share conditions are noindex without a canonical",
);

const builtCandidates = [
  ".next/server/app/simulate/schd/2020.html",
  ".next/server/app/simulate/schd/2020/index.html",
];
const builtPath = builtCandidates.map((file) => path.join(root, file)).find(fs.existsSync);
if (builtPath) {
  const html = fs.readFileSync(builtPath, "utf8");
  assert(html.includes("未検証の積立結果は表示していません"), "built SCHD simulator shows the G-quality boundary");
  assert(!html.includes("29.3%") && !html.includes("256万円") && !html.includes("58万円の利益"), "built SCHD simulator contains no legacy unverified result");
}

for (const slug of ["schd-vs-vym", "schd-vs-sp500", "orukan-vs-schd"]) {
  const file = path.join(root, `.next/server/app/compare/${slug}.html`);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  assert(!html.includes('href="/simulate/schd/2020"'), `${slug} has no internal link to an unverified SCHD simulation`);
  assert(html.includes("SCHDの商品属性を見る"), `${slug} replaces the SCHD simulation CTA with product attributes`);
}

console.log("PASS: G-quality simulation boundary audit");
