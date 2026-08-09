"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  'a[href], button:not(:disabled), [role="button"], input[type="button"], input[type="submit"], summary';

/**
 * 操作した瞬間だけ表示する、サイト共通の小さなフィードバック。
 * 常時カーソル追従はせず、広告・管理画面・reduced-motionでは発火しない。
 */
export default function InteractionSpark() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handlePointerDown = (event: PointerEvent) => {
      if (reducedMotion.matches || event.button !== 0 || window.location.pathname.startsWith("/admin")) return;

      const target = event.target instanceof Element ? event.target.closest(INTERACTIVE_SELECTOR) : null;
      if (!target || target.closest('ins.adsbygoogle, iframe, [data-no-interaction-effect="true"]')) return;

      const layer = layerRef.current;
      if (!layer) return;

      const burst = document.createElement("span");
      burst.className = "interaction-burst";
      burst.style.left = `${event.clientX}px`;
      burst.style.top = `${event.clientY}px`;
      burst.setAttribute("aria-hidden", "true");

      for (let index = 0; index < 3; index += 1) {
        const particle = document.createElement("i");
        particle.style.setProperty("--particle-index", String(index));
        burst.appendChild(particle);
      }

      layer.appendChild(burst);
      burst.addEventListener("animationend", (animationEvent) => {
        if (animationEvent.target === burst) burst.remove();
      });
    };

    document.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return <div ref={layerRef} className="interaction-layer" aria-hidden="true" />;
}
