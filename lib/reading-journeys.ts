import type { ReadingJourneyItem } from "@/components/editorial/ReadingJourney";

export const ARTICLE_READING_JOURNEYS: Record<string, ReadingJourneyItem[]> = {
  "orukan-vs-sp500": [
    { href: "/compare/orukan-vs-sp500", question: "自分の積立条件なら差はどうなる？", description: "同じ開始月・月額で、評価額の経路を比較します。", kind: "compare" },
    { href: "/guide/orukan-ippon-de-ii", question: "オルカン1本で考えるときの確認点は？", description: "分散の範囲と、1商品にまとめる意味を整理します。", kind: "question" },
    { href: "/guide/sp500-booraku-taisho", question: "S&P500が下落したときは？", description: "過去の下落と、積立中に確認したいことを分けて見ます。", kind: "risk" },
  ],
  "orukan-vs-nasdaq100": [
    { href: "/compare/orukan-vs-nasdaq100", question: "同じ条件で過去の積立経路を比べる", description: "世界分散と米国大型テック中心の値動きを比較します。", kind: "compare" },
    { href: "/guide/nisa-wariate-osusume", question: "2商品を組み合わせるときの考え方は？", description: "割合を決める前に、重複と集中度を確認します。", kind: "question" },
    { href: "/guide/index-shippai-pattern", question: "値動きの大きさで失敗しないためには？", description: "途中で続けにくくなる条件を先に整理します。", kind: "risk" },
  ],
  "sp500-vs-nasdaq100": [
    { href: "/compare/sp500-vs-nasdaq100", question: "S&P500とNASDAQ100を同条件で比べる", description: "共通期間・同じ月額で積立結果を確認します。", kind: "compare" },
    { href: "/guide/sp500-booraku-taisho", question: "下落時にどこまで動く可能性がある？", description: "過去の下落と月次データの限界を確認します。", kind: "risk" },
    { href: "/guide/nisa-tsumitate-vs-seicho", question: "NISAではどの枠を確認する？", description: "制度上の枠と商品の違いを切り分けて整理します。", kind: "question" },
  ],
  "vti-vs-orukan": [
    { href: "/compare/vti-vs-orukan", question: "米国全体と全世界を積立で比べる", description: "同じ条件の評価額と途中経路を確認します。", kind: "compare" },
    { href: "/fund/vti", question: "VTIはどんな商品？", description: "投資対象、費用、通貨、公式データ期間を確認します。", kind: "question" },
    { href: "/guide/index-investing", question: "指数に連動する商品とは？", description: "インデックス投資の仕組みを基礎から整理します。", kind: "action" },
  ],
  "schd-vs-sp500": [
    { href: "/fund/schd", question: "SCHDのデータ品質と商品属性を確認する", description: "参考系列として扱う理由と、公式情報の範囲を示します。", kind: "risk" },
    { href: "/compare/orukan-vs-schd", question: "数値を出せない比較では何を見る？", description: "未検証値を使わず、商品構造と品質区分を確認します。", kind: "compare" },
    { href: "/guide/shinnisa-schd-kaeru", question: "NISAでSCHDを考えるときの注意は？", description: "ETFと国内投信を混同せずに整理します。", kind: "question" },
  ],
  "schd-vs-vym": [
    { href: "/fund/schd", question: "SCHDはなぜ参考系列なの？", description: "設定日、公式データ、公開できる範囲を確認します。", kind: "risk" },
    { href: "/fund/vym", question: "VYMの検証済みデータを見る", description: "商品属性とA品質の収録期間を確認します。", kind: "question" },
    { href: "/guide/bunpaikin-to-zeikin", question: "分配金にかかる税金は？", description: "受取額を見る前に知っておきたい制度を整理します。", kind: "action" },
  ],
};

export const KODOMO_READING_JOURNEYS: Record<string, ReadingJourneyItem[]> = {
  "kodomo-nisa": [
    { href: "/guide/kodomo-nisa-tsumitate-ikura", question: "月1万円なら、元本はいくらになる？", description: "年齢と積立期間から、まず拠出額を整理します。", kind: "action" },
    { href: "/guide/kodomo-nisa-nansai-kara", question: "何歳から始めると期間はどう変わる？", description: "0歳・6歳・12歳の違いをタイムラインで見ます。", kind: "question" },
    { href: "/guide/kodomo-nisa-oya-nisa-tsukaiwake", question: "親のNISAとはどう使い分ける？", description: "名義、目的、払出しを並べて確認します。", kind: "compare" },
  ],
  "kodomo-nisa-tsumitate-ikura": [
    { href: "/guide/kodomo-nisa-nansai-kara", question: "積立を始める年齢で何が変わる？", description: "同じ月額でも積立月数が変わることを確認します。", kind: "question" },
    { href: "/guide/kodomo-nisa-orukan-vs-sp500", question: "積立商品はどう比べる？", description: "投資対象と値動きの違いを先に理解します。", kind: "compare" },
    { href: "/guide/kodomo-nisa-daigaku-shikin-deguchi", question: "大学資金を使う時期にどう備える？", description: "使う直前の値下がりリスクを整理します。", kind: "risk" },
  ],
  "kodomo-nisa-orukan-vs-sp500": [
    { href: "/compare/orukan-vs-sp500", question: "過去の積立結果を同条件で比べる", description: "開始月と月額をそろえて経路を確認します。", kind: "compare" },
    { href: "/guide/kodomo-nisa-tsumitate-ikura", question: "商品より先に月額を考える", description: "家計から無理なく続けられる金額を整理します。", kind: "action" },
    { href: "/guide/kodomo-nisa-daigaku-shikin-deguchi", question: "教育費を使う直前の下落に備える", description: "元本割れと使う時期の関係を確認します。", kind: "risk" },
  ],
  "kodomo-nisa-vs-gakushi-hoken": [
    { href: "/guide/kodomo-nisa-tsumitate-ikura", question: "毎月の準備額を決めるには？", description: "投資商品を選ぶ前に元本の目安を確認します。", kind: "action" },
    { href: "/guide/kodomo-nisa-daigaku-shikin-deguchi", question: "使う時期が決まっているお金の注意点は？", description: "教育費の出口と価格変動を一緒に考えます。", kind: "risk" },
  ],
  "kodomo-nisa-hikidashi": [
    { href: "/guide/kodomo-nisa-daigaku-shikin-deguchi", question: "大学資金はいつ現金へ移す？", description: "使う時期から逆算する考え方を整理します。", kind: "action" },
    { href: "/guide/kodomo-nisa-oya-nisa-tsukaiwake", question: "親名義と子ども名義は何が違う？", description: "払出しと管理の違いを並べて確認します。", kind: "compare" },
  ],
  "kodomo-nisa-daigaku-shikin-deguchi": [
    { href: "/guide/kodomo-nisa-hikidashi", question: "途中で引き出すときの条件は？", description: "制度上の払出しと資金管理を確認します。", kind: "question" },
    { href: "/guide/kodomo-nisa-tsumitate-ikura", question: "目標額から月額を考える", description: "将来利益ではなく、まず積立元本を整理します。", kind: "action" },
  ],
  "kodomo-nisa-nansai-kara": [
    { href: "/guide/kodomo-nisa-tsumitate-ikura", question: "年齢が決まったら月額を考える", description: "積立月数と元本を身近な例で確認します。", kind: "action" },
    { href: "/guide/kodomo-nisa-oya-nisa-tsukaiwake", question: "親のNISAを先に使う考え方は？", description: "名義と目的の違いから整理します。", kind: "compare" },
    { href: "/guide/kodomo-nisa-daigaku-shikin-deguchi", question: "18歳ごろに使うお金の準備は？", description: "運用期間と出口のリスクを確認します。", kind: "risk" },
  ],
  "kodomo-nisa-oya-nisa-tsukaiwake": [
    { href: "/guide/kodomo-nisa", question: "こどもNISAの全体像を確認する", description: "確定事項と未確定事項を分けて整理します。", kind: "question" },
    { href: "/guide/kodomo-nisa-tsumitate-ikura", question: "教育費の積立額を考える", description: "月1万円の元本を例に、無理のない金額を確認します。", kind: "action" },
    { href: "/guide/kodomo-nisa-hikidashi", question: "子ども名義のお金はいつ引き出せる？", description: "払出し条件と使い道の注意点を確認します。", kind: "risk" },
  ],
};
