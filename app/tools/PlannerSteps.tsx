import Link from "next/link";

export default function PlannerSteps({ current }: { current: "goal" | "withdrawal" }) {
  return <nav aria-label="資産計画の手順" className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-4 text-sm">
    <Link href="/tools/goal-cost" aria-current={current === "goal" ? "step" : undefined}
      className={`min-h-11 rounded-md px-3 py-3 ${current === "goal" ? "bg-[#263A53] font-semibold text-white" : "bg-white text-[#263A53] underline underline-offset-4"}`}>
      1. 目標から積み立てる
    </Link>
    <Link href="/tools/withdrawal" aria-current={current === "withdrawal" ? "step" : undefined}
      className={`min-h-11 rounded-md px-3 py-3 ${current === "withdrawal" ? "bg-[#263A53] font-semibold text-white" : "bg-white text-[#263A53] underline underline-offset-4"}`}>
      2. 資産を取り崩す
    </Link>
  </nav>;
}
