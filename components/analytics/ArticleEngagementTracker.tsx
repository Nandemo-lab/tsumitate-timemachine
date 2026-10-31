"use client";

import { useEffect, useRef } from "react";
import {
  type EditorialContentType,
  trackArticleEndReached,
  trackArticleToSimulation,
  trackArticleView,
} from "@/lib/analytics";

export default function ArticleEngagementTracker({
  contentType,
  contentId,
}: {
  contentType: EditorialContentType;
  contentId: string;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const viewTracked = useRef(false);
  const endTracked = useRef(false);

  useEffect(() => {
    if (viewTracked.current) return;
    viewTracked.current = true;
    trackArticleView({ content_type: contentType, content_id: contentId });
  }, [contentId, contentType]);

  useEffect(() => {
    const target = endRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (endTracked.current || !entries.some((entry) => entry.isIntersecting)) return;
        endTracked.current = true;
        trackArticleEndReached({ content_type: contentType, content_id: contentId });
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [contentId, contentType]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const element = event.target;
      if (!(element instanceof Element)) return;
      const anchor = element.closest<HTMLAnchorElement>(
        '.tm-article-body a[href="/"], .tm-article-body a[href^="/compare/"], .tm-guide-simulation-cta a[href="/"]',
      );
      if (!anchor) return;
      trackArticleToSimulation({
        content_type: contentType,
        content_id: contentId,
        destination_type: anchor.getAttribute("href") === "/" ? "home" : "compare",
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [contentId, contentType]);

  return <div ref={endRef} className="h-px" data-article-end-reached aria-hidden="true" />;
}
