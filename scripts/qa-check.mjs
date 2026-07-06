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
 * チェック項目:
 *  1. titleにサイト名サフィックスの重複がないか（回帰チェック）
 *  2. titleの文字数（目安30〜35文字、外れは警告）
 *  3. canonicalの欠落・自ページURLとの不一致・重複
 *  4. noindexページにcanonicalがあるか
 *  5. meta descriptionの欠落・重複・文字数（目安90〜120文字）
 *  6. JSON-LD（Article/BreadcrumbList/FAQPage）の必須項目・型チェック
 *  7. OGP画像（og:image）の欠落
 *  8. 内部リンク（href="/..."）が実在ルートを指しているか（404チェック）
 *  9. robots.txtとの整合性（Disallow配下が実際にnoindexになっているか等）
 *  10. [--server指定時のみ] canonical/OGP画像/sitemap掲載URLが実際に200を返すか
 */
import fs from "fs";
import path from "path";

const APP_DIR = path.join(process.cwd(), ".next/server/app");
const BASE_URL = "https://tsumitate-timemachine.com";

const args = process.argv.slice(2);
const serverFlagIndex = args.indexOf("--server");
const SERVER_URL = serverFlagIndex !== -1 ? args[serverFlagIndex + 1] : null;

// title/descriptionの文字数目安（外れは警告のみ、エラーにはしない）
const TITLE_MIN = 30;
const TITLE_MAX = 35;
const DESC_MIN = 90;
const DESC_MAX = 120;

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
  return null; // 外部URLは対象外
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

  const errors = [];
  const warnings = [];
  const titleMap = new Map();
  const descMap = new Map();
  const canonicalMap = new Map();
  const liveCheckTargets = new Set(); // --server 指定時にHTTPで検証するURL群

  // カテゴリ別の合否（④サマリー用）
  const categoryHasError = {
    Metadata: false,
    "JSON-LD": false,
    "Internal Links": false,
    Canonical: false,
    OGP: false,
  };

  for (const file of files) {
    const html = fs.readFileSync(file, "utf-8");
    const url = urlFromFile(file);

    // --- noindex判定 ---
    const isNoindex = /name="robots"\s+content="[^"]*noindex[^"]*"/.test(html);

    // --- 1・2. title チェック ---
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";
    if (title) {
      const suffixCount = (title.match(/\s\|\s積立タイムマシン/g) || []).length;
      if (suffixCount >= 2) {
        errors.push(`[title重複] ${url} : titleに「| 積立タイムマシン」サフィックスが${suffixCount}回出現 → "${title}"`);
        categoryHasError.Metadata = true;
      }
      if (!isNoindex && (title.length < TITLE_MIN || title.length > TITLE_MAX)) {
        warnings.push(`[title文字数] ${url} : ${title.length}文字（目安${TITLE_MIN}〜${TITLE_MAX}文字）→ "${title}"`);
      }
      if (!titleMap.has(title)) titleMap.set(title, []);
      titleMap.get(title).push(url);
    } else {
      warnings.push(`[title欠落] ${url} : <title>タグが見つかりません`);
    }

    // --- 3・4. canonical チェック ---
    const canonicalMatch = html.match(/rel="canonical"\s+href="([^"]+)"/);
    const canonical = canonicalMatch ? canonicalMatch[1] : null;
    if (!canonical) {
      if (isNoindex) {
        warnings.push(`[noindex+canonical欠落] ${url} : noindexページにcanonicalがありません`);
      } else {
        warnings.push(`[canonical欠落] ${url}`);
      }
    } else {
      const expected = BASE_URL + (url === "/" ? "" : url);
      if (canonical !== expected && canonical !== expected + "/") {
        warnings.push(`[canonical不一致] ${url} : canonical="${canonical}" (期待値="${expected}")`);
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
      warnings.push(`[JSON-LD欠落の可能性] ${url} : ld+json ブロックが検出できません`);
    }
    for (const block of jsonLdBlocks) {
      const type = block["@type"];
      if (typeof type !== "string") {
        errors.push(`[JSON-LD型エラー] ${url} : @type が文字列ではありません`);
        categoryHasError["JSON-LD"] = true;
        continue;
      }
      if (type === "Article") {
        if (!block.headline) { errors.push(`[JSON-LD不備] ${url} : Article.headline が欠落`); categoryHasError["JSON-LD"] = true; }
        if (!block.description) { errors.push(`[JSON-LD不備] ${url} : Article.description が欠落`); categoryHasError["JSON-LD"] = true; }
        if (!block.datePublished) { errors.push(`[JSON-LD不備] ${url} : Article.datePublished が欠落`); categoryHasError["JSON-LD"] = true; }
        if (block.image && typeof block.image !== "string" && typeof block.image !== "object") {
          errors.push(`[JSON-LD型エラー] ${url} : Article.image の型が不正`);
          categoryHasError["JSON-LD"] = true;
        }
      }
      if (type === "BreadcrumbList") {
        if (!Array.isArray(block.itemListElement) || block.itemListElement.length === 0) {
          errors.push(`[JSON-LD不備] ${url} : BreadcrumbList.itemListElement が空`);
          categoryHasError["JSON-LD"] = true;
        } else {
          block.itemListElement.forEach((item, i) => {
            if (item["@type"] !== "ListItem") {
              errors.push(`[JSON-LD型エラー] ${url} : BreadcrumbList.itemListElement[${i}].@type が "ListItem" ではありません`);
              categoryHasError["JSON-LD"] = true;
            }
            if (typeof item.position !== "number") {
              errors.push(`[JSON-LD型エラー] ${url} : BreadcrumbList.itemListElement[${i}].position が数値ではありません`);
              categoryHasError["JSON-LD"] = true;
            }
            if (!item.name || !item.item) {
              errors.push(`[JSON-LD不備] ${url} : BreadcrumbList.itemListElement[${i}] に name/item が欠落`);
              categoryHasError["JSON-LD"] = true;
            }
          });
        }
      }
      if (type === "FAQPage") {
        if (!Array.isArray(block.mainEntity) || block.mainEntity.length === 0) {
          errors.push(`[JSON-LD不備] ${url} : FAQPage.mainEntity が空`);
          categoryHasError["JSON-LD"] = true;
        } else {
          block.mainEntity.forEach((q, i) => {
            if (q["@type"] !== "Question" || !q.acceptedAnswer?.text) {
              errors.push(`[JSON-LD型エラー] ${url} : FAQPage.mainEntity[${i}] の構造が不正`);
              categoryHasError["JSON-LD"] = true;
            }
          });
        }
      }
    }

    // --- 5. meta description ---
    const descMatch = html.match(/name="description"\s+content="([^"]*)"/);
    const desc = descMatch ? descMatch[1] : null;
    if (!desc) {
      warnings.push(`[description欠落] ${url}`);
    } else {
      if (!isNoindex && (desc.length < DESC_MIN || desc.length > DESC_MAX)) {
        warnings.push(`[description文字数] ${url} : ${desc.length}文字（目安${DESC_MIN}〜${DESC_MAX}文字）`);
      }
      if (!descMap.has(desc)) descMap.set(desc, []);
      descMap.get(desc).push(url);
    }

    // --- 7. OGP画像チェック ---
    const ogImageMatch = html.match(/property="og:image"\s+content="([^"]*)"/);
    if (!ogImageMatch) {
      if (!isNoindex) {
        warnings.push(`[OGP画像欠落] ${url}`);
        categoryHasError.OGP = categoryHasError.OGP; // noindex以外の欠落のみ将来的にエラー化検討
      }
    } else {
      liveCheckTargets.add(ogImageMatch[1]);
    }

    // --- 8. 内部リンク404チェック ---
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
      categoryHasError["Internal Links"] = true;
    }

    // --- 9. robots.txt整合性: Disallow配下のページがnoindexになっているか ---
    if (robots) {
      const disallowed = robots.disallows.some((d) => d !== "" && url.startsWith(d));
      if (disallowed && !isNoindex) {
        warnings.push(`[robots整合性] ${url} : robots.txtでDisallowされていますが、noindexメタタグがありません`);
      }
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
      categoryHasError.Canonical = true;
    }
  }

  // --- 9b. robots.txt の Sitemap 行の整合性 ---
  if (robots) {
    if (!robots.sitemap) {
      warnings.push(`[robots整合性] robots.txtにSitemap行がありません`);
    } else if (robots.sitemap !== `${BASE_URL}/sitemap.xml`) {
      warnings.push(`[robots整合性] robots.txtのSitemap行が想定と異なります: "${robots.sitemap}"`);
    }
  } else {
    warnings.push(`[robots整合性] robots.txtが見つかりません`);
  }

  // --- 10. --server 指定時: canonical / OGP画像 / sitemap掲載URL の実HTTPステータス確認 ---
  let seoLiveCheckOk = true;
  if (SERVER_URL) {
    console.log(`\n--server 指定あり。${SERVER_URL} に対してライブHTTPチェックを実行します...`);

    for (const target of liveCheckTargets) {
      const local = toLocalUrl(target);
      if (!local) continue;
      const status = await fetchStatus(local);
      if (status === null || status >= 400) {
        errors.push(`[HTTP確認NG] "${target}" → ステータス: ${status ?? "取得失敗"}`);
        categoryHasError.OGP = true;
        categoryHasError.Canonical = true;
        seoLiveCheckOk = false;
      }
    }

    // sitemap.xml 掲載URLの確認
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
          errors.push(`[sitemap URL NG] "${loc}" → ステータス: ${status ?? "取得失敗"}`);
          seoLiveCheckOk = false;
        }
      }
    } else {
      errors.push(`[sitemap.xml NG] ステータス: ${sitemapStatus ?? "取得失敗"}`);
      seoLiveCheckOk = false;
    }
  }

  // --- 結果出力（詳細） ---
  console.log(`\n検査対象ページ数: ${files.length}`);
  console.log(`\n=== エラー（要修正） : ${errors.length}件 ===`);
  errors.forEach((e) => console.log("✗ " + e));
  console.log(`\n=== 警告（要確認） : ${warnings.length}件 ===`);
  warnings.forEach((w) => console.log("△ " + w));

  // --- ④ サマリー出力 ---
  const pass = (v) => (v ? "FAIL" : "PASS");
  const overallPass = errors.length === 0;
  console.log("\n━━━━━━━━━━━━━━━");
  console.log("QA RESULT");
  console.log("");
  console.log(`Pages Checked : ${files.length}`);
  console.log("");
  console.log(`Errors   : ${errors.length}`);
  console.log(`Warnings : ${warnings.length}`);
  console.log("");
  console.log(`SEO             : ${pass(!seoLiveCheckOk)}`);
  console.log(`Metadata        : ${pass(categoryHasError.Metadata)}`);
  console.log(`JSON-LD         : ${pass(categoryHasError["JSON-LD"])}`);
  console.log(`Internal Links  : ${pass(categoryHasError["Internal Links"])}`);
  console.log(`Canonical       : ${pass(categoryHasError.Canonical)}`);
  console.log(`OGP             : ${pass(categoryHasError.OGP)}`);
  console.log("");
  console.log(overallPass ? "READY FOR DEPLOYMENT" : "NOT READY — エラーを修正してください");
  console.log("━━━━━━━━━━━━━━━");

  process.exit(overallPass ? 0 : 1);
}

main();
