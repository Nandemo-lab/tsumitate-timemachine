#!/usr/bin/env node
/**
 * ビルド後の全ページを横断チェックするQAスクリプト。
 * 使い方: next build を実行した後に `node scripts/qa-check.mjs` を実行する。
 *
 * チェック項目:
 *  1. titleにサイト名の重複がないか（"| 積立タイムマシン | 積立タイムマシン" 等）
 *  2. canonicalが自ページURLと一致し、他ページと重複していないか
 *  3. JSON-LDの必須項目が欠けていないか（Article / BreadcrumbList / FAQPage）
 *  4. 内部リンク（href="/..."）が実在するルートを指しているか（404チェック）
 *  5. meta descriptionが他ページと重複していないか
 *  6. OGP画像（og:image）が出力されているか
 *
 * 既知のバグ回帰チェック:
 *  - title二重サフィックス問題（2026-07に発覚・全記事で修正済み）が再発していないか
 */
import fs from "fs";
import path from "path";

const APP_DIR = path.join(process.cwd(), ".next/server/app");
const BASE_URL = "https://tsumitate-timemachine.com";

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
  // 動的APIルート・静的アセットなど、htmlとして書き出されないが有効なパスを許容
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
  if (!href || !href.startsWith("/")) return true; // 外部リンク・アンカーは対象外
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "") return true;
  if (known.routes.has(clean)) return true;
  if (known.allowPrefixes.some((p) => clean.startsWith(p))) return true;
  return false;
}

// ─── メイン ──────────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(APP_DIR)) {
    console.error("✗ .next/server/app が見つかりません。先に `next build` を実行してください。");
    process.exit(1);
  }

  const files = collectHtmlFiles(APP_DIR).filter(
    (f) => !f.includes("_global-error") && !f.includes("_not-found")
  );
  const known = buildKnownRoutes(files);

  const errors = [];
  const warnings = [];
  const titleMap = new Map(); // title -> [urls]
  const descMap = new Map(); // description -> [urls]
  const canonicalMap = new Map(); // canonical -> [urls]

  for (const file of files) {
    const html = fs.readFileSync(file, "utf-8");
    const url = urlFromFile(file);

    // --- 1. title二重サフィックス回帰チェック ---
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";
    if (title) {
      // サフィックス「 | 積立タイムマシン」自体の重複のみを検出する（本文中にブランド名が
      // 自然に含まれるケース、例:「積立タイムマシンについて」を誤検知しないようにする）
      const suffixCount = (title.match(/\s\|\s積立タイムマシン/g) || []).length;
      if (suffixCount >= 2) {
        errors.push(`[title重複] ${url} : titleに「| 積立タイムマシン」サフィックスが${suffixCount}回出現 → "${title}"`);
      }
      if (!titleMap.has(title)) titleMap.set(title, []);
      titleMap.get(title).push(url);
    } else {
      warnings.push(`[title欠落] ${url} : <title>タグが見つかりません`);
    }

    // --- 2. canonical チェック ---
    const canonicalMatch = html.match(/rel="canonical"\s+href="([^"]+)"/);
    const canonical = canonicalMatch ? canonicalMatch[1] : null;
    if (!canonical) {
      warnings.push(`[canonical欠落] ${url}`);
    } else {
      const expected = BASE_URL + (url === "/" ? "" : url);
      if (canonical !== expected && canonical !== expected + "/") {
        warnings.push(`[canonical不一致] ${url} : canonical="${canonical}" (期待値="${expected}")`);
      }
      if (!canonicalMap.has(canonical)) canonicalMap.set(canonical, []);
      canonicalMap.get(canonical).push(url);
    }

    // --- 3. JSON-LD 必須項目チェック ---
    const jsonLdMatches = [...html.matchAll(/type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    const rawJsonLdMatches = [
      ...html.matchAll(/application\\?"\/ld\+json\\?".*?\\"__html\\":\\"(.*?)\\"\}/g),
    ];
    let jsonLdBlocks = [];
    for (const m of jsonLdMatches) {
      try {
        jsonLdBlocks.push(JSON.parse(m[1]));
      } catch {
        /* dangerouslySetInnerHTML経由でエスケープされているケースは後段の簡易チェックに任せる */
      }
    }
    if (jsonLdBlocks.length === 0 && rawJsonLdMatches.length === 0) {
      warnings.push(`[JSON-LD欠落の可能性] ${url} : ld+json ブロックが検出できません`);
    }
    for (const block of jsonLdBlocks) {
      if (block["@type"] === "Article") {
        if (!block.headline) errors.push(`[JSON-LD不備] ${url} : Article.headline が欠落`);
        if (!block.description) errors.push(`[JSON-LD不備] ${url} : Article.description が欠落`);
        if (!block.datePublished) errors.push(`[JSON-LD不備] ${url} : Article.datePublished が欠落`);
      }
      if (block["@type"] === "BreadcrumbList") {
        if (!Array.isArray(block.itemListElement) || block.itemListElement.length === 0) {
          errors.push(`[JSON-LD不備] ${url} : BreadcrumbList.itemListElement が空`);
        }
      }
      if (block["@type"] === "FAQPage") {
        if (!Array.isArray(block.mainEntity) || block.mainEntity.length === 0) {
          errors.push(`[JSON-LD不備] ${url} : FAQPage.mainEntity が空`);
        }
      }
    }

    // --- 4. meta description ---
    const descMatch = html.match(/name="description"\s+content="([^"]*)"/);
    const desc = descMatch ? descMatch[1] : null;
    if (!desc) {
      warnings.push(`[description欠落] ${url}`);
    } else {
      if (!descMap.has(desc)) descMap.set(desc, []);
      descMap.get(desc).push(url);
    }

    // --- 5. OGP画像チェック ---
    const ogImageMatch = html.match(/property="og:image"\s+content="([^"]*)"/);
    if (!ogImageMatch) {
      warnings.push(`[OGP画像欠落] ${url}`);
    }

    // --- 6. 内部リンク404チェック ---
    const hrefMatches = [...html.matchAll(/href="(\/[^"?#]*)/g)];
    const brokenLinks = new Set();
    for (const hm of hrefMatches) {
      const href = hm[1];
      if (!isKnownRoute(href, known)) {
        brokenLinks.add(href);
      }
    }
    for (const bl of brokenLinks) {
      errors.push(`[内部リンク404疑い] ${url} : href="${bl}" に対応するページが見つかりません`);
    }
  }

  // --- title/description/canonical 重複チェック（異なるURL間） ---
  for (const [title, urls] of titleMap) {
    const uniqueUrls = [...new Set(urls)];
    if (uniqueUrls.length > 1) {
      warnings.push(`[title重複] 「${title}」が複数ページで重複: ${uniqueUrls.join(", ")}`);
    }
  }
  for (const [desc, urls] of descMap) {
    const uniqueUrls = [...new Set(urls)];
    if (uniqueUrls.length > 1) {
      warnings.push(`[description重複] 複数ページで同一description: ${uniqueUrls.join(", ")}`);
    }
  }
  for (const [canonical, urls] of canonicalMap) {
    const uniqueUrls = [...new Set(urls)];
    if (uniqueUrls.length > 1) {
      errors.push(`[canonical重複] "${canonical}" が複数ページから参照: ${uniqueUrls.join(", ")}`);
    }
  }

  // --- 結果出力 ---
  console.log(`\n検査対象ページ数: ${files.length}`);
  console.log(`\n=== エラー（要修正） : ${errors.length}件 ===`);
  errors.forEach((e) => console.log("✗ " + e));
  console.log(`\n=== 警告（要確認） : ${warnings.length}件 ===`);
  warnings.forEach((w) => console.log("△ " + w));

  if (errors.length > 0) {
    console.log("\nQAチェック: 失敗（エラーあり）");
    process.exit(1);
  } else {
    console.log("\nQAチェック: 合格（エラーなし）");
    process.exit(0);
  }
}

main();
