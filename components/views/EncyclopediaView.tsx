"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FundId } from "@/types";
import FundEncyclopedia from "@/components/simulation/FundEncyclopedia";

interface Props {
  initialFund?: FundId | null;
  onCompare: (fundId: FundId) => void;
}

export default function EncyclopediaView({ initialFund, onCompare }: Props) {
  return (
    <div className="pt-12 pb-28 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pt-4 mb-6 text-center"
      >
        <h2 className="text-2xl font-black text-white mb-1">📚 銘柄図鑑</h2>
        <p className="text-xs text-zinc-500">10銘柄をやさしく解説。タップして詳細＆シミュレーション</p>
      </motion.div>

      <FundEncyclopedia
        onSimulate={onCompare}
        initialExpanded={initialFund ?? undefined}
      />
    </div>
  );
}
