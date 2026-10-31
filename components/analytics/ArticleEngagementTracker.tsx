"use client";

import { useCallback, useEffect, useRef } from "react";
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

  const markEndReached = useCallback(() => {
    if (endTracked.current) return;
    endTracked.current = true;
    trackArticleEndReached({ content_type: contentType, content_id: contentId });
  }, [contentId, contentType]);

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
        markEndReached();
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [markEndReached]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const element = event.target;
      if (!(element instanceof Element)) return;
      const readingJourneyLink = element.closest<HTMLAnchorElement>(".tm-reading-journey a[href]");
      if (readingJourneyLink) markEndReached();
      const anchor = element.closest<HTMLAnchorElement>(
        '.tm-article-body a[href="/"], .tm-article-body a[href^="/compare/"], .tm-guide-simulation-cta a[href="/"]',
      );
      if (!anchor) return;
      if (anchor.closest(".tm-guide-simulation-cta")) markEndReached();
      trackArticleToSimulation({
        content_type: contentType,
        content_id: contentId,
        destination_type: anchor.getAttribute("href") === "/" ? "home" : "compare",
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [contentId, contentType, markEndReached]);

  return <div ref={endRef} className="h-px" data-article-end-reached aria-hidden="true" />;
}
