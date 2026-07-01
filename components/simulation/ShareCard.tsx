"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SimulationResult } from "@/types";
import { formatCurrency } from "@/lib/simulation";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  planA: SimulationResult;
  planB?: SimulationResult;
  startYear: number;
  startMonth: number;
  monthlyAmount: number;
}

export default function ShareCard({ planA, planB, startYear, startMonth, monthlyAmount }: Props) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const sorted = planB ? [planA, planB].sort((a, b) => b.profit - a.profit) : [planA];
  const winner = sorted[0];
  const loser = sorted[1];
  const diff = loser ? winner.profit - loser.profit : null;

  const url = "https://tsumitate-timemachine.com";
  const shareText = planB && loser
    ? `もし${startYear}年${startMonth}月から${winner.fundName}を
毎月${formatCurrency(monthlyAmount)}積み立てていたら

+${formatCurrency(winner.profit)}（+${winner.returnRate.toFixed(1)}%）

vs ${loser.fundName}
+${formatCurrency(loser.profit)}（+${loser.returnRate.toFixed(1)}%）

差額 ${formatCurrency(diff!)} の違いに！

📊 積立タイムマシン
${url}

自分でも試してみる↓ #積立タイムマシン #新NISA`
    : `もし${startYear}年${startMonth}月から${winner.fundName}を
毎月${formatCurrency(monthlyAmount)}積み立てていたら

+${formatCurrency(winner.profit)}（+${winner.returnRate.toFixed(1)}%）
元本 ${formatCurrency(planA.totalPrincipal)} → ${formatCurrency(planA.finalValue)}

📊 積立タイムマシン
${url}

自分でも試してみる↓ #積立タイムマシン #新NISA`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleXShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
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
          <p className="text-xs font-black tracking-widest text-zinc-400 mb-3">
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
          {diff !== null && (
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <p className="text-xs text-zinc-400">差額</p>
              <p className="text-sm font-black text-white">{formatCurrency(diff)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-3 flex gap-2">
        <button
          onClick={handleXShare}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all bg-white text-black hover:bg-zinc-100 active:scale-98"
        >
          <span className="text-sm font-black leading-none">𝕏</span>
          結果をシェア
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
          <span className="text-xs">{copied ? "コピー済み" : "リンクコピー"}</span>
        </button>
      </div>
    </motion.div>

    {/* Toast — rendered above BottomNav */}
    {mounted && createPortal(
      <AnimatePresence>
        {copied && (
          <motion.div
            key="copy-toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-lg"
            style={{
              bottom: "calc(env(safe-area-inset-bottom) + 80px)",
              background: "rgba(16,185,129,0.92)",
              backdropFilter: "blur(12px)",
              zIndex: 9999,
            }}
          >
            <Check className="h-4 w-4" />
            リンクをコピーしました
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  );
}
