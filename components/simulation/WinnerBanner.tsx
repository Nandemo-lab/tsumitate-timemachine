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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${winner.fundColor}28 0%, #09090b 70%)`,
        border: `1px solid ${winner.fundColor}55`,
        boxShadow: `0 0 40px ${winner.fundColor}16, inset 0 1px 0 ${winner.fundColor}25`,
      }}
    >
      {/* Top glow stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${winner.fundColor}, transparent)` }}
      />

      <div className="px-5 pt-5 pb-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🏆</span>
          <span className="text-xs font-black tracking-widest uppercase" style={{ color: winner.fundColor }}>
            今回の勝者
          </span>
        </div>

        {/* Fund name */}
        <p className="text-2xl font-black text-white mb-1">{winner.fundName}</p>

        {/* Profit hero */}
        <p className="font-number text-4xl font-black mb-1" style={{ color: "#10b981" }}>
          <AnimatedNumber
            value={winner.profit}
            formatter={(n) => `+${formatCurrency(Math.round(n))}`}
            duration={1600}
          />
        </p>
        <p className="text-xs text-zinc-400 mb-4">の利益（元本 {formatCurrency(winner.totalPrincipal)}）</p>

        {/* Divider */}
        <div className="border-t border-white/10 pt-3">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-[10px] text-zinc-400 mb-0.5">{loser.fundName}との差</p>
              <p className="text-xl font-black" style={{ color: winner.fundColor }}>
                +<AnimatedNumber
                  value={difference}
                  formatter={(n) => formatCurrency(Math.round(n))}
                  duration={1400}
                />
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-400 mb-0.5">リターン率</p>
              <p className="text-xl font-black text-emerald-400">
                +{winner.returnRate.toFixed(1)}%
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-400 leading-relaxed border-t border-white/8 pt-3">
            💬 {diffMessage}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
