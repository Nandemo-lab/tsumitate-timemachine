import fs from "node:fs";
import path from "node:path";
import Module, { createRequire } from "node:module";
import ts from "typescript";
import { execFileSync } from "node:child_process";

// 本番で使用するTS関数をメモリ上で読み込み、raw台帳からの独立計算と照合。
const root = process.cwd();
const require = createRequire(import.meta.url);
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return originalResolve.call(this, request.startsWith("@/") ? path.join(root, request.slice(2)) : request, ...args);
};
Module._extensions[".ts"] = (module, filename) => {
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  });
  module._compile(output.outputText, filename);
};
const { getVerifiedComparisonCagr } = require(path.join(root, "lib/compare-return-metrics.ts"));
const { COMPARE_PAGES } = require(path.join(root, "lib/compare-pages.ts"));
const baselineModule = new Module(path.join(root, "lib/compare-pages-baseline.ts"));
baselineModule.filename = path.join(root, "lib/compare-pages-baseline.ts");
baselineModule.paths = Module._nodeModulePaths(path.join(root, "lib"));
baselineModule._compile(ts.transpileModule(execFileSync("git", ["show", "afc2f0fbbf816a0ef823b1816b9b849c20015ec2:lib/compare-pages.ts"], { encoding: "utf8" }), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, baselineModule.filename);
for (const previous of baselineModule.exports.COMPARE_PAGES) {
  const current = COMPARE_PAGES.find((page) => page.slug === previous.slug);
  for (const key of ["slug", "h1", "fundAId", "fundBId", "simYear", "simMonth", "simAmount"]) {
    if (JSON.stringify(current[key]) !== JSON.stringify(previous[key])) throw new Error(`unexpected regression ${previous.slug} ${key}`);
  }
  const authorizedFaqs = {
    "sp500-vs-nasdaq100": ["リスクが高いのはS&P500とNASDAQ100のどちらですか？"],
    "nasdaq100-vs-fangplus": [
      "リターンが高いのはNASDAQ100とFANG+のどちらですか？",
      "リスクが高いのはNASDAQ100とFANG+のどちらですか？",
      "暴落時に強いのはNASDAQ100とFANG+のどちらですか？",
    ],
    "vti-vs-nasdaq100": ["暴落時に強いのはどちらですか？"],
    "schd-vs-sp500": ["暴落時に強いのはSCHDとS&P500どちらですか？"],
    "vt-vs-sp500": ["暴落時に強いのはどちらですか？"],
    "orukan-vs-fangplus": ["FANG+の大きな下落から回復するまでどのくらいかかりますか？"],
  };
  if (current.faqs.length !== previous.faqs.length) throw new Error(`FAQ count regression ${previous.slug}`);
  for (let index = 0; index < previous.faqs.length; index++) {
    const oldFaq = previous.faqs[index];
    const newFaq = current.faqs[index];
    if (newFaq.q !== oldFaq.q) throw new Error(`FAQ question regression ${previous.slug}`);
    if (!(authorizedFaqs[previous.slug] ?? []).includes(oldFaq.q) && newFaq.a !== oldFaq.a) throw new Error(`unexpected FAQ regression ${previous.slug}`);
  }
  if (previous.slug !== "vt-vs-sp500" && (current.metaTitle !== previous.metaTitle || current.metaDescription !== previous.metaDescription)) throw new Error(`metadata regression ${previous.slug}`);
}
console.log("PASS: all 15 compare H1/slug/simulation unchanged; only authorized fact-correction FAQs changed; metadata unchanged except authorized VT/S&P500 correction");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const vtSource = read("lib/verified-monthly-return-series.ts");
const array = (name) => vtSource.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\] as const;`))[1]
  .replace(/\/\/.*$/gm, "").split(",").map((value) => value.trim()).filter(Boolean).map(Number);
const usd = array("VT_MONTHLY_USD_NAV_TOTAL_RETURNS");
const fx = array("BOJ_MONTH_END_YEN_PER_USD");
const vt = usd.map((value, index) => ({
  month: `${2015 + Math.floor(index / 12)}-${String(index % 12 + 1).padStart(2, "0")}`,
  monthlyReturn: (1 + value) * fx[index + 1] / fx[index] - 1,
}));
const fileKey = { india: "inda", emerging: "eem" };
const points = (fundId) => fundId === "vt" ? vt : JSON.parse(read(`data/verified/${fileKey[fundId] ?? fundId}-monthly.json`)).observations;
const slugs = ["orukan-vs-sp500", "sp500-vs-nasdaq100", "vti-vs-orukan", "nasdaq100-vs-fangplus", "orukan-vs-fangplus", "vt-vs-sp500", "vti-vs-nasdaq100", "orukan-vs-vym", "india-vs-emerging"];
const rows = [];
for (const slug of slugs) {
  const page = COMPARE_PAGES.find((entry) => entry.slug === slug);
  const result = getVerifiedComparisonCagr(page.fundAId, page.fundBId);
  const independent = (fundId) => {
    const observations = points(fundId).filter((point) => point.month >= result.startMonth && point.month <= result.endMonth);
    if (observations.length !== result.count || new Set(observations.map((point) => point.month)).size !== result.count) throw new Error(`missing/duplicate ${slug}`);
    return Math.expm1(observations.reduce((sum, point) => sum + Math.log1p(point.monthlyReturn), 0) * 12 / observations.length);
  };
  const spec = page.specs.find((entry) => entry.label.includes("CAGR"));
  const a = independent(page.fundAId);
  const b = independent(page.fundBId);
  const display = (value) => `${value >= 0 ? "+" : ""}${(value * 100).toFixed(2)}%`;
  if (Math.abs(result.a - a) > 1e-12 || Math.abs(result.b - b) > 1e-12 || spec.a !== display(a) || spec.b !== display(b)) throw new Error(`CAGR mismatch ${slug}`);
  rows.push({ slug, start: result.startMonth, end: result.endMonth, months: result.count, a: spec.a, b: spec.b, displayDifference: 0 });
}
for (const [a, b] of [["schd", "vt"], ["vt", "schd"]]) {
  let rejected = false;
  try { getVerifiedComparisonCagr(a, b); } catch { rejected = true; }
  if (!rejected) throw new Error("G series must be rejected");
}
if (read("lib/compare-pages.ts").includes("2015〜2025年平均")) throw new Error("obsolete comparison averages remain");
console.table(rows);
console.log("PASS: 9 verified common-period CAGRs; independent log-compounding matches; G rejected; no legacy averages");

const { FUNDS, formatAnnualReturn } = require(path.join(root, "lib/funds.ts"));
const { getGuidePage } = require(path.join(root, "lib/guide-pages.ts"));
const guide = getGuidePage("tsumitate-nansnen-keizoku");
const guideText = JSON.stringify(guide);
if (/約2倍|20代スタートで40年|長い期間ほど複利効果が大きい/.test(guideText)) throw new Error("unsupported age-based projection remains");
if (/最低10年|5年・10年・20年・30年の積立シミュレーション/.test(guide.metaDescription) || !guide.metaDescription.includes("商品設定後の公式実績例")) throw new Error("guide metadata/content mismatch");
if (/10年・20年・30年|5年・10年・20年/.test(`${guide.metaTitle} ${guide.h1}`) || !guide.metaTitle.includes("元本割れリスク") || !guide.h1.includes("公式実績")) throw new Error("guide title/H1 mismatch");
const ageFaq = guide.faqs.find((faq) => faq.q === "何歳から始めると何年間積み立てられますか？");
if (!ageFaq.a.includes("20歳開始なら40年") || !ageFaq.a.includes("拠出元本") || !ageFaq.a.includes("必ず利益が増えるわけではありません")) throw new Error("age and contribution explanation mismatch");
if (/2015|オルカン.*10〜15年以上の積立期間があれば損失/.test(guideText)) throw new Error("pre-inception guide claims remain");
const independentValue = points("orcan").filter((point) => point.month >= "2020-01" && point.month <= "2025-06")
  .reduce((value, point) => (value + 30000) * (1 + point.monthlyReturn), 0);
const example = guide.sections.flatMap((section) => section.subsections ?? []).find((section) => section.h3.includes("2020年1月"));
if (!example.body.includes(`${Math.round(independentValue).toLocaleString()}円`) || !example.body.includes("1,980,000円") || !example.body.includes("66か月")) throw new Error("guide simulation example mismatch");
for (const [fundId, year] of [["vt", 2022], ["sp500", 2022], ["orcan", 2022], ["fangplus", 2022], ["fangplus", 2023]]) {
  const yearly = points(fundId).filter((point) => point.month.startsWith(`${year}-`));
  const annual = Math.expm1(yearly.reduce((sum, point) => sum + Math.log1p(point.monthlyReturn), 0));
  if (yearly.length !== 12 || Math.abs(annual - FUNDS[fundId].annualReturns[year]) > 1e-12) throw new Error(`annual mismatch ${fundId} ${year}`);
  console.log(`OK SSOT annual ${fundId} ${year}: ${formatAnnualReturn(fundId, year)}`);
}
const vtFaq = COMPARE_PAGES.find((page) => page.slug === "vt-vs-sp500").faqs.find((faq) => faq.q === "暴落時に強いのはどちらですか？");
for (const id of ["vt", "sp500"]) if (!vtFaq.a.includes(formatAnnualReturn(id, 2022))) throw new Error("VT comparison FAQ mismatch");
const fangPage = COMPARE_PAGES.find((page) => page.slug === "orukan-vs-fangplus");
const annualSpec = fangPage.specs.find((spec) => spec.label === "2022年の暦年リターン");
if (annualSpec.a !== formatAnnualReturn("orcan", 2022) || annualSpec.b !== formatAnnualReturn("fangplus", 2022)) throw new Error("FANG annual spec mismatch");
if (!fangPage.faqs.at(-1).a.includes(formatAnnualReturn("fangplus", 2023))) throw new Error("FANG recovery FAQ mismatch");
for (const [slug, fundA, fundB] of [
  ["sp500-vs-nasdaq100", "sp500", "nasdaq100"],
  ["orukan-vs-nasdaq100", "orcan", "nasdaq100"],
  ["nasdaq100-vs-fangplus", "nasdaq100", "fangplus"],
  ["vti-vs-nasdaq100", "vti", "nasdaq100"],
]) {
  const page = COMPARE_PAGES.find((entry) => entry.slug === slug);
  const spec = page.specs.find((entry) => entry.label === "2022年の暦年リターン");
  if (!spec || spec.a !== formatAnnualReturn(fundA, 2022) || spec.b !== formatAnnualReturn(fundB, 2022)) throw new Error(`calendar return spec mismatch ${slug}`);
  if (!spec.note?.includes("最大下落率ではありません")) throw new Error(`calendar/max-drawdown distinction missing ${slug}`);
}
if (/label:\s*"最大下落[^\n]*formatAnnualReturn/.test(read("lib/compare-pages.ts"))) throw new Error("calendar return mislabeled as max drawdown");
const articleSource = read("content/articles/sp500-vs-nasdaq100.tsx");
if (!articleSource.includes('formatAnnualReturn("sp500", 2022)') || !articleSource.includes('formatAnnualReturn("nasdaq100", 2022)')) throw new Error("article annual return SSOT reference missing");
if (/最大下落幅（2022年）|約-18%|約-33%/.test(articleSource)) throw new Error("article hard-coded annual return or drawdown label remains");
const beginnerGuide = getGuidePage("nisa-beginner");
if (!beginnerGuide.sections?.some((section) => section.body.includes(formatAnnualReturn("nasdaq100", 2022)) && section.body.includes("最大下落率ではありません"))) throw new Error("beginner guide annual return explanation mismatch");
const schdPage = COMPARE_PAGES.find((page) => page.slug === "schd-vs-sp500");
const schdDrawdownFaq = schdPage.faqs.find((faq) => faq.q === "暴落時に強いのはSCHDとS&P500どちらですか？");
if (!schdDrawdownFaq.a.includes(formatAnnualReturn("sp500", 2022)) || !schdDrawdownFaq.a.includes("G品質") || /約−18%|約-18%/.test(schdDrawdownFaq.a)) throw new Error("SCHD/S&P500 quality-aware return explanation mismatch");
console.log(`PASS: fact corrections and return-type labels; independent guide value = ${Math.round(independentValue).toLocaleString()}円; annual figures match monthly ledgers`);

if (process.argv.includes("--server")) {
  const server = process.argv[process.argv.indexOf("--server") + 1];
  const sitemapResponse = await fetch(`${server}/sitemap.xml`, { redirect: "manual" });
  if (sitemapResponse.status !== 200) throw new Error("sitemap HTTP error");
  const sitemap = await sitemapResponse.text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (urls.length !== 99) throw new Error(`sitemap count ${urls.length}`);
  const htmlByPath = new Map();
  for (let index = 0; index < urls.length; index += 8) {
    await Promise.all(urls.slice(index, index + 8).map(async (url) => {
      const pathname = new URL(url).pathname;
      const response = await fetch(`${server}${pathname}`, { redirect: "manual" });
      if (response.status !== 200) throw new Error(`${pathname} status ${response.status}`);
      const html = await response.text();
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
      const robots = html.match(/<meta name="robots" content="([^"]+)"/);
      if (!canonical || canonical[1] !== url || !robots || /noindex/.test(robots[1])) throw new Error(`${pathname} SEO error`);
      for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
      htmlByPath.set(pathname, html);
    }));
  }
  const links = [
    ["/fund/orukan", "/compare/orukan-vs-schd", "オルカンと米国ETF SCHDの比較"],
    ["/fund/vti", "/compare/vti-vs-nasdaq100", "VTIとNASDAQ100の比較"],
    ["/fund/vym", "/compare/orukan-vs-vym", "VYMとオルカンの違い"],
    ["/guide/shinnisa-schd-kaeru", "/compare/orukan-vs-schd", "オルカンと米国ETF SCHDの比較"],
    ["/guide/orukan-ippon-de-ii", "/compare/vt-vs-orukan", "VTとオルカンの違い"],
  ];
  for (const [from, to, anchor] of links) {
    const html = htmlByPath.get(from);
    const anchors = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
      .filter((match) => match[1] === to && match[2].replace(/<[^>]+>/g, "") === anchor);
    if (anchors.length !== 1) throw new Error(`${from} contextual link count ${anchors.length}`);
    console.log(`OK contextual link ${from} -> ${to}: ${anchor}`);
  }
  for (const fundId of ["orcan", "sp500", "nasdaq100", "fangplus"]) {
    const response = await fetch(`${server}/simulate/${fundId}/2015`, { redirect: "manual" });
    const html = await response.text();
    if (response.status !== 200 || !/<meta name="robots" content="noindex, follow"/.test(html) || /rel="canonical"/.test(html)) throw new Error(`${fundId} simulate regression`);
  }
  console.log("PASS: sitemap 99/99 direct 200; redirect/404/5xx/noindex/canonical errors 0; JSON-LD parse PASS; contextual links 5/5 once each; simulate noindex preserved");
}
