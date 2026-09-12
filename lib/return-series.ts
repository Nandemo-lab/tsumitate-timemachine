import { FundId, ReturnCalculationMode, ReturnSeriesQuality } from "@/types";
import { FUNDS } from "@/lib/funds";
import { VT_MONTHLY_JPY_TOTAL_RETURNS } from "@/lib/verified-monthly-return-series";
import manifest from "@/data/verified/manifest.json";
import vti from "@/data/verified/vti-monthly.json";
import vym from "@/data/verified/vym-monthly.json";
import eem from "@/data/verified/eem-monthly.json";
import inda from "@/data/verified/inda-monthly.json";
import orcan from "@/data/verified/orcan-monthly.json";
import sp500 from "@/data/verified/sp500-monthly.json";
import nasdaq100 from "@/data/verified/nasdaq100-monthly.json";
import fangplus from "@/data/verified/fangplus-monthly.json";

export interface ReturnSeriesDefinition {
  fundId: FundId;
  formalProductName: string;
  identifier: string;
  manager: string;
  quality: ReturnSeriesQuality;
  calculationMode: ReturnCalculationMode;
  startMonth: string;
  endMonth: string;
  sourceName: string;
  sourceUrl: string;
  rawDataUrl?: string;
  retrievedAt: string;
  currency: string;
  returnType: string;
  priceBasis: string;
  dividendTreatment: string;
  feeTreatment: string;
  fxTreatment: string;
  inceptionDate: string;
  inceptionTreatment: string;
  missingValueTreatment: string;
  investmentTiming: string;
  seriesName: string;
}

type Ledger = { observations: Array<{ month: string; monthlyReturn: number }> };
type LedgerMetadata = Ledger & {
  formalProductName: string;
  identifier: string;
  manager: string;
  sourceName: string;
  sourceUrl: string;
  rawDataUrl: string;
  retrievedAt: string;
  currency: string;
  returnType: string;
  sourceSeriesDefinition: string;
  priceBasis: string;
  dividendTreatment: string;
  feeTreatment: string;
  fxTreatment: string;
  inceptionDate: string;
  inceptionTreatment: string;
  firstMonth: string;
  lastMonth: string;
};

const monthlyMaps: Partial<Record<FundId, ReadonlyMap<string, number>>> = {
  vt: new Map(Object.entries(VT_MONTHLY_JPY_TOTAL_RETURNS).map(([month, point]) => [month, point.jpyTotalReturn])),
  vti: toMap(vti),
  vym: toMap(vym),
  emerging: toMap(eem),
  india: toMap(inda),
  orcan: toMap(orcan),
  sp500: toMap(sp500),
  nasdaq100: toMap(nasdaq100),
  fangplus: toMap(fangplus),
};

function toMap(ledger: Ledger): ReadonlyMap<string, number> {
  return new Map(ledger.observations.map((point) => [point.month, point.monthlyReturn]));
}

function definitionFromLedger(fundId: FundId, ledger: LedgerMetadata): ReturnSeriesDefinition {
  return {
    fundId,
    formalProductName: ledger.formalProductName,
    identifier: ledger.identifier,
    manager: ledger.manager,
    quality: "A",
    calculationMode: "verified-monthly-jpy",
    startMonth: ledger.firstMonth,
    endMonth: ledger.lastMonth,
    sourceName: ledger.sourceName,
    sourceUrl: ledger.sourceUrl,
    rawDataUrl: ledger.rawDataUrl,
    retrievedAt: ledger.retrievedAt,
    currency: ledger.currency === "USD" ? "JPY（USD公式実績を円換算）" : ledger.currency,
    returnType: ledger.returnType,
    priceBasis: ledger.priceBasis,
    dividendTreatment: ledger.dividendTreatment,
    feeTreatment: ledger.feeTreatment,
    fxTreatment: ledger.fxTreatment,
    inceptionDate: ledger.inceptionDate,
    inceptionTreatment: ledger.inceptionTreatment,
    missingValueTreatment: "欠損時は補完・fallbackせず計算停止",
    investmentTiming: "毎月月初に積立後、前月末から当月末までの月次リターンを適用",
    seriesName: ledger.sourceSeriesDefinition,
  };
}

export const RETURN_SERIES_REGISTRY: Record<FundId, ReturnSeriesDefinition> = {
  vt: {
    fundId: "vt",
    formalProductName: "Vanguard Total World Stock ETF",
    identifier: "NYSE Arca: VT / CUSIP 922042742",
    manager: "The Vanguard Group",
    quality: "A",
    calculationMode: "verified-monthly-jpy",
    startMonth: "2015-01",
    endMonth: "2025-06",
    sourceName: "Vanguard Advisors",
    sourceUrl: "https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf",
    retrievedAt: "2026-08-21",
    currency: "JPY（USD公式実績を円換算）",
    returnType: "Total Return",
    priceBasis: "NAV",
    dividendTreatment: "分配金込み",
    feeTreatment: "ファンド費用控除後",
    fxTreatment: `日本銀行 ${manifest.fx.seriesCode} の月末USD/JPYで円換算`,
    inceptionDate: "2008-06-24",
    inceptionTreatment: "設定後の公式商品実績のみ（proxyなし）",
    missingValueTreatment: "欠損時は補完・fallbackせず計算停止",
    investmentTiming: "毎月月初に積立後、前月末から当月末までの月次リターンを適用",
    seriesName: "Vanguard公式 月次NAV Total Return",
  },
  vti: definitionFromLedger("vti", vti),
  vym: definitionFromLedger("vym", vym),
  emerging: definitionFromLedger("emerging", eem),
  india: definitionFromLedger("india", inda),
  orcan: definitionFromLedger("orcan", orcan),
  sp500: definitionFromLedger("sp500", sp500),
  nasdaq100: definitionFromLedger("nasdaq100", nasdaq100),
  fangplus: definitionFromLedger("fangplus", fangplus),
  schd: {
    fundId: "schd",
    formalProductName: "Schwab U.S. Dividend Equity ETF",
    identifier: "NYSE Arca: SCHD",
    manager: "Schwab Asset Management",
    quality: "G",
    calculationMode: "legacy-annual-reference",
    startMonth: "2015-01",
    endMonth: "2025-06",
    sourceName: "Schwab Asset Management（商品定義の一次情報）",
    sourceUrl: "https://www.schwabassetmanagement.com/products/schd",
    retrievedAt: "2026-09-12",
    currency: "未特定（現行参考系列）",
    returnType: "原典未検証",
    priceBasis: "原典未検証",
    dividendTreatment: "原典未検証",
    feeTreatment: "原典未検証",
    fxTreatment: "原典未検証",
    inceptionDate: "2011-10-20",
    inceptionTreatment: "商品設定後だが、月次原典の検証完了までG扱い",
    missingValueTreatment: "該当年の参考値がなければ計算停止",
    investmentTiming: "年次参考値を一定月次率へ換算する暫定モデル",
    seriesName: "原典未検証の年次参考系列",
  },
};

export class UnsupportedReturnPeriodError extends Error {
  constructor(public readonly fundId: FundId, public readonly month: string) {
    const definition = RETURN_SERIES_REGISTRY[fundId];
    super(`${definition.formalProductName}の利用可能期間は${definition.startMonth}〜${definition.endMonth}です（指定: ${month}）`);
    this.name = "UnsupportedReturnPeriodError";
  }
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function getReturnSeriesDefinition(fundId: FundId): ReturnSeriesDefinition {
  return RETURN_SERIES_REGISTRY[fundId];
}

export function isReturnMonthAvailable(fundId: FundId, year: number, month: number): boolean {
  const key = monthKey(year, month);
  const definition = RETURN_SERIES_REGISTRY[fundId];
  if (key < definition.startMonth || key > definition.endMonth) return false;
  if (definition.quality === "A") return monthlyMaps[fundId]?.has(key) === true;
  return FUNDS[fundId].annualReturns[year] !== undefined;
}

export function assertReturnMonthAvailable(fundId: FundId, year: number, month: number): void {
  if (!isReturnMonthAvailable(fundId, year, month)) throw new UnsupportedReturnPeriodError(fundId, monthKey(year, month));
}

export function getMonthlyJpyReturn(fundId: FundId, year: number, month: number): number {
  assertReturnMonthAvailable(fundId, year, month);
  const definition = RETURN_SERIES_REGISTRY[fundId];
  if (definition.quality === "A") return monthlyMaps[fundId]!.get(monthKey(year, month))!;
  const annual = FUNDS[fundId].annualReturns[year];
  if (annual === undefined) throw new UnsupportedReturnPeriodError(fundId, monthKey(year, month));
  return Math.pow(1 + annual, 1 / 12) - 1;
}

export function getAvailableStartMonth(fundId: FundId): string {
  return RETURN_SERIES_REGISTRY[fundId].startMonth;
}

export function getAvailableEndMonth(fundId: FundId): string {
  return RETURN_SERIES_REGISTRY[fundId].endMonth;
}

export function getCommonStartMonth(fundIds: FundId[]): string {
  return fundIds.map(getAvailableStartMonth).sort().at(-1)!;
}

export function getStartYearOptions(fundId: FundId): number[] {
  const startYear = Number(getAvailableStartMonth(fundId).slice(0, 4));
  const endYear = Number(getAvailableEndMonth(fundId).slice(0, 4));
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
}

export function getCommonStartOptions(fundIds: FundId[]): number[] {
  const startYear = Number(getCommonStartMonth(fundIds).slice(0, 4));
  return Array.from({ length: 2025 - startYear + 1 }, (_, index) => startYear + index);
}

export const VERIFIED_FUND_IDS = (Object.keys(RETURN_SERIES_REGISTRY) as FundId[])
  .filter((fundId) => RETURN_SERIES_REGISTRY[fundId].quality === "A");
