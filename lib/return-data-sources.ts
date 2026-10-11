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

const READER_LABELS: Record<string, string> = {
  "total-return": "配当・分配金を含む総合リターン",
  NAV: "基準価額（NAV）",
  included: "配当・分配金を含む",
  "dividends and capital gains reinvested": "配当・分配金と売却益を再投資",
  reinvested: "分配金を再投資",
  "net of fund expenses": "ファンド内部の運用費用控除後",
  "fund expenses deducted": "ファンド内部の運用費用控除後",
  "reflected in NAV": "信託報酬を基準価額へ反映済み",
  "converted with BOJ month-end USD/JPY": "日本銀行の月末USD/JPYで円換算",
  none: "追加の為替換算なし",
  "product observations only; no pre-inception backfill": "商品設定後の観測値だけを使用し、設定前は補完しない",
  "No interpolation or fallback.": "欠損値を補間せず、別系列でも補わない",
  "欠損時は補完・fallbackせず計算停止": "欠損時は補完せず、別系列でも補わず計算停止",
  "Monthly NAV Total Return (1MTH)": "月次の配当込み基準価額リターン",
  "Growth of Hypothetical $10,000, NAV total return": "1万米ドルを基準にした配当込み基準価額の推移",
};

function toReaderLabel(value: string): string {
  return READER_LABELS[value] ?? value;
}

export const RETURN_DATA_SOURCES = Object.fromEntries(
  (Object.keys(RETURN_SERIES_REGISTRY) as FundId[]).map((fundId) => {
    const definition = RETURN_SERIES_REGISTRY[fundId];
    const verified = definition.quality === "A";
    return [fundId, {
      classification: definition.quality,
      displayedProduct: definition.formalProductName,
      storedSeries: toReaderLabel(definition.seriesName),
      identifier: definition.identifier,
      sourceName: definition.sourceName,
      sourceUrl: definition.sourceUrl,
      rawDataUrl: definition.rawDataUrl,
      fxSourceName: definition.fxTreatment.includes("日本銀行") || definition.currency.startsWith("JPY（USD") ? "日本銀行 USD/JPY" : undefined,
      fxSourceUrl: definition.fxTreatment.includes("日本銀行") || definition.currency.startsWith("JPY（USD") ? "https://www.stat-search.boj.or.jp/ssi/mtshtml/fm08_m_1_en.html" : undefined,
      sourceStatus: verified ? "verified" : "reference-candidate",
      currency: definition.currency,
      returnType: toReaderLabel(definition.returnType),
      priceBasis: toReaderLabel(definition.priceBasis),
      dividendTreatment: toReaderLabel(definition.dividendTreatment),
      feeTreatment: toReaderLabel(definition.feeTreatment),
      fxTreatment: toReaderLabel(definition.fxTreatment),
      dataThrough: verified ? definition.endMonth : "原典検証待ち（公開計算の対象外）",
      retrievedAt: definition.retrievedAt,
      notes: verified
        ? `${toReaderLabel(definition.inceptionTreatment)}。${toReaderLabel(definition.missingValueTreatment)}。`
        : "米国ETF SCHDの商品定義のみ確認済み。月次リターンの原典検証完了までは参考系列として扱います。楽天SCHDとは別商品です。",
      granularity: verified ? `${definition.startMonth}〜${definition.endMonth}の月次データ` : "検証済み月次系列なし",
      calculationMethod: verified ? "検証済み月次リターンを月ごとに適用" : "原典未検証の参考値は公開シミュレーションに使用しない",
      investmentTiming: verified ? toReaderLabel(definition.investmentTiming) : "公開シミュレーションには使用しない",
      missingValueTreatment: toReaderLabel(definition.missingValueTreatment),
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
