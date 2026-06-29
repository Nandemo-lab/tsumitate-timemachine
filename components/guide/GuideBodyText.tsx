import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  body: string;
  className?: string;
}

type Part =
  | { type: "text"; content: string }
  | { type: "link"; content: string; href: string; external: boolean };

function parseBody(body: string): Part[] {
  const parts: Part[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: body.slice(lastIndex, match.index) });
    }
    parts.push({
      type: "link",
      content: match[1],
      href: match[2],
      external: match[2].startsWith("http"),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < body.length) {
    parts.push({ type: "text", content: body.slice(lastIndex) });
  }

  return parts;
}

export default function GuideBodyText({ body, className }: Props) {
  const parts = parseBody(body);

  const nodes: ReactNode[] = parts.map((part, i) => {
    if (part.type === "text") return <span key={i}>{part.content}</span>;

    const cls =
      "text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors";

    if (part.external) {
      return (
        <a
          key={i}
          href={part.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
        >
          {part.content}
        </a>
      );
    }

    return (
      <Link key={i} href={part.href} className={cls}>
        {part.content}
      </Link>
    );
  });

  return (
    <p className={className ?? "text-sm text-zinc-400 leading-relaxed"}>
      {nodes}
    </p>
  );
}
