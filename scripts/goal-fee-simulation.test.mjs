import assert from "node:assert/strict";
import { transform } from "esbuild";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../lib/goal-fee-simulation.ts", import.meta.url), "utf8");
const { code } = await transform(source, { loader: "ts", format: "cjs" });
const context = { exports: {}, module: { exports: {} }, RangeError, Math, Number };
vm.runInNewContext(code, context);
const { projectGoal } = context.module.exports;
const base = { targetToday: 120000, years: 1, grossAnnualPercent: 0, inflationAnnualPercent: 0, annualFeeLowPercent: 0, annualFeeHighPercent: 0 };
assert.deepEqual(JSON.parse(JSON.stringify(projectGoal(base))), { nominalTarget: 120000, monthlyA: 10000, monthlyB: 10000, monthlyDifference: 0, months: 12, contributionA: 120000, contributionB: 120000 });
const higherFee = projectGoal({ ...base, years: 20, annualFeeHighPercent: 1 });
assert.ok(higherFee.monthlyB > higherFee.monthlyA);
const inflation = projectGoal({ ...base, years: 20, inflationAnnualPercent: 2 });
assert.ok(inflation.nominalTarget > base.targetToday);
for (const bad of [{ ...base, years: 0 }, { ...base, grossAnnualPercent: Number.NaN }, { ...base, annualFeeLowPercent: -1 }]) {
  assert.throws(() => projectGoal(bad));
}
console.log("assumption-only goal calculator cases pass");
