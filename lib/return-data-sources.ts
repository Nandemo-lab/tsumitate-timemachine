import { FundId } from "@/types";
import { RETURN_SERIES_REGISTRY } from "@/lib/return-series";

export type ReturnSeriesClassification = "A" | "G";

export interface ReturnDataSource {
  classification: ReturnSeriesClassification;
  displayedProduct: string;
  storedSeries: string;
  identifier: string;
  sourceName: string;
  sourceUrl: string;
  rawDataUrl?: string;
  fxSourceName?: string;
  fxSourceUrl?: string;
  sourceStatus: "verified" | "reference-candidate";
  currency: string;
  returnType: string;
  priceBasis: string;
  dividendTreatment: string;
  feeTreatment: string;
  fxTreatment: string;
  dataThrough: string;
  retrievedAt: string;
  notes: string;
  granularity: string;
  calculationMethod: string;
  investmentTiming: string;
  missingValueTreatment: string;
  manager: string;
  inceptionDate: string;
  startMonth: string;
  endMonth: string;
}

export const RETURN_DATA_SOURCES = Object.fromEntries(
  (Object.keys(RETURN_SERIES_REGISTRY) as FundId[]).map((fundId) => {
    const definition = RETURN_SERIES_REGISTRY[fundId];
    const verified = definition.quality === "A";
    return [fundId, {
      classification: definition.quality,
      displayedProduct: definition.formalProductName,
      storedSeries: definition.seriesName,
      identifier: definition.identifier,
      sourceName: definition.sourceName,
      sourceUrl: definition.sourceUrl,
      rawDataUrl: definition.rawDataUrl,
      fxSourceName: definition.fxTreatment.includes("日本銀行") || definition.currency.startsWith("JPY（USD") ? "日本銀行 USD/JPY" : undefined,
      fxSourceUrl: definition.fxTreatment.includes("日本銀行") || definition.currency.startsWith("JPY（USD") ? "https://www.stat-search.boj.or.jp/ssi/mtshtml/fm08_m_1_en.html" : undefined,
      sourceStatus: verified ? "verified" : "reference-candidate",
      currency: definition.currency,
      returnType: definition.returnType,
      priceBasis: definition.priceBasis,
      dividendTreatment: definition.dividendTreatment,
      feeTreatment: definition.feeTreatment,
      fxTreatment: definition.fxTreatment,
      dataThrough: definition.endMonth,
      retrievedAt: definition.retrievedAt,
      notes: verified
        ? `${definition.inceptionTreatment}。${definition.missingValueTreatment}。`
        : "米国ETF SCHDの商品定義のみ確認済み。月次リターンの原典検証完了までは参考系列として扱います。楽天SCHDとは別商品です。",
      granularity: `${definition.startMonth}〜${definition.endMonth}の月次データ`,
      calculationMethod: verified ? "検証済み月次リターンを月ごとに適用" : "年次参考値を一定月次率へ換算",
      investmentTiming: definition.investmentTiming,
      missingValueTreatment: definition.missingValueTreatment,
      manager: definition.manager,
      inceptionDate: definition.inceptionDate,
      startMonth: definition.startMonth,
      endMonth: definition.endMonth,
    } satisfies ReturnDataSource];
  }),
) as Record<FundId, ReturnDataSource>;

export function getReturnDataSource(fundId: FundId): ReturnDataSource {
  return RETURN_DATA_SOURCES[fundId];
}
