import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { SITE_NAME, SITE_URL, LAST_UPDATED_TERMS } from "@/lib/site";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: `利用規約 | ${SITE_NAME}`,
  description: "積立タイムマシンの利用規約です。本サービスは投資シミュレーションおよび情報提供を目的としたサービスです。",
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    title: "サービスの目的",
    body: "本サービス「積立タイムマシン」は、過去の実績データをもとにした積立投資のシミュレーションおよび情報提供を目的として運営されています。",
  },
  {
    title: "投資助言ではありません",
    body: "本サービスで提供する情報・シミュレーション結果は、投資助言・勧誘を目的とするものではありません。投資に関する最終的な判断は、利用者ご自身の責任において行ってください。",
  },
  {
    title: "情報の正確性について",
    body: "掲載している情報の正確性・完全性・有用性を保証するものではありません。シミュレーション結果はあくまで過去の実績に基づく試算であり、将来の運用成果を保証するものではありません。",
  },
  {
    title: "免責事項",
    body: "本サービスの利用によって生じたいかなる損害（直接的・間接的損害を含む）についても、運営者は一切の責任を負いません。",
  },
  {
    title: "禁止事項",
    body: "本サービスのコンテンツ・データの無断転載・二次利用・商業利用を禁止します。また、本サービスの運営を妨げる行為、不正アクセス行為も禁止します。",
  },
  {
    title: "規約の変更",
    body: "本規約は、予告なく変更する場合があります。変更後の規約は本ページに掲載した時点で効力を生じ、利用者は変更後の規約に同意したものとみなします。",
  },
  {
    title: "準拠法",
    body: "本規約の解釈および適用は日本法に準拠します。",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50" style={{ fontFamily: "var(--font-sans-jp), sans-serif" }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, #6366f110 0%, transparent 70%)" }}
        />
      </div>

      {/* Breadcrumb */}
      <nav className="relative border-b border-white/8 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-1.5 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">積立タイムマシン</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-zinc-200">利用規約</span>
        </div>
      </nav>

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex items-center justify-center h-10 w-10 rounded-xl"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}
          >
            <FileText className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-serif-jp), serif" }}
            >
              利用規約
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">最終更新日：{LAST_UPDATED_TERMS}</p>
          </div>
        </div>

        {/* Intro */}
        <div
          className="rounded-2xl border border-indigo-500/20 p-5 mb-8 text-sm text-zinc-400 leading-relaxed"
          style={{ background: "rgba(99,102,241,0.05)" }}
        >
          本サービス「積立タイムマシン」をご利用になる前に、以下の利用規約をよくお読みください。本サービスをご利用いただいた場合、本規約に同意いただいたものとみなします。
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map((section, i) => (
            <div
              key={section.title}
              className="rounded-xl border border-white/8 p-5"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <h2 className="text-sm font-bold text-white mb-2">
                第{i + 1}条　{section.title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer box */}
        <div
          className="rounded-2xl border border-amber-500/20 p-5 mt-8 text-xs text-zinc-400 leading-relaxed"
          style={{ background: "rgba(245,158,11,0.05)" }}
        >
          <p className="font-bold text-amber-400 mb-1.5">重要なお知らせ</p>
          本サービスのシミュレーション結果は過去の実績に基づく試算です。将来の投資成果を保証するものではありません。投資は自己責任でお願いします。
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← トップページへ戻る
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
