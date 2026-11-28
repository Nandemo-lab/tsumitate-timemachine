import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { parseNportMonthlyReturns } from './sec-nport-return.mjs'

// Source: SEC public NPORT-P, accession 0000036405-26-000480, June 2026.
// The ETF share class C000007808 is independently identified on the filing index.
const fixture = `<edgarSubmission><headerData><seriesClassInfo><seriesId>S000002848</seriesId></seriesClassInfo></headerData><formData><genInfo><repPdDate>2026-06-30</repPdDate></genInfo><fundInfo><returnInfo><monthlyTotReturns><monthlyTotReturn classId="C000007808" rtn1="10.35084439" rtn2="5.15868534" rtn3="-0.33183643"/></monthlyTotReturns></returnInfo></fundInfo></formData></edgarSubmission>`
const opts = { seriesId: 'S000002848', classId: 'C000007808', expectedReportDate: '2026-06-30' }
test('SEC VTI class monthly return agrees with the existing USD NAV source for three months', async () => {
  const actual = parseNportMonthlyReturns(fixture, opts)
  const existing = JSON.parse(await readFile('data/verified/vti-monthly.json', 'utf8'))
  assert.deepEqual(actual.map(row => row.month), ['2026-04', '2026-05', '2026-06'])
  for (const row of actual) {
    const old = existing.observations.find(point => point.month === row.month)?.usdNavTotalReturn
    assert.ok(Math.abs(row.usdTotalReturn - old) < 1e-10, `${row.month}: ${row.usdTotalReturn} vs ${old}`)
  }
})
test('unknown fund, class, date or duplicate return cannot silently replace a series', () => {
  for (const bad of [{ ...opts, seriesId: 'S000000000' }, { ...opts, classId: 'C000000000' }, { ...opts, expectedReportDate: '2026-09-30' }]) {
    assert.throws(() => parseNportMonthlyReturns(fixture, bad))
  }
  assert.throws(() => parseNportMonthlyReturns(fixture.replace('</monthlyTotReturns>', '<monthlyTotReturn classId="C000007808" rtn1="1" rtn2="2" rtn3="3"/></monthlyTotReturns>'), opts))
})
