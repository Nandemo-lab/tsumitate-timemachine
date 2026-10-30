"use client";

import { useMemo, useState } from "react";
import { BarChart3, BookOpen, ChevronRight, Database, GitCompareArrows, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FundId } from "@/types";
import { FUNDS } from "@/lib/funds";
import { simulate, formatCurrency } from "@/lib/simulation";
import { MainTab } from "@/components/layout/BottomNav";
import SiteFooter from "@/components/layout/SiteFooter";
import RecentConditions from "@/components/simulation/RecentConditions";
import { RecentSimulation } from "@/lib/recent-simulations";
import { trackSourceView } from "@/lib/analytics";
import { HomeEditorialIllustration } from "@/components/visual/VisualStory";

interface Props {
  onNavigate: (tab: MainTab) => void;
  onFundSelect: (fundId: FundId) => void;
  onTaraeba: (fundId: FundId, startYear: number, startMonth: number, monthlyAmount: number) => void;
  onRestoreRecent: (item: RecentSimulation) => void;
}

const PICKS: FundId[] = ["orcan", "sp500", "nasdaq100"];
const AMOUNTS = [10000, 30000, 50000];
const POPULAR_COMPARE = [
  { href: "/compare/orukan-vs-sp500", label: "オルカン vs S&P500" },
  { href: "/compare/orukan-vs-nasdaq100", label: "オルカン vs NASDAQ100" },
  { href: "/compare/vt-vs-orukan", label: "VT vs オルカン" },
];

export default function HomeView({ onNavigate, onTaraeba, onRestoreRecent }: Props) {
  const [fund, setFund] = useState<FundId>("orcan");
  const [startYear, setStartYear] = useState(2020);
  const [amount, setAmount] = useState(30000);
  const preview = useMemo(() => simulate({ fundId: fund, startYear, startMonth: 1, monthlyAmount: amount }), [fund, startYear, amount]);

  return (
    <div className="pb-28 pt-5 md:pt-10">
      <section className="mx-auto grid max-w-6xl items-center gap-7 px-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:px-8">
        <div className="text-center md:text-left">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#DCEFFA] px-4 py-2 text-xs font-bold text-[#236B8E]"><BarChart3 className="h-4 w-4" /> 公式月次データで過去を検証</p>
          <h1 className="font-heading text-[2rem] font-bold leading-[1.35] tracking-tight text-[#263A53] md:text-5xl">あの時から積み立てていたら、<br className="hidden sm:block" />いくらになった？</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-slate-600 md:mx-0">商品・開始年・月額を選ぶだけ。元本と評価額の動きを、過去の公式月次データで確かめられます。</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs font-bold text-[#40556C] md:justify-start">
            <span className="rounded-full bg-[#CDEFE2] px-3 py-2">登録不要</span>
            <span className="rounded-full bg-[#FFF1E7] px-3 py-2">同じ条件で比較</span>
            <span className="rounded-full bg-[#EEF4FA] px-3 py-2">出典を公開</span>
          </div>
        </div>
        <HomeEditorialIllustration />
      </section>

      <section className="mx-4 mt-7 rounded-[1.75rem] border border-[#D9E3E8] bg-white p-5 shadow-[0_18px_45px_rgba(38,58,83,0.08)] md:mx-auto md:max-w-3xl md:p-8" aria-labelledby="quick-start-title">
        <div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-xs font-bold text-[#236B8E]">3つ選んですぐ確認</p><h2 id="quick-start-title" className="mt-1 text-xl font-bold text-[#263A53]">積立条件を選ぶ</h2></div><span className="rounded-full bg-[#CDEFE2] px-3 py-1.5 text-xs font-bold text-emerald-800">無料・登録不要</span></div>
        <div className="space-y-5">
          <fieldset><legend className="mb-2 text-sm font-bold text-slate-700">1. 商品</legend><div className="grid grid-cols-3 gap-2">{PICKS.map((id) => <button key={id} type="button" aria-pressed={fund === id} onClick={() => setFund(id)} className={`min-h-12 rounded-xl border px-2 text-sm font-bold ${fund === id ? "border-[#4E94B3] bg-[#DCEFFA] text-[#1D5B79]" : "border-[#D9E3E8] bg-white text-slate-700"}`}>{FUNDS[id].shortName}</button>)}</div></fieldset>
          <div className="grid gap-5 sm:grid-cols-2">
            <fieldset><legend className="mb-2 text-sm font-bold text-slate-700">2. 開始年</legend><div className="grid grid-cols-3 gap-2">{[2018, 2020, 2022].map((year) => <button key={year} type="button" aria-pressed={startYear === year} onClick={() => setStartYear(year)} className={`min-h-12 rounded-xl border text-sm font-bold ${startYear === year ? "border-[#4E94B3] bg-[#DCEFFA] text-[#1D5B79]" : "border-[#D9E3E8] bg-white text-slate-700"}`}>{year}年</button>)}</div></fieldset>
            <fieldset><legend className="mb-2 text-sm font-bold text-slate-700">3. 毎月の積立額</legend><div className="grid grid-cols-3 gap-2">{AMOUNTS.map((value) => <button key={value} type="button" aria-pressed={amount === value} onClick={() => setAmount(value)} className={`min-h-12 rounded-xl border text-sm font-bold ${amount === value ? "border-[#4E94B3] bg-[#DCEFFA] text-[#1D5B79]" : "border-[#D9E3E8] bg-white text-slate-700"}`}>{value / 10000}万円</button>)}</div></fieldset>
          </div>
        </div>
        <button type="button" onClick={() => onTaraeba(fund, startYear, 1, amount)} className="tm-primary-button mt-6 flex w-full items-center justify-center gap-2 px-5 py-4 text-base">条件を選んで積立実績を調べる <ChevronRight className="h-5 w-5" /></button>
        <p className="mt-3 text-center text-xs leading-5 text-slate-600">過去実績であり、将来の成果を示すものではありません。</p>
      </section>

      <section className="mx-4 mt-6 rounded-2xl bg-[#EFF8F4] p-5 md:mx-auto md:max-w-3xl" aria-label="条件別の検証例"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold text-emerald-800">条件別の検証例</p><p className="mt-1 text-sm text-slate-600">{FUNDS[fund].shortName}・{startYear}年1月〜・月{formatCurrency(amount)}</p></div><div className="text-right"><p className="text-xs text-slate-600">期間末評価額</p><p className="font-number text-2xl font-bold text-[#263A53]">{formatCurrency(preview.finalValue)}</p></div></div></section>

      <div className="mx-4 mt-8 md:mx-auto md:max-w-3xl"><RecentConditions onRestore={onRestoreRecent} /></div>
      <section className="mx-4 mt-10 md:mx-auto md:max-w-3xl"><div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-bold text-[#236B8E]">人気の比較</p><h2 className="mt-1 text-xl font-bold text-[#263A53]">同じ条件で比べる</h2></div><button type="button" onClick={() => onNavigate("compare")} className="min-h-11 text-sm font-bold text-[#236B8E]">比較を試す</button></div><div className="grid gap-3 md:grid-cols-3">{POPULAR_COMPARE.map((item) => <Link key={item.href} href={item.href} className="flex min-h-14 items-center justify-between rounded-2xl border border-[#D9E3E8] bg-white px-4 py-3 text-sm font-bold text-[#263A53] shadow-sm"><span>{item.label}</span><GitCompareArrows className="h-4 w-4 text-[#4E94B3]" /></Link>)}</div></section>
      <section className="mx-4 mt-10 grid gap-3 md:mx-auto md:max-w-3xl md:grid-cols-2"><Link href="/about/data-sources" onClick={() => trackSourceView("home_trust_panel")} className="rounded-2xl bg-[#DCEFFA] p-5 text-[#263A53]"><Database className="h-5 w-5 text-[#236B8E]" /><h2 className="mt-3 font-bold">データの根拠を公開</h2><p className="mt-2 text-sm leading-6 text-slate-700">一次情報、計算方法、収録期間を商品ごとに確認できます。</p></Link><Link href="/guide" className="rounded-2xl bg-[#FFEEE3] p-5 text-[#263A53]"><BookOpen className="h-5 w-5 text-[#A65335]" /><h2 className="mt-3 font-bold">結果の読み方を知る</h2><p className="mt-2 text-sm leading-6 text-slate-700">過去実績と将来予測を分けて、積立の考え方を整理します。</p></Link></section>
      <div className="mx-4 mt-8 flex items-start gap-2 rounded-2xl border border-[#D9E3E8] bg-white p-4 text-xs leading-6 text-slate-600 md:mx-auto md:max-w-3xl"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /><span>A品質9系列の実績期間：2026年9月まで。商品設定前の期間や欠損値は別系列で補いません。参考系列は数値シミュレーションから分離しています。</span></div>
      <div className="mt-12"><SiteFooter /></div>
    </div>
  );
}
