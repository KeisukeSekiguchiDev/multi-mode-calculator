# MOD-006 keyboard.js モジュール設計書

## 文書情報

| 項目 | 内容 |
|------|------|
| モジュールID | MOD-006 |
| ファイル名 | keyboard.js |
| 責務 | キーボード入力制御 |
| 作成日 | 2025-12-11 |

---

## 1. モジュール概要

### 1.1 責務

- キーボードイベントの監視
- キー入力と計算機操作のマッピング
- モード別のキーバインド管理
- ショートカットキーの処理
- フォーカス管理

### 1.2 依存モジュール

| モジュール | 用途 |
|-----------|------|
| calculator.js | 計算機操作の実行 |
| display.js | 表示更新 |
| history.js | 履歴パネル操作 |
| themes.js | 設定ダイアログ操作 |

---

## 2. 定数定義

```javascript
/**
 * キーコードマッピング（標準モード）
 */
const STANDARD_KEY_MAP = {
  // 数字
  '0': { action: 'number', value: '0' },
  '1': { action: 'number', value: '1' },
  '2': { action: 'number', value: '2' },
  '3': { action: 'number', value: '3' },
  '4': { action: 'number', value: '4' },
  '5': { action: 'number', value: '5' },
  '6': { action: 'number', value: '6' },
  '7': { action: 'number', value: '7' },
  '8': { action: 'number', value: '8' },
  '9': { action: 'number', value: '9' },

  // 演算子
  '+': { action: 'operator', value: '+' },
  '-': { action: 'operator', value: '-' },
  '*': { action: 'operator', value: '×' },
  '/': { action: 'operator', value: '÷' },
  '%': { action: 'percent', value: null },

  // 小数点
  '.': { action: 'decimal', value: null },
  ',': { action: 'decimal', value: null },  // テンキー対応

  // 計算実行
  'Enter': { action: 'equals', value: null },
  '=': { action: 'equals', value: null },

  // クリア
  'Escape': { action: 'clear', value: null },
  'Delete': { action: 'clear-entry', value: null },
  'Backspace': { action: 'backspace', value: null }
};

/**
 * キーコードマッピング（プログラマモード追加）
 */
const PROGRAMMER_KEY_MAP = {
  // 16進数
  'a': { action: 'hex', value: 'A' },
  'b': { action: 'hex', value: 'B' },
  'c': { action: 'hex', value: 'C' },
  'd': { action: 'hex', value: 'D' },
  'e': { action: 'hex', value: 'E' },
  'f': { action: 'hex', value: 'F' },
  'A': { action: 'hex', value: 'A' },
  'B': { action: 'hex', value: 'B' },
  'C': { action: 'hex', value: 'C' },
  'D': { action: 'hex', value: 'D' },
  'E': { action: 'hex', value: 'E' },
  'F': { action: 'hex', value: 'F' },

  // ビット演算
  '&': { action: 'bitwise', value: 'AND' },
  '|': { action: 'bitwise', value: 'OR' },
  '^': { action: 'bitwise', value: 'XOR' },
  '~': { action: 'bitwise', value: 'NOT' },
  '<': { action: 'bitwise', value: 'LSH' },
  '>': { action: 'bitwise', value: 'RSH' }
};

/**
 * ショートカットキー（Ctrl/Cmd + キー）
 */
const SHORTCUT_MAP = {
  'c': { action: 'copy', value: null },     // Ctrl+C: コピー
  'v': { action: 'paste', value: null },    // Ctrl+V: ペースト
  'h': { action: 'history', value: null },  // Ctrl+H: 履歴
  ',': { action: 'settings', value: null }, // Ctrl+,: 設定
  'z': { action: 'undo', value: null }      // Ctrl+Z: 元に戻す（未実装）
};

/**
 * ファンクションキー
 */
const FUNCTION_KEY_MAP = {
  'F1': { action: 'help', value: null },
  'F9': { action: 'negate', value: null }
};

/**
 * 入力禁止キー（イベントを無視）
 */
const IGNORED_KEYS = ['Tab', 'CapsLock', 'Shift', 'Control', 'Alt', 'Meta'];
```

---

## 3. 状態管理

```javascript
/**
 * キーボードモジュールの状態
 */
const keyboardState = {
  // キーボード入力が有効か
  isEnabled: true,

  // 現在の電卓モード
  currentMode: 'standard',

  // 修飾キーの状態
  modifiers: {
    ctrl: false,
    alt: false,
    shift: false,
    meta: false
  },

  // 初期化済みフラグ
  isInitialized: false
};
```

---

## 4. 関数一覧

### 4.1 初期化

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| init() | なし | void | キーボードモジュールの初期化 |
| setupEventListeners() | なし | void | イベントリスナーを設定 |

### 4.2 イベントハンドラ

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| handleKeydown(event) | event: KeyboardEvent | void | キー押下イベントを処理 |
| handleKeyup(event) | event: KeyboardEvent | void | キー解放イベントを処理 |

### 4.3 キーマッピング

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| getKeyMapping(key, mode) | key: string, mode: string | object | キーに対応するアクションを取得 |
| isValidKey(key, mode) | key: string, mode: string | boolean | 有効なキーかチェック |

### 4.4 アクション実行

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| executeAction(action) | action: object | void | アクションを実行 |
| executeShortcut(key) | key: string | void | ショートカットを実行 |

### 4.5 制御

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| enable() | なし | void | キーボード入力を有効化 |
| disable() | なし | void | キーボード入力を無効化 |
| setMode(mode) | mode: string | void | 電卓モードを設定 |

### 4.6 ユーティリティ

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| isInputElement(element) | element: HTMLElement | boolean | 入力要素かチェック |
| updateModifiers(event) | event: KeyboardEvent | void | 修飾キー状態を更新 |

---

## 5. 関数詳細設計

### 5.1 init()

```javascript
/**
 * キーボードモジュールの初期化
 */
function init() {
  setupEventListeners();
  keyboardState.isInitialized = true;
}
```

### 5.2 setupEventListeners()

```javascript
/**
 * イベントリスナーを設定
 */
function setupEventListeners() {
  // キー押下
  document.addEventListener('keydown', handleKeydown);

  // キー解放
  document.addEventListener('keyup', handleKeyup);

  // フォーカスアウト時に修飾キーをリセット
  window.addEventListener('blur', () => {
    keyboardState.modifiers = {
      ctrl: false,
      alt: false,
      shift: false,
      meta: false
    };
  });
}
```

### 5.3 handleKeydown()

```javascript
/**
 * キー押下イベントを処理
 * @param {KeyboardEvent} event - キーボードイベント
 */
function handleKeydown(event) {
  // 無効化されている場合は何もしない
  if (!keyboardState.isEnabled) return;

  // 入力要素にフォーカスがある場合は何もしない（ASCII変換ダイアログ等）
  if (isInputElement(event.target)) return;

  // 修飾キー状態を更新
  updateModifiers(event);

  const key = event.key;

  // 無視するキー
  if (IGNORED_KEYS.includes(key)) return;

  // ショートカットキー（Ctrl/Cmd + キー）
  if (keyboardState.modifiers.ctrl || keyboardState.modifiers.meta) {
    const shortcutKey = key.toLowerCase();
    if (SHORTCUT_MAP[shortcutKey]) {
      event.preventDefault();
      executeShortcut(shortcutKey);
      return;
    }
  }

  // ファンクションキー
  if (FUNCTION_KEY_MAP[key]) {
    event.preventDefault();
    executeAction(FUNCTION_KEY_MAP[key]);
    return;
  }

  // 通常キー
  const mapping = getKeyMapping(key, keyboardState.currentMode);
  if (mapping) {
    event.preventDefault();
    executeAction(mapping);
  }
}
```

### 5.4 handleKeyup()

```javascript
/**
 * キー解放イベントを処理
 * @param {KeyboardEvent} event - キーボードイベント
 */
function handleKeyup(event) {
  updateModifiers(event);
}
```

### 5.5 updateModifiers()

```javascript
/**
 * 修飾キー状態を更新
 * @param {KeyboardEvent} event - キーボードイベント
 */
function updateModifiers(event) {
  keyboardState.modifiers.ctrl = event.ctrlKey;
  keyboardState.modifiers.alt = event.altKey;
  keyboardState.modifiers.shift = event.shiftKey;
  keyboardState.modifiers.meta = event.metaKey;
}
```

### 5.6 getKeyMapping()

```javascript
/**
 * キーに対応するアクションを取得
 * @param {string} key - 押されたキー
 * @param {string} mode - 電卓モード
 * @returns {object|null} アクションオブジェクト
 */
function getKeyMapping(key, mode) {
  // 標準キーマップから検索
  if (STANDARD_KEY_MAP[key]) {
    return STANDARD_KEY_MAP[key];
  }

  // プログラマモードの場合、追加キーマップから検索
  if (mode === 'programmer' && PROGRAMMER_KEY_MAP[key]) {
    // 現在の進数で有効なキーかチェック
    const state = Calculator.getState();
    if (isValidForBase(key, state.base)) {
      return PROGRAMMER_KEY_MAP[key];
    }
  }

  return null;
}
```

### 5.7 isValidForBase()

```javascript
/**
 * 指定された進数で有効なキーかチェック
 * @param {string} key - キー
 * @param {number} base - 基数
 * @returns {boolean} 有効かどうか
 */
function isValidForBase(key, base) {
  const upperKey = key.toUpperCase();

  // 数字キー
  if (/^[0-9]$/.test(key)) {
    const digit = parseInt(key);
    return digit < base;
  }

  // 16進数字（A-F）
  if (/^[A-F]$/.test(upperKey)) {
    return base === 16;
  }

  return true;  // 演算子等は常に有効
}
```

### 5.8 executeAction()

```javascript
/**
 * アクションを実行
 * @param {object} action - アクションオブジェクト
 */
function executeAction(action) {
  switch (action.action) {
    case 'number':
      Calculator.inputNumber(action.value);
      break;

    case 'hex':
      Calculator.inputHexDigit(action.value);
      break;

    case 'operator':
      Calculator.inputOperator(action.value);
      break;

    case 'equals':
      Calculator.calculate();
      break;

    case 'decimal':
      Calculator.inputDecimal();
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

    case 'negate':
      Calculator.negate();
      break;

    case 'percent':
      Calculator.percent();
      break;

    case 'bitwise':
      Calculator.bitwiseOperation(action.value);
      break;

    case 'help':
      // ヘルプ表示（未実装）
      console.log('Help requested');
      break;

    default:
      console.warn(`Unknown action: ${action.action}`);
  }

  // 表示を更新
  DisplayManager.update();
}
```

### 5.9 executeShortcut()

```javascript
/**
 * ショートカットを実行
 * @param {string} key - ショートカットキー（小文字）
 */
function executeShortcut(key) {
  const shortcut = SHORTCUT_MAP[key];
  if (!shortcut) return;

  switch (shortcut.action) {
    case 'copy':
      // 現在の値をクリップボードにコピー
      const state = Calculator.getState();
      navigator.clipboard.writeText(state.currentValue).then(() => {
        showToast('コピーしました');
      });
      break;

    case 'paste':
      // クリップボードから貼り付け
      navigator.clipboard.readText().then(text => {
        const cleanText = text.trim();
        if (/^-?\d*\.?\d+$/.test(cleanText)) {
          Calculator.setCurrentValue(cleanText);
          DisplayManager.update();
        }
      });
      break;

    case 'history':
      HistoryManager.togglePanel();
      break;

    case 'settings':
      ThemeManager.openDialog();
      break;

    case 'undo':
      // 未実装
      console.log('Undo not implemented');
      break;
  }
}
```

### 5.10 isInputElement()

```javascript
/**
 * 入力要素かチェック
 * @param {HTMLElement} element - チェック対象要素
 * @returns {boolean} 入力要素かどうか
 */
function isInputElement(element) {
  if (!element) return false;

  const tagName = element.tagName.toLowerCase();
  const inputTypes = ['input', 'textarea', 'select'];

  // 入力要素タグ
  if (inputTypes.includes(tagName)) {
    return true;
  }

  // contenteditable属性
  if (element.isContentEditable) {
    return true;
  }

  return false;
}
```

### 5.11 enable() / disable()

```javascript
/**
 * キーボード入力を有効化
 */
function enable() {
  keyboardState.isEnabled = true;
}

/**
 * キーボード入力を無効化
 */
function disable() {
  keyboardState.isEnabled = false;
}
```

### 5.12 setMode()

```javascript
/**
 * 電卓モードを設定
 * @param {string} mode - 電卓モード
 */
function setMode(mode) {
  keyboardState.currentMode = mode;
}
```

---

## 6. キーボードショートカット一覧

### 6.1 標準キー

| キー | アクション | 備考 |
|------|-----------|------|
| 0-9 | 数字入力 | テンキー対応 |
| + | 加算 | Shift不要 |
| - | 減算 | |
| * | 乗算 | |
| / | 除算 | |
| % | パーセント | |
| . | 小数点 | カンマも可 |
| Enter / = | 計算実行 | |
| Escape | 全クリア | |
| Delete | 入力クリア | |
| Backspace | 1文字削除 | |
| F9 | 符号反転 | |

### 6.2 プログラマモード追加キー

| キー | アクション | 条件 |
|------|-----------|------|
| A-F | 16進数字 | HEXモード時のみ |
| & | AND | |
| \| | OR | |
| ^ | XOR | |
| ~ | NOT | |
| < | 左シフト | |
| > | 右シフト | |

### 6.3 ショートカットキー

| キー | アクション |
|------|-----------|
| Ctrl+C | 値をコピー |
| Ctrl+V | 値を貼り付け |
| Ctrl+H | 履歴パネル |
| Ctrl+, | 設定ダイアログ |

---

## 7. 公開API

```javascript
const KeyboardHandler = {
  init,
  enable,
  disable,
  setMode
};
```

---

## 8. アクセシビリティ考慮

- Tab キーによるフォーカス移動を妨げない
- 入力フィールドにフォーカスがある場合はキーボード処理をスキップ
- スクリーンリーダー対応（キーボード操作可能であることを通知）

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|------------|----------|--------|
| 2025-12-11 | 1.0 | 初版作成 | Claude Code |
