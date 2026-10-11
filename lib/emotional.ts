export interface LifeValue {
  emoji: string;
  label: string;
  count: number | null;
  unit: string;
}

export interface EmotionalMessage {
  headline: string;
  sub: string;
  emoji: string;
  lifeValues: LifeValue[];
}

export function getEmotionalMessage(
  profit: number,
  totalPrincipal: number,
  fundName: string,
  yearsElapsed: number
): EmotionalMessage {
  const profitMan = Math.round(profit / 10_000);
  const principalMan = Math.round(totalPrincipal / 10_000);
  return {
    emoji: "📈",
    headline: `${profitMan >= 0 ? "+" : ""}${profitMan}万円の損益\n元本と期間末評価額の差`,
    sub: `${fundName}を約${yearsElapsed.toFixed(1)}年間積み立てた過去結果です。元本${principalMan}万円との比較であり、生活費への換算や将来の到達額を示しません。`,
    lifeValues: [],
  };
}

export function getDifferenceMessage(
  difference: number,
  winnerName: string,
  loserName: string
): string {
  const man = Math.round(difference / 10_000);
  return `${winnerName}と${loserName}の期間末評価額の差は${man}万円でした。同じ開始月・終了月・積立額を使った過去結果です。`;
}
