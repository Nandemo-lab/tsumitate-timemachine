"use client";

import { motion } from "framer-motion";
import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import AnimatedNumber from "./AnimatedNumber";
import { TrendingUp, TrendingDown } from "lucide-react";

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
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${isWinner ? result.fundColor + "50" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {isWinner && (
        <div
          className="absolute top-0 right-0 px-2.5 py-1 text-[10px] font-bold tracking-widest rounded-bl-xl"
          style={{ background: result.fundColor, color: "#000" }}
        >
          WINNER
        </div>
      )}

      <div className="p-5">
        {label && (
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: result.fundColor }} />
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">{label}</span>
          </div>
        )}

        {/* 銘柄名（やや強調） */}
        <p className="font-heading text-lg font-bold mb-3" style={{ color: result.fundColor }}>
          {result.fundName}
        </p>

        {/* HERO: 利益額（リターン率を隣接させて関連性を強調） */}
        <p className="text-[10px] text-zinc-400 mb-1 font-semibold tracking-widest uppercase">利益</p>
        <div className="flex items-baseline gap-2 mb-5">
          {isProfit
            ? <TrendingUp className="h-5 w-5 mb-1 flex-shrink-0" style={{ color: profitColor }} />
            : <TrendingDown className="h-5 w-5 mb-1 flex-shrink-0" style={{ color: profitColor }} />
          }
          <p
            className="font-heading font-number text-4xl font-bold leading-none"
            style={{ color: profitColor, filter: isWinner ? `drop-shadow(0 0 8px ${profitColor}33)` : "none" }}
          >
            <AnimatedNumber
              value={result.profit}
              formatter={(n) => `${n >= 0 ? "+" : ""}${formatCurrency(Math.round(n))}`}
              duration={1500}
            />
          </p>
          <p className="font-number text-base font-semibold" style={{ color: profitColor }}>
            （{isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%）
          </p>
        </div>

        {/* Sub numbers */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-4 border-t border-white/8">
          <div>
            <p className="text-[10px] text-zinc-400 mb-0.5">現在資産</p>
            <p className="text-sm font-bold text-zinc-200">
              {formatCurrency(result.finalValue)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 mb-0.5">元本</p>
            <p className="text-sm font-semibold text-zinc-400">
              {formatCurrency(result.totalPrincipal)}
            </p>
          </div>
          <div className="col-span-2">
            <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: profitColor }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.abs(result.returnRate) / 2, 100)}%` }}
                transition={{ delay: delay + 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
