"use client";

import { motion } from "framer-motion";
import { QUICK_SCENARIOS, QuickScenario } from "@/lib/scenarios";
import { simulate, formatCurrency } from "@/lib/simulation";
import { useMemo } from "react";
import { FUNDS } from "@/lib/funds";
import { ChevronRight, Sparkles } from "lucide-react";

interface Props {
  onSelect: (scenario: QuickScenario) => void;
}

export default function QuickScenarios({ onSelect }: Props) {
  const results = useMemo(() =>
    QUICK_SCENARIOS.map((s) => ({
      scenario: s,
      result: simulate({
        fundId: s.fundId,
        startYear: s.startYear,
        startMonth: s.startMonth,
        monthlyAmount: s.monthlyAmount,
      }),
    })), []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400">人気のたられば</p>
        <span className="text-[10px] text-zinc-400">タップで即試せる</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}>
        {results.map(({ scenario, result }, i) => {
          const fund = FUNDS[scenario.fundId];
          return (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(scenario)}
              className="flex-shrink-0 w-[186px] snap-start rounded-2xl p-4 text-left"
              style={{
                background: `linear-gradient(145deg, ${fund.color}18 0%, rgba(255,255,255,0.03) 100%)`,
                border: `1px solid ${fund.color}30`,
              }}
            >
              {/* Tag */}
              {scenario.tag && (
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider mb-2"
                  style={{ background: `${fund.color}25`, color: fund.color }}
                >
                  {scenario.tag}
                </span>
              )}
              <div className="text-xl mb-2">{scenario.emoji}</div>
              <p className="text-xs font-bold text-zinc-300 mb-1 leading-snug">{scenario.label}</p>
              <p className="text-[10px] text-zinc-400 mb-3">{scenario.description}</p>
              <div className="border-t border-white/8 pt-2">
                <p className="text-[10px] text-zinc-400 mb-0.5">利益</p>
                <p className="text-base font-black" style={{ color: "#10b981" }}>
                  +{formatCurrency(result.profit)}
                </p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-[10px] text-zinc-400">試してみる</span>
                  <ChevronRight className="h-3 w-3 text-zinc-400" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
