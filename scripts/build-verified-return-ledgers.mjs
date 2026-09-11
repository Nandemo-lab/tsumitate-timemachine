import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data", "verified");
const RAW_DIR = path.join(DATA_DIR, "raw");
const RETRIEVED_AT = "2026-09-12";
const fetchMode = process.argv.includes("--fetch");

const SOURCES = {
  vti: { raw: "vti-nav.json", url: "https://advisors.vanguard.com/investments/products/api/funds/0970/performance/nav" },
  vym: { raw: "vym-nav.json", url: "https://advisors.vanguard.com/investments/products/api/funds/0923/performance/nav" },
  eem: { raw: "eem-performance.json", url: "https://www.ishares.com/us/products/239637/ishares-msci-emerging-markets-etf" },
  inda: { raw: "inda-performance.json", url: "https://www.ishares.com/us/products/239659/ishares-msci-india-etf" },
  orcan: { raw: "orukan-setteirai.csv", url: "https://www.am.mufg.jp/fund_file/setteirai/253425.csv" },
  sp500: { raw: "sp500-setteirai.csv", url: "https://www.am.mufg.jp/fund_file/setteirai/253266.csv" },
  nasdaq100: { raw: "nasdaq100-history.csv", url: "https://www.daiwa-am.co.jp/funds/detail/csv_out.php?code=3373&type=1" },
  fangplus: { raw: "fangplus-history.csv", url: "https://www.daiwa-am.co.jp/funds/detail/csv_out.php?code=3346&type=1" },
  fx: { raw: "boj-usdjpy-month-end.json", url: "https://www.stat-search.boj.or.jp/ssi/mtshtml/fm08_m_1_en.html" },
};

const META = {
  vti: { fundId: "vti", formalProductName: "Vanguard Morningstar Total Stock Market ETF", identifier: "VTI / fund 0970", manager: "The Vanguard Group", inceptionDate: "2001-05-24", sourceName: "Vanguard Advisors", sourceUrl: "https://advisors.vanguard.com/investments/products/vti/vanguard-morningstar-total-stock-market-etf", sourceSeriesDefinition: "Monthly NAV Total Return (1MTH)", currency: "USD", returnType: "total-return", priceBasis: "NAV", dividendTreatment: "included", feeTreatment: "net of fund expenses", fxTreatment: "converted with BOJ month-end USD/JPY", firstMonth: "2015-01", lastMonth: "2025-06" },
  vym: { fundId: "vym", formalProductName: "Vanguard High Dividend Yield ETF", identifier: "VYM / fund 0923", manager: "The Vanguard Group", inceptionDate: "2006-11-10", sourceName: "Vanguard Advisors", sourceUrl: "https://advisors.vanguard.com/investments/products/vym/vanguard-high-dividend-yield-etf", sourceSeriesDefinition: "Monthly NAV Total Return (1MTH)", currency: "USD", returnType: "total-return", priceBasis: "NAV", dividendTreatment: "included", feeTreatment: "net of fund expenses", fxTreatment: "converted with BOJ month-end USD/JPY", firstMonth: "2015-01", lastMonth: "2025-06" },
  eem: { fundId: "emerging", formalProductName: "iShares MSCI Emerging Markets ETF", identifier: "EEM / 239637", manager: "BlackRock Fund Advisors", inceptionDate: "2003-04-07", sourceName: "iShares", sourceUrl: SOURCES.eem.url, sourceSeriesDefinition: "Growth of Hypothetical $10,000, NAV total return", currency: "USD", returnType: "total-return", priceBasis: "NAV", dividendTreatment: "dividends and capital gains reinvested", feeTreatment: "fund expenses deducted", fxTreatment: "converted with BOJ month-end USD/JPY", firstMonth: "2015-01", lastMonth: "2025-06" },
  inda: { fundId: "india", formalProductName: "iShares MSCI India ETF", identifier: "INDA / 239659", manager: "BlackRock Fund Advisors", inceptionDate: "2012-02-02", sourceName: "iShares", sourceUrl: SOURCES.inda.url, sourceSeriesDefinition: "Growth of Hypothetical $10,000, NAV total return", currency: "USD", returnType: "total-return", priceBasis: "NAV", dividendTreatment: "dividends and capital gains reinvested", feeTreatment: "fund expenses deducted", fxTreatment: "converted with BOJ month-end USD/JPY", firstMonth: "2015-01", lastMonth: "2025-06" },
  orcan: { fundId: "orcan", formalProductName: "eMAXIS Slim 全世界株式（オール・カントリー）", identifier: "253425 / 0331418A", manager: "三菱UFJアセットマネジメント", inceptionDate: "2018-10-31", sourceName: "三菱UFJアセットマネジメント", sourceUrl: "https://emaxis.am.mufg.jp/fund/253425.html", sourceSeriesDefinition: "分配金再投資基準価額の月末値", currency: "JPY", returnType: "total-return", priceBasis: "分配金再投資基準価額", dividendTreatment: "reinvested", feeTreatment: "reflected in NAV", fxTreatment: "none", firstMonth: "2018-11", lastMonth: "2025-06" },
  sp500: { fundId: "sp500", formalProductName: "eMAXIS Slim 米国株式（S&P500）", identifier: "253266 / 03311187", manager: "三菱UFJアセットマネジメント", inceptionDate: "2018-07-03", sourceName: "三菱UFJアセットマネジメント", sourceUrl: "https://emaxis.am.mufg.jp/fund/253266.html", sourceSeriesDefinition: "分配金再投資基準価額の月末値", currency: "JPY", returnType: "total-return", priceBasis: "分配金再投資基準価額", dividendTreatment: "reinvested", feeTreatment: "reflected in NAV", fxTreatment: "none", firstMonth: "2018-08", lastMonth: "2025-06" },
  nasdaq100: { fundId: "nasdaq100", formalProductName: "iFreeNEXT NASDAQ100インデックス", identifier: "3373 / 04317188", manager: "大和アセットマネジメント", inceptionDate: "2018-08-31", sourceName: "大和アセットマネジメント", sourceUrl: "https://www.daiwa-am.co.jp/funds/detail/3373/detail_top.html", sourceSeriesDefinition: "分配金再投資基準価額の月末値", currency: "JPY", returnType: "total-return", priceBasis: "分配金再投資基準価額", dividendTreatment: "reinvested", feeTreatment: "reflected in NAV", fxTreatment: "none", firstMonth: "2018-09", lastMonth: "2025-06" },
  fangplus: { fundId: "fangplus", formalProductName: "iFreeNEXT FANG+インデックス", identifier: "3346 / 04311181", manager: "大和アセットマネジメント", inceptionDate: "2018-01-31", sourceName: "大和アセットマネジメント", sourceUrl: "https://www.daiwa-am.co.jp/funds/detail/3346/detail_top.html", sourceSeriesDefinition: "分配金再投資基準価額の月末値", currency: "JPY", returnType: "total-return", priceBasis: "分配金再投資基準価額", dividendTreatment: "reinvested", feeTreatment: "reflected in NAV", fxTreatment: "none", firstMonth: "2018-02", lastMonth: "2025-06" },
};

const expectedCounts = { vti: 126, vym: 126, eem: 126, inda: 126, orcan: 80, sp500: 83, nasdaq100: 82, fangplus: 89 };
const monthKey = (date) => date.slice(0, 7).replaceAll("/", "-");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const expectedMonths = (first, last) => { const out = []; let [y, m] = first.split("-").map(Number); const [ey, em] = last.split("-").map(Number); while (y < ey || (y === ey && m <= em)) { out.push(`${y}-${String(m).padStart(2, "0")}`); if (++m === 13) { m = 1; y++; } } return out; };
const decodeHtml = (s) => s.replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");

async function fetchText(url, encoding = "utf-8") { const response = await fetch(url); if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`); return new TextDecoder(encoding).decode(await response.arrayBuffer()); }
async function saveRaw(name, text) { await writeFile(path.join(RAW_DIR, name), text, "utf8"); return sha256(text); }

async function fetchSources() {
  await mkdir(RAW_DIR, { recursive: true });
  for (const id of ["vti", "vym"]) await saveRaw(SOURCES[id].raw, await fetchText(SOURCES[id].url));
  for (const id of ["eem", "inda"]) {
    const html = await fetchText(SOURCES[id].url);
    const match = html.match(/<div data-componentname="PerformanceV3"><walrus-render-on-client[^>]*componentprops="([^"]+)"/);
    if (!match) throw new Error(`${id}: PerformanceV3 data not found`);
    const props = JSON.parse(decodeHtml(match[1]));
    const point = props.containersByNameMap?.chart?.dataPointsByNameMap?.performanceData;
    if (!point?.asOfDate || !point?.value) throw new Error(`${id}: performanceData missing`);
    await saveRaw(SOURCES[id].raw, JSON.stringify({ sourceUrl: SOURCES[id].url, retrievedAt: RETRIEVED_AT, performanceData: point }, null, 2) + "\n");
  }
  for (const id of ["orcan", "sp500", "nasdaq100", "fangplus"]) await saveRaw(SOURCES[id].raw, await fetchText(SOURCES[id].url, "shift_jis"));
  const fxHtml = await fetchText(SOURCES.fx.url);
  const rows = [...fxHtml.matchAll(/<tr[^>]*>\s*<th[^>]*>(\d{4}\/\d{2})<\/th><td>\s*([\d.]+)\s*<\/td>/g)].map(([, month, value]) => ({ month: month.replace("/", "-"), yenPerUsd: Number(value) }));
  const selected = rows.filter(({ month }) => month >= "2014-12" && month <= "2025-06");
  await saveRaw(SOURCES.fx.raw, JSON.stringify({ sourceUrl: SOURCES.fx.url, seriesCode: "FM08'FXERM06", definition: "Spot Rate at 17:00 JST, End of Month, Tokyo Market", retrievedAt: RETRIEVED_AT, observations: selected }, null, 2) + "\n");
}

async function readRaw(name) { return readFile(path.join(RAW_DIR, name), "utf8"); }
function validateMonths(id, points) { const wanted = expectedMonths(META[id].firstMonth, META[id].lastMonth); const keys = points.map((p) => p.month); const missing = wanted.filter((m) => !keys.includes(m)); const duplicate = keys.length - new Set(keys).size; if (points.length !== expectedCounts[id] || missing.length || duplicate) throw new Error(`${id}: count=${points.length}, missing=${missing}, duplicate=${duplicate}`); if (points.some((p) => !Number.isFinite(p.monthlyReturn))) throw new Error(`${id}: invalid return`); }

function parseVanguard(text, first, last) { const monthly = JSON.parse(text).monthly; return Object.entries(monthly).filter(([date]) => monthKey(date) >= first && monthKey(date) <= last).map(([date, row]) => ({ month: monthKey(date), usdNavTotalReturn: row.annualizedReturns["1MTH"] / 100, sourceBasis: "Vanguard monthly annualizedReturns.1MTH (NAV)" })); }
function parseIShares(text, first, last) { const p = JSON.parse(text).performanceData; const levels = p.asOfDate.map((date, i) => ({ month: String(date).slice(0, 6).replace(/(\d{4})(\d{2})/, "$1-$2"), level: Number(p.value[i]) })); return levels.map((cur, i) => i ? ({ month: cur.month, usdNavTotalReturn: cur.level / levels[i - 1].level - 1, sourceBasis: "iShares Growth of Hypothetical $10,000 NAV series" }) : null).filter((p) => p && p.month >= first && p.month <= last); }
function parseDomestic(text, id) { const lines = text.trim().split(/\r?\n/); const datePattern = id === "orcan" || id === "sp500" ? /^\d{4}\/\d{2}\/\d{2},/ : /^\d{8},/; const reinvestedIndex = id === "orcan" || id === "sp500" ? 2 : 6; const daily = lines.filter((line) => datePattern.test(line)).map((line) => { const c = line.split(","); const rawDate = c[0]; const date = rawDate.includes("/") ? rawDate.replaceAll("/", "-") : `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`; return { date, month: date.slice(0, 7), reinvestedNav: Number(c[reinvestedIndex]) }; }).filter((p) => Number.isFinite(p.reinvestedNav)); const monthEnds = [...new Map(daily.map((p) => [p.month, p])).values()]; return monthEnds.map((cur, i) => i ? ({ month: cur.month, monthlyReturn: cur.reinvestedNav / monthEnds[i - 1].reinvestedNav - 1, previousMonthEndDate: monthEnds[i - 1].date, previousMonthEndReinvestedNav: monthEnds[i - 1].reinvestedNav, monthEndDate: cur.date, monthEndReinvestedNav: cur.reinvestedNav, sourceBasis: "official reinvested NAV, last published business day of each month" }) : null).filter((p) => p && p.month >= META[id].firstMonth && p.month <= META[id].lastMonth); }

async function buildLedgers() {
  await mkdir(DATA_DIR, { recursive: true });
  const fxDoc = JSON.parse(await readRaw(SOURCES.fx.raw)); const fx = Object.fromEntries(fxDoc.observations.map((p) => [p.month, p.yenPerUsd])); if (fxDoc.observations.length !== 127) throw new Error(`FX count ${fxDoc.observations.length}`);
  const ledgers = {};
  for (const id of ["vti", "vym", "eem", "inda"]) {
    const usd = id === "vti" || id === "vym" ? parseVanguard(await readRaw(SOURCES[id].raw), META[id].firstMonth, META[id].lastMonth) : parseIShares(await readRaw(SOURCES[id].raw), META[id].firstMonth, META[id].lastMonth);
    ledgers[id] = usd.map((p) => { const [y, m] = p.month.split("-").map(Number); const prev = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`; if (fx[prev] === undefined || fx[p.month] === undefined) throw new Error(`${id} FX missing ${prev}/${p.month}`); return { month: p.month, monthlyReturn: (1 + p.usdNavTotalReturn) * (fx[p.month] / fx[prev]) - 1, usdNavTotalReturn: p.usdNavTotalReturn, previousMonthEndYenPerUsd: fx[prev], monthEndYenPerUsd: fx[p.month], sourceBasis: p.sourceBasis }; });
  }
  for (const id of ["orcan", "sp500", "nasdaq100", "fangplus"]) ledgers[id] = parseDomestic(await readRaw(SOURCES[id].raw), id);
  const manifest = { schemaVersion: 1, retrievedAt: RETRIEVED_AT, fx: { sourceName: "日本銀行", sourceUrl: SOURCES.fx.url, rawDataUrl: SOURCES.fx.url, seriesCode: "FM08'FXERM06", currency: "JPY per USD", firstMonth: "2014-12", lastMonth: "2025-06", observationCount: 127, conversionFormula: "(1 + USD monthly NAV TR) * (current month-end USDJPY / previous month-end USDJPY) - 1", rawSha256: sha256(await readRaw(SOURCES.fx.raw)) }, series: {} };
  for (const [id, points] of Object.entries(ledgers)) { validateMonths(id, points); const raw = await readRaw(SOURCES[id].raw); const doc = { schemaVersion: 1, ...META[id], rawDataUrl: SOURCES[id].url, retrievedAt: RETRIEVED_AT, observationCount: points.length, missingMonths: [], inceptionTreatment: "product observations only; no pre-inception backfill", notes: id === "nasdaq100" ? "This ledger is iFreeNEXT NASDAQ100 Index, not eMAXIS NASDAQ100." : "No interpolation or fallback.", observations: points }; await writeFile(path.join(DATA_DIR, `${id}-monthly.json`), JSON.stringify(doc, null, 2) + "\n", "utf8"); manifest.series[id] = { file: `${id}-monthly.json`, ...META[id], rawFile: path.posix.join("raw", SOURCES[id].raw), rawDataUrl: SOURCES[id].url, retrievedAt: RETRIEVED_AT, observationCount: points.length, missingMonths: [], rawSha256: sha256(raw) }; }
  await writeFile(path.join(DATA_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

if (fetchMode) await fetchSources();
await buildLedgers();
console.log(`Built ${Object.keys(META).length} verified ledgers in ${DATA_DIR}`);
