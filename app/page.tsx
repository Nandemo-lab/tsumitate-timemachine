"use client";

import { useLayoutEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FundId } from "@/types";
import BottomNav, { MainTab } from "@/components/layout/BottomNav";
import HomeView from "@/components/views/HomeView";
import EncyclopediaView from "@/components/views/EncyclopediaView";
import TimeMachineView from "@/components/views/TimeMachineView";
import CompareView from "@/components/views/CompareView";
import { RecentSimulation } from "@/lib/recent-simulations";
import { isValidMonthlyAmount, parseStrictInteger } from "@/lib/simulation";
import { isReturnMonthAvailable, isVerifiedReturnSeries } from "@/lib/return-series";

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

const subscribeToLocation = () => () => {};
const getLocationSearch = () => window.location.search;
const getServerLocationSearch = () => "";

function parseComparePreset(search: string): ComparePreset | null {
  const params = new URLSearchParams(search);
  if (params.get("tab") !== "compare") return null;
  const fund = params.get("fund") as FundId | null;
  const fundB = params.get("fundB") as FundId | null;
  const year = parseStrictInteger(params.get("year"));
  const month = parseStrictInteger(params.get("month"));
  const amount = parseStrictInteger(params.get("amount"));
  if (!fund || !fundB || fund === fundB || !isVerifiedReturnSeries(fund) || !isVerifiedReturnSeries(fundB)) return null;
  if (year === null || month === null || amount === null || month < 1 || month > 12 || !isValidMonthlyAmount(amount)) return null;
  if (!isReturnMonthAvailable(fund, year, month) || !isReturnMonthAvailable(fundB, year, month)) return null;
  return { fund, fundB, year, month, amount };
}

export default function Home() {
  const locationSearch = useSyncExternalStore(subscribeToLocation, getLocationSearch, getServerLocationSearch);
  const urlComparePreset = parseComparePreset(locationSearch);
  const [urlPresetDismissed, setUrlPresetDismissed] = useState(false);
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
  const displayedTab: MainTab = !urlPresetDismissed && urlComparePreset ? "compare" : activeTab;
  const displayedComparePreset = !urlPresetDismissed && urlComparePreset ? urlComparePreset : comparePreset;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [displayedTab]);


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
    setUrlPresetDismissed(true);
    if (tab !== "encyclopedia") setEncyclopediaFund(null);
    // Reset autoRun when user manually switches to timemachine
    if (tab === "timemachine") setTmPreset((p) => ({ ...p, autoRun: false }));
    setActiveTab(tab);
  };

  return (
    <main className="relative min-h-dvh bg-[#FAFAF7] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #DCEFFA 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #FFDFCB80 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          {displayedTab === "home" && (
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

          {displayedTab === "encyclopedia" && (
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

          {displayedTab === "timemachine" && (
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

          {displayedTab === "compare" && (
            <motion.div
              key={`compare-${displayedComparePreset.fund}-${displayedComparePreset.year}-${displayedComparePreset.month}-${displayedComparePreset.amount}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
            >
              <CompareView
                initialFundA={displayedComparePreset.fund}
                initialFundB={displayedComparePreset.fundB}
                initialYear={displayedComparePreset.year}
                initialMonth={displayedComparePreset.month}
                initialAmount={displayedComparePreset.amount}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav active={displayedTab} onChange={handleTabChange} />
    </main>
  );
}
