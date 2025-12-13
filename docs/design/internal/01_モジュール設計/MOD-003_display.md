# MOD-003 display.js モジュール設計書

## 文書情報

| 項目 | 内容 |
|------|------|
| モジュールID | MOD-003 |
| ファイル名 | display.js |
| 責務 | ディスプレイ表示制御 |
| 作成日 | 2025-12-11 |

---

## 1. モジュール概要

### 1.1 責務

- メインディスプレイの値表示
- サブディスプレイ（式）の表示
- 進数変換結果の同時表示（プログラマモード）
- ビットパネルの表示更新
- 数値のフォーマット（桁区切り、進数表記）
- フォントサイズの自動調整

### 1.2 依存モジュール

| モジュール | 用途 |
|-----------|------|
| calculator.js | 表示する値の取得 |

---

## 2. 定数定義

```javascript
/**
 * DOM要素ID
 */
const DISPLAY_IDS = {
  // メインディスプレイ
  MAIN: 'display-main',
  SUB: 'display-sub',

  // 進数表示（プログラマモード）
  HEX_VALUE: 'hex-value',
  DEC_VALUE: 'dec-value',
  OCT_VALUE: 'oct-value',
  BIN_VALUE: 'bin-value',

  // ビットパネル
  BIT_PANEL: 'bit-panel',

  // 状態表示
  MEMORY_INDICATOR: 'memory-indicator',
  ANGLE_MODE: 'angle-mode',
  BASE_MODE: 'base-mode'
};

/**
 * フォントサイズ設定
 */
const FONT_SIZES = {
  LARGE: '3rem',      // 8桁以下
  MEDIUM: '2.5rem',   // 9-12桁
  SMALL: '2rem',      // 13-16桁
  XSMALL: '1.5rem'    // 17桁以上（エラー表示等）
};

/**
 * 桁区切り設定
 */
const DIGIT_SEPARATOR = {
  STANDARD: ',',      // 標準・関数電卓
  PROGRAMMER: ' '     // プログラマ電卓（4桁区切り）
};

/**
 * ビットパネル設定
 */
const BIT_PANEL_CONFIG = {
  BITS_PER_GROUP: 4,  // 4ビットごとにグループ化
  GROUPS_PER_ROW: 4   // 1行あたり4グループ（16ビット）
};
```

---

## 3. 状態管理

```javascript
/**
 * ディスプレイ状態
 */
const displayState = {
  // 現在の表示モード
  mode: 'standard',

  // キャッシュされたDOM要素
  elements: {
    main: null,
    sub: null,
    hexValue: null,
    decValue: null,
    octValue: null,
    binValue: null,
    bitPanel: null,
    memoryIndicator: null,
    angleMode: null,
    baseMode: null
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
| init() | なし | void | ディスプレイモジュールの初期化 |
| cacheElements() | なし | void | DOM要素をキャッシュ |

### 4.2 表示更新

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| update() | なし | void | 表示を最新状態に更新 |
| refresh() | なし | void | 表示を完全に再描画 |
| updateMainDisplay(value) | value: string | void | メインディスプレイを更新 |
| updateSubDisplay(expr) | expr: string | void | サブディスプレイを更新 |
| updateBaseDisplays() | なし | void | 進数表示を更新 |
| updateBitPanel() | なし | void | ビットパネルを更新 |
| updateIndicators() | なし | void | 状態インジケーターを更新 |

### 4.3 フォーマット

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| formatDisplayValue(value, mode) | value: string, mode: string | string | 表示用にフォーマット |
| addThousandsSeparator(value) | value: string | string | 桁区切りを追加 |
| formatBinaryForDisplay(binary) | binary: string | string | 2進数を4桁区切りでフォーマット |
| adjustFontSize(value) | value: string | void | フォントサイズを自動調整 |

### 4.4 ビットパネル

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| renderBitPanel(value, bitLength) | value: number, bitLength: number | void | ビットパネルを描画 |
| createBitElement(index, isSet) | index: number, isSet: boolean | HTMLElement | ビット要素を作成 |

---

## 5. 関数詳細設計

### 5.1 init()

```javascript
/**
 * ディスプレイモジュールの初期化
 */
function init() {
  // DOM要素をキャッシュ
  cacheElements();

  // 初期状態で更新
  update();

  displayState.isInitialized = true;
}
```

### 5.2 cacheElements()

```javascript
/**
 * DOM要素をキャッシュ（パフォーマンス向上）
 */
function cacheElements() {
  displayState.elements.main = document.getElementById(DISPLAY_IDS.MAIN);
  displayState.elements.sub = document.getElementById(DISPLAY_IDS.SUB);
  displayState.elements.hexValue = document.getElementById(DISPLAY_IDS.HEX_VALUE);
  displayState.elements.decValue = document.getElementById(DISPLAY_IDS.DEC_VALUE);
  displayState.elements.octValue = document.getElementById(DISPLAY_IDS.OCT_VALUE);
  displayState.elements.binValue = document.getElementById(DISPLAY_IDS.BIN_VALUE);
  displayState.elements.bitPanel = document.getElementById(DISPLAY_IDS.BIT_PANEL);
  displayState.elements.memoryIndicator = document.getElementById(DISPLAY_IDS.MEMORY_INDICATOR);
  displayState.elements.angleMode = document.getElementById(DISPLAY_IDS.ANGLE_MODE);
  displayState.elements.baseMode = document.getElementById(DISPLAY_IDS.BASE_MODE);
}
```

### 5.3 update()

```javascript
/**
 * 表示を最新状態に更新
 * Calculator.getState()から値を取得して表示を更新
 */
function update() {
  const state = Calculator.getState();

  // メインディスプレイ更新
  const formattedValue = formatDisplayValue(state.currentValue, state.mode);
  updateMainDisplay(formattedValue);

  // サブディスプレイ更新（式がある場合）
  updateSubDisplay(state.expression);

  // モード別の追加表示
  switch (state.mode) {
    case 'scientific':
      updateAngleModeIndicator(state.angleMode);
      break;
    case 'programmer':
      updateBaseDisplays();
      updateBitPanel();
      updateBaseModeIndicator(state.base);
      break;
  }

  // メモリインジケーター
  updateMemoryIndicator(state.memory !== 0);

  // フォントサイズ調整
  adjustFontSize(state.currentValue);
}
```

### 5.4 updateMainDisplay()

```javascript
/**
 * メインディスプレイを更新
 * @param {string} value - 表示する値
 */
function updateMainDisplay(value) {
  const element = displayState.elements.main;
  if (!element) return;

  element.textContent = value;
  element.setAttribute('aria-live', 'polite');
}
```

### 5.5 updateSubDisplay()

```javascript
/**
 * サブディスプレイを更新
 * @param {string} expression - 表示する式
 */
function updateSubDisplay(expression) {
  const element = displayState.elements.sub;
  if (!element) return;

  element.textContent = expression || '';

  // 式がある場合のみ表示
  element.style.visibility = expression ? 'visible' : 'hidden';
}
```

### 5.6 updateBaseDisplays()

```javascript
/**
 * 進数表示を更新（プログラマモード）
 */
function updateBaseDisplays() {
  const state = Calculator.getState();
  const allBases = Calculator.getValueInAllBases();

  // 各進数の表示を更新
  const updates = [
    { element: displayState.elements.hexValue, value: allBases.hex, active: state.base === 16 },
    { element: displayState.elements.decValue, value: allBases.dec, active: state.base === 10 },
    { element: displayState.elements.octValue, value: allBases.oct, active: state.base === 8 },
    { element: displayState.elements.binValue, value: formatBinaryForDisplay(allBases.bin), active: state.base === 2 }
  ];

  updates.forEach(({ element, value, active }) => {
    if (!element) return;
    element.textContent = value;
    element.classList.toggle('active', active);
  });
}
```

### 5.7 updateBitPanel()

```javascript
/**
 * ビットパネルを更新
 */
function updateBitPanel() {
  const element = displayState.elements.bitPanel;
  if (!element) return;

  const state = Calculator.getState();
  const value = parseInt(state.currentValue, state.base) || 0;

  renderBitPanel(value, state.bitLength);
}
```

### 5.8 renderBitPanel()

```javascript
/**
 * ビットパネルを描画
 * @param {number} value - 数値
 * @param {number} bitLength - ビット長（8/16/32/64）
 */
function renderBitPanel(value, bitLength) {
  const element = displayState.elements.bitPanel;
  if (!element) return;

  // 既存の内容をクリア
  element.innerHTML = '';

  // ビットごとに要素を作成
  for (let i = bitLength - 1; i >= 0; i--) {
    const isSet = (value >> i) & 1;
    const bitElement = createBitElement(i, isSet);
    element.appendChild(bitElement);

    // 4ビットごとにセパレーター
    if (i > 0 && i % BIT_PANEL_CONFIG.BITS_PER_GROUP === 0) {
      const separator = document.createElement('span');
      separator.className = 'bit-separator';
      element.appendChild(separator);
    }
  }
}
```

### 5.9 createBitElement()

```javascript
/**
 * ビット要素を作成
 * @param {number} index - ビット位置（0から）
 * @param {boolean} isSet - ビットが立っているか
 * @returns {HTMLElement} ビット要素
 */
function createBitElement(index, isSet) {
  const bit = document.createElement('span');
  bit.className = `bit ${isSet ? 'bit--set' : 'bit--unset'}`;
  bit.textContent = isSet ? '1' : '0';
  bit.dataset.index = index;
  bit.setAttribute('aria-label', `ビット${index}: ${isSet ? '1' : '0'}`);

  // クリックでビット反転（インタラクティブ機能）
  bit.addEventListener('click', () => {
    Calculator.toggleBit(index);
  });

  return bit;
}
```

### 5.10 formatDisplayValue()

```javascript
/**
 * 表示用にフォーマット
 * @param {string} value - 元の値
 * @param {string} mode - 電卓モード
 * @returns {string} フォーマット済みの値
 */
function formatDisplayValue(value, mode) {
  // エラー表示はそのまま
  if (value === 'Error' || value === 'Infinity') {
    return value;
  }

  // プログラマモードの場合
  if (mode === 'programmer') {
    // 2進数は4桁区切り
    const state = Calculator.getState();
    if (state.base === 2) {
      return formatBinaryForDisplay(value);
    }
    // その他は4桁区切り（スペース）
    return addProgrammerSeparator(value);
  }

  // 標準・関数モードは3桁カンマ区切り
  return addThousandsSeparator(value);
}
```

### 5.11 addThousandsSeparator()

```javascript
/**
 * 3桁ごとにカンマを追加
 * @param {string} value - 数値文字列
 * @returns {string} カンマ区切りの文字列
 */
function addThousandsSeparator(value) {
  // 符号を分離
  const isNegative = value.startsWith('-');
  const absValue = isNegative ? value.slice(1) : value;

  // 整数部と小数部に分離
  const [intPart, decPart] = absValue.split('.');

  // 整数部に3桁区切りを追加
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, DIGIT_SEPARATOR.STANDARD);

  // 結果を組み立て
  let result = formattedInt;
  if (decPart !== undefined) {
    result += '.' + decPart;
  }
  if (isNegative) {
    result = '-' + result;
  }

  return result;
}
```

### 5.12 formatBinaryForDisplay()

```javascript
/**
 * 2進数を4桁区切りでフォーマット
 * @param {string} binary - 2進数文字列
 * @returns {string} フォーマット済みの文字列
 */
function formatBinaryForDisplay(binary) {
  // 4の倍数にパディング
  const padLength = Math.ceil(binary.length / 4) * 4;
  const padded = binary.padStart(padLength, '0');

  // 4桁ごとにスペースで区切る
  return padded.match(/.{1,4}/g).join(' ');
}
```

### 5.13 adjustFontSize()

```javascript
/**
 * 値の桁数に応じてフォントサイズを調整
 * @param {string} value - 表示する値
 */
function adjustFontSize(value) {
  const element = displayState.elements.main;
  if (!element) return;

  // 桁数を取得（区切り文字を除く）
  const digitCount = value.replace(/[,.\s-]/g, '').length;

  let fontSize;
  if (digitCount <= 8) {
    fontSize = FONT_SIZES.LARGE;
  } else if (digitCount <= 12) {
    fontSize = FONT_SIZES.MEDIUM;
  } else if (digitCount <= 16) {
    fontSize = FONT_SIZES.SMALL;
  } else {
    fontSize = FONT_SIZES.XSMALL;
  }

  element.style.fontSize = fontSize;
}
```

### 5.14 updateIndicators()

```javascript
/**
 * メモリインジケーターを更新
 * @param {boolean} hasMemory - メモリに値があるか
 */
function updateMemoryIndicator(hasMemory) {
  const element = displayState.elements.memoryIndicator;
  if (!element) return;

  element.style.visibility = hasMemory ? 'visible' : 'hidden';
  element.textContent = 'M';
}

/**
 * 角度モードインジケーターを更新
 * @param {string} mode - 'DEG' or 'RAD'
 */
function updateAngleModeIndicator(mode) {
  const element = displayState.elements.angleMode;
  if (!element) return;

  element.textContent = mode;
}

/**
 * 進数モードインジケーターを更新
 * @param {number} base - 基数（2, 8, 10, 16）
 */
function updateBaseModeIndicator(base) {
  const element = displayState.elements.baseMode;
  if (!element) return;

  const labels = { 16: 'HEX', 10: 'DEC', 8: 'OCT', 2: 'BIN' };
  element.textContent = labels[base] || 'DEC';
}
```

---

## 6. 公開API

```javascript
const DisplayManager = {
  init,
  update,
  refresh,
  updateMainDisplay,
  updateSubDisplay,
  formatDisplayValue
};
```

---

## 7. CSS連携

### 7.1 必要なCSSクラス

```css
/* メインディスプレイ */
.calculator__display-main { }

/* サブディスプレイ（式表示） */
.calculator__display-sub { }

/* 進数表示 */
.calculator__base-value { }
.calculator__base-value.active { }

/* ビットパネル */
.calculator__bit-panel { }
.bit { }
.bit--set { }
.bit--unset { }
.bit-separator { }

/* インジケーター */
.calculator__indicator { }
.calculator__indicator--memory { }
.calculator__indicator--angle { }
.calculator__indicator--base { }
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|------------|----------|--------|
| 2025-12-11 | 1.0 | 初版作成 | Claude Code |
