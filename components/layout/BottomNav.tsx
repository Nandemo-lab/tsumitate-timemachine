"use client";

import { motion } from "framer-motion";
import { Home, BookOpen, Clock3, GitCompareArrows, LucideIcon } from "lucide-react";

export type MainTab = "home" | "encyclopedia" | "timemachine" | "compare";

const TABS: { id: MainTab; icon: LucideIcon; label: string }[] = [
  { id: "home",         icon: Home,             label: "ホーム" },
  { id: "encyclopedia", icon: BookOpen,         label: "銘柄図鑑" },
  { id: "timemachine",  icon: Clock3,           label: "タイムマシン" },
  { id: "compare",      icon: GitCompareArrows, label: "比較" },
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
        background: "rgba(9,9,11,0.97)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="max-w-lg mx-auto flex">
        {TABS.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 relative"
              style={{ minHeight: 56 }}  /* 44px+ tap target */
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-indigo-400"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                size={21}
                strokeWidth={2}
                className={isActive ? "text-indigo-400" : "text-zinc-500"}
              />
              <span
                className={`text-[10px] font-semibold transition-colors leading-tight ${
                  isActive ? "text-indigo-300" : "text-zinc-500"
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
