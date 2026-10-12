"use client";

import { motion } from "framer-motion";
import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import { getDifferenceMessage } from "@/lib/emotional";
import AnimatedNumber from "./AnimatedNumber";

interface Props {
  winner: SimulationResult;
  loser: SimulationResult;
  difference: number;
}

export default function WinnerBanner({ winner, loser, difference }: Props) {
  const diffMessage = getDifferenceMessage(difference, winner.fundName, loser.fundName);
  const resultColor = winner.profit >= 0 ? "#10b981" : "#ef4444";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "#FFFFFF",
        border: `1px solid ${winner.fundColor}50`,
      }}
    >
      {/* 同条件の過去結果だけを示すラベル */}
      <div
        className="absolute top-0 right-0 px-3 py-1.5 text-xs font-bold tracking-widest rounded-bl-xl"
        style={{ background: winner.fundColor, color: "#000" }}
      >
        この条件で評価額が高い
      </div>

      <div className="px-5 pt-5 pb-4">
        {/* 銘柄名（やや強調） */}
        <p className="font-heading text-lg font-bold text-[#263A53] mb-3">{winner.fundName}</p>

        {/* HERO: 利益額（リターン率を隣接させて関連性を強調） */}
        <p className="text-xs text-slate-600 mb-1">損益</p>
        <div className="flex items-baseline gap-2 mb-4">
          <p
            className="font-heading font-number text-4xl font-bold"
            style={{ color: resultColor, filter: `drop-shadow(0 0 9px ${resultColor}33)` }}
          >
            <AnimatedNumber
              value={winner.profit}
              formatter={(n) => `${n >= 0 ? "+" : ""}${formatCurrency(Math.round(n))}`}
              duration={1600}
            />
          </p>
          <p className="font-number text-lg font-semibold" style={{ color: resultColor }}>
            （{winner.returnRate >= 0 ? "+" : ""}{winner.returnRate.toFixed(1)}%）
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#D9E3E8] pt-3">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs text-slate-600 mb-0.5">{loser.fundName}との差</p>
              <p className="font-number text-lg font-bold text-[#263A53]">
                +<AnimatedNumber
                  value={difference}
                  formatter={(n) => formatCurrency(Math.round(n))}
                  duration={1400}
                />
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600 mb-0.5">元本</p>
              <p className="text-sm font-semibold text-slate-700">{formatCurrency(winner.totalPrincipal)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-[#D9E3E8] pt-3">
            💬 {diffMessage}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
