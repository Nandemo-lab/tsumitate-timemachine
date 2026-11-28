// Isolated research adapter. No live-site data is changed by importing this module.
const monthShift = (month, offset) => {
  const [year, ordinal] = month.split('-').map(Number)
  const date = new Date(Date.UTC(year, ordinal - 1 + offset, 1))
  return date.toISOString().slice(0, 7)
}

export function parseNportMonthlyReturns(xml, { seriesId, classId, expectedReportDate }) {
  if (typeof xml !== 'string' || xml.length > 20_000_000) throw new Error('Invalid N-PORT XML size')
  const unique = (regexp, description) => {
    const matches = [...xml.matchAll(regexp)].map(match => match[1])
    if (matches.length !== 1) throw new Error(`Expected one ${description}, found ${matches.length}`)
    return matches[0]
  }
  const seriesIds = [...xml.matchAll(/<seriesId>(S\d+)<\/seriesId>/g)].map(match => match[1])
  if (!seriesIds.length || seriesIds.some(id => id !== seriesId)) throw new Error('Unexpected or multiple series IDs')
  const period = unique(/<repPdDate>(\d{4}-\d{2}-\d{2})<\/repPdDate>/g, 'report date')
  if (period !== expectedReportDate || !/^\d{4}-\d{2}-(28|29|30|31)$/.test(period)) throw new Error('Report date mismatch')
  const rows = [...xml.matchAll(/<monthlyTotReturn\s+([^>]+)\/>/g)].map(match => Object.fromEntries([...match[1].matchAll(/([A-Za-z0-9]+)="([^"]*)"/g)].map(attr => [attr[1], attr[2]])))
  const matches = rows.filter(row => row.classId === classId)
  if (matches.length !== 1) throw new Error(`Expected one class ${classId}, found ${matches.length}`)
  const values = [matches[0].rtn1, matches[0].rtn2, matches[0].rtn3].map(Number)
  if (values.some(value => !Number.isFinite(value) || value <= -100 || value > 1000)) throw new Error('Invalid monthly percent return')
  return values.map((percent, index) => ({ month: monthShift(period.slice(0, 7), index - 2), usdTotalReturn: percent / 100,
    sourceField: `rtn${index + 1}` }))
}
