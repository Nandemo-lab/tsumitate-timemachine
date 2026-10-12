import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

interface Props {
  label: string;
  description: string;
  counterpartHref?: string;
  counterpartLabel?: string;
}

export default function PageRoleGuide({ label, description, counterpartHref, counterpartLabel }: Props) {
  return (
    <aside className="rounded-xl border border-sky-400/20 bg-sky-400/[0.05] p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Compass className="h-4 w-4 text-sky-300 flex-shrink-0" />
        <p className="text-xs font-bold text-sky-200">このページの役割：{label}</p>
      </div>
      <p className="text-xs leading-relaxed text-slate-600">{description}</p>
      {counterpartHref && counterpartLabel && (
        <Link href={counterpartHref} className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 hover:text-sky-200">
          {counterpartLabel}<ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </aside>
  );
}
