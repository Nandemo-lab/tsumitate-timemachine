import {
  SimulationParams, SimulationResult, MonthlyDataPoint,
  RankingItem, FundId, InvestmentEvent, AdvancedSimulationResult, AdvancedDataPoint
} from "@/types";
import { FUNDS, FUND_LIST } from "./funds";
import { VERIFIED_FUND_IDS, UnverifiedReturnSeriesError, getAvailableEndMonth, getCommonStartMonth, getMonthlyJpyReturn, isReturnMonthAvailable, isVerifiedReturnSeries } from "./return-series";

export const CURRENT_YEAR = 2026;
export const CURRENT_MONTH = 8;
export const DATA_SOURCE = "一次情報から検証した月次円建てリターン（A系列）と、原典未検証の年次参考モデル（G系列）";
export const DATA_UPDATED = "2026年10月11日（収録最終月：2026年8月）";
export const MAX_MONTHLY_AMOUNT = 1_000_000;

export function isValidMonthlyAmount(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0 && value <= MAX_MONTHLY_AMOUNT;
}

export function parseStrictInteger(value: string | null | undefined): number | null {
  if (value == null || !/^[0-9]+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function endParts(fundIds: FundId[]): [number, number] {
  const end = fundIds.map(getAvailableEndMonth).sort().at(0) ?? `${CURRENT_YEAR}-${String(CURRENT_MONTH).padStart(2, "0")}`;
  return end.split("-").map(Number) as [number, number];
}

// ── 通常シミュレーション ─────────────────────────────────────────────

export function simulate(params: SimulationParams): SimulationResult {
  const { fundId, startYear, startMonth, monthlyAmount } = params;
  if (!isVerifiedReturnSeries(fundId)) throw new UnverifiedReturnSeriesError(fundId);
  if (!isValidMonthlyAmount(monthlyAmount)) throw new RangeError("monthlyAmount must be a positive integer no greater than 1,000,000");
  if (!isReturnMonthAvailable(fundId, startYear, startMonth)) {
    throw new RangeError("start month is outside the verified return series");
  }
  const fund = FUNDS[fundId];
  const dataPoints: MonthlyDataPoint[] = [];

  let totalPrincipal = 0;
  let currentValue = 0;
  let monthIndex = 0;
  let year = startYear;
  let month = startMonth;
  const [availableEndYear, availableEndMonth] = endParts([fundId]);
  const requestedEnd = params.endYear === undefined
    ? [availableEndYear, availableEndMonth] as const
    : [params.endYear, params.endMonth ?? 12] as const;
  if (requestedEnd[1] < 1 || requestedEnd[1] > 12
    || requestedEnd[0] < startYear
    || (requestedEnd[0] === startYear && requestedEnd[1] < startMonth)) {
    throw new RangeError("end month must not be earlier than the start month");
  }
  const [endYear, endMonth] = requestedEnd[0] < availableEndYear
    || (requestedEnd[0] === availableEndYear && requestedEnd[1] < availableEndMonth)
    ? requestedEnd
    : [availableEndYear, availableEndMonth] as const;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    totalPrincipal += monthlyAmount;
    currentValue += monthlyAmount;
    currentValue *= 1 + getMonthlyJpyReturn(fundId, year, month);

    dataPoints.push({
      date: `${year}/${String(month).padStart(2, "0")}`,
      principal: Math.round(totalPrincipal),
      value: Math.round(currentValue),
      profit: Math.round(currentValue - totalPrincipal),
      month: monthIndex,
    });

    monthIndex++;
    month++;
    if (month > 12) { month = 1; year++; }
  }

  const finalValue = Math.round(currentValue);
  const principal = Math.round(totalPrincipal);
  const profit = finalValue - principal;

  return {
    fundId, fundName: fund.shortName, fundColor: fund.color,
    totalPrincipal: principal, finalValue, profit,
    returnRate: Math.round(principal > 0 ? (profit / principal) * 1000 : 0) / 10,
    dataPoints,
    monthsElapsed: monthIndex,
    startYear, startMonth, monthlyAmount,
  };
}

// ── 詳細シミュレーション（タイムライン型） ──────────────────────────

export function simulateAdvanced(events: InvestmentEvent[]): AdvancedSimulationResult {
  if (events.length === 0) {
    return { events, totalPrincipal: 0, finalValue: 0, profit: 0, returnRate: 0, monthlyDataPoints: [] };
  }

  const sorted = [...events].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );
  const unverifiedFund = sorted.find((event) => event.fundId && !isVerifiedReturnSeries(event.fundId))?.fundId;
  if (unverifiedFund) throw new UnverifiedReturnSeriesError(unverifiedFund);

  // Per-fund state: { value, monthlyAmount }
  const fundStates = new Map<FundId, { value: number; monthlyAmount: number }>();
  let totalPrincipal = 0;
  const monthlyDataPoints: AdvancedDataPoint[] = [];

  let year = sorted[0].year;
  let month = sorted[0].month;
  const involvedFunds = [...new Set(sorted.map((event) => event.fundId).filter((fundId): fundId is FundId => Boolean(fundId)))];
  const [endYear, endMonth] = endParts(involvedFunds);

  while (year < endYear || (year === endYear && month <= endMonth)) {
    // Apply events for this month
    for (const ev of sorted) {
      if (ev.year !== year || ev.month !== month) continue;

      switch (ev.type) {
        case "start":
        case "add_fund": {
          const fundId = ev.fundId!;
          const prev = fundStates.get(fundId);
          fundStates.set(fundId, {
            value: prev?.value ?? 0,
            monthlyAmount: ev.monthlyAmount ?? prev?.monthlyAmount ?? 0,
          });
          break;
        }
        case "change_amount": {
          const fundId = ev.fundId!;
          const prev = fundStates.get(fundId);
          if (prev) fundStates.set(fundId, { ...prev, monthlyAmount: ev.monthlyAmount ?? 0 });
          break;
        }
        case "lump_sum": {
          const fundId = ev.fundId!;
          const amt = ev.lumpAmount ?? 0;
          totalPrincipal += amt;
          const prev = fundStates.get(fundId);
          fundStates.set(fundId, { value: (prev?.value ?? 0) + amt, monthlyAmount: prev?.monthlyAmount ?? 0 });
          break;
        }
        case "bonus": {
          const fundId = ev.fundId!;
          if (ev.bonusMonths?.includes(month)) {
            const amt = ev.bonusAmount ?? 0;
            totalPrincipal += amt;
            const prev = fundStates.get(fundId);
            fundStates.set(fundId, { value: (prev?.value ?? 0) + amt, monthlyAmount: prev?.monthlyAmount ?? 0 });
          }
          break;
        }
        case "stop": {
          const fundId = ev.fundId;
          if (fundId) {
            const prev = fundStates.get(fundId);
            if (prev) fundStates.set(fundId, { ...prev, monthlyAmount: 0 });
          } else {
            // Stop all
            for (const [fid, state] of fundStates) {
              fundStates.set(fid, { ...state, monthlyAmount: 0 });
            }
          }
          break;
        }
      }
    }

    // Monthly contribution + growth
    const breakdown: Record<string, number> = {};
    for (const [fundId, state] of fundStates) {
      totalPrincipal += state.monthlyAmount;
      state.value += state.monthlyAmount;
      const fund = FUNDS[fundId];
      if (fund) {
        state.value *= 1 + getMonthlyJpyReturn(fundId, year, month);
      }
      breakdown[fundId] = Math.round(state.value);
    }

    const totalValue = Math.round(Array.from(fundStates.values()).reduce((s, f) => s + f.value, 0));

    monthlyDataPoints.push({
      date: `${year}/${String(month).padStart(2, "0")}`,
      year, month,
      principal: Math.round(totalPrincipal),
      value: totalValue,
      profit: totalValue - Math.round(totalPrincipal),
      breakdown: breakdown as Record<FundId, number>,
    });

    month++;
    if (month > 12) { month = 1; year++; }
  }

  const finalValue = monthlyDataPoints[monthlyDataPoints.length - 1]?.value ?? 0;
  const principal = Math.round(totalPrincipal);
  const profit = finalValue - principal;

  return {
    events, totalPrincipal: principal, finalValue, profit,
    returnRate: Math.round(principal > 0 ? (profit / principal) * 1000 : 0) / 10,
    monthlyDataPoints,
  };
}

// ── ランキング ──────────────────────────────────────────────────────

export function simulateAll(startYear: number, startMonth: number, monthlyAmount: number): RankingItem[] {
  const commonStart = getCommonStartMonth(VERIFIED_FUND_IDS);
  const requested = `${startYear}-${String(startMonth).padStart(2, "0")}`;
  const effective = requested < commonStart ? commonStart : requested;
  const effectiveYear = Number(effective.slice(0, 4));
  const effectiveMonth = Number(effective.slice(5, 7));
  return FUND_LIST
    .filter((fund) => VERIFIED_FUND_IDS.includes(fund.id))
    .map((fund) => simulate({ fundId: fund.id as FundId, startYear: effectiveYear, startMonth: effectiveMonth, monthlyAmount }))
    .sort((a, b) => b.profit - a.profit)
    .map((result, i) => ({ rank: i + 1, fund: FUNDS[result.fundId as FundId], result }));
}

// ── フォーマット ────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 100_000_000) return `${sign}${(abs / 100_000_000).toFixed(1)}億円`;
  if (abs >= 10_000) return `${sign}${Math.floor(abs / 10_000).toLocaleString()}万円`;
  return `${sign}${abs.toLocaleString()}円`;
}

export function formatCurrencyFull(amount: number): string {
  return `${amount < 0 ? "-" : ""}${Math.abs(amount).toLocaleString()}円`;
}

export function calcElapsedMonths(startYear: number, startMonth: number): number {
  return (CURRENT_YEAR - startYear) * 12 + (CURRENT_MONTH - startMonth) + 1;
}

export function calcElapsedYears(startYear: number, startMonth: number): number {
  return Math.max(0, calcElapsedMonths(startYear, startMonth) / 12);
}

export function formatYearMonth(year: number, month: number): string {
  return `${year}年${month}月`;
}

// ── 定数 ────────────────────────────────────────────────────────────

export const START_YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 2014 }, (_, i) => 2015 + i);
export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
export const MONTHLY_AMOUNT_OPTIONS = [10000, 20000, 30000, 50000, 100000, 200000];
