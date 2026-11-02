"use client";

import { useState } from "react";
import { FundId, FundCategory } from "@/types";
import { FUNDS, FUND_CATEGORIES, CATEGORY_ORDER, getFundsByCategory } from "@/lib/funds";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { isVerifiedReturnSeries } from "@/lib/return-series";

interface Props {
  value: FundId;
  onChange: (id: FundId) => void;
  label: string;
  accentColor: string;
}

export default function FundSelector({ value, onChange, label }: Props) {
  const currentFund = FUNDS[value];
  const [activeCategory, setActiveCategory] = useState<FundCategory>(currentFund.category);
  const [isExpanded, setIsExpanded] = useState(false);

  const fundsInCategory = getFundsByCategory(activeCategory).filter((fund) => isVerifiedReturnSeries(fund.id));

  return (
    <div className="space-y-3">
      <p className="text-xs font-black tracking-widest uppercase text-slate-600">{label}</p>
      <div className="flex min-h-14 items-center gap-3 rounded-xl border border-[#D9E3E8] bg-[#F8FBFC] px-3 py-2">
        <div className="h-8 w-1 rounded-full" style={{ background: currentFund.color }} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#263A53]">{currentFund.shortName}</p>
          <p className="truncate text-xs text-slate-600">{currentFund.description}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded((open) => !open)}
          aria-expanded={isExpanded}
          className="min-h-11 shrink-0 rounded-lg border border-[#B9CBD4] bg-white px-3 text-xs font-bold text-[#236B8E]"
        >
          {isExpanded ? "閉じる" : "変更"}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 rounded-xl border border-[#D9E3E8] bg-white p-3">
          <p className="text-xs font-semibold text-slate-600">投資対象から絞り、商品を選びます</p>

          {/* Category tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-0.5">
            {CATEGORY_ORDER.map((catId) => {
              const cat = FUND_CATEGORIES[catId];
              const isActive = activeCategory === catId;
              return (
                <button
                  key={catId}
                  onClick={() => setActiveCategory(catId)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex min-h-11 flex-shrink-0 items-center gap-1 rounded-lg border px-3 py-2 text-xs font-bold transition-all",
                    isActive
                      ? "border-[#B9CBD4] bg-[#DCEFFA] text-[#263A53]"
                      : "border-[#D9E3E8] bg-[#F4F7F8] text-slate-600 hover:bg-[#EAF3F7]"
                  )}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {fundsInCategory.map((fund) => {
              const isSelected = value === fund.id;
              return (
                <motion.button
                  key={fund.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { onChange(fund.id); setIsExpanded(false); }}
                  aria-pressed={isSelected}
                  className="relative min-h-16 rounded-lg border p-3 text-left transition-all duration-200"
                  style={{
                    background: isSelected ? "#F0F7F9" : "#FFFFFF",
                    borderColor: isSelected ? `${fund.color}70` : "#D9E3E8",
                  }}
                >
                  <p className="text-sm font-semibold leading-tight" style={{ color: isSelected ? fund.color : "#263A53" }}>
                    {fund.shortName}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-600">{fund.description}</p>
                </motion.button>
              );
            })}
          </div>

          <p className="text-xs leading-relaxed text-slate-600">{FUND_CATEGORIES[activeCategory].description}</p>
        </div>
      )}
    </div>
  );
}
