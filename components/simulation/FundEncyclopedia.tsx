"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FundId, FundCategory } from "@/types";
import { FUNDS, FUND_LIST, FUND_CATEGORIES, CATEGORY_ORDER, getFundsByCategory } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
import { ChevronRight, BookOpen, Star, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface FundCardProps {
  fundId: FundId;
  onSimulate: (fundId: FundId) => void;
}

function RiskBadge({ level }: { level: number }) {
  const colors = ["", "#10b981", "#22c55e", "#f59e0b", "#f97316", "#ef4444"];
  const labels = ["", "超安定", "安定", "標準", "高リスク", "超高リスク"];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
      style={{ background: `${colors[level]}20`, color: colors[level] }}
    >
      {labels[level]}
    </span>
  );
}

function BeginnerScore({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3 w-3"
          fill={i < score ? "#f59e0b" : "none"}
          stroke={i < score ? "#f59e0b" : "#3f3f46"}
        />
      ))}
      <span className="text-[10px] text-zinc-500 ml-1">初心者向け</span>
    </div>
  );
}

function FundDetailCard({ fundId, onSimulate }: FundCardProps) {
  const fund = FUNDS[fundId];
  const enc = fund.encyclopedia;

  // 5年前からのシミュレーション
  const result5yr = simulate({
    fundId,
    startYear: 2020,
    startMonth: 1,
    monthlyAmount: 30000,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${fund.color}18 0%, rgba(255,255,255,0.04) 100%)`,
        border: `1px solid ${fund.color}35`,
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full" style={{ background: fund.color }} />
              <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">
                {FUND_CATEGORIES[fund.category].emoji} {FUND_CATEGORIES[fund.category].label}
              </span>
            </div>
            <h3 className="text-xl font-black text-white">{enc.nickname}</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">{enc.formalName}</p>
          </div>
          <RiskBadge level={fund.riskLevel} />
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed mb-3 font-medium">
          {enc.catchCopy}
        </p>
        <BeginnerScore score={enc.beginnerScore} />
      </div>

      {/* Features */}
      <div className="px-5 pb-4 flex flex-wrap gap-1.5">
        {enc.features.map((f) => (
          <span
            key={f}
            className="rounded-lg px-2.5 py-1 text-xs font-semibold"
            style={{ background: `${fund.color}20`, color: fund.color }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-5 pb-4">
        <div>
          <p className="text-[10px] text-zinc-600 mb-0.5">信託報酬</p>
          <p className="text-xs font-bold text-zinc-300">{enc.managementFee}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 mb-0.5">ボラティリティ</p>
          <p className="text-xs font-bold text-zinc-300">{enc.volatility}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 mb-0.5">推奨期間</p>
          <p className="text-xs font-bold text-zinc-300">{enc.expectedHorizon}</p>
        </div>
      </div>

      {/* For whom */}
      <div className="px-5 pb-4">
        <p className="text-[10px] text-zinc-600 mb-1.5 font-black tracking-widest uppercase">
          こんな人向け
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed">{enc.forWhom}</p>
      </div>

      {/* Pros/Cons */}
      <div className="px-5 pb-4 grid grid-cols-1 gap-2">
        {enc.pros.slice(0, 2).map((p) => (
          <div key={p} className="flex items-start gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400">{p}</p>
          </div>
        ))}
        {enc.cons.slice(0, 1).map((c) => (
          <div key={c} className="flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-400">{c}</p>
          </div>
        ))}
      </div>

      {/* 5年前からシミュレーション */}
      <div
        className="mx-4 mb-4 rounded-xl p-4"
        style={{ background: `${fund.color}12`, border: `1px solid ${fund.color}25` }}
      >
        <p className="text-[10px] text-zinc-600 mb-2 font-black tracking-widest uppercase">
          もし5年前（2020年）から月3万円積立していたら？
        </p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-black" style={{ color: "#10b981" }}>
              +{formatCurrency(result5yr.profit)}
            </p>
            <p className="text-xs text-zinc-500">
              元本 {formatCurrency(result5yr.totalPrincipal)} → {formatCurrency(result5yr.finalValue)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-black text-emerald-400">+{result5yr.returnRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onSimulate(fundId)}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: fund.color }}
        >
          この銘柄でシミュレーション
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

interface Props {
  onSimulate: (fundId: FundId) => void;
}

export default function FundEncyclopedia({ onSimulate }: Props) {
  const [activeCategory, setActiveCategory] = useState<FundCategory>("global");
  const [expandedFund, setExpandedFund] = useState<FundId | null>(null);

  const funds = getFundsByCategory(activeCategory);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-indigo-400" />
        <p className="text-sm font-black text-white">銘柄図鑑</p>
        <span className="text-xs text-zinc-600">タップして詳細を見る</span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
        {CATEGORY_ORDER.map((catId) => {
          const cat = FUND_CATEGORIES[catId];
          const isActive = activeCategory === catId;
          return (
            <button
              key={catId}
              onClick={() => { setActiveCategory(catId); setExpandedFund(null); }}
              className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
                isActive
                  ? "bg-white/15 text-white border-white/20"
                  : "bg-white/[0.04] text-zinc-500 border-white/8 hover:text-zinc-300"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span className="text-[10px] opacity-60">({getFundsByCategory(catId).length})</span>
            </button>
          );
        })}
      </div>

      {/* Fund list */}
      <div className="space-y-3">
        {funds.map((fund) => {
          const isExpanded = expandedFund === fund.id;
          const enc = fund.encyclopedia;

          return (
            <div key={fund.id}>
              {/* Collapsed card */}
              <motion.button
                onClick={() => setExpandedFund(isExpanded ? null : fund.id)}
                className="w-full rounded-2xl p-4 text-left transition-all"
                style={{
                  background: isExpanded
                    ? `linear-gradient(145deg, ${fund.color}18 0%, rgba(255,255,255,0.04) 100%)`
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isExpanded ? fund.color + "40" : "rgba(255,255,255,0.08)"}`,
                }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: `${fund.color}20` }}
                  >
                    {FUND_CATEGORIES[fund.category].emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-black text-white">{enc.nickname}</p>
                      {enc.nisaCompatible && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          NISA対応
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate">{enc.formalName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <RiskBadge level={fund.riskLevel} />
                      <BeginnerScore score={enc.beginnerScore} />
                    </div>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 text-zinc-600 flex-shrink-0 transition-transform"
                    style={{ transform: isExpanded ? "rotate(90deg)" : "none" }}
                  />
                </div>
              </motion.button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden mt-2"
                  >
                    <FundDetailCard fundId={fund.id} onSimulate={(id) => { onSimulate(id); setExpandedFund(null); }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
