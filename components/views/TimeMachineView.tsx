"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FundId } from "@/types";
import { simulate, simulateAll, formatCurrency, START_YEAR_OPTIONS, MONTH_OPTIONS, MONTHLY_AMOUNT_OPTIONS } from "@/lib/simulation";
import FundSelector from "@/components/simulation/FundSelector";
import ResultCard from "@/components/simulation/ResultCard";
import EmotionalMessage from "@/components/simulation/EmotionalMessage";
import ComparisonChart from "@/components/simulation/ComparisonChart";
import ShareCard from "@/components/simulation/ShareCard";
import CalculationDetails from "@/components/simulation/CalculationDetails";
import RankingView from "@/components/simulation/RankingView";
import QuickScenarios from "@/components/simulation/QuickScenarios";
import AdvancedSimulation from "@/components/simulation/AdvancedSimulation";
import { QuickScenario } from "@/lib/scenarios";
import { ChevronDown, Zap, Trophy, Settings2 } from "lucide-react";

type SubMode = "single" | "ranking";

interface Props {
  initialFund?: FundId;
  initialYear?: number;
  initialMonth?: number;
  initialAmount?: number;
  autoRun?: boolean;
  onCompare: (fundId: FundId) => void;
}

const MONTHLY_AMOUNTS = [10000, 30000, 50000, 100000];

export default function TimeMachineView({
  initialFund = "orcan",
  initialYear = 2020,
  initialMonth = 1,
  initialAmount = 30000,
  autoRun = false,
  onCompare,
}: Props) {
  const [fund, setFund] = useState<FundId>(initialFund);
  const [startYear, setStartYear] = useState(initialYear);
  const [startMonth, setStartMonth] = useState(initialMonth);
  const [monthlyAmount, setMonthlyAmount] = useState(initialAmount);
  const [showResult, setShowResult] = useState(autoRun);
  const [showShare, setShowShare] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [subMode, setSubMode] = useState<SubMode>("single");

  const handleScenario = useCallback((s: QuickScenario) => {
    setFund(s.fundId);
    setStartYear(s.startYear);
    setStartMonth(s.startMonth);
    setMonthlyAmount(s.monthlyAmount);
    setSubMode("single");
    setShowResult(true);
    setShowShare(false);
    setTimeout(() => {
      document.getElementById("tm-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }, []);

  const result = useMemo(
    () => (showResult ? simulate({ fundId: fund, startYear, startMonth, monthlyAmount }) : null),
    [showResult, fund, startYear, startMonth, monthlyAmount]
  );

  const ranking = useMemo(
    () => (showResult && subMode === "ranking" ? simulateAll(startYear, startMonth, monthlyAmount) : []),
    [showResult, subMode, startYear, startMonth, monthlyAmount]
  );

  const yearsElapsed = useMemo(() => {
    const start = startYear + (startMonth - 1) / 12;
    return Math.max(1, (2025 + 5 / 12) - start);
  }, [startYear, startMonth]);

  const run = () => {
    setShowResult(true);
    setShowShare(false);
    setTimeout(() => {
      document.getElementById("tm-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  return (
    <div className="pt-12 pb-28 px-4 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center pt-4"
      >
        <h2 className="font-heading text-2xl font-bold text-white mb-1">🕰️ 積立タイムマシン</h2>
        <p className="text-sm text-zinc-400">あの時から積み立てていたら、いくらになった？</p>
      </motion.div>

      {/* Quick Scenarios */}
      <QuickScenarios onSelect={handleScenario} />

      {/* Sub mode */}
      <div className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1 gap-1">
        <button
          onClick={() => setSubMode("single")}
          className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${subMode === "single" ? "bg-white/15 text-white" : "text-zinc-400"}`}
        >
          🎯 銘柄ひとつ
        </button>
        <button
          onClick={() => setSubMode("ranking")}
          className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-2.5 text-xs font-bold transition-all ${subMode === "ranking" ? "bg-white/15 text-white" : "text-zinc-400"}`}
        >
          <Trophy className="h-3.5 w-3.5" />
          全銘柄ランキング
        </button>
      </div>

      {/* Inputs */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-5">
        {/* Start year — chips */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400">積立開始年</p>
            <p className="text-[11px] text-zinc-400">
              約{yearsElapsed.toFixed(1)}年間
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scroll-touch" style={{ scrollbarWidth: "none" }}>
            {START_YEAR_OPTIONS.map((y) => (
              <button
                key={y}
                onClick={() => { setStartYear(y); setShowResult(false); }}
                className={`flex-shrink-0 rounded-xl text-sm font-black transition-all border ${
                  startYear === y
                    ? "bg-indigo-500/25 text-indigo-300 border-indigo-500/50"
                    : "bg-white/5 text-zinc-400 border-white/8 hover:text-zinc-300"
                }`}
                style={{ minHeight: 44, minWidth: 64, padding: "0 12px" }}
              >
                {y}年
              </button>
            ))}
          </div>
          {/* Month — small, secondary */}
          <div className="flex gap-2 mt-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {MONTH_OPTIONS.map((m) => (
              <button
                key={m}
                onClick={() => { setStartMonth(m); setShowResult(false); }}
                className={`flex-shrink-0 rounded-lg text-xs font-bold transition-all ${
                  startMonth === m
                    ? "bg-white/15 text-white"
                    : "text-zinc-400 hover:text-zinc-400"
                }`}
                style={{ minHeight: 32, minWidth: 36, padding: "0 6px" }}
              >
                {m}月
              </button>
            ))}
          </div>
        </div>

        {/* Monthly amount */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400">毎月の積立額</p>
            <span className="text-xl font-black text-white">{formatCurrency(monthlyAmount)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {MONTHLY_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => { setMonthlyAmount(a); setShowResult(false); }}
                className={`rounded-xl text-sm font-black transition-all border ${
                  monthlyAmount === a
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                    : "bg-white/5 text-zinc-400 border-white/8 hover:bg-white/10 hover:text-zinc-300"
                }`}
                style={{ minHeight: 48 }}
              >
                {formatCurrency(a)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fund selector — single mode only */}
      <AnimatePresence>
        {subMode === "single" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
              <FundSelector
                value={fund}
                onChange={(id) => { setFund(id); setShowResult(false); }}
                label="銘柄"
                accentColor="#6366f1"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={run}
        className="w-full relative overflow-hidden rounded-2xl py-5 text-base font-black text-white"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #f59e0b 100%)",
          boxShadow: "0 8px 32px #6366f128",
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <Zap className="h-5 w-5" />
          タイムマシンを起動する
        </span>
      </motion.button>

      {/* Advanced toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-zinc-400 transition-colors"
        >
          <Settings2 className="h-3 w-3" />
          {showAdvanced ? "詳細設定を閉じる" : "詳細シミュレーション（上級者向け）"}
        </button>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
              <AdvancedSimulation />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {showResult && subMode === "single" && result && (
          <motion.div
            id="tm-result"
            key="single-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="text-center">
              <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-1">シミュレーション結果</p>
              <p className="text-xs text-zinc-400">
                {startYear}年{startMonth}月〜2025年6月 · 毎月{formatCurrency(monthlyAmount)}
              </p>
            </div>

            {/* Profit hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl p-6 text-center"
              style={{
                background: `linear-gradient(145deg, ${result.fundColor}18 0%, rgba(255,255,255,0.03) 100%)`,
                border: `1px solid ${result.fundColor}30`,
                boxShadow: `0 0 36px ${result.fundColor}14`,
              }}
            >
              <p className="text-xs text-zinc-400 mb-1">{result.fundName}の利益</p>
              <p className="font-number text-5xl font-black text-emerald-400 mb-1">
                +{formatCurrency(result.profit)}
              </p>
              <p className="text-sm text-zinc-400">
                +{result.returnRate.toFixed(1)}% · {formatCurrency(result.totalPrincipal)} → {formatCurrency(result.finalValue)}
              </p>
            </motion.div>

            <EmotionalMessage result={result} yearsElapsed={yearsElapsed} />
            <ResultCard result={result} label="" isWinner delay={0} />

            {/* Compare CTA */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center space-y-3">
              <p className="text-xs text-zinc-400">他の銘柄と比較してみる</p>
              <button
                onClick={() => onCompare(fund)}
                className="w-full rounded-xl py-3 text-sm font-bold border border-white/15 text-zinc-300 hover:bg-white/8 transition-colors"
              >
                ⚔️ 比較モードへ
              </button>
            </div>

            <CalculationDetails resultA={result} />

            <AnimatePresence>
              {showShare && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ShareCard
                    planA={result}
                    startYear={startYear}
                    startMonth={startMonth}
                    monthlyAmount={monthlyAmount}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setShowShare((v) => !v)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-bold text-zinc-400 hover:bg-white/8"
            >
              {showShare ? "閉じる" : "📤 この結果をシェアする"}
            </button>

            <p className="text-center text-xs text-zinc-400 px-4 leading-relaxed">
              ※ 過去実績に基づくシミュレーションです。将来の運用成果を保証しません。
            </p>
          </motion.div>
        )}

        {showResult && subMode === "ranking" && (
          <motion.div
            id="tm-result"
            key="ranking-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RankingView
              ranking={ranking}
              monthlyAmount={monthlyAmount}
              startYear={startYear}
              startMonth={startMonth}
            />
            <p className="mt-4 text-center text-xs text-zinc-400 px-4 leading-relaxed">
              ※ 過去実績に基づくシミュレーションです。将来を保証しません。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
