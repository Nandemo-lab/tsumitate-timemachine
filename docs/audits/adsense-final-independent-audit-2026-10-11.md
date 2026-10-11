# AdSense再申請前・全98URL最終独立監査

確認日: 2026-10-11  
本番基準commit: `44b3c4d51587e89d46a84f1f6904a45268a7304e`  
対象: `https://tsumitate-timemachine.com/sitemap.xml` 掲載98 URL

## 結論

判定は **NO-GO**。HTTP、canonical、JSON-LD、内部リンク、月次台帳は正常だが、読者価値の観点では、商品Landing/Fund、Compare/Article、From、Ranking、ハブ、汎用ガイドの役割重複と助言的表現がまだ残る。本監査で安全に直せる表示はローカル修正したが、構造候補の承認と、その公開後実地確認が終わるまで再申請しない。

## 監査方法とGoogle公式基準

- 本番sitemapからURLを再取得し、98件すべてのHTMLを直接取得。HTTP、本文、canonical、内部リンク、一次情報リンク、品質・鮮度表示、類似ページを記録した。
- 主要ページは375px、390px、1280pxの実ブラウザで再確認した。
- AdSenseの「独自で価値あるコンテンツ」と、検索のhelpful content / spam policiesは別の基準として評価した。
- 参照: [AdSense コンテンツに関する最低要件](https://support.google.com/adsense/answer/81904?hl=ja)、[有用で信頼できるユーザー第一のコンテンツ](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=ja)、[Google ウェブ検索のスパムに関するポリシー](https://developers.google.com/search/docs/essentials/spam-policies?hl=ja)。

個別98URLの原票は `final-98-independent-audit-2026-10-11.csv`。自動抽出値は欠落検知用であり、最終の意味判断は本文・機能・検索意図の人手レビューを優先した。

## 本番98URLの事実

- HTTP 200: 98/98。
- 種別: tool 1、trust 2、policy 5、landing 6、fund 7、compare 15、from 6、monthly 1、guide 40、hub 4、article 6、ranking 5。
- A品質9系列は検証済み台帳で2026-08まで。SCHDはG品質のまま。
- 法務・ポリシー5件は一般記事の独自分析量ではなく、透明性・利用条件・連絡手段という固有の役割でKEEP評価。

固定基準（検索意図20、固有価値20、根拠20、役割分離15、UX15、鮮度10）による本番の分布は、A 22 / B 36 / C 17 / D 18 / E 5。これは合否そのものではなく、優先順位付けである。

## 重大問題と処遇

### P0（ローカル修正済み、未公開）

1. Ranking 5件が、過去条件の数値順位と主観的な星・初心者評価を混在させていた。表示を未丸め最終評価額によるA品質順位、対象期間、投資対象、費用へ限定。SCHDは属性だけで数値順位外。
2. SCHDを含むCompareでG品質の月次参考系列から評価額・利益・グラフを表示できた。G系列を含む場合は数値比較を生成せず、属性比較と品質差の説明だけに変更。
3. 商品Landing/Fund/銘柄図鑑の「初心者向け度」「低リスク」「おすすめ」「推奨期間」を、一次根拠のある投資対象、銘柄数、費用、設定日、品質、確認事項へ変更。
4. `/guide/nisa-beginner` の「10年以上なら損失確率が大きく下がる」「生活費3か月」「人気証券会社」等を、公式制度と個別条件を確認する中立表現へ変更。
5. オルカンの費用例を固定の10年累計額からSSOTの年率表示へ変更。
6. noindex年別ページの固定暦年リターンと助言をSSOT参照・指標区別へ変更。

### P1（承認または追加実装が必要）

- 商品Landing 6件とFund詳細（FANG+統合後の5組）は、機能入口と商品台帳という役割差はあるが、検索意図と説明がまだ近い。Fundを正式情報の中心、Landingを条件変更ツールの入口にさらに限定するか、GSC・被リンクを踏まえた統合判断が必要。
- Compare/Article 6組は、Compareを同条件数値・グラフ、Articleを商品構造・費用・読み方へ分けているが、結論・FAQの重複が残る組がある。検索流入のあるCompare（特に `/compare/orukan-vs-schd`、`/compare/orukan-vs-nasdaq100`、`/compare/vt-vs-orukan`）は保護する。
- From 6件は開始年固有の元本割れ月数等を持つが、検索意図が近い。統合型インタラクティブページ案を承認候補とし、即削除しない。
- Ranking 5件は表示を中立化したが、5 URLの独立検索意図は弱い。1つの条件選択型ランキングへ統合する候補。
- ハブは読者の疑問別案内として実用性がある一方、単独検索価値は弱いものがある。内部ナビゲーションとしてKEEPするかnoindexとするかは承認事項。
- 汎用ガイドの一部は競合にある一般説明が中心で、サイト固有の検証値との接続が弱い。独自検算を追加できないページは統合/noindex候補に分類する。

## 競合比較と独自価値

競合には複利の仮定計算、NISA制度解説、商品比較表がある。本サイト固有の強みは、公式月次商品系列を円換算し、月初積立・同一元本・商品設定前拒否・A/G品質境界を再現できる点。弱みは、その強みが全ページではなく、汎用ガイドや重複ページで薄まっている点である。

維持すべき勝ちページはトップのシミュレーター、A品質同士の主要Compare、`/orukan/monthly/30000`、検証値と一次資料が直接結びつく主要Guide、Data Sources。

## 5専門家の独立評価

1. AdSense品質: NO-GO。大量の類似URLと汎用説明が、独自ツールの価値密度を下げている。技術QA合格は審査理由を解消しない。
2. SEO・検索意図: NO-GO。A22/B36/C17/D18/E5。勝ちCompareを守り、Landing/Fund、Ranking、ハブ、汎用Guideを整理する必要がある。
3. 金融データ: NO-GO。A台帳は堅牢だが、G系列を数値比較へ使える境界違反と助言的表現があった。今回ローカル修正済み。
4. モバイルUI/UX: NO-GO。恒常的横スクロールやconsole errorはないが、Data Sourcesの極小文字・小さいタップ領域、From表のスクロール発見性、長ページの情報階層に問題があった。文字・リンク・表の手掛かりはローカル改善。
5. Web事業・読者価値: NO-GO。再訪理由は比較ツールに集中している。一般解説URLが価値を希釈しており、全index URLを独立して残す説明がまだ揃わない。

なお、別レビューで「データ終端が2025-06」「SCHDの旧表現が本番に残る」とされた指摘は、本番のData Sources（2026-08）とSCHD表示を再確認し、事実でないため採用しなかった。

## モバイル実測

- 375px/390pxでトップ、Ranking、SCHD Compare、Data Sources、From 2020、Fund、NISA Guide、SCHD Landingを確認。
- 全対象で `body.scrollWidth == documentElement.clientWidth`。恒常的なページ横スクロールなし。
- console error/warning 0。
- `/from/2020` の幅460px表には「横にスクロール」案内を追加。
- Data Sourcesの本文最小文字を12pxへ、外部リンクの最小高さを44pxへ変更。
- トップは小さい補助要素と44px未満のリンクが多数残るため、別途タップ領域の優先順位付き改善候補。

## GSCとFANG+

同日までの読み取り専用確認では、旧 `/fang` はGoogle上で認識済み、新 `/fund/fangplus` はsitemapから検出されたが「検出 - インデックス未登録」で、まだクロール未確認だった。Googleの301処理待ちであり、追加のインデックス登録要求やsitemap送信は行っていない。

## QA結果（ローカル修正後）

- lint: PASS、0 errors / 0 warnings。
- TypeScript: PASS。
- Next.js 16.3.5 build: PASS、230 pages。
- 通常QA: 130 pages、100/100、ERROR 0、WARNING 0、INFO 178。
- live QA: 130 pages、100/100、ERROR 0、WARNING 0。SEO / Metadata / JSON-LD / Internal Links / Canonical / OGPすべてPASS。
- zero-page audit: PASS（0ページを成功扱いしない）。
- system-check: 26件OK、WATCH 0、REWRITE 0。
- verified ledger: A品質9系列PASS、duplicate/missing/invalid/look-ahead/fallback 0。
- return series、VT、Compare、content trust、OGP comparison: PASS。

## 再申請前の残件

公開を妨げるもの:

1. 今回のP0ローカル修正が未公開で、本番実物では未確認。
2. Ranking 5件と商品Landing/Fundの独立URL価値について構造方針の承認が未了。
3. C/D評価の汎用Guide・ハブに、独自検証へ接続できないページが残る。

別途対応候補:

- 44px未満のタップ領域を、主要CTAから段階的に改善。
- Compare/Article FAQの残余重複をペア単位で整理。
- FANG+新URLのGoogleクロール・canonical選択を処理待ち後に再確認。

## 最終判定

**NO-GO**。重大な安全修正はローカルで実装・検証したが、本番未反映であり、独立価値を説明できないindex候補が残る。構造変更は承認なしで実施していない。AdSense再申請、push、deploy、Search Console書き込みは行っていない。
