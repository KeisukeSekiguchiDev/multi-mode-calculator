# Multi-Mode Calculator - プロジェクトガイド

## プロジェクト概要

| 項目 | 内容 |
|------|------|
| プロジェクト名 | Multi-Mode Calculator |
| 種類 | Webアプリケーション（電卓） |
| 技術スタック | HTML5, CSS3, JavaScript (ES6+) |
| 利用形態 | 個人開発・学習目的 |

---

## ディレクトリ構成

```
Calculator/
├── .claude/
│   └── CLAUDE.md               # このファイル（プロジェクトガイド）
├── docs/
│   ├── requirements/           # 要件定義ドキュメント
│   │   ├── 00_要件定義書.md
│   │   ├── 01_業務要件定義書.md
│   │   ├── 02_機能要件定義書.md
│   │   ├── 03_非機能要件定義書.md
│   │   ├── 04_画面一覧.md
│   │   └── 99_用語集.md
│   └── design/
│       ├── external/           # 外部設計（基本設計）ドキュメント
│       │   ├── 00_基本設計書.md
│       │   ├── 01_システム構成図.md
│       │   ├── 02_画面一覧.md
│       │   ├── 03_画面設計書/
│       │   │   ├── SCR-001_標準電卓.md
│       │   │   ├── SCR-002_関数電卓.md
│       │   │   ├── SCR-003_プログラマ電卓.md
│       │   │   ├── SCR-004_履歴パネル.md
│       │   │   ├── SCR-005_テーマ設定.md
│       │   │   └── SCR-006_ASCII変換.md
│       │   ├── 04_画面遷移図.md
│       │   └── 05_メッセージ一覧.md
│       └── internal/           # 内部設計（詳細設計）ドキュメント
│           ├── 00_詳細設計書.md
│           ├── 01_モジュール設計/
│           │   ├── MOD-001_main.md
│           │   ├── MOD-002_calculator.md
│           │   ├── MOD-003_display.md
│           │   ├── MOD-004_history.md
│           │   ├── MOD-005_themes.md
│           │   └── MOD-006_keyboard.md
│           ├── 02_シーケンス図/
│           │   ├── SEQ-001_基本計算処理.md
│           │   ├── SEQ-002_関数計算処理.md
│           │   ├── SEQ-003_進数変換処理.md
│           │   ├── SEQ-004_テーマ切替処理.md
│           │   └── SEQ-005_履歴操作処理.md
│           ├── 03_データ設計書.md
│           └── 04_共通処理設計書.md
├── src/
│   ├── index.html              # メインHTMLファイル
│   ├── css/
│   │   ├── main.css            # 基本スタイル
│   │   ├── themes.css          # テーマ定義
│   │   └── responsive.css      # レスポンシブ対応
│   ├── js/
│   │   ├── main.js             # エントリーポイント
│   │   ├── calculator.js       # 計算ロジック
│   │   ├── display.js          # 表示制御
│   │   ├── history.js          # 履歴管理
│   │   ├── themes.js           # テーマ管理
│   │   └── keyboard.js         # キーボード制御
│   └── themes/                 # テーマ別CSSファイル
└── README.md                   # プロジェクト説明（今後作成）
```

---

## 主要機能

### 電卓モード
1. **標準電卓** - 四則演算、パーセント計算
2. **関数電卓** - 三角関数、対数、累乗、ルート
3. **プログラマ電卓** - 進数変換、ビット演算、ASCII変換

### 共通機能
- 計算履歴（最大100件）
- 10種類のデザインテーマ
- ライト/ダークモード切り替え
- キーボード操作対応
- レスポンシブデザイン

---

## 開発ルール

### コーディング規約

#### JavaScript
- ES6+の構文を使用（const/let, アロー関数, テンプレートリテラル）
- eval()は使用禁止（セキュリティ上の理由）
- 1ファイル200行以内を目安
- 関数は単一責任原則に従う

#### CSS
- CSSカスタムプロパティを活用
- BEM命名規則を推奨（例：`.calculator__display--active`）
- テーマカラーは変数で管理

#### HTML
- セマンティックなマークアップ
- アクセシビリティ対応（aria-label）

### ファイル命名規則
- JavaScript: camelCase（例：calculator.js）
- CSS: kebab-case（例：main-styles.css）
- 画像: kebab-case（例：theme-preview.png）

---

## テーマ一覧

| No | テーマ名 | 概要 |
|----|----------|------|
| 1 | Default | シンプルなグレー基調 |
| 2 | Ocean | 青・水色のグラデーション |
| 3 | Forest | 緑・自然をイメージ |
| 4 | Sunset | オレンジ・赤のグラデーション |
| 5 | Midnight | 深い紺・紫 |
| 6 | Cherry | ピンク・桜色 |
| 7 | Monochrome | 白黒のシンプルデザイン |
| 8 | Neon | 蛍光色・サイバーパンク風 |
| 9 | Wooden | 木目調・ナチュラル |
| 10 | Glass | 透明感・ガラス風 |

---

## 関連ドキュメント

### 要件定義

- [要件定義書](docs/requirements/00_要件定義書.md)
- [業務要件定義書](docs/requirements/01_業務要件定義書.md)
- [機能要件定義書](docs/requirements/02_機能要件定義書.md)
- [非機能要件定義書](docs/requirements/03_非機能要件定義書.md)
- [画面一覧（要件）](docs/requirements/04_画面一覧.md)
- [用語集](docs/requirements/99_用語集.md)

### 外部設計（基本設計）

- [基本設計書](docs/design/external/00_基本設計書.md)
- [システム構成図](docs/design/external/01_システム構成図.md)
- [画面一覧（設計）](docs/design/external/02_画面一覧.md)
- [画面設計書](docs/design/external/03_画面設計書/)
  - [SCR-001 標準電卓](docs/design/external/03_画面設計書/SCR-001_標準電卓.md)
  - [SCR-002 関数電卓](docs/design/external/03_画面設計書/SCR-002_関数電卓.md)
  - [SCR-003 プログラマ電卓](docs/design/external/03_画面設計書/SCR-003_プログラマ電卓.md)
  - [SCR-004 履歴パネル](docs/design/external/03_画面設計書/SCR-004_履歴パネル.md)
  - [SCR-005 テーマ設定](docs/design/external/03_画面設計書/SCR-005_テーマ設定.md)
  - [SCR-006 ASCII変換](docs/design/external/03_画面設計書/SCR-006_ASCII変換.md)
- [画面遷移図](docs/design/external/04_画面遷移図.md)
- [メッセージ一覧](docs/design/external/05_メッセージ一覧.md)

### 内部設計（詳細設計）

- [詳細設計書](docs/design/internal/00_詳細設計書.md)
- [モジュール設計](docs/design/internal/01_モジュール設計/)
  - [MOD-001 main.js](docs/design/internal/01_モジュール設計/MOD-001_main.md)
  - [MOD-002 calculator.js](docs/design/internal/01_モジュール設計/MOD-002_calculator.md)
  - [MOD-003 display.js](docs/design/internal/01_モジュール設計/MOD-003_display.md)
  - [MOD-004 history.js](docs/design/internal/01_モジュール設計/MOD-004_history.md)
  - [MOD-005 themes.js](docs/design/internal/01_モジュール設計/MOD-005_themes.md)
  - [MOD-006 keyboard.js](docs/design/internal/01_モジュール設計/MOD-006_keyboard.md)
- [シーケンス図](docs/design/internal/02_シーケンス図/)
  - [SEQ-001 基本計算処理](docs/design/internal/02_シーケンス図/SEQ-001_基本計算処理.md)
  - [SEQ-002 関数計算処理](docs/design/internal/02_シーケンス図/SEQ-002_関数計算処理.md)
  - [SEQ-003 進数変換処理](docs/design/internal/02_シーケンス図/SEQ-003_進数変換処理.md)
  - [SEQ-004 テーマ切替処理](docs/design/internal/02_シーケンス図/SEQ-004_テーマ切替処理.md)
  - [SEQ-005 履歴操作処理](docs/design/internal/02_シーケンス図/SEQ-005_履歴操作処理.md)
- [データ設計書](docs/design/internal/03_データ設計書.md)
- [共通処理設計書](docs/design/internal/04_共通処理設計書.md)
- [設計レビュー報告書](docs/design/internal/99_設計レビュー報告書.md)

---

## 変更履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-11 | 初版作成、要件定義完了 |
| 2025-12-11 | 外部設計（基本設計）完了 |
| 2025-12-11 | 内部設計（詳細設計）完了 |
| 2025-12-11 | 内部設計レビュー実施、レビュー報告書作成 |
| 2025-12-11 | 内部設計修正完了、再レビュー合格、実装フェーズ承認 |
| 2025-12-12 | アジャイル実装フェーズ開始、Sprint-001計画完了 |
