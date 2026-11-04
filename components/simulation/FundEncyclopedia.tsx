"use client";

import { useState } from "react";
import ReturnQualityPill from "@/components/common/ReturnQualityPill";
import { motion, AnimatePresence } from "framer-motion";
import { FundId, FundCategory } from "@/types";
import { FUNDS, FUND_CATEGORIES, CATEGORY_ORDER, formatExpenseRatio, getFundsByCategory } from "@/lib/funds";
import { simulate, formatCurrency, START_YEAR_OPTIONS, MONTHLY_AMOUNT_OPTIONS } from "@/lib/simulation";
import { ChevronRight, BookOpen, TrendingUp, AlertTriangle, CheckCircle, ChevronDown } from "lucide-react";
import { isVerifiedReturnSeries } from "@/lib/return-series";
import Link from "next/link";

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

  if (!isVerifiedReturnSeries(fundId)) {
    return (
      <div className="space-y-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
        <p className="text-xs font-bold text-amber-800">G品質・数値シミュレーション対象外</p>
        <p className="text-xs leading-relaxed text-slate-600">
          月次原典、通貨、分配金、費用、為替処理が未検証のため、評価額・利益・リターンは表示しません。
        </p>
        <Link href="/fund/schd" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#D2DEE4] px-3 text-xs font-bold text-slate-700">
          商品属性を確認する
        </Link>
      </div>
    );
  }

  const result = simulate({ fundId, startYear: year, startMonth: 1, monthlyAmount: amount });
  const isProfit = result.profit >= 0;

  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{ background: `${fund.color}10`, border: `1px solid ${fund.color}25` }}
    >
      <div>
        <p className="text-xs font-bold text-[#236B8E]">過去実績を試す</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">開始年と月額を変えて、元本・期間末評価額・損益を確認します。</p>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="min-h-11 w-full appearance-none rounded-lg border border-[#D2DEE4] bg-[#EAF3F7]0 px-3 py-2 text-xs font-bold text-[#263A53] focus:outline-none cursor-pointer"
          >
            {START_YEAR_OPTIONS.map((y) => (
              <option key={y} value={y} className="bg-white">{y}年から</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-600" />
        </div>
        <div className="relative flex-1">
          <select
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="min-h-11 w-full appearance-none rounded-lg border border-[#D2DEE4] bg-[#EAF3F7]0 px-3 py-2 text-xs font-bold text-[#263A53] focus:outline-none cursor-pointer"
          >
            {MONTHLY_AMOUNT_OPTIONS.map((a) => (
              <option key={a} value={a} className="bg-white">月{(a / 10000).toFixed(0)}万円</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-600" />
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-slate-600 mb-0.5">元本</p>
            <p className="text-sm font-bold text-[#263A53]">{formatCurrency(result.totalPrincipal)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 justify-end mb-0.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-700" />
              <span className="text-xs text-slate-600">期間末評価額</span>
            </div>
            <p className="text-right text-lg font-bold text-[#263A53]">
              {formatCurrency(result.finalValue)}
            </p>
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-[#DDE6EA] pt-2">
          <span className="text-xs text-slate-600">損益</span>
          <p className="font-number text-base font-bold" style={{ color: isProfit ? "#047857" : "#b91c1c" }}>
            {isProfit ? "+" : ""}{formatCurrency(result.profit)}（{isProfit ? "+" : ""}{result.returnRate.toFixed(1)}%）
          </p>
        </div>
      </motion.div>

      {/* Compare CTA */}
      <button
        onClick={() => onCompare(fundId)}
        className="min-h-11 w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold text-slate-600 border border-[#D2DEE4] hover:text-slate-700 hover:border-[#B9CBD4] transition-all"
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
        background: "#FFFFFF",
        border: `1px solid ${fund.color}35`,
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <p className="mb-1 text-xs font-bold text-[#236B8E]">商品概要</p>
        <p className="text-sm text-slate-700 leading-relaxed font-medium mb-3">
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

        <ReturnQualityPill fundId={fund.id} />
        <p className="mt-2 text-xs leading-5 text-slate-600">
          {isVerifiedReturnSeries(fund.id)
            ? "Aは、公式一次情報まで確認した月次データです。"
            : "Gは参考系列です。未検証の数値は試算や順位に使用しません。"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 px-5 pb-3">
        <div>
          <p className="text-xs font-bold text-[#236B8E] mb-1">費用</p>
          <p className="text-xs text-slate-600">信託報酬・経費率</p>
          <p className="mt-0.5 text-sm font-bold text-slate-700">{formatExpenseRatio(fundId)}</p>
        </div>
      </div>

      {/* For whom */}
      {enc.forWhom && <div className="px-5 pb-3">
        <p className="text-xs text-slate-600 mb-1 font-black tracking-widest uppercase">選ぶ前の確認事項</p>
        <p className="text-xs text-slate-600 leading-relaxed">{enc.forWhom}</p>
      </div>}

      {/* Pros/Cons */}
      <div className="px-5 pb-4 space-y-1.5">
        <p className="pb-1 text-xs font-bold text-[#236B8E]">特徴と注意点</p>
        {enc.pros.slice(0, 2).map((p) => (
          <div key={p} className="flex items-start gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600">{p}</p>
          </div>
        ))}
        {enc.cons.slice(0, fund.riskLevel === null ? enc.cons.length : 1).map((c) => (
          <div key={c} className="flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600">{c}</p>
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
        <BookOpen className="h-4 w-4 text-[#236B8E]" />
        <p className="font-heading text-sm font-semibold text-[#263A53]">銘柄図鑑</p>
        <span className="text-xs text-slate-600">投資対象・費用・品質を比べる</span>
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
              className={`min-h-11 flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
                isActive
                  ? "bg-[#DCEFFA] text-[#263A53] border-[#B9CBD4]"
                  : "bg-[#F7FAFB] text-slate-600 border-[#D9E3E8] hover:text-slate-700"
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category description */}
      <p className="text-xs text-slate-600">{FUND_CATEGORIES[activeCategory].description}</p>

      {/* Fund list */}
      <div className="space-y-2">
        {funds.map((fund) => {
          const isExpanded = expandedFund === fund.id;
          const enc = fund.encyclopedia;

          return (
            <div key={fund.id}>
              <motion.button
                onClick={() => setExpandedFund(isExpanded ? null : fund.id)}
                aria-expanded={isExpanded}
                aria-controls={`fund-details-${fund.id}`}
                className="w-full rounded-2xl p-4 text-left transition-all"
                style={{
                  background: isExpanded ? "#F8FBFC" : "#FFFFFF",
                  border: `1px solid ${isExpanded ? fund.color + "40" : "#D9E3E8"}`,
                }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-heading text-sm font-semibold text-[#263A53]">{enc.nickname}</p>
                    </div>
                    <p className="mt-0.5 text-xs leading-5 text-slate-600">{fund.description}</p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-600">
                      費用 {formatExpenseRatio(fund.id)} ・ {isVerifiedReturnSeries(fund.id) ? "公式月次 A" : "参考 G"} ・ {enc.nisaSupport.tsumitate ? "つみたて・成長" : enc.nisaSupport.growth ? "成長投資枠" : "取扱金融機関で確認"}
                    </p>
                  </div>
                  <ChevronDown className={`h-4 w-4 flex-none text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} aria-hidden="true" />
                </div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`fund-details-${fund.id}`}
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
