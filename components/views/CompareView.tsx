"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FundId } from "@/types";
import { simulate, formatCurrency } from "@/lib/simulation";
import { getCommonEndMonth, getCommonStartMonth, getCommonStartOptions, getReturnSeriesDefinition } from "@/lib/return-series";
import { FUNDS, formatExpenseRatio } from "@/lib/funds";
import FundSelector from "@/components/simulation/FundSelector";
import ResultCard from "@/components/simulation/ResultCard";
import WinnerBanner from "@/components/simulation/WinnerBanner";
import ComparisonChart from "@/components/simulation/ComparisonChart";
import ShareCard from "@/components/simulation/ShareCard";
import CalculationDetails from "@/components/simulation/CalculationDetails";
import { ChevronDown, Zap, Share2, ShieldCheck, GitCompareArrows } from "lucide-react";
import { trackCalculate, trackSimulationStart } from "@/lib/analytics";
import { saveRecentSimulation } from "@/lib/recent-simulations";

const MONTHLY_AMOUNTS = [10000, 20000, 30000, 50000, 100000];

interface Props {
  initialFundA?: FundId;
  initialFundB?: FundId;
  initialYear?: number;
  initialMonth?: number;
  initialAmount?: number;
}

export default function CompareView({ initialFundA = "sp500", initialFundB = "orcan", initialYear = 2020, initialMonth = 1, initialAmount = 30000 }: Props) {
  const initialCommonStart = getCommonStartMonth([initialFundA, initialFundB]);
  const requestedStart = `${initialYear}-${String(initialMonth).padStart(2, "0")}`;
  const safeInitialStart = requestedStart < initialCommonStart ? initialCommonStart : requestedStart;
  const [fundA, setFundA] = useState<FundId>(initialFundA);
  const [fundB, setFundB] = useState<FundId>(initialFundB);
  const [startYear, setStartYear] = useState(Number(safeInitialStart.slice(0, 4)));
  const [startMonth, setStartMonth] = useState(Number(safeInitialStart.slice(5, 7)));
  const [monthlyAmount, setMonthlyAmount] = useState(initialAmount);
  const [showResult, setShowResult] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showCalcDetails, setShowCalcDetails] = useState(false);
  const startTracked = useRef(false);
  const markSimulationStart = () => {
    if (startTracked.current) return;
    startTracked.current = true;
    trackSimulationStart("compare", "compare_form");
  };
  const startYearOptions = getCommonStartOptions([fundA, fundB]);
  const commonEnd = getCommonEndMonth([fundA, fundB]);
  const commonEndYear = Number(commonEnd.slice(0, 4));
  const commonEndMonth = Number(commonEnd.slice(5, 7));
  const normalizeStartForFunds = (first: FundId, second: FundId) => {
    markSimulationStart();
    const minimum = getCommonStartMonth([first, second]);
    if (`${startYear}-${String(startMonth).padStart(2, "0")}` < minimum) {
      setStartYear(Number(minimum.slice(0, 4)));
      setStartMonth(Number(minimum.slice(5, 7)));
    }
    setShowResult(false);
  };

  const run = useCallback(() => {
    markSimulationStart();
    simulate({ fundId: fundA, startYear, startMonth, monthlyAmount, endYear: commonEndYear, endMonth: commonEndMonth });
    simulate({ fundId: fundB, startYear, startMonth, monthlyAmount, endYear: commonEndYear, endMonth: commonEndMonth });
    saveRecentSimulation({ mode: "compare", fundA, fundB, startYear, startMonth, endYear: commonEndYear, endMonth: commonEndMonth, monthlyAmount });
    trackCalculate({ mode: "compare", fund_id: `${fundA}_vs_${fundB}`, start_year: startYear, monthly_amount: monthlyAmount });
    setShowResult(true);
    setShowShare(false);
    setTimeout(() => {
      document.getElementById("compare-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }, [fundA, fundB, startYear, startMonth, monthlyAmount, commonEndYear, commonEndMonth]);

  const resultA = useMemo(
    () => (showResult ? simulate({ fundId: fundA, startYear, startMonth, monthlyAmount, endYear: commonEndYear, endMonth: commonEndMonth }) : null),
    [showResult, fundA, startYear, startMonth, monthlyAmount, commonEndYear, commonEndMonth]
  );
  const resultB = useMemo(
    () => (showResult ? simulate({ fundId: fundB, startYear, startMonth, monthlyAmount, endYear: commonEndYear, endMonth: commonEndMonth }) : null),
    [showResult, fundB, startYear, startMonth, monthlyAmount, commonEndYear, commonEndMonth]
  );

  const isTie = Boolean(resultA && resultB && resultA.finalValue === resultB.finalValue);
  const winnerResult = resultA && resultB ? (resultA.finalValue >= resultB.finalValue ? resultA : resultB) : null;
  const loserResult  = resultA && resultB ? (resultA.finalValue >= resultB.finalValue ? resultB : resultA) : null;
  const difference   = resultA && resultB ? Math.abs(resultA.finalValue - resultB.finalValue) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 pb-28 pt-6 md:pt-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <h2 className="font-heading text-xl font-semibold text-[#263A53] mb-1 flex items-center justify-center gap-2">
          <GitCompareArrows className="h-5 w-5 text-[#236B8E]" />
          比較モード
        </h2>
        <p className="text-sm text-slate-600">2つの銘柄を同じ条件で比べる</p>
      </motion.div>

      {/* Conditions（開始年・積立額を1カードに統合） */}
      <div className="rounded-2xl border border-[#D2DEE4] bg-[#F7FAFB] p-4 space-y-3">
        {/* Year chips */}
        <div>
          <p className="text-xs font-black tracking-widest uppercase text-slate-600 mb-2">積立開始年</p>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {startYearOptions.map((y) => (
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
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs font-black tracking-widest uppercase text-slate-600">毎月の積立額</p>
            <span className="text-xl font-black text-white">{formatCurrency(monthlyAmount)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MONTHLY_AMOUNTS.slice(0, 6).map((a) => (
              <button
                key={a}
                onClick={() => { markSimulationStart(); setMonthlyAmount(a); setShowResult(false); }}
                aria-pressed={monthlyAmount === a}
                className={`rounded-xl text-xs font-black transition-all border ${
                  monthlyAmount === a
                    ? "bg-[#EAF3F7] text-[#236B8E] border-[#78B6D0]"
                    : "bg-[#F4F7F8] text-slate-600 border-[#D9E3E8] hover:bg-[#E6F0F4]"
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
      <div className="rounded-2xl border border-[#D9E3E8] bg-white p-4">
        <FundSelector
          value={fundA}
          onChange={(id) => { setFundA(id); normalizeStartForFunds(id, fundB); }}
          label="1つ目の銘柄"
          accentColor="#6366f1"
        />
      </div>

      <div className="flex items-center gap-2 -my-1">
        <div className="flex-1 h-px bg-[#EAF3F7]" />
        <span className="text-xs text-slate-600 font-black tracking-widest">VS</span>
        <div className="flex-1 h-px bg-[#EAF3F7]" />
      </div>

      {/* Fund B */}
      <div className="rounded-2xl border border-[#D9E3E8] bg-white p-4">
        <FundSelector
          value={fundB}
          onChange={(id) => { setFundB(id); normalizeStartForFunds(fundA, id); }}
          label="2つ目の銘柄"
          accentColor="#f59e0b"
        />
      </div>

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
          比較する
        </span>
      </motion.button>

      {/* Results */}
      <AnimatePresence>
        {showResult && resultA && resultB && winnerResult && loserResult && (
          <motion.div
            id="compare-result"
            role="region"
            aria-live="polite"
            aria-label="比較結果"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* 銘柄名を主役にした見出し：どの2つを比較しているか瞬時に分かる */}
            <div className="text-center">
              <p className="text-xs font-black tracking-widest uppercase text-slate-600 mb-2">比較結果</p>
              <div className="flex items-center justify-center gap-3 mb-1">
                <p className="font-heading text-xl font-bold" style={{ color: resultA.fundColor }}>
                  {resultA.fundName}
                </p>
                <span className="text-xs font-bold text-slate-600">VS</span>
                <p className="font-heading text-xl font-bold" style={{ color: resultB.fundColor }}>
                  {resultB.fundName}
                </p>
              </div>
              <p className="text-xs text-slate-600">
                {startYear}年{startMonth}月〜{commonEndYear}年{commonEndMonth}月 · 毎月{formatCurrency(monthlyAmount)}
              </p>
            </div>

            {isTie ? (
              <div className="rounded-2xl border border-[#D2DEE4] bg-white p-5 text-center">
                <p className="text-sm font-bold text-[#263A53]">この条件では期間末評価額が同額です</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">同じ開始月・終了月・積立額で比較した過去結果です。</p>
              </div>
            ) : (
              <WinnerBanner winner={winnerResult} loser={loserResult} difference={difference} />
            )}

            {/* 信頼性の根拠（常時表示） */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 -mt-2">
              <ShieldCheck className="h-3 w-3 flex-shrink-0" />
              <span>{getReturnSeriesDefinition(fundA).quality === "A" && getReturnSeriesDefinition(fundB).quality === "A" ? "両系列とも公式月次データ・共通期間で比較" : "参考データを含む比較（原典未検証）"}</span>
            </div>

            {/* 比較結果と混同しない客観的な商品属性 */}
            <details className="rounded-2xl border border-[#D2DEE4] bg-white p-5">
              <summary className="cursor-pointer list-none text-sm font-bold text-[#263A53]">商品の違いと費用を見る</summary>
              <div className="mt-4 space-y-4">
              <p className="text-xs font-bold tracking-widest uppercase text-slate-600">比較する商品の確認事項</p>
              {[resultA, resultB].map((r, index) => {
                const enc = FUNDS[r.fundId].encyclopedia;
                return (
                  <div key={`${r.fundId}-${index}`} className="flex gap-3">
                    <div className="h-2 w-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: r.fundColor }} />
                    <div>
                      <p className="text-sm font-bold text-[#263A53] mb-1">
                        {enc.nickname}の商品属性
                      </p>
                      <ul className="space-y-0.5">
                        <li className="text-sm text-slate-700 leading-relaxed">・投資対象：{FUNDS[r.fundId].description}</li>
                        <li className="text-sm text-slate-700 leading-relaxed">・構成銘柄数：{FUNDS[r.fundId].shareCount}</li>
                        <li className="text-sm text-slate-700 leading-relaxed">・表示コスト：{formatExpenseRatio(r.fundId)}</li>
                      </ul>
                    </div>
                  </div>
                );
              })}
              </div>
            </details>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ResultCard result={resultA} label="" isWinner={!isTie && resultA.finalValue > resultB.finalValue} delay={0} />
              <ResultCard result={resultB} label="" isWinner={!isTie && resultB.finalValue > resultA.finalValue} delay={0.08} />
            </div>

            <div className="rounded-2xl border border-[#D2DEE4] bg-[#F7FAFB] p-5">
              <p className="text-xs font-black tracking-widest uppercase text-slate-600 mb-3">資産推移グラフ</p>
              <ComparisonChart planA={resultA} planB={resultB} />
            </div>

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
                    planA={resultA}
                    planB={resultB}
                    startYear={startYear}
                    startMonth={startMonth}
                    monthlyAmount={monthlyAmount}
                  />
                </motion.div>
              )}
            </AnimatePresence>

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
                  <CalculationDetails resultA={resultA} resultB={resultB} />
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-xs text-slate-600 px-4 leading-relaxed">
              ※ A系列は一次情報から検証した月次実績を使用します。G系列は参考データとして品質を明示し、将来の運用成果を示すものではありません。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
