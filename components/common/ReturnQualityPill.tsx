import type { FundId } from "@/types";
import { getReturnSeriesDefinition } from "@/lib/return-series";

export default function ReturnQualityPill({ fundId }: { fundId: FundId }) {
  const definition = getReturnSeriesDefinition(fundId);
  const verified = definition.quality === "A";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-bold ${
        verified
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
          : "border-amber-400/25 bg-amber-400/10 text-amber-300"
      }`}
    >
      {verified ? "A：公式月次データ" : "G：参考データ・原典未検証"}
    </span>
  );
}
