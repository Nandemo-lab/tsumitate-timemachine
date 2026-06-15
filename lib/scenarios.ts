import { FundId } from "@/types";
import { simulate, formatCurrency } from "./simulation";

export interface QuickScenario {
  id: string;
  label: string;
  emoji: string;
  fundId: FundId;
  startYear: number;
  startMonth: number;
  monthlyAmount: number;
  description: string;
  tag?: string;
}

export const QUICK_SCENARIOS: QuickScenario[] = [
  {
    id: "covid-sp500",
    label: "コロナショック直後に",
    emoji: "💉",
    fundId: "sp500",
    startYear: 2020, startMonth: 4,
    monthlyAmount: 30000,
    description: "2020年4月・S&P500・月3万円",
    tag: "人気No.1",
  },
  {
    id: "nisa-2024",
    label: "新NISA開始月に",
    emoji: "🎌",
    fundId: "sp500",
    startYear: 2024, startMonth: 1,
    monthlyAmount: 50000,
    description: "2024年1月・S&P500・月5万円",
    tag: "新NISA",
  },
  {
    id: "nasdaq-2020",
    label: "テック全盛期に",
    emoji: "💻",
    fundId: "nasdaq100",
    startYear: 2020, startMonth: 1,
    monthlyAmount: 30000,
    description: "2020年1月・NASDAQ100・月3万円",
    tag: "ハイリターン",
  },
  {
    id: "orcan-10yr",
    label: "10年前にオルカンを",
    emoji: "🌍",
    fundId: "orcan",
    startYear: 2015, startMonth: 1,
    monthlyAmount: 30000,
    description: "2015年1月・オルカン・月3万円",
    tag: "10年積立",
  },
  {
    id: "fang-2019",
    label: "FANG+で攻めていたら",
    emoji: "🚀",
    fundId: "fangplus",
    startYear: 2019, startMonth: 1,
    monthlyAmount: 50000,
    description: "2019年1月・FANG+・月5万円",
    tag: "高リスク",
  },
  {
    id: "india-5yr",
    label: "インド株ブームに乗って",
    emoji: "🇮🇳",
    fundId: "india",
    startYear: 2020, startMonth: 1,
    monthlyAmount: 30000,
    description: "2020年1月・インド株・月3万円",
    tag: "新興国",
  },
];

// 各シナリオの計算済み結果（ビルド時に一度だけ計算）
export function getScenarioResults() {
  return QUICK_SCENARIOS.map((s) => ({
    scenario: s,
    result: simulate({
      fundId: s.fundId,
      startYear: s.startYear,
      startMonth: s.startMonth,
      monthlyAmount: s.monthlyAmount,
    }),
  }));
}

// SEO用: 全組み合わせのスタティックパスを生成
export function getStaticSimPaths() {
  const fundIds: FundId[] = ["sp500", "orcan", "nasdaq100", "fangplus", "vti", "vym", "schd", "india"];
  const years = [2015, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const amounts = [30000, 50000, 100000];

  const paths = [];
  for (const fundId of fundIds) {
    for (const year of years) {
      for (const amount of amounts) {
        paths.push({ fundId, startYear: year, monthlyAmount: amount });
      }
    }
  }
  return paths;
}

export function getScenarioSummary(scenario: QuickScenario): string {
  const result = simulate({
    fundId: scenario.fundId,
    startYear: scenario.startYear,
    startMonth: scenario.startMonth,
    monthlyAmount: scenario.monthlyAmount,
  });
  return `利益 +${formatCurrency(result.profit)}（${result.returnRate.toFixed(1)}%）`;
}
