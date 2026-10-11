import { FundId } from "@/types";
import { formatAnnualReturn } from "@/lib/funds";

export interface YearPageFaq {
  q: string;
  a: string;
}

export interface YearPage {
  fundSlug: string;   // URL slug: "orukan" | "sp500" | "nasdaq100"
  fundId: FundId;
  year: number;
  metaTitle: string;
  metaDescription: string;
  yearContext: string; // 年の市場背景解説
  simMonth: number;
  simAmount: number;
  faqs: YearPageFaq[]; // 年固有でないもの（数値を含むFAQは page.tsx で動的生成）
  relatedCompareSlugs: string[];
  relatedFundSlugs: string[]; // → /fund/[slug]
  otherYears: number[];       // 同銘柄の他年度
}

// ── 銘柄固有設定 ──────────────────────────────────────────────────────

interface FundYearConfig {
  fundId: FundId;
  relatedCompareSlugs: string[];
  relatedFundSlugs: string[];

}

const FUND_YEAR_CONFIG: Record<string, FundYearConfig> = {
  orukan: {
    fundId: "orcan",
    relatedCompareSlugs: ["orukan-vs-sp500", "vti-vs-orukan"],
    relatedFundSlugs: ["sp500", "vti"],
  },

  sp500: {
    fundId: "sp500",
    relatedCompareSlugs: ["orukan-vs-sp500", "sp500-vs-nasdaq100"],
    relatedFundSlugs: ["orukan", "nasdaq100"],
  },

  nasdaq100: {
    fundId: "nasdaq100",
    relatedCompareSlugs: ["sp500-vs-nasdaq100", "nasdaq100-vs-fangplus"],
    relatedFundSlugs: ["sp500", "fangplus"],
  },

  vti: {
    fundId: "vti",
    relatedCompareSlugs: ["vti-vs-orukan", "vti-vs-sp500"],
    relatedFundSlugs: ["sp500", "orukan"],
  },
};

const FUND_DISPLAY_NAMES: Record<string, string> = {
  orukan: "オルカン",
  sp500: "S&P500",
  nasdaq100: "NASDAQ100",
  vti: "VTI",
};

const YEARS = [2020, 2021, 2022, 2023, 2024];

// ── フラット配列の生成 ────────────────────────────────────────────────

const YEAR_LABEL: Record<number, string> = {
  2020: "コロナ直後",
  2021: "コロナ回復相場",
  2022: "暴落スタート",
  2023: "AIブーム",
  2024: "新NISA元年",
};

const YEAR_DESC_PREFIX: Record<number, string> = {
  2020: "コロナショック直後の",
  2021: "コロナ後の回復相場が続いた",
  2022: "株価暴落が続いた",
  2023: "生成AIブームに沸いた",
  2024: "新NISA元年の",
};

export const YEAR_PAGES: YearPage[] = Object.entries(FUND_YEAR_CONFIG).flatMap(
  ([fundSlug, config]) =>
    YEARS.map((year) => {
      const fundName = FUND_DISPLAY_NAMES[fundSlug];
      const label = YEAR_LABEL[year] ?? String(year);
      const prefix = YEAR_DESC_PREFIX[year] ?? `${year}年から`;
      return {
        fundSlug,
        fundId: config.fundId,
        year,
        metaTitle: `${year}年（${label}）から${fundName}積立→今いくら？過去実績シミュレーション`,
        metaDescription: `${prefix}${year}年から2026年8月まで${fundName}を月3万円積み立てた場合の期間末評価額・利益・リターンを、検証済み月次データで公開。`,
        yearContext: `${year}年1月から2026年8月まで、商品設定後の円ベース・分配金再投資込み月次系列を使って積立経過を計算します。単年の市場解説、日中最大下落率、将来の回復予測とは別の検証です。`,
        simMonth: 1,
        simAmount: 30000,
        faqs: [
          { q: `${year}年の${fundName}の暦年リターンは？`, a: `円ベース・分配金再投資込みの暦年リターンは${formatAnnualReturn(config.fundId, year)}です。暦年リターンは、このページの毎月積立の累積結果や最大下落率とは別の指標です。` },
          { q: `${year}年からの積立結果は将来の成果を示しますか？`, a: "いいえ。収録済み月次データへ一定の計算条件を適用した過去結果です。購入の適否、今後の回復、将来の利益を示すものではありません。" },
          { q: "この計算で含まれないものは？", a: "売買手数料、税金、実際の約定価格、為替スプレッドは個別計算していません。商品設定前や欠損月を別系列で補完していません。" },
        ],
        relatedCompareSlugs: config.relatedCompareSlugs,
        relatedFundSlugs: config.relatedFundSlugs,
        otherYears: YEARS.filter((y) => y !== year),
      };
    })
);

export const YEAR_PAGE_MAP = new Map(
  YEAR_PAGES.map((p) => [`${p.fundSlug}/${p.year}`, p])
);

export function getYearPage(fundSlug: string, year: string | number): YearPage | undefined {
  return YEAR_PAGE_MAP.get(`${fundSlug}/${year}`);
}
