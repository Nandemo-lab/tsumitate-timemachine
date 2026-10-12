"use client";

import { motion } from "framer-motion";
import { Home, BookOpen, Clock3, GitCompareArrows, LucideIcon } from "lucide-react";

export type MainTab = "home" | "encyclopedia" | "timemachine" | "compare";

const TABS: { id: MainTab; icon: LucideIcon; label: string }[] = [
  { id: "timemachine",  icon: Clock3,           label: "試す" },
  { id: "compare",      icon: GitCompareArrows, label: "比較する" },
  { id: "encyclopedia", icon: BookOpen,         label: "商品を知る" },
  { id: "home",         icon: Home,             label: "ホーム" },
];

interface Props {
  active: MainTab;
  onChange: (tab: MainTab) => void;
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      aria-label="主要メニュー"
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid #D9E3E8",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex max-w-3xl">
        {TABS.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-current={isActive ? "page" : undefined}
              className="flex-1 flex flex-col items-center justify-center gap-1 relative"
              style={{ minHeight: 56 }}  /* 44px+ tap target */
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-[#236B8E]"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                size={21}
                strokeWidth={2}
                className={isActive ? "text-[#236B8E]" : "text-slate-500"}
              />
              <span
                className={`text-xs font-semibold transition-colors leading-tight ${
                  isActive ? "text-[#236B8E]" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
