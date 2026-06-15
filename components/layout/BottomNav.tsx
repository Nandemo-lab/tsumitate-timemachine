"use client";

import { motion } from "framer-motion";

export type MainTab = "home" | "encyclopedia" | "timemachine" | "compare";

const TABS: { id: MainTab; emoji: string; label: string }[] = [
  { id: "home",         emoji: "🏠", label: "ホーム" },
  { id: "encyclopedia", emoji: "📚", label: "銘柄図鑑" },
  { id: "timemachine",  emoji: "🕰️", label: "タイムマシン" },
  { id: "compare",      emoji: "⚔️", label: "比較" },
];

interface Props {
  active: MainTab;
  onChange: (tab: MainTab) => void;
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(9,9,11,0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="max-w-lg mx-auto flex">
        {TABS.map(({ id, emoji, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
              style={{ minHeight: 56 }}  /* 44px+ tap target */
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-indigo-400"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="text-xl leading-none">{emoji}</span>
              <span
                className={`text-[10px] font-bold transition-colors leading-tight ${
                  isActive ? "text-indigo-300" : "text-zinc-600"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
