import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const base = (process.argv[2] ?? "https://tsumitate-timemachine.com").replace(/\/$/, "");
const outputDir = process.argv[3] ?? path.join(process.cwd(), ".artifacts", "full-public-url-audit");
const ledgerPath = process.argv[4] ?? path.join(process.cwd(), "docs", "audits", "page-value-ledger-2026-11-09.csv");
const chrome = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const widths = (process.env.AUDIT_WIDTHS ?? "375,390,768,1280").split(",").map(Number).filter(Number.isFinite);
const auditExtras = process.env.AUDIT_EXTRAS !== "0";
const port = Number(process.env.AUDIT_CDP_PORT ?? 9341);
const profile = await fs.mkdtemp(path.join(os.tmpdir(), "tm-full-url-audit-"));
await fs.mkdir(outputDir, { recursive: true });

const sitemapXml = await fetch(`${base}/sitemap.xml?audit=${Date.now()}`).then((response) => response.text());
const indexPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname);
const ledger = await fs.readFile(ledgerPath, "utf8");
const ledgerPaths = ledger.split(/\r?\n/).slice(1).map((line) => {
  const match = line.match(/^"([^"]+)"/);
  return match ? new URL(match[1]).pathname : null;
}).filter(Boolean);
const extraPaths = [...new Set(ledgerPaths.filter((item) => !indexPaths.includes(item)))];

const browser = spawn(chrome, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function retry(fn, attempts = 80) {
  let error;
  for (let index = 0; index < attempts; index += 1) {
    try { return await fn(); } catch (caught) { error = caught; await sleep(100); }
  }
  throw error;
}
class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}
async function evaluate(cdp, code) {
  const result = await cdp.send("Runtime.evaluate", {
    expression: `(() => { ${code} })()`, returnByValue: true, awaitPromise: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
const safeName = (page) => page.slice(1).replaceAll("/", "--") || "home";
const observations = [];
const failures = [];

try {
  await retry(async () => {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (!response.ok) throw new Error("Chrome CDP unavailable");
  });
  const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(base)}`, { method: "PUT" }).then((response) => response.json());
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  const cdp = new Cdp(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  const plans = widths.flatMap((width) => indexPaths.map((page) => ({ width, page, indexTarget: true })))
    .concat(auditExtras ? extraPaths.map((page) => ({ width: 390, page, indexTarget: false })) : []);
  let completed = 0;
  for (const { width, page, indexTarget } of plans) {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height: width < 768 ? 844 : 900, deviceScaleFactor: 1, mobile: width < 768 });
    await cdp.send("Page.navigate", { url: `${base}${page}?audit=${Date.now()}` });
    await retry(async () => {
      const ready = await evaluate(cdp, "return document.readyState === 'complete' && document.body?.innerText.length > 20;");
      if (!ready) throw new Error("page not ready");
    });
    await sleep(120);
    const metrics = await evaluate(cdp, `return (() => {
      const images = [...document.images];
      const internalLinks = [...document.querySelectorAll('a[href]')].filter((a) => {
        try { return new URL(a.href, location.href).origin === location.origin; } catch { return false; }
      });
      const breadcrumb = document.querySelector('nav[aria-label*="パンくず"], nav[aria-label*="breadcrumb" i]');
      const sourceLinks = [...document.querySelectorAll('a[href]')].filter((a) => {
        try {
          const target = new URL(a.href, location.href);
          return /^https?:$/.test(target.protocol) && target.origin !== location.origin;
        } catch { return false; }
      });
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || '',
        h1: document.querySelector('h1')?.innerText || '',
        canonical: document.querySelector('link[rel="canonical"]')?.href || '',
        robots: document.querySelector('meta[name="robots"]')?.content || 'index(default)',
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        bodyCharacters: document.body.innerText.length,
        imageCount: images.length,
        brokenImages: images.filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.currentSrc || img.src),
        internalLinkCount: internalLinks.length,
        breadcrumbLinks: breadcrumb ? [...breadcrumb.querySelectorAll('a[href]')].map((a) => a.href) : [],
        hasJsonLd: Boolean(document.querySelector('script[type="application/ld+json"]')),
        hasGa4: document.documentElement.innerHTML.includes('googletagmanager.com') || document.documentElement.innerHTML.includes('gtag('),
        hasAdsense: document.documentElement.innerHTML.includes('pagead2.googlesyndication.com'),
        sourceLinkCount: sourceLinks.length,
        sourceHosts: [...new Set(sourceLinks.map((a) => new URL(a.href, location.href).hostname))],
        hasUpdate: /最終更新|確認日|データ終端|2026年9月/.test(document.body.innerText),
      };
    })();`);
    const http = await fetch(`${base}${page}?httpAudit=${Date.now()}`, { redirect: "manual" }).then((response) => ({ status: response.status, location: response.headers.get("location") }));
    const observation = { auditId: `${indexTarget ? "IDX" : "EXT"}-${String(completed + 1).padStart(3, "0")}`, width, page, indexTarget, http, ...metrics };
    observations.push(observation);
    if (indexTarget && (http.status !== 200 || !metrics.h1 || !metrics.canonical || /noindex/i.test(metrics.robots) || metrics.overflow || metrics.brokenImages.length)) {
      failures.push(observation);
    }
    if (!indexTarget && page === "/__adsense-audit-404" && http.status !== 404) failures.push(observation);
    if (!indexTarget && page !== "/__adsense-audit-404" && !/noindex/i.test(metrics.robots)) failures.push(observation);
    const viewport = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 72, captureBeyondViewport: false, fromSurface: true });
    await fs.writeFile(path.join(outputDir, `${safeName(page)}-${width}-viewport.jpg`), Buffer.from(viewport.data, "base64"));
    const full = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 68, captureBeyondViewport: true, fromSurface: true });
    await fs.writeFile(path.join(outputDir, `${safeName(page)}-${width}-full.jpg`), Buffer.from(full.data, "base64"));
    completed += 1;
    if (completed % 25 === 0 || completed === plans.length) console.log(`PROGRESS ${completed}/${plans.length}`);
  }
  ws.close();
} finally {
  if (browser.exitCode === null) browser.kill();
  await retry(() => fs.rm(profile, { recursive: true, force: true }), 20).catch(() => {});
}

const summary = {
  generatedAt: new Date().toISOString(), base, sitemapCount: indexPaths.length,
  extraCount: extraPaths.length, expectedIndexObservations: indexPaths.length * widths.length,
  observationCount: observations.length, failures,
};
await fs.writeFile(path.join(outputDir, "full-public-url-results.json"), JSON.stringify({ summary, observations }, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exit(1);
