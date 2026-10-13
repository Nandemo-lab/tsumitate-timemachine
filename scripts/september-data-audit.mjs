import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data", "verified");
const RAW_DIR = path.join(DATA_DIR, "raw");
const TARGET_MONTH = "2026-09";
const PREVIOUS_MONTH = "2026-08";

const EXPECTED_PREFIX_SHA256 = {
  vt: "9231aa580b88673c0d2b7955a672ada6ec07f91a5904e205ee0aa06bc1371b0b",
  vti: "ed4f7926612820e10bdee3fbd3689df264568cc01a614f608657810e17eda80d",
  vym: "12267c2e03466da9625d1f1f7e7fc0cdb906508e05d4434bdc893c5fae54772c",
  eem: "639caf0e483fdebe9f32333ab1c1b5a1a97aff8b4a58f00e98add5b12bf30a07",
  inda: "e11839f1bb6d8b0c110c0dd11b0439f24ff2311a85c0bd7fdd3ef1288a21df02",
  orcan: "651f433aa9fbaf33a3ceb085a73984caeb2f4511c490de46bd58626d7d41ffc7",
  sp500: "02286edcd0ceda3ab811268ccc2d7f4fc7e4027f333ece4afdf52ebf15b51ab5",
  nasdaq100: "076abb8628c10db0cef032955245f8d6b760a9c513d5581c81774318821215dd",
  fangplus: "abb7e9f8cc6670750456bf68ce919412a701f695ecded04b2cba2c47575ed8c6",
};

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const closeEnough = (actual, expected, tolerance = 1e-12) =>
  Math.abs(actual - expected) <= tolerance;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function monthKey(value) {
  const text = String(value);
  if (/^\d{6}(?:\d{2})?$/.test(text)) return `${text.slice(0, 4)}-${text.slice(4, 6)}`;
  return text.slice(0, 7);
}

function parseDomesticMonthEnds(text, id) {
  const slashDates = id === "orcan" || id === "sp500";
  const datePattern = slashDates ? /^\d{4}\/\d{2}\/\d{2},/ : /^\d{8},/;
  const reinvestedIndex = slashDates ? 2 : 6;
  const daily = text
    .trim()
    .split(/\r?\n/)
    .filter((line) => datePattern.test(line))
    .map((line) => {
      const columns = line.split(",");
      const rawDate = columns[0];
      const date = rawDate.includes("/")
        ? rawDate.replaceAll("/", "-")
        : `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
      return { date, month: date.slice(0, 7), value: Number(columns[reinvestedIndex]) };
    })
    .filter((point) => Number.isFinite(point.value));
  return [...new Map(daily.map((point) => [point.month, point])).values()];
}

const manifest = JSON.parse(await readFile(path.join(DATA_DIR, "manifest.json"), "utf8"));
const fxRaw = await readFile(path.join(RAW_DIR, "boj-usdjpy-month-end.json"), "utf8");
assert(sha256(fxRaw) === manifest.fx.rawSha256, "BOJ raw SHA-256 mismatch");
const fxByMonth = Object.fromEntries(
  JSON.parse(fxRaw).observations.map((point) => [point.month, point.yenPerUsd]),
);
assert(fxByMonth[PREVIOUS_MONTH] === 159.57, "Unexpected 2026-08 USD/JPY");
assert(fxByMonth[TARGET_MONTH] === 156.91, "Unexpected 2026-09 USD/JPY");

for (const [id, meta] of Object.entries(manifest.series)) {
  const ledger = JSON.parse(await readFile(path.join(DATA_DIR, meta.file), "utf8"));
  const rawText = await readFile(path.join(DATA_DIR, meta.rawFile), "utf8");
  const months = ledger.observations.map((point) => point.month);
  assert(meta.lastMonth === TARGET_MONTH, `${id}: manifest end is not ${TARGET_MONTH}`);
  assert(ledger.lastMonth === TARGET_MONTH, `${id}: ledger end is not ${TARGET_MONTH}`);
  assert(months.at(-1) === TARGET_MONTH, `${id}: final observation is not ${TARGET_MONTH}`);
  assert(new Set(months).size === months.length, `${id}: duplicate month`);
  assert(ledger.observations.every((point) => Number.isFinite(point.monthlyReturn)), `${id}: invalid return`);
  assert(sha256(rawText) === meta.rawSha256, `${id}: raw SHA-256 mismatch`);

  const prefix = ledger.observations.filter((point) => point.month <= PREVIOUS_MONTH);
  assert(
    sha256(JSON.stringify(prefix)) === EXPECTED_PREFIX_SHA256[id],
    `${id}: a pre-2026-09 observation changed`,
  );

  const september = ledger.observations.find((point) => point.month === TARGET_MONTH);
  let independentlyCalculated;
  if (["vt", "vti", "vym"].includes(id)) {
    const monthly = JSON.parse(rawText).monthly;
    const rawPoint = Object.entries(monthly).find(([date]) => monthKey(date) === TARGET_MONTH)?.[1];
    assert(rawPoint, `${id}: missing official September observation`);
    const usdReturn = Number(rawPoint.annualizedReturns["1MTH"]) / 100;
    independentlyCalculated = (1 + usdReturn) * (fxByMonth[TARGET_MONTH] / fxByMonth[PREVIOUS_MONTH]) - 1;
    assert(closeEnough(september.usdNavTotalReturn, usdReturn), `${id}: USD NAV TR mismatch`);
  } else if (["eem", "inda"].includes(id)) {
    const raw = JSON.parse(rawText).performanceData;
    const levels = raw.asOfDate.map((date, index) => ({ month: monthKey(date), value: Number(raw.value[index]) }));
    const previous = levels.find((point) => point.month === PREVIOUS_MONTH);
    const current = levels.find((point) => point.month === TARGET_MONTH);
    assert(previous && current, `${id}: missing official NAV level for August/September`);
    const usdReturn = current.value / previous.value - 1;
    independentlyCalculated = (1 + usdReturn) * (fxByMonth[TARGET_MONTH] / fxByMonth[PREVIOUS_MONTH]) - 1;
    assert(closeEnough(september.usdNavTotalReturn, usdReturn), `${id}: USD NAV TR mismatch`);
  } else {
    const monthEnds = parseDomesticMonthEnds(rawText, id);
    const previous = monthEnds.find((point) => point.month === PREVIOUS_MONTH);
    const current = monthEnds.find((point) => point.month === TARGET_MONTH);
    assert(previous && current, `${id}: missing official reinvested NAV for August/September`);
    independentlyCalculated = current.value / previous.value - 1;
    assert(september.monthEndDate === current.date, `${id}: month-end date mismatch`);
    assert(september.monthEndReinvestedNav === current.value, `${id}: reinvested NAV mismatch`);
  }

  assert(
    closeEnough(september.monthlyReturn, independentlyCalculated),
    `${id}: independently calculated September return mismatch`,
  );
  console.log(
    `PASS ${id.padEnd(10)} ${TARGET_MONTH} ${(september.monthlyReturn * 100).toFixed(6)}% raw=${meta.rawSha256}`,
  );
}

console.log("PASS: September 2026 raw hashes, prior-period immutability, and independent returns verified for all 9 A-quality series.");
