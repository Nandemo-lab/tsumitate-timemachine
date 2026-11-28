import type { Metadata } from "next";
import OwnDataClient from "./OwnDataClient";

export const metadata: Metadata = {
  title: "手元の月次データで積立を試算",
  description: "ご自身で利用権限を確認した月次騰落率を端末内で計算。入力データをサーバーに送信しません。",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tsumitate-timemachine.com/tools/own-data" },
  openGraph: {
    title: "手元の月次データで積立を試算",
    description: "利用者が用意した月次騰落率を端末内だけで計算。特定の商品の実績ではありません。",
    url: "https://tsumitate-timemachine.com/tools/own-data",
  },
  twitter: { card: "summary", title: "手元の月次データで積立を試算", description: "特定の商品の実績ではありません。" },
};

export default function OwnDataPage() { return <OwnDataClient />; }
