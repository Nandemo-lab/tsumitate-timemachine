"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { parseShareParams, ShareParams } from "@/lib/utils/shareUrl";

export function useShareUrl(): ShareParams | null {
  const searchParams = useSearchParams();
  return useMemo(() => parseShareParams(searchParams.toString()), [searchParams]);
}
