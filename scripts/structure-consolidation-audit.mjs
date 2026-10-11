import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const proxy = read("proxy.ts");
const sitemap = read("app/sitemap.ts");
const rankingData = read("lib/ranking-pages.ts");
const schd = read(".next/server/app/fund/schd.html");
const ranking = read(".next/server/app/ranking.html");
const nisa = read(".next/server/app/ranking/nisa.html");
const highDividend = read(".next/server/app/ranking/high-dividend.html");
const highReturn = read(".next/server/app/ranking/high-return.html");

assert(proxy.includes('"/schd": "/fund/schd"'), "/schd redirect missing");
assert(proxy.includes('"/ranking/beginner": "/ranking"'), "/ranking/beginner redirect missing");
assert(sitemap.includes('p.slug !== "schd"'), "/schd sitemap exclusion missing");
assert(!rankingData.includes('"beginner", "high-return"'), "beginner ranking remains in category navigation");
assert(!fs.existsSync(path.join(root, ".next/server/app/schd.html")), "/schd is still statically generated");
assert(!fs.existsSync(path.join(root, ".next/server/app/ranking/beginner.html")), "/ranking/beginner is still statically generated");

for (const forbidden of ["現在資産", "SCHDでシミュレーション開始", "もし2020年から積み立てていたら？"]) {
  assert(!schd.includes(forbidden), `/fund/schd contains unverified result: ${forbidden}`);
}
for (const required of ["参考系列のため積立評価額は掲載していません", "G品質", "原典未検証"]) {
  assert(schd.includes(required), `/fund/schd missing quality boundary: ${required}`);
}

for (const required of ["投資対象", "費用", "資金を使う時期", "許容できる値動き"]) {
  assert(ranking.includes(required), `/ranking missing beginner decision factor: ${required}`);
}
for (const required of ["つみたて投資枠／年", "非課税保有限度額", "金融庁「NISAを知る」", "制度は将来変更される可能性があります"]) {
  assert(nisa.includes(required), `/ranking/nisa missing制度情報: ${required}`);
}
for (const forbidden of ["配当品質", "★★★★★", "SCHDでシミュレーション"]) {
  assert(!highDividend.includes(forbidden), `/ranking/high-dividend contains subjective or G result: ${forbidden}`);
}
for (const required of ["VYMは2020年1月から2026年8月まで", "G品質・数値比較外", "公式に確認できる商品属性"]) {
  assert(highDividend.includes(required), `/ranking/high-dividend missing evidence boundary: ${required}`);
}
for (const required of ["過去の期間末評価額", "共通期間", "元本は", "将来予測"]) {
  assert(highReturn.includes(required), `/ranking/high-return missing comparison condition: ${required}`);
}

console.log("PASS: SCHD and beginner redirects, ranking role separation, and G-quality boundaries");
