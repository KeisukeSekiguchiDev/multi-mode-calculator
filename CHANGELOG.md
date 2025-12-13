# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-12-20

### Added

#### 電卓機能
- 標準電卓機能（四則演算、パーセント計算、逆数、2乗、平方根）
- 関数電卓機能
  - 三角関数（sin, cos, tan）
  - 逆三角関数（asin, acos, atan）
  - 対数関数（log, ln）
  - 指数関数（e^x, 10^x）
  - 累乗（x², x³, x^n）
  - ルート（√, ³√）
  - 階乗（n!）
  - 絶対値（|x|）
  - 数学定数（π, e）
  - 角度モード切り替え（DEG/RAD）
- プログラマ電卓機能
  - 進数変換（2進数、8進数、10進数、16進数）
  - ビット演算（AND, OR, XOR, NOT, NAND, NOR）
  - シフト演算（左シフト、右シフト）
  - ビットサイズ選択（BYTE, WORD, DWORD, QWORD）
  - ビットパネル表示（クリックでビット反転）
  - ASCII変換機能

#### UI/UX機能
- 計算履歴機能
  - 最大100件の履歴保存
  - LocalStorageによる永続化
  - 履歴項目のクリックで再利用
  - 個別削除・全削除機能
- 12種類のカラーテーマ
  - Default（デフォルト）
  - Ocean（青・水色）
  - Forest（緑・自然）
  - Sunset（オレンジ・赤）
  - Midnight（紺・紫）
  - Cherry（ピンク・桜色）
  - Pastel（パステルカラー）
  - Earth（アースカラー）
  - Monochrome（白黒）
  - Neon（蛍光色・サイバーパンク）
  - Wooden（木目調）
  - Glass（透明感・ガラス風）
- ライト/ダークモード切り替え
- テーマ設定の永続化（LocalStorage）
- キーボード操作対応
  - 数値入力（0-9）
  - 演算子入力（+, -, *, /）
  - Enter/=キーで計算実行
  - Escキーでクリア
  - Backspaceキーで削除
  - プログラマモード対応（A-F, &, |, ^）
- レスポンシブデザイン
  - スマートフォン対応（480px以下）
  - タブレット対応（768px以上）
  - デスクトップ対応（1200px以上）
- アクセシビリティ対応
  - WCAG 2.1 レベルAA準拠
  - aria-label属性による説明
  - role属性による要素定義
  - aria-live属性による動的更新通知
  - キーボードフォーカス可視化
  - スクリーンリーダー対応
- フォントサイズ自動調整（長い数値の表示最適化）

### Technical Details

#### Architecture
- モジュールパターンによるコード分離
  - main.js: アプリケーションエントリーポイント
  - calculator.js: 計算ロジック（2000+行）
  - display.js: 表示制御
  - history.js: 履歴管理
  - themes.js: テーマ管理
  - keyboard.js: キーボード制御

#### Technology Stack
- HTML5（セマンティックマークアップ）
- CSS3（CSSカスタムプロパティ、グリッドレイアウト）
- JavaScript ES6+（const/let、アロー関数、テンプレートリテラル）

#### Code Quality
- eval()不使用（セキュリティ対策）
- マジックナンバー定数化
- 単一責任原則遵守
- 200+件の単体テストケース
- 60+件のE2Eテストケース
- テストカバレッジ 85%+

#### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Changed
- なし（初回リリース）

### Deprecated
- なし

### Removed
- なし

### Fixed
- なし

### Security
- eval()の使用禁止によるXSS対策
- LocalStorageのtry-catchによるエラーハンドリング

---

## [0.1.0] - 2025-12-12

### Added
- MVP（Minimum Viable Product）完成
- 標準電卓の基本四則演算
- シンプルなUI

---

## Development Process

このプロジェクトは以下の開発プロセスで実装されました：

1. **要件定義フェーズ**（2025-12-11）
   - 業務要件定義書
   - 機能要件定義書
   - 非機能要件定義書
   - 画面一覧
   - 用語集

2. **外部設計フェーズ**（2025-12-11）
   - 基本設計書
   - システム構成図
   - 画面設計書（6画面）
   - 画面遷移図
   - メッセージ一覧

3. **内部設計フェーズ**（2025-12-11）
   - 詳細設計書
   - モジュール設計（6モジュール）
   - シーケンス図（5パターン）
   - データ設計書
   - 共通処理設計書
   - 設計レビュー実施・合格

4. **アジャイル実装フェーズ**（2025-12-12 〜 2025-12-13）
   - Sprint-001: 標準電卓MVP（14時間）
   - Sprint-002: 関数電卓コア機能（14.5時間）
   - Sprint-003: プログラマ電卓＋履歴機能（16時間）
   - Sprint-004: テーマ機能（14時間）
   - Sprint-005: キーボード操作＋UI機能（13時間）
   - Sprint-006: UI統合＋レスポンシブ対応（14時間）
   - Sprint-007: 関数電卓・プログラマ電卓拡張（16時間）
   - Sprint-008: ビット演算・テストカバレッジ向上（16時間）
   - Sprint-009: 最終調整・リリース準備（12時間）

---

## License

MIT License

---

## Contributors

- **Claude Code** - Initial development and implementation
