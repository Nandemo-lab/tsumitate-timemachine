import { FundId } from "@/types";
import { SITE_URL } from "@/lib/site";

const VALID_FUNDS: FundId[] = ["orcan", "sp500", "nasdaq100"];
const MIN_YEAR = 2015;
const MAX_YEAR = 2024;

export interface ShareParams {
  fund: FundId;
  year: number;
  month: number;
  amount: number;
}

/**
 * Builds the shareable URL pointing to /share (Server Component with OGP metadata).
 * Short params: f=fund, y=year, m=month, a=amount
 */
export function buildShareUrl(fund: FundId, year: number, month: number, amount: number): string {
  const params = new URLSearchParams({
    f: fund,
    y: String(year),
    m: String(month),
    a: String(amount),
  });
  return `${SITE_URL}/share?${params.toString()}`;
}

/**
 * Parses share params from a query string.
 * Supports short names (f, y, m, a) with fallback to legacy names (fund, start, month, amount).
 */
export function parseShareParams(search: string): ShareParams | null {
  const p = new URLSearchParams(search);

  const fundRaw = p.get("f") ?? p.get("fund");
  const yearRaw = p.get("y") ?? p.get("start");
  const monthRaw = p.get("m") ?? p.get("month");
  const amountRaw = p.get("a") ?? p.get("amount");

  if (!fundRaw || !yearRaw || !amountRaw) return null;

  const fund = fundRaw as FundId;
  if (!VALID_FUNDS.includes(fund)) return null;

  const year = parseInt(yearRaw, 10);
  const month = parseInt(monthRaw ?? "1", 10);
  const amount = parseInt(amountRaw, 10);

  if (isNaN(year) || isNaN(month) || isNaN(amount)) return null;
  if (year < MIN_YEAR || year > MAX_YEAR) return null;
  if (month < 1 || month > 12) return null;
  if (amount <= 0) return null;

  return { fund, year, month, amount };
}
