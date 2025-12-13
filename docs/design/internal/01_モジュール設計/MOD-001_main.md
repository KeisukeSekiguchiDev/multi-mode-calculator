# MOD-001 main.js モジュール設計書

## 文書情報

| 項目 | 内容 |
|------|------|
| モジュールID | MOD-001 |
| ファイル名 | main.js |
| 責務 | アプリケーション初期化、イベントバインド |
| 作成日 | 2025-12-11 |

---

## 1. モジュール概要

### 1.1 責務

- アプリケーションの初期化処理
- DOMContentLoaded後のセットアップ
- 各モジュールの初期化呼び出し
- グローバルイベントのバインド
- 電卓モード（標準/関数/プログラマ）の切り替え制御

### 1.2 依存モジュール

| モジュール | 用途 |
|-----------|------|
| calculator.js | 計算ロジックの初期化 |
| display.js | 表示制御の初期化 |
| history.js | 履歴機能の初期化 |
| themes.js | テーマ機能の初期化 |
| keyboard.js | キーボード制御の初期化 |

---

## 2. 定数定義

```javascript
/**
 * 電卓モード定数
 */
const CALCULATOR_MODES = {
  STANDARD: 'standard',
  SCIENTIFIC: 'scientific',
  PROGRAMMER: 'programmer'
};

/**
 * LocalStorageキー
 */
const STORAGE_KEYS = {
  LAST_MODE: 'calc_lastMode'
};

/**
 * DOM要素ID
 */
const ELEMENT_IDS = {
  TAB_STANDARD: 'tab-standard',
  TAB_SCIENTIFIC: 'tab-scientific',
  TAB_PROGRAMMER: 'tab-programmer',
  PANEL_STANDARD: 'panel-standard',
  PANEL_SCIENTIFIC: 'panel-scientific',
  PANEL_PROGRAMMER: 'panel-programmer',
  BTN_HISTORY: 'btn-history',
  BTN_SETTINGS: 'btn-settings'
};
```

---

## 3. グローバル状態

```javascript
/**
 * アプリケーション状態
 */
const appState = {
  currentMode: CALCULATOR_MODES.STANDARD,  // 現在の電卓モード
  isInitialized: false                      // 初期化完了フラグ
};
```

---

## 4. 関数一覧

### 4.1 初期化関数

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| init() | なし | void | アプリケーション初期化（エントリーポイント） |
| initModules() | なし | void | 各モジュールの初期化 |
| initEventListeners() | なし | void | イベントリスナーの設定 |
| restoreLastMode() | なし | void | 前回モードの復元 |

### 4.2 モード切り替え関数

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| switchMode(mode) | mode: string | void | 電卓モードを切り替え |
| updateTabUI(mode) | mode: string | void | タブのアクティブ状態を更新 |
| updatePanelVisibility(mode) | mode: string | void | パネルの表示/非表示を切り替え |
| saveCurrentMode(mode) | mode: string | void | 現在モードをLocalStorageに保存 |

### 4.3 パネル制御関数

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| openHistoryPanel() | なし | void | 履歴パネルを開く |
| closeHistoryPanel() | なし | void | 履歴パネルを閉じる |
| openSettingsDialog() | なし | void | 設定ダイアログを開く |
| closeSettingsDialog() | なし | void | 設定ダイアログを閉じる |
| openAsciiDialog() | なし | void | ASCII変換ダイアログを開く |
| closeAsciiDialog() | なし | void | ASCII変換ダイアログを閉じる |

---

## 5. 関数詳細設計

### 5.1 init()

```javascript
/**
 * アプリケーション初期化
 * DOMContentLoadedイベントで呼び出される
 */
function init() {
  // 1. 各モジュールの初期化
  initModules();

  // 2. イベントリスナーの設定
  initEventListeners();

  // 3. 前回モードの復元
  restoreLastMode();

  // 4. 初期化完了
  appState.isInitialized = true;
}

// DOMContentLoaded時に実行
document.addEventListener('DOMContentLoaded', init);
```

### 5.2 initModules()

```javascript
/**
 * 各モジュールの初期化（依存関係を考慮した順序）
 *
 * 初期化順序の依存関係:
 * 1. ThemeManager   - 独立（依存なし）
 * 2. Calculator     - 独立（コアロジック）
 * 3. DisplayManager - Calculator に依存（計算状態を表示）
 * 4. HistoryManager - Calculator に依存（計算結果を記録）
 * 5. KeyboardHandler - Calculator, DisplayManager に依存（入力をロジックに渡し、表示を更新）
 */
function initModules() {
  // 1. 独立モジュール（依存なし）
  // テーマを最初に初期化（見た目に影響するため先行読み込み）
  ThemeManager.init();

  // 2. コアロジック（他モジュールの基盤）
  Calculator.init();

  // 3. コアロジックに依存するモジュール
  DisplayManager.init();    // Calculator の状態を参照して表示
  HistoryManager.init();    // Calculator の計算結果を記録

  // 4. UI制御（複数モジュールに依存）
  KeyboardHandler.init();   // Calculator へ入力、DisplayManager で表示更新
}
```

### 5.3 initEventListeners()

```javascript
/**
 * イベントリスナーの設定
 */
function initEventListeners() {
  // タブ切り替えイベント
  document.getElementById(ELEMENT_IDS.TAB_STANDARD)
    .addEventListener('click', () => switchMode(CALCULATOR_MODES.STANDARD));
  document.getElementById(ELEMENT_IDS.TAB_SCIENTIFIC)
    .addEventListener('click', () => switchMode(CALCULATOR_MODES.SCIENTIFIC));
  document.getElementById(ELEMENT_IDS.TAB_PROGRAMMER)
    .addEventListener('click', () => switchMode(CALCULATOR_MODES.PROGRAMMER));

  // 履歴ボタン
  document.getElementById(ELEMENT_IDS.BTN_HISTORY)
    .addEventListener('click', openHistoryPanel);

  // 設定ボタン
  document.getElementById(ELEMENT_IDS.BTN_SETTINGS)
    .addEventListener('click', openSettingsDialog);

  // ボタンクリックのイベントデリゲーション
  document.querySelector('.calculator__buttons')
    .addEventListener('click', handleButtonClick);
}
```

### 5.4 switchMode()

```javascript
/**
 * 電卓モードを切り替え
 * @param {string} mode - 切り替え先のモード
 */
function switchMode(mode) {
  // 同じモードなら何もしない
  if (appState.currentMode === mode) {
    return;
  }

  // 状態更新
  appState.currentMode = mode;

  // UI更新
  updateTabUI(mode);
  updatePanelVisibility(mode);

  // 計算機能にモード変更を通知
  Calculator.setMode(mode);

  // 表示を更新
  DisplayManager.refresh();

  // LocalStorageに保存
  saveCurrentMode(mode);
}
```

### 5.5 restoreLastMode()

```javascript
/**
 * 前回使用したモードを復元
 */
function restoreLastMode() {
  try {
    const savedMode = localStorage.getItem(STORAGE_KEYS.LAST_MODE);

    if (savedMode && Object.values(CALCULATOR_MODES).includes(savedMode)) {
      switchMode(savedMode);
    } else {
      // デフォルトは標準モード
      switchMode(CALCULATOR_MODES.STANDARD);
    }
  } catch (e) {
    console.error('Failed to restore last mode:', e);
    switchMode(CALCULATOR_MODES.STANDARD);
  }
}
```

### 5.6 handleButtonClick()

```javascript
/**
 * ボタンクリックのイベントハンドラ（イベントデリゲーション）
 * @param {Event} event - クリックイベント
 */
function handleButtonClick(event) {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (!action) return;

  switch (action) {
    case 'number':
      Calculator.inputNumber(value);
      break;
    case 'operator':
      Calculator.inputOperator(value);
      break;
    case 'equals':
      Calculator.calculate();
      break;
    case 'clear':
      Calculator.clear();
      break;
    case 'clear-entry':
      Calculator.clearEntry();
      break;
    case 'backspace':
      Calculator.backspace();
      break;
    case 'decimal':
      Calculator.inputDecimal();
      break;
    case 'negate':
      Calculator.negate();
      break;
    case 'percent':
      Calculator.percent();
      break;
    case 'memory':
      Calculator.memoryOperation(value);
      break;
    case 'scientific':
      Calculator.scientificOperation(value);
      break;
    case 'programmer':
      Calculator.programmerOperation(value);
      break;
    case 'base':
      Calculator.setBase(value);
      break;
    case 'bitwise':
      Calculator.bitwiseOperation(value);
      break;
    case 'ascii':
      openAsciiDialog();
      break;
  }

  // 表示更新
  DisplayManager.update();
}
```

---

## 6. イベントフロー

```
DOMContentLoaded
      │
      ▼
    init()
      │
      ├─► initModules()
      │     ├─► ThemeManager.init()
      │     ├─► DisplayManager.init()
      │     ├─► Calculator.init()
      │     ├─► HistoryManager.init()
      │     └─► KeyboardHandler.init()
      │
      ├─► initEventListeners()
      │     ├─► タブクリックイベント設定
      │     ├─► 履歴/設定ボタンイベント設定
      │     └─► ボタンクリックデリゲーション設定
      │
      └─► restoreLastMode()
            └─► switchMode()
```

---

## 7. エラーハンドリング

| エラー状況 | 対処 |
|-----------|------|
| LocalStorage読み取り失敗 | デフォルト値（標準モード）を使用 |
| DOM要素が見つからない | コンソールエラー出力、処理スキップ |
| 無効なモード値 | 無視してデフォルトモードを維持 |

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|------------|----------|--------|
| 2025-12-11 | 1.0 | 初版作成 | Claude Code |
| 2025-12-11 | 1.1 | M-04対応: initModules()に初期化順序の依存関係コメントを追加 | Claude Code |
