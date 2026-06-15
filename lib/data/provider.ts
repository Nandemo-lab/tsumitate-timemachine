/**
 * データプロバイダー抽象層
 * Stooq / Yahoo Finance / Alpha Vantage など複数ソースに対応できる構造
 * 現在はStooqを使用。APIキー不要・無料。
 */

import { FundId } from "@/types";
import { FUNDS } from "@/lib/funds";

export interface PriceRecord {
  date: string;   // YYYY-MM-DD
  close: number;
}

export interface AnnualReturn {
  year: number;
  returnRate: number; // 0.15 = 15%
}

// キャッシュ: サーバーサイドのみ（Node.js runtime）
const cache = new Map<string, { data: AnnualReturn[]; fetchedAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6時間

export async function getAnnualReturns(fundId: FundId): Promise<AnnualReturn[]> {
  const cached = cache.get(fundId);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const fund = FUNDS[fundId];
  if (!fund?.ticker) return getFallbackReturns(fundId);

  try {
    const data = await fetchFromStooq(fund.ticker);
    if (data.length === 0) return getFallbackReturns(fundId);

    const annualReturns = computeAnnualReturns(data);
    cache.set(fundId, { data: annualReturns, fetchedAt: Date.now() });
    return annualReturns;
  } catch {
    return getFallbackReturns(fundId);
  }
}

async function fetchFromStooq(ticker: string): Promise<PriceRecord[]> {
  const d1 = "20150101";
  const d2 = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(ticker)}&d1=${d1}&d2=${d2}&i=m`;

  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 6 }, // 6時間キャッシュ
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`Stooq fetch failed: ${res.status}`);

  const csv = await res.text();
  return parseStooqCsv(csv);
}

function parseStooqCsv(csv: string): PriceRecord[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const records: PriceRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 5) continue;
    const [date, , , , close] = cols;
    const closeNum = parseFloat(close);
    if (!date || isNaN(closeNum)) continue;
    records.push({ date: date.trim(), close: closeNum });
  }
  return records.sort((a, b) => a.date.localeCompare(b.date));
}

function computeAnnualReturns(prices: PriceRecord[]): AnnualReturn[] {
  // Group end-of-year prices
  const yearMap = new Map<number, number>();
  for (const p of prices) {
    const year = parseInt(p.date.slice(0, 4));
    yearMap.set(year, p.close); // overwrite = last month of year
  }

  const years = Array.from(yearMap.keys()).sort();
  const returns: AnnualReturn[] = [];

  for (let i = 1; i < years.length; i++) {
    const prev = yearMap.get(years[i - 1])!;
    const curr = yearMap.get(years[i])!;
    returns.push({
      year: years[i],
      returnRate: (curr - prev) / prev,
    });
  }
  return returns;
}

// フォールバック: funds.ts の静的データを使用
function getFallbackReturns(fundId: FundId): AnnualReturn[] {
  const fund = FUNDS[fundId];
  return Object.entries(fund.annualReturns).map(([year, rate]) => ({
    year: parseInt(year),
    returnRate: rate,
  }));
}
