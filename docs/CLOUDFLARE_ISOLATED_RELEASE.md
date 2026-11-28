# 積立タイムマシン: Cloudflare隔離配信と切り戻し

## 2026-11-28 実配信の判定: Workers Free は NO-GO

公式Wrangler OAuthで既存アカウントへ認証し、`wrangler deploy --config wrangler.isolated.jsonc` で別名Worker `tsumitate-isolated-preview` に配信した。既存ドメインとVercel本番は未変更。プレビュー専用のWorkerラッパーと静的アセットの `_headers` で `noindex, nofollow` を設定し、robots.txtは `Disallow: /` とした。GA4は既存コードの本番ドメイン限定条件によりプレビューから送信しない。再ビルド後は `printf '/*\n  X-Robots-Tag: noindex, nofollow\n' > .open-next/assets/_headers` を実行してから隔離配信する（`.open-next` はGit管理外）。

実環境で `/`、主な比較ページ、積立ページ、`robots.txt`、`ads.txt` は200を確認した一方、OG画像APIと404経路は **HTTP 503 / Cloudflare Error 1102** を再現した。11月28日のWrangler tailでは、初回の比較ページCPU 48〜70ms、トップ59ms、積立ページ51ms、OG画像APIの失敗例58msと10ms、存在しないURLの失敗例10msで `outcome: exceededCpu`。成功した50ms台の応答もFree枠で安定稼働する証拠ではない。HTTP待ち時間やデプロイ時の起動時間はCPU時間として扱わない。

11月28日に `node scripts/prepare-cloudflare-static-preview.mjs` を隔離配信のビルド後へ追加し、Next.jsのprerender manifestから134経路のHTML/RSCペアをStatic Assetsへコピーした。別名Worker `tsumitate-isolated-preview` を再配信（version `958d619f-43bd-47c6-bd9d-c78535cf9eea`）。主要比較、トップ、積立ページはStatic AssetsからHTTP 200とnoindexを返し、tailではこれらのWorker実行が見えなくなった。OG画像は再検証でも1269ms CPU、未知URLは163ms CPUで、初回/再訪に1102が起こり得る。**静的ページの障害だけ部分解消。OG・404を含む現在の構成の本番移行はNO-GO**。広告開始とDNS変更は行わない。

次の候補は、OGの事前生成・必要な動的経路の静的化によって10ms制限下で全主要機能が動くかを隔離検証すること。機能と更新工数が増える場合は無料商用の別ホストも比較する。いずれも実配信、OG、404、比較、シミュレーションを通過するまで本番移行を承認対象にしない。

### 11月28日 OG画像の事前生成と再配信

`scripts/precompute-cloudflare-og.mjs` は同じNextビルドをローカルサーバーで起動した状態で `OG_SOURCE_ORIGIN=http://127.0.0.1:PORT` を指定して実行する。134件の静的ページのメタデータから50種類のクエリを収集し、元のOG生成コードを使ってPNGをビルド時に生成する。画像・投資計算は改変しない。次に `OG_PUBLIC_ORIGIN=https://tsumitate-isolated-preview.nandemomail24.workers.dev node scripts/prepare-cloudflare-static-preview.mjs` を実行し、静的ページのHTML/RSCのOG参照を隔離配信上のPNGへ置換する。本番用の配信物を作る際は `OG_PUBLIC_ORIGIN` に本番オリジンを指定して再生成する。ビルドのたびに両スクリプトを再実行する。

プレビューWorkerの `/api/og` は、既知のクエリを対応する静的PNG、未知のクエリを共通PNGとして配信する。隔離実配信では既知・未知のOG APIがともにHTTP 200のPNGで、Wrangler tailのCPUは9回中0〜1msだった。静的134経路は全件HTTP 200かつ `noindex`。一方、`/simulate/orcan/2024` はHTTP 200でもCPU 284〜293ms、存在しないURLは55〜82msだった。10msのFree枠では安定性を証明できないため、**積立タイムマシン全体の本番移行は引き続きNO-GO**。動的計算の静的化・キャッシュか、無料商用の別ホストが必要。旧本番は未変更。

この手順は本番ドメインとVercel本番を変更しない隔離検証用。`next build` や OpenNext の生成成功だけでは Cloudflare Workers Free で実行可能とは判定しない。

## 前提と配信

- `npm ci && npx opennextjs-cloudflare build` で `.open-next/worker.js` と `.open-next/assets` を生成する。隔離ビルドでは `_headers` を設置後に `node scripts/prepare-cloudflare-static-preview.mjs` を実行し、prerendered HTML/RSCを静的配信する。`wrangler.isolated.jsonc` はこれらを参照する。本番用 `wrangler.jsonc` とプレビュー専用noindexは混同しない。
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
