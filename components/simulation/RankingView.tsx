"use client";

import { motion } from "framer-motion";
import { RankingItem } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import AnimatedNumber from "./AnimatedNumber";
import { getFundTags } from "@/lib/funds";

interface Props {
  ranking: RankingItem[];
  monthlyAmount: number;
  startYear: number;
  startMonth: number;
}

export default function RankingView({ ranking, monthlyAmount, startYear, startMonth }: Props) {
  if (!ranking.length) return null;
  const top = ranking[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      {/* 同条件での期間末評価額1位。推奨順位とは分けて表示する。 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden p-5"
        style={{
          background: "#FFFFFF",
          border: `1px solid ${top.fund.color}50`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-[#E8F2F6] px-2 py-1 text-xs font-bold text-[#236B8E]">
                この条件の期間末評価額 1位
              </span>
            </div>

            <p className="font-heading text-lg font-bold text-[#263A53] mb-2">{top.fund.shortName}</p>

            <p className="text-xs text-slate-600">期間末評価額</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p
                className="font-heading font-number text-3xl font-bold text-[#263A53]"
              >
                <AnimatedNumber
                  value={top.result.finalValue}
                  formatter={(n) => formatCurrency(Math.round(n))}
                  duration={1500}
                />
              </p>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              {startYear}年{startMonth}月〜 毎月{formatCurrency(monthlyAmount)}
            </p>
          </div>
          <div className="text-right flex-shrink-0 space-y-2">
            <div>
              <p className="text-xs text-slate-600">元本</p>
              <p className="text-sm font-bold text-slate-700">{formatCurrency(top.result.totalPrincipal)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-600">損益</p>
              <p className="text-sm font-bold text-emerald-700">+{formatCurrency(top.result.profit)}</p>
            </div>
          </div>
        </div>
        <p className="mt-4 border-t border-[#DDE6EA] pt-3 text-xs leading-5 text-slate-600">
          同じ期間・月額の過去実績です。1位はおすすめ順や将来の成果を示しません。
        </p>
      </motion.div>

      {/* Ranking list */}
      <div className="space-y-2">
        {ranking.map((item, i) => {
          return (
            <motion.div
              key={item.fund.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-xl overflow-hidden p-4"
              style={{
                background: "#FBFCFC",
                border: "1px solid #DDE6EA",
              }}
            >
              <div className="relative flex items-center gap-3">
                {/* Rank badge */}
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F2F6] text-xs font-bold text-[#236B8E]">
                  {i + 1}位
                </div>

                {/* 数値順位の基準である期間末評価額を先に表示 */}
                <div className="flex-shrink-0">
                  <p className="font-number text-sm font-bold text-[#263A53]">
                    <AnimatedNumber
                      value={item.result.finalValue}
                      formatter={(n) => formatCurrency(Math.round(n))}
                      duration={900 + i * 80}
                    />
                  </p>
                  <p className="text-xs text-slate-600">
                    損益 +{formatCurrency(item.result.profit)}
                  </p>
                </div>

                {/* Fund info */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center justify-end gap-1.5 mb-1">
                    <p className="font-heading text-base font-bold text-[#263A53]">
                      {item.fund.shortName}
                    </p>
                    <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: item.fund.color }} />
                  </div>
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    {getFundTags(item.fund).slice(0, 2).map((t) => (
                      <span key={t} className="text-[9px] font-medium px-1.5 py-0.5 rounded border border-[#D2DEE4] text-slate-600">
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
        className="rounded-xl border border-[#D9E3E8] bg-white/4 p-4 text-center"
      >
        <p className="text-xs text-slate-600 leading-relaxed">
          1位と最下位の差は
          <span className="font-black text-[#263A53] mx-1">
            {formatCurrency(Math.max(0, ranking[0].result.profit - ranking[ranking.length - 1].result.profit))}
          </span>
          。<br />
          。同じ期間・月額にそろえた過去実績の差であり、将来の差やおすすめ順を示しません。
        </p>
      </motion.div>
    </motion.div>
  );
}
