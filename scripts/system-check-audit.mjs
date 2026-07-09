#!/usr/bin/env node
/**
 * 制度・税制など公式情報源に基づく記事の「確認から1年以上経過」を
 * 機械的に検出するスクリプト。
 *
 * 使い方:
 *   next build を実行した後に以下を実行する。
 *     node scripts/system-check-audit.mjs
 *
 * 仕組み:
 *   lib/guide-pages.ts の GuidePage.systemCheck に登録された記事は、
 *   app/guide/[slug]/page.tsx が data-system-check-date="YYYY-MM-DD"
 *   属性としてビルド後のHTMLに出力する。本スクリプトはこの属性を
 *   全ページから収集し、経過日数に応じてリライト候補を報告する。
 *
 * しきい値:
 *   365日以上 … REWRITE CANDIDATE（制度確認が1年以上経過）
 *   180日以上 … WATCH（半年経過、注視対象）
 *   それ未満  … OK
 */
import fs from "fs";
import path from "path";

const APP_DIR = path.join(process.cwd(), ".next/server/app");

function collectHtmlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(full, out);
    } else if (entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

function urlFromFile(file) {
  let rel = path.relative(APP_DIR, file).replace(/\\/g, "/");
  rel = rel.replace(/\.html$/, "");
  if (rel === "index") return "/";
  if (rel.endsWith("/index")) rel = rel.slice(0, -"/index".length);
  return "/" + rel;
}

function daysSince(dateStr) {
  const then = new Date(dateStr + "T00:00:00Z").getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function main() {
  if (!fs.existsSync(APP_DIR)) {
    console.error("✗ .next/server/app が見つかりません。先に `next build` を実行してください。");
    process.exit(1);
  }

  const files = collectHtmlFiles(APP_DIR);
  const results = [];

  for (const file of files) {
    const html = fs.readFileSync(file, "utf-8");
    const matches = [...html.matchAll(/data-system-check-date="(\d{4}-\d{2}-\d{2})"/g)];
    if (matches.length === 0) continue;

    const url = urlFromFile(file);
    for (const m of matches) {
      const date = m[1];
      const age = daysSince(date);
      const status = age >= 365 ? "REWRITE CANDIDATE" : age >= 180 ? "WATCH" : "OK";
      results.push({ url, date, age, status });
    }
  }

  // 重複除去（同一URL・同一日付が複数回マッチする場合がある）
  const seen = new Set();
  const deduped = results.filter((r) => {
    const key = `${r.url}|${r.date}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log("━━━━━━━━━━━━━━━");
  console.log("SYSTEM CHECK AUDIT");
  console.log("");
  console.log(`制度確認情報を持つ記事: ${deduped.length}件`);
  console.log("");

  if (deduped.length === 0) {
    console.log("systemCheckが設定された記事が見つかりませんでした。");
    console.log("制度・税制を扱う記事には lib/guide-pages.ts の systemCheck フィールドを設定してください。");
    console.log("━━━━━━━━━━━━━━━");
    return;
  }

  deduped.sort((a, b) => b.age - a.age);

  const rewriteCandidates = deduped.filter((r) => r.status === "REWRITE CANDIDATE");
  const watchList = deduped.filter((r) => r.status === "WATCH");
  const ok = deduped.filter((r) => r.status === "OK");

  console.log(`REWRITE CANDIDATE（確認から365日以上）: ${rewriteCandidates.length}件`);
  rewriteCandidates.forEach((r) => console.log(`  ✗ ${r.url}  最終確認: ${r.date}（${r.age}日経過）`));
  console.log("");
  console.log(`WATCH（確認から180日以上）: ${watchList.length}件`);
  watchList.forEach((r) => console.log(`  △ ${r.url}  最終確認: ${r.date}（${r.age}日経過）`));
  console.log("");
  console.log(`OK（確認から180日未満）: ${ok.length}件`);
  ok.forEach((r) => console.log(`  ・ ${r.url}  最終確認: ${r.date}（${r.age}日経過）`));

  console.log("");
  console.log(
    rewriteCandidates.length > 0
      ? `${rewriteCandidates.length}件のリライト候補があります。制度・数値を公式情報源と再照合し、lib/guide-pages.ts の systemCheck.lastConfirmed を更新してください。`
      : "リライト候補はありません。"
  );
  console.log("━━━━━━━━━━━━━━━");
}

main();
