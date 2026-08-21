import fs from "node:fs";
import path from "node:path";

const sourcePath = path.join(process.cwd(), "lib", "verified-monthly-return-series.ts");
const source = fs.readFileSync(sourcePath, "utf8");

function readNumericArray(name) {
  const match = source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\] as const;`));
  if (!match) throw new Error(`${name} not found`);
  return match[1]
    .replace(/\/\/.*$/gm, "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map(Number);
}

const usdReturns = readNumericArray("VT_MONTHLY_USD_NAV_TOTAL_RETURNS");
const fx = readNumericArray("BOJ_MONTH_END_YEN_PER_USD");
if (usdReturns.length !== 126 || fx.length !== 127 || [...usdReturns, ...fx].some(Number.isNaN)) {
  throw new Error(`ledger mismatch: returns=${usdReturns.length}, fx=${fx.length}`);
}

const months = Array.from({ length: 126 }, (_, index) => {
  const serial = 2015 * 12 + index;
  return `${Math.floor(serial / 12)}-${String((serial % 12) + 1).padStart(2, "0")}`;
});
const jpyReturns = usdReturns.map((usd, index) => (1 + usd) * (fx[index + 1] / fx[index]) - 1);

const officialAnnual = {
  2015: -0.0188, 2016: 0.0877, 2017: 0.2419, 2018: -0.0967, 2019: 0.2680,
  2020: 0.1674, 2021: 0.1825, 2022: -0.1800, 2023: 0.2190, 2024: 0.1648,
};
for (const [yearText, official] of Object.entries(officialAnnual)) {
  const year = Number(yearText);
  const compounded = usdReturns.slice((year - 2015) * 12, (year - 2014) * 12).reduce((value, monthly) => value * (1 + monthly), 1) - 1;
  if (Math.abs(compounded - official) > 0.0015) {
    throw new Error(`${year} monthly/annual mismatch: ${compounded} vs ${official}`);
  }
}

function independentSimulation(startYear, monthlyAmount, endMonth = "2025-06") {
  const startIndex = months.indexOf(`${startYear}-01`);
  const endIndex = months.indexOf(endMonth);
  if (startIndex < 0 || endIndex < startIndex) throw new Error("unsupported audit period");
  let value = 0;
  let principal = 0;
  for (let index = startIndex; index <= endIndex; index += 1) {
    principal += monthlyAmount;
    value = (value + monthlyAmount) * (1 + jpyReturns[index]);
  }
  const finalValue = Math.round(value);
  const profit = finalValue - principal;
  return { startYear, endMonth, monthlyAmount, months: endIndex - startIndex + 1, principal, finalValue, profit, returnRate: Math.round((profit / principal) * 1000) / 10 };
}

const cases = [2015, 2020, 2023].flatMap((year) => [10000, 30000, 50000, 100000].map((amount) => independentSimulation(year, amount)));
const partialYearCase = independentSimulation(2023, 30000, "2024-06");
const jpyCalendarReturns = Object.fromEntries([2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map((year) => [
  year,
  jpyReturns.slice((year - 2015) * 12, (year - 2014) * 12).reduce((value, monthly) => value * (1 + monthly), 1) - 1,
]));
const jpy2025FirstHalfReturn = jpyReturns.slice(120, 126).reduce((value, monthly) => value * (1 + monthly), 1) - 1;

console.log(JSON.stringify({
  status: "PASS",
  ledger: { firstMonth: months[0], lastMonth: months.at(-1), monthlyReturns: usdReturns.length, fxObservations: fx.length },
  timing: "beginning-of-month contribution, then monthly JPY return",
  annualReconciliation: "2015-2024 within 0.15 percentage points (official UI monthly values are rounded to 0.01%)",
  jpyCalendarReturns,
  jpy2025FirstHalfReturn,
  cases,
  partialYearCase,
  lookAhead: months.at(-1) === "2025-06" ? "PASS" : "FAIL",
}, null, 2));
