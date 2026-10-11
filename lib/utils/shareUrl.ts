import { FundId } from "@/types";
import { SITE_URL } from "@/lib/site";
import { FUNDS } from "@/lib/funds";
import { getAvailableEndMonth, isReturnMonthAvailable, RETURN_SERIES_REGISTRY } from "@/lib/return-series";
import { isValidMonthlyAmount, parseStrictInteger } from "@/lib/simulation";

const VALID_FUNDS = Object.keys(FUNDS) as FundId[];

export interface ShareParams {
  fund: FundId;
  fundB?: FundId;
  year: number;
  month: number;
  endYear: number;
  endMonth: number;
  amount: number;
}

/**
 * Builds the shareable URL pointing to /share (Server Component with OGP metadata).
 * Short params: f=fund, y=year, m=month, a=amount
 */
export function buildShareUrl(input: ShareParams): string {
  const { fund, fundB, year, month, endYear, endMonth, amount } = input;
  const params = new URLSearchParams({
    f: fund,
    y: String(year),
    m: String(month),
    ey: String(endYear),
    em: String(endMonth),
    a: String(amount),
  });
  if (fundB) params.set("fb", fundB);
  return `${SITE_URL}/share?${params.toString()}`;
}

/**
 * Parses share params from a query string.
 * Supports short names (f, y, m, a) with fallback to legacy names (fund, start, month, amount).
 */
export function parseShareParams(search: string): ShareParams | null {
  const p = new URLSearchParams(search);

  const fundRaw = p.get("f") ?? p.get("fund");
  const fundBRaw = p.get("fb") ?? p.get("fundB");
  const yearRaw = p.get("y") ?? p.get("start");
  const monthRaw = p.get("m") ?? p.get("month");
  const endYearRaw = p.get("ey");
  const endMonthRaw = p.get("em");
  const amountRaw = p.get("a") ?? p.get("amount");

  if (!fundRaw || !yearRaw || !amountRaw) return null;

  const fund = fundRaw as FundId;
  if (!VALID_FUNDS.includes(fund)) return null;
  const fundB = fundBRaw ? fundBRaw as FundId : undefined;
  if (fundB && !VALID_FUNDS.includes(fundB)) return null;
  if (RETURN_SERIES_REGISTRY[fund].quality !== "A" || (fundB && RETURN_SERIES_REGISTRY[fundB].quality !== "A")) return null;

  const year = parseStrictInteger(yearRaw);
  const month = parseStrictInteger(monthRaw ?? "1");
  const defaultEnd = [fund, fundB].filter((id): id is FundId => Boolean(id)).map(getAvailableEndMonth).sort()[0];
  const endYear = parseStrictInteger(endYearRaw ?? defaultEnd.slice(0, 4));
  const endMonth = parseStrictInteger(endMonthRaw ?? defaultEnd.slice(5, 7));
  const amount = parseStrictInteger(amountRaw);

  if (year === null || month === null || endYear === null || endMonth === null || amount === null) return null;
  if (month < 1 || month > 12) return null;
  if (endMonth < 1 || endMonth > 12) return null;
  if (!isValidMonthlyAmount(amount)) return null;
  if (!isReturnMonthAvailable(fund, year, month) || !isReturnMonthAvailable(fund, endYear, endMonth)) return null;
  if (fundB && (!isReturnMonthAvailable(fundB, year, month) || !isReturnMonthAvailable(fundB, endYear, endMonth))) return null;
  if (endYear < year || (endYear === year && endMonth < month)) return null;

  return { fund, fundB, year, month, endYear, endMonth, amount };
}
