"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FundId } from "@/types";
import { FUNDS, FUND_LIST, FUND_CATEGORIES, getFundTags, FUND_SHORT_DESC } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
import { ChevronRight, Sparkles, TrendingUp, Zap, Star, Clock3, BarChart2 } from "lucide-react";
import Link from "next/link";
import { COMPARE_PAGES } from "@/lib/compare-pages";
import { MainTab } from "@/components/layout/BottomNav";

const TARAEBA: { fundId: FundId; startYear: number; startMonth: number; monthlyAmount: number; scene: string }[] = [
  { fundId: "nasdaq100", startYear: 2020, startMonth: 1, monthlyAmount: 30000, scene: "2020年のコロナショック直後に始めていたら" },
  { fundId: "sp500",     startYear: 2020, startMonth: 1, monthlyAmount: 30000, scene: "新NISA開始前から米国の成長に賭けていたら" },
  { fundId: "orcan",     startYear: 2020, startMonth: 1, monthlyAmount: 30000, scene: "世界全体にコツコツ分散していたら" },
  { fundId: "india",     startYear: 2020, startMonth: 1, monthlyAmount: 30000, scene: "成長する新興国に早くから注目していたら" },
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
    <div className="pt-3 pb-28 space-y-7">

      {/* ── Hero（コンパクト・静的表示） ── */}
      <div className="px-3 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 mb-2">
          <Clock3 className="h-3 w-3 text-indigo-300" />
          <span className="text-xs font-semibold text-indigo-300">積立タイムマシン</span>
        </div>
        <h1 className="font-heading text-[1.4rem] font-semibold text-white leading-[1.45] tracking-[0.01em] mb-1.5">
          もしあの時から
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #a5b4fc 0%, #fbbf24 100%)" }}
          >
            積み立てていたら？
          </span>
        </h1>
        <p className="text-sm text-zinc-400">過去の実績で「たられば」を体験する</p>
      </div>

      {/* ── 人気のたられば ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 px-4 mb-3">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <p className="font-heading text-sm font-semibold text-white">人気のたられば</p>
          <span className="text-[11px] text-zinc-400">タップして体験</span>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scroll-touch" style={{ scrollbarWidth: "none" }}>
          {taraeba.map(({ fund, result, startYear, monthlyAmount, scene }, i) => (
            <motion.button
              key={fund.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
              onClick={() => onTaraeba(fund.id, startYear, 1, monthlyAmount)}
              className="flex-shrink-0 w-56 rounded-2xl p-4 text-left border border-white/8 bg-white/[0.02]"
              whileTap={{ scale: 0.97 }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: fund.color }} />
                <p className="font-heading text-xs font-semibold text-zinc-300">{fund.encyclopedia.nickname}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-1.5 whitespace-nowrap">
                <p className="font-heading font-number text-2xl font-bold text-emerald-400 leading-none">
                  +{formatCurrency(result.profit)}
                </p>
                <p className="font-number text-xs font-bold text-emerald-300">
                  （+{result.returnRate.toFixed(1)}%）
                </p>
              </div>
              <p className="text-[11px] text-zinc-400">
                月{(monthlyAmount / 10000).toFixed(0)}万円 {startYear}年〜
              </p>
              <p className="text-[11px] text-zinc-500 mt-2 pt-2 border-t border-white/8 leading-snug">
                {scene}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ── 自分で試してみる（メインCTA） ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
        className="px-4"
      >
        <button
          onClick={() => onNavigate("timemachine")}
          className="w-full rounded-2xl py-5 text-base font-bold text-white flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #f59e0b 100%)",
            boxShadow: "0 8px 24px #6366f130",
          }}
        >
          <Zap className="h-5 w-5" />
          自分で試してみる
        </button>
        <p className="text-center text-[11px] text-zinc-400 mt-2">
          銘柄・年・金額を自由に設定できます
        </p>
      </motion.div>

      {/* ── 今日のおすすめ銘柄 ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="px-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-amber-400" fill="#f59e0b" />
          <p className="font-heading text-sm font-semibold text-white">今日のおすすめ銘柄</p>
        </div>

        <motion.button
          onClick={() => { onFundSelect(pick.id); onNavigate("encyclopedia"); }}
          className="w-full rounded-2xl text-left overflow-hidden border border-white/8"
          style={{ background: "rgba(255,255,255,0.02)" }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Top section */}
          <div className="p-4 pb-3">
            {/* Category + NISA */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs">{FUND_CATEGORIES[pick.category].emoji}</span>
              <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">
                {FUND_CATEGORIES[pick.category].label}
              </span>
              {(pickEnc.nisaSupport.tsumitate || pickEnc.nisaSupport.growth) && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300">NISA対応</span>
              )}
              <div className="flex items-center gap-0.5 ml-auto">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-2.5 w-2.5"
                    fill={j < pickEnc.beginnerScore ? "#f59e0b" : "none"}
                    stroke={j < pickEnc.beginnerScore ? "#f59e0b" : "#52525b"}
                  />
                ))}
              </div>
            </div>

            {/* 銘柄名（やや目立たせる） */}
            <h3 className="font-heading text-lg font-bold text-white mb-2">{pickEnc.nickname}</h3>

            {/* HERO: 利益額 → リターン率 */}
            <p className="text-[11px] text-zinc-400 mb-1">2020年から月3万円積立なら</p>
            <div className="flex items-baseline gap-1.5 mb-2.5">
              <p className="font-heading font-number text-[1.9rem] font-bold text-emerald-400 leading-none">
                +{formatCurrency(pickResult.profit)}
              </p>
              <p className="font-number text-sm font-bold text-emerald-300">（+{pickResult.returnRate.toFixed(1)}%）</p>
            </div>

            {/* Catchcopy — 最大2行 */}
            <p className="text-sm text-zinc-300 leading-relaxed line-clamp-2">{pickEnc.catchCopy}</p>
          </div>

          {/* Feature tags — 1行に収める */}
          <div className="px-4 pb-3 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {pickEnc.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="flex-shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium border border-white/8 text-zinc-300 whitespace-nowrap"
              >
                {f}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-white/8">
            <p className="text-xs font-bold text-zinc-300">詳しく見る</p>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
          </div>
        </motion.button>
      </motion.section>

      {/* ── 初心者向けランキング ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
        className="px-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <p className="font-heading text-sm font-semibold text-white">初心者向けランキング</p>
          </div>
          <button
            onClick={() => onNavigate("encyclopedia")}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-0.5"
          >
            図鑑へ <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-2">
          {beginnerRanking.map((fund, i) => {
            const enc = fund.encyclopedia;
            const tags = getFundTags(fund);
            const medals = ["🥇", "🥈", "🥉", "4️⃣"];
            return (
              <motion.button
                key={fund.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.28 + i * 0.05 }}
                onClick={() => { onFundSelect(fund.id); onNavigate("encyclopedia"); }}
                className="w-full flex items-center gap-3 rounded-xl p-3.5 border border-white/8 bg-white/[0.015] hover:bg-white/[0.04] transition-colors text-left"
                style={{ minHeight: 56 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-lg flex-shrink-0">{medals[i]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <p className="font-heading text-sm font-semibold text-white">{enc.nickname}</p>
                    {tags.map((t) => (
                      <span key={t} className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-white/10 text-zinc-400">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate">{FUND_SHORT_DESC[fund.id]}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      {/* ── 全銘柄ランキング（上位5件） ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="px-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-heading text-sm font-semibold text-white">全銘柄ランキング</p>
            <p className="text-[11px] text-zinc-400">2020年〜 月3万円 利益額順</p>
          </div>
          <button
            onClick={() => onNavigate("timemachine")}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-0.5"
          >
            全部試す <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-1.5">
          {topFunds.map(({ fund, result }, i) => {
            const enc = fund.encyclopedia;
            const tags = getFundTags(fund);
            const medals = ["🥇", "🥈", "🥉", "4", "5"];
            return (
              <motion.button
                key={fund.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.34 + i * 0.04 }}
                onClick={() => onTaraeba(fund.id, 2020, 1, 30000)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-3 border border-white/8 bg-white/[0.012] hover:bg-white/[0.035] transition-colors text-left"
                style={{ minHeight: 52 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-sm flex-shrink-0 w-6 text-center">
                  {i < 3 ? medals[i] : <span className="text-zinc-400 font-bold">{i + 1}</span>}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-heading text-sm font-semibold text-white">{enc.nickname}</p>
                    {tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] font-medium px-1.5 py-0.5 rounded border border-white/10 text-zinc-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-number text-sm font-bold text-emerald-400">+{formatCurrency(result.profit)}</p>
                  <p className="font-number text-[10px] text-emerald-300">（+{result.returnRate.toFixed(0)}%）</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      <p className="text-center text-xs text-zinc-400 px-6 leading-relaxed">
        2015年以降の実績データを使用したシミュレーションです。手数料・税金は考慮していません。
      </p>

      {/* ── 人気比較ランキング ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="px-4 space-y-3"
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-violet-400" />
          <p className="font-heading text-sm font-semibold text-white">人気比較ランキング</p>
        </div>
        <div className="space-y-2">
          {COMPARE_PAGES.slice(0, 5).map((cp, i) => {
            const fA = FUNDS[cp.fundAId];
            const fB = FUNDS[cp.fundBId];
            const RANK = ["🥇", "🥈", "🥉", "4位", "5位"];
            return (
              <Link
                key={cp.slug}
                href={`/compare/${cp.slug}`}
                className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-3 hover:bg-white/[0.06] transition-colors"
              >
                <span className="text-sm w-6 text-center flex-shrink-0">{RANK[i]}</span>
                <span className="flex items-center gap-1.5 text-sm font-bold flex-1 min-w-0">
                  <span style={{ color: fA.color }}>{fA.shortName}</span>
                  <span className="text-zinc-500 text-xs">vs</span>
                  <span style={{ color: fB.color }}>{fB.shortName}</span>
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-500 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </motion.section>

      {/* ── フッターリンク ── */}
      <div className="px-4 pt-1 pb-2 border-t border-white/[0.06]">
        <nav className="flex items-center justify-center gap-5 flex-wrap mb-2">
          {[
            { href: "/terms",   label: "利用規約" },
            { href: "/privacy", label: "プライバシーポリシー" },
            { href: "/contact", label: "お問い合わせ" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
        <p className="text-center text-[10px] text-zinc-600">
          © 2025 積立タイムマシン
        </p>
      </div>
    </div>
  );
}
