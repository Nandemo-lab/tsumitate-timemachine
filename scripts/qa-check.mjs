#!/usr/bin/env node
/**
 * ビルド後の全ページを横断チェックするQAスクリプト。
 *
 * 使い方:
 *   next build を実行した後に以下を実行する。
 *     node scripts/qa-check.mjs
 *   本番相当サーバーが起動している場合は --server で渡すと、
 *   canonical/OGP画像/sitemap掲載URLの実際のHTTPステータスも検証する。
 *     node scripts/qa-check.mjs --server http://localhost:3000
 *
 * 検出結果は ERROR / WARNING / INFO の3段階に分類される。
 *   ERROR   : 必ず修正が必要（title二重サフィックス・404・canonical重複・JSON-LD不備・HTTP失敗）
 *   WARNING : 確認推奨（canonical/description/OGP欠落・robots不整合）
 *   INFO    : 参考情報（title/description文字数の目安からの逸脱など、都度の修正は必須ではない）
 *
 * チェック項目:
 *  1. titleにサイト名サフィックスの重複がないか（回帰チェック） … ERROR
 *  2. titleの文字数（目安30〜35文字） … INFO
 *  3. canonicalの欠落・自ページURLとの不一致・重複 … WARNING / ERROR(重複)
 *  4. noindexページにcanonicalがあるか … WARNING
 *  5. meta descriptionの欠落・重複・文字数（目安90〜120文字） … WARNING / INFO(文字数)
 *  6. JSON-LD（Article/BreadcrumbList/FAQPage）の必須項目・型チェック … ERROR
 *  7. OGP画像（og:image）の欠落 … WARNING
 *  8. 内部リンク（href="/..."）が実在ルートを指しているか（404チェック） … ERROR
 *  9. robots.txtとの整合性 … WARNING
 *  10. [--server指定時のみ] canonical/OGP画像/sitemap掲載URLが実際に200を返すか … ERROR
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const APP_DIR = path.join(process.cwd(), ".next/server/app");
const BASE_URL = "https://tsumitate-timemachine.com";

const args = process.argv.slice(2);
const serverFlagIndex = args.indexOf("--server");
const SERVER_URL = serverFlagIndex !== -1 ? args[serverFlagIndex + 1] : null;

// title/descriptionの文字数目安（外れはINFOのみ）
const TITLE_MIN = 30;
const TITLE_MAX = 35;
const DESC_MIN = 90;
const DESC_MAX = 120;

// findings: { level: "ERROR" | "WARNING" | "INFO", url, message }
const findings = [];
function report(level, url, message) {
  findings.push({ level, url, message });
}

// ─── HTMLファイル収集 ────────────────────────────────────────────────────
function collectHtmlFiles(dir, out = []) {
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

// ─── 既知の有効ルート一覧（内部リンク404チェック用） ─────────────────────
function buildKnownRoutes(files) {
  const routes = new Set();
  for (const f of files) {
    routes.add(urlFromFile(f));
  }
  const allowPrefixes = [
    "/api/",
    "/_next/",
    "/favicon.ico",
    "/icon",
    "/apple-icon",
    "/simulate/",
    "/manifest.webmanifest",
    "/sitemap.xml",
    "/robots.txt",
  ];
  return { routes, allowPrefixes };
}

function isKnownRoute(href, known) {
  if (!href || !href.startsWith("/")) return true;
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "") return true;
  if (known.routes.has(clean)) return true;
  if (known.allowPrefixes.some((p) => clean.startsWith(p))) return true;
  return false;
}

// ─── robots.txt 読み込み ────────────────────────────────────────────────
function readRobotsTxt() {
  const robotsFile = path.join(APP_DIR, "robots.txt.body");
  if (!fs.existsSync(robotsFile)) return null;
  const content = fs.readFileSync(robotsFile, "utf-8");
  const disallows = [...content.matchAll(/Disallow:\s*(\S+)/g)].map((m) => m[1]);
  const sitemapLine = content.match(/Sitemap:\s*(\S+)/);
  return { disallows, sitemap: sitemapLine ? sitemapLine[1] : null };
}

// ─── HTTPステータス取得（--server指定時のみ） ───────────────────────────
async function fetchStatus(url) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    return res.status;
  } catch {
    return null;
  }
}

function toLocalUrl(absoluteOrRelativeUrl) {
  if (!SERVER_URL) return null;
  if (absoluteOrRelativeUrl.startsWith(BASE_URL)) {
    return SERVER_URL + absoluteOrRelativeUrl.slice(BASE_URL.length);
  }
  if (absoluteOrRelativeUrl.startsWith("/")) {
    return SERVER_URL + absoluteOrRelativeUrl;
  }
  return null;
}

// ─── ③ 差分検出: 変更されたソースファイル → 影響を受けるURLの推定 ─────────
function getChangedSourceFiles() {
  const tryCmds = [
    "git diff --name-only HEAD",           // 未コミットの変更
    "git diff --name-only HEAD~1 HEAD",    // 直前のコミットとの差分
  ];
  for (const cmd of tryCmds) {
    try {
      const out = execSync(cmd, { cwd: process.cwd(), encoding: "utf-8" }).trim();
      if (out) return out.split("\n").filter(Boolean);
    } catch {
      /* gitが使えない・履歴がない場合は次を試す */
    }
  }
  return [];
}

function guessAffectedUrls(changedFiles, knownRoutes) {
  const affected = new Set();
  for (const f of changedFiles) {
    let m;
    if ((m = f.match(/^content\/articles\/([\w-]+)\.tsx$/))) {
      affected.add(`/articles/${m[1]}`);
    } else if ((m = f.match(/^app\/(.+)\/page\.tsx$/))) {
      const routeGuess = "/" + m[1].replace(/\[.*?\]/g, "").replace(/\/+/g, "/").replace(/\/$/, "");
      // 動的セグメントを含む場合は完全一致しないため、プレフィックス一致する既知ルートを拾う
      for (const r of knownRoutes) {
        if (r === routeGuess || r.startsWith(routeGuess + "/") || routeGuess === "") {
          if (routeGuess !== "") affected.add(r);
        }
      }
    } else if (f.startsWith("lib/") || f.startsWith("components/")) {
      // 共有データ・共通コンポーネントの変更はサイト全体に影響しうるため個別ページには絞らない
    }
  }
  return affected;
}

// ─── メイン ──────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(APP_DIR)) {
    console.error("✗ .next/server/app が見つかりません。先に `next build` を実行してください。");
    process.exit(1);
  }

  const files = collectHtmlFiles(APP_DIR).filter(
    (f) => !f.includes("_global-error") && !f.includes("_not-found")
  );
  const known = buildKnownRoutes(files);
  const robots = readRobotsTxt();

  const titleMap = new Map();
  const descMap = new Map();
  const canonicalMap = new Map();
  const liveCheckTargets = new Set();

  for (const file of files) {
    const html = fs.readFileSync(file, "utf-8");
    const url = urlFromFile(file);

    const isNoindex = /name="robots"\s+content="[^"]*noindex[^"]*"/.test(html);

    // --- 1・2. title チェック ---
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";
    if (title) {
      const suffixCount = (title.match(/\s\|\s積立タイムマシン/g) || []).length;
      if (suffixCount >= 2) {
        report("ERROR", url, `titleに「| 積立タイムマシン」サフィックスが${suffixCount}回出現 → "${title}"`);
      }
      if (!isNoindex && (title.length < TITLE_MIN || title.length > TITLE_MAX)) {
        report("INFO", url, `title文字数 ${title.length}文字（目安${TITLE_MIN}〜${TITLE_MAX}文字）`);
      }
      if (!titleMap.has(title)) titleMap.set(title, []);
      titleMap.get(title).push(url);
    } else {
      report("WARNING", url, `<title>タグが見つかりません`);
    }

    // --- 3・4. canonical チェック ---
    const canonicalMatch = html.match(/rel="canonical"\s+href="([^"]+)"/);
    const canonical = canonicalMatch ? canonicalMatch[1] : null;
    if (!canonical) {
      if (isNoindex) {
        report("WARNING", url, `noindexページにcanonicalがありません`);
      } else {
        report("WARNING", url, `canonicalが見つかりません`);
      }
    } else {
      const expected = BASE_URL + (url === "/" ? "" : url);
      if (canonical !== expected && canonical !== expected + "/") {
        report("WARNING", url, `canonical不一致 canonical="${canonical}" (期待値="${expected}")`);
      }
      if (!canonicalMap.has(canonical)) canonicalMap.set(canonical, []);
      canonicalMap.get(canonical).push(url);
      liveCheckTargets.add(canonical);
    }

    // --- 6. JSON-LD 必須項目・型チェック ---
    const jsonLdMatches = [...html.matchAll(/type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    const rawJsonLdMatches = [
      ...html.matchAll(/application\\?"\/ld\+json\\?".*?\\"__html\\":\\"(.*?)\\"\}/g),
    ];
    let jsonLdBlocks = [];
    for (const m of jsonLdMatches) {
      try {
        jsonLdBlocks.push(JSON.parse(m[1]));
      } catch {
        /* dangerouslySetInnerHTML経由でエスケープされているケースは簡易チェックのみ */
      }
    }
    if (jsonLdBlocks.length === 0 && rawJsonLdMatches.length === 0) {
      report("WARNING", url, `ld+json ブロックが検出できません`);
    }
    for (const block of jsonLdBlocks) {
      const type = block["@type"];
      if (typeof type !== "string") {
        report("ERROR", url, `JSON-LD: @type が文字列ではありません`);
        continue;
      }
      if (type === "Article") {
        if (!block.headline) report("ERROR", url, `JSON-LD: Article.headline が欠落`);
        if (!block.description) report("ERROR", url, `JSON-LD: Article.description が欠落`);
        if (!block.datePublished) report("ERROR", url, `JSON-LD: Article.datePublished が欠落`);
        if (block.image && typeof block.image !== "string" && typeof block.image !== "object") {
          report("ERROR", url, `JSON-LD: Article.image の型が不正`);
        }
      }
      if (type === "BreadcrumbList") {
        if (!Array.isArray(block.itemListElement) || block.itemListElement.length === 0) {
          report("ERROR", url, `JSON-LD: BreadcrumbList.itemListElement が空`);
        } else {
          block.itemListElement.forEach((item, i) => {
            if (item["@type"] !== "ListItem") {
              report("ERROR", url, `JSON-LD: BreadcrumbList.itemListElement[${i}].@type が "ListItem" ではありません`);
            }
            if (typeof item.position !== "number") {
              report("ERROR", url, `JSON-LD: BreadcrumbList.itemListElement[${i}].position が数値ではありません`);
            }
            if (!item.name || !item.item) {
              report("ERROR", url, `JSON-LD: BreadcrumbList.itemListElement[${i}] に name/item が欠落`);
            }
          });
        }
      }
      if (type === "FAQPage") {
        if (!Array.isArray(block.mainEntity) || block.mainEntity.length === 0) {
          report("ERROR", url, `JSON-LD: FAQPage.mainEntity が空`);
        } else {
          block.mainEntity.forEach((q, i) => {
            if (q["@type"] !== "Question" || !q.acceptedAnswer?.text) {
              report("ERROR", url, `JSON-LD: FAQPage.mainEntity[${i}] の構造が不正`);
            }
          });
        }
      }
    }

    // --- 5. meta description ---
    const descMatch = html.match(/name="description"\s+content="([^"]*)"/);
    const desc = descMatch ? descMatch[1] : null;
    if (!desc) {
      report("WARNING", url, `descriptionが見つかりません`);
    } else {
      if (!isNoindex && (desc.length < DESC_MIN || desc.length > DESC_MAX)) {
        report("INFO", url, `description文字数 ${desc.length}文字（目安${DESC_MIN}〜${DESC_MAX}文字）`);
      }
      if (!descMap.has(desc)) descMap.set(desc, []);
      descMap.get(desc).push(url);
    }

    // --- 7. OGP画像チェック ---
    const ogImageMatch = html.match(/property="og:image"\s+content="([^"]*)"/);
    if (!ogImageMatch) {
      if (!isNoindex) report("WARNING", url, `OGP画像（og:image）が見つかりません`);
    } else {
      liveCheckTargets.add(ogImageMatch[1]);
    }

    // --- 8. 内部リンク404チェック ---
    const hrefMatches = [...html.matchAll(/href="(\/[^"?#]*)/g)];
    const brokenLinks = new Set();
    for (const hm of hrefMatches) {
      const href = hm[1];
      if (!isKnownRoute(href, known)) brokenLinks.add(href);
    }
    for (const bl of brokenLinks) {
      report("ERROR", url, `内部リンク404疑い: href="${bl}" に対応するページが見つかりません`);
    }

    // --- 9. robots.txt整合性 ---
    if (robots) {
      const disallowed = robots.disallows.some((d) => d !== "" && url.startsWith(d));
      if (disallowed && !isNoindex) {
        report("WARNING", url, `robots.txtでDisallowされていますが、noindexメタタグがありません`);
      }
    }
  }

  // --- title/description/canonical 重複チェック ---
  for (const [title, urls] of titleMap) {
    const uniqueUrls = [...new Set(urls)];
    if (uniqueUrls.length > 1) {
      report("WARNING", uniqueUrls[0], `title重複「${title}」: ${uniqueUrls.join(", ")}`);
    }
  }
  for (const [desc, urls] of descMap) {
    const uniqueUrls = [...new Set(urls)];
    if (uniqueUrls.length > 1) {
      report("WARNING", uniqueUrls[0], `description重複: ${uniqueUrls.join(", ")}`);
    }
  }
  for (const [canonical, urls] of canonicalMap) {
    const uniqueUrls = [...new Set(urls)];
    if (uniqueUrls.length > 1) {
      report("ERROR", uniqueUrls[0], `canonical重複 "${canonical}": ${uniqueUrls.join(", ")}`);
    }
  }

  // --- robots.txt の Sitemap 行の整合性 ---
  if (robots) {
    if (!robots.sitemap) {
      report("WARNING", "/robots.txt", `Sitemap行がありません`);
    } else if (robots.sitemap !== `${BASE_URL}/sitemap.xml`) {
      report("WARNING", "/robots.txt", `Sitemap行が想定と異なります: "${robots.sitemap}"`);
    }
  } else {
    report("WARNING", "/robots.txt", `robots.txtが見つかりません`);
  }

  // --- --server 指定時: canonical / OGP画像 / sitemap掲載URL の実HTTPステータス確認 ---
  if (SERVER_URL) {
    console.log(`\n--server 指定あり。${SERVER_URL} に対してライブHTTPチェックを実行します...`);

    for (const target of liveCheckTargets) {
      const local = toLocalUrl(target);
      if (!local) continue;
      const status = await fetchStatus(local);
      if (status === null || status >= 400) {
        report("ERROR", target, `HTTP確認NG → ステータス: ${status ?? "取得失敗"}`);
      }
    }

    const sitemapStatus = await fetchStatus(`${SERVER_URL}/sitemap.xml`);
    if (sitemapStatus === 200) {
      const sitemapRes = await fetch(`${SERVER_URL}/sitemap.xml`);
      const sitemapBody = await sitemapRes.text();
      const locs = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      for (const loc of locs) {
        const local = toLocalUrl(loc);
        if (!local) continue;
        const status = await fetchStatus(local);
        if (status === null || status >= 400) {
          report("ERROR", loc, `sitemap URL NG → ステータス: ${status ?? "取得失敗"}`);
        }
      }
    } else {
      report("ERROR", "/sitemap.xml", `ステータス: ${sitemapStatus ?? "取得失敗"}`);
    }
  }

  // ─── ③ 差分表示: 変更されたページを先頭にまとめる ────────────────────
  const changedFiles = getChangedSourceFiles();
  const affectedUrls = guessAffectedUrls(changedFiles, known.routes);
  if (affectedUrls.size > 0) {
    console.log("\n━━━━━━━━━━━━━━━");
    console.log(`変更されたページ（推定 ${affectedUrls.size}件）`);
    console.log("━━━━━━━━━━━━━━━");
    for (const u of affectedUrls) {
      const related = findings.filter((f) => f.url === u || f.url.startsWith(BASE_URL + u));
      const errCount = related.filter((f) => f.level === "ERROR").length;
      const warnCount = related.filter((f) => f.level === "WARNING").length;
      const status = errCount > 0 ? "FAIL" : warnCount > 0 ? "CHECK" : "OK";
      console.log(`  ${status.padEnd(5)} ${u}${related.length ? `  (E:${errCount} W:${warnCount})` : ""}`);
      related.forEach((f) => console.log(`         └ [${f.level}] ${f.message}`));
    }
  } else if (changedFiles.length > 0) {
    console.log("\n（変更ファイルは検出されましたが、個別ページへの紐付けは推定できませんでした。共通データ/コンポーネントの変更の可能性があります）");
  }

  // ─── 結果出力（詳細・レベル別） ─────────────────────────────────────
  const errors = findings.filter((f) => f.level === "ERROR");
  const warnings = findings.filter((f) => f.level === "WARNING");
  const infos = findings.filter((f) => f.level === "INFO");

  console.log(`\n検査対象ページ数: ${files.length}`);
  console.log(`\n=== ERROR（要修正） : ${errors.length}件 ===`);
  errors.forEach((f) => console.log(`✗ [${f.url}] ${f.message}`));
  console.log(`\n=== WARNING（要確認） : ${warnings.length}件 ===`);
  warnings.forEach((f) => console.log(`△ [${f.url}] ${f.message}`));
  console.log(`\n=== INFO（参考・目安からの逸脱） : ${infos.length}件 ===`);
  if (infos.length > 20) {
    console.log(`  ${infos.length}件検出（詳細は割愛。--verbose相当が必要なら本スクリプトを拡張してください）`);
  } else {
    infos.forEach((f) => console.log(`・[${f.url}] ${f.message}`));
  }

  // ─── ② QA SCORE 算出 ────────────────────────────────────────────────
  // ERRORは重く減点、WARNINGは軽く減点、INFOは減点しない（あくまで参考情報のため）
  const rawScore = 100 - errors.length * 8 - warnings.length * 1;
  const score = Math.max(0, Math.min(100, rawScore));

  // ─── カテゴリ別 PASS/FAIL ────────────────────────────────────────────
  const categoryError = (keyword) => errors.some((f) => f.message.includes(keyword));
  const categories = {
    Metadata: categoryError("title") || categoryError("サフィックス"),
    "JSON-LD": categoryError("JSON-LD"),
    "Internal Links": categoryError("内部リンク404"),
    Canonical: categoryError("canonical") || categoryError("HTTP確認NG"),
    OGP: categoryError("HTTP確認NG"),
  };
  const seoLive = SERVER_URL ? !categoryError("HTTP確認NG") && !categoryError("sitemap URL NG") : null;

  // ─── ④ サマリー出力 ──────────────────────────────────────────────────
  const pass = (v) => (v ? "FAIL" : "PASS");
  const overallPass = errors.length === 0;
  console.log("\n━━━━━━━━━━━━━━━");
  console.log("QA RESULT");
  console.log("");
  console.log(`Pages Checked : ${files.length}`);
  console.log("");
  console.log(`Errors   : ${errors.length}`);
  console.log(`Warnings : ${warnings.length}`);
  console.log(`Info     : ${infos.length}`);
  console.log("");
  console.log(`SEO             : ${seoLive === null ? "SKIP（--server未指定）" : pass(!seoLive)}`);
  console.log(`Metadata        : ${pass(categories.Metadata)}`);
  console.log(`JSON-LD         : ${pass(categories["JSON-LD"])}`);
  console.log(`Internal Links  : ${pass(categories["Internal Links"])}`);
  console.log(`Canonical       : ${pass(categories.Canonical)}`);
  console.log(`OGP             : ${pass(categories.OGP)}`);
  console.log("");
  console.log("QA SCORE");
  console.log(`${score} / 100`);
  console.log("");
  console.log(overallPass ? "READY FOR DEPLOYMENT" : "NOT READY — ERRORを修正してください");
  console.log("━━━━━━━━━━━━━━━");

  process.exit(overallPass ? 0 : 1);
}

main();
