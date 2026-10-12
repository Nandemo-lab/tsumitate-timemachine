# 積立タイムマシン3.0 デザイン刷新記録

確認日: 2026-10-12  
対象ブランチ: `codex/timemachine-3-design`  
基準commit: `8cbc67ad17a3693c629bdb11bb6ff396bfce0c6a`

## 目的

黒背景で情報密度の高かった画面を、過去実績シミュレーションを迷わず試せる白ベースのサービスへ再構成する。金融データ、計算、URL、metadata、canonical、index方針は変更しない。

## デザインシステム

- 背景: `#FAFAF7`
- Surface: `#FFFFFF`
- Primary surface: `#DCEFFA`
- Mint surface: `#CDEFE2`
- Coral surface: `#FFDFCB`
- 本文: `#263A53`
- 操作色: `#236B8E`（白文字とのコントラストを確保）
- 最小主要タップ高: 44px
- 共通フォーカスリング、selection、scrollbar、reduced-motionを定義

## 変更前の主要課題

- 黒背景と多数のカードが、主行動よりダッシュボード感を強めていた。
- ホームにランキング・商品・記事・ガイドが同時に並び、初訪問者の選択負荷が高かった。
- 結果画面で詳細分析が主要数値より目立ちやすかった。
- 長文・Data Sources・Footerの情報量がスマホで連続表示されていた。
- 小さい補助文字、フォーカス表示、グラフのテキスト代替に改善余地があった。

## 実装結果

- ホームはキャッチコピー、3入力、主CTA、結果プレビュー、人気比較3件、信頼性説明へ短縮。
- 結果は元本・期間末評価額・損益・月次グラフを先に表示。元本割れ分析と計算詳細は展開式へ移動。
- 比較は同条件、差額、2商品の評価額、グラフを先に表示。商品属性と費用は展開式へ移動。
- Ranking / From / Fund / Guide / Article / Share / 法務ページを共通の明るい配色へ統一。
- Data Sourcesは銘柄別詳細を折りたたみ、一次情報・期間・品質区分を保持。
- モバイルFooterは目的別の展開式、デスクトップではリンク一覧として表示。
- Bottom navigationは「試す・比較する・商品を知る・ホーム」に整理。
- 比較グラフと単一結果グラフに読めるテキスト要約を追加。

## 独立UI/UXレビュー

別実行コンテキストで、情報密度、レスポンシブ幅、文字サイズ、フォーカス、結果通知、グラフ代替、reduced motion、Footerを反証レビューした。指摘に基づき、共通トークン、結果優先順位、44px操作領域、全体フォーカス、`aria-live`、グラフ要約、Footer折りたたみを反映した。

## 実画面QA

- 対象幅: 375 / 390 / 768 / 1280px
- 対象: Home、Simulation、Compare、Fund、Ranking、From、Guide、Article、Data Sources
- 全対象で恒常的な横スクロールなし
- 黒背景の残存なし
- Homeの主要ボタン高56px、主要テンプレートのボタン最小44px
- Simulation / CompareのRecharts SVG生成を確認
- ブラウザconsole error / warning 0

## 回帰QA

- lint: PASS
- TypeScript: PASS
- production build: PASS（Next.js 16.3.8、218 static pages）
- QA: 127 pages、ERROR 0、WARNING 0、SCORE 100/100
- live QA: 127 pages、ERROR 0、WARNING 0、SCORE 100/100
- Verified Ledger: 9 A系列 PASS
- Return Series: A=9 / SCHD=G PASS
- G-quality boundary: PASS
- Simulation Insights: PASS
- Content Trust: PASS
- OGP Comparison: PASS
- zero-page audit: PASS

## 保護したもの

- `lib/funds.ts`、月次データ、台帳、計算式は未変更
- URL、title、H1、canonical、index/noindex、sitemapは未変更
- AdSenseコード、Publisher ID、ads.txtは未変更
- push / deployは未実施

## 公開判断

ローカルの機能・品質ゲートは公開候補として合格。全面的な見た目変更のため、本番公開は実画面の最終デザイン承認後に行う。
