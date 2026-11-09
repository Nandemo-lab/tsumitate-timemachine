import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const base = process.argv[2] ?? "http://127.0.0.1:4324";
const outputDir = process.argv[3] ?? path.join(process.cwd(), ".artifacts", "adsense-value-visual");
const chrome = process.env.CHROME_PATH ?? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9335;
const profile = await fs.mkdtemp(path.join(os.tmpdir(), "tm-adsense-audit-"));
await fs.mkdir(outputDir, { recursive: true });

const browser = spawn(chrome, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "about:blank",
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

async function evaluate(cdp, code) {
  const result = await cdp.send("Runtime.evaluate", {
    expression: `(() => { ${code} })()`, returnByValue: true, awaitPromise: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

const failures = [];
const observations = [];
try {
  await retry(async () => {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (!response.ok) throw new Error("Chrome CDP unavailable");
  });
  const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${base}/about`)}`, { method: "PUT" }).then((response) => response.json());
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  const cdp = new Cdp(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  const pages = [
    "/about", "/orukan", "/ranking", "/ranking/nisa", "/ranking/high-return",
    "/ranking/high-dividend", "/from/2020", "/compare/orukan-vs-nasdaq100",
  ];
  for (const width of [375, 390, 768, 1280]) {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width, height: width < 768 ? 844 : 900, deviceScaleFactor: 1, mobile: width < 768 });
    for (const page of pages) {
      await cdp.send("Page.navigate", { url: `${base}${page}` });
      await retry(async () => {
        if (!(await evaluate(cdp, "return document.readyState === 'complete' && document.body?.innerText.length > 100;"))) throw new Error("page not ready");
      });
      await sleep(250);
      const metrics = await evaluate(cdp, `return {
        h1: document.querySelector('h1')?.innerText,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        visibleCharacters: document.body.innerText.length,
      };`);
      observations.push({ width, page, ...metrics });
      if (metrics.overflow || !metrics.h1 || !metrics.canonical) failures.push(`${width}px ${page}: ${JSON.stringify(metrics)}`);
      const shot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, fromSurface: true });
      await fs.writeFile(path.join(outputDir, `${page.slice(1).replaceAll("/", "-") || "home"}-${width}.png`), Buffer.from(shot.data, "base64"));
    }
  }
  ws.close();
} finally {
  if (browser.exitCode === null) browser.kill();
  await retry(() => fs.rm(profile, { recursive: true, force: true }), 20).catch(() => {});
}

await fs.writeFile(path.join(outputDir, "adsense-value-results.json"), JSON.stringify({ observations, failures }, null, 2));
console.log(JSON.stringify({ outputDir, observations, failures }, null, 2));
if (failures.length) process.exit(1);
