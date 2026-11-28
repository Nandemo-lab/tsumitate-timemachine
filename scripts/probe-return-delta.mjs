import { readFile } from 'node:fs/promises'
const fx = JSON.parse(await readFile('data/alternatives/ecb-usdjpy-month-end.json', 'utf8'))
const ecb = new Map(fx.observations.map(row => [row.month, row.yenPerUsd]))
const result = []
for (const fundId of ['vt', 'vti', 'vym', 'eem', 'inda']) {
  const verified = JSON.parse(await readFile(`data/verified/${fundId}-monthly.json`, 'utf8'))
  let former = 0, alternative = 0, worst = { month: null, percentagePoints: 0 }, count = 0
  for (const row of verified.observations) {
    const [year, month] = row.month.split('-').map(Number)
    const previousMonth = new Date(Date.UTC(year, month - 2, 1)).toISOString().slice(0, 7)
    if (!ecb.has(row.month) || !ecb.has(previousMonth)) continue
    const newReturn = (1 + row.usdNavTotalReturn) * ecb.get(row.month) / ecb.get(previousMonth) - 1
    const diff = (newReturn - row.monthlyReturn) * 100
    if (Math.abs(diff) > Math.abs(worst.percentagePoints)) worst = { month: row.month, percentagePoints: diff }
    former = (former + 10000) * (1 + row.monthlyReturn)
    alternative = (alternative + 10000) * (1 + newReturn)
    count++
  }
  if (count < 100) throw new Error(`${fundId}: fewer than 100 overlapping observations`)
  result.push({ fundId, months: count, largestMonthlyDifference: worst,
    formerEndingYen: Math.round(former), ecbEndingYen: Math.round(alternative) })
}
console.log(JSON.stringify({ calculation: 'JPY 10,000 added before each month return, no tax, five USD ETF funds, same fund USD monthly return; only FX source differs', result }, null, 2))
