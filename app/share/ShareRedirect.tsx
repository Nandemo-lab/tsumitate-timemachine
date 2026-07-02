"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShareParams } from "@/lib/utils/shareUrl";

interface Props {
  params: ShareParams | null;
}

export default function ShareRedirect({ params }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!params) {
      router.replace("/");
      return;
    }
    const { fund, year, month, amount } = params;
    router.replace(`/?f=${fund}&y=${year}&m=${month}&a=${amount}`);
  }, [params, router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#09090b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        color: "#a5b4fc",
        fontFamily: "sans-serif",
        fontSize: "15px",
      }}
    >
      <span style={{ fontSize: "20px" }}>⏰</span>
      <span>シミュレーションを読み込んでいます…</span>
    </div>
  );
}
