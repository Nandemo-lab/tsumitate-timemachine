/** Planning assumptions only. The calculator never loads return-series data. */
export type WithdrawalInputs = {
  initialYen: number;
  monthlyYen: number;
  years: number;
  annualReturnPercent: number;
  annualInflationPercent: number;
};

function validate({ initialYen, monthlyYen, years, annualReturnPercent, annualInflationPercent }: WithdrawalInputs) {
  if (!Number.isSafeInteger(initialYen) || initialYen < 0 || initialYen > 1_000_000_000) throw new RangeError("開始時の資産は0〜10億円の整数で入力してください");
  if (!Number.isSafeInteger(monthlyYen) || monthlyYen < 0 || monthlyYen > 10_000_000) throw new RangeError("最初の月の取崩額は0〜1,000万円の整数で入力してください");
  if (!Number.isSafeInteger(years) || years < 1 || years > 50) throw new RangeError("期間は1〜50年の整数で入力してください");
  if (!Number.isFinite(annualReturnPercent) || annualReturnPercent < -20 || annualReturnPercent > 20) throw new RangeError("想定年率は-20〜20%で入力してください");
  if (!Number.isFinite(annualInflationPercent) || annualInflationPercent < -2 || annualInflationPercent > 10) throw new RangeError("物価上昇率は-2〜10%で入力してください");
}

export function projectWithdrawal(inputs: WithdrawalInputs) {
  validate(inputs);
  const monthlyGrowth = Math.pow(1 + inputs.annualReturnPercent / 100, 1 / 12);
  const monthlyInflation = Math.pow(1 + inputs.annualInflationPercent / 100, 1 / 12);
  let balance = inputs.initialYen;
  let withdrawal = inputs.monthlyYen;
  let totalWithdrawn = 0;
  let shortfallMonth: number | null = null;
  const yearly: { year: number; balance: number; withdrawn: number }[] = [];
  for (let month = 1; month <= inputs.years * 12; month++) {
    // Each month begins with a withdrawal; the remainder earns the assumed return.
    const actual = Math.min(balance, withdrawal);
    if (actual + 0.000001 < withdrawal && shortfallMonth === null) shortfallMonth = month;
    balance = (balance - actual) * monthlyGrowth;
    totalWithdrawn += actual;
    withdrawal *= monthlyInflation;
    if (month % 12 === 0) yearly.push({ year: month / 12, balance: Math.floor(balance), withdrawn: Math.floor(totalWithdrawn) });
  }
  return { endingBalance: Math.floor(balance), totalWithdrawn: Math.floor(totalWithdrawn), shortfallMonth, yearly };
}

/** Highest integer starting monthly withdrawal that avoids any shortfall. */
export function sustainableMonthlyWithdrawal(inputs: Omit<WithdrawalInputs, "monthlyYen">) {
  let low = 0;
  let high = 10_000_000;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (projectWithdrawal({ ...inputs, monthlyYen: mid }).shortfallMonth === null) low = mid;
    else high = mid - 1;
  }
  return low;
}
