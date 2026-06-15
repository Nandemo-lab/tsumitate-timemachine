"use client";

import { motion } from "framer-motion";
import { SimulationResult } from "@/types";
import { getEmotionalMessage } from "@/lib/emotional";

interface Props {
  result: SimulationResult;
  yearsElapsed: number;
}

export default function EmotionalMessage({ result, yearsElapsed }: Props) {
  const msg = getEmotionalMessage(result.profit, result.totalPrincipal, result.fundName, yearsElapsed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden"
    >
      {/* Headline */}
      <div className="px-5 pt-5 pb-4 border-b border-white/8">
        <div className="flex gap-3">
          <span className="text-3xl flex-shrink-0">{msg.emoji}</span>
          <div>
            <p className="text-base font-black text-white leading-snug whitespace-pre-line">
              {msg.headline}
            </p>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{msg.sub}</p>
          </div>
        </div>
      </div>

      {/* Life values */}
      {msg.lifeValues.length > 0 && (
        <div className="px-5 py-4">
          <p className="text-[10px] font-black tracking-widest uppercase text-zinc-600 mb-3">
            この利益でできること
          </p>
          <div className="grid grid-cols-3 gap-2">
            {msg.lifeValues.map((lv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.07, duration: 0.35 }}
                className="rounded-xl bg-white/5 border border-white/8 p-3 text-center"
              >
                <span className="text-xl block mb-1">{lv.emoji}</span>
                <p className="text-[10px] text-zinc-500 mb-0.5 leading-tight">{lv.label}</p>
                <p className="text-xs font-black text-white">
                  {lv.count !== null ? `${lv.count.toLocaleString()}` : ""}{lv.unit}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
