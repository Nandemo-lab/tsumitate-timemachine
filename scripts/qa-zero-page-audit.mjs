#!/usr/bin/env node
import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync } from "child_process";

const emptyAppDir = fs.mkdtempSync(path.join(os.tmpdir(), "tsumitate-qa-empty-"));

try {
  const result = spawnSync(
    process.execPath,
    ["scripts/qa-check.mjs", "--app-dir", emptyAppDir],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (result.status === 0) {
    throw new Error("0ページのQAが成功扱いになりました");
  }
  if (!output.includes("検査対象ページが0件です")) {
    throw new Error(`想定した0ページエラーを確認できませんでした:\n${output}`);
  }
  console.log("PASS: QAは検査対象0ページをエラー終了します");
} finally {
  fs.rmSync(emptyAppDir, { recursive: true, force: true });
}
