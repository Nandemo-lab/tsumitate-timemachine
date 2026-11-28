"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PlannerSteps from "../PlannerSteps";
import { projectGoal, type GoalInputs } from "@/lib/goal-fee-simulation";

const defaults: GoalInputs = {
  targetToday: 30_000_000, years: 20, grossAnnualPercent: 4,
  inflationAnnualPercent: 2, annualFeeLowPercent: 0.1, annualFeeHighPercent: 1,
};
const keys = Object.keys(defaults) as (keyof GoalInputs)[];
const yen = (value: number) => `${value.toLocaleString("ja-JP")}円`;

export default function GoalCostClient() {
  const [fields, setFields] = useState<Record<keyof GoalInputs, string>>(
    Object.fromEntries(keys.map(key => [key, String(defaults[key])])) as Record<keyof GoalInputs, string>,
  );
  const [result, setResult] = useState<ReturnType<typeof projectGoal> | null>(null);
  const [error, setError] = useState("");
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    const readSharedURL = () => {
      const params = new URLSearchParams(location.search);
      if (!keys.some(key => params.has(key))) return;
      const next = Object.fromEntries(keys.map(key => [key, params.get(key) ?? String(defaults[key])])) as Record<keyof GoalInputs, string>;
      setFields(next);
      try { setResult(projectGoal(Object.fromEntries(keys.map(key => [key, Number(next[key])])) as GoalInputs)); }
      catch { setError("共有URLの条件が不正です。数値を確認してください。"); }
    };
    // The queued callback runs after mount, and popstate keeps shared URLs usable.
    queueMicrotask(readSharedURL);
    window.addEventListener("popstate", readSharedURL);
    return () => window.removeEventListener("popstate", readSharedURL);
  }, []);

  function calculate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setResult(null); setError(""); setShareStatus("");
    if (keys.some(key => fields[key].trim() === "")) { setError("すべての条件を入力してください"); return; }
    try { setResult(projectGoal(Object.fromEntries(keys.map(key => [key, Number(fields[key])])) as GoalInputs)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "数値を確認してください"); }
  }

  async function share() {
    if (!result) return;
    const url = new URL(location.pathname, location.origin);
    for (const key of keys) url.searchParams.set(key, fields[key]);
    try { await navigator.clipboard.writeText(url.toString()); setShareStatus("条件付きの共有URLをコピーしました"); }
    catch { setShareStatus("コピーできませんでした。ブラウザの共有機能をご利用ください"); }
  }

  const inputs: { key: keyof GoalInputs; label: string; min: number; max: number; step: string; suffix: string }[] = [
    { key: "targetToday", label: "今の価値で必要な目標額", min: 100000, max: 100000000, step: "1", suffix: "円" },
    { key: "years", label: "積立する期間", min: 1, max: 40, step: "1", suffix: "年" },
    { key: "grossAnnualPercent", label: "費用を引く前の想定年率", min: -20, max: 20, step: "0.1", suffix: "%" },
    { key: "inflationAnnualPercent", label: "想定する物価上昇率", min: -2, max: 10, step: "0.1", suffix: "%" },
    { key: "annualFeeLowPercent", label: "比較する年率費用A", min: 0, max: 5, step: "0.01", suffix: "%" },
    { key: "annualFeeHighPercent", label: "比較する年率費用B", min: 0, max: 5, step: "0.01", suffix: "%" },
  ];

  return <main className="min-h-dvh bg-[#FAFAF7] px-4 py-8 text-[#263A53]">
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/" className="text-sm underline underline-offset-4">トップへ戻る</Link>
      <PlannerSteps current="goal" />
      <header className="space-y-3"><p className="text-xs font-bold tracking-wide text-indigo-700">条件を自分で置く・実績データ不使用</p>
        <h1 className="text-2xl font-black leading-tight sm:text-3xl">目標額から逆算する積立額と費用の差</h1>
        <p className="text-sm leading-7 text-slate-700">将来の目標額を今の購買力で指定し、物価上昇と運用費用の仮定を変えて必要な月額を比較します。実在商品の過去実績や将来予測ではありません。</p></header>
      <form onSubmit={calculate} className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        {inputs.map(({ key, label, min, max, step, suffix }) => <label key={key} className="block text-sm font-bold">{label}
          <span className="mt-2 flex items-center gap-2"><input type="number" inputMode="decimal" min={min} max={max} step={step} required value={fields[key]} onChange={e => setFields({ ...fields, [key]: e.target.value })} className="min-h-11 min-w-0 w-full rounded-lg border border-slate-400 px-3 font-normal" /><span>{suffix}</span></span></label>)}
        <button type="submit" className="min-h-12 rounded-xl bg-indigo-700 px-4 py-3 font-bold text-white sm:col-span-2">必要な月額を比較する</button>
      </form>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {result && <section aria-live="polite" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold">同じ目標額まで積み立てる場合</h2>
        <p className="text-sm">現在の{yen(Number(fields.targetToday))}に相当する将来の目標額：<strong>{yen(result.nominalTarget)}</strong></p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-indigo-50 p-4"><h3 className="font-bold">費用A：年{fields.annualFeeLowPercent}%</h3><p className="mt-2 text-2xl font-black">月{yen(result.monthlyA)}</p><p className="text-xs">積立元本 {yen(result.contributionA)}</p></div>
          <div className="rounded-xl bg-slate-100 p-4"><h3 className="font-bold">費用B：年{fields.annualFeeHighPercent}%</h3><p className="mt-2 text-2xl font-black">月{yen(result.monthlyB)}</p><p className="text-xs">積立元本 {yen(result.contributionB)}</p></div>
        </div>
        <p className="text-sm font-bold">BとAの必要月額の差：{yen(result.monthlyDifference)}（符号付き。費用率の大小で逆転します）</p>
        <div className="space-y-3 border-t border-slate-200 pt-4 text-sm" aria-label="必要積立額の比較">
          {([ ["費用A", result.monthlyA], ["費用B", result.monthlyB] ] as const).map(([label, amount]) =>
            <div key={label} className="grid grid-cols-[4rem_1fr] items-center gap-2"><span>{label}</span><div className="h-5 rounded-sm bg-slate-100"><div className="h-5 rounded-sm bg-[#526D82]" style={{ width: `${Math.max(2, amount / Math.max(result.monthlyA, result.monthlyB) * 100)}%` }} /></div><span className="col-start-2 text-xs">月{yen(amount)}</span></div>)}
        </div>
        <p className="text-sm leading-7">この目標額を開始資産として、次の取り崩し試算に渡せます。取り崩し時の年率・期間・月額は別途設定してください。</p>
        <Link href={`/tools/withdrawal?initialYen=${result.nominalTarget}&annualInflationPercent=${fields.inflationAnnualPercent}`} className="inline-flex min-h-11 items-center rounded-md bg-[#263A53] px-4 py-2 text-sm font-semibold text-white">この目標額で取り崩しを試す →</Link>
        <button type="button" onClick={share} className="min-h-11 rounded-lg border border-indigo-700 px-4 py-2 text-sm font-bold text-indigo-800">この条件のURLをコピー</button>
        <p role="status" className="text-sm">{shareStatus}</p>
      </section>}
      <p className="text-sm leading-7">積立後の資産を取り崩す期間も試したい場合は、<Link href="/tools/withdrawal" className="font-bold text-indigo-800 underline underline-offset-4">資産取り崩しシミュレーション</Link>へ。両方とも過去の運用実績は読み込みません。</p>
      <section className="space-y-2 text-xs leading-6 text-slate-700"><h2 className="text-base font-bold">計算条件と限界</h2>
        <p>毎月初めに同額を拠出し、その月に想定年率を複利換算して適用したあと、年率費用を月率換算して差し引きます。端数は必要月額を1円単位で切り上げ、積立元本はその月額×月数です。毎年同じ利回り・物価上昇率が続くという仮定で、値動き、税金、売買手数料、分配金、為替は扱いません。実際の信託報酬の計上方法や総費用とも異なる概算です。</p>
        <p>年率費用の差だけを比較するため、商品の値動き・投資対象・リスクが同じとは限りません。元本割れの可能性があります。<a className="underline" href="https://www.fsa.go.jp/policy/nisa2/invest/">金融庁の資産形成の説明</a>も参照してください。</p>
      </section>
    </div>
  </main>;
}
