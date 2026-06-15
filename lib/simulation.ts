import {
  SimulationParams, SimulationResult, MonthlyDataPoint,
  RankingItem, FundId, InvestmentEvent, AdvancedSimulationResult, AdvancedDataPoint
} from "@/types";
import { FUNDS, FUND_LIST } from "./funds";

export const CURRENT_YEAR = 2025;
export const CURRENT_MONTH = 6;
export const DATA_SOURCE = "過去の実績データ（各指数・投資信託の運用報告書をもとに推計）";
export const DATA_UPDATED = "2025年6月";

function getMonthlyReturn(annualReturns: Record<number, number>, year: number): number {
  const annual = annualReturns[year] ?? annualReturns[CURRENT_YEAR] ?? 0.10;
  return Math.pow(1 + annual, 1 / 12) - 1;
}

// ── 通常シミュレーション ─────────────────────────────────────────────

export function simulate(params: SimulationParams): SimulationResult {
  const { fundId, startYear, startMonth, monthlyAmount } = params;
  const fund = FUNDS[fundId];
  const dataPoints: MonthlyDataPoint[] = [];

  let totalPrincipal = 0;
  let currentValue = 0;
  let monthIndex = 0;
  let year = startYear;
  let month = startMonth;

  while (year < CURRENT_YEAR || (year === CURRENT_YEAR && month <= CURRENT_MONTH)) {
    totalPrincipal += monthlyAmount;
    currentValue += monthlyAmount;
    currentValue *= 1 + getMonthlyReturn(fund.annualReturns, year);

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

  // Per-fund state: { value, monthlyAmount }
  const fundStates = new Map<FundId, { value: number; monthlyAmount: number }>();
  let totalPrincipal = 0;
  const monthlyDataPoints: AdvancedDataPoint[] = [];

  let year = sorted[0].year;
  let month = sorted[0].month;

  while (year < CURRENT_YEAR || (year === CURRENT_YEAR && month <= CURRENT_MONTH)) {
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
        state.value *= 1 + getMonthlyReturn(fund.annualReturns, year);
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
  return FUND_LIST
    .map((fund) => simulate({ fundId: fund.id as FundId, startYear, startMonth, monthlyAmount }))
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
