"use client";

import { useState } from "react";
import Link from "next/link";
import { parseOwnReturns, simulateOwnReturns } from "@/lib/own-return-simulation";

const yen = (amount: number) => `${amount.toLocaleString("ja-JP")}円`;

export default function OwnDataClient() {
  const [raw, setRaw] = useState("");
  const [amount, setAmount] = useState("30000");
  const [result, setResult] = useState<ReturnType<typeof simulateOwnReturns> | null>(null);
  const [error, setError] = useState("");

  function calculate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null); setError("");
    try { setResult(simulateOwnReturns(parseOwnReturns(raw), Number(amount))); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "入力を確認してください"); }
  }

  return <main className="min-h-dvh bg-[#FAFAF7] px-4 py-10 text-[#263A53]">
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/" className="text-sm underline underline-offset-4">トップへ戻る</Link>
      <header className="space-y-3"><h1 className="text-2xl font-black sm:text-3xl">手元の月次データで積立を試算</h1>
        <p className="text-sm leading-7 text-slate-700">ご自身で利用権限を確認した月次騰落率を貼り付けてください。計算はブラウザ内だけで行い、入力値を送信・保存・共有しません。銘柄の実績や将来の利益を保証するものではありません。</p></header>
      <form onSubmit={calculate} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5">
        <label className="block text-sm font-bold" htmlFor="own-amount">毎月の積立額（円）</label>
        <input id="own-amount" type="number" inputMode="numeric" min="1" max="1000000" step="1" value={amount} onChange={e => setAmount(e.target.value)} className="min-h-11 w-full rounded-lg border border-slate-400 px-3" required />
        <label className="block text-sm font-bold" htmlFor="own-returns">月次騰落率（%）: 1行につき YYYY-MM,騰落率</label>
        <textarea id="own-returns" value={raw} onChange={e => setRaw(e.target.value)} placeholder={"2025-01,2.5\n2025-02,-1.2"} rows={8} className="w-full rounded-lg border border-slate-400 p-3 font-mono text-sm" spellCheck={false} required />
        <p className="text-xs leading-6 text-slate-600">1〜600か月、連続した月のみ対応。積立は月初、当月の騰落率を適用。税金・信託報酬・為替・分配金は入力系列に反映された範囲のみで、別途加算しません。数値は整数円へ表示時に丸めます。</p>
        <button type="submit" className="min-h-12 w-full rounded-xl bg-indigo-700 px-4 py-3 font-bold text-white">端末内で計算</button>
      </form>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {result && <section aria-live="polite" className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold">過去データを適用した結果</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm"><div><dt>積立元本</dt><dd className="mt-1 font-bold">{yen(result.principal)}</dd></div><div><dt>最終評価額</dt><dd className="mt-1 font-bold">{yen(result.finalValue)}</dd></div><div><dt>損益</dt><dd className="mt-1 font-bold">{yen(result.profit)}</dd></div><div><dt>元本割れ月数</dt><dd className="mt-1 font-bold">{result.underwaterMonths}か月</dd></div></dl>
        <p className="mt-4 text-xs text-slate-600">最大下落率（入力騰落率から計算した単位投資の過去ピーク比。積立残高の下落率ではありません）: {(result.maxDrawdown * 100).toFixed(1)}%。将来の値動きを示すものではありません。</p>
      </section>}
    </div>
  </main>;
}
