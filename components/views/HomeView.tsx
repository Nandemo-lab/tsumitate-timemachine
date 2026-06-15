"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FundId } from "@/types";
import { FUNDS, FUND_LIST, FUND_CATEGORIES } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
import { ChevronRight, Sparkles, TrendingUp, Zap, Star } from "lucide-react";
import { MainTab } from "@/components/layout/BottomNav";

const TARAEBA: { fundId: FundId; startYear: number; startMonth: number; monthlyAmount: number; label: string }[] = [
  { fundId: "nasdaq100", startYear: 2020, startMonth: 1, monthlyAmount: 30000, label: "コロナ後に始めていたら" },
  { fundId: "sp500",     startYear: 2020, startMonth: 1, monthlyAmount: 30000, label: "S&P500で5年間" },
  { fundId: "orcan",     startYear: 2020, startMonth: 1, monthlyAmount: 30000, label: "オルカンで堅実に" },
  { fundId: "india",     startYear: 2020, startMonth: 1, monthlyAmount: 30000, label: "インド株の躍進" },
];

interface Props {
  onNavigate: (tab: MainTab) => void;
  onFundSelect: (fundId: FundId) => void;
  onTaraeba: (fundId: FundId, startYear: number, startMonth: number, monthlyAmount: number) => void;
}

export default function HomeView({ onNavigate, onFundSelect, onTaraeba }: Props) {
  const taraeba = useMemo(
    () =>
      TARAEBA.map((p) => ({
        ...p,
        result: simulate({ fundId: p.fundId, startYear: p.startYear, startMonth: p.startMonth, monthlyAmount: p.monthlyAmount }),
        fund: FUNDS[p.fundId],
      })),
    []
  );

  // 今日のおすすめ（日付ベースで日替わり）
  const todayPick = useMemo(() => {
    const dayIndex = new Date().getDate() % FUND_LIST.length;
    const fund = FUND_LIST[dayIndex];
    const result = simulate({ fundId: fund.id, startYear: 2020, startMonth: 1, monthlyAmount: 30000 });
    return { fund, result };
  }, []);

  // 全銘柄2020年〜月3万円の成績（上位5件）
  const topFunds = useMemo(
    () =>
      FUND_LIST
        .map((fund) => ({
          fund,
          result: simulate({ fundId: fund.id, startYear: 2020, startMonth: 1, monthlyAmount: 30000 }),
        }))
        .sort((a, b) => b.result.profit - a.result.profit)
        .slice(0, 5),
    []
  );

  // 初心者向けランキング
  const beginnerRanking = useMemo(
    () => [...FUND_LIST].sort((a, b) => b.encyclopedia.beginnerScore - a.encyclopedia.beginnerScore).slice(0, 4),
    []
  );

  const { fund: pick, result: pickResult } = todayPick;
  const pickEnc = pick.encyclopedia;

  return (
    <div className="pt-6 pb-28 space-y-7">

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="px-4 pt-2 text-center"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 mb-3">
          <span className="text-xs">⏰</span>
          <span className="text-xs font-semibold text-indigo-300">積立タイムマシン</span>
        </div>
        <h1 className="text-[1.9rem] font-black text-white leading-[1.1] mb-2 tracking-tight">
          もしあの時から<br />
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #f59e0b 100%)" }}
          >
            積み立てていたら？
          </span>
        </h1>
        <p className="text-xs text-zinc-500">過去の実績で「たられば」を体験する</p>
      </motion.div>

      {/* ── 人気のたられば ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 px-4 mb-3">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <p className="text-sm font-black text-white">人気のたられば</p>
          <span className="text-[10px] text-zinc-600">タップして体験</span>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: "none" }}>
          {taraeba.map(({ fund, result, startYear, monthlyAmount, label }, i) => (
            <motion.button
              key={fund.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.12 + i * 0.07 }}
              onClick={() => onTaraeba(fund.id, startYear, 1, monthlyAmount)}
              className="flex-shrink-0 w-48 rounded-2xl p-4 text-left"
              style={{
                background: `linear-gradient(145deg, ${fund.color}20 0%, rgba(9,9,11,0.85) 100%)`,
                border: `1px solid ${fund.color}35`,
              }}
              whileTap={{ scale: 0.96 }}
            >
              <p className="text-[10px] text-zinc-500 mb-1">{label}</p>
              <div className="flex items-center gap-1.5 mb-3">
                <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: fund.color }} />
                <p className="text-xs font-black text-zinc-300">{fund.encyclopedia.nickname}</p>
              </div>
              <p className="text-3xl font-black text-emerald-400 leading-none">
                +{formatCurrency(result.profit)}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1.5">
                +{result.returnRate.toFixed(1)}% · 月{(monthlyAmount / 10000).toFixed(0)}万円 {startYear}年〜
              </p>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ── メインCTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="px-4"
      >
        <button
          onClick={() => onNavigate("timemachine")}
          className="w-full rounded-2xl py-5 text-base font-black text-white flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #f59e0b 100%)",
            boxShadow: "0 8px 32px #6366f128, 0 0 0 1px #6366f115",
          }}
        >
          <Zap className="h-5 w-5" />
          自分で試してみる
        </button>
        <p className="text-center text-[10px] text-zinc-700 mt-2">
          銘柄・年・金額を自由に設定できます
        </p>
      </motion.div>

      {/* ── 今日のおすすめ銘柄 ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="px-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">🌟</span>
          <p className="text-sm font-black text-white">今日のおすすめ銘柄</p>
        </div>

        <motion.button
          onClick={() => { onFundSelect(pick.id); onNavigate("encyclopedia"); }}
          className="w-full rounded-2xl text-left overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${pick.color}22 0%, rgba(9,9,11,0.95) 60%, rgba(9,9,11,1) 100%)`,
            border: `1px solid ${pick.color}40`,
            boxShadow: `0 4px 24px ${pick.color}10`,
          }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Top section */}
          <div className="p-5 pb-4">
            {/* Category + NISA */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">{FUND_CATEGORIES[pick.category].emoji}</span>
              <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">
                {FUND_CATEGORIES[pick.category].label}
              </span>
              {pickEnc.nisaCompatible && (
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">NISA対応</span>
              )}
            </div>

            {/* Fund name */}
            <h3 className="text-2xl font-black text-white mb-0.5">{pickEnc.nickname}</h3>
            <p className="text-[10px] text-zinc-600 mb-3">{pickEnc.formalName}</p>

            {/* Beginner score */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-3 w-3"
                    fill={j < pickEnc.beginnerScore ? "#f59e0b" : "none"}
                    stroke={j < pickEnc.beginnerScore ? "#f59e0b" : "#3f3f46"}
                  />
                ))}
              </div>
              <span className="text-[10px] text-zinc-500">初心者向け</span>
            </div>

            {/* Catchcopy */}
            <p className="text-sm text-zinc-400 leading-relaxed">{pickEnc.catchCopy}</p>
          </div>

          {/* Profit strip */}
          <div
            className="mx-4 mb-4 rounded-xl p-4 flex items-end justify-between"
            style={{ background: `${pick.color}12`, border: `1px solid ${pick.color}20` }}
          >
            <div>
              <p className="text-[10px] text-zinc-600 mb-1">2020年から月3万円積立なら</p>
              <p className="text-3xl font-black text-emerald-400">+{formatCurrency(pickResult.profit)}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                元本 {formatCurrency(pickResult.totalPrincipal)} → {formatCurrency(pickResult.finalValue)}
              </p>
            </div>
            <p className="text-lg font-black text-emerald-400">+{pickResult.returnRate.toFixed(1)}%</p>
          </div>

          {/* Feature tags */}
          <div className="px-4 pb-4 flex flex-wrap gap-1.5">
            {pickEnc.features.map((f) => (
              <span
                key={f}
                className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                style={{ background: `${pick.color}18`, color: pick.color }}
              >
                {f}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div
            className="px-5 py-3.5 flex items-center justify-between"
            style={{ borderTop: `1px solid ${pick.color}20` }}
          >
            <p className="text-xs font-bold text-zinc-300">詳しく見る</p>
            <ChevronRight className="h-4 w-4 text-zinc-500" />
          </div>
        </motion.button>
      </motion.section>

      {/* ── 全銘柄ランキング（上位5件） ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="px-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-black text-white">全銘柄ランキング</p>
            <p className="text-[10px] text-zinc-600">2020年〜 月3万円 利益額順</p>
          </div>
          <button
            onClick={() => onNavigate("timemachine")}
            className="text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-0.5"
          >
            全部試す <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {topFunds.map(({ fund, result }, i) => {
            const enc = fund.encyclopedia;
            const medals = ["🥇", "🥈", "🥉", "4", "5"];
            return (
              <motion.button
                key={fund.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.32 + i * 0.04 }}
                onClick={() => onTaraeba(fund.id, 2020, 1, 30000)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left"
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-sm flex-shrink-0 w-6 text-center">
                  {i < 3 ? medals[i] : <span className="text-zinc-600 font-bold">{i + 1}</span>}
                </span>
                <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: fund.color }} />
                <p className="text-sm font-bold text-white flex-1">{enc.nickname}</p>
                <p className="text-sm font-black text-emerald-400">+{formatCurrency(result.profit)}</p>
                <p className="text-[10px] text-zinc-600 w-10 text-right">+{result.returnRate.toFixed(0)}%</p>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* ── 初心者向けランキング ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
        className="px-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-black text-white">初心者向けランキング</p>
          </div>
          <button
            onClick={() => onNavigate("encyclopedia")}
            className="text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-0.5"
          >
            図鑑へ <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-2">
          {beginnerRanking.map((fund, i) => {
            const enc = fund.encyclopedia;
            const medals = ["🥇", "🥈", "🥉", "4️⃣"];
            return (
              <motion.button
                key={fund.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.38 + i * 0.05 }}
                onClick={() => { onFundSelect(fund.id); onNavigate("encyclopedia"); }}
                className="w-full flex items-center gap-3 rounded-xl p-3 border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left"
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-lg flex-shrink-0">{medals[i]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-black text-white">{enc.nickname}</p>
                    {enc.nisaCompatible && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">NISA</span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate">{enc.forWhom.slice(0, 28)}…</p>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-700 flex-shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      <p className="text-center text-[10px] text-zinc-700 px-4">
        2015年以降の実績データ使用 · 手数料・税金は非考慮
      </p>
    </div>
  );
}
