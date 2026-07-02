import { sendGAEvent } from "@next/third-parties/google";

type CalculateMode = "single" | "ranking" | "compare" | "quick_scenario";

interface CalculateParams {
  mode: CalculateMode;
  fund_id?: string;
  start_year: number;
  monthly_amount: number;
}

interface ShareClickParams {
  method: "x" | "native" | "copy";
  context: "single" | "compare";
}

interface CompareClickParams {
  fund_id: string;
}

function track(name: string, params: object) {
  if (typeof window === "undefined") return;
  sendGAEvent("event", name, params);
}

/** シミュレーション実行（単体/ランキング/比較/クイックシナリオ） */
export function trackCalculate(params: CalculateParams) {
  track("calculate", params);
}

/** シェアボタン押下（X共有・ネイティブ共有・URLコピー） */
export function trackShareClick(params: ShareClickParams) {
  track("share_click", params);
}

/** 「他の銘柄と比較する」導線タップ */
export function trackCompareClick(params: CompareClickParams) {
  track("compare_click", params);
}
