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

  const fundsInCategory = getFundsByCategory(activeCategory).filter((fund) => isVerifiedReturnSeries(fund.id));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black tracking-widest uppercase text-slate-600">{label}</p>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: currentFund.color }} />
          <p className="text-xs font-bold" style={{ color: currentFund.color }}>{currentFund.shortName}</p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-0.5">
        {CATEGORY_ORDER.map((catId) => {
          const cat = FUND_CATEGORIES[catId];
          const isActive = activeCategory === catId;
          const hasSelected = getFundsByCategory(catId).some((f) => f.id === value && isVerifiedReturnSeries(f.id));
          return (
            <button
              key={catId}
              onClick={() => setActiveCategory(catId)}
              aria-pressed={isActive}
              className={cn(
                "flex-shrink-0 flex min-h-11 items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold transition-all border",
                isActive
                  ? "bg-[#DCEFFA] text-[#263A53] border-[#B9CBD4]"
                  : "bg-[#F4F7F8] text-slate-600 border-[#D9E3E8] hover:text-slate-700 hover:bg-[#EAF3F7]"
              )}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {hasSelected && !isActive && (
                <span className="h-1 w-1 rounded-full bg-indigo-400 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Fund grid */}
      <div className="grid grid-cols-2 gap-2">
        {fundsInCategory.map((fund) => {
          const isSelected = value === fund.id;
          return (
            <motion.button
              key={fund.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(fund.id)}
              aria-pressed={isSelected}
              className={cn(
                "relative rounded-xl border p-3 text-left transition-all duration-200"
              )}
              style={
                isSelected
                  ? {
                      background: "#F8FBFC",
                      borderColor: `${fund.color}60`,
                    }
                  : {
                      background: "#FFFFFF",
                      borderColor: "#D9E3E8",
                    }
              }
            >
              {/* Selection marker */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className="h-1 w-5 rounded-full"
                  style={{ background: isSelected ? fund.color : "#C7D6DE" }}
                />
                {isSelected && <span className="text-xs font-bold text-slate-700">選択中</span>}
              </div>
              <p
                className="font-heading text-sm font-semibold leading-tight"
                style={{ color: isSelected ? fund.color : "#d4d4d8" }}
              >
                {fund.shortName}
              </p>
              <p className="mt-0.5 text-xs text-slate-600 line-clamp-1">{fund.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* カテゴリ説明 */}
      <p className="text-xs text-slate-600">
        {FUND_CATEGORIES[activeCategory].description}
      </p>
    </div>
  );
}
