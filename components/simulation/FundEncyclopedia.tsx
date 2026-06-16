"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FundId, FundCategory } from "@/types";
import { FUNDS, FUND_CATEGORIES, CATEGORY_ORDER, getFundsByCategory } from "@/lib/funds";
import { simulate, formatCurrency, START_YEAR_OPTIONS, MONTHLY_AMOUNT_OPTIONS } from "@/lib/simulation";
import { ChevronRight, BookOpen, Star, TrendingUp, AlertTriangle, CheckCircle, ChevronDown } from "lucide-react";

function RiskBadge({ level }: { level: number }) {
  const colors = ["", "#10b981", "#22c55e", "#f59e0b", "#f97316", "#ef4444"];
  const labels = ["", "超安定", "安定", "標準", "高リスク", "超高リスク"];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
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
      <span className="text-[10px] text-zinc-400 ml-1">初心者向け</span>
    </div>
  );
}

function InlineSimulator({
  fundId,
  onCompare,
}: {
  fundId: FundId;
  onCompare: (fundId: FundId) => void;
}) {
  const fund = FUNDS[fundId];
  const [year, setYear] = useState(2020);
  const [amount, setAmount] = useState(30000);

  const result = simulate({ fundId, startYear: year, startMonth: 1, monthlyAmount: amount });
  const isProfit = result.profit >= 0;

  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{ background: `${fund.color}10`, border: `1px solid ${fund.color}25` }}
    >
      <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400">
        もしあの時から積立ていたら？
      </p>

      {/* Controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full appearance-none rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            {START_YEAR_OPTIONS.map((y) => (
              <option key={y} value={y} className="bg-zinc-900">{y}年から</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
        </div>
        <div className="relative flex-1">
          <select
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full appearance-none rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            {MONTHLY_AMOUNT_OPTIONS.map((a) => (
              <option key={a} value={a} className="bg-zinc-900">月{(a / 10000).toFixed(0)}万円</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
        </div>
      </div>

      {/* Result */}
      <motion.div
        key={`${year}-${amount}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-2"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 mb-0.5">利益</p>
            <div className="flex items-baseline gap-1.5">
              <p
                className="font-heading font-number text-3xl font-bold"
                style={{ color: isProfit ? "#10b981" : "#ef4444" }}
              >
                {isProfit ? "+" : ""}{formatCurrency(result.profit)}
              </p>
              <span className="font-number text-sm font-bold" style={{ color: isProfit ? "#10b981" : "#ef4444" }}>
                （{isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%）
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end mb-0.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] text-zinc-400">現在資産</span>
            </div>
            <p className="text-xs font-bold text-zinc-300">
              {formatCurrency(result.finalValue)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: fund.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, (result.finalValue / (result.totalPrincipal * 2)) * 100))}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>

      {/* Compare CTA */}
      <button
        onClick={() => onCompare(fundId)}
        className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold text-zinc-400 border border-white/10 hover:text-zinc-200 hover:border-white/20 transition-all"
      >
        比較モードで詳しく見る
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function FundDetailCard({
  fundId,
  onCompare,
}: {
  fundId: FundId;
  onCompare: (fundId: FundId) => void;
}) {
  const fund = FUNDS[fundId];
  const enc = fund.encyclopedia;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${fund.color}35`,
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-sm text-zinc-300 leading-relaxed font-medium mb-3">
          {enc.catchCopy}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
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

        <BeginnerScore score={enc.beginnerScore} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-5 pb-3">
        <div>
          <p className="text-[10px] text-zinc-400 mb-0.5">信託報酬</p>
          <p className="text-xs font-bold text-zinc-300">{enc.managementFee}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-400 mb-0.5">ボラティリティ</p>
          <p className="text-xs font-bold text-zinc-300">{enc.volatility}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-400 mb-0.5">推奨期間</p>
          <p className="text-xs font-bold text-zinc-300">{enc.expectedHorizon}</p>
        </div>
      </div>

      {/* For whom */}
      <div className="px-5 pb-3">
        <p className="text-[10px] text-zinc-400 mb-1 font-black tracking-widest uppercase">こんな人向け</p>
        <p className="text-xs text-zinc-400 leading-relaxed">{enc.forWhom}</p>
      </div>

      {/* Pros/Cons */}
      <div className="px-5 pb-4 space-y-1.5">
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

      {/* Inline simulator */}
      <div className="px-4 pb-4">
        <InlineSimulator fundId={fundId} onCompare={onCompare} />
      </div>
    </motion.div>
  );
}

interface Props {
  onSimulate: (fundId: FundId) => void;
  initialExpanded?: FundId;
}

export default function FundEncyclopedia({ onSimulate, initialExpanded }: Props) {
  const [activeCategory, setActiveCategory] = useState<FundCategory>(() => {
    if (initialExpanded) return FUNDS[initialExpanded].category;
    return "global";
  });
  const [expandedFund, setExpandedFund] = useState<FundId | null>(initialExpanded ?? null);

  const funds = getFundsByCategory(activeCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-indigo-400" />
        <p className="font-heading text-sm font-semibold text-white">銘柄図鑑</p>
        <span className="text-xs text-zinc-400">タップして詳細・シミュレーション</span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
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
                  : "bg-white/[0.04] text-zinc-400 border-white/8 hover:text-zinc-300"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category description */}
      <p className="text-xs text-zinc-400">{FUND_CATEGORIES[activeCategory].description}</p>

      {/* Fund list */}
      <div className="space-y-2">
        {funds.map((fund) => {
          const isExpanded = expandedFund === fund.id;
          const enc = fund.encyclopedia;

          return (
            <div key={fund.id}>
              <motion.button
                onClick={() => setExpandedFund(isExpanded ? null : fund.id)}
                className="w-full rounded-2xl p-4 text-left transition-all"
                style={{
                  background: isExpanded ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isExpanded ? fund.color + "40" : "rgba(255,255,255,0.08)"}`,
                }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: `${fund.color}20` }}
                  >
                    {FUND_CATEGORIES[fund.category].emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-heading text-sm font-semibold text-white">{enc.nickname}</p>
                      {enc.nisaCompatible && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          NISA
                        </span>
                      )}
                      <RiskBadge level={fund.riskLevel} />
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">{enc.formalName}</p>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 text-zinc-400 flex-shrink-0 transition-transform duration-300"
                    style={{ transform: isExpanded ? "rotate(90deg)" : "none" }}
                  />
                </div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden mt-2"
                  >
                    <FundDetailCard
                      fundId={fund.id}
                      onCompare={(id) => {
                        onSimulate(id);
                        setExpandedFund(null);
                      }}
                    />
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
