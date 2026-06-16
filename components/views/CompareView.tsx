"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FundId } from "@/types";
import { simulate, formatCurrency, START_YEAR_OPTIONS, MONTH_OPTIONS } from "@/lib/simulation";
import { FUNDS } from "@/lib/funds";
import FundSelector from "@/components/simulation/FundSelector";
import ResultCard from "@/components/simulation/ResultCard";
import WinnerBanner from "@/components/simulation/WinnerBanner";
import ComparisonChart from "@/components/simulation/ComparisonChart";
import ShareCard from "@/components/simulation/ShareCard";
import CalculationDetails from "@/components/simulation/CalculationDetails";
import { ChevronDown, Zap } from "lucide-react";

const MONTHLY_AMOUNTS = [10000, 20000, 30000, 50000, 100000];

interface Props {
  initialFundA?: FundId;
}

export default function CompareView({ initialFundA = "sp500" }: Props) {
  const [fundA, setFundA] = useState<FundId>(initialFundA);
  const [fundB, setFundB] = useState<FundId>("orcan");
  const [startYear, setStartYear] = useState(2020);
  const [startMonth, setStartMonth] = useState(1);
  const [monthlyAmount, setMonthlyAmount] = useState(30000);
  const [showResult, setShowResult] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const run = useCallback(() => {
    setShowResult(true);
    setShowShare(false);
    setTimeout(() => {
      document.getElementById("compare-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }, []);

  const resultA = useMemo(
    () => (showResult ? simulate({ fundId: fundA, startYear, startMonth, monthlyAmount }) : null),
    [showResult, fundA, startYear, startMonth, monthlyAmount]
  );
  const resultB = useMemo(
    () => (showResult ? simulate({ fundId: fundB, startYear, startMonth, monthlyAmount }) : null),
    [showResult, fundB, startYear, startMonth, monthlyAmount]
  );

  const winnerResult = resultA && resultB ? (resultA.profit >= resultB.profit ? resultA : resultB) : null;
  const loserResult  = resultA && resultB ? (resultA.profit >= resultB.profit ? resultB : resultA) : null;
  const difference   = resultA && resultB ? Math.abs(resultA.profit - resultB.profit) : 0;

  const yearsElapsed = useMemo(() => {
    return Math.max(1, (2025 + 5 / 12) - (startYear + (startMonth - 1) / 12));
  }, [startYear, startMonth]);

  return (
    <div className="pt-12 pb-28 px-4 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center pt-4"
      >
        <h2 className="font-heading text-2xl font-bold text-white mb-1">⚔️ 比較モード</h2>
        <p className="text-sm text-zinc-400">2つの銘柄を同じ条件で比べる</p>
      </motion.div>

      {/* Conditions */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-4">
        {/* Year chips */}
        <div>
          <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-2">積立開始年</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
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
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400">毎月の積立額</p>
            <span className="text-xl font-black text-white">{formatCurrency(monthlyAmount)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHLY_AMOUNTS.slice(0, 6).map((a) => (
              <button
                key={a}
                onClick={() => { setMonthlyAmount(a); setShowResult(false); }}
                className={`rounded-xl text-xs font-black transition-all border ${
                  monthlyAmount === a
                    ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                    : "bg-white/5 text-zinc-400 border-white/8 hover:bg-white/10"
                }`}
                style={{ minHeight: 44 }}
              >
                {formatCurrency(a)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fund A */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <FundSelector
          value={fundA}
          onChange={(id) => { setFundA(id); setShowResult(false); }}
          label="プランA"
          accentColor="#6366f1"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-[10px] text-zinc-400 font-black tracking-widest">VS</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Fund B */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
        <FundSelector
          value={fundB}
          onChange={(id) => { setFundB(id); setShowResult(false); }}
          label="プランB"
          accentColor="#f59e0b"
        />
      </div>

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
          比較する
        </span>
      </motion.button>

      {/* Results */}
      <AnimatePresence>
        {showResult && resultA && resultB && winnerResult && loserResult && (
          <motion.div
            id="compare-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="text-center">
              <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-1">比較結果</p>
              <p className="text-xs text-zinc-400">
                {startYear}年{startMonth}月〜2025年6月 · 毎月{formatCurrency(monthlyAmount)}
              </p>
            </div>

            <WinnerBanner winner={winnerResult} loser={loserResult} difference={difference} />

            {/* なぜ差が出たか */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <p className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">なぜ差が出たのか</p>
              {[winnerResult, loserResult].map((r, i) => {
                const enc = FUNDS[r.fundId].encyclopedia;
                return (
                  <div key={r.fundId} className="flex gap-3">
                    <div className="h-2 w-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: r.fundColor }} />
                    <div>
                      <p className="text-sm font-bold text-white mb-1">
                        {enc.nickname}{i === 0 ? "が勝った理由" : "の特徴"}
                      </p>
                      <ul className="space-y-0.5">
                        {enc.pros.slice(0, 3).map((p) => (
                          <li key={p} className="text-sm text-zinc-300 leading-relaxed">・{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResultCard result={resultA} label="プランA" isWinner={resultA.profit >= resultB.profit} delay={0} />
              <ResultCard result={resultB} label="プランB" isWinner={resultB.profit > resultA.profit} delay={0.08} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400">資産推移グラフ</p>
                <div className="flex items-center gap-3">
                  {[resultA, resultB].map((r) => (
                    <div key={r.fundId} className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ background: r.fundColor }} />
                      <span className="text-[10px] text-zinc-400">{r.fundName}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ComparisonChart planA={resultA} planB={resultB} />
            </div>

            <CalculationDetails resultA={resultA} resultB={resultB} />

            <AnimatePresence>
              {showShare && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ShareCard
                    planA={resultA}
                    planB={resultB}
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
      </AnimatePresence>
    </div>
  );
}
