import { FundId } from "@/types";

export type ReturnSeriesClassification = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface ReturnDataSource {
  classification: ReturnSeriesClassification;
  displayedProduct: string;
  storedSeries: string;
  identifier: string;
  sourceName: string;
  sourceUrl: string;
  sourceStatus: "verified" | "reference-candidate" | "unknown";
  currency: string;
  returnType: string;
  dividendTreatment: string;
  feeTreatment: string;
  fxTreatment: string;
  dataThrough: string;
  retrievedAt: string;
  notes: string;
}

const COMMON_UNKNOWN = {
  classification: "G" as const,
  sourceStatus: "reference-candidate" as const,
  currency: "未特定",
  returnType: "未特定（Price Return / Total Return の監査証跡なし）",
  dividendTreatment: "未特定",
  feeTreatment: "未特定",
  fxTreatment: "未特定",
  dataThrough: "2025-06（2025年値は通年値ではない）",
  retrievedAt: "2026-08-21",
};

/**
 * annualReturns の出典台帳。
 * sourceUrl は現行値との照合に使用する公式候補であり、sourceStatus が verified になるまで
 * 現行の各年値の直接根拠とは扱わない。値を推測で差し替えないこと。
 */
export const RETURN_DATA_SOURCES: Record<FundId, ReturnDataSource> = {
  orcan: {
    ...COMMON_UNKNOWN,
    displayedProduct: "eMAXIS Slim 全世界株式（オール・カントリー）",
    storedSeries: "全世界株式の年次参考系列（商品設定前を含む）",
    identifier: "0331418A / コード上のticker: vt.us",
    sourceName: "三菱UFJアセットマネジメント 商品ページ（照合候補）",
    sourceUrl: "https://emaxis.am.mufg.jp/fund/253425.html",
    notes: "商品は2018年設定。2015〜2017年を含むため商品基準価額実績ではない。VTと同じtickerだが値も一致せず、現行系列の原典は未特定。",
  },
  vt: {
    classification: "A",
    sourceStatus: "verified",
    currency: "USD",
    returnType: "ETF公式 Total return by NAV（税引前）",
    dividendTreatment: "Income returnを含む（分配金を含むTotal Return）",
    feeTreatment: "ファンド費用控除後",
    fxTreatment: "為替換算なし（USD）",
    dataThrough: "2025年（暦年）",
    retrievedAt: "2026-08-21",
    displayedProduct: "Vanguard Total World Stock ETF（VT）",
    storedSeries: "VT公式NAV Total Return",
    identifier: "NYSE Arca: VT / CUSIP 922042742",
    sourceName: "Vanguard VT product page（年次Total return by NAV）",
    sourceUrl: "https://investor.vanguard.com/investment-products/etfs/profile/vt",
    notes: "2015〜2025年を同一の公式年次表で照合済み。VTは2008年設定のため全収録年が設定後。円換算、売買手数料、税金は含まない。2025年6月までの画面では、2025年通年率を一定月次率へ換算した簡易モデルであり、実際の2025年上期実績ではない。",
  },
  sp500: {
    ...COMMON_UNKNOWN,
    displayedProduct: "eMAXIS Slim 米国株式（S&P500）",
    storedSeries: "S&P 500の年次参考系列（商品設定前を含む）",
    identifier: "03311187 / コード上のticker: ^spx",
    sourceName: "S&P Dow Jones Indices S&P 500（照合候補）",
    sourceUrl: "https://www.spglobal.com/spdji/en/indices/equity/sp-500/",
    notes: "商品は2018年設定。tickerは指数を示すが、Price/Total Return、USD/JPYの記録がなく商品実績ではない。",
  },
  vti: {
    ...COMMON_UNKNOWN,
    displayedProduct: "Vanguard Total Stock Market ETF（VTI）",
    storedSeries: "VTIの年次参考系列",
    identifier: "NYSE Arca: VTI / vti.us",
    sourceName: "Vanguard VTI product page（照合候補）",
    sourceUrl: "https://investor.vanguard.com/investment-products/etfs/profile/vti",
    notes: "市場価格・NAV・分配金再投資のどの系列かを示す記録がなく、公式値との年別照合未完了。",
  },
  vym: {
    ...COMMON_UNKNOWN,
    displayedProduct: "Vanguard High Dividend Yield ETF（VYM）",
    storedSeries: "VYMの年次参考系列",
    identifier: "NYSE Arca: VYM / vym.us",
    sourceName: "Vanguard VYM product page（照合候補）",
    sourceUrl: "https://investor.vanguard.com/investment-products/etfs/profile/vym",
    notes: "市場価格・NAV・分配金再投資のどの系列かを示す記録がなく、公式値との年別照合未完了。",
  },
  schd: {
    ...COMMON_UNKNOWN,
    displayedProduct: "楽天・高配当株式・米国ファンド（楽天SCHD）",
    storedSeries: "米国ETF SCHDの年次参考系列（国内投信設定前を含む）",
    identifier: "NYSE Arca: SCHD / schd.us",
    sourceName: "Schwab SCHD product page（照合候補）",
    sourceUrl: "https://www.schwabassetmanagement.com/products/schd",
    notes: "国内投信は2024年設定。全期間を国内投信の基準価額実績として扱えず、ETFの市場価格/NAV/配当処理も未特定。",
  },
  nasdaq100: {
    ...COMMON_UNKNOWN,
    displayedProduct: "iFreeNEXT NASDAQ100インデックス",
    storedSeries: "NASDAQ-100の年次参考系列（商品設定前を含む）",
    identifier: "04317188 / コード上のticker: ^ndx",
    sourceName: "Nasdaq-100 Index page（照合候補）",
    sourceUrl: "https://www.nasdaq.com/products/global-indexes/nasdaq-100",
    notes: "商品は2018年設定。指数のPrice/Total Return、USD/JPYの記録がなく、商品基準価額実績ではない。",
  },
  fangplus: {
    ...COMMON_UNKNOWN,
    displayedProduct: "iFreeNEXT FANG+インデックス",
    storedSeries: "NYSE FANG+の年次参考系列（商品設定前を含む）",
    identifier: "04311181 / コード上のticker: ^nyfang",
    sourceName: "ICE NYSE FANG+ Index page（照合候補）",
    sourceUrl: "https://www.ice.com/equity-derivatives/fangplus",
    notes: "商品は2018年設定。指数のPrice/Total Return、USD/JPYの記録がなく、商品基準価額実績ではない。",
  },
  india: {
    ...COMMON_UNKNOWN,
    displayedProduct: "iShares MSCI India ETF（INDA）",
    storedSeries: "INDAの年次参考系列",
    identifier: "Cboe BZX: INDA / inda.us",
    sourceName: "iShares INDA product page（照合候補）",
    sourceUrl: "https://www.ishares.com/us/products/239659/ishares-msci-india-etf",
    notes: "市場価格・NAV・分配金再投資のどの系列かを示す記録がなく、公式値との年別照合未完了。",
  },
  emerging: {
    ...COMMON_UNKNOWN,
    displayedProduct: "iShares MSCI Emerging Markets ETF（EEM）",
    storedSeries: "EEMの年次参考系列",
    identifier: "NYSE Arca: EEM / eem.us",
    sourceName: "iShares EEM product page（照合候補）",
    sourceUrl: "https://www.ishares.com/us/products/239637/ishares-msci-emerging-markets-etf",
    notes: "市場価格・NAV・分配金再投資のどの系列かを示す記録がなく、公式値との年別照合未完了。",
  },
};

export function getReturnDataSource(fundId: FundId): ReturnDataSource {
  return RETURN_DATA_SOURCES[fundId];
}
