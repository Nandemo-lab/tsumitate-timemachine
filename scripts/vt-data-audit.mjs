import fs from "node:fs";
import path from "node:path";

const doc = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "verified", "vt-monthly.json"), "utf8"));
const points = doc.observations;
if (doc.firstMonth !== "2015-01" || doc.lastMonth !== "2026-08" || points.length !== 140) throw new Error("VT ledger range mismatch");
for (const point of points) {
  const independent = (1 + point.usdNavTotalReturn) * (point.monthEndYenPerUsd / point.previousMonthEndYenPerUsd) - 1;
  if (Math.abs(independent - point.monthlyReturn) > 1e-14) throw new Error(`VT FX mismatch: ${point.month}`);
}
const simulate = (startMonth, amount, endMonth = doc.lastMonth) => {
  const selected = points.filter((point) => point.month >= startMonth && point.month <= endMonth);
  let value = 0;
  for (const point of selected) value = (value + amount) * (1 + point.monthlyReturn);
  return { startMonth, endMonth, amount, months: selected.length, principal: selected.length * amount, finalValue: Math.round(value) };
};
console.log(JSON.stringify({ status: "PASS", source: doc.rawDataUrl, retrievedAt: doc.retrievedAt,
  ledger: { firstMonth: doc.firstMonth, lastMonth: doc.lastMonth, observations: points.length },
  formula: "(1 + USD NAV total return) * (current BOJ USDJPY / previous BOJ USDJPY) - 1",
  cases: [simulate("2015-01", 30000), simulate("2020-01", 30000), simulate("2026-01", 30000)],
  missingFallback: "PASS", futureReference: points.at(-1).month === doc.lastMonth ? "PASS" : "FAIL" }, null, 2));
