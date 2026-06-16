"use client";

import { motion } from "framer-motion";
import { SimulationResult } from "@/types";
import { formatCurrencyFull, DATA_SOURCE, DATA_UPDATED, formatYearMonth, CURRENT_YEAR, CURRENT_MONTH } from "@/lib/simulation";
import { Info, Database } from "lucide-react";

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
      className="group rounded-2xl border border-white/8 bg-white/[0.025] overflow-hidden"
    >
      <summary className="flex items-center gap-2 px-5 py-3.5 cursor-pointer list-none select-none">
        <Info className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
        <span className="text-xs text-zinc-400 font-medium flex-1">計算条件・データソース</span>
        <span className="text-[10px] text-zinc-400 group-open:hidden">▼ 表示</span>
        <span className="text-[10px] text-zinc-400 hidden group-open:inline">▲ 閉じる</span>
      </summary>

      <div className="px-5 pb-5 space-y-4 border-t border-white/8">
        {/* Calculation conditions */}
        <div className="pt-4 grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-[10px] text-zinc-400 mb-0.5">積立期間</p>
            <p className="text-xs font-bold text-zinc-300">
              {formatYearMonth(resultA.startYear, resultA.startMonth)} 〜 {endLabel}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 mb-0.5">積立回数</p>
            <p className="text-xs font-bold text-zinc-300">{months}回</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 mb-0.5">毎月積立額</p>
            <p className="text-xs font-bold text-zinc-300">{formatCurrencyFull(resultA.monthlyAmount)}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 mb-0.5">投資元本合計</p>
            <p className="text-xs font-bold text-zinc-300">{formatCurrencyFull(resultA.totalPrincipal)}</p>
          </div>
        </div>

        {/* Per-fund */}
        <div className="space-y-2">
          {[resultA, ...(resultB ? [resultB] : [])].map((r) => (
            <div key={r.fundId} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: r.fundColor }} />
              <p className="text-[10px] text-zinc-400 flex-1">{r.fundName}</p>
              <p className="text-[10px] text-zinc-400 font-bold">
                +{r.returnRate.toFixed(1)}% （{months}ヶ月）
              </p>
            </div>
          ))}
        </div>

        {/* Data source */}
        <div className="flex items-start gap-2 pt-2 border-t border-white/8">
          <Database className="h-3 w-3 text-zinc-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              データソース：{DATA_SOURCE}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">最終更新：{DATA_UPDATED}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              ※ 手数料・税金・為替コストは含みません。過去の実績であり将来を保証しません。
            </p>
          </div>
        </div>
      </div>
    </motion.details>
  );
}
