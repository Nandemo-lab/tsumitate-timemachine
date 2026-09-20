/**
 * OGP用比較ラベルの判定。表示用に丸めた文字列ではなく、simulate() が返す
 * 丸め前比較値（円単位のfinalValue）を使う。
 *
 * @param {{
 *   a: import("./../types/index").SimulationResult | null,
 *   b: import("./../types/index").SimulationResult | null,
 *   qualityA: import("./../types/index").ReturnSeriesQuality,
 *   qualityB: import("./../types/index").ReturnSeriesQuality,
 * }} input
 */
export function getOgComparisonState({ a, b, qualityA, qualityB }) {
  if (!a || !b) {
    return { kind: "unavailable", labelA: null, labelB: null, note: "比較期間を計算できない系列があります" };
  }

  const sameConditions =
    a.startYear === b.startYear &&
    a.startMonth === b.startMonth &&
    a.monthlyAmount === b.monthlyAmount &&
    a.monthsElapsed === b.monthsElapsed &&
    a.totalPrincipal === b.totalPrincipal;

  if (!sameConditions) {
    return { kind: "unavailable", labelA: null, labelB: null, note: "比較条件が一致しないため順位を表示しません" };
  }

  if (qualityA !== "A" || qualityB !== "A") {
    return { kind: "reference", labelA: null, labelB: null, note: "参考比較・品質差あり（G系列を含む）" };
  }

  if (a.finalValue === b.finalValue) {
    return { kind: "equal", labelA: "同額", labelB: "同額", note: "同じ条件で最終評価額が同額" };
  }

  return a.finalValue > b.finalValue
    ? { kind: "higher-a", labelA: "この条件で評価額が高い", labelB: null, note: "同じ条件・同じ元本の過去実績比較" }
    : { kind: "higher-b", labelA: null, labelB: "この条件で評価額が高い", note: "同じ条件・同じ元本の過去実績比較" };
}
