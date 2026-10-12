"use client";

import { useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FundId } from "@/types";
import BottomNav, { MainTab } from "@/components/layout/BottomNav";
import HomeView from "@/components/views/HomeView";
import EncyclopediaView from "@/components/views/EncyclopediaView";
import TimeMachineView from "@/components/views/TimeMachineView";
import CompareView from "@/components/views/CompareView";
import { RecentSimulation } from "@/lib/recent-simulations";

interface TmPreset {
  fund: FundId;
  year: number;
  month: number;
  amount: number;
  autoRun: boolean;
}

interface ComparePreset {
  fund: FundId;
  fundB?: FundId;
  year: number;
  month: number;
  amount: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("home");
  const [encyclopediaFund, setEncyclopediaFund] = useState<FundId | null>(null);
  const [comparePreset, setComparePreset] = useState<ComparePreset>({
    fund: "sp500", year: 2020, month: 1, amount: 30000,
  });
  const [tmPreset, setTmPreset] = useState<TmPreset>({
    fund: "orcan", year: 2020, month: 1, amount: 30000, autoRun: false,
  });

  // AnimatePresence swaps views after the click handler returns. Scrolling in
  // the handler can therefore be undone when the old view is removed. Reset
  // after the active view has committed so every tab starts at its heading.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab]);


  // From home taraeba cards: preload TM with result shown
  const goToTaraeba = (fundId: FundId, year: number, month: number, amount: number) => {
    setTmPreset({ fund: fundId, year, month, amount, autoRun: true });
    setActiveTab("timemachine");
  };

  const goToEncyclopedia = (fundId: FundId) => {
    setEncyclopediaFund(fundId);
    setActiveTab("encyclopedia");
  };

  const goToCompare = (fundId: FundId, conditions?: { year: number; month: number; amount: number }) => {
    setComparePreset({
      fund: fundId,
      year: conditions?.year ?? 2020,
      month: conditions?.month ?? 1,
      amount: conditions?.amount ?? 30000,
    });
    setActiveTab("compare");
  };

  const restoreRecent = (item: RecentSimulation) => {
    if (item.mode === "compare" && item.fundB) {
      setComparePreset({ fund: item.fundA, fundB: item.fundB, year: item.startYear, month: item.startMonth, amount: item.monthlyAmount });
      setActiveTab("compare");
      return;
    }
    setTmPreset({ fund: item.fundA, year: item.startYear, month: item.startMonth, amount: item.monthlyAmount, autoRun: true });
    setActiveTab("timemachine");
  };

  const handleTabChange = (tab: MainTab) => {
    if (tab !== "encyclopedia") setEncyclopediaFund(null);
    // Reset autoRun when user manually switches to timemachine
    if (tab === "timemachine") setTmPreset((p) => ({ ...p, autoRun: false }));
    setActiveTab(tab);
  };

  return (
    <main className="relative min-h-dvh bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #6366f115 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #f59e0b0a 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <HomeView
                onNavigate={handleTabChange}
                onFundSelect={goToEncyclopedia}
                onTaraeba={goToTaraeba}
                onRestoreRecent={restoreRecent}
              />
            </motion.div>
          )}

          {activeTab === "encyclopedia" && (
            <motion.div
              key="encyclopedia"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <EncyclopediaView
                initialFund={encyclopediaFund}
                onCompare={goToCompare}
              />
            </motion.div>
          )}

          {activeTab === "timemachine" && (
            <motion.div
              key={`timemachine-${tmPreset.fund}-${tmPreset.year}-${tmPreset.autoRun}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <TimeMachineView
                initialFund={tmPreset.fund}
                initialYear={tmPreset.year}
                initialMonth={tmPreset.month}
                initialAmount={tmPreset.amount}
                autoRun={tmPreset.autoRun}
                onCompare={goToCompare}
              />
            </motion.div>
          )}

          {activeTab === "compare" && (
            <motion.div
              key={`compare-${comparePreset.fund}-${comparePreset.year}-${comparePreset.month}-${comparePreset.amount}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <CompareView
                initialFundA={comparePreset.fund}
                initialFundB={comparePreset.fundB}
                initialYear={comparePreset.year}
                initialMonth={comparePreset.month}
                initialAmount={comparePreset.amount}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav active={activeTab} onChange={handleTabChange} />
    </main>
  );
}
