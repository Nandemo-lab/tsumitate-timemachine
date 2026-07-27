#!/usr/bin/env node
/**
 * X（旧Twitter）投稿文の文字数を、Xの加重カウント方式で検証するスクリプト。
 *
 * 使い方:
 *   node scripts/x-post-length.mjs path/to/post.txt
 *   cat post.txt | node scripts/x-post-length.mjs
 *
 * ルール:
 *   - URLはt.coによる短縮を考慮し、1つにつき23文字として計算する
 *   - 半角文字（ASCII等、コードポイント0x10FF以下）は1文字としてカウント
 *   - 全角文字（日本語・絵文字等、コードポイント0x1100以上）は2文字としてカウント
 *   - 上限は280文字
 *
 * X投稿文を提出する前は、必ずこのスクリプトで加重文字数を確認すること。
 * 目視・暗算での文字数申告は禁止（過去に何度も誤りが発生したため）。
 */
import fs from "fs";

function weightedLen(str) {
  const urlRegex = /https?:\/\/\S+/g;
  const urls = [];
  const stripped = str.replace(urlRegex, (m) => {
    urls.push(m);
    return "";
  });
  let len = urls.length * 23;
  for (const ch of stripped) {
    const code = ch.codePointAt(0);
    len += code <= 0x10ff ? 1 : 2;
  }
  return len;
}

function main() {
  const filePath = process.argv[2];
  const text = filePath ? fs.readFileSync(filePath, "utf-8") : fs.readFileSync(0, "utf-8");
  const trimmed = text.replace(/\n$/, "");
  const len = weightedLen(trimmed);
  const LIMIT = 280;

  console.log("━━━━━━━━━━━━━━━");
  console.log("X POST LENGTH CHECK");
  console.log("");
  console.log(`加重文字数: ${len} / ${LIMIT}`);
  console.log(`raw文字数（参考、判定には使わない）: ${trimmed.length}`);
  console.log("");
  if (len > LIMIT) {
    console.log(`✗ NG: 上限を${len - LIMIT}文字超過しています。短縮してください。`);
    process.exitCode = 1;
  } else {
    console.log(`✓ OK: 上限まで${LIMIT - len}文字の余裕があります。`);
  }
  console.log("━━━━━━━━━━━━━━━");
}

main();
