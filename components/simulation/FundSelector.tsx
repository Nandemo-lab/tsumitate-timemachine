"use client";

import { useState } from "react";
import { FundId, FundCategory } from "@/types";
import { FUNDS, FUND_CATEGORIES, CATEGORY_ORDER, getFundsByCategory } from "@/lib/funds";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  value: FundId;
  onChange: (id: FundId) => void;
  label: string;
  accentColor: string;
}

export default function FundSelector({ value, onChange, label, accentColor }: Props) {
  const currentFund = FUNDS[value];
  const [activeCategory, setActiveCategory] = useState<FundCategory>(currentFund.category);

  const fundsInCategory = getFundsByCategory(activeCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400">{label}</p>
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
          const hasSelected = getFundsByCategory(catId).some((f) => f.id === value);
          return (
            <button
              key={catId}
              onClick={() => setActiveCategory(catId)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all border",
                isActive
                  ? "bg-white/15 text-white border-white/20"
                  : "bg-white/5 text-zinc-400 border-white/8 hover:text-zinc-300 hover:bg-white/8"
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
              className={cn(
                "relative rounded-xl border p-3 text-left transition-all duration-200"
              )}
              style={
                isSelected
                  ? {
                      background: `${fund.color}18`,
                      borderColor: `${fund.color}55`,
                      boxShadow: `0 0 0 1px ${fund.color}33, 0 4px 16px ${fund.color}18`,
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }
              }
            >
              {/* Risk badge */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className="h-1 w-5 rounded-full"
                  style={{ background: isSelected ? fund.color : "rgba(255,255,255,0.15)" }}
                />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1 w-1 rounded-full"
                      style={{
                        background: i < fund.riskLevel
                          ? (isSelected ? fund.color : "rgba(255,255,255,0.3)")
                          : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <p
                className="text-sm font-black leading-tight"
                style={{ color: isSelected ? fund.color : "#d4d4d8" }}
              >
                {fund.shortName}
              </p>
              <p className="mt-0.5 text-[10px] text-zinc-400 line-clamp-1">{fund.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* カテゴリ説明 */}
      <p className="text-[10px] text-zinc-400">
        {FUND_CATEGORIES[activeCategory].description}
      </p>
    </div>
  );
}
