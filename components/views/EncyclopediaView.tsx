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
    <div className="pt-6 pb-28 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-4 text-center"
      >
        <h2 className="font-heading text-xl font-semibold text-white mb-1">📚 銘柄図鑑</h2>
        <p className="text-sm text-zinc-400">10銘柄をやさしく解説。タップして詳細＆シミュレーション</p>
      </motion.div>

      <FundEncyclopedia
        onSimulate={onCompare}
        initialExpanded={initialFund ?? undefined}
      />
    </div>
  );
}
