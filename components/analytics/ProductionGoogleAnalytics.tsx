"use client";

import { useSyncExternalStore } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

const PRODUCTION_HOST = "tsumitate-timemachine.com";

/**
 * ローカルの production build やプレビュー環境を GA4 へ混入させない。
 * hydration 後に本番ホストだと確認できた場合だけ Google tag を読み込む。
 */
export function ProductionGoogleAnalytics({ gaId }: { gaId: string }) {
  const isProductionHost = useSyncExternalStore(
    () => () => undefined,
    () => window.location.hostname === PRODUCTION_HOST,
    () => false,
  );

  return isProductionHost ? <GoogleAnalytics gaId={gaId} /> : null;
}
