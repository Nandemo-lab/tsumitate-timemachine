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

export type EditorialContentType = "article" | "guide";

interface EditorialEventParams {
  content_type: EditorialContentType;
  content_id: string;
}

function track(name: string, params: object) {
  if (typeof window === "undefined") return;
  if (window.location.hostname !== "tsumitate-timemachine.com") return;
  sendGAEvent("event", name, params);
}

/** シミュレーション実行（単体/ランキング/比較/クイックシナリオ） */
export function trackCalculate(params: CalculateParams) {
  // Keep caller compatibility, but never forward input conditions or results.
  const mode = params.mode;
  if (mode !== "single" && mode !== "ranking" && mode !== "compare" && mode !== "quick_scenario") return;
  const eventParams = { mode };
  track("calculate", eventParams);
  track(mode === "compare" ? "compare_complete" : "simulation_complete", eventParams);
}

/** シェアボタン押下（X共有・ネイティブ共有・URLコピー） */
export function trackShareClick(params: ShareClickParams) {
  track("share_click", params);
}

/** 共有処理が完了した場合だけ送信する。 */
export function trackShareSuccess(params: ShareClickParams) {
  track("share", params);
}

/** 「他の銘柄と比較する」導線タップ */
export function trackCompareClick(params: CompareClickParams) {
  track("compare_click", params);
}

/** データ出典を実際に開いた時だけ送信する。自由入力やURLは送らない。 */
export function trackSourceView(surface: string) {
  track("source_view", { surface });
}

/** 入力条件を初めて変更した時点。呼び出し側で1画面1回に制御する。 */
export function trackSimulationStart(mode: "single" | "ranking" | "compare", surface: string) {
  track(mode === "compare" ? "compare_start" : "simulation_start", { mode, surface });
}

/** 保存済み条件がある端末での再訪。条件や計算結果は送信しない。 */
export function trackReturnVisit(surface: string) {
  track("return_visit", { surface });
}

/** 記事本文が表示された時。タイトル・URL・自由入力は送らない。 */
export function trackArticleView(params: EditorialEventParams) {
  track("article_view", params);
}

/** 記事末尾の観測点が画面に入った時。読了や満足を意味するイベントではない。 */
export function trackArticleEndReached(params: EditorialEventParams) {
  track("article_end_reached", params);
}

/** 読後導線から別の記事・ガイドを実際に開いた時。 */
export function trackRelatedArticleClick(params: EditorialEventParams & { destination_type: "article" | "guide" | "other" }) {
  track("related_article_click", params);
}

/** 記事本文または読後CTAからシミュレーションへ進んだ時。 */
export function trackArticleToSimulation(params: EditorialEventParams & { destination_type: "home" | "compare" }) {
  track("article_to_simulation", params);
}
