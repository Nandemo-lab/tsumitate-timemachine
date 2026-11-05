# Cloudflare移行監査（2026-11-05）

## 結論

Cloudflare Workers + OpenNext でビルド・ローカル実行・全98 URLの同等性確認までは成功した。
ただし Workers Free の実ネットワークでは、通常ページと動的OG画像で `1102`（CPU上限超過）が断続的に発生した。
Workers Free のHTTPリクエスト当たりCPU上限は10 msであり、現行Next.jsアプリを安定配信できないためDNS切替は行わない。

## 採用候補構成

- Next.js 16.4.5
- `@opennextjs/cloudflare` 1.20.16
- Wrangler 4.157.0
- Cloudflare Workers Static Assets
- App Router、動的OG、共有ページ、既存Proxyを維持

## 検証結果

- Next.js production build: PASS
- OpenNext build: PASS（Windowsではwebpack buildを使用）
- Worker startup time: 25 ms
- bundle upload: 12,116.18 KiB（gzip 2,705.50 KiB）
- static assets: 255 files
- ローカルWorkerの本番sitemap 98 URL比較: PASS
  - HTTP status
  - title
  - canonical
  - JSON-LD
- 動的OG・比較OG・SCHD G品質拒否: ローカルPASS
- live QA: 129 pages、ERROR 0、WARNING 0、100/100
- breadcrumb: 86 pages / 162 links PASS
- Verified Ledger: A品質9系列 PASS
- Return Series / G-quality boundary / Simulation Insights / Content Trust: PASS
- 375 / 390 / 430 / 768 / 1280 px: 主要ページの横スクロール・画像欠落なし
- preview URL: `X-Robots-Tag: noindex, nofollow` を確認
- Workers Free実網: 通常ページ・OGで断続的にHTTP 503 / error 1102（NO-GO）

## DNS baseline

- authoritative nameservers: `01.dnsv.jp` / `02.dnsv.jp` / `03.dnsv.jp` / `04.dnsv.jp`
- apex A: `216.198.79.1`
- `www` CNAME: `cname.vercel-dns.com`
- Search Console TXT: `google-site-verification=JDT2JPKelOJazBw5sWvFRkXVyjeVc-ZsSm8WI6j6wR0`
- MX: 公開DNS応答では未検出

DNSは変更していない。

## Rollback

今回DNSを切り替えていないため、現行Vercel Productionがそのまま稼働中である。
将来Cloudflareへ切り替える場合も、Vercel Projectと現在のDNS値を保持し、障害時は上記A/CNAMEへ戻す。

## 再開条件

次のいずれかを満たした場合に限り、本番移行を再検討する。

1. Workers Paidを本人が別途承認し、CPU上限30秒で同じ全面QAを再実施する。
2. 動的OG・共有・SEOを変えずに10 ms未満へ収める公式かつ保守可能な構成が確認できる。
3. 現行機能を維持できる別の商用利用可能な低コストhostingを選定する。

## 公式資料

- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- OpenNext Cloudflare: https://opennext.js.org/cloudflare
