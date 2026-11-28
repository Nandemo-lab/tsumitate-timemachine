/** Assumption-only planning. No third-party return series or product data. */
export type GoalInputs = {
  targetToday: number;
  years: number;
  grossAnnualPercent: number;
  inflationAnnualPercent: number;
  annualFeeLowPercent: number;
  annualFeeHighPercent: number;
};

const integer = (value: number) => Number.isSafeInteger(value);

export function projectGoal(inputs: GoalInputs) {
  const { targetToday, years, grossAnnualPercent, inflationAnnualPercent, annualFeeLowPercent, annualFeeHighPercent } = inputs;
  if (!integer(targetToday) || targetToday < 100_000 || targetToday > 100_000_000) throw new RangeError("目標額は10万円〜1億円の整数で入力してください");
  if (!integer(years) || years < 1 || years > 40) throw new RangeError("積立期間は1〜40年で入力してください");
  for (const [value, low, high, label] of [
    [grossAnnualPercent, -20, 20, "想定年率"],
    [inflationAnnualPercent, -2, 10, "物価上昇率"],
    [annualFeeLowPercent, 0, 5, "費用A"],
    [annualFeeHighPercent, 0, 5, "費用B"],
  ] as const) {
    if (!Number.isFinite(value) || value < low || value > high) throw new RangeError(`${label}は${low}〜${high}%で入力してください`);
  }
  const months = years * 12;
  const nominalTarget = targetToday * Math.pow(1 + inflationAnnualPercent / 100, years);
  const monthlyMultiplier = (feePercent: number) => Math.pow((1 + grossAnnualPercent / 100) * (1 - feePercent / 100), 1 / 12);
  const factor = (multiplier: number) => {
    let value = 0;
    for (let month = 0; month < months; month++) value = (value + 1) * multiplier;
    return value;
  };
  const requiredA = nominalTarget / factor(monthlyMultiplier(annualFeeLowPercent));
  const requiredB = nominalTarget / factor(monthlyMultiplier(annualFeeHighPercent));
  if (!Number.isFinite(requiredA) || !Number.isFinite(requiredB) || Math.max(requiredA, requiredB) > 10_000_000) {
    throw new RangeError("この条件では月額1,000万円を超えます。目標額や年数を見直してください");
  }
  return {
    nominalTarget: Math.round(nominalTarget),
    monthlyA: Math.ceil(requiredA),
    monthlyB: Math.ceil(requiredB),
    monthlyDifference: Math.ceil(requiredB) - Math.ceil(requiredA),
    months,
    contributionA: Math.ceil(requiredA) * months,
    contributionB: Math.ceil(requiredB) * months,
  };
}
