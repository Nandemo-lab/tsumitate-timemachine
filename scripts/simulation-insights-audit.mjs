import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const verifiedRoot = path.join(root, "data", "verified");
const cases = {
  vt: [5, 5, -17790, "2020-03"],
  vti: [4, 4, -17051, "2020-03"],
  vym: [9, 7, -18236, "2020-03"],
  eem: [5, 5, -18092, "2020-03"],
  inda: [6, 6, -25848, "2020-03"],
  orcan: [5, 5, -17491, "2020-03"],
  sp500: [3, 3, -15396, "2020-03"],
  nasdaq100: [2, 2, -9498, "2020-03"],
  fangplus: [2, 1, -25770, "2022-12"],
};

function analyze(points, monthlyAmount) {
  let principal = 0;
  let value = 0;
  let below = 0;
  let streak = 0;
  let longest = 0;
  let worst = 0;
  let worstMonth = null;

  for (const point of points) {
    principal += monthlyAmount;
    value = (value + monthlyAmount) * (1 + point.monthlyReturn);
    const shortfall = Math.round(value) - Math.round(principal);
    if (shortfall < 0) {
      below++;
      streak++;
      longest = Math.max(longest, streak);
      if (shortfall < worst) {
        worst = shortfall;
        worstMonth = point.month;
      }
    } else {
      streak = 0;
    }
  }
  return { below, longest, worst, worstMonth };
}

for (const [fundId, expected] of Object.entries(cases)) {
  const doc = JSON.parse(fs.readFileSync(path.join(verifiedRoot, `${fundId}-monthly.json`), "utf8"));
  const points = doc.observations.filter((point) => point.month >= "2020-01" && point.month <= "2026-09");
  const actual = analyze(points, 30_000);
  if (actual.below !== expected[0] || actual.longest !== expected[1] || actual.worst !== expected[2] || actual.worstMonth !== expected[3]) {
    throw new Error(`${fundId}: expected ${expected.join("/")}, got ${actual.below}/${actual.longest}/${actual.worst}/${actual.worstMonth}`);
  }
  console.log(`PASS ${fundId}: below=${actual.below}, longest=${actual.longest}, worst=${actual.worstMonth} ${actual.worst}`);
}

const source = fs.readFileSync(path.join(root, "lib", "simulation-insights.ts"), "utf8");
if (!source.includes("point.value - point.principal") || !source.includes("shortfall < 0")) {
  throw new Error("simulation insights must compare month-end value with contributed principal");
}
if (!source.includes("日中の最大下落率") || !source.includes("月末評価額")) {
  throw new Error("simulation insights definition must preserve the month-end limitation");
}
const simulationSource = fs.readFileSync(path.join(root, "lib", "simulation.ts"), "utf8");
if (!simulationSource.includes("isReturnMonthAvailable(fundId, startYear, startMonth)") || !simulationSource.includes("end month must not be earlier")) {
  throw new Error("simulation must reject unavailable starts and reversed periods in the shared calculation boundary");
}

console.log("PASS simulation insights audit: verified A-series only, month-end observations, no inferred intraday drawdown");
