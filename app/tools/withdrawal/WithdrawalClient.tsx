"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PlannerSteps from "../PlannerSteps";
import { projectWithdrawal, sustainableMonthlyWithdrawal, type WithdrawalInputs } from "@/lib/withdrawal-simulation";

const defaults: WithdrawalInputs = { initialYen: 30_000_000, monthlyYen: 100_000, years: 30, annualReturnPercent: 2, annualInflationPercent: 2 };
const keys = Object.keys(defaults) as (keyof WithdrawalInputs)[];
const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;
const inputs: { key: keyof WithdrawalInputs; label: string; max: number; min: number; step: string; unit: string }[] = [
  { key: "initialYen", label: "開始時の資産", min: 0, max: 1_000_000_000, step: "1", unit: "円" },
  { key: "monthlyYen", label: "最初の月の取崩額", min: 0, max: 10_000_000, step: "1", unit: "円" },
  { key: "years", label: "取り崩す期間", min: 1, max: 50, step: "1", unit: "年" },
  { key: "annualReturnPercent", label: "費用控除後の想定年率", min: -20, max: 20, step: "0.1", unit: "%" },
  { key: "annualInflationPercent", label: "取崩額に反映する物価上昇率", min: -2, max: 10, step: "0.1", unit: "%" },
];

export default function WithdrawalClient() {
  const [fields, setFields] = useState<Record<keyof WithdrawalInputs, string>>(
    Object.fromEntries(keys.map(key => [key, String(defaults[key])])) as Record<keyof WithdrawalInputs, string>,
  );
  const [result, setResult] = useState<ReturnType<typeof projectWithdrawal> | null>(null);
  const [sustainable, setSustainable] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const read = () => {
      const params = new URLSearchParams(location.search);
      if (!keys.some(key => params.has(key))) return;
      const next = Object.fromEntries(keys.map(key => [key, params.get(key) ?? String(defaults[key])])) as Record<keyof WithdrawalInputs, string>;
      setFields(next);
      try {
        const values = Object.fromEntries(keys.map(key => [key, Number(next[key])])) as WithdrawalInputs;
        if (keys.some(key => next[key].trim() === "")) throw new RangeError();
        setResult(projectWithdrawal(values));
        setSustainable(sustainableMonthlyWithdrawal(values));
        setError("");
      } catch { setResult(null); setSustainable(null); setError("共有URLの数値を確認してください"); }
    };
    queueMicrotask(read);
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  function calculate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setResult(null); setSustainable(null); setError(""); setShareStatus("");
    if (keys.some(key => fields[key].trim() === "")) { setError("すべての条件を入力してください"); return; }
    try {
      const values = Object.fromEntries(keys.map(key => [key, Number(fields[key])])) as WithdrawalInputs;
      setResult(projectWithdrawal(values));
      setSustainable(sustainableMonthlyWithdrawal(values));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "数値を確認してください"); }
  }

  async function share() {
    if (!result) return;
    const url = new URL(location.pathname, location.origin);
    keys.forEach(key => url.searchParams.set(key, fields[key]));
    try { await navigator.clipboard.writeText(url.toString()); setShareStatus("条件付きURLをコピーしました"); }
    catch { setShareStatus("コピーできませんでした。ブラウザの共有機能をご利用ください"); }
  }

  return <main className="min-h-dvh bg-[#FAFAF7] px-4 py-8 text-[#263A53]"><div className="mx-auto max-w-3xl space-y-6">
    <Link href="/" className="text-sm underline underline-offset-4">トップへ戻る</Link>
    <PlannerSteps current="withdrawal" />
    <header className="space-y-3"><p className="text-xs font-bold tracking-wide text-indigo-700">想定条件を自分で入力・実績データ不使用</p>
      <h1 className="text-2xl font-black leading-tight sm:text-3xl">資産取り崩しシミュレーション</h1>
      <p className="text-sm leading-7 text-slate-700">最初の月額を物価上昇率に合わせて毎月調整し、何年持つかを確認します。老後資金の計画など、条件を変えて比較するための概算です。</p></header>
    <form onSubmit={calculate} className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
      {inputs.map(({ key, label, min, max, step, unit }) => <label key={key} className="block text-sm font-bold">{label}
        <span className="mt-2 flex items-center gap-2"><input type="number" inputMode="decimal" min={min} max={max} step={step} required value={fields[key]} onChange={event => setFields({ ...fields, [key]: event.target.value })} className="min-h-11 min-w-0 w-full rounded-lg border border-slate-400 px-3 font-normal" /><span>{unit}</span></span></label>)}
      <button type="submit" className="min-h-12 rounded-xl bg-indigo-700 px-4 py-3 font-bold text-white sm:col-span-2">取り崩しを試算する</button>
    </form>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {result && <section aria-live="polite" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold">試算結果</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-indigo-50 p-4"><h3 className="font-bold">期間末の資産残高</h3><p className="mt-2 text-2xl font-black">{yen(result.endingBalance)}</p></div>
        <div className="rounded-xl bg-slate-100 p-4"><h3 className="font-bold">期間中に取り崩した総額</h3><p className="mt-2 text-2xl font-black">{yen(result.totalWithdrawn)}</p></div>
      </div>
      <p className="text-sm font-bold">資金不足：{result.shortfallMonth === null ? "指定期間中は発生しない計算" : `${Math.ceil(result.shortfallMonth / 12)}年目の${(result.shortfallMonth - 1) % 12 + 1}か月目`}</p>
      <p className="text-sm">同じ条件で期間中に不足しない最初の月額の上限（1円単位）：<strong>{sustainable === null ? "計算中" : yen(sustainable)}</strong></p>
      <figure className="border-t border-slate-200 pt-4">
        <figcaption className="mb-2 text-sm font-semibold">年末残高の推移（一定年率の仮定）</figcaption>
        <svg role="img" aria-label={`開始時${yen(Number(fields.initialYen))}、${result.yearly.length}年目の年末残高${yen(result.endingBalance)}。${result.shortfallMonth === null ? "期間中の資金不足なし" : `${Math.ceil(result.shortfallMonth / 12)}年目に資金不足`}`} viewBox="0 0 600 180" preserveAspectRatio="none" className="h-44 w-full rounded-sm bg-[#F3F5F4]">
          <path d="M 20 155 H 590" stroke="#94A3B8" strokeWidth="1" />
          <polyline fill="none" stroke="#34546A" strokeWidth="3" vectorEffect="non-scaling-stroke" points={[
            [20, Number(fields.initialYen)], ...result.yearly.map((row, index) => [20 + 570 * (index + 1) / result.yearly.length, row.balance]),
          ].map(([x, value]) => `${x},${155 - 130 * value / Math.max(1, Number(fields.initialYen), ...result.yearly.map(row => row.balance))}`).join(" ")} />
        </svg>
        <p className="mt-1 flex justify-between text-xs text-slate-600"><span>開始時</span><span>{result.yearly.length}年目</span></p>
      </figure>
      <div className="overflow-x-auto"><table className="w-full min-w-[360px] text-right text-sm"><caption className="mb-2 text-left font-bold">年末残高と累計取崩額</caption>
        <thead><tr className="border-b"><th scope="col" className="py-2 text-left">年目</th><th scope="col">年末残高</th><th scope="col">累計取崩額</th></tr></thead><tbody>{result.yearly.map(row => <tr key={row.year} className="border-b border-slate-100"><th scope="row" className="py-2 text-left">{row.year}</th><td>{yen(row.balance)}</td><td>{yen(row.withdrawn)}</td></tr>)}</tbody></table></div>
      <button type="button" onClick={share} className="min-h-11 rounded-lg border border-indigo-700 px-4 py-2 text-sm font-bold text-indigo-800">この条件のURLをコピー</button><p role="status" className="text-sm">{shareStatus}</p>
    </section>}
    <section className="space-y-2 text-xs leading-6 text-slate-700"><h2 className="text-base font-bold">計算条件と限界</h2>
      <p>毎月初めに取り崩し、残高へ想定年率を月率換算して適用します。取崩額は物価上昇率で毎月変化します。途中の資産不足後も残高0円として期間末まで表示します。年率は費用控除後の仮定で、値動き、税金、売却費用、年金・追加収入は含みません。実際の運用には変動や元本割れがあり、試算は将来の結果や安全な取崩率を保証しません。</p>
      <p>月額の上限は指定した一定年率が続くと仮定した数学上の値です。生活費全体や個別の金融商品への推奨ではありません。<a href="https://www.fsa.go.jp/policy/nisa2/invest/" className="underline">金融庁の資産形成の説明</a>もご確認ください。</p>
    </section>
  </div></main>;
}
