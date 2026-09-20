#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getOgComparisonState } from "../lib/og-comparison.mjs";

function result(overrides = {}) {
  return {
    fundId: "sp500",
    fundName: "S&P500",
    fundColor: "#fff",
    totalPrincipal: 1_980_000,
    finalValue: 3_000_000,
    profit: 1_020_000,
    returnRate: 51.5,
    dataPoints: [],
    monthsElapsed: 66,
    startYear: 2020,
    startMonth: 1,
    monthlyAmount: 30_000,
    ...overrides,
  };
}

assert.equal(getOgComparisonState({ a: result({ finalValue: 4 }), b: result({ finalValue: 3 }), qualityA: "A", qualityB: "A" }).kind, "higher-a");
assert.equal(getOgComparisonState({ a: result({ finalValue: 3 }), b: result({ finalValue: 4 }), qualityA: "A", qualityB: "A" }).kind, "higher-b");
assert.deepEqual(
  getOgComparisonState({ a: result({ finalValue: 3 }), b: result({ finalValue: 3 }), qualityA: "A", qualityB: "A" }),
  { kind: "equal", labelA: "同額", labelB: "同額", note: "同じ条件で最終評価額が同額" },
);
assert.equal(getOgComparisonState({ a: result({ finalValue: -2, profit: -4 }), b: result({ finalValue: -3, profit: -5 }), qualityA: "A", qualityB: "A" }).kind, "higher-a");
assert.equal(getOgComparisonState({ a: result(), b: null, qualityA: "A", qualityB: "A" }).kind, "unavailable");
assert.equal(getOgComparisonState({ a: result(), b: result(), qualityA: "A", qualityB: "G" }).kind, "reference");
assert.equal(getOgComparisonState({ a: result(), b: result({ totalPrincipal: 1_950_000 }), qualityA: "A", qualityB: "A" }).kind, "unavailable");
assert.equal(getOgComparisonState({ a: result({ finalValue: 3 }), b: result({ finalValue: 4 }), qualityA: "A", qualityB: "A" }).labelA, null);
assert.equal(getOgComparisonState({ a: result({ finalValue: 4 }), b: result({ finalValue: 3 }), qualityA: "A", qualityB: "A" }).labelB, null);

console.log("PASS: comparison OGP labels follow unrounded simulation results and quality policy");

const serverIndex = process.argv.indexOf("--server");
if (serverIndex !== -1) {
  const server = process.argv[serverIndex + 1]?.replace(/\/$/, "");
  if (!server) throw new Error("--server requires a URL");

  const appDir = path.join(process.cwd(), ".next", "server", "app");
  const htmlFiles = [];
  const collect = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) collect(full);
      else if (entry.name.endsWith(".html")) htmlFiles.push(full);
    }
  };
  collect(appDir);

  const references = [];
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/gi)) {
      const raw = match[1].replaceAll("&amp;", "&");
      const parsed = new URL(raw);
      if (parsed.pathname !== "/api/og") continue;
      parsed.searchParams.sort();
      references.push({ file: path.relative(appDir, file), url: parsed.toString() });
    }
  }

  const uniqueUrls = [...new Set(references.map(({ url }) => url))];
  const classify = (url) => {
    const params = new URL(url).searchParams;
    if (params.size === 0 || params.get("static") === "1") return "static";
    return params.has("fundB") ? "comparison" : "product";
  };
  const counts = { static: 0, product: 0, comparison: 0 };
  for (const url of uniqueUrls) counts[classify(url)]++;

  let ok = 0;
  for (const absoluteUrl of uniqueUrls) {
    const parsed = new URL(absoluteUrl);
    const response = await fetch(`${server}${parsed.pathname}${parsed.search}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    assert.equal(response.status, 200, absoluteUrl);
    assert.match(response.headers.get("content-type") ?? "", /^image\/png/, absoluteUrl);
    assert.equal(buffer.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", absoluteUrl);
    assert.equal(metadata.width, 1200, absoluteUrl);
    assert.equal(metadata.height, 630, absoluteUrl);
    assert.ok(buffer.length > 5_000, `${absoluteUrl} is unexpectedly small`);
    ok++;
  }

  const invalid = await fetch(`${server}/api/og?fund=invalid&year=2020&amount=30000`);
  assert.equal(invalid.status, 400);
  const unsupported = await fetch(`${server}/api/og?fund=orcan&year=2015&amount=30000`);
  assert.equal(unsupported.status, 422);
  const unavailableB = await fetch(`${server}/api/og?fund=vti&fundB=orcan&year=2015&amount=30000`);
  const unavailableBuffer = Buffer.from(await unavailableB.arrayBuffer());
  const unavailableMetadata = await sharp(unavailableBuffer).metadata();
  assert.equal(unavailableB.status, 200);
  assert.equal(unavailableMetadata.width, 1200);
  assert.equal(unavailableMetadata.height, 630);

  console.log(JSON.stringify({
    referenceCount: references.length,
    uniqueUrlCount: uniqueUrls.length,
    classifications: counts,
    successfulImages: ok,
    comparisonReferences: references.filter(({ url }) => classify(url) === "comparison").length,
    comparisonUniqueUrls: uniqueUrls.filter((url) => classify(url) === "comparison").length,
    comparisonUrls: uniqueUrls.filter((url) => classify(url) === "comparison"),
    invalidStatus: invalid.status,
    unsupportedStatus: unsupported.status,
    unavailableComparisonStatus: unavailableB.status,
  }, null, 2));
}
