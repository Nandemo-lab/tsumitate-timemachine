# AdSense 低価値リスクの根本改善記録（2026-11-09）

## 判断の前提

- Google Publisher Policies、AdSense のサイト準備ガイド、Google Search の people-first content ガイドを一次資料として確認した。
- Google が非公開にしている審査アルゴリズムや合格点は推測していない。
- 既存の URL 別価値台帳、構造統合監査、金融データ監査を再利用し、同じ全件採点は繰り返していない。
- 現行ビルドの公開対象は 132 ページ。URL の削除、統合、noindex、canonical 変更は、GSC・被リンクの十分な証拠がないため実施していない。

## 今回確認した構造的な弱点

1. 商品 Landing の関連記事で、商品ごとに異なる開始条件のリターン率を横並びにしており、同条件比較に見える余地があった。
2. Landing と `/fund/*` が同じ積立結果を重複表示し、ページを分ける理由が読者に伝わりにくかった。
3. 商品説明に「初心者」「ほったらかし」「回復」「世界最低」など、検証済み月次データだけでは裏付けられない一般化・助言的表現が残っていた。
4. Landing に商品固有の「このデータで分かること・固有リスク・分からないこと」が不足していた。
5. Ranking の証拠境界（同条件、過去実績、SCHD G品質除外）が、共通表示内で弱くなっていた。

## 実施した改善

- 6商品 Landing に固有の evidence reading を追加した。
  - このページの検証値が答える疑問
  - 商品固有のリスク
  - 数値からは判断できない限界
- 関連商品カードから比較不能なリターン率を除去し、同条件比較は Compare で行うことを明示した。
- Landing がある商品では `/fund/*` の積立結果重複を外し、Fund を公式属性・費用・設定日・一次資料、Landing を条件変更と検証済み結果に役割分離した。
- 商品説明を SSOT（`lib/funds.ts`）参照へ寄せ、助言的・宣伝的・根拠の弱い表現を中立化した。
- Ranking に、同一元本・同一回数・同一積立額、過去結果であり将来予測や推奨ではないこと、VYM A品質と SCHD G品質の境界を明示した。
- 回帰防止の Content Trust 監査へ上記要件を追加した。

## URL処遇

- **A 維持・強化**: Home、Simulation、Compare、Data Sources、Articles/Guide、法務・運営ページ。
- **B 根本改善**: `/orukan`、`/sp500`、`/nasdaq100`、`/vti`、`/vt`、`/schd`、対応する `/fund/*`、Ranking 共通表示。
- **C 統合候補 / D noindex候補 / E 削除候補**: 今回は実行なし。固定年・固定月額・From・Ranking 派生は検索実績と被リンクを確認できるまで候補として保留する。

## 検証結果

- Build（Next.js 16.3.8、webpack）: PASS、223 static pages。
- Lint / TypeScript: PASS。
- QA live: 132 pages、ERROR 0、WARNING 0、QA SCORE 100。
- Breadcrumb: 89 pages / 168 links、全件到達。
- Verified Ledger: A品質9系列 PASS。
- Return Series / Simulation Insights / G-quality boundary / Content Trust / system-check: PASS。
- SCHD は G品質のまま。未検証の積立結果・ランキングを追加していない。
- URL、canonical、index方針、sitemap、AdSenseコード、ads.txt、GA4イベントは変更していない。

## 残るリスク

- Google の承認は保証できない。
- 固定年・固定月額・From・Ranking 派生の統合判断には、無料の GSC Query × Page と被リンクの実測が必要。
- Work のローカルブラウザ利用が無効だったため、この作業環境では新規スクリーンショットによる375/390/768/1280の視覚検収を実施できなかった。今回はレイアウトCSSを変更せず、レンダリングHTMLとライブHTTPを検証した。

