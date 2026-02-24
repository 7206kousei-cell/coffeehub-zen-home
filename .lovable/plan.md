

# 抽出ログ一覧 & 詳細画面の実装計画

## 概要

Homeのデザインシステム（カード型UI、角丸16px、shadow-xs、border-border/40、Inter + Noto Sans JPフォント体系）を完全に踏襲し、2つの新画面を構築します。

---

## 新規ファイル

| ファイル | 用途 |
|---|---|
| `src/pages/BrewHistory.tsx` | 抽出ログ一覧画面 |
| `src/pages/BrewDetail.tsx` | 抽出ログ詳細画面 |
| `src/components/BrewLogCard.tsx` | ログカード共通コンポーネント |
| `src/components/MiniTPSChart.tsx` | 詳細画面用の5回分TPS折れ線 |

## 変更ファイル

| ファイル | 変更内容 |
|---|---|
| `src/App.tsx` | `/history` と `/history/:id` ルート追加 |
| `src/pages/Index.tsx` | 「抽出履歴」CTAに `path: "/history"` を設定 |

---

## 画面1: 抽出ログ一覧 (`BrewHistory.tsx`)

### ヘッダー（非カード）

- 既存のAnalysis/Ratingと同一レイアウト
- 左：戻るボタン（`ChevronLeft`アイコン、`navigate(-1)`）
- 中央：「抽出ログ」（10px、tracking-[0.2em]、uppercase、muted-foreground/40）
- 右：フィルターアイコン（`SlidersHorizontal`、モノクロ線画）

### フィルターチップ（横スクロール）

- `overflow-x-auto` で横スクロール
- チップ：ピル型（rounded-full）、12px文字
- 非アクティブ：`bg-transparent border border-border/40 text-muted-foreground`
- アクティブ：`border-accent text-primary`（塗りなし、枠線強調のみ）
- 項目：期間 / ★4以上 / ★5のみ / 豆 / 器具 / 湯温 / 挽き目

### ログカード (`BrewLogCard.tsx`)

カード全体：`bg-card rounded-2xl border border-border/40 shadow-xs`

```text
+--+-------------------------------+
|  | 日付 + 時刻      豆名 [Roast] |
|状| ★4              TPS 85 +7    |
|態|                                |
|線| ⏱ 2:30  🌡 92℃  ⚙ 8         |
|  | 改善  抽出時間 +6秒            |
+--+-------------------------------+
```

**左端2px縦ライン（状態インジケータ）：**
- 改善：`bg-accent`（くすんだオレンジ）
- 横ばい：`bg-transparent`
- 悪化：`bg-red-400/50`（低彩度赤）
- 未評価：`bg-muted-foreground/30`

**左20%：豆サムネイル**
- 角丸はカードと一致（rounded-l-2xl）
- 画像なし時：淡いプレースホルダ（`bg-secondary`、`Bean`アイコン表示）

**右80%（px-4 py-3.5）：**

| 行 | 左 | 右 |
|---|---|---|
| 上段 | 日付+時刻（12px、muted-foreground） | 豆名（12px、primary/80）+ Roastバッジ（10px、rounded-full、border-border/40） |
| 中段 | ★評価（28px、bold、primary） | TPS（11px、muted-foreground）+ 差分（accent） |
| 下段 | パラメータ3つ（11px、muted-foreground/70） | 抽出時間のみ `text-primary/80` で微強調 |
| 最下段 | 状態タグ + 差分テキスト（11px） | 最大2つまで |

**状態タグ：**
- 改善：`text-accent` テキストのみ（バッジ不要）
- 悪化：`text-red-400/70` テキストのみ
- 横ばい：`text-muted-foreground` テキストのみ

**パラメータアイコン：**
- `Clock`（抽出時間）、`Thermometer`（湯温）、`Settings2`（挽き目）
- すべてモノクロ線画、size=12、strokeWidth=1.5

### モックデータ

5件のログエントリ（改善/横ばい/悪化/未評価の各パターンを含む）

---

## 画面2: 抽出ログ詳細 (`BrewDetail.tsx`)

### ヘッダー

- 左：戻るボタン（`ChevronLeft`）
- 中央：豆名（14px、primary）
- 右上：★評価（28px、bold）

### セクション1: AI診断カード

```text
bg-card rounded-2xl border border-border/40 shadow-xs px-5 py-5
```

- セクションタイトル：「AI診断」（14px、semibold）
- `Brain` アイコン（モノクロ、14px）
- テキスト：13px、primary/80、leading-[1.7]
- 例：「抽出時間が理想よりやや長くなっています。」
- CTAボタン：`border border-border/40 rounded-xl text-[12px] px-4 py-2.5`（アウトライン）
- 例：「挽き目を+1step粗くしましょう」

### セクション2: 味覚プロファイル（レーダーチャート）

- 既存の `TasteRadarChart` を拡張し、2層表示（今回 vs 理想）を実装
- Analysis画面の `DualRadarChart` パターンを流用
- サイズ：170px
- 凡例：「今回」（accent実線）/ 「理想」（muted-foreground破線）
- 凡例下に1行差分説明（11px、muted-foreground）

### セクション3: 抽出パラメータ

2カラムグリッド（`grid grid-cols-2 gap-3`）

各ボックス：

```text
bg-card rounded-[14px] border border-border/40 px-4 py-3
```

| 項目 | アイコン |
|---|---|
| 粉量 15g | `Scale`（lucide） |
| 湯量 225ml | `Droplets` |
| 比率 1:15 | `Percent` |
| 挽き目 8 | `Settings2` |
| 湯温 92℃ | `Thermometer` |
| 抽出時間 2:30 | `Clock` |

- アイコン：12px、muted-foreground/50、strokeWidth=1.5
- ラベル：11px、muted-foreground
- 値：14px、medium、primary
- 前回比：12px、muted-foreground/60（例：「前回 +3秒」）

### セクション4: TPS推移

- `MiniTPSChart` コンポーネント（新規）
- 直近5回のみ表示
- Home の `TPSLineChart` と同一描画ロジック
- 線：1.2px、accent色
- 点：r=2.5、最終点のみr=3
- グリッド：最小限（ベースラインのみ）
- X軸ラベル：「1」「2」「3」「4」「5」（9px）

---

## ルーティング変更 (`App.tsx`)

```text
/history       → BrewHistory（一覧）
/history/:id   → BrewDetail（詳細）
```

一覧カードタップで `navigate(/history/${id})` へ遷移。

## Home CTA変更 (`Index.tsx`)

「抽出履歴」の `path` を `undefined` から `"/history"` に変更。

---

## デザイントークン一覧

| トークン | 値 |
|---|---|
| カード背景 | `bg-card` |
| カード角丸 | `rounded-2xl`（16px） |
| カード境界線 | `border border-border/40` |
| カードシャドウ | `shadow-xs` |
| チップ角丸 | `rounded-full`（999px） |
| パラメータボックス角丸 | `rounded-[14px]` |
| カード間余白 | `pb-4`〜`pb-5`（16〜20px） |
| カード内パディング | `px-5 py-5` |
| セクションタイトル | 14px semibold |
| 補足テキスト | 11-12px regular |
| 評価数値 | 28px bold |
| フォント（数値） | Inter |
| フォント（日本語） | Noto Sans JP |

