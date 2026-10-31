"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, CircleHelp, ShieldAlert } from "lucide-react";
import { type EditorialContentType, trackRelatedArticleClick } from "@/lib/analytics";

export type ReadingJourneyKind = "question" | "compare" | "risk" | "action";

export interface ReadingJourneyItem {
  href: string;
  question: string;
  description: string;
  kind?: ReadingJourneyKind;
}

const ICONS = {
  question: CircleHelp,
  compare: BarChart3,
  risk: ShieldAlert,
  action: BookOpenCheck,
};

export default function ReadingJourney({
  items,
  title = "次の疑問を、ひとつずつ",
  description = "いま読んだ内容から自然につながるテーマだけを選びました。",
  sourceType,
  sourceId,
}: {
  items: ReadingJourneyItem[];
  title?: string;
  description?: string;
  sourceType?: EditorialContentType;
  sourceId?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="tm-reading-journey" aria-labelledby="reading-journey-title">
      <header>
        <p>READ NEXT</p>
        <h2 id="reading-journey-title">{title}</h2>
        <span>{description}</span>
      </header>
      <ol>
        {items.slice(0, 3).map((item) => {
          const Icon = ICONS[item.kind ?? "question"];
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => {
                  if (!sourceType || !sourceId) return;
                  const destinationType = item.href.startsWith("/articles/")
                    ? "article"
                    : item.href.startsWith("/guide/")
                      ? "guide"
                      : "other";
                  trackRelatedArticleClick({
                    content_type: sourceType,
                    content_id: sourceId,
                    destination_type: destinationType,
                  });
                }}
              >
                <span className={`tm-reading-journey__icon tm-reading-journey__icon--${item.kind ?? "question"}`} aria-hidden="true">
                  <Icon />
                  <i /><i /><i />
                </span>
                <span className="tm-reading-journey__copy">
                  <strong>{item.question}</strong>
                  <small>{item.description}</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
