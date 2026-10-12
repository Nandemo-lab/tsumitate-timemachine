"use client";

import { motion } from "framer-motion";
import { SimulationResult } from "@/types";
import { formatCurrencyFull, DATA_SOURCE, DATA_UPDATED, formatYearMonth, CURRENT_YEAR, CURRENT_MONTH } from "@/lib/simulation";
import { Info, Database } from "lucide-react";
import { getReturnDataSource } from "@/lib/return-data-sources";

interface Props {
  resultA: SimulationResult;
  resultB?: SimulationResult;
}

export default function CalculationDetails({ resultA, resultB }: Props) {
  const months = resultA.monthsElapsed;
  const endLabel = formatYearMonth(CURRENT_YEAR, CURRENT_MONTH);

  return (
    <motion.details
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="group rounded-2xl border border-[#D9E3E8] bg-white overflow-hidden"
    >
      <summary className="flex items-center gap-2 px-5 py-3.5 cursor-pointer list-none select-none">
        <Info className="h-3.5 w-3.5 text-slate-600 flex-shrink-0" />
        <span className="text-xs text-slate-600 font-medium flex-1">計算条件・データソース</span>
        <span className="text-xs text-slate-600 group-open:hidden">▼ 表示</span>
        <span className="text-xs text-slate-600 hidden group-open:inline">▲ 閉じる</span>
      </summary>

      <div className="px-5 pb-5 space-y-4 border-t border-[#D9E3E8]">
        {/* Calculation conditions */}
        <div className="pt-4 grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-xs text-slate-600 mb-0.5">積立期間</p>
            <p className="text-xs font-bold text-slate-700">
              {formatYearMonth(resultA.startYear, resultA.startMonth)} 〜 {endLabel}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-0.5">積立回数</p>
            <p className="text-xs font-bold text-slate-700">{months}回</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-0.5">毎月積立額</p>
            <p className="text-xs font-bold text-slate-700">{formatCurrencyFull(resultA.monthlyAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-600 mb-0.5">投資元本合計</p>
            <p className="text-xs font-bold text-slate-700">{formatCurrencyFull(resultA.totalPrincipal)}</p>
          </div>
        </div>

        {/* Per-fund */}
        <div className="space-y-2">
          {[resultA, ...(resultB ? [resultB] : [])].map((r) => (
            (() => {
              const source = getReturnDataSource(r.fundId);
              return (
            <div key={r.fundId} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: r.fundColor }} />
                <p className="text-xs text-slate-600 flex-1">{r.fundName}</p>
                <p className="text-xs text-slate-600 font-bold">
                  +{r.returnRate.toFixed(1)}% （{months}ヶ月）
                </p>
              </div>
              <p className={`pl-3.5 text-xs ${source.sourceStatus === "verified" ? "text-emerald-500/80" : "text-amber-500/80"}`}>
                {source.sourceStatus === "verified"
                  ? `公式月次データ｜${source.storedSeries}（${source.startMonth}〜${source.endMonth}）`
                  : `${source.storedSeries}／原典・通貨・配当処理は未特定`}
              </p>
            </div>
              );
            })()
          ))}
        </div>

        {/* Data source */}
        <div className="flex items-start gap-2 pt-2 border-t border-[#D9E3E8]">
          <Database className="h-3 w-3 text-slate-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-600 leading-relaxed">
              データソース：{DATA_SOURCE}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">最終更新：{DATA_UPDATED}</p>
            <p className="text-xs text-slate-600 mt-0.5">
              ※ A系列は検証済み月次実績を使用します。売買手数料・税金・実際の為替コストは個別計算していません。将来の成果を保証しません。
            </p>
          </div>
        </div>
      </div>
    </motion.details>
  );
}
