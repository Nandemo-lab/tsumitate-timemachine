"use client";

import { motion } from "framer-motion";
import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface Props {
  planA: SimulationResult;
  planB: SimulationResult;
  startYear: number;
  startMonth: number;
  monthlyAmount: number;
}

export default function ShareCard({ planA, planB, startYear, startMonth, monthlyAmount }: Props) {
  const [copied, setCopied] = useState(false);
  const sorted = [planA, planB].sort((a, b) => b.profit - a.profit);
  const winner = sorted[0];
  const loser = sorted[1];
  const diff = winner.profit - loser.profit;

  const shareText = `📈 #積立タイムマシン

もし${startYear}年${startMonth}月から
毎月${formatCurrency(monthlyAmount)}積み立てていたら...

🏆 ${winner.fundName}
利益 +${formatCurrency(winner.profit)}（${winner.returnRate.toFixed(1)}%）

vs ${loser.fundName}
利益 +${formatCurrency(loser.profit)}（${loser.returnRate.toFixed(1)}%）

差額 ${formatCurrency(diff)} の違い！
今すぐ試す → https://tsumitate-timemachine.vercel.app`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleXShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 overflow-hidden"
    >
      {/* Preview card (SNS image-like) */}
      <div
        className="p-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${winner.fundColor}20 0%, #0a0a0f 70%)`,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative">
          <p className="text-xs font-black tracking-widest text-zinc-500 mb-3">
            ⏰ 積立タイムマシン
          </p>
          <p className="text-xs text-zinc-400 mb-3">
            もし{startYear}年{startMonth}月から 毎月{formatCurrency(monthlyAmount)}
          </p>
          <div className="space-y-2">
            {sorted.map((r, i) => (
              <div key={r.fundId} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{i === 0 ? "🏆" : "  "}</span>
                  <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: r.fundColor }} />
                  <span className="text-sm font-bold" style={{ color: r.fundColor }}>{r.fundName}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white">+{formatCurrency(r.profit)}</span>
                  <span className="text-xs text-emerald-400 ml-1.5">{r.returnRate.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-zinc-500">差額</p>
            <p className="text-sm font-black text-white">{formatCurrency(diff)}</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-3 flex gap-2">
        <button
          onClick={handleXShare}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all bg-white text-black hover:bg-zinc-100 active:scale-98"
        >
          <span className="text-sm font-black">𝕏</span>
          Xでシェア
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all bg-white/10 text-zinc-300 hover:bg-white/15 active:scale-98"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
