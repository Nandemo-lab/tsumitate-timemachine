import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "data", "verified");
const manifest = JSON.parse(await readFile(path.join(dataDir, "manifest.json"), "utf8"));
const expectedSeries = ["vt", "vti", "vym", "eem", "inda", "orcan", "sp500", "nasdaq100", "fangplus"];
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function monthCount(first, last) {
  const [firstYear, firstMonth] = first.split("-").map(Number);
  const [lastYear, lastMonth] = last.split("-").map(Number);
  return (lastYear - firstYear) * 12 + lastMonth - firstMonth + 1;
}

assert(manifest.schemaVersion === 1, "unsupported manifest schema");
assert(manifest.fx.lastMonth, "FX end month is missing");
assert(Object.keys(manifest.series).length === expectedSeries.length, "A-quality series count changed");
assert(!manifest.series.schd, "G-quality SCHD must not enter the verified manifest");

const commonEnd = manifest.fx.lastMonth;
const rawFx = await readFile(path.join(dataDir, "raw", "boj-usdjpy-month-end.json"), "utf8");
assert(sha256(rawFx) === manifest.fx.rawSha256, "BOJ raw SHA-256 mismatch");

for (const id of expectedSeries) {
  const meta = manifest.series[id];
  assert(meta, `${id}: manifest entry missing`);
  assert(meta.lastMonth === commonEnd, `${id}: common end mismatch (${meta.lastMonth} != ${commonEnd})`);
  assert(meta.missingMonths?.length === 0, `${id}: manifest reports missing months`);

  const raw = await readFile(path.join(dataDir, meta.rawFile), "utf8");
  assert(sha256(raw) === meta.rawSha256, `${id}: raw SHA-256 mismatch`);

  const ledger = JSON.parse(await readFile(path.join(dataDir, meta.file), "utf8"));
  const observations = ledger.observations;
  const months = observations.map(({ month }) => month);
  assert(ledger.lastMonth === commonEnd, `${id}: ledger end mismatch`);
  assert(months.at(0) === meta.firstMonth, `${id}: first month mismatch`);
  assert(months.at(-1) === commonEnd, `${id}: final observation mismatch`);
  assert(months.length === monthCount(meta.firstMonth, commonEnd), `${id}: observation count is not continuous`);
  assert(months.length === meta.observationCount, `${id}: manifest count mismatch`);
  assert(new Set(months).size === months.length, `${id}: duplicate month`);
  assert(observations.every(({ monthlyReturn }) => Number.isFinite(monthlyReturn)), `${id}: invalid return`);
  console.log(`PASS ${id.padEnd(10)} ${meta.firstMonth}..${commonEnd} ${months.length} months`);
}

console.log(`PASS: ${expectedSeries.length} A-quality series share verified common end ${commonEnd}; raw hashes and continuity are valid.`);
