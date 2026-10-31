import { CheckCircle2 } from "lucide-react";

interface Props {
  intro: string;
  readTime: string;
  forWho: string;
  bullets: string[];
  conclusion: string[];
}

/**
 * 投資経験が少ない読者向けガイドの共通導入。
 * 「対象読者 → 分かること → 結論」の順で、スマホ1画面内でも要点を追えるようにする。
 */
export default function BeginnerGuideLead({
  intro,
  readTime,
  forWho,
  bullets,
  conclusion,
}: Props) {
  const sentences = intro.match(/[^。]+。?/g) ?? [intro];
  const leadSentence = sentences[0]?.trim() ?? intro;
  const detail = sentences.slice(1).join("").trim();

  return (
    <section
      aria-labelledby="beginner-guide-summary"
      className="overflow-hidden border-y border-[#CFE1E8] bg-white"
    >
      <div className="border-b border-[#DDE9ED] bg-[#EEF7FA] px-5 py-5">
        <p className="text-sm font-bold text-[#236B8E]">{readTime}</p>
        <p className="mt-1 text-base leading-7 text-[#40556C]">{forWho}</p>
      </div>

      <div className="space-y-6 px-5 py-5 sm:px-6">
        <div className="space-y-3">
          <h2
            id="beginner-guide-summary"
            className="text-lg font-black text-[#263A53]"
          >
            この記事でわかること
          </h2>
          <ul className="space-y-2.5">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2.5 text-base leading-7 text-[#40556C]"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 flex-none text-[#236B8E]"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 border-t border-[#E5ECEF] pt-5">
          <h2 className="text-lg font-black text-[#263A53]">先に結論</h2>
          <p className="text-base font-medium leading-7 text-[#263A53]">{leadSentence}</p>
          <ul className="space-y-2">
            {conclusion.map((line) => (
              <li
                key={line}
                className="flex items-start gap-2 text-base leading-7 text-[#40556C]"
              >
                <span aria-hidden="true" className="font-bold text-[#236B8E]">
                  ・
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          {detail && (
            <details className="border-t border-[#E5ECEF] pt-2">
              <summary className="min-h-11 cursor-pointer py-2 text-sm font-bold text-[#236B8E]">
                制度の前提を詳しく確認する
              </summary>
              <p className="pb-1 text-base leading-7 text-[#40556C]">{detail}</p>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}
