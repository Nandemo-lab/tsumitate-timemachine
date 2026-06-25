"use client";

import { useState, useMemo, useCallback, useEffect, Fragment } from "react";

// ── Types ─────────────────────────────────────────────────────────────

export interface PageSeoData {
  path: string;
  pageType: string;
  title: string;
  description: string;
  canonical: string;
  hasOgpImage: boolean;
  estimatedInternalLinks: number;
  internalLinkCategories: string[];
  suggestedTitle?: string;
  suggestedDescription?: string;
  lastModified?: string;
}

interface ScRow {
  clicks: number;
  impressions: number;
  ctr: number; // 0-1
  position: number;
}

interface ScoreResult {
  stars: number; // 1-5
  reasons: string[];
}

type Tab = "list" | "duplicate" | "notes";
type FilterMode =
  | "all" | "urgent" | "low-ctr" | "rank11-20"
  | "high-imp" | "imp1000" | "no-ogp" | "title-issue" | "desc-issue";
type SortKey =
  | "path" | "clicks" | "impressions" | "ctr" | "position"
  | "tlen" | "dlen" | "score";

// ── Pure helpers ──────────────────────────────────────────────────────

const ALL_LINK_CATEGORIES = ["銘柄", "比較", "年別", "月額", "ランキング", "ガイド"] as const;

function stripSuffix(t: string) {
  return t.replace(/ [|｜] 積立タイムマシン$/, "").replace(/ \| 積立タイムマシン$/, "");
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

// ⑤ New thresholds per spec
function titleLenColor(n: number) {
  if (n < 30 || n > 50) return "text-red-400";
  if (n <= 40) return "text-emerald-400";
  return "text-yellow-400";
}
function titleLenLabel(n: number) {
  if (n < 30) return "短い";
  if (n <= 40) return "適正";
  if (n <= 50) return "やや長";
  return "長い";
}
function titleBadgeColor(n: number) {
  if (n < 30 || n > 50) return "bg-red-500/15 text-red-300 border-red-500/30";
  if (n <= 40) return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
}

function descLenColor(n: number) {
  if (n < 80 || n > 170) return "text-red-400";
  if (n <= 140) return "text-emerald-400";
  return "text-yellow-400";
}
function descLenLabel(n: number) {
  if (n < 80) return "短い";
  if (n <= 140) return "適正";
  if (n <= 170) return "やや長";
  return "長い";
}
function descBadgeColor(n: number) {
  if (n < 80 || n > 170) return "bg-red-500/15 text-red-300 border-red-500/30";
  if (n <= 140) return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
}

// ① 優先度スコア計算
function computeScore(page: PageSeoData, sc?: ScRow): ScoreResult {
  const reasons: string[] = [];
  let score = 0;
  const tLen = stripSuffix(page.title).length;
  const dLen = page.description.length;

  if (sc) {
    if (sc.impressions > 500 && sc.ctr < 0.01) {
      score += 5; reasons.push("表示回数が多いのにCTRが非常に低い");
    } else if (sc.impressions > 200 && sc.ctr < 0.02) {
      score += 4; reasons.push("表示回数に対してCTRが低い");
    } else if (sc.impressions > 100 && sc.ctr < 0.02) {
      score += 3; reasons.push("CTRが低い（表示100回以上）");
    }
    if (sc.position >= 11 && sc.position <= 15) {
      score += 4; reasons.push(`順位${sc.position.toFixed(1)}位 — 改善でトップ10入り可能`);
    } else if (sc.position >= 16 && sc.position <= 20) {
      score += 3; reasons.push(`順位${sc.position.toFixed(1)}位 — 2ページ目脱出のチャンス`);
    }
    if (sc.impressions > 500 && sc.clicks < 10) {
      score += 2; reasons.push("表示多・クリック極小 — title/descの改善が効く");
    }
    if (sc.impressions > 1000) {
      score += 1; reasons.push("表示回数1000回以上の高露出ページ");
    }
  }

  if (tLen < 30) { score += 2; reasons.push(`titleが短すぎる（${tLen}字 — 30字以上が理想）`); }
  else if (tLen > 50) { score += 2; reasons.push(`titleが長すぎる（${tLen}字 — 50字以内が理想）`); }

  if (dLen < 80) { score += 2; reasons.push(`descriptionが短すぎる（${dLen}字 — 80字以上が理想）`); }
  else if (dLen > 170) { score += 1; reasons.push(`descriptionが長すぎる（${dLen}字 — 170字以内が理想）`); }

  if (!page.hasOgpImage) { score += 1; reasons.push("OGP画像がない"); }
  if (page.estimatedInternalLinks < 4) {
    score += 1; reasons.push(`内部リンク数が少ない（推定${page.estimatedInternalLinks}件）`);
  }

  if (reasons.length === 0) reasons.push("現在の設定は良好です");

  return {
    stars: score >= 8 ? 5 : score >= 5 ? 4 : score >= 3 ? 3 : score >= 1 ? 2 : 1,
    reasons,
  };
}

// CSV パーサー
function parseCsv(text: string): Map<string, ScRow> {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("データが少なすぎます");

  const sep = lines[0].includes("\t") ? "\t" : ",";

  function splitLine(line: string): string[] {
    if (sep === "\t") return line.split("\t").map(c => c.trim().replace(/^"|"$/g, ""));
    const result: string[] = [];
    let inQuote = false, cur = "";
    for (const ch of line) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { result.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    result.push(cur.trim());
    return result;
  }

  const header = splitLine(lines[0]).map(h => h.toLowerCase().replace(/"/g, "").trim());
  const colIdx = (kws: string[]) => header.findIndex(h => kws.some(k => h.includes(k)));

  const urlIdx = colIdx(["page", "ページ", "url", "上位のページ", "top pages"]);
  const clicksIdx = colIdx(["clicks", "クリック数", "click"]);
  const impIdx = colIdx(["impressions", "表示回数", "impression"]);
  const ctrIdx = colIdx(["ctr", "クリック率"]);
  const posIdx = colIdx(["position", "掲載順位", "average position"]);

  if (urlIdx < 0) throw new Error("URLカラムが見つかりません（Page/ページ 等）");

  const map = new Map<string, ScRow>();

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = splitLine(lines[i]);
    const rawUrl = cols[urlIdx]?.replace(/"/g, "") ?? "";
    if (!rawUrl) continue;

    let path = rawUrl;
    try { path = new URL(rawUrl).pathname; } catch {
      if (rawUrl.startsWith("/")) path = rawUrl;
    }

    const ctrStr = ctrIdx >= 0 ? (cols[ctrIdx] ?? "0") : "0";
    const ctrRaw = parseFloat(ctrStr.replace("%", ""));
    const ctrNum = ctrStr.includes("%") ? ctrRaw / 100 : ctrRaw;

    map.set(path, {
      clicks: clicksIdx >= 0 ? (parseInt(cols[clicksIdx] ?? "0") || 0) : 0,
      impressions: impIdx >= 0 ? (parseInt(cols[impIdx] ?? "0") || 0) : 0,
      ctr: isNaN(ctrNum) ? 0 : ctrNum,
      position: posIdx >= 0 ? (parseFloat(cols[posIdx] ?? "0") || 0) : 0,
    });
  }

  return map;
}

// ── TOP5 生成 ─────────────────────────────────────────────────────────

interface Top5Item {
  rank: number;
  path: string;
  pageType: string;
  stars: number;
  primaryReason: string;
  action: string;
  effect: string;
  specific: string;
  sc?: ScRow;
}

type EnrichedPage = PageSeoData & {
  sc?: ScRow;
  score: ScoreResult;
  tLen: number;
  dLen: number;
  hasTitleIssue: boolean;
  hasDescIssue: boolean;
};

function generateTop5(enriched: EnrichedPage[]): Top5Item[] {
  // SC あり → score×impressions 降順、なければ score のみ
  const sorted = [...enriched].sort((a, b) => {
    const sd = b.score.stars - a.score.stars;
    if (sd !== 0) return sd;
    return (b.sc?.impressions ?? 0) - (a.sc?.impressions ?? 0);
  });

  const items: Top5Item[] = [];

  for (const p of sorted) {
    if (items.length >= 5) break;

    const { sc, score, tLen, dLen, hasTitleIssue, hasDescIssue } = p;
    const missingCats = ALL_LINK_CATEGORIES.filter(c => !p.internalLinkCategories.includes(c));
    let action = "";
    let effect = "";
    let specific = "";

    // 最優先: 高表示×低CTR
    if (sc && sc.impressions > 100 && sc.ctr < 0.02) {
      const addClicks = Math.round(sc.impressions * (0.03 - sc.ctr));
      action = "タイトルを見直してCTRを改善する";
      effect = `CTR ${(sc.ctr * 100).toFixed(1)}% → 目標3%で月+${addClicks}クリック増（推定）`;
      specific = p.suggestedTitle
        ? `変更候補: 「${p.suggestedTitle}」（${p.suggestedTitle.length}字）`
        : "検索意図に合ったキーワードをtitleに追加する";
    }
    // 順位11〜20位 → 内部リンク強化
    else if (sc && sc.position >= 11 && sc.position <= 20) {
      action = "内部リンクを強化して検索順位をトップ10に押し上げる";
      effect = `順位${sc.position.toFixed(1)}位 → 10位以内でクリック数3〜5倍が見込める`;
      specific = missingCats.length > 0
        ? `「${missingCats.slice(0, 2).join("」「")}」ページからの内部リンクを追加する`
        : "関連する人気ページからのアンカーテキストを最適化する";
    }
    // 高表示・低クリック → descriptionも見直し
    else if (sc && sc.impressions > 500 && sc.clicks < 10) {
      action = "descriptionに行動喚起を追加してクリックを促す";
      effect = `表示${sc.impressions.toLocaleString()}回あるのにクリック${sc.clicks}回 → desc改善でCTR1〜2%改善が見込める`;
      specific = p.suggestedDescription
        ? `変更候補: 「${p.suggestedDescription.slice(0, 60)}…」`
        : "「今すぐ確認→」などの行動喚起フレーズを末尾に追加する";
    }
    // title文字数問題
    else if (hasTitleIssue) {
      action = tLen < 30
        ? "titleが短すぎるため検索キーワードを追加する"
        : "titleが長すぎるため32〜40字に圧縮する";
      effect = "検索結果でのタイトル表示が改善しCTR向上が期待できる";
      specific = p.suggestedTitle
        ? `変更候補: 「${p.suggestedTitle}」（${p.suggestedTitle.length}字）`
        : tLen < 30
        ? "ファンド名 + 積立年 + 「評価額」などのキーワードを追加する"
        : "冗長な修飾語を削ってコアキーワードだけ残す";
    }
    // description文字数問題
    else if (hasDescIssue) {
      action = dLen < 80
        ? "descriptionを80〜140字に拡充する"
        : "descriptionを170字以内に圧縮する";
      effect = "Googleスニペット表示が改善しCTR向上が期待できる";
      specific = p.suggestedDescription
        ? `変更候補: 「${p.suggestedDescription.slice(0, 60)}…」（${p.suggestedDescription.length}字）`
        : dLen < 80
        ? "実績数値・メリット・行動喚起を追加する"
        : "重複表現を削り「今すぐ確認→」で締める";
    }
    // 内部リンク不足
    else if (missingCats.length > 0) {
      action = `不足している内部リンクカテゴリを追加する`;
      effect = "ページ間の回遊率向上とクロール頻度改善が期待できる";
      specific = `「${missingCats.join("」「")}」への内部リンクが未設置 → 関連ページへのリンクを追加する`;
    }
    else {
      action = "OGP画像を追加してSNS流入を強化する";
      effect = "SNSシェア時のクリック率が大幅に改善できる";
      specific = "/api/og エンドポイントを使ったOGP画像を設定する";
    }

    items.push({
      rank: items.length + 1,
      path: p.path,
      pageType: p.pageType,
      stars: score.stars,
      primaryReason: score.reasons[0],
      action,
      effect,
      specific,
      sc,
    });
  }

  return items;
}

// ── Constants ─────────────────────────────────────────────────────────

const PAGE_TYPE_COLORS: Record<string, string> = {
  ホーム:     "bg-violet-500/20 text-violet-300",
  銘柄:       "bg-blue-500/20 text-blue-300",
  年別:       "bg-emerald-500/20 text-emerald-300",
  月額:       "bg-teal-500/20 text-teal-300",
  比較:       "bg-orange-500/20 text-orange-300",
  ランキング: "bg-yellow-500/20 text-yellow-300",
  ガイド:     "bg-pink-500/20 text-pink-300",
  年別比較:   "bg-indigo-500/20 text-indigo-300",
};

const ctrFmt = (ctr: number) => `${(ctr * 100).toFixed(1)}%`;
const ctrColor = (ctr: number) => ctr >= 0.05 ? "text-emerald-400" : ctr >= 0.02 ? "text-yellow-400" : "text-red-400";
const posColor = (pos: number) => pos <= 3 ? "text-emerald-400" : pos <= 10 ? "text-yellow-400" : pos <= 20 ? "text-orange-400" : "text-red-400";

// ① 星表示
function Stars({ count, size = "normal" }: { count: number; size?: "normal" | "small" }) {
  const cls = size === "small" ? "text-[11px]" : "text-[13px]";
  return (
    <span className={`whitespace-nowrap tracking-tight ${cls}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? "text-amber-400" : "text-zinc-700"}>★</span>
      ))}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────

export default function SeoAdminClient({ pages, baseUrl }: { pages: PageSeoData[]; baseUrl: string }) {
  const [tab, setTab] = useState<Tab>("list");
  const [scData, setScData] = useState<Map<string, ScRow>>(new Map());
  const [showCsv, setShowCsv] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvError, setCsvError] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showTop5, setShowTop5] = useState(false);

  // ⑩ 修正メモ: localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("seo-admin-notes");
      if (stored) setNotes(JSON.parse(stored) as Record<string, string>);
    } catch { /* ignore */ }
  }, []);

  const saveNote = useCallback((path: string, text: string) => {
    setNotes(prev => {
      const next = { ...prev };
      if (text.trim()) next[path] = text;
      else delete next[path];
      try { localStorage.setItem("seo-admin-notes", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const applyCsv = useCallback(() => {
    setCsvError("");
    try {
      const map = parseCsv(csvText);
      if (map.size === 0) { setCsvError("有効なデータが見つかりませんでした"); return; }
      setScData(map);
      setShowCsv(false);
      setCsvText("");
      setShowTop5(true);
    } catch (e) {
      setCsvError(String(e));
    }
  }, [csvText]);

  const pageTypes = useMemo(() => {
    const s = new Set(pages.map(p => p.pageType));
    return ["all", ...Array.from(s)];
  }, [pages]);

  // Enriched with SC + score
  const enriched = useMemo(() => pages.map(p => {
    const sc = scData.get(p.path);
    const score = computeScore(p, sc);
    const tLen = stripSuffix(p.title).length;
    const dLen = p.description.length;
    const hasTitleIssue = tLen < 30 || tLen > 50;
    const hasDescIssue = dLen < 80 || dLen > 170;
    return { ...p, sc, score, tLen, dLen, hasTitleIssue, hasDescIssue };
  }), [pages, scData]);

  // TOP5
  const top5Items = useMemo(() => generateTop5(enriched), [enriched]);

  // ⑨ ダッシュボード統計
  const stats = useMemo(() => {
    const scPages = enriched.filter(p => p.sc);
    const totalPages = pages.length;
    const titleOk = enriched.filter(p => !p.hasTitleIssue).length;
    const descOk = enriched.filter(p => !p.hasDescIssue).length;
    const ogpOk = enriched.filter(p => p.hasOgpImage).length;
    const urgent = enriched.filter(p => p.score.stars >= 4).length;
    return {
      totalPages,
      urgent,
      withSc: scPages.length,
      totalClicks: scPages.reduce((s, p) => s + (p.sc?.clicks ?? 0), 0),
      totalImp: scPages.reduce((s, p) => s + (p.sc?.impressions ?? 0), 0),
      avgCtr: scPages.length ? scPages.reduce((s, p) => s + (p.sc?.ctr ?? 0), 0) / scPages.length : 0,
      avgPos: scPages.length ? scPages.reduce((s, p) => s + (p.sc?.position ?? 0), 0) / scPages.length : 0,
      titleOkRate: Math.round(titleOk / totalPages * 100),
      descOkRate: Math.round(descOk / totalPages * 100),
      ogpRate: Math.round(ogpOk / totalPages * 100),
      // alert card counts
      lowCtr: scPages.filter(p => p.sc!.impressions > 100 && p.sc!.ctr < 0.02).length,
      rank1120: scPages.filter(p => p.sc!.position >= 11 && p.sc!.position <= 20).length,
      highImp: scPages.filter(p => p.sc!.impressions > 500 && p.sc!.clicks < 10).length,
    };
  }, [enriched, pages.length]);

  // ④ 重複監査
  const duplicates = useMemo(() => {
    const titleMap = new Map<string, string[]>();
    const descMap = new Map<string, string[]>();
    for (const p of pages) {
      const t = stripSuffix(p.title);
      const d = p.description;
      if (!titleMap.has(t)) titleMap.set(t, []);
      titleMap.get(t)!.push(p.path);
      if (!descMap.has(d)) descMap.set(d, []);
      descMap.get(d)!.push(p.path);
    }
    const dupTitles = Array.from(titleMap.entries()).filter(([, v]) => v.length > 1);
    const dupDescs = Array.from(descMap.entries()).filter(([, v]) => v.length > 1);
    return { dupTitles, dupDescs };
  }, [pages]);

  // Filter + sort
  const filtered = useMemo(() => {
    let r = enriched;
    if (typeFilter !== "all") r = r.filter(p => p.pageType === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(p => p.path.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    switch (filter) {
      case "urgent":    r = r.filter(p => p.score.stars >= 4); break;
      case "low-ctr":   r = r.filter(p => p.sc && p.sc.impressions > 100 && p.sc.ctr < 0.02); break;
      case "rank11-20": r = r.filter(p => p.sc && p.sc.position >= 11 && p.sc.position <= 20); break;
      case "high-imp":  r = r.filter(p => p.sc && p.sc.impressions > 500 && p.sc.clicks < 10); break;
      case "imp1000":   r = r.filter(p => p.sc && p.sc.impressions > 1000); break;
      case "no-ogp":    r = r.filter(p => !p.hasOgpImage); break;
      case "title-issue": r = r.filter(p => p.hasTitleIssue); break;
      case "desc-issue":  r = r.filter(p => p.hasDescIssue); break;
    }

    return [...r].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "path":        return dir * a.path.localeCompare(b.path);
        case "score":       return dir * (a.score.stars - b.score.stars);
        case "clicks":      return dir * ((a.sc?.clicks ?? -1) - (b.sc?.clicks ?? -1));
        case "impressions": return dir * ((a.sc?.impressions ?? -1) - (b.sc?.impressions ?? -1));
        case "ctr":         return dir * ((a.sc?.ctr ?? -1) - (b.sc?.ctr ?? -1));
        case "position":    return dir * ((a.sc?.position ?? 999) - (b.sc?.position ?? 999));
        case "tlen":        return dir * (a.tLen - b.tLen);
        case "dlen":        return dir * (a.dLen - b.dLen);
        default: return 0;
      }
    });
  }, [enriched, filter, search, typeFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const hasSc = scData.size > 0;

  // ── Th helper
  const Th = ({ k, children, align = "left" }: { k?: SortKey; children: React.ReactNode; align?: "left" | "right" | "center" }) => (
    <th
      className={`px-3 py-2.5 text-zinc-400 font-semibold text-[10px] uppercase tracking-wider whitespace-nowrap ${k ? "cursor-pointer hover:text-zinc-200 select-none" : ""} text-${align}`}
      onClick={k ? () => toggleSort(k) : undefined}
    >
      {children}
      {k && sortKey === k && <span className="ml-1 text-violet-400">{sortDir === "asc" ? "↑" : "↓"}</span>}
      {k && sortKey !== k && <span className="ml-1 text-zinc-700">↕</span>}
    </th>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 text-xs font-sans">

      {/* ── Sticky Header ────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 border-b border-white/[0.08] bg-zinc-950/95 backdrop-blur px-4 py-2.5">
        {/* Row 1: タイトル + ボタン群 */}
        <div className="max-w-screen-2xl mx-auto flex items-center gap-2 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-[13px] font-bold text-white tracking-tight whitespace-nowrap">SEO管理ダッシュボード</h1>
            <p className="text-[10px] text-zinc-500">積立タイムマシン · {stats.totalPages} ページ</p>
          </div>

          {hasSc && (
            <button
              onClick={() => setShowTop5(v => !v)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0 ${showTop5 ? "bg-amber-600/30 border border-amber-500/40 text-amber-200" : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90 text-white"}`}
            >
              <span>✦</span>
              <span className="hidden sm:inline">{showTop5 ? "TOP5を閉じる" : "今週のTOP5を生成"}</span>
              <span className="sm:hidden">{showTop5 ? "閉じる" : "TOP5"}</span>
            </button>
          )}
          <button
            onClick={() => setShowCsv(v => !v)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors shrink-0 ${showCsv ? "bg-zinc-700 text-zinc-300" : "bg-violet-600 hover:bg-violet-500 text-white"}`}
          >
            {showCsv ? "閉じる" : hasSc ? `SC済(${scData.size})` : "SC CSV"}
          </button>
        </div>

        {/* Row 2: タブ */}
        <div className="max-w-screen-2xl mx-auto mt-2">
          <div className="flex gap-1 bg-zinc-900 border border-white/[0.08] rounded-lg p-1 w-fit">
            {([
              { id: "list" as Tab, label: "ページ一覧" },
              { id: "duplicate" as Tab, label: `重複監査${duplicates.dupTitles.length + duplicates.dupDescs.length > 0 ? `(${duplicates.dupTitles.length + duplicates.dupDescs.length})` : ""}` },
              { id: "notes" as Tab, label: `修正メモ${Object.keys(notes).length > 0 ? `(${Object.keys(notes).length})` : ""}` },
            ] as { id: Tab; label: string }[]).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${tab === t.id ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-4 space-y-4">

        {/* ── CSV パネル ─────────────────────────────────────────────── */}
        {showCsv && (
          <div className="rounded-xl bg-zinc-900 border border-violet-500/30 p-5 space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-sm font-bold text-white">Search Console CSVを貼り付け</h2>
                <p className="text-[10px] text-zinc-500 mt-1">
                  SC → 検索パフォーマンス → ページ（上タブ）→ エクスポート → CSVをここに全貼り付け。英語・日本語ヘッダー両対応。
                </p>
              </div>
              {scData.size > 0 && (
                <button onClick={() => setScData(new Map())} className="text-[10px] text-red-400 hover:text-red-300 whitespace-nowrap">
                  データをクリア
                </button>
              )}
            </div>
            <textarea
              value={csvText}
              onChange={e => { setCsvText(e.target.value); setCsvError(""); }}
              placeholder={"Page,Clicks,Impressions,CTR,Position\nhttps://tsumitate-timemachine.vercel.app/orukan/2020,45,890,5.06%,3.2"}
              className="w-full h-32 bg-zinc-800 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono resize-y focus:outline-none focus:border-violet-500/50"
              spellCheck={false}
            />
            {csvError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                ⚠ {csvError}
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={applyCsv}
                disabled={!csvText.trim()}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-30 text-white text-xs font-bold rounded-lg transition-colors"
              >
                読み込む
              </button>
              <span className="text-[10px] text-zinc-600">データはブラウザのみに保存。サーバーには送信しません。</span>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TOP5 パネル
        ════════════════════════════════════════════════════════ */}
        {showTop5 && (
          <div className="rounded-2xl bg-zinc-900 border border-violet-500/25 overflow-hidden">
            {/* ヘッダー */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-violet-950/60 to-fuchsia-950/60">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[11px] font-black text-white flex-shrink-0">
                AI
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">今週やるべきSEO改善 TOP5</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {new Date().toLocaleDateString("ja-JP")} · CTR・順位・表示回数・文字数・内部リンクを総合評価
                </p>
              </div>
              <button onClick={() => setShowTop5(false)} className="text-zinc-600 hover:text-zinc-400 text-lg leading-none px-1">×</button>
            </div>

            {/* 本文 */}
            <div className="px-5 py-4 space-y-0">
              {top5Items.length === 0 && (
                <p className="text-zinc-500 text-xs py-4">改善対象のページが見つかりませんでした。全ページが良好な状態です。</p>
              )}
              {top5Items.map((item, idx) => (
                <div key={item.path} className={`py-4 ${idx < top5Items.length - 1 ? "border-b border-white/[0.05]" : ""}`}>
                  {/* ランク行 */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-sm font-black ${item.rank === 1 ? "text-amber-400" : item.rank === 2 ? "text-zinc-300" : item.rank === 3 ? "text-orange-400" : "text-zinc-500"}`}>
                      #{item.rank}
                    </span>
                    <Stars count={item.stars} size="small" />
                    <a
                      href={`${baseUrl}${item.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] text-violet-400 hover:text-violet-300 hover:underline"
                    >
                      {item.path}
                    </a>
                    <span className={`px-1.5 py-px rounded text-[9px] font-bold ${PAGE_TYPE_COLORS[item.pageType] ?? "bg-white/[0.06] text-zinc-400"}`}>
                      {item.pageType}
                    </span>
                    {item.sc && (
                      <span className="text-[10px] text-zinc-600 ml-auto whitespace-nowrap">
                        表示 {item.sc.impressions.toLocaleString()} · CTR <span className={ctrColor(item.sc.ctr)}>{ctrFmt(item.sc.ctr)}</span> · <span className={posColor(item.sc.position)}>{item.sc.position.toFixed(1)}位</span>
                      </span>
                    )}
                  </div>

                  {/* 理由 */}
                  <p className="text-[11px] text-zinc-500 mb-2 flex items-center gap-1.5">
                    <span className="text-amber-500">⚠</span>
                    {item.primaryReason}
                  </p>

                  {/* アクション・効果・具体案 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="rounded-lg bg-violet-500/10 border border-violet-500/15 px-3 py-2">
                      <p className="text-[9px] text-violet-400 font-bold uppercase tracking-wider mb-1">やること</p>
                      <p className="text-[11px] text-violet-100 leading-relaxed">{item.action}</p>
                    </div>
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/15 px-3 py-2">
                      <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mb-1">期待効果</p>
                      <p className="text-[11px] text-emerald-100 leading-relaxed">{item.effect}</p>
                    </div>
                    <div className="rounded-lg bg-zinc-800 border border-white/[0.08] px-3 py-2">
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mb-1">具体的な変更案</p>
                      <p className="text-[11px] text-zinc-300 font-mono leading-relaxed">{item.specific}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* フッター */}
            <div className="px-5 py-3 border-t border-white/[0.06] bg-zinc-900/80 flex items-center justify-between gap-3">
              <p className="text-[10px] text-zinc-600">推定値はSCデータに基づきます。実際の効果は検索アルゴリズムにより異なります。</p>
              <button
                onClick={() => {
                  const text = top5Items.map(item =>
                    `#${item.rank} ${item.path}\nやること: ${item.action}\n期待効果: ${item.effect}\n具体案: ${item.specific}`
                  ).join("\n\n");
                  navigator.clipboard.writeText(`今週やるべきSEO改善 TOP5\n${new Date().toLocaleDateString("ja-JP")}\n\n${text}`).catch(() => {});
                }}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 whitespace-nowrap transition-colors"
              >
                テキストコピー
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            ⑨ ダッシュボードカード
        ════════════════════════════════════════════════════════ */}
        {tab === "list" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { label: "総ページ数", value: stats.totalPages, color: "text-white" },
              { label: "改善対象", value: stats.urgent, sub: "★★★★以上", color: "text-red-400" },
              ...(hasSc ? [
                { label: "平均CTR", value: ctrFmt(stats.avgCtr), color: ctrColor(stats.avgCtr) },
                { label: "平均順位", value: stats.avgPos.toFixed(1) + "位", color: posColor(stats.avgPos) },
              ] : []),
              { label: "OGP対応率", value: `${stats.ogpRate}%`, color: stats.ogpRate === 100 ? "text-emerald-400" : "text-yellow-400" },
              { label: "title適正率", value: `${stats.titleOkRate}%`, color: stats.titleOkRate >= 80 ? "text-emerald-400" : "text-yellow-400" },
              { label: "desc適正率", value: `${stats.descOkRate}%`, color: stats.descOkRate >= 80 ? "text-emerald-400" : "text-yellow-400" },
            ].map(c => (
              <div key={c.label} className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-3 py-3 text-center">
                <p className={`text-lg font-bold leading-none ${c.color}`}>{c.value}</p>
                {("sub" in c && c.sub) && <p className="text-[9px] text-zinc-600 mt-0.5">{c.sub}</p>}
                <p className="text-[10px] text-zinc-500 mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            ⑧ クイックフィルター（アラートカード拡張）
        ════════════════════════════════════════════════════════ */}
        {tab === "list" && (
          <div className="flex flex-wrap gap-2">
            {([
              { mode: "all" as FilterMode, label: "すべて", count: pages.length, color: "bg-zinc-800 border-zinc-700 text-zinc-300", active: "bg-violet-600/30 border-violet-500 text-violet-200" },
              { mode: "urgent" as FilterMode, label: "今すぐ改善", count: stats.urgent, color: "bg-zinc-800 border-zinc-700 text-zinc-300", active: "bg-red-500/20 border-red-400 text-red-200" },
              { mode: "low-ctr" as FilterMode, label: "CTR低い", count: stats.lowCtr, color: "bg-zinc-800 border-zinc-700 text-zinc-300", active: "bg-red-500/20 border-red-400 text-red-200" },
              { mode: "rank11-20" as FilterMode, label: "順位11〜20位", count: stats.rank1120, color: "bg-zinc-800 border-zinc-700 text-zinc-300", active: "bg-orange-500/20 border-orange-400 text-orange-200" },
              { mode: "high-imp" as FilterMode, label: "高表示・低クリック", count: stats.highImp, color: "bg-zinc-800 border-zinc-700 text-zinc-300", active: "bg-yellow-500/20 border-yellow-400 text-yellow-200" },
              { mode: "imp1000" as FilterMode, label: "表示1000以上", count: enriched.filter(p => p.sc && p.sc.impressions > 1000).length, color: "bg-zinc-800 border-zinc-700 text-zinc-300", active: "bg-blue-500/20 border-blue-400 text-blue-200" },
              { mode: "no-ogp" as FilterMode, label: "OGPなし", count: enriched.filter(p => !p.hasOgpImage).length, color: "bg-zinc-800 border-zinc-700 text-zinc-300", active: "bg-zinc-600/50 border-zinc-500 text-zinc-200" },
              { mode: "title-issue" as FilterMode, label: "title問題あり", count: enriched.filter(p => p.hasTitleIssue).length, color: "bg-zinc-800 border-zinc-700 text-zinc-300", active: "bg-amber-500/20 border-amber-400 text-amber-200" },
              { mode: "desc-issue" as FilterMode, label: "desc問題あり", count: enriched.filter(p => p.hasDescIssue).length, color: "bg-zinc-800 border-zinc-700 text-zinc-300", active: "bg-amber-500/20 border-amber-400 text-amber-200" },
            ] satisfies { mode: FilterMode; label: string; count: number; color: string; active: string }[]).map(({ mode, label, count, color, active }) => {
              const isActive = filter === mode;
              const needsSc = ["low-ctr", "rank11-20", "high-imp", "imp1000"].includes(mode);
              if (needsSc && !hasSc) return null;
              return (
                <button
                  key={mode}
                  onClick={() => setFilter(f => f === mode ? "all" : mode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${isActive ? active : color}`}
                >
                  <span>{label}</span>
                  <span className={`text-[10px] font-mono ${isActive ? "opacity-90" : "opacity-60"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            PAGE LIST TAB
        ════════════════════════════════════════════════════════ */}
        {tab === "list" && (
          <>
            {/* 検索 + 種別フィルター */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="URLやタイトルで検索…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-3 py-1.5 bg-zinc-800 border border-white/[0.1] rounded-lg text-xs text-zinc-200 w-48 focus:outline-none focus:border-violet-500/50"
              />
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 bg-zinc-800 border border-white/[0.1] rounded-lg text-xs text-zinc-200"
              >
                {pageTypes.map(t => (
                  <option key={t} value={t}>{t === "all" ? "全タイプ" : t}</option>
                ))}
              </select>
              <span className="text-[10px] text-zinc-600 ml-auto">{filtered.length} / {pages.length} 件表示中</span>
            </div>

            {/* メインテーブル */}
            <div className="rounded-xl border border-white/[0.08] overflow-x-auto">
              <table className="w-full border-collapse min-w-[960px]">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-zinc-900/60">
                    <Th k="score">優先度</Th>
                    <Th k="path">パス</Th>
                    <Th>種別</Th>
                    <Th k="tlen">Title</Th>
                    <Th k="dlen">Desc</Th>
                    <Th align="center">OGP</Th>
                    <Th align="center">内部L</Th>
                    {hasSc && <>
                      <Th k="clicks" align="right">クリック</Th>
                      <Th k="impressions" align="right">表示</Th>
                      <Th k="ctr" align="right">CTR</Th>
                      <Th k="position" align="right">順位</Th>
                    </>}
                    <Th>更新日</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const isExpanded = expandedRow === p.path;
                    const colSpan = hasSc ? 12 : 8;
                    const missingCats = ALL_LINK_CATEGORIES.filter(c => !p.internalLinkCategories.includes(c));

                    return (
                      <Fragment key={p.path}>
                        <tr
                          className={`border-b border-white/[0.04] hover:bg-white/[0.025] cursor-pointer transition-colors ${p.score.stars >= 4 ? "bg-red-500/[0.02]" : ""}`}
                          onClick={() => setExpandedRow(isExpanded ? null : p.path)}
                        >
                          {/* ① 優先度 */}
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Stars count={p.score.stars} size="small" />
                          </td>

                          {/* パス */}
                          <td className="px-3 py-2 max-w-[160px]">
                            <a
                              href={`${baseUrl}${p.path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-violet-400 hover:text-violet-300 font-mono truncate block text-[10px]"
                              title={p.path}
                            >
                              {p.path}
                            </a>
                            {notes[p.path] && (
                              <span className="text-[9px] text-amber-400/70 block truncate">{truncate(notes[p.path], 20)}</span>
                            )}
                          </td>

                          {/* 種別 */}
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${PAGE_TYPE_COLORS[p.pageType] ?? "bg-white/[0.06] text-zinc-400"}`}>
                              {p.pageType}
                            </span>
                          </td>

                          {/* ⑤ Title */}
                          <td className="px-3 py-2 max-w-[200px]">
                            <p className="text-zinc-300 truncate text-[11px]" title={stripSuffix(p.title)}>
                              {truncate(stripSuffix(p.title), 36)}
                            </p>
                            <span className={`inline-flex items-center px-1 py-px rounded border text-[9px] font-bold mt-0.5 ${titleBadgeColor(p.tLen)}`}>
                              {p.tLen}字 {titleLenLabel(p.tLen)}
                            </span>
                          </td>

                          {/* ⑤ Desc */}
                          <td className="px-3 py-2 max-w-[220px]">
                            <p className="text-zinc-400 truncate text-[11px]" title={p.description}>
                              {truncate(p.description, 36)}
                            </p>
                            <span className={`inline-flex items-center px-1 py-px rounded border text-[9px] font-bold mt-0.5 ${descBadgeColor(p.dLen)}`}>
                              {p.dLen}字 {descLenLabel(p.dLen)}
                            </span>
                          </td>

                          {/* OGP */}
                          <td className="px-3 py-2 text-center">
                            <span className={p.hasOgpImage ? "text-emerald-400" : "text-zinc-600"}>
                              {p.hasOgpImage ? "✓" : "✗"}
                            </span>
                          </td>

                          {/* ⑥ 内部リンク */}
                          <td className="px-3 py-2 text-center">
                            <span className={p.estimatedInternalLinks < 4 ? "text-orange-400" : "text-zinc-400"}>
                              {p.estimatedInternalLinks}
                            </span>
                          </td>

                          {/* SC データ */}
                          {hasSc && (
                            p.sc ? (
                              <>
                                <td className="px-3 py-2 text-right font-mono text-zinc-200">{p.sc.clicks.toLocaleString()}</td>
                                <td className="px-3 py-2 text-right font-mono text-zinc-400">{p.sc.impressions.toLocaleString()}</td>
                                <td className={`px-3 py-2 text-right font-bold font-mono ${ctrColor(p.sc.ctr)}`}>{ctrFmt(p.sc.ctr)}</td>
                                <td className={`px-3 py-2 text-right font-bold font-mono ${posColor(p.sc.position)}`}>{p.sc.position.toFixed(1)}</td>
                              </>
                            ) : (
                              <td colSpan={4} className="px-3 py-2 text-center text-zinc-700 text-[10px]">— SC未取得 —</td>
                            )
                          )}

                          {/* ⑦ 更新日 */}
                          <td className="px-3 py-2 text-zinc-600 whitespace-nowrap text-[10px]">
                            {p.lastModified ?? "—"}
                          </td>
                        </tr>

                        {/* 展開行 */}
                        {isExpanded && (
                          <tr className="border-b border-white/[0.04] bg-zinc-900/50">
                            <td colSpan={colSpan} className="px-4 py-5">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                                {/* 左: 現在の値 + ① 改善理由 */}
                                <div className="space-y-4">

                                  {/* ① スコア理由 */}
                                  <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">改善優先度</p>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Stars count={p.score.stars} />
                                      <span className="text-xs text-zinc-400">
                                        {p.score.stars === 5 ? "最優先" : p.score.stars === 4 ? "優先" : p.score.stars === 3 ? "要改善" : p.score.stars === 2 ? "軽微" : "良好"}
                                      </span>
                                    </div>
                                    <ul className="space-y-1">
                                      {p.score.reasons.map((r, i) => (
                                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-zinc-400">
                                          <span className={p.score.stars >= 3 ? "text-amber-400 mt-px" : "text-emerald-400 mt-px"}>
                                            {p.score.stars >= 3 ? "•" : "✓"}
                                          </span>
                                          {r}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* 現在の値 */}
                                  <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">現在のTitle（{p.tLen}字）</p>
                                    <p className={`text-[11px] font-mono leading-relaxed ${titleLenColor(p.tLen)}`}>{stripSuffix(p.title)}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">現在のDescription（{p.dLen}字）</p>
                                    <p className={`text-[11px] font-mono leading-relaxed ${descLenColor(p.dLen)}`}>{p.description}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Canonical</p>
                                    <p className="text-[11px] text-zinc-500 font-mono">{p.canonical}</p>
                                  </div>
                                </div>

                                {/* 右: 改善提案 + リンク監査 + メモ */}
                                <div className="space-y-4">

                                  {/* ② タイトル改善提案 */}
                                  {p.suggestedTitle && (
                                    <div>
                                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">② 改善候補Title</p>
                                      <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-2.5">
                                        <p className="text-[11px] text-violet-200 font-mono leading-relaxed">{p.suggestedTitle}</p>
                                        <p className={`text-[10px] mt-1 font-bold ${titleLenColor(p.suggestedTitle.length)}`}>
                                          {p.suggestedTitle.length}字 / {titleLenLabel(p.suggestedTitle.length)}
                                        </p>
                                      </div>
                                      <p className="text-[10px] text-zinc-600 mt-1">
                                        改善理由: 検索意図を優先し{p.suggestedTitle.length}字の適正長に調整
                                      </p>
                                    </div>
                                  )}

                                  {/* ③ description改善提案 */}
                                  {p.suggestedDescription && (
                                    <div>
                                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">③ 改善候補Description</p>
                                      <div className="rounded-lg bg-teal-500/10 border border-teal-500/20 px-3 py-2.5">
                                        <p className="text-[11px] text-teal-200 font-mono leading-relaxed">{p.suggestedDescription}</p>
                                        <p className={`text-[10px] mt-1 font-bold ${descLenColor(p.suggestedDescription.length)}`}>
                                          {p.suggestedDescription.length}字 / {descLenLabel(p.suggestedDescription.length)}
                                        </p>
                                      </div>
                                      <p className="text-[10px] text-zinc-600 mt-1">
                                        改善理由: {p.dLen < 80 ? "文字数不足のため情報を追加し" : "文字数超過のため圧縮し"}行動喚起で締める
                                      </p>
                                    </div>
                                  )}

                                  {/* ⑥ 内部リンク監査 */}
                                  <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">⑥ 内部リンク監査</p>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                      {ALL_LINK_CATEGORIES.map(cat => {
                                        const has = p.internalLinkCategories.includes(cat);
                                        return (
                                          <span
                                            key={cat}
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${has ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" : "bg-zinc-800 text-zinc-600 border-zinc-700"}`}
                                          >
                                            {cat}
                                          </span>
                                        );
                                      })}
                                    </div>
                                    {missingCats.length > 0 && (
                                      <div className="space-y-0.5">
                                        {missingCats.map(cat => (
                                          <p key={cat} className="text-[10px] text-orange-400">
                                            ⚠ {cat}ページへのリンクがありません
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                    {missingCats.length === 0 && (
                                      <p className="text-[10px] text-emerald-500">✓ 全カテゴリへのリンクあり</p>
                                    )}
                                  </div>

                                  {/* ⑩ 修正メモ */}
                                  <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">⑩ 修正メモ（LocalStorage保存）</p>
                                    <textarea
                                      value={notes[p.path] ?? ""}
                                      onChange={e => saveNote(p.path, e.target.value)}
                                      onClick={e => e.stopPropagation()}
                                      placeholder={`例）2026-06-25 title修正済み`}
                                      rows={3}
                                      className="w-full bg-zinc-800 border border-white/[0.1] rounded-lg px-3 py-2 text-[11px] text-zinc-300 font-mono resize-none focus:outline-none focus:border-violet-500/50"
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="py-16 text-center text-zinc-600">
                  <p>該当するページがありません</p>
                </div>
              )}
            </div>

            {/* 凡例 */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] text-zinc-600 pb-2">
              <span>CTR: <span className="text-emerald-400">5%以上</span> / <span className="text-yellow-400">2-5%</span> / <span className="text-red-400">2%未満</span></span>
              <span>順位: <span className="text-emerald-400">1-3位</span> / <span className="text-yellow-400">4-10位</span> / <span className="text-orange-400">11-20位</span> / <span className="text-red-400">21位以下</span></span>
              <span>Title: <span className="text-red-400">〜29字 / 51字〜</span> <span className="text-emerald-400">30〜40字</span> <span className="text-yellow-400">41〜50字</span></span>
              <span>Desc: <span className="text-red-400">〜79字 / 171字〜</span> <span className="text-emerald-400">80〜140字</span> <span className="text-yellow-400">141〜170字</span></span>
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════
            ④ 重複監査タブ
        ════════════════════════════════════════════════════════ */}
        {tab === "duplicate" && (
          <div className="space-y-6">
            {/* Title重複 */}
            <div>
              <h2 className="text-sm font-bold text-white mb-3">
                重複Title
                <span className={`ml-2 text-xs font-mono px-2 py-0.5 rounded ${duplicates.dupTitles.length > 0 ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                  {duplicates.dupTitles.length}件
                </span>
              </h2>
              {duplicates.dupTitles.length === 0 ? (
                <p className="text-zinc-600 text-xs py-4">重複するTitleはありません ✓</p>
              ) : (
                <div className="space-y-3">
                  {duplicates.dupTitles.map(([title, paths]) => (
                    <div key={title} className="rounded-xl bg-red-500/[0.04] border border-red-500/20 p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-[11px] text-red-200 font-mono leading-relaxed flex-1">{title}</p>
                        <span className="text-xs font-bold text-red-400 whitespace-nowrap">{paths.length}件重複</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {paths.map(path => (
                          <a
                            key={path}
                            href={`${baseUrl}${path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-violet-400 hover:text-violet-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]"
                          >
                            {path}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description重複 */}
            <div>
              <h2 className="text-sm font-bold text-white mb-3">
                重複Description
                <span className={`ml-2 text-xs font-mono px-2 py-0.5 rounded ${duplicates.dupDescs.length > 0 ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                  {duplicates.dupDescs.length}件
                </span>
              </h2>
              {duplicates.dupDescs.length === 0 ? (
                <p className="text-zinc-600 text-xs py-4">重複するDescriptionはありません ✓</p>
              ) : (
                <div className="space-y-3">
                  {duplicates.dupDescs.map(([desc, paths]) => (
                    <div key={desc} className="rounded-xl bg-orange-500/[0.04] border border-orange-500/20 p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-[11px] text-orange-200 font-mono leading-relaxed flex-1">{truncate(desc, 120)}</p>
                        <span className="text-xs font-bold text-orange-400 whitespace-nowrap">{paths.length}件重複</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {paths.map(path => (
                          <a
                            key={path}
                            href={`${baseUrl}${path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-violet-400 hover:text-violet-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]"
                          >
                            {path}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            ⑩ 修正メモ一覧タブ
        ════════════════════════════════════════════════════════ */}
        {tab === "notes" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white">
                修正メモ一覧
                <span className="ml-2 text-xs text-zinc-500 font-normal">LocalStorageに保存中</span>
              </h2>
              {Object.keys(notes).length > 0 && (
                <button
                  onClick={() => {
                    setNotes({});
                    try { localStorage.removeItem("seo-admin-notes"); } catch { /* ignore */ }
                  }}
                  className="text-[10px] text-red-400 hover:text-red-300"
                >
                  全メモをクリア
                </button>
              )}
            </div>

            {Object.keys(notes).length === 0 ? (
              <div className="py-16 text-center text-zinc-600">
                <p className="text-sm mb-2">メモがありません</p>
                <p className="text-[11px]">ページ一覧で行をクリックし、「修正メモ」欄に記入してください</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(notes).map(([path, note]) => {
                  const page = pages.find(p => p.path === path);
                  return (
                    <div key={path} className="rounded-xl bg-amber-500/[0.04] border border-amber-500/20 p-4">
                      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={`${baseUrl}${path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-400 hover:text-violet-300 font-mono text-[11px]"
                          >
                            {path}
                          </a>
                          {page && (
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${PAGE_TYPE_COLORS[page.pageType] ?? "bg-white/[0.06] text-zinc-400"}`}>
                              {page.pageType}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => saveNote(path, "")}
                          className="text-[10px] text-zinc-600 hover:text-red-400"
                        >
                          削除
                        </button>
                      </div>
                      {page && (
                        <p className="text-[10px] text-zinc-500 truncate mb-2">{stripSuffix(page.title)}</p>
                      )}
                      <textarea
                        value={note}
                        onChange={e => saveNote(path, e.target.value)}
                        rows={2}
                        className="w-full bg-zinc-800 border border-white/[0.1] rounded-lg px-3 py-2 text-[11px] text-zinc-300 font-mono resize-none focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
