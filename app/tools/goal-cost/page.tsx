import type { Metadata } from "next";
import GoalCostClient from "./GoalCostClient";

export const metadata: Metadata = {
  title: "目標額から逆算する積立額と運用費用の差",
  description: "今の価値での目標額、期間、想定年率、物価上昇率、費用率を自分で設定。第三者の実績データを使わず、必要な月額の差を端末内で試算します。",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tsumitate-timemachine.com/tools/goal-cost" },
  openGraph: {
    title: "目標額から逆算する積立額と費用の差",
    description: "今の価値での目標額から、積立額と費用率の違いを条件付きで試算。実績や将来成果ではありません。",
    url: "https://tsumitate-timemachine.com/tools/goal-cost",
  },
  twitter: { card: "summary", title: "目標額から逆算する積立額と費用の差", description: "自分で設定する条件に基づく試算です。" },
};

export default function GoalCostPage() { return <GoalCostClient />; }
