/** A local-only alternative to bundled third-party return series. No data is uploaded. */
export type ReturnMonth = { month: string; rate: number };
export type OwnReturnPoint = { month: string; principal: number; value: number; profit: number };

const monthPattern = /^(\d{4})-(0[1-9]|1[0-2])$/;
const MAX_MONTHS = 600;
const MAX_MONTHLY_AMOUNT = 1_000_000;

function nextMonth(month: string): string {
  const [, year, part] = monthPattern.exec(month) ?? [];
  const y = Number(year), m = Number(part);
  return `${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}`;
}

export function parseOwnReturns(raw: string): ReturnMonth[] {
  const lines = raw.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 1 || lines.length > MAX_MONTHS) throw new RangeError("1〜600か月の月次データを入力してください");
  const rows = lines.map((line, index) => {
    const cells = line.split(",").map((cell) => cell.trim());
    if (cells.length !== 2 || !monthPattern.test(cells[0]) || !/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(cells[1])) {
      throw new RangeError(`${index + 1}行目は YYYY-MM,月次騰落率(%) の形式で入力してください`);
    }
    const rate = Number(cells[1]) / 100;
    if (!Number.isFinite(rate) || rate < -1 || rate > 10) throw new RangeError(`${index + 1}行目の騰落率は-100%〜1000%の範囲にしてください`);
    return { month: cells[0], rate };
  });
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].month !== nextMonth(rows[i - 1].month)) throw new RangeError(`${i + 1}行目の月が連続していません`);
  }
  return rows;
}

export function simulateOwnReturns(rows: ReturnMonth[], monthlyAmount: number) {
  if (!Number.isSafeInteger(monthlyAmount) || monthlyAmount < 1 || monthlyAmount > MAX_MONTHLY_AMOUNT) {
    throw new RangeError("毎月の積立額は1円〜100万円の整数にしてください");
  }
  if (!rows.length || rows.length > MAX_MONTHS) throw new RangeError("1〜600か月のデータが必要です");
  let principal = 0, value = 0, growthIndex = 1, peakIndex = 1, maxDrawdown = 0, underwaterMonths = 0;
  const points: OwnReturnPoint[] = [];
  rows.forEach(({ month, rate }) => {
    if (!monthPattern.test(month) || !Number.isFinite(rate) || rate < -1 || rate > 10) throw new RangeError("月次データが不正です");
    principal += monthlyAmount;
    value = (value + monthlyAmount) * (1 + rate); // existing simulator: contribute before return
    // Drawdown uses a unit investment index; new contributions must not hide a fall.
    growthIndex *= 1 + rate;
    peakIndex = Math.max(peakIndex, growthIndex);
    maxDrawdown = Math.max(maxDrawdown, (peakIndex - growthIndex) / peakIndex);
    if (value < principal) underwaterMonths++;
    points.push({ month, principal, value: Math.round(value), profit: Math.round(value - principal) });
  });
  return {
    principal, finalValue: Math.round(value), profit: Math.round(value) - principal,
    maxDrawdown, underwaterMonths, points,
  };
}
