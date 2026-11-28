import assert from "node:assert/strict";
import { projectWithdrawal, sustainableMonthlyWithdrawal } from "../lib/withdrawal-simulation.ts";

const base = { initialYen: 1_200_000, monthlyYen: 100_000, years: 1, annualReturnPercent: 0, annualInflationPercent: 0 };
assert.deepEqual(projectWithdrawal(base).shortfallMonth, null);
assert.equal(projectWithdrawal(base).endingBalance, 0);
assert.equal(projectWithdrawal(base).totalWithdrawn, 1_200_000);
assert.equal(projectWithdrawal({ ...base, monthlyYen: 100_001 }).shortfallMonth, 12);
assert.equal(sustainableMonthlyWithdrawal(base), 100_000);
assert.equal(projectWithdrawal({ ...base, annualInflationPercent: 2 }).shortfallMonth, 12);
assert.equal(projectWithdrawal({ ...base, initialYen: 0, monthlyYen: 1 }).shortfallMonth, 1);
assert.equal(projectWithdrawal({ ...base, annualReturnPercent: -10 }).shortfallMonth, 12);
assert.throws(() => projectWithdrawal({ ...base, years: 0 }), RangeError);
assert.throws(() => projectWithdrawal({ ...base, annualReturnPercent: Number.NaN }), RangeError);
console.log("withdrawal-simulation: 9 checks passed");
