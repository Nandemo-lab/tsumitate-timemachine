import { ChevronDown } from "lucide-react";

/** 長い比較記事の目次を、必要なときだけ開ける共通ナビゲーション。 */
export default function ArticleToc({ titles }: { titles: readonly string[] }) {
  return (
    <details className="tm-article-toc">
      <summary>
        <span>記事の内容を見る</span>
        <ChevronDown aria-hidden="true" />
      </summary>
      <nav aria-label="記事内の目次">
        <ol>
          {titles.map((title, index) => (
            <li key={title}>
              <span>{index + 1}</span>
              <a href={`#section-${index}`}>{title}</a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
