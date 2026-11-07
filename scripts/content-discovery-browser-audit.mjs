import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const base = process.argv[2] ?? "http://127.0.0.1:4323";
const outputDir = process.argv[3] ?? path.join(process.cwd(), ".artifacts", "content-discovery");
const chrome = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9334;
const profile = await fs.mkdtemp(path.join(os.tmpdir(), "tm-content-audit-"));
await fs.mkdir(outputDir, { recursive: true });

const browser = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function retry(fn, attempts = 50) {
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

function expression(code) {
  return `(() => { ${code} })()`;
}

async function evaluate(cdp, code) {
  const result = await cdp.send("Runtime.evaluate", { expression: expression(code), returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function navigate(cdp, url) {
  await cdp.send("Page.navigate", { url });
  await retry(async () => {
    const ready = await evaluate(cdp, "return document.readyState === 'complete' && document.body?.innerText.length > 100;");
    if (!ready) throw new Error("page not ready");
  });
  await sleep(350);
}

async function setViewport(cdp, width, height) {
  await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
}

async function screenshot(cdp, filename) {
  const shot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, fromSurface: true });
  await fs.writeFile(path.join(outputDir, filename), Buffer.from(shot.data, "base64"));
}

async function setSearch(cdp, value) {
  await evaluate(cdp, `
    const input = document.querySelector('#guide-search');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  `);
  await sleep(650);
}

const failures = [];
const observations = [];
try {
  await retry(async () => {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (!response.ok) throw new Error("Chrome CDP unavailable");
    return response.json();
  });
  const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${base}/guide`)}`, { method: "PUT" }).then((response) => response.json());
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener("open", resolve, { once: true }); ws.addEventListener("error", reject, { once: true }); });
  const cdp = new Cdp(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  for (const width of [375, 390, 768, 1280]) {
    await setViewport(cdp, width, width < 768 ? 844 : 900);
    await navigate(cdp, `${base}/guide`);
    const metrics = await evaluate(cdp, `return {
      title: document.querySelector('h1')?.innerText,
      searchVisible: Boolean(document.querySelector('#guide-search')),
      categoryCount: document.querySelectorAll('[aria-label="目的別カテゴリ"] button').length,
      resultCount: document.querySelectorAll('section[aria-labelledby="guide-discovery-title"] ol > li').length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      inputHeight: Math.round(document.querySelector('#guide-search')?.getBoundingClientRect().height || 0),
      minCategoryHeight: Math.min(...[...document.querySelectorAll('[aria-label="目的別カテゴリ"] button')].map((node) => node.getBoundingClientRect().height)),
    };`);
    observations.push({ width, page: "/guide", ...metrics });
    if (!metrics.searchVisible || metrics.categoryCount !== 8 || metrics.overflow || metrics.inputHeight < 44 || metrics.minCategoryHeight < 44) failures.push(`${width}px guide metrics failed: ${JSON.stringify(metrics)}`);
    await screenshot(cdp, `guide-${width}.png`);
  }

  await setViewport(cdp, 390, 844);
  await navigate(cdp, `${base}/guide`);
  await setSearch(cdp, "子供NISA");
  const childCount = await evaluate(cdp, "return document.querySelectorAll('section[aria-labelledby=\"guide-discovery-title\"] ol > li').length;");
  if (childCount < 1) failures.push("子供NISA alias returned no results");
  await setSearch(cdp, "オールカントリー");
  const allCountryCount = await evaluate(cdp, "return document.querySelectorAll('section[aria-labelledby=\"guide-discovery-title\"] ol > li').length;");
  if (allCountryCount < 1) failures.push("オールカントリー alias returned no results");
  await setSearch(cdp, "一致しない検索語zzzz");
  const zeroState = await evaluate(cdp, "return document.body.innerText.includes('一致する記事が見つかりませんでした');");
  if (!zeroState) failures.push("zero-result recovery is missing");
  await evaluate(cdp, "document.querySelector('button[aria-label=\"検索語を消す\"]')?.click(); return true;");
  await sleep(250);
  const cleared = await evaluate(cdp, "return document.querySelector('#guide-search').value === ''; ");
  if (!cleared) failures.push("search clear failed");

  await evaluate(cdp, "[...document.querySelectorAll('[aria-label=\"目的別カテゴリ\"] button')].find((button) => button.textContent.trim() === '子どものお金')?.click(); return true;");
  await sleep(250);
  const childrenCategoryCount = await evaluate(cdp, "return document.querySelectorAll('section[aria-labelledby=\"guide-discovery-title\"] ol > li').length;");
  if (childrenCategoryCount !== 8) failures.push(`children category expected 8 results, received ${childrenCategoryCount}`);
  await evaluate(cdp, "[...document.querySelectorAll('[aria-label=\"目的別カテゴリ\"] button')].find((button) => button.textContent.trim() === 'すべて')?.click(); return true;");
  await sleep(200);

  await setSearch(cdp, "貯金と投資");
  await evaluate(cdp, "document.querySelector('ol a')?.click(); return true;");
  await retry(async () => { if (!(await evaluate(cdp, "return location.pathname !== '/guide';"))) throw new Error("navigation pending"); });
  await cdp.send("Runtime.evaluate", { expression: "history.back()" });
  await retry(async () => { if (!(await evaluate(cdp, "return location.pathname === '/guide';"))) throw new Error("back pending"); });
  await sleep(300);
  const restored = await evaluate(cdp, "return document.querySelector('#guide-search')?.value === '貯金と投資';");
  if (!restored) failures.push("search state was not restored after browser back");

  await evaluate(cdp, "document.querySelector('#guide-search').focus(); return true;");
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  const keyboardTarget = await evaluate(cdp, "return document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName;");
  observations.push({ keyboardTarget, aliasResults: { childCount, allCountryCount }, childrenCategoryCount, zeroState, restored });

  for (const slug of ["saving-vs-investing", "stock-fund-etf-difference", "money-not-to-invest"]) {
    await navigate(cdp, `${base}/guide/${slug}`);
    const metrics = await evaluate(cdp, `return {
      path: location.pathname,
      h1: document.querySelector('h1')?.innerText,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      hasVisual: Boolean(document.querySelector('svg')),
      hasRisk: /元本割れ|元本保証/.test(document.body.innerText),
      relatedLinks: [...document.querySelectorAll('a[href^="/guide/"]')].filter((link) => link.href !== location.href).length,
      simulationLinks: document.querySelectorAll('a[href="/"], a[href^="/?"]').length,
    };`);
    observations.push({ width: 390, page: `/guide/${slug}`, ...metrics });
    if (metrics.overflow || !metrics.hasVisual || !metrics.hasRisk || metrics.relatedLinks < 2) failures.push(`${slug} content metrics failed: ${JSON.stringify(metrics)}`);
    await screenshot(cdp, `${slug}-390.png`);
  }
  ws.close();
} finally {
  if (browser.exitCode === null) {
    const exited = new Promise((resolve) => browser.once("exit", resolve));
    browser.kill();
    await Promise.race([exited, sleep(2000)]);
  }
  await retry(() => fs.rm(profile, { recursive: true, force: true }), 20).catch(() => {
    console.warn(`Temporary Chrome profile could not be removed: ${profile}`);
  });
}

await fs.writeFile(path.join(outputDir, "results.json"), JSON.stringify({ base, observations, failures }, null, 2));
console.log(JSON.stringify({ outputDir, observations, failures }, null, 2));
if (failures.length) process.exit(1);
