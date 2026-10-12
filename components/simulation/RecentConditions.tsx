"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { FUNDS } from "@/lib/funds";
import { clearRecentSimulations, getRecentSimulationsServerSnapshot, getRecentSimulationsSnapshot, RecentSimulation, removeRecentSimulation, subscribeRecentSimulations } from "@/lib/recent-simulations";
import { trackReturnVisit } from "@/lib/analytics";

export default function RecentConditions({ onRestore }: { onRestore: (item: RecentSimulation) => void }) {
  const items = useSyncExternalStore(subscribeRecentSimulations, getRecentSimulationsSnapshot, getRecentSimulationsServerSnapshot);
  const returnVisitTracked = useRef(false);

  useEffect(() => {
    if (items.length === 0 || returnVisitTracked.current) return;
    returnVisitTracked.current = true;
    const key = "ttm:last-seen-date:v1";
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date());
    const previous = window.localStorage.getItem(key);
    window.localStorage.setItem(key, today);
    if (previous && previous < today) trackReturnVisit("recent_conditions");
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section className="mx-4 rounded-2xl border border-[#D2DEE4] bg-white p-4" aria-labelledby="recent-title">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 id="recent-title" className="text-sm font-bold text-[#263A53]">最近試した条件</h2>
          <p className="mt-1 text-xs text-slate-600">結果ではなく条件だけをこの端末に保存しています。</p>
        </div>
        <button type="button" onClick={clearRecentSimulations} className="min-h-11 px-2 text-xs font-semibold text-slate-700 underline underline-offset-2">すべて削除</button>
      </div>
      <div className="space-y-2">
        {items.slice(0, 3).map((item) => {
          const label = item.fundB ? `${FUNDS[item.fundA].shortName} / ${FUNDS[item.fundB].shortName}` : FUNDS[item.fundA].shortName;
          return (
            <div key={item.savedAt} className="flex items-center gap-2 rounded-xl border border-[#D9E3E8] bg-[#F4F7F8] p-2.5">
              <button type="button" onClick={() => onRestore(item)} className="min-h-11 min-w-0 flex-1 text-left">
                <span className="block truncate text-xs font-bold text-[#263A53]">{label}</span>
                <span className="mt-1 block text-xs text-slate-600">{item.startYear}年{item.startMonth}月〜・月{item.monthlyAmount.toLocaleString("ja-JP")}円</span>
              </button>
              <button type="button" onClick={() => removeRecentSimulation(item.savedAt)} aria-label={`${label}の保存条件を削除`} className="min-h-11 rounded-lg px-3 text-xs font-semibold text-slate-700 hover:bg-[#F4F7F8]">削除</button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
