import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function DisclaimerBar() {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-white border border-[#E1E8EC] px-4 py-3">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-slate-500 mt-0.5" />
      <p className="text-xs text-slate-500 leading-relaxed">
        A系列は一次情報から検証した月次実績を使用し、参考系列は品質を明示しています。将来の運用成果を保証するものではありません。
        <Link href="/about/data-sources" className="ml-1 text-slate-500 hover:text-slate-600 underline underline-offset-2 transition-colors">
          データについて
        </Link>
      </p>
    </div>
  );
}
