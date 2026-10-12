"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FundId } from "@/types";
import { simulate, simulateAll, formatCurrency, MONTH_OPTIONS } from "@/lib/simulation";
import { VERIFIED_FUND_IDS, getAvailableEndMonth, getAvailableStartMonth, getCommonEndMonth, getCommonStartMonth, getStartYearOptions } from "@/lib/return-series";
import FundSelector from "@/components/simulation/FundSelector";
import EmotionalMessage from "@/components/simulation/EmotionalMessage";
import ShareCard from "@/components/simulation/ShareCard";
import CalculationDetails from "@/components/simulation/CalculationDetails";
import PathInsights from "@/components/simulation/PathInsights";
import SimulationChart from "@/components/simulation/SimulationChart";
import RankingView from "@/components/simulation/RankingView";
import QuickScenarios from "@/components/simulation/QuickScenarios";
import AdvancedSimulation from "@/components/simulation/AdvancedSimulation";
import { QuickScenario } from "@/lib/scenarios";
import { trackCalculate, trackCompareClick, trackSimulationStart } from "@/lib/analytics";
import { getReturnDataSource } from "@/lib/return-data-sources";
import { ChevronDown, Zap, Trophy, Settings2, GitCompareArrows, Share2, ShieldCheck, Clock3, Target } from "lucide-react";
import { saveRecentSimulation } from "@/lib/recent-simulations";

type SubMode = "single" | "ranking";

interface Props {
  initialFund?: FundId;
  initialYear?: number;
  initialMonth?: number;
  initialAmount?: number;
  autoRun?: boolean;
  onCompare: (fundId: FundId, conditions?: { year: number; month: number; amount: number }) => void;
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
  const [showCalcDetails, setShowCalcDetails] = useState(false);
  const [subMode, setSubMode] = useState<SubMode>("single");
  const startTracked = useRef(false);
  const markSimulationStart = (mode: SubMode = subMode) => {
    if (startTracked.current) return;
    startTracked.current = true;
    trackSimulationStart(mode, "time_machine");
  };
  const effectiveStart = subMode === "ranking" ? getCommonStartMonth(VERIFIED_FUND_IDS) : getAvailableStartMonth(fund);
  const availableYears = subMode === "ranking"
    ? Array.from({ length: 2025 - Number(effectiveStart.slice(0, 4)) + 1 }, (_, i) => Number(effectiveStart.slice(0, 4)) + i)
    : getStartYearOptions(fund);
  const minimumMonth = startYear === Number(effectiveStart.slice(0, 4)) ? Number(effectiveStart.slice(5, 7)) : 1;

  const selectMode = (mode: SubMode) => {
    markSimulationStart(mode);
    setSubMode(mode);
    const minimum = mode === "ranking" ? getCommonStartMonth(VERIFIED_FUND_IDS) : getAvailableStartMonth(fund);
    if (`${startYear}-${String(startMonth).padStart(2, "0")}` < minimum) {
      setStartYear(Number(minimum.slice(0, 4)));
      setStartMonth(Number(minimum.slice(5, 7)));
    }
    setShowResult(false);
  };

  const selectFund = (id: FundId) => {
    markSimulationStart();
    setFund(id);
    const minimum = getAvailableStartMonth(id);
    if (`${startYear}-${String(startMonth).padStart(2, "0")}` < minimum) {
      setStartYear(Number(minimum.slice(0, 4)));
      setStartMonth(Number(minimum.slice(5, 7)));
    }
    setShowResult(false);
  };

  const handleScenario = useCallback((s: QuickScenario) => {
    const end = getAvailableEndMonth(s.fundId).split("-").map(Number);
    simulate({ fundId: s.fundId, startYear: s.startYear, startMonth: s.startMonth, monthlyAmount: s.monthlyAmount });
    saveRecentSimulation({ mode: "single", fundA: s.fundId, startYear: s.startYear, startMonth: s.startMonth, endYear: end[0], endMonth: end[1], monthlyAmount: s.monthlyAmount });
    trackCalculate({ mode: "quick_scenario", fund_id: s.fundId, start_year: s.startYear, monthly_amount: s.monthlyAmount });
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
    const end = subMode === "ranking"
      ? getCommonEndMonth(VERIFIED_FUND_IDS)
      : getAvailableEndMonth(fund);
    const [endYear, endMonth] = end.split("-").map(Number);
    const start = startYear + (startMonth - 1) / 12;
    return Math.max(1, (endYear + (endMonth - 1) / 12) - start);
  }, [fund, startYear, startMonth, subMode]);

  const run = () => {
    markSimulationStart();
    if (subMode === "single") {
      const [endYear, endMonth] = getAvailableEndMonth(fund).split("-").map(Number);
      simulate({ fundId: fund, startYear, startMonth, monthlyAmount, endYear, endMonth });
      saveRecentSimulation({ mode: "single", fundA: fund, startYear, startMonth, endYear, endMonth, monthlyAmount });
    }
    trackCalculate({ mode: subMode, fund_id: subMode === "single" ? fund : undefined, start_year: startYear, monthly_amount: monthlyAmount });
    setShowResult(true);
    setShowShare(false);
    setTimeout(() => {
      document.getElementById("tm-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 pb-28 pt-6 md:pt-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h2 className="font-heading text-xl font-semibold text-[#263A53] mb-1 flex items-center justify-center gap-2">
          <Clock3 className="h-5 w-5 text-[#236B8E]" />
          積立タイムマシン
        </h2>
        <p className="text-sm text-slate-600">あの時から積み立てていたら、いくらになった？</p>
      </motion.div>

      {/* Quick Scenarios */}
      <QuickScenarios onSelect={handleScenario} />

      {/* Sub mode */}
      <div className="flex rounded-xl border border-[#D2DEE4] bg-[#F7FAFB] p-1 gap-1">
        <button
          onClick={() => selectMode("single")}
          aria-pressed={subMode === "single"}
          className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition-all ${subMode === "single" ? "bg-[#DCEFFA] text-[#263A53]" : "text-slate-600"}`}
        >
          <span className="inline-flex items-center gap-1"><Target className="h-3.5 w-3.5" />銘柄ひとつ</span>
        </button>
        <button
          onClick={() => selectMode("ranking")}
          aria-pressed={subMode === "ranking"}
          className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-2.5 text-xs font-bold transition-all ${subMode === "ranking" ? "bg-[#DCEFFA] text-[#263A53]" : "text-slate-600"}`}
        >
          <Trophy className="h-3.5 w-3.5" />
          全銘柄ランキング
        </button>
      </div>

      {/* Inputs */}
      <div className="rounded-2xl border border-[#D2DEE4] bg-[#F7FAFB] p-4 space-y-5">
        {/* Start year — chips */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs font-black tracking-widest uppercase text-slate-600">積立開始年</p>
            <p className="text-xs text-slate-600">
              約{yearsElapsed.toFixed(1)}年間
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scroll-touch" style={{ scrollbarWidth: "none" }}>
            {availableYears.map((y) => (
              <button
                key={y}
                onClick={() => { markSimulationStart(); setStartYear(y); setShowResult(false); }}
                aria-pressed={startYear === y}
                className={`flex-shrink-0 rounded-xl text-sm font-black transition-all border ${
                  startYear === y
                    ? "bg-[#EAF3F7] text-[#236B8E] border-[#78B6D0]"
                    : "bg-[#F4F7F8] text-slate-600 border-[#D9E3E8] hover:text-slate-700"
                }`}
                style={{ minHeight: 44, minWidth: 64, padding: "0 12px" }}
              >
                {y}年
              </button>
            ))}
          </div>
          {/* Month — small, secondary */}
          <div className="flex gap-2 mt-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {MONTH_OPTIONS.filter((m) => m >= minimumMonth).map((m) => (
              <button
                key={m}
                onClick={() => { markSimulationStart(); setStartMonth(m); setShowResult(false); }}
                aria-pressed={startMonth === m}
                className={`flex-shrink-0 rounded-lg text-xs font-bold transition-all ${
                  startMonth === m
                    ? "bg-[#DCEFFA] text-[#263A53]"
                    : "text-slate-600 hover:text-slate-600"
                }`}
                style={{ minHeight: 44, minWidth: 44, padding: "0 8px" }}
              >
                {m}月
              </button>
            ))}
          </div>
        </div>

        {/* Monthly amount */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs font-black tracking-widest uppercase text-slate-600">毎月の積立額</p>
            <span className="text-xl font-black text-white">{formatCurrency(monthlyAmount)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {MONTHLY_AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => { markSimulationStart(); setMonthlyAmount(a); setShowResult(false); }}
                aria-pressed={monthlyAmount === a}
                className={`rounded-xl text-sm font-black transition-all border ${
                  monthlyAmount === a
                    ? "bg-[#EAF3F7] text-[#236B8E] border-[#78B6D0]"
                    : "bg-[#F4F7F8] text-slate-600 border-[#D9E3E8] hover:bg-[#E6F0F4] hover:text-slate-700"
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
            <div className="rounded-2xl border border-[#D9E3E8] bg-white p-5">
              <FundSelector
                value={fund}
                onChange={selectFund}
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
          background: "#236B8E",
          boxShadow: "0 8px 24px #6366f130",
        }}
      >
        <span className="flex items-center justify-center gap-2">
          <Zap className="h-5 w-5" />
          タイムマシンを起動する
        </span>
      </motion.button>

      {/* Advanced toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#EFF5F7]" />
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-xs text-slate-700 hover:bg-[#F4F7F8] transition-colors"
        >
          <Settings2 className="h-3 w-3" />
          {showAdvanced ? "詳細設定を閉じる" : "詳細シミュレーション（上級者向け）"}
        </button>
        <div className="flex-1 h-px bg-[#EFF5F7]" />
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
            <div className="rounded-2xl border border-[#D9E3E8] bg-white p-5">
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
            role="region"
            aria-live="polite"
            aria-label="シミュレーション結果"
            key="single-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="text-center">
              <p className="text-xs font-black tracking-widest uppercase text-slate-600 mb-1">シミュレーション結果</p>
              <p className="text-xs text-slate-600">
                {startYear}年{startMonth}月〜{result?.dataPoints.at(-1)?.date.replace("/", "年")}月 · 毎月{formatCurrency(monthlyAmount)}
              </p>
            </div>

            {/* Profit hero */}
            <div
              className="rounded-2xl p-6 text-center"
              style={{
                background: "#FFFFFF",
                border: `1px solid ${result.fundColor}30`,
                boxShadow: `0 0 22px ${result.fundColor}10`,
              }}
            >
              <p className="mb-4 text-sm font-bold text-[#263A53]">{result.fundName}の結果</p>
              <div className="grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
                <div><p className="text-xs text-slate-600">元本</p><p className="mt-1 font-number text-xl font-bold text-[#263A53]">{formatCurrency(result.totalPrincipal)}</p></div>
                <div><p className="text-xs text-slate-600">期間末評価額</p><p className="mt-1 font-number text-xl font-bold text-[#263A53]">{formatCurrency(result.finalValue)}</p></div>
                <div className="col-span-2 sm:col-span-1"><p className="text-xs text-slate-600">損益</p><p className={`mt-1 font-number text-xl font-bold ${result.profit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{result.profit >= 0 ? "+" : ""}{formatCurrency(result.profit)} <span className="text-sm">（{result.returnRate >= 0 ? "+" : ""}{result.returnRate.toFixed(1)}%）</span></p></div>
              </div>

              {/* 信頼性の根拠（常時表示） */}
              <div className="mt-4 pt-3 border-t border-[#D9E3E8] flex items-center justify-center gap-1.5 text-xs text-slate-600">
                <ShieldCheck className="h-3 w-3 flex-shrink-0" />
                <span>{getReturnDataSource(fund).sourceStatus === "verified" ? "公式月次データ・税金等は個別計算なし" : "参考データ・原典未検証"}</span>
              </div>
            </div>

            <SimulationChart result={result} />

            <details className="rounded-2xl border border-[#D9E3E8] bg-white p-1 open:p-0">
              <summary className="cursor-pointer list-none rounded-xl px-4 py-4 text-sm font-bold text-[#263A53]">途中の元本割れ分析を見る</summary>
              <PathInsights result={result} />
            </details>

            {/* 優先順位2位：人生換算 */}
            <EmotionalMessage result={result} yearsElapsed={yearsElapsed} />

            {/* 優先順位3位：シェア */}
            <button
              onClick={() => setShowShare((v) => !v)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#D2DEE4] bg-[#F4F7F8] py-3.5 text-sm font-bold text-slate-700 hover:bg-[#EAF3F7] transition-colors"
            >
              <Share2 className="h-4 w-4" />
              {showShare ? "閉じる" : "この結果をシェアする"}
            </button>
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

            {/* 比較モード誘導（圧縮・控えめ） */}
            <button
              onClick={() => {
                trackCompareClick({ fund_id: fund });
                onCompare(fund, { year: startYear, month: startMonth, amount: monthlyAmount });
              }}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-700 transition-colors py-1"
            >
              <GitCompareArrows className="h-3.5 w-3.5" />
              他の銘柄と比較する
            </button>

            {/* 計算条件（折りたたみ・デフォルト非表示でスクロールを圧縮） */}
            <button
              onClick={() => setShowCalcDetails((v) => !v)}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-slate-700 transition-colors"
            >
              <ChevronDown
                className="h-3 w-3 transition-transform duration-200"
                style={{ transform: showCalcDetails ? "rotate(180deg)" : "none" }}
              />
              {showCalcDetails ? "計算の詳細を閉じる" : "計算の詳細を見る"}
            </button>
            <AnimatePresence>
              {showCalcDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <CalculationDetails resultA={result} />
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-xs text-slate-600 px-4 leading-relaxed">
              {getReturnDataSource(fund).sourceStatus === "verified"
                ? "※ 一次情報から検証した月次データによる計算です。売買手数料・税金・為替スプレッドは個別計算していません。"
                : "※ 原典未特定の年次参考系列による簡易計算です。実際の商品実績や将来の運用成果を示すものではありません。"}
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
            <p className="mt-4 text-center text-xs text-slate-600 px-4 leading-relaxed">
              ※ A品質の検証済み月次実績だけを、同じ開始月・終了月・積立額で比較しています。過去実績であり、将来の成果を示すものではありません。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
