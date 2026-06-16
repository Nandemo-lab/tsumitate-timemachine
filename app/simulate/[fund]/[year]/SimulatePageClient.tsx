"use client";

import { motion } from "framer-motion";
import { SimulationResult } from "@/types";
import { FundId } from "@/types";
import { FUNDS } from "@/lib/funds";
import { formatCurrency } from "@/lib/simulation";
import AnimatedNumber from "@/components/simulation/AnimatedNumber";
import ComparisonChart from "@/components/simulation/ComparisonChart";
import { TrendingUp } from "lucide-react";

interface Props {
  fundId: FundId;
  startYear: number;
  startMonth: number;
  monthlyAmount: number;
  result: SimulationResult;
}

export default function SimulatePageClient({ fundId, result }: Props) {
  const fund = FUNDS[fundId];

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${fund.color}22 0%, #09090b 70%)`,
          border: `1px solid ${fund.color}44`,
          boxShadow: `0 0 60px ${fund.color}18`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${fund.color}, transparent)` }}
        />
        <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: fund.color }}>
          利益
        </p>
        <p className="text-5xl font-black mb-2" style={{ color: "#10b981" }}>
          +<AnimatedNumber
            value={result.profit}
            formatter={(n) => formatCurrency(Math.round(n))}
            duration={1600}
          />
        </p>
        <div className="flex items-center gap-1.5 mb-5">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-bold">+{result.returnRate.toFixed(1)}%</span>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-zinc-400 mb-0.5">現在評価額</p>
            <p className="text-lg font-black text-white">{formatCurrency(result.finalValue)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 mb-0.5">投資元本</p>
            <p className="text-lg font-bold text-zinc-300">{formatCurrency(result.totalPrincipal)}</p>
          </div>
        </div>
      </motion.div>

      {/* Fake comparison chart (compare to principal) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <p className="text-xs font-black tracking-widest uppercase text-zinc-400 mb-4">
          資産推移グラフ
        </p>
        {/* Use comparison chart with the same fund but showing data */}
        <ComparisonChart planA={result} planB={{
          ...result,
          fundId: fundId,
          fundName: "元本",
          fundColor: "#52525b",
          finalValue: result.totalPrincipal,
          profit: 0,
          returnRate: 0,
          dataPoints: result.dataPoints.map(d => ({
            ...d,
            value: d.principal,
            profit: 0,
          })),
        }} />
      </motion.div>
    </div>
  );
}
