import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const url = 'https://data-api.ecb.europa.eu/service/data/EXR/D.USD+JPY.EUR.SP00.A?startPeriod=2014-12-01&format=csvdata'
const csv = execFileSync('curl', ['--fail', '--silent', '--show-error', '--location', '--max-time', '45', url], { encoding: 'utf8', maxBuffer: 8_000_000 })
const [header, ...lines] = csv.trim().split(/\r?\n/)
const fields = header.split(',')
const dateIndex = fields.indexOf('TIME_PERIOD')
const valueIndex = fields.indexOf('OBS_VALUE')
const currencyIndex = fields.indexOf('CURRENCY')
const statusIndex = fields.indexOf('OBS_STATUS')
if (Math.min(dateIndex, valueIndex, currencyIndex, statusIndex) < 0) throw new Error('ECB CSV schema changed')
const dates = new Map()
for (const line of lines) {
  const cols = line.split(',')
  const date = cols[dateIndex], currency = cols[currencyIndex], value = Number(cols[valueIndex])
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !['USD', 'JPY'].includes(currency) || cols[statusIndex] !== 'A' || !Number.isFinite(value) || value <= 0) continue
  dates.set(date, { ...dates.get(date), [currency]: value })
}
const months = new Map()
for (const [date, rates] of [...dates].sort(([a], [b]) => a.localeCompare(b))) {
  if (!rates.USD || !rates.JPY) continue
  months.set(date.slice(0, 7), { month: date.slice(0, 7), referenceDate: date, yenPerUsd: rates.JPY / rates.USD,
    eurJpy: rates.JPY, eurUsd: rates.USD })
}
const now = new Date()
const lastCompleteMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0)).toISOString().slice(0, 7)
const observations = [...months.values()].filter(row => row.month <= lastCompleteMonth)
if (observations.length < 100 || observations.at(-1).month < '2026-09') throw new Error('ECB cross-rate history is incomplete')
const previous = JSON.parse(await readFile('data/verified/raw/boj-usdjpy-month-end.json', 'utf8'))
const oldByMonth = new Map(previous.observations.map(row => [row.month, row.yenPerUsd]))
const overlap = observations.filter(row => oldByMonth.has(row.month)).map(row => ({month:row.month,
  ecb:row.yenPerUsd, boj:oldByMonth.get(row.month), difference:row.yenPerUsd - oldByMonth.get(row.month)}))
if (overlap.length < 100) throw new Error('Too few comparable months with prior BOJ source')
const sorted = [...overlap].sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
const output = { schemaVersion: 1, source: 'ECB daily EUR/JPY and EUR/USD reference rates', sourceUrl: url,
  licenseUrl: 'https://www.ecb.europa.eu/services/using-our-site/disclaimer/html/index.en.html',
  calculation: 'Last common ECB business day in each calendar month; derived JPY per USD = ECB JPY per EUR / ECB USD per EUR. This cross rate is calculated by CarVista/Tsumitate Timemachine, not an ECB-published USD/JPY rate.',
  generatedAt: new Date().toISOString(), firstMonth: observations[0].month, lastMonth: observations.at(-1).month, observations }
await mkdir('data/alternatives', { recursive: true })
await writeFile('data/alternatives/ecb-usdjpy-month-end.json', `${JSON.stringify(output, null, 2)}\n`)
console.log(JSON.stringify({ observations: observations.length, overlap: overlap.length, maxAbsDifference: sorted[0],
  meanAbsDifference: overlap.reduce((s, row) => s + Math.abs(row.difference), 0) / overlap.length,
  recent: overlap.at(-1), output: 'data/alternatives/ecb-usdjpy-month-end.json' }, null, 2))
