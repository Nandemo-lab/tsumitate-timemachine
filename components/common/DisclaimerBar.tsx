import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function DisclaimerBar() {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-white/[0.025] border border-white/[0.06] px-4 py-3">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-zinc-600 mt-0.5" />
      <p className="text-[11px] text-zinc-600 leading-relaxed">
        VTは公式月次NAVリターンを日本銀行の月末為替で円換算し、その他の系列は年次参考値を月次換算しています。将来の運用成果を保証するものではありません。
        <Link href="/about/data-sources" className="ml-1 text-zinc-500 hover:text-zinc-400 underline underline-offset-2 transition-colors">
          データについて
        </Link>
      </p>
    </div>
  );
}
