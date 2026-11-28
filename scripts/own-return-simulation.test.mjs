import test from 'node:test';
import assert from 'node:assert/strict';
import { parseOwnReturns, simulateOwnReturns } from '../lib/own-return-simulation.ts';

test('month-start contribution and rounding match existing simulator semantics', () => {
  const rows = parseOwnReturns('2025-01,10\n2025-02,-10');
  const r = simulateOwnReturns(rows, 30000);
  assert.equal(r.principal, 60000);
  assert.equal(r.finalValue, 56700);
  assert.equal(r.profit, -3300);
  assert.equal(r.underwaterMonths, 1);
  assert.ok(Math.abs(r.maxDrawdown - 0.1) < 1e-12);
});
test('amount and date gaps are rejected, not silently filled', () => {
  assert.throws(() => parseOwnReturns('2025-01,1\n2025-03,2'), /連続/);
  assert.throws(() => parseOwnReturns('2025-01,not-a-number'), /形式/);
  assert.throws(() => simulateOwnReturns([{month:'2025-01',rate:0}], 0), /積立額/);
});
