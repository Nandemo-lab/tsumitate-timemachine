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
        <Sparkles className="h-3.5 w-3.5 text-[#236B8E]" />
        <p className="text-xs font-black tracking-widest uppercase text-slate-600">条件別の検証例</p>
        <span className="text-xs text-slate-600">タップで即試せる</span>
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
                background: "#FFFFFF",
                border: `1px solid ${fund.color}28`,
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
              <p className="text-xs font-bold text-slate-700 mb-1 leading-snug">{scenario.label}</p>
              <p className="text-xs text-slate-600 mb-3">{scenario.description}</p>
              <div className="border-t border-[#D9E3E8] pt-2">
                <p className="text-xs text-slate-600 mb-0.5">利益</p>
                <p className="font-heading font-number text-base font-bold" style={{ color: "#10b981" }}>
                  +{formatCurrency(result.profit)}
                </p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-xs text-slate-600">試してみる</span>
                  <ChevronRight className="h-3 w-3 text-slate-600" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
