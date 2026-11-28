import { readFile } from 'node:fs/promises'

const manifest = JSON.parse(await readFile('data/verified/manifest.json', 'utf8'))
const observed = manifest.fx?.lastMonth
if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(observed)) throw new Error('Invalid verified data month')
const today = new Date()
const lastCompleteMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1))
const [year, month] = observed.split('-').map(Number)
const lag = (lastCompleteMonth.getUTCFullYear() - year) * 12 + lastCompleteMonth.getUTCMonth() + 1 - month
if (lag < 0) throw new Error('Verified data month is in the future')
if (lag >= 2) throw new Error(`Verified returns end ${observed}: ${lag} complete months behind; review official sources and licensing before releasing updates`)
console.log(`Verified returns end ${observed}; ${lag} complete months behind`)
