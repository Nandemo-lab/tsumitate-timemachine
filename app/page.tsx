"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FundId } from "@/types";
import BottomNav, { MainTab } from "@/components/layout/BottomNav";
import HomeView from "@/components/views/HomeView";
import EncyclopediaView from "@/components/views/EncyclopediaView";
import TimeMachineView from "@/components/views/TimeMachineView";
import CompareView from "@/components/views/CompareView";

interface TmPreset {
  fund: FundId;
  year: number;
  month: number;
  amount: number;
  autoRun: boolean;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("home");
  const [encyclopediaFund, setEncyclopediaFund] = useState<FundId | null>(null);
  const [compareFundA, setCompareFundA] = useState<FundId>("sp500");
  const [tmPreset, setTmPreset] = useState<TmPreset>({
    fund: "orcan", year: 2020, month: 1, amount: 30000, autoRun: false,
  });

  // From home taraeba cards: preload TM with result shown
  const goToTaraeba = (fundId: FundId, year: number, month: number, amount: number) => {
    setTmPreset({ fund: fundId, year, month, amount, autoRun: true });
    setActiveTab("timemachine");
  };

  const goToEncyclopedia = (fundId: FundId) => {
    setEncyclopediaFund(fundId);
    setActiveTab("encyclopedia");
  };

  const goToCompare = (fundId: FundId) => {
    setCompareFundA(fundId);
    setActiveTab("compare");
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
              key="compare"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <CompareView initialFundA={compareFundA} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav active={activeTab} onChange={handleTabChange} />
    </main>
  );
}
