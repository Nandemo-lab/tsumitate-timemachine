"use client";

import { useEffect, useState } from "react";
import { parseShareParams, ShareParams } from "@/lib/utils/shareUrl";

export function useShareUrl(): ShareParams | null {
  const [params, setParams] = useState<ShareParams | null>(null);

  useEffect(() => {
    const parsed = parseShareParams(window.location.search);
    if (parsed) setParams(parsed);
  }, []);

  return params;
}
