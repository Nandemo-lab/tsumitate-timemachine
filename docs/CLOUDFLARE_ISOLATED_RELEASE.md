# 積立タイムマシン: Cloudflare隔離配信と切り戻し

## 最新判定（2026-11-28）

旧「Workers Free はNO-GO」の記録は修正前の動的SSR構成。現在の隔離WorkerはOpenNextサーバーを読み込まず、235公開経路（旧234経路と `/share`）のHTML/RSC、OG PNG、robots、sitemapを静的アセットで配信する。`/api/og` の既知/未知画像は事前生成PNG、未知URLは軽量404。再配信バージョン `d160deea-6ba7-4741-b4ff-52dec6792ce4` でrobots、sitemap、共有ページ、OGが200、未知URLが404。Wrangler tail実測はOGと404でCPU各0ms、静的公開ページはWorker実行ログに現れずStatic Assetsから配信された。個別リクエストの無料枠10msは通過したが、長期のリクエスト数・エラー率と本番ドメインでの安定性は未測定。本番公開・DNS変更は未実施。

`STATIC_TARGET=production OG_PUBLIC_ORIGIN=https://tsumitate-timemachine.com node scripts/prepare-cloudflare-static-preview.mjs` で本番用235経路と公式robots/sitemapを別途生成し、プレビューnoindexヘッダーがあれば失敗させる。本番Wrangler設定は同じ軽量Workerを `PREVIEW_MODE=false` で使う。ローカルの本番配信物で `wrangler deploy --config wrangler.jsonc --dry-run` 成功（718 assets、実配信なし）。切替時は**クリーンビルド→OG事前生成→本番用静的パッケージ生成→dry-run→OWNER承認範囲内の配信**の順。プレビュー配信物を本番に使わない。

CIでは変更した詳細・共有ページを375/390/430pxで実画面確認し、横溢れ・画像欠落・サイト起因Console Errorは0。共有URLの月額1/3/5/10万円、2銘柄比較、異常額の追加行列検証は最新CIで確認する。共有画面5万円の元本165万円、評価額221万円と33回は実ブラウザで確認済み。GA4はプレビューから送信しない。AdSense審査中の本番は維持し、本番移行は独立した承認対象。

## 2026-11-28 共有ページの静的配信検証

既存の234経路に `/share` を追加し、235経路のHTML/RSCをStatic Assetsから配信した。共有URLのクエリはブラウザで既存パーサーを使って検証し、既存の `simulate` で再計算する。任意の積立額を3万円と誤表示しないよう、共通OG説明は金額・収益を含めず、共有画面で条件を確認する表現とした。OG画像は事前生成済みの共通PNG。プレビューでは235経路すべてHTTP 200かつ `X-Robots-Tag: noindex`、未知経路と非公開管理画面は軽量404、既知・未知OGは静的PNG。ブラウザで5万円・2024年1月〜2026年9月の共有結果を確認し、元本165万円、期間末221万円、33回の結果と共通OG説明が一致した。ブラウザ拡張由来のConsole Errorはサイト起因と区別する。

隔離WorkerからOpenNextサーバーのimportを取り除き、動的なSSR/API/404を実行しない構成にした。静的配信によるFree枠の成立性は、Cloudflareの実CPUログ・コールドアクセス・反復アクセスおよび変更ページの375/390/430px CI実画面を確認してから最終判定する。本番Vercelは未変更。

## 2026-11-28 実配信の判定: Workers Free は NO-GO

公式Wrangler OAuthで既存アカウントへ認証し、`wrangler deploy --config wrangler.isolated.jsonc` で別名Worker `tsumitate-isolated-preview` に配信した。既存ドメインとVercel本番は未変更。プレビュー専用のWorkerラッパーと静的アセットの `_headers` で `noindex, nofollow` を設定し、robots.txtは `Disallow: /` とした。GA4は既存コードの本番ドメイン限定条件によりプレビューから送信しない。再ビルド後は `printf '/*\n  X-Robots-Tag: noindex, nofollow\n' > .open-next/assets/_headers` を実行してから隔離配信する（`.open-next` はGit管理外）。

実環境で `/`、主な比較ページ、積立ページ、`robots.txt`、`ads.txt` は200を確認した一方、OG画像APIと404経路は **HTTP 503 / Cloudflare Error 1102** を再現した。11月28日のWrangler tailでは、初回の比較ページCPU 48〜70ms、トップ59ms、積立ページ51ms、OG画像APIの失敗例58msと10ms、存在しないURLの失敗例10msで `outcome: exceededCpu`。成功した50ms台の応答もFree枠で安定稼働する証拠ではない。HTTP待ち時間やデプロイ時の起動時間はCPU時間として扱わない。

11月28日に `node scripts/prepare-cloudflare-static-preview.mjs` を隔離配信のビルド後へ追加し、Next.jsのprerender manifestから134経路のHTML/RSCペアをStatic Assetsへコピーした。別名Worker `tsumitate-isolated-preview` を再配信（version `958d619f-43bd-47c6-bd9d-c78535cf9eea`）。主要比較、トップ、積立ページはStatic AssetsからHTTP 200とnoindexを返し、tailではこれらのWorker実行が見えなくなった。OG画像は再検証でも1269ms CPU、未知URLは163ms CPUで、初回/再訪に1102が起こり得る。**静的ページの障害だけ部分解消。OG・404を含む現在の構成の本番移行はNO-GO**。広告開始とDNS変更は行わない。

次の候補は、OGの事前生成・必要な動的経路の静的化によって10ms制限下で全主要機能が動くかを隔離検証すること。機能と更新工数が増える場合は無料商用の別ホストも比較する。いずれも実配信、OG、404、比較、シミュレーションを通過するまで本番移行を承認対象にしない。

### 11月28日 OG画像の事前生成と再配信

`scripts/precompute-cloudflare-og.mjs` は同じNextビルドをローカルサーバーで起動した状態で `OG_SOURCE_ORIGIN=http://127.0.0.1:PORT` を指定して実行する。134件の静的ページのメタデータから50種類のクエリを収集し、元のOG生成コードを使ってPNGをビルド時に生成する。画像・投資計算は改変しない。次に `OG_PUBLIC_ORIGIN=https://tsumitate-isolated-preview.nandemomail24.workers.dev node scripts/prepare-cloudflare-static-preview.mjs` を実行し、静的ページのHTML/RSCのOG参照を隔離配信上のPNGへ置換する。本番用の配信物を作る際は `OG_PUBLIC_ORIGIN` に本番オリジンを指定して再生成する。ビルドのたびに両スクリプトを再実行する。

プレビューWorkerの `/api/og` は、既知のクエリを対応する静的PNG、未知のクエリを共通PNGとして配信する。隔離実配信では既知・未知のOG APIがともにHTTP 200のPNGで、Wrangler tailのCPUは9回中0〜1msだった。静的134経路は全件HTTP 200かつ `noindex`。一方、`/simulate/orcan/2024` はHTTP 200でもCPU 284〜293ms、存在しないURLは55〜82msだった。10msのFree枠では安定性を証明できないため、**積立タイムマシン全体の本番移行は引き続きNO-GO**。動的計算の静的化・キャッシュか、無料商用の別ホストが必要。旧本番は未変更。

この手順は本番ドメインとVercel本番を変更しない隔離検証用。`next build` や OpenNext の生成成功だけでは Cloudflare Workers Free で実行可能とは判定しない。

### 11月28日 詳細シミュレーションの静的化

`/simulate/[fund]/[year]` の100経路をビルド時に既定の月額3万円で事前生成し、`?amount=` はブラウザで既存の `simulate` と同じ検証済み月次系列から再計算する。元本、最終評価額、利益などの計算関数は変更していない。OG画像も100種類を事前生成した。プレビュー用スクリプトは合計234経路のHTML/RSCをStatic Assetsに置き、未知の公開URLをWorkerで軽い404にする。OG URL置換で埋め込みRSCのエスケープを損なった初回版は、実画面で発見して修正し、再配信した。

隔離Worker version `539fd5f1-b714-4e91-be38-ab373fa8da6a` では100詳細経路すべてHTTP 200/noindex。既定額と任意額の5ケースで現行本番の数値と既存計算関数を照合して一致した。ブラウザ実画面ではオルカン2024年の月額5万円が元本165万円、評価額221万円、利益56万円と表示された。未知URLの再訪時CPUは0ms。静的詳細ページへのWorker起動はtailで観測されなかった。

**全サイトの本番移行はまだNO-GO。** `/share` は個別条件のSSRと共有メタデータを維持しておりCPU実測197〜234msでFree上限10msを超える。`/admin/seo` も未検証の動的経路。任意額の詳細ページは画面上の数値は更新するが、静的HTMLとOGメタデータは既定の3万円のままなので共有カードの数値が一致しない。今回変更したページの375/390/430px実画面と低性能端末でのフリーズ・転送量は未確認。これらを解消してから再度全経路、コールドアクセス、CPUを実測する。無料枠を超える有料プラン変更や現行本番への反映はしない。

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

## 2026-11-28 最終差分とデータ更新ゲート

隔離再配信 version `7bb2888a-08d3-4f6f-8f95-78cf77bd0192`。本番用配信物を隔離Workerへ誤投入した際、asset-first配信により `robots.txt` が `Allow: /` になった。隔離設定だけ `run_worker_first: true` にし、隔離パッケージ生成時に必ず `_headers` noindex と `Disallow: /` を書き込むよう修正した。再配信後のブラウザで `robots.txt` は拒否、`sitemap.xml`、`ads.txt` は配信。静的ファイルの許可リストをWorkerに追加し、本番用設定は asset-first のままとする。共有URLの月5万円・2024年1月〜2026年9月は元本165万円、評価額221万円、33回を実画面で再現。該当実行の tail CPUは0ms。隔離環境を本番用SEO設定のまま再配信しない。

月次検証 `.github/workflows/verified-data-freshness.yml` は毎月1日、9系列の原典スナップショットSHA・欠損・重複とデータ年月の鮮度を検査する。更新が2か月以上遅れたら失敗し、GitHub Actionsに異常を残す。これは既存の事業KPI定期タスクとは別のデータ完全性監視。原典取得・台帳再生成・OG画像再生成・本番デプロイを自動実行しない。現状の生成スクリプトは終了年月、件数、取得日が2026-09/2026-10-13で固定されている。次月を扱うには出典の再利用条件とデータ形式を確認し、原典ハッシュと計算結果のレビューを経てから個別PRで更新する。失敗時は前回の正常な静的配信物を維持する。現行データの利用条件を十分確認できるまで、無人の自動更新をGOと扱わない。

Vercelのドメイン設定から現行NSはお名前.com系 `01〜04.dnsv.jp`、apexの公開A応答は `216.198.79.1`。これはDNSゾーン全レコード、メール設定、SSL、ドメイン更新費の証明ではない。Cloudflareの本番用独自ドメインと現行DNSの安全な切替・復旧値を確定するまで積立の本番移行はNO-GO。
