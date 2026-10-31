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

interface PendingEvent {
  name: string;
  params: object;
}

const pendingEvents: PendingEvent[] = [];
const QA_DEBUG_SESSION_KEY = "tm_qa_debug";

function isQaDebugSession() {
  if (typeof window === "undefined") return false;

  const qaFlag = new URLSearchParams(window.location.search).get("qa");
  try {
    if (qaFlag === "1") window.sessionStorage.setItem(QA_DEBUG_SESSION_KEY, "1");
    if (qaFlag === "0") window.sessionStorage.removeItem(QA_DEBUG_SESSION_KEY);
    return qaFlag === "1" || (qaFlag !== "0" && window.sessionStorage.getItem(QA_DEBUG_SESSION_KEY) === "1");
  } catch {
    return qaFlag === "1";
  }
}

function withQaDebugMarker(params: object) {
  if (typeof window === "undefined") return params;
  return isQaDebugSession() ? { ...params, debug_mode: true } : params;
}

function track(name: string, params: object) {
  if (typeof window === "undefined") return;
  if (window.location.hostname !== "tsumitate-timemachine.com") return;
  const eventParams = withQaDebugMarker(params);
  if (!Array.isArray(window.dataLayer)) {
    pendingEvents.push({ name, params: eventParams });
    return;
  }
  sendGAEvent("event", name, eventParams);
}

/** Googleタグ初期化前に起きた初回表示イベントを、安全に後送する。 */
export function flushPendingAnalytics() {
  if (typeof window === "undefined" || !Array.isArray(window.dataLayer)) return;
  for (const event of pendingEvents.splice(0)) {
    sendGAEvent("event", event.name, event.params);
  }
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
