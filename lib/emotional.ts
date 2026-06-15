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

// 生活価値マッピング（利益額 → 生活価値）
function calcLifeValues(profitYen: number): LifeValue[] {
  const values: LifeValue[] = [];

  // ハワイ旅行（家族4人 約50万円）
  const hawaii = Math.floor(profitYen / 500_000);
  if (hawaii >= 1) values.push({ emoji: "✈️", label: "ハワイ旅行", count: hawaii, unit: "回" });

  // iPhoneの最新機種（約18万円）
  const iphone = Math.floor(profitYen / 180_000);
  if (iphone >= 1 && values.length < 3)
    values.push({ emoji: "📱", label: "iPhone最新モデル", count: iphone, unit: "台" });

  // 国内旅行（家族4人 約15万円）
  const trip = Math.floor(profitYen / 150_000);
  if (trip >= 2 && values.length < 3)
    values.push({ emoji: "🏖️", label: "国内家族旅行", count: trip, unit: "回" });

  // 住宅ローン繰上返済（100万円/回）
  const loan = Math.floor(profitYen / 1_000_000);
  if (loan >= 1 && values.length < 3)
    values.push({ emoji: "🏠", label: "住宅ローン繰上返済", count: loan, unit: "回分" });

  // 教育費（私立高校1年 約100万円）
  const school = Math.floor(profitYen / 1_000_000);
  if (school >= 1 && values.length < 3)
    values.push({ emoji: "🎓", label: "私立高校の年間学費", count: school, unit: "年分" });

  // 老後資金の足し（月20万×12ヶ月=240万/年）
  const retirement = +(profitYen / 2_400_000).toFixed(1);
  if (retirement >= 0.5 && values.length < 3)
    values.push({ emoji: "🌸", label: "老後の生活費補填", count: null, unit: `約${retirement}年分` });

  return values.slice(0, 3);
}

export function getEmotionalMessage(
  profit: number,
  totalPrincipal: number,
  fundName: string,
  yearsElapsed: number
): EmotionalMessage {
  const profitMan = profit / 10_000;
  const lifeValues = calcLifeValues(profit);

  if (profitMan >= 1000) {
    return {
      emoji: "🚀",
      headline: `${Math.round(profitMan)}万円の利益\n積立だけで億り人への道`,
      sub: `元本${Math.round(totalPrincipal / 10000)}万円が${Math.round(profit / totalPrincipal * 100)}%増。${yearsElapsed.toFixed(0)}年間の複利の力です。`,
      lifeValues,
    };
  }
  if (profitMan >= 500) {
    return {
      emoji: "🏠",
      headline: `${Math.round(profitMan)}万円の利益\n都内マンション頭金に相当`,
      sub: `毎月の積立が、マイホーム購入の選択肢を広げていました。複利の力を実感できる金額です。`,
      lifeValues,
    };
  }
  if (profitMan >= 200) {
    return {
      emoji: "🎓",
      headline: `${Math.round(profitMan)}万円の利益\n子どもの大学費用をカバー`,
      sub: `私立大学4年間の学費は平均約550万円。${fundName}の積立だけで教育費の不安が消えていた計算です。`,
      lifeValues,
    };
  }
  if (profitMan >= 80) {
    return {
      emoji: "🚗",
      headline: `${Math.round(profitMan)}万円の利益\n新車1台分の差`,
      sub: `選ぶだけで、ここまで変わります。同じ額を貯金していたら、この利益はゼロでした。`,
      lifeValues,
    };
  }
  if (profitMan >= 30) {
    return {
      emoji: "✈️",
      headline: `${Math.round(profitMan)}万円の利益\nハワイ旅行が${Math.max(1, Math.floor(profit / 500_000))}回できる`,
      sub: `積立投資は「節約」ではなく「未来の体験」を買う行動。今から始めても遅くありません。`,
      lifeValues,
    };
  }
  return {
    emoji: "📈",
    headline: `${Math.round(profitMan)}万円の利益\n今日が一番早いスタート`,
    sub: `過去の実績より、これからの積立期間の方が重要。今すぐ始めれば、未来の自分が喜びます。`,
    lifeValues,
  };
}

export function getDifferenceMessage(
  difference: number,
  winnerName: string,
  loserName: string
): string {
  const man = Math.round(difference / 10_000);
  if (man >= 300) return `この差で、${loserName}より車1台分以上多く資産が増えていました`;
  if (man >= 100) return `${winnerName}を選ぶだけで子ども1人分の教育費が上乗せされていた`;
  if (man >= 50)  return `${man}万円 = 家族でハワイ${Math.floor(difference / 500_000)}回分の差`;
  if (man >= 20)  return `同じ積立額でも、銘柄選びで${man}万円もの差が生まれていました`;
  return `銘柄の選択だけで${man}万円の差。少しの違いが積み重なります`;
}
