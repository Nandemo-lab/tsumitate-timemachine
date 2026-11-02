"use client";

import { motion } from "framer-motion";
import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import AnimatedNumber from "./AnimatedNumber";

interface Props {
  result: SimulationResult;
  label: string;
  isWinner: boolean;
  delay?: number;
}

export default function ResultCard({ result, label, isWinner, delay = 0 }: Props) {
  const isProfit = result.profit >= 0;
  const profitColor = isProfit ? "#10b981" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-w-0 overflow-hidden rounded-xl"
      style={{
        background: "#FFFFFF",
        border: `1px solid ${isWinner ? result.fundColor + "50" : "#D9E3E8"}`,
      }}
    >
      <div className="p-3 sm:p-5">
        {label && (
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: result.fundColor }} />
            <span className="text-xs font-bold tracking-widest uppercase text-slate-600">{label}</span>
          </div>
        )}

        {/* 銘柄名（やや強調） */}
        <p className="font-heading min-h-10 text-sm font-bold leading-snug sm:text-lg" style={{ color: result.fundColor }}>
          {result.fundName}
        </p>
        <p
          className={`mb-1 min-h-6 rounded-md px-1.5 py-1 text-center text-[9px] font-bold leading-tight ${isWinner ? "visible" : "invisible"}`}
          style={{ background: result.fundColor, color: "#000" }}
          aria-hidden={!isWinner}
        >
          この条件で評価額が高い
        </p>

        {/* HERO: 期間末評価額を2商品で同じ位置・大きさにする */}
        <p className="mb-1 mt-1 text-[11px] font-semibold text-slate-600">期間末評価額</p>
        <div className="mb-4">
          <p
            className="font-number break-keep text-2xl font-black leading-none text-[#263A53] sm:text-3xl"
          >
            <AnimatedNumber
              value={result.finalValue}
              formatter={(n) => formatCurrency(Math.round(n))}
              duration={1500}
            />
          </p>
        </div>

        <div className="space-y-2 border-t border-[#D9E3E8] pt-3">
          <div>
            <p className="text-[11px] text-slate-600">元本</p>
            <p className="font-number text-sm font-semibold text-slate-700">{formatCurrency(result.totalPrincipal)}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-600">損益</p>
            <p className="font-number text-sm font-bold" style={{ color: profitColor }}>
              {isProfit ? "+" : ""}{formatCurrency(Math.round(result.profit))}
              <span className="ml-1 text-[11px] font-semibold">({isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%)</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
