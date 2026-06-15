"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  value: number;
  formatter?: (n: number) => string;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  formatter = (n) => Math.round(n).toLocaleString(),
  duration = 1200,
  className,
}: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);
  const prevValue = useRef(0);

  useEffect(() => {
    if (!isInView) return;
    const start = prevValue.current;
    const end = value;
    startRef.current = null;

    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        prevValue.current = end;
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, isInView, duration]);

  return (
    <span ref={ref} className={className}>
      {formatter(display)}
    </span>
  );
}
