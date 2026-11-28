import type { Metadata } from "next";
import OwnDataClient from "./OwnDataClient";

export const metadata: Metadata = {
  title: "手元の月次データで積立を試算",
  description: "ご自身で利用権限を確認した月次騰落率を端末内で計算。入力データをサーバーに送信しません。",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://tsumitate-timemachine.com/tools/own-data" },
};

export default function OwnDataPage() { return <OwnDataClient />; }
