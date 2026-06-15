"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FundId } from "@/types";
import {
  simulate,
  simulateAll,
  formatCurrency,
  START_YEAR_OPTIONS,
  MONTH_OPTIONS,
} from "@/lib/simulation";
import { QuickScenario } from "@/lib/scenarios";
import FundSelector from "@/components/simulation/FundSelector";
import ResultCard from "@/components/simulation/ResultCard";
import WinnerBanner from "@/components/simulation/WinnerBanner";
import ComparisonChart from "@/components/simulation/ComparisonChart";
import RankingView from "@/components/simulation/RankingView";
import ShareCard from "@/components/simulation/ShareCard";
import EmotionalMessage from "@/components/simulation/EmotionalMessage";
import QuickScenarios from "@/components/simulation/QuickScenarios";
import CalculationDetails from "@/components/simulation/CalculationDetails";
import FundEncyclopedia from "@/components/simulation/FundEncyclopedia";
import AdvancedSimulation from "@/components/simulation/AdvancedSimulation";
import { ChevronDown, Zap, BarChart3, Trophy, BookOpen, Settings2 } from "lucide-react";

const MONTHLY_AMOUNTS = [10000, 20000, 30000, 50000, 100000];
type Tab = "compare" | "ranking" | "encyclopedia";

export default function Home() {
  const [tab, setTab] = useState<Tab>("compare");
  const [fundA, setFundA] = useState<FundId>("sp500");
  const [fundB, setFundB] = useState<FundId>("orcan");
  const [startYear, setStartYear] = useState(2020);
  const [startMonth, setStartMonth] = useState(1);
  const [monthlyAmount, setMonthlyAmount] = useState(30000);
  const [showResult, setShowResult] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSimulate = useCallback(() => {
    setShowResult(true);
    setShowShare(false);
    setTimeout(() => {
      document.getElementById("result-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }, []);

  const handleScenarioSelect = useCallback((scenario: QuickScenario) => {
    setFundA(scenario.fundId);
    setStartYear(scenario.startYear);
    setStartMonth(scenario.startMonth);
    setMonthlyAmount(scenario.monthlyAmount);
    setTab("compare");
    setShowResult(true);
    setShowShare(false);
    setTimeout(() => {
      document.getElementById("result-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }, []);

  const handleEncyclopediaSimulate = useCallback((fundId: FundId) => {
    setFundA(fundId);
    setTab("compare");
    setShowResult(true);
    setShowShare(false);
    setTimeout(() => {
      document.getElementById("result-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }, []);

  const resultA = useMemo(() => {
    if (!showResult) return null;
    return simulate({ fundId: fundA, startYear, startMonth, monthlyAmount });
  }, [showResult, fundA, startYear, startMonth, monthlyAmount]);

  const resultB = useMemo(() => {
    if (!showResult) return null;
    return simulate({ fundId: fundB, startYear, startMonth, monthlyAmount });
  }, [showResult, fundB, startYear, startMonth, monthlyAmount]);

  const ranking = useMemo(() => {
    if (!showResult || tab !== "ranking") return [];
    return simulateAll(startYear, startMonth, monthlyAmount);
  }, [showResult, tab, startYear, startMonth, monthlyAmount]);

  const winnerResult = resultA && resultB
    ? resultA.profit >= resultB.profit ? resultA : resultB
    : null;
  const loserResult = resultA && resultB
    ? resultA.profit >= resultB.profit ? resultB : resultA
    : null;
  const difference = resultA && resultB
    ? Math.abs(resultA.profit - resultB.profit)
    : 0;

  const yearsElapsed = useMemo(() => {
    const start = startYear + (startMonth - 1) / 12;
    const end = 2025 + 5 / 12;
    return Math.max(1, end - start);
  }, [startYear, startMonth]);

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #6366f115 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #f59e0b0a 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-lg mx-auto px-4 pb-24">

        {/* ─── HERO ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pt-14 pb-8 text-center"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 mb-5">
            <span className="text-xs">⏰</span>
            <span className="text-xs font-semibold text-indigo-300">積立タイムマシン</span>
          </div>
          <h1 className="text-4xl sm:text-[2.8rem] font-black tracking-tight text-white leading-[1.1] mb-3">
            もし
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #f59e0b 100%)" }}
            >
              {startYear}年
            </span>
            から<br />
            始めていたら？
          </h1>
          <p className="text-zinc-400 text-sm">
            過去の実績で「たられば」を体験する
          </p>
        </motion.div>

        {/* ─── QUICK SCENARIOS ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <QuickScenarios onSelect={handleScenarioSelect} />
        </motion.div>

        {/* ─── TAB NAVIGATION ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="flex rounded-xl border border-white/10 bg-white/[0.04] p-1 gap-1 mb-5"
        >
          {([
            { id: "compare" as const, label: "比較", icon: BarChart3 },
            { id: "ranking" as const, label: "ランキング", icon: Trophy },
            { id: "encyclopedia" as const, label: "銘柄図鑑", icon: BookOpen },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setShowResult(false); }}
              className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-2.5 text-[11px] font-bold transition-all duration-200 ${
                tab === id
                  ? "bg-white/15 text-white"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </motion.div>

        {/* ─── ENCYCLOPEDIA TAB ─── */}
        <AnimatePresence mode="wait">
          {tab === "encyclopedia" && (
            <motion.div
              key="encyclopedia"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <FundEncyclopedia onSimulate={handleEncyclopediaSimulate} />
            </motion.div>
          )}

          {tab !== "encyclopedia" && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* ─── INPUT PANEL ─── */}
              {/* Common conditions */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 space-y-5">
                {/* Start date */}
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-3">
                    積立開始
                  </p>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <select
                        value={startYear}
                        onChange={(e) => { setStartYear(Number(e.target.value)); setShowResult(false); }}
                        className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-indigo-500/60 transition-all cursor-pointer"
                      >
                        {START_YEAR_OPTIONS.map((y) => (
                          <option key={y} value={y}>{y}年</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    </div>
                    <div className="relative w-28">
                      <select
                        value={startMonth}
                        onChange={(e) => { setStartMonth(Number(e.target.value)); setShowResult(false); }}
                        className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-indigo-500/60 transition-all cursor-pointer"
                      >
                        {MONTH_OPTIONS.map((m) => (
                          <option key={m} value={m}>{m}月</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-600">
                    約{yearsElapsed.toFixed(1)}年間（{Math.round(yearsElapsed * 12)}ヶ月）のシミュレーション
                  </p>
                </div>

                {/* Monthly amount */}
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500">毎月の積立額</p>
                    <span className="text-xl font-black text-white">{formatCurrency(monthlyAmount)}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {MONTHLY_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => { setMonthlyAmount(amount); setShowResult(false); }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${
                          monthlyAmount === amount
                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                            : "bg-white/5 text-zinc-500 border-white/8 hover:bg-white/10 hover:text-zinc-300"
                        }`}
                      >
                        {formatCurrency(amount)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fund selectors (compare mode) */}
              <AnimatePresence mode="wait">
                {tab === "compare" && (
                  <motion.div
                    key="compare-funds"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                      <FundSelector
                        value={fundA}
                        onChange={(id) => { setFundA(id); setShowResult(false); }}
                        label="プランA"
                        accentColor="#6366f1"
                      />
                    </div>
                    <div className="flex items-center gap-3 my-1">
                      <div className="flex-1 h-px bg-white/8" />
                      <span className="text-[10px] text-zinc-600 font-black tracking-widest">VS</span>
                      <div className="flex-1 h-px bg-white/8" />
                    </div>
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                      <FundSelector
                        value={fundB}
                        onChange={(id) => { setFundB(id); setShowResult(false); }}
                        label="プランB"
                        accentColor="#f59e0b"
                      />
                    </div>
                  </motion.div>
                )}

                {tab === "ranking" && (
                  <motion.div
                    key="ranking-info"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5"
                  >
                    <p className="text-sm font-bold text-zinc-200 mb-1.5">🏆 全銘柄で徹底比較</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      上の条件で全銘柄をすべてランキング。どれが最も増えていたか、一目でわかります。
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSimulate}
                className="w-full relative overflow-hidden rounded-2xl py-5 text-base font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #f59e0b 100%)",
                  boxShadow: "0 8px 32px #6366f128, 0 0 0 1px #6366f120",
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 hover:opacity-100"
                  style={{ background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #fbbf24 100%)" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5" />
                  タイムマシンを起動する
                </span>
              </motion.button>

              {/* Advanced simulation toggle — hidden from beginners */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <button
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="flex items-center gap-1.5 text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors"
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
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
                      <AdvancedSimulation />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ─── RESULTS ─── */}
              <AnimatePresence>
                {showResult && resultA && resultB && tab === "compare" && winnerResult && loserResult && (
                  <motion.div
                    id="result-section"
                    key="compare-result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-8 space-y-5"
                  >
                    {/* Context */}
                    <div className="text-center mb-1">
                      <p className="text-[10px] font-black tracking-widest uppercase text-zinc-600 mb-1">
                        シミュレーション結果
                      </p>
                      <p className="text-xs text-zinc-500">
                        {startYear}年{startMonth}月〜2025年6月 · 毎月{formatCurrency(monthlyAmount)}
                      </p>
                    </div>

                    {/* Winner Banner */}
                    <WinnerBanner
                      winner={winnerResult}
                      loser={loserResult}
                      difference={difference}
                    />

                    {/* Emotional Message */}
                    <EmotionalMessage result={winnerResult} yearsElapsed={yearsElapsed} />

                    {/* Result Cards */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <ResultCard result={resultA} label="プランA" isWinner={resultA.profit >= resultB.profit} delay={0} />
                      <ResultCard result={resultB} label="プランB" isWinner={resultB.profit > resultA.profit} delay={0.08} />
                    </div>

                    {/* Chart */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                    >
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500">
                          資産推移グラフ
                        </p>
                        <div className="flex items-center gap-3">
                          {[resultA, resultB].map((r) => (
                            <div key={r.fundId} className="flex items-center gap-1.5">
                              <div className="h-2 w-2 rounded-full" style={{ background: r.fundColor }} />
                              <span className="text-[10px] text-zinc-500">{r.fundName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ComparisonChart planA={resultA} planB={resultB} />
                    </motion.div>

                    {/* Calculation Details — trust signals */}
                    <CalculationDetails resultA={resultA} resultB={resultB} />

                    {/* Share */}
                    <AnimatePresence>
                      {showShare && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
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

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => setShowShare((v) => !v)}
                      className={`w-full rounded-2xl border py-3.5 text-sm font-bold transition-all ${
                        showShare
                          ? "border-white/15 bg-white/8 text-zinc-300"
                          : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/8 hover:text-zinc-200"
                      }`}
                    >
                      {showShare ? "閉じる" : "📤 この結果をシェアする"}
                    </motion.button>

                    <p className="text-center text-[10px] text-zinc-700 leading-relaxed px-4">
                      ※ 過去実績に基づくシミュレーションです。将来の運用成果を保証するものではありません。
                      実際の投資では手数料・税金が発生します。
                    </p>
                  </motion.div>
                )}

                {showResult && tab === "ranking" && (
                  <motion.div
                    id="result-section"
                    key="ranking-result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-8"
                  >
                    <RankingView
                      ranking={ranking}
                      monthlyAmount={monthlyAmount}
                      startYear={startYear}
                      startMonth={startMonth}
                    />
                    <p className="mt-6 text-center text-[10px] text-zinc-700 leading-relaxed px-4">
                      ※ 過去実績に基づくシミュレーションです。将来の運用成果を保証するものではありません。
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer note */}
              {!showResult && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mt-12 text-center text-[10px] text-zinc-700"
                >
                  2015年以降の実績データを使用 · 手数料・税金は考慮していません
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
