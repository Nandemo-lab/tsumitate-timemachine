import Link from "next/link";

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
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  const renderParts = (paragraph: string) => parseBody(paragraph).map((part, i) => {
    if (part.type === "text") return <span key={i}>{part.content}</span>;

    const cls =
      "text-[#236B8E] hover:text-[#236B8E] underline underline-offset-2 transition-colors";

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
    <div className="space-y-3">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={className ?? "text-base leading-8 text-slate-700"}>
          {renderParts(paragraph)}
        </p>
      ))}
    </div>
  );
}
