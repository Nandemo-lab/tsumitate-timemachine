import { Calendar, Database } from "lucide-react";

interface Props {
  lastUpdated: string;
}

export default function GuideEeat({ lastUpdated }: Props) {
  return (
    <div className="rounded-xl bg-white border border-[#E1E8EC] p-3 space-y-2.5">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-black text-[#236B8E]">編</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-700">積立タイムマシン編集部</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Calendar className="h-2.5 w-2.5 text-slate-500 flex-shrink-0" />
            <p className="text-xs text-slate-500">最終更新: {lastUpdated}</p>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-1.5">
        <Database className="h-3 w-3 text-slate-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          本記事は金融庁・JPX・MSCI・S&amp;P Dow Jonesなどの公開情報と、積立タイムマシン独自のシミュレーションデータをもとに作成しています。
        </p>
      </div>
    </div>
  );
}
