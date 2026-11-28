# 積立タイムマシン: Cloudflare隔離配信と切り戻し

この手順は本番ドメインとVercel本番を変更しない隔離検証用。`next build` や OpenNext の生成成功だけでは Cloudflare Workers Free で実行可能とは判定しない。

## 前提と配信

- `npm ci && npx opennextjs-cloudflare build` で `.open-next/worker.js` と `.open-next/assets` を生成する。`wrangler.jsonc` はこれらを参照する。
- 既存Cloudflareアカウントの正規権限を確認し、隔離用の別Worker名・`workers.dev` URLで実配信する。既存本番のDNS、Git連携、広告設定を変更しない。新規アカウント登録が必要な場合はOWNER承認後に進める。
- 配信時はデプロイ対象のコミットSHAとWorker名を記録する。同名の本番Workerを上書きしない。必要な環境変数は名称だけ照合し、値や認証情報を報告書・Gitに含めない。

## 実配信の合否

1. 隔離URLの `/`, `/compare/orukan-vs-nasdaq100`, `/compare/orukan-vs-sp500`, `/fund/orukan`, `/simulate/orcan/2024`, `/api/og?fund=orcan&year=2024&amount=30000`, `/sitemap.xml`, `/robots.txt`, `/ads.txt`, 存在しないURLをHTTP応答と本文・Content-Typeで確認する。OGはPNGなど画像として読めること、動的経路は結果が表示されること。主要比較の自己canonicalとJSON-LD、GA4測定ID・Search Console認証の出力を既存本番と比較する。
2. 375/390/430pxの実ブラウザで比較表・積立結果・横溢れ・console errorを確認する。結果・画像・イベントの表示とGA4 DebugViewでの受信を区別する。プレビューのデータを本番KPIに混ぜない。
3. Cloudflare Workersの **CPU time** を管理画面 Analytics / Metrics と `wrangler tail` の実行結果で `/api/og`、動的SSR、静的ファイルに分けて確認する。CPU timeはHTTP待ち時間ではない。OGは複数パラメータと初回/再訪で測り、各リクエストがFreeの10msを超えたり1102を返すなら無料商用移行を停止する。平均値だけで合格にしない。
4. 7日程度の隔離検証でリクエスト数、エラー、CPU、ページ速度を確認し、現在のPVと10万PV/月を含む容量見積もりを作る。Workers Freeはアカウント共通10万リクエスト/日、CPU 10ms/リクエスト。静的Pages枠とWorker経由のSSR/OGは区別する。

## 本番切替前の保存と承認

Vercel本番のデプロイID、DNSのA/AAAA/CNAME、MX、TXT（SPF/DKIM/DMARC・所有権認証）、CAA、DNSSEC、SSL証明書とリダイレクトを記録する。公開URL、サイトマップ、canonical、構造化データ、Search Console所有権、GA4、ads.txtを一覧で照合する。メールレコードやDNSSECを含むDNS変更・本番公開はOWNER承認後のみ。Search Consoleの登録申請は公開後に正規のURL検査とサイトマップ送信で対応し、申請と登録完了を分けて記録する。

## ロールバック

切替後に多数の404、画像欠落、canonical相違、SSR/OG失敗、CPU上限超過、メール障害を確認したら、事前保存したDNSを基に旧Vercel向け設定へ戻す。旧Vercelプロジェクト・デプロイを削除しない。DNSのTTLと証明書の状態を追跡し、正常な旧環境で主要URL・GA4・メール関連レコードを再確認する。修正のために蓄積データや公開URLを削除しない。

公式資料: [Workersの制限](https://developers.cloudflare.com/workers/platform/limits/)、[Workersのメトリクス](https://developers.cloudflare.com/workers/observability/metrics-and-analytics/)、[リアルタイムログ](https://developers.cloudflare.com/workers/observability/logs/real-time-logs/)、[Pagesの制限](https://developers.cloudflare.com/pages/platform/limits/)。
