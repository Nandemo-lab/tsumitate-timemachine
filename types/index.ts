export type FundId =
  | "orcan" | "vt"
  | "sp500" | "vti"
  | "vym" | "schd"
  | "nasdaq100" | "fangplus"
  | "india" | "emerging";

export type FundCategory = "global" | "us" | "dividend" | "hightech" | "emerging";

export interface FundCategoryMeta {
  id: FundCategory;
  label: string;
  emoji: string;
  description: string;
}

export interface FundEncyclopediaData {
  nickname: string;               // 通称（オルカン）
  formalName: string;             // 正式名称
  catchCopy: string;              // キャッチコピー
  forWhom: string;                // こんな人向け
  features: string[];             // 特徴タグ
  pros: string[];                 // メリット
  cons: string[];                 // デメリット・注意点
  managementFee: string;          // 信託報酬
  beginnerScore: 1 | 2 | 3 | 4 | 5;  // 初心者向け度
  volatility: "低" | "中" | "高" | "非常に高";
  expectedHorizon: string;        // 推奨投資期間
  nisaSupport: {
    tsumitate: boolean; // つみたて投資枠
    growth: boolean;    // 成長投資枠
  };
}

export interface Fund {
  id: FundId;
  name: string;            // 表示名（正式名称 or 通称）
  shortName: string;       // 短縮名（グラフ・ボタン用）
  ticker: string;
  color: string;
  category: FundCategory;
  description: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  /** 構成銘柄数の表示用文字列（例: "約3,000銘柄"）。記事・比較ページはここを唯一の参照元とする */
  shareCount: string;
  annualReturns: Record<number, number>;
  encyclopedia: FundEncyclopediaData;
}

// ── シミュレーション ────────────────────────────────────────────────

export interface SimulationParams {
  fundId: FundId;
  startYear: number;
  startMonth: number;
  monthlyAmount: number;
}

export interface MonthlyDataPoint {
  date: string;
  principal: number;
  value: number;
  profit: number;
  month: number;
}

export interface SimulationResult {
  fundId: FundId;
  fundName: string;
  fundColor: string;
  totalPrincipal: number;
  finalValue: number;
  profit: number;
  returnRate: number;
  dataPoints: MonthlyDataPoint[];
  monthsElapsed: number;
  startYear: number;
  startMonth: number;
  monthlyAmount: number;
}

export interface RankingItem {
  rank: number;
  fund: Fund;
  result: SimulationResult;
}

// ── 詳細シミュレーション（タイムライン型） ──────────────────────────

export type EventType =
  | "start"          // 積立開始
  | "change_amount"  // 積立額変更
  | "add_fund"       // 銘柄追加
  | "lump_sum"       // 一括投資
  | "bonus"          // ボーナス投資
  | "stop";          // 積立停止

export interface InvestmentEvent {
  id: string;
  type: EventType;
  year: number;
  month: number;
  fundId?: FundId;
  monthlyAmount?: number;   // start / change_amount
  lumpAmount?: number;      // lump_sum
  bonusMonths?: number[];   // bonus投資の月（例: [6, 12]）
  bonusAmount?: number;     // ボーナス1回あたりの金額
  label?: string;
}

export interface AdvancedSimulationResult {
  events: InvestmentEvent[];
  totalPrincipal: number;
  finalValue: number;
  profit: number;
  returnRate: number;
  monthlyDataPoints: AdvancedDataPoint[];
}

export interface AdvancedDataPoint {
  date: string;
  year: number;
  month: number;
  principal: number;
  value: number;
  profit: number;
  breakdown: Record<FundId, number>; // per-fund value
}
