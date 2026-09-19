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
const { FUND_PAGES } = require(path.join(root, "lib/fund-seo-pages.ts"));
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
    "schd-vs-vym": [
      "配当金が多いのはSCHDとVYMのどちらですか？",
      "増配率が高いのはSCHDとVYMのどちらですか？",
      "長期保有に向いているのはSCHDとVYMのどちらですか？",
    ],
    "schd-vs-sp500": [
      "SCHDとS&P500はトータルリターンでどちらが高いですか？",
      "配当投資とインデックス投資はどちらが得ですか？",
      "老後の資金づくりにはSCHDとS&P500どちらが向いていますか？",
      "暴落時に強いのはSCHDとS&P500どちらですか？",
      "SCHDとS&P500を両方持つのはありですか？",
    ],
    "orukan-vs-schd": [
      "暴落時に強いのはどちらですか？",
      "オルカンとSCHDを両方持つのはありですか？",
      "配当を再投資すればオルカンと同じ効果になりますか？",
    ],
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
  const authorizedMetadata = new Set(["vt-vs-sp500", "schd-vs-vym", "schd-vs-sp500", "orukan-vs-schd"]);
  if (!authorizedMetadata.has(previous.slug) && (current.metaTitle !== previous.metaTitle || current.metaDescription !== previous.metaDescription)) throw new Error(`metadata regression ${previous.slug}`);
}
console.log("PASS: all 15 compare H1/slug/simulation unchanged; only authorized fact-correction FAQs changed; metadata changes limited to authorized fact corrections");
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
if (/最大下落幅（2022年）|約-18%|約-33%|\+53\.8%/.test(articleSource)) throw new Error("article hard-coded annual return or drawdown label remains");
const beginnerGuide = getGuidePage("nisa-beginner");
if (!beginnerGuide.sections?.some((section) => section.body.includes(formatAnnualReturn("nasdaq100", 2022)) && section.body.includes("最大下落率ではありません"))) throw new Error("beginner guide annual return explanation mismatch");
const schdPage = COMPARE_PAGES.find((page) => page.slug === "schd-vs-sp500");
const schdDrawdownFaq = schdPage.faqs.find((faq) => faq.q === "暴落時に強いのはSCHDとS&P500どちらですか？");
if (!schdDrawdownFaq.a.includes(formatAnnualReturn("sp500", 2022)) || !schdDrawdownFaq.a.includes("G品質") || /約−18%|約-18%/.test(schdDrawdownFaq.a)) throw new Error("SCHD/S&P500 quality-aware return explanation mismatch");
const orcanNasdaqArticle = read("content/articles/orukan-vs-nasdaq100.tsx");
for (const reference of [
  'formatAnnualReturn("orcan", 2020)',
  'formatAnnualReturn("orcan", 2022)',
  'formatAnnualReturn("orcan", 2023)',
  'formatAnnualReturn("nasdaq100", 2020)',
  'formatAnnualReturn("nasdaq100", 2022)',
  'formatAnnualReturn("nasdaq100", 2023)',
  'formatExpenseRatio("orcan")',
  'formatExpenseRatio("nasdaq100")',
  "FUNDS.orcan.shareCount",
  "FUNDS.nasdaq100.shareCount",
]) {
  if (!orcanNasdaqArticle.includes(reference)) throw new Error(`orukan/NASDAQ100 article SSOT reference missing: ${reference}`);
}
if (/\+48\.8%|\+53\.8%|-33\.0%|2022年-33%|-18〜20%/.test(orcanNasdaqArticle)) throw new Error("orukan/NASDAQ100 article hard-coded return remains");
if (!orcanNasdaqArticle.includes("最大下落率ではありません") || !orcanNasdaqArticle.includes("回復期間を示すものではありません")) throw new Error("orukan/NASDAQ100 return-type distinction missing");
const schdSpArticle = read("content/articles/schd-vs-sp500.tsx");
for (const reference of ['formatAnnualReturn("sp500", 2022)', 'formatExpenseRatio("schd")', 'formatExpenseRatio("sp500")', "FUNDS.schd.shareCount", "FUNDS.sp500.shareCount"]) {
  if (!schdSpArticle.includes(reference)) throw new Error(`SCHD/S&P500 article SSOT reference missing: ${reference}`);
}
if (/約−3\.4%|約−18\.4%|S&P500の回復が速い/.test(schdSpArticle)) throw new Error("SCHD/S&P500 unverified direct comparison remains");
if (!schdSpArticle.includes("G品質（参考データ・原典未検証）") || !schdSpArticle.includes("回復速度の優劣を実績として断定しません")) throw new Error("SCHD/S&P500 quality distinction missing");

const orcanSpArticle = read("content/articles/orukan-vs-sp500.tsx");
for (const reference of ['formatAnnualReturn("orcan", 2022)', 'formatAnnualReturn("sp500", 2022)']) {
  if (!orcanSpArticle.includes(reference)) throw new Error(`orcan/S&P500 annual return SSOT reference missing: ${reference}`);
}
if (/約-30%|回復速度も同水準|S&P500は約-19%|-18〜20%|下落幅はほぼ同水準/.test(orcanSpArticle)) {
  throw new Error("orcan/S&P500 unverified drawdown or recovery claim remains");
}
if (!orcanSpArticle.includes("最大下落率や回復期間ではありません") || !orcanSpArticle.includes("最大下落率・回復期間は未算出")) {
  throw new Error("orcan/S&P500 metric distinction missing");
}

const schdVymPage = COMPARE_PAGES.find((page) => page.slug === "schd-vs-vym");
const schdSpPage = COMPARE_PAGES.find((page) => page.slug === "schd-vs-sp500");
const orcanSchdPage = COMPARE_PAGES.find((page) => page.slug === "orukan-vs-schd");
const schdFundPage = FUND_PAGES.find((page) => page.fundId === "schd");
const schdPublicText = [
  JSON.stringify(schdVymPage),
  JSON.stringify(schdSpPage),
  JSON.stringify(schdFundPage),
  read("content/articles/schd-vs-vym.tsx"),
  schdSpArticle,
  JSON.stringify(orcanSchdPage),
].join("\n");
if (/11〜12%|6〜7%|3\.5〜4\.0%|2\.8〜3\.2%|1\.2〜1\.5%|S&P500が上回る期間が多い|資産最大化ではS&P500|SCHDが有利|SCHDには劣ります|SCHDがVYMをやや上回っている期間が多い|S&P500やNASDAQ100と比べて値動きは穏やか|値上がり益で資産を最大化するS&P500|S&P500と比べると株価の伸びは穏やか|S&P500で資産成長を狙いながら/.test(schdPublicText)) {
  throw new Error("unverified SCHD yield, dividend-growth, or superiority claim remains in scoped pages");
}
for (const required of [
  "G：参考データ・原典未検証",
  "同一条件の一次資料による増配率を確認していない",
  "トータルリターンの優劣を同じ確度で判定していません",
]) {
  if (!schdPublicText.includes(required)) throw new Error(`SCHD evidence boundary missing: ${required}`);
}
const orcanSchdText = JSON.stringify(orcanSchdPage);
if (/下げ幅が小さい傾向|値上がり局面ではオルカンに劣る|低〜中（★★）|人気の組み合わせ/.test(orcanSchdText)) {
  throw new Error("orukan/SCHD unverified downside or superiority claim remains");
}
for (const required of [
  "最大下落率・回復速度・下落耐性の優劣を同じ確度で判定していません",
  "商品設計であることだけから、将来の下落幅が小さいとは断定できません",
  "G：参考データ・原典未検証",
]) {
  if (!orcanSchdText.includes(required)) throw new Error(`orukan/SCHD evidence boundary missing: ${required}`);
}
if (orcanSchdPage.specs.some((spec) => spec.label === "2022年のリターン" || spec.label === "リスク")) {
  throw new Error("orukan/SCHD unverified return or risk grade remains in comparison specs");
}
for (const page of [schdVymPage, schdSpPage]) {
  if (page.specs.some((spec) => spec.label === "リスク" || spec.label === "リターン特性")) {
    throw new Error(`${page.slug} has an unverified risk or return grade`);
  }
}

for (const [fundId, question, years] of [
  ["sp500", "S&P500で大きく下落した年はありますか？", [2022, 2023]],
  ["nasdaq100", "NASDAQ100のリスクはどのくらいですか？", [2022]],
  ["fangplus", "FANG+のリスクはどのくらいですか？", [2022]],
]) {
  const page = FUND_PAGES.find((entry) => entry.fundId === fundId);
  const faq = page?.faqs.find((entry) => entry.q === question);
  if (!faq) throw new Error(`fund return FAQ missing ${fundId}`);
  for (const year of years) {
    if (!faq.a.includes(formatAnnualReturn(fundId, year))) throw new Error(`fund return FAQ SSOT mismatch ${fundId} ${year}`);
  }
  if (!faq.a.includes("円ベース・分配金再投資込みの暦年リターン") || !faq.a.includes("最大下落率")) {
    throw new Error(`fund return type distinction missing ${fundId}`);
  }
}

const fromSource = read("app/from/[year]/page.tsx");
for (const reference of [
  'formatAnnualReturn("sp500", 2019)',
  'formatAnnualReturn("sp500", 2022)',
  'formatAnnualReturn("nasdaq100", 2022)',
  'formatAnnualReturn("fangplus", 2022)',
  'formatAnnualReturn("nasdaq100", 2023)',
  'formatAnnualReturn("fangplus", 2023)',
  'formatAnnualReturn("orcan", 2024)',
]) {
  if (!fromSource.includes(reference)) throw new Error(`from page SSOT reference missing: ${reference}`);
}
for (const obsolete of ["S&P500が年間+31%", "S&P500約−18%", "NASDAQ100約−37%", "FANG+約−44%", "NASDAQ100が年間+53%", "年間50〜70%", "最高の買い場", "最大の勝ち組", "最善策", "安定して高いリターン", "複利効果が重要", "その恩恵を受けています", "長期では高いリターンを記録する傾向"]) {
  if (fromSource.includes(obsolete)) throw new Error(`obsolete from page claim remains: ${obsolete}`);
}

const orcanGuide = getGuidePage("orukan-yameta-houga-ii");
const orcanGuideText = JSON.stringify(orcanGuide);
if (!orcanGuideText.includes(formatAnnualReturn("orcan", 2022)) || !orcanGuideText.includes("公式な円建て・分配金再投資基準価額")) {
  throw new Error("orcan guide verified JPY data explanation missing");
}
if (orcanGuideText.includes("本サイトの過去比較値はドルベースの参考系列")) throw new Error("obsolete orcan data explanation remains");
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
  for (const [fundId, years] of [["sp500", [2022, 2023]], ["nasdaq100", [2022]], ["fangplus", [2022]]]) {
    const html = htmlByPath.get(`/fund/${fundId}`);
    for (const year of years) {
      if (!html?.includes(formatAnnualReturn(fundId, year))) throw new Error(`/fund/${fundId} rendered return mismatch ${year}`);
    }
  }
  for (const year of [2019, 2020, 2021, 2022, 2023, 2024]) {
    const html = htmlByPath.get(`/from/${year}`);
    if (!html?.includes("円ベース・分配金再投資込みの暦年リターン")) throw new Error(`/from/${year} return definition missing`);
  }
  const orcanGuideHtml = htmlByPath.get("/guide/orukan-yameta-houga-ii");
  if (!orcanGuideHtml?.includes(formatAnnualReturn("orcan", 2022)) || !orcanGuideHtml.includes("公式な円建て・分配金再投資基準価額")) throw new Error("orcan guide rendered data explanation mismatch");
  console.log("PASS: sitemap 99/99 direct 200; redirect/404/5xx/noindex/canonical errors 0; JSON-LD parse PASS; contextual links 5/5 once each; simulate noindex preserved");
}


// SCHDの共有説明値だけでなく、実際の生成ページに評価・推奨欄がないことを検査。
for (const [field, value] of Object.entries({
  riskLevel: FUNDS.schd.riskLevel,
  beginnerScore: FUNDS.schd.encyclopedia.beginnerScore,
  volatility: FUNDS.schd.encyclopedia.volatility,
  expectedHorizon: FUNDS.schd.encyclopedia.expectedHorizon,
  forWhom: FUNDS.schd.encyclopedia.forWhom,
})) {
  if (value !== null) throw new Error(`SCHD unverified assessment restored: ${field}`);
}
const schdHtml = read(".next/server/app/fund/schd.html");
const schdBody = schdHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, "");
for (const label of ["ボラティリティ", "リスクレベル", "推奨投資期間", "こんな人におすすめ", "VYMより質の高い", "高品質銘柄", "財務優良銘柄", "成長株より値上がり益が小さい"]) {
  if (schdBody.includes(label)) throw new Error(`SCHD rendered unsupported assessment: ${label}`);
}
for (const required of [FUNDS.schd.encyclopedia.catchCopy, "G品質", "原典未検証", "リスク等級や下落耐性は判定していない"]) {
  if (!schdBody.includes(required)) throw new Error(`SCHD rendered boundary missing: ${required}`);
}
const otherFundHtml = read(".next/server/app/fund/sp500.html");
for (const label of ["ボラティリティ", "リスクレベル", "推奨投資期間", "こんな人におすすめ"]) {
  if (!otherFundHtml.includes(label)) throw new Error(`Other fund section unexpectedly removed: ${label}`);
}
console.log("PASS: rendered SCHD assessment boundaries and other fund sections");
