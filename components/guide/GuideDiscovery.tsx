"use client";

import Link from "next/link";
import { Search, ArrowRight, BookOpen, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  trackDiscoveryClick,
  trackDiscoveryFilter,
  trackDiscoveryView,
} from "@/lib/analytics";
import type { GuideDiscoveryCategory, GuideDiscoveryItem } from "@/lib/guide-discovery";

const STORAGE_KEY = "tm_guide_discovery";

function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ja")
    .replace(/[・･/／()（）\s]+/g, " ")
    .trim();
}

export default function GuideDiscovery({
  items,
  categories,
}: {
  items: GuideDiscoveryItem[];
  categories: GuideDiscoveryCategory[];
}) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const hydrated = useRef(false);
  const trackedSearch = useRef("");

  useEffect(() => {
    let cancelled = false;
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}") as { query?: string; categoryId?: string };
      window.setTimeout(() => {
        if (cancelled) return;
        if (typeof saved.query === "string") setQuery(saved.query);
        if (saved.categoryId === "all" || categories.some((category) => category.id === saved.categoryId)) {
          setCategoryId(saved.categoryId ?? "all");
        }
        hydrated.current = true;
      }, 0);
    } catch {
      // sessionStorageが使えない環境でも一覧はそのまま利用できる。
      hydrated.current = true;
    }
    trackDiscoveryView(items.length);
    return () => { cancelled = true; };
  }, [categories, items.length]);

  const results = useMemo(() => {
    const normalizedQuery = normalize(query);
    const tokens = normalizedQuery.split(" ").filter(Boolean);
    return items.filter((item) => {
      if (categoryId !== "all" && item.categoryId !== categoryId) return false;
      if (tokens.length === 0) return true;
      const haystack = normalize(item.searchText);
      return tokens.every((token) => haystack.includes(token));
    });
  }, [categoryId, items, query]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ query, categoryId }));
    } catch {
      // 保存できなくても検索そのものは継続する。
    }
    const normalizedQuery = normalize(query);
    if (normalizedQuery.length >= 2 && trackedSearch.current !== normalizedQuery) {
      trackedSearch.current = normalizedQuery;
      const timer = window.setTimeout(() => {
        trackDiscoveryFilter({ mode: "search", resultCount: results.length });
      }, 500);
      return () => window.clearTimeout(timer);
    }
  }, [categoryId, query, results.length]);

  const categoryLabel = categories.find((category) => category.id === categoryId)?.label;
  const isFiltered = query.trim().length > 0 || categoryId !== "all";
  const visibleResults = isFiltered || showAll ? results : results.slice(0, 12);

  return (
    <section className="space-y-6" aria-labelledby="guide-discovery-title">
      <div className="space-y-2">
        <p className="text-xs font-bold text-[#236B8E]">疑問から探す</p>
        <h2 id="guide-discovery-title" className="text-xl font-black text-[#263A53]">知りたい言葉を、そのまま入力</h2>
        <p className="text-sm leading-6 text-slate-600">
          「子供NISA」「損する」「毎月いくら」のような言い方でも探せます。入力した言葉は端末内だけで使い、GA4へ送りません。
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        <label htmlFor="guide-search" className="sr-only">投資ガイドを検索</label>
        <input
          id="guide-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例：子供NISA、元本割れ、ETF"
          className="min-h-12 w-full rounded-xl border border-[#B9CBD4] bg-white py-3 pl-12 pr-12 text-base text-[#263A53] outline-none transition focus:border-[#236B8E] focus:ring-2 focus:ring-[#B9DCEB]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-1 top-1/2 grid min-h-11 min-w-11 -translate-y-1/2 place-items-center text-slate-500"
            aria-label="検索語を消す"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2" aria-label="目的別カテゴリ">
        <button
          type="button"
          aria-pressed={categoryId === "all"}
          onClick={() => {
            setCategoryId("all");
            trackDiscoveryFilter({ mode: "category", resultCount: items.length });
          }}
          className={`min-h-11 flex-none rounded-full border px-4 text-sm font-bold ${categoryId === "all" ? "border-[#236B8E] bg-[#236B8E] text-white" : "border-[#C9D7DE] bg-white text-[#40556C]"}`}
        >
          すべて
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={categoryId === category.id}
            onClick={() => {
              setCategoryId(category.id);
              const count = items.filter((item) => item.categoryId === category.id).length;
              trackDiscoveryFilter({ mode: "category", resultCount: count });
            }}
            className={`min-h-11 flex-none rounded-full border px-4 text-sm font-bold ${categoryId === category.id ? "border-[#236B8E] bg-[#236B8E] text-white" : "border-[#C9D7DE] bg-white text-[#40556C]"}`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="flex items-baseline justify-between gap-4 border-b border-[#D9E3E8] pb-3">
        <p className="text-sm font-bold text-[#263A53]">{categoryLabel ?? "すべての記事"}</p>
        <p className="text-xs text-slate-500">
          {!isFiltered && !showAll && results.length > visibleResults.length
            ? `${visibleResults.length}件を表示・全${results.length}件`
            : `${results.length}件`}
        </p>
      </div>

      {results.length > 0 ? (
        <>
          <ol className="divide-y divide-[#D9E3E8]">
            {visibleResults.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => trackDiscoveryClick({ contentType: item.contentType, categoryId: item.categoryId })}
                  className="group grid min-h-28 grid-cols-[2.5rem_1fr_auto] gap-3 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#236B8E]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E8F3F7] text-[#236B8E]" aria-hidden="true">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#236B8E]">
                      {categories.find((category) => category.id === item.categoryId)?.label}
                      {item.isNew && <span className="rounded-full bg-[#E6F3EC] px-2 py-0.5 text-[#17644D]">新しく追加</span>}
                    </span>
                    <strong className="mt-1 block text-base leading-7 text-[#263A53] group-hover:text-[#236B8E]">{item.title}</strong>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">{item.reason}</span>
                  </span>
                  <ArrowRight className="mt-3 h-4 w-4 text-slate-400 group-hover:text-[#236B8E]" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
          {!isFiltered && !showAll && results.length > visibleResults.length && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="min-h-12 w-full border-y border-[#B9CBD4] py-3 text-sm font-bold text-[#236B8E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#236B8E]"
            >
              残り{results.length - visibleResults.length}件をすべて見る
            </button>
          )}
        </>
      ) : (
        <div className="border-y border-[#D9E3E8] py-7">
          <p className="font-bold text-[#263A53]">一致する記事が見つかりませんでした</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">言葉を短くするか、「はじめての投資」「NISAの基本」などのカテゴリから確認できます。</p>
          <button type="button" onClick={() => { setQuery(""); setCategoryId("all"); }} className="mt-4 min-h-11 text-sm font-bold text-[#236B8E]">
            すべての記事へ戻す
          </button>
        </div>
      )}
    </section>
  );
}
