"use client";

import { motion } from "framer-motion";
import { RankingItem } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import AnimatedNumber from "./AnimatedNumber";
import { Flame } from "lucide-react";
import { getFundTags } from "@/lib/funds";

interface Props {
  ranking: RankingItem[];
  monthlyAmount: number;
  startYear: number;
  startMonth: number;
}

const MEDALS = [
  { emoji: "🥇", label: "GOLD", glow: "#f59e0b" },
  { emoji: "🥈", label: "SILVER", glow: "#94a3b8" },
  { emoji: "🥉", label: "BRONZE", glow: "#cd7f32" },
];

export default function RankingView({ ranking, monthlyAmount, startYear, startMonth }: Props) {
  if (!ranking.length) return null;
  const top = ranking[0];
  const maxProfit = top.result.profit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      {/* Winner hero card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden p-5"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${top.fund.color}50`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4" style={{ color: top.fund.color }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: top.fund.color }}>
                最高パフォーマンス
              </span>
            </div>

            {/* 銘柄名（やや強調） */}
            <p className="font-heading text-lg font-bold text-white mb-1">🥇 {top.fund.shortName}</p>

            {/* HERO: 利益額 */}
            <p
              className="font-heading font-number text-3xl font-bold"
              style={{ color: "#10b981", filter: "drop-shadow(0 0 8px #10b98133)" }}
            >
              +<AnimatedNumber
                value={top.result.profit}
                formatter={(n) => formatCurrency(Math.round(n))}
                duration={1500}
              />
            </p>
            <p className="font-number text-sm font-semibold text-emerald-300 mt-0.5">
              +{top.result.returnRate.toFixed(1)}%
            </p>
            <p className="text-xs text-zinc-400 mt-2">
              {startYear}年{startMonth}月〜 毎月{formatCurrency(monthlyAmount)}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-zinc-400 mb-0.5">現在資産</p>
            <p className="text-sm font-bold text-zinc-200">{formatCurrency(top.result.finalValue)}</p>
          </div>
        </div>
      </motion.div>

      {/* Ranking list */}
      <div className="space-y-2">
        {ranking.map((item, i) => {
          const medal = MEDALS[i];
          const barWidth = Math.max((item.result.profit / maxProfit) * 100, 4);
          const isTopThree = i < 3;

          return (
            <motion.div
              key={item.fund.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-xl overflow-hidden p-4"
              style={{
                background: "rgba(255,255,255,0.015)",
                border: `1px solid ${isTopThree ? item.fund.color + "25" : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {/* Animated bar */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 opacity-[0.08]"
                style={{ background: item.fund.color }}
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ delay: i * 0.07 + 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />

              <div className="relative flex items-center gap-3">
                {/* Rank badge */}
                <div className="flex-shrink-0 w-8 text-center">
                  {isTopThree ? (
                    <div className="text-lg leading-none">{medal.emoji}</div>
                  ) : (
                    <span className="text-xs font-bold text-zinc-400">{i + 1}</span>
                  )}
                </div>

                {/* Numbers — 利益額を最優先で先頭に */}
                <div className="flex-shrink-0">
                  <p className="font-number text-sm font-bold text-white">
                    +<AnimatedNumber
                      value={item.result.profit}
                      formatter={(n) => formatCurrency(Math.round(n))}
                      duration={900 + i * 80}
                    />
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-400">
                    +{item.result.returnRate.toFixed(1)}%
                  </p>
                </div>

                {/* Fund info */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-end gap-1.5 mb-1">
                    <p className="font-heading text-base font-bold" style={{ color: isTopThree ? item.fund.color : "#e4e4e7" }}>
                      {item.fund.shortName}
                    </p>
                    <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: item.fund.color }} />
                  </div>
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    {getFundTags(item.fund).slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] font-medium px-1.5 py-0.5 rounded border border-white/10 text-zinc-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="rounded-xl border border-white/8 bg-white/4 p-4 text-center"
      >
        <p className="text-xs text-zinc-400 leading-relaxed">
          1位と最下位の差は
          <span className="font-black text-white mx-1">
            {formatCurrency(Math.max(0, ranking[0].result.profit - ranking[ranking.length - 1].result.profit))}
          </span>
          。<br />
          同じ元本でも、選ぶ銘柄でここまで変わります。
        </p>
      </motion.div>
    </motion.div>
  );
}
