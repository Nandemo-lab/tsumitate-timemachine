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
    <aside className="border-y border-[#bfd5df] bg-[#eef7f9] px-4 py-5 space-y-2">
      <div className="flex items-center gap-2">
        <Compass className="h-4 w-4 text-[#236B8E] flex-shrink-0" />
        <p className="text-sm font-bold text-[#20364c]">このページでわかること：{label}</p>
      </div>
      <p className="text-sm leading-7 text-slate-700">{description}</p>
      {counterpartHref && counterpartLabel && (
        <Link href={counterpartHref} className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[#236B8E] hover:text-[#174f6a]">
          {counterpartLabel}<ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </aside>
  );
}
