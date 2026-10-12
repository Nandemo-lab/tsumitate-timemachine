# AdSense独立レッドチーム監査ブロッカー

更新日: 2026-10-11

## 公開前ブロッカー

ローカルrelease candidateではなし。公開後のGitHub Actions、Vercel Source SHA、本番96 URLと直接URLの再検証を完了条件とする。

## 構造変更の承認候補

- Landing/Fund 5組は、Landingを条件変更、Fundを正式商品・費用・出典として役割分離している。本文類似度は高いが、Query×Page完全原票なしに統合しない。
- Compare/Article 6組は、Compareを同条件数値比較、Articleを商品構造と読み方として維持。完全なQuery×Pageが取得できた時点で検索意図競合を再評価する。

## 再申請を止めない既知事項

- 開発依存を含む `npm audit` は20件（critical 1/high 14/moderate 4/low 1）。本番依存は0件。主に実行時に含まれないshadcn CLI/MCP、lint/glob経路であり、無差別なoverrideやmajor downgradeは行わない。
- 一部Fund・Articleはページ内の直接一次リンクがなく、中央のData Sourcesへ案内している。YMYL上の発見性強化候補。
- sitemapの `lastmod` は実更新日を正確に管理できるまで省略する。

## 外部・本人判断待ち

- Search Console Query×Page完全原票と第三者被リンクの更新確認。
- URL削除・ページ統合、redirect、canonical、index/noindex変更。
- AdSense再申請

## 積立タイムマシン2.0（2026-10-12）

- ローカルrelease candidate `e1b1fd8` は全QAと4幅の実画面確認を完了。大規模な見せ方変更のため、本番公開はユーザー承認待ち。
- GA4の離脱率・再訪率・計算完了率は権限内で取得できていない。現時点のロードマップでは推測値を実測値として扱わない。
- Search ConsoleエクスポートはQuery表とPage表が別であり、完全なQuery×Page結合原票ではない。勝ちCompare URLを保護し、構造変更は行わない。
