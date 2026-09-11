import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "data", "verified");
const expected = { vti: ["2015-01", "2025-06", 126], vym: ["2015-01", "2025-06", 126], eem: ["2015-01", "2025-06", 126], inda: ["2015-01", "2025-06", 126], orcan: ["2018-11", "2025-06", 80], sp500: ["2018-08", "2025-06", 83], nasdaq100: ["2018-09", "2025-06", 82], fangplus: ["2018-02", "2025-06", 89] };
let failures = 0;
const fail = (message) => { failures++; console.error(`ERROR ${message}`); };
const monthBefore = (month) => { let [y, m] = month.split("-").map(Number); if (--m === 0) { y--; m = 12; } return `${y}-${String(m).padStart(2, "0")}`; };
const simulate = (points, amount) => { let value = 0; for (const p of points) value = (value + amount) * (1 + p.monthlyReturn); return Math.round(value); };

const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
if (manifest.fx.observationCount !== 127) fail("FX observation count");
for (const [id, [first, last, count]] of Object.entries(expected)) {
  const doc = JSON.parse(await readFile(path.join(root, `${id}-monthly.json`), "utf8"));
  const p = doc.observations; const months = p.map((x) => x.month);
  if (p.length !== count || doc.observationCount !== count) fail(`${id} count`);
  if (months[0] !== first || months.at(-1) !== last) fail(`${id} range`);
  if (new Set(months).size !== months.length) fail(`${id} duplicate`);
  if (p.some((x) => !Number.isFinite(x.monthlyReturn))) fail(`${id} invalid return`);
  for (let i = 1; i < months.length; i++) if (monthBefore(months[i]) !== months[i - 1]) fail(`${id} missing before ${months[i]}`);
  if (["vti", "vym", "eem", "inda"].includes(id) && p.some((x) => Math.abs(x.monthlyReturn - ((1 + x.usdNavTotalReturn) * (x.monthEndYenPerUsd / x.previousMonthEndYenPerUsd) - 1)) > 1e-14)) fail(`${id} FX alignment`);
  console.log(`PASS ${id}: ${first}..${last}, ${count}, ¥30,000 => ¥${simulate(p, 30000).toLocaleString()}`);
}
if (failures) process.exit(1);
console.log("PASS duplicate=0 missing=0 invalid=0 look-ahead=0 fallback=0");
