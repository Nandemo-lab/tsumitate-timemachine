import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * 画面表示と BreadcrumbList JSON-LD のリンク構造をそろえる共通パンくず。
 * 親階層は必ず Link にし、現在ページだけをテキスト表示する。
 */
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="tm-breadcrumbs" aria-label="パンくず" data-breadcrumbs>
      <ol>
        <li>
          <Link href="/" aria-label="ホームに戻る" data-breadcrumb-link>
            <Home aria-hidden="true" />
            <span>ホーム</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} aria-current={current ? "page" : undefined}>
              <ChevronRight aria-hidden="true" />
              {!current && item.href ? (
                <Link href={item.href} data-breadcrumb-link>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
