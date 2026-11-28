import type { Metadata } from "next";
import WithdrawalClient from "./WithdrawalClient";

export const metadata: Metadata = {
  title: "資産取り崩しシミュレーション｜物価と想定利回りを自分で設定",
  description: "現在の資産、月の取崩額、期間、想定利回り、物価上昇率から残高と資金不足時期を試算。過去の運用実績を使わない端末内の計算です。",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tsumitate-timemachine.com/tools/withdrawal" },
  openGraph: {
    title: "資産取り崩しシミュレーション",
    description: "手元の資産と月額を入力し、物価を考慮した残高と取崩可能額を試算します。",
    url: "https://tsumitate-timemachine.com/tools/withdrawal",
  },
  twitter: { card: "summary", title: "資産取り崩しシミュレーション", description: "自分の条件による概算です。" },
};

export default function WithdrawalPage() { return <WithdrawalClient />; }
