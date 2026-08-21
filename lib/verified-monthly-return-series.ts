export interface VerifiedMonthlyReturnPoint {
  month: string;
  usdNavTotalReturn: number;
  previousMonthEndYenPerUsd: number;
  monthEndYenPerUsd: number;
  jpyTotalReturn: number;
  vtSourceUrl: string;
  fxSourceUrl: string;
  retrievedAt: string;
}

const VT_SOURCE_URL = "https://advisors.vanguard.com/investments/products/vt/vanguard-total-world-stock-etf";
const BOJ_FX_SOURCE_URL = "https://www.stat-search.boj.or.jp/ssi/mtshtml/fm08_m_1_en.html";

// Vanguard公式画面の Month-end / VT (NAV)。表示精度は小数点以下2桁（%）。
const VT_MONTHLY_USD_NAV_TOTAL_RETURNS = [
  -0.0138,0.0567,-0.0131,0.0273,0.0024,-0.0222,0.0047,-0.0663,-0.0339,0.0711,-0.0035,-0.0206,
  -0.0563,-0.0103,0.0757,0.0139,0.0050,-0.0033,0.0416,0.0045,0.0076,-0.0197,0.0121,0.0195,
  0.0292,0.0267,0.0137,0.0158,0.0198,0.0067,0.0265,0.0045,0.0208,0.0207,0.0195,0.0150,
  0.0549,-0.0439,-0.0138,0.0054,0.0050,-0.0063,0.0296,0.0080,0.0025,-0.0778,0.0166,-0.0728,
  0.0815,0.0270,0.0118,0.0344,-0.0602,0.0647,-0.0004,-0.0211,0.0218,0.0273,0.0256,0.0349,
  -0.0151,-0.0754,-0.1465,0.1095,0.0515,0.0312,0.0505,0.0599,-0.0297,-0.0219,0.1250,0.0503,
  -0.0039,0.0274,0.0273,0.0418,0.0158,0.0119,0.0055,0.0237,-0.0410,0.0508,-0.0267,0.0403,
  -0.0465,-0.0276,0.0178,-0.0793,0.0050,-0.0835,0.0704,-0.0392,-0.0956,0.0626,0.0842,-0.0439,
  0.0753,-0.0310,0.0275,0.0137,-0.0115,0.0583,0.0368,-0.0287,-0.0418,-0.0296,0.0904,0.0515,
  0.0001,0.0452,0.0315,-0.0357,0.0448,0.0162,0.0212,0.0232,0.0223,-0.0226,0.0407,-0.0287,
  0.0325,-0.0054,-0.0363,0.0079,0.0571,0.0463,
] as const;

// 日本銀行 FM08'FXERM06「月末17時、1米ドル当たり円」。先頭は2014年12月。
const BOJ_MONTH_END_YEN_PER_USD = [
  119.8,117.9,119.29,120.21,118.91,123.75,122.25,124.22,121.19,120.03,120.74,122.83,120.42,
  120.63,112.99,112.43,108.4,111.14,102.7,103.63,103.28,100.9,104.92,112.73,117.11,
  113.53,112.31,111.8,111.29,110.96,112.06,110.63,110.49,112.46,113.09,112.29,112.65,
  108.7,107.08,106.19,109.4,108.77,110.64,111.4,110.81,113.44,113.2,113.47,
  110.4,108.73,110.76,110.75,111.68,108.78,107.64,108.56,106.52,107.86,108.61,109.5,109.15,
  109.04,108.84,108.42,106.6,107.21,107.73,104.45,105.83,105.62,104.36,104.03,103.33,104.55,
  106.09,110.74,108.89,109.72,110.55,109.53,109.82,111.88,113.61,113.19,115.12,115.43,115.5,
  121.64,130.6,127.76,136.2,132.78,138.6,144.32,148.01,138.53,132.14,130.15,136.76,
  133.13,135.73,139.75,144.85,142.18,145.91,148.77,150.29,147.06,141.4,147.66,149.68,
  151.34,156.86,157.15,160.93,150.91,144.94,142.38,152.25,149.99,157.89,154.66,150.44,
  149.14,142.81,144.04,144.13,
] as const;

function monthKeys(startYear: number, startMonth: number, count: number): string[] {
  return Array.from({ length: count }, (_, index) => {
    const serial = startYear * 12 + startMonth - 1 + index;
    return `${Math.floor(serial / 12)}-${String((serial % 12) + 1).padStart(2, "0")}`;
  });
}

if (VT_MONTHLY_USD_NAV_TOTAL_RETURNS.length !== 126 || BOJ_MONTH_END_YEN_PER_USD.length !== 127) {
  throw new Error("VT monthly return ledger length mismatch");
}

export const VT_MONTHLY_JPY_TOTAL_RETURNS: Record<string, VerifiedMonthlyReturnPoint> = Object.fromEntries(
  monthKeys(2015, 1, 126).map((month, index) => {
    const usdNavTotalReturn = VT_MONTHLY_USD_NAV_TOTAL_RETURNS[index];
    const previousMonthEndYenPerUsd = BOJ_MONTH_END_YEN_PER_USD[index];
    const monthEndYenPerUsd = BOJ_MONTH_END_YEN_PER_USD[index + 1];
    const jpyTotalReturn = (1 + usdNavTotalReturn) * (monthEndYenPerUsd / previousMonthEndYenPerUsd) - 1;
    return [month, {
      month,
      usdNavTotalReturn,
      previousMonthEndYenPerUsd,
      monthEndYenPerUsd,
      jpyTotalReturn,
      vtSourceUrl: VT_SOURCE_URL,
      fxSourceUrl: BOJ_FX_SOURCE_URL,
      retrievedAt: "2026-08-21",
    }];
  }),
);

export function getVerifiedVtMonthlyJpyReturn(year: number, month: number): number | undefined {
  return VT_MONTHLY_JPY_TOTAL_RETURNS[`${year}-${String(month).padStart(2, "0")}`]?.jpyTotalReturn;
}
