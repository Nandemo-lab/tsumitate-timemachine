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
      dataThrough: verified ? definition.endMonth : "原典検証待ち（公開計算の対象外）",
      retrievedAt: definition.retrievedAt,
      notes: verified
        ? `${definition.inceptionTreatment}。${definition.missingValueTreatment}。`
        : "米国ETF SCHDの商品定義のみ確認済み。月次リターンの原典検証完了までは参考系列として扱います。楽天SCHDとは別商品です。",
      granularity: verified ? `${definition.startMonth}〜${definition.endMonth}の月次データ` : "検証済み月次系列なし",
      calculationMethod: verified ? "検証済み月次リターンを月ごとに適用" : "原典未検証の参考値は公開シミュレーションに使用しない",
      investmentTiming: verified ? definition.investmentTiming : "公開シミュレーションには使用しない",
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
