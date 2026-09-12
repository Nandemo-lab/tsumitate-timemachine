import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const registrySource = read("lib/return-series.ts");
const simulationSource = read("lib/simulation.ts");
const fundsSource = read("lib/funds.ts");
const manifest = JSON.parse(read("data/verified/manifest.json"));
const errors = [];
const ok = (condition, message) => condition ? console.log(`OK  ${message}`) : errors.push(message);

const allFunds = ["orcan", "vt", "sp500", "vti", "vym", "schd", "nasdaq100", "fangplus", "india", "emerging"];
for (const fundId of allFunds) {
  const explicit = new RegExp(`\\b${fundId}:\\s*\\{`).test(registrySource);
  const generated = registrySource.includes(`${fundId}: definitionFromLedger("${fundId}"`);
  ok(explicit || generated, `${fundId} registry entry`);
}
ok((registrySource.match(/definitionFromLedger\("/g) ?? []).length === 8 && /vt:[\s\S]*?quality: "A"/.test(registrySource), "A series count = 9");
ok(/schd:[\s\S]*?quality: "G"/.test(registrySource), "SCHD remains G");
ok(!/annualReturns\[year\]\s*\?\?/.test(simulationSource), "no annual fallback chain");
ok(!/CURRENT_YEAR\]\s*\?\?\s*0\.10/.test(simulationSource), "no CURRENT_YEAR/10% fallback");
ok(/filter\(\(fund\) => VERIFIED_FUND_IDS\.includes/.test(simulationSource), "performance ranking is A-only");
ok(/managementFee: "0\.060%（年率）"/.test(fundsSource), "SCHD expense ratio is 0.060%");
ok(/formalName: "Schwab U\.S\. Dividend Equity ETF（SCHD）"/.test(fundsSource), "SCHD identity is US ETF");

const expected = { vti: 126, vym: 126, eem: 126, inda: 126, orcan: 80, sp500: 83, nasdaq100: 82, fangplus: 89 };
for (const [key, count] of Object.entries(expected)) {
  const entry = manifest.series[key];
  const ledger = JSON.parse(read(`data/verified/${entry.file}`));
  ok(ledger.observations.length === count, `${key} observation count = ${count}`);
  ok(new Set(ledger.observations.map((point) => point.month)).size === count, `${key} duplicate months = 0`);
  ok(ledger.observations.every((point) => Number.isFinite(point.monthlyReturn)), `${key} invalid returns = 0`);
  ok(ledger.observations[0].month === entry.firstMonth && ledger.observations.at(-1).month === entry.lastMonth, `${key} start/end`);
}

function simulateLedger(file, startMonth, monthlyAmount) {
  const ledger = JSON.parse(read(file));
  const returns = new Map(ledger.observations.map((point) => [point.month, point.monthlyReturn]));
  let value = 0;
  let principal = 0;
  for (let serial = Number(startMonth.slice(0, 4)) * 12 + Number(startMonth.slice(5, 7)) - 1; serial <= 2025 * 12 + 5; serial++) {
    const key = `${Math.floor(serial / 12)}-${String(serial % 12 + 1).padStart(2, "0")}`;
    if (!returns.has(key)) throw new Error(`missing ${key} in ${file}`);
    principal += monthlyAmount;
    value = (value + monthlyAmount) * (1 + returns.get(key));
  }
  return { principal, value: Math.round(value) };
}

const known = [
  ["data/verified/vti-monthly.json", "2015-01", 10005172],
  ["data/verified/vti-monthly.json", "2020-01", 3463962],
  ["data/verified/vti-monthly.json", "2023-01", 1141158],
  ["data/verified/vym-monthly.json", "2015-01", 8424977],
  ["data/verified/vym-monthly.json", "2020-01", 3244954],
  ["data/verified/vym-monthly.json", "2023-01", 1067999],
];
for (const [file, start, expectedValue] of known) {
  ok(simulateLedger(file, start, 30000).value === expectedValue, `${file} ${start} 30k = ${expectedValue.toLocaleString()}円`);
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exit(1);
}
console.log("Return Series integration audit: PASS");
