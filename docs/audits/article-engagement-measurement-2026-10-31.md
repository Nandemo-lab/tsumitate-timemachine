# 記事回遊・シミュレーション転換の28日計測定義

計測実装日: 2026-10-31  
対象ホスト: `tsumitate-timemachine.com` のみ

## イベント定義

| イベント | 発火条件 | 送信する分類 | 送信しない情報 |
|---|---|---|---|
| `article_view` | Guide / Article のクライアント表示時に1回 | `content_type`, `content_id` | 氏名、入力値、金額、評価額、損益 |
| `article_end_reached` | 記事本文後の観測点が50%以上表示された時に1回 | `content_type`, `content_id` | スクロール率、滞在時間、理解・満足の推測 |
| `related_article_click` | 読後の厳選導線を実際に押した時 | `content_type`, `content_id`, `destination_type` | リンク文、完全URL、検索語 |
| `article_to_simulation` | 記事本文または読後CTAからホーム / Compareへ進んだ時 | `content_type`, `content_id`, `destination_type` | 商品、開始年月、月額、計算結果 |

`article_end_reached` は末尾到達の観測であり、読了・理解・満足を意味しない。ページの一般的な閲覧は既存の自動 `page_view`、入力開始以降は既存の `simulation_start` / `simulation_complete` / `compare_start` / `compare_complete` を使用する。

## 28日後のセッションファネル

GA4のイベント回数同士は割らず、同一GA4セッション内に分母と分子が存在したセッション数を数える。期間は本番反映日の翌日を1日目として連続28日。反映前、QAアクセスが混じる日、データ処理中の日は注記する。

| ファネル | 分母 | 分子 | 率 |
|---|---|---|---|
| 記事Landing → 記事末尾到達 | Guide / Articleをランディングページとするsession | 同一sessionの`article_end_reached` | 分子session ÷ 分母session |
| 記事末尾到達 → 関連記事クリック | `article_end_reached`を含むsession | その後に`related_article_click`を含む同一session | 分子session ÷ 分母session |
| 記事Landing → シミュレーション開始 | Guide / Articleをランディングページとするsession | 同一sessionの`simulation_start`または`compare_start` | 分子session ÷ 分母session |
| シミュレーション開始 → 完了 | `simulation_start`または`compare_start`を含むsession | 対応するcompleteをその後に含む同一session | 分子session ÷ 分母session |
| 関連記事遷移後の行動 | `related_article_click`を含むsession | その後の`article_view`、開始、完了、share | 各分子session ÷ 分母session |

Organic限定値はSession default channel groupが`Organic Search`のsessionだけを対象にする。期間内にイベント定義が存在しない日を0件で補完せず、28日未満なら`NOT MEASURED`とする。

## QAアクセスと重複の扱い

- Googleタグとカスタムイベントは本番ホストでだけ送信する。localhost / preview / Vercel固有URLは送信しない。
- 本番E2Eは対象URLへ`?qa=1`を付け、全イベントへGA4標準の`debug_mode: true`を付与する。氏名・端末IDなどの識別情報は追加しない。
- `article_view`と`article_end_reached`は画面インスタンスごとのガードを持つ。
- 読後導線のクリックはcapture段階で末尾到達を確定してから、`related_article_click`または`article_to_simulation`を送る。IntersectionObserverの非同期通知より先に遷移してもイベント順序を保つ。
- `page_view`はGoogleタグのブラウザ履歴変更による自動計測だけを使い、手動送信を追加しない。
- 本番QAを行った日時・対象URLは分析時に注記し、除外できない場合は自然利用の確定値と扱わない。
- GA4管理画面でDeveloper Trafficフィルタを有効化できる場合はDebug Modeのイベントを分析用データから除外する。設定を変更していない場合は、`debug_mode`付きQA実行日時を台帳に残して期間集計から差し引く。
- `content_type` / `content_id` / `destination_type`をGA4画面で分類軸に使うには、GA4管理画面でイベントスコープのカスタムディメンション登録が別途必要。未登録中もイベント件数と標準のpage path / landing pageによる分析は可能。

## 判定の限界

末尾到達、クリック、完了は行動の観測であり、記事の理解度や満足度を直接示さない。改善判断はGSCの検索意図、GA4の行動、実画面レビューを合わせて行う。

## 2026年12月1日評価

- 評価期間: 2026-11-01〜2026-11-28（28日固定）
- データ成熟: 11月28日分がGA4標準レポートで確定してから集計する
- 順序条件: GA4探索の同一session内で、表の分母イベントより後に分子イベントが発生したsessionだけを数える
- 期間開始前または実装前の欠損日は0件補完せず、条件を満たせない指標は`NOT MEASURED`とする
