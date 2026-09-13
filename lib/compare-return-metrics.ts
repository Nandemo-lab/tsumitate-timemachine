import { FundId } from "@/types";
import { getMonthlyJpyReturn, getReturnSeriesDefinition } from "@/lib/return-series";

/** 共通期間の月次JPYリターンを複利連結した年率。積立利益率ではない。 */
export function getVerifiedComparisonCagr(fundA: FundId, fundB: FundId) {
  const definitions = [fundA, fundB].map(getReturnSeriesDefinition);
  if (definitions.some((definition) => definition.quality !== "A")) {
    throw new Error("CAGR比較は検証済みA系列のみ利用できます");
  }
  const startMonth = definitions.map((definition) => definition.startMonth).sort().at(-1)!;
  const endMonth = definitions.map((definition) => definition.endMonth).sort()[0];
  const serial = (key: string) => Number(key.slice(0, 4)) * 12 + Number(key.slice(5)) - 1;
  const count = serial(endMonth) - serial(startMonth) + 1;
  if (count <= 0) throw new Error("比較可能な共通期間がありません");
  const cagr = (fundId: FundId) => {
    let growth = 1;
    for (let month = serial(startMonth); month <= serial(endMonth); month++) {
      const monthlyReturn = getMonthlyJpyReturn(fundId, Math.floor(month / 12), month % 12 + 1);
      if (!Number.isFinite(monthlyReturn) || monthlyReturn <= -1) throw new Error("月次リターンが不正です");
      growth *= 1 + monthlyReturn;
    }
    return Math.pow(growth, 12 / count) - 1;
  };
  return { startMonth, endMonth, count, a: cagr(fundA), b: cagr(fundB) };
}

export function verifiedCagrSpec(fundA: FundId, fundB: FundId) {
  const result = getVerifiedComparisonCagr(fundA, fundB);
  const monthLabel = (key: string) => `${Number(key.slice(0, 4))}年${Number(key.slice(5))}月`;
  const percent = (value: number) => `${value >= 0 ? "+" : ""}${(value * 100).toFixed(2)}%`;
  return {
    label: "共通期間の年率リターン（CAGR）",
    a: percent(result.a),
    b: percent(result.b),
    note: `${monthLabel(result.startMonth)}〜${monthLabel(result.endMonth)}（${result.count}か月）。円ベースの検証済み月次リターンを複利連結し、年率換算しています。分配金再投資・ファンド費用を反映。積立結果の利益率や年次リターンの算術平均ではなく、売買費用・税金は含みません。`,
  };
}
