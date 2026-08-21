export interface VerifiedAnnualReturnPoint {
  value: number;
  fundId: "vt";
  displayedProduct: string;
  seriesName: string;
  identifier: string;
  year: number;
  currency: "USD";
  returnType: "total-return";
  priceBasis: "nav";
  dividendTreatment: "income included";
  feeTreatment: "net of fund expenses";
  fxTreatment: "none";
  inceptionStatus: "post-inception";
  asOf: string;
  sourceUrl: string;
  retrievedAt: string;
  notes: string;
}

const VT_SOURCE_URL = "https://investor.vanguard.com/investment-products/etfs/profile/vt";

const vtValues = {
  2015: -0.0188,
  2016: 0.0877,
  2017: 0.2419,
  2018: -0.0967,
  2019: 0.2680,
  2020: 0.1674,
  2021: 0.1825,
  2022: -0.1800,
  2023: 0.2190,
  2024: 0.1648,
  2025: 0.2244,
} as const;

/** Vanguard公式の暦年「Total return by NAV」表を値ごとに追跡する台帳。 */
export const VT_VERIFIED_ANNUAL_RETURNS: Record<number, VerifiedAnnualReturnPoint> =
  Object.fromEntries(
    Object.entries(vtValues).map(([year, value]) => [
      Number(year),
      {
        value,
        fundId: "vt",
        displayedProduct: "Vanguard Total World Stock ETF（VT）",
        seriesName: "VT Total return by NAV",
        identifier: "NYSE Arca: VT / CUSIP 922042742",
        year: Number(year),
        currency: "USD",
        returnType: "total-return",
        priceBasis: "nav",
        dividendTreatment: "income included",
        feeTreatment: "net of fund expenses",
        fxTreatment: "none",
        inceptionStatus: "post-inception",
        asOf: `${year}-12-31`,
        sourceUrl: VT_SOURCE_URL,
        retrievedAt: "2026-08-21",
        notes: "公式年次表のCapital returnとIncome returnを合算したTotal return by NAV。税引前。",
      },
    ]),
  );

export const VT_ANNUAL_RETURNS: Record<number, number> = Object.fromEntries(
  Object.entries(VT_VERIFIED_ANNUAL_RETURNS).map(([year, point]) => [Number(year), point.value]),
);
