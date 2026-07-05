import sharp from "sharp";
import path from "path";

const src = path.join(
  "C:\\Users\\daich\\Downloads",
  "ChatGPT Image 2026年6月25日 16_16_47.png"
);

async function main() {
  const meta = await sharp(src).metadata();
  console.log("size:", meta.width, meta.height, "channels:", meta.channels, "alpha:", meta.hasAlpha);

  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // サンプル: 円の内側（左端中央あたり）の色を背景色として採用
  const sampleX = 5, sampleY = Math.floor(h / 2);
  const idx = (sampleY * w + sampleX) * 4;
  const bg = { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
  console.log("sampled circle color at", sampleX, sampleY, "=", bg);

  // 円の半径よりわずかに小さいマスクにして、境界のアンチエイリアス（白フリンジ）を除去する
  const r = w / 2 - 10;
  const maskSvg = `<svg width="${w}" height="${h}"><circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="#fff"/></svg>`;

  const circleOnly = await sharp(src)
    .ensureAlpha()
    .composite([{ input: Buffer.from(maskSvg), blend: "dest-in" }])
    .png()
    .toBuffer();

  const filled = await sharp({
    create: {
      width: w,
      height: h,
      channels: 4,
      background: { r: bg.r, g: bg.g, b: bg.b, alpha: 1 },
    },
  })
    .composite([{ input: circleOnly }])
    .png()
    .toBuffer();

  await sharp(filled).resize(180, 180).toFile("app/apple-icon.png");
  await sharp(filled).resize(32, 32).toFile("app/icon.png");
  await sharp(filled).resize(192, 192).toFile("public/icon-192.png");
  await sharp(filled).resize(512, 512).toFile("public/icon-512.png");

  // favicon.ico（32x32 PNG埋め込み・RGBA必須）
  const favPng = await sharp(filled).resize(32, 32).ensureAlpha().png().toBuffer();
  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0);
  iconDir.writeUInt16LE(1, 2);
  iconDir.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(favPng.length, 8);
  entry.writeUInt32LE(6 + 16, 12);
  const ico = Buffer.concat([iconDir, entry, favPng]);
  const fs = await import("fs");
  fs.writeFileSync("app/favicon.ico", ico);

  console.log("done -> app/icon.png, app/apple-icon.png, app/favicon.ico, public/icon-192.png, public/icon-512.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
