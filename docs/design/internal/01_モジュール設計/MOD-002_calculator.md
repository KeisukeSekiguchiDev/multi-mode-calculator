# MOD-002 calculator.js モジュール設計書

## 文書情報

| 項目 | 内容 |
|------|------|
| モジュールID | MOD-002 |
| ファイル名 | calculator.js |
| 責務 | 計算ロジック（全モード対応） |
| 作成日 | 2025-12-11 |

---

## 1. モジュール概要

### 1.1 責務

- 標準電卓の四則演算
- 関数電卓の科学計算（三角関数、対数、累乗等）
- プログラマ電卓の進数変換・ビット演算
- メモリ機能（M+, M-, MR, MC, MS）
- 入力値の管理と検証
- 計算結果の履歴への登録依頼

### 1.2 依存モジュール

| モジュール | 用途 |
|-----------|------|
| display.js | 表示更新の通知 |
| history.js | 計算結果の履歴登録 |

---

## 2. 定数定義

```javascript
/**
 * 計算モード
 */
const CALC_MODES = {
  STANDARD: 'standard',
  SCIENTIFIC: 'scientific',
  PROGRAMMER: 'programmer'
};

/**
 * 演算子
 */
const OPERATORS = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '×',
  DIVIDE: '÷',
  MODULO: 'mod',
  POWER: '^'      // 累乗演算（M-03対応）
};

/**
 * 進数モード（プログラマ電卓）
 */
const BASE_MODES = {
  HEX: 16,
  DEC: 10,
  OCT: 8,
  BIN: 2
};

/**
 * ビット長
 */
const BIT_LENGTHS = {
  BYTE: 8,
  WORD: 16,
  DWORD: 32,
  QWORD: 64
};

/**
 * 角度モード（関数電卓）
 */
const ANGLE_MODES = {
  DEG: 'DEG',
  RAD: 'RAD'
};

/**
 * 制限値
 */
const LIMITS = {
  MAX_DIGITS: 16,           // 最大表示桁数
  MAX_DECIMAL_PLACES: 10,   // 最大小数桁数
  MAX_FACTORIAL: 170,       // 階乗の最大値（171!はInfinity）
  PRECISION: 1e-15          // 浮動小数点精度
};

/**
 * 科学計算関数
 */
const SCIENTIFIC_FUNCTIONS = {
  SIN: 'sin',
  COS: 'cos',
  TAN: 'tan',
  ASIN: 'asin',
  ACOS: 'acos',
  ATAN: 'atan',
  LOG: 'log',
  LN: 'ln',
  LOG2: 'log2',
  SQRT: 'sqrt',
  CBRT: 'cbrt',
  SQUARE: 'square',
  CUBE: 'cube',
  POWER: 'power',
  EXP: 'exp',
  FACTORIAL: 'factorial',
  RECIPROCAL: 'reciprocal',
  ABS: 'abs',
  PI: 'pi',
  E: 'e'
};

/**
 * ビット演算
 */
const BITWISE_OPERATIONS = {
  AND: 'AND',
  OR: 'OR',
  XOR: 'XOR',
  NOT: 'NOT',
  NAND: 'NAND',
  NOR: 'NOR',
  LSH: 'LSH',   // 左シフト
  RSH: 'RSH'    // 右シフト
};
```

---

## 3. 状態管理

```javascript
/**
 * 計算機状態
 */
const calcState = {
  // 現在の入力値（文字列）
  currentValue: '0',

  // 前回の値（演算子入力後）
  previousValue: null,

  // 現在の演算子
  currentOperator: null,

  // 計算モード
  mode: CALC_MODES.STANDARD,

  // 進数モード（プログラマ電卓）
  base: BASE_MODES.DEC,

  // ビット長（プログラマ電卓）
  bitLength: BIT_LENGTHS.DWORD,

  // 角度モード（関数電卓）
  angleMode: ANGLE_MODES.DEG,

  // メモリ値
  memory: 0,

  // 計算完了フラグ（次の入力でクリアするか）
  isResultDisplayed: false,

  // エラー状態
  hasError: false,

  // 式の履歴（表示用）
  expression: ''
};
```

---

## 4. 関数一覧

### 4.1 初期化・設定

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| init() | なし | void | 計算機の初期化 |
| setMode(mode) | mode: string | void | 計算モードを設定 |
| setBase(base) | base: number | void | 進数を設定 |
| setBitLength(length) | length: number | void | ビット長を設定 |
| setAngleMode(mode) | mode: string | void | 角度モードを設定 |
| getState() | なし | object | 現在の状態を取得 |
| setCurrentValue(value) | value: string | void | 現在の値を直接設定（C-02対応） |

### 4.2 入力処理

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| inputNumber(num) | num: string | void | 数字入力 |
| inputOperator(op) | op: string | void | 演算子入力 |
| inputDecimal() | なし | void | 小数点入力 |
| inputHexDigit(digit) | digit: string | void | 16進数字入力（A-F） |
| backspace() | なし | void | 1文字削除 |
| negate() | なし | void | 符号反転 |
| percent() | なし | void | パーセント計算 |

### 4.3 計算処理

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| calculate() | なし | void | 計算実行 |
| performOperation(a, op, b) | a: number, op: string, b: number | number | 二項演算を実行 |
| scientificOperation(func) | func: string | void | 科学計算を実行 |
| bitwiseOperation(op) | op: string | void | ビット演算を実行 |
| toggleBit(index) | index: number | void | 指定ビット位置を反転（C-01対応） |

### 4.4 メモリ操作

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| memoryOperation(op) | op: string | void | メモリ操作（MC/MR/M+/M-/MS） |

### 4.5 クリア操作

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| clear() | なし | void | 全クリア（AC/C） |
| clearEntry() | なし | void | 入力クリア（CE） |

### 4.6 進数変換

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| convertBase(value, fromBase, toBase) | value: string, fromBase: number, toBase: number | string | 進数変換 |
| getValueInAllBases() | なし | object | 全進数での値を取得 |
| getBinaryDisplay() | なし | string | ビット表示用文字列を取得 |

### 4.7 ASCII変換

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| hexToAscii(hex) | hex: string | object | HEX→ASCII変換 |
| asciiToHex(ascii) | ascii: string | object | ASCII→HEX変換 |

### 4.8 ユーティリティ

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| formatNumber(num) | num: number | string | 数値を表示用にフォーマット |
| isValidInput(char) | char: string | boolean | 入力文字の検証 |
| clampTobitLength(value) | value: number | number | ビット長に収まるよう制限 |

---

## 5. 関数詳細設計

### 5.1 inputNumber()

```javascript
/**
 * 数字入力処理
 * @param {string} num - 入力された数字（'0'-'9'）
 */
function inputNumber(num) {
  // エラー状態なら何もしない
  if (calcState.hasError) return;

  // 計算結果表示後は新規入力開始
  if (calcState.isResultDisplayed) {
    calcState.currentValue = '0';
    calcState.isResultDisplayed = false;
  }

  // 桁数制限チェック
  const currentDigits = calcState.currentValue.replace(/[.-]/g, '').length;
  if (currentDigits >= LIMITS.MAX_DIGITS) {
    return;
  }

  // 先頭の0を置換（0のみの場合）
  if (calcState.currentValue === '0' && num !== '0') {
    calcState.currentValue = num;
  } else if (calcState.currentValue === '0' && num === '0') {
    // 0のままにする
  } else {
    calcState.currentValue += num;
  }

  // 表示更新通知
  DisplayManager.update();
}
```

### 5.2 inputOperator()

```javascript
/**
 * 演算子入力処理
 * @param {string} op - 演算子（+, -, ×, ÷）
 */
function inputOperator(op) {
  if (calcState.hasError) return;

  // 前の計算があれば先に実行
  if (calcState.previousValue !== null && calcState.currentOperator !== null) {
    calculate();
    if (calcState.hasError) return;
  }

  // 値と演算子を保存
  calcState.previousValue = parseFloat(calcState.currentValue);
  calcState.currentOperator = op;
  calcState.expression = `${calcState.currentValue} ${op}`;
  calcState.isResultDisplayed = true;

  DisplayManager.update();
}
```

### 5.3 calculate()

```javascript
/**
 * 計算実行
 */
function calculate() {
  if (calcState.hasError) return;
  if (calcState.previousValue === null || calcState.currentOperator === null) {
    return;
  }

  const a = calcState.previousValue;
  const b = parseFloat(calcState.currentValue);
  const op = calcState.currentOperator;

  // 式を完成
  const expression = `${a} ${op} ${b}`;

  // 計算実行
  const result = performOperation(a, op, b);

  // エラーチェック
  if (!isFinite(result) || isNaN(result)) {
    setError(result === Infinity ? 'Infinity' : 'Error');
    return;
  }

  // 結果をフォーマット
  const formattedResult = formatNumber(result);

  // 履歴に追加
  HistoryManager.add({
    expression: expression,
    result: formattedResult,
    mode: calcState.mode
  });

  // 状態更新
  calcState.currentValue = formattedResult;
  calcState.previousValue = null;
  calcState.currentOperator = null;
  calcState.expression = '';
  calcState.isResultDisplayed = true;

  DisplayManager.update();
}
```

### 5.4 performOperation()

```javascript
/**
 * 二項演算を実行
 * @param {number} a - 左オペランド
 * @param {string} op - 演算子
 * @param {number} b - 右オペランド
 * @returns {number} 計算結果
 */
function performOperation(a, op, b) {
  // ビット演算用マスク（プログラマモード）
  const mask = getBitMask();

  switch (op) {
    // 四則演算
    case OPERATORS.ADD:
      return a + b;
    case OPERATORS.SUBTRACT:
      return a - b;
    case OPERATORS.MULTIPLY:
      return a * b;
    case OPERATORS.DIVIDE:
      if (b === 0) return NaN;  // ゼロ除算エラー
      return a / b;
    case OPERATORS.MODULO:
      if (b === 0) return NaN;
      return a % b;

    // 累乗演算（M-03対応）
    case OPERATORS.POWER:
      return Math.pow(a, b);

    // ビット演算（M-02対応）
    case BITWISE_OPERATIONS.AND:
      return (a & b) & mask;
    case BITWISE_OPERATIONS.OR:
      return (a | b) & mask;
    case BITWISE_OPERATIONS.XOR:
      return (a ^ b) & mask;
    case BITWISE_OPERATIONS.NAND:
      return (~(a & b)) & mask;
    case BITWISE_OPERATIONS.NOR:
      return (~(a | b)) & mask;

    default:
      return NaN;
  }
}
```

### 5.5 scientificOperation()

```javascript
/**
 * 科学計算を実行
 * @param {string} func - 関数名
 */
function scientificOperation(func) {
  if (calcState.hasError) return;

  const value = parseFloat(calcState.currentValue);
  let result;

  switch (func) {
    case SCIENTIFIC_FUNCTIONS.SIN:
      result = Math.sin(toRadians(value));
      break;
    case SCIENTIFIC_FUNCTIONS.COS:
      result = Math.cos(toRadians(value));
      break;
    case SCIENTIFIC_FUNCTIONS.TAN:
      result = Math.tan(toRadians(value));
      break;
    case SCIENTIFIC_FUNCTIONS.ASIN:
      if (Math.abs(value) > 1) {
        setError('Error');
        return;
      }
      result = toDegrees(Math.asin(value));
      break;
    case SCIENTIFIC_FUNCTIONS.ACOS:
      if (Math.abs(value) > 1) {
        setError('Error');
        return;
      }
      result = toDegrees(Math.acos(value));
      break;
    case SCIENTIFIC_FUNCTIONS.ATAN:
      result = toDegrees(Math.atan(value));
      break;
    case SCIENTIFIC_FUNCTIONS.LOG:
      if (value <= 0) {
        setError('Error');
        return;
      }
      result = Math.log10(value);
      break;
    case SCIENTIFIC_FUNCTIONS.LN:
      if (value <= 0) {
        setError('Error');
        return;
      }
      result = Math.log(value);
      break;
    case SCIENTIFIC_FUNCTIONS.LOG2:
      if (value <= 0) {
        setError('Error');
        return;
      }
      result = Math.log2(value);
      break;
    case SCIENTIFIC_FUNCTIONS.SQRT:
      if (value < 0) {
        setError('Error');
        return;
      }
      result = Math.sqrt(value);
      break;
    case SCIENTIFIC_FUNCTIONS.CBRT:
      result = Math.cbrt(value);
      break;
    case SCIENTIFIC_FUNCTIONS.SQUARE:
      result = value * value;
      break;
    case SCIENTIFIC_FUNCTIONS.CUBE:
      result = value * value * value;
      break;
    case SCIENTIFIC_FUNCTIONS.EXP:
      result = Math.exp(value);
      break;
    case SCIENTIFIC_FUNCTIONS.FACTORIAL:
      result = factorial(value);
      if (result === null) {
        setError('Error');
        return;
      }
      break;
    case SCIENTIFIC_FUNCTIONS.RECIPROCAL:
      if (value === 0) {
        setError('Error');
        return;
      }
      result = 1 / value;
      break;
    case SCIENTIFIC_FUNCTIONS.ABS:
      result = Math.abs(value);
      break;
    case SCIENTIFIC_FUNCTIONS.PI:
      result = Math.PI;
      break;
    case SCIENTIFIC_FUNCTIONS.E:
      result = Math.E;
      break;
    default:
      return;
  }

  // 無限大・NaNチェック
  if (!isFinite(result)) {
    setError('Infinity');
    return;
  }

  calcState.currentValue = formatNumber(result);
  calcState.isResultDisplayed = true;
  DisplayManager.update();
}
```

### 5.6 bitwiseOperation()

```javascript
/**
 * ビット演算を実行
 * @param {string} op - 演算種別
 */
function bitwiseOperation(op) {
  if (calcState.hasError) return;

  // 整数に変換
  let value = parseInt(calcState.currentValue, calcState.base);

  // ビット長でマスク
  const mask = getBitMask();
  value = value & mask;

  let result;

  switch (op) {
    case BITWISE_OPERATIONS.NOT:
      result = (~value) & mask;
      break;
    case BITWISE_OPERATIONS.LSH:
      result = (value << 1) & mask;
      break;
    case BITWISE_OPERATIONS.RSH:
      result = value >>> 1;
      break;
    // AND, OR, XOR, NAND, NORは二項演算なので別途処理
    default:
      // 二項演算の場合は演算子として保存
      calcState.previousValue = value;
      calcState.currentOperator = op;
      calcState.isResultDisplayed = true;
      DisplayManager.update();
      return;
  }

  // 結果を現在の進数で文字列化
  calcState.currentValue = result.toString(calcState.base).toUpperCase();
  calcState.isResultDisplayed = true;
  DisplayManager.update();
}
```

### 5.7 convertBase()

```javascript
/**
 * 進数変換
 * @param {string} value - 変換元の値
 * @param {number} fromBase - 変換元の基数
 * @param {number} toBase - 変換先の基数
 * @returns {string} 変換後の値
 */
function convertBase(value, fromBase, toBase) {
  // 10進数に変換
  const decimal = parseInt(value, fromBase);

  // NaNチェック
  if (isNaN(decimal)) {
    return '0';
  }

  // 目的の進数に変換
  return decimal.toString(toBase).toUpperCase();
}
```

### 5.8 hexToAscii()

```javascript
/**
 * 16進数をASCII文字列に変換
 * @param {string} hex - 16進数文字列（スペース区切り可）
 * @returns {object} { success: boolean, value: string, error: string }
 */
function hexToAscii(hex) {
  if (!hex || hex.trim() === '') {
    return { success: false, value: '', error: 'ERR-ASC-002' };
  }

  // スペースと不要文字を除去し、2文字ずつに分割
  const cleanHex = hex.replace(/\s/g, '');

  // 16進数文字のみかチェック
  if (!/^[0-9A-Fa-f]+$/.test(cleanHex)) {
    return { success: false, value: '', error: 'ERR-ASC-001' };
  }

  // 奇数桁なら先頭に0を追加
  const paddedHex = cleanHex.length % 2 ? '0' + cleanHex : cleanHex;

  let result = '';
  for (let i = 0; i < paddedHex.length; i += 2) {
    const byte = parseInt(paddedHex.substr(i, 2), 16);
    // 印字可能文字（0x20-0x7E）のみ変換、それ以外は.で表示
    if (byte >= 0x20 && byte <= 0x7E) {
      result += String.fromCharCode(byte);
    } else {
      result += '.';
    }
  }

  return { success: true, value: result, error: null };
}
```

### 5.9 asciiToHex()

```javascript
/**
 * ASCII文字列を16進数に変換
 * @param {string} ascii - ASCII文字列
 * @returns {object} { success: boolean, value: string, error: string }
 */
function asciiToHex(ascii) {
  if (!ascii || ascii === '') {
    return { success: false, value: '', error: 'ERR-ASC-002' };
  }

  let result = [];
  for (let i = 0; i < ascii.length; i++) {
    const code = ascii.charCodeAt(i);
    result.push(code.toString(16).toUpperCase().padStart(2, '0'));
  }

  return { success: true, value: result.join(' '), error: null };
}
```

### 5.10 memoryOperation()（M-01対応）

```javascript
/**
 * メモリ操作
 * @param {string} op - 操作種別（'MC'/'MR'/'M+'/'M-'/'MS'）
 */
function memoryOperation(op) {
  if (calcState.hasError && op !== 'MC') return;

  const currentNum = parseFloat(calcState.currentValue);

  switch (op) {
    case 'MC':  // Memory Clear - メモリをクリア
      calcState.memory = 0;
      break;

    case 'MR':  // Memory Recall - メモリの値を呼び出し
      if (calcState.memory !== 0) {
        calcState.currentValue = formatNumber(calcState.memory);
        calcState.isResultDisplayed = true;
      }
      break;

    case 'M+':  // Memory Add - メモリに加算
      if (!isNaN(currentNum)) {
        calcState.memory += currentNum;
      }
      break;

    case 'M-':  // Memory Subtract - メモリから減算
      if (!isNaN(currentNum)) {
        calcState.memory -= currentNum;
      }
      break;

    case 'MS':  // Memory Store - メモリに保存
      if (!isNaN(currentNum)) {
        calcState.memory = currentNum;
      }
      break;

    default:
      return;
  }

  // 表示更新
  DisplayManager.update();
}
```

### 5.11 setCurrentValue()（C-02対応）

```javascript
/**
 * 現在の値を直接設定（履歴やペースト用）
 * @param {string} value - 設定する値
 */
function setCurrentValue(value) {
  // エラー状態ならクリア
  if (calcState.hasError) {
    clear();
  }

  // 値を設定
  calcState.currentValue = value;
  calcState.isResultDisplayed = true;

  // 演算途中の状態をリセット
  calcState.previousValue = null;
  calcState.currentOperator = null;
  calcState.expression = '';

  // 表示更新
  DisplayManager.update();
}
```

### 5.12 toggleBit()（C-01対応）

```javascript
/**
 * 指定ビット位置を反転（プログラマモード）
 * @param {number} index - ビット位置（0から）
 */
function toggleBit(index) {
  // エラー状態または非プログラマモードなら何もしない
  if (calcState.hasError) return;
  if (calcState.mode !== CALC_MODES.PROGRAMMER) return;

  // 現在の値を整数に変換
  let value = parseInt(calcState.currentValue, calcState.base);
  if (isNaN(value)) {
    value = 0;
  }

  // ビット長チェック
  if (index < 0 || index >= calcState.bitLength) {
    return;
  }

  // 指定ビットを反転（XOR演算）
  const mask = getBitMask();
  const toggled = value ^ (1 << index);
  const clamped = toggled & mask;

  // 結果を現在の進数で文字列化
  calcState.currentValue = clamped.toString(calcState.base).toUpperCase();
  calcState.isResultDisplayed = true;

  // 表示更新
  DisplayManager.update();
}
```

---

## 6. ヘルパー関数

```javascript
/**
 * 度をラジアンに変換
 */
function toRadians(degrees) {
  if (calcState.angleMode === ANGLE_MODES.RAD) {
    return degrees;
  }
  return degrees * (Math.PI / 180);
}

/**
 * ラジアンを度に変換
 */
function toDegrees(radians) {
  if (calcState.angleMode === ANGLE_MODES.RAD) {
    return radians;
  }
  return radians * (180 / Math.PI);
}

/**
 * 階乗計算
 */
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) {
    return null;
  }
  if (n > LIMITS.MAX_FACTORIAL) {
    return Infinity;
  }
  if (n <= 1) return 1;

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * ビットマスクを取得
 */
function getBitMask() {
  switch (calcState.bitLength) {
    case BIT_LENGTHS.BYTE:  return 0xFF;
    case BIT_LENGTHS.WORD:  return 0xFFFF;
    case BIT_LENGTHS.DWORD: return 0xFFFFFFFF;
    case BIT_LENGTHS.QWORD: return Number.MAX_SAFE_INTEGER;
    default: return 0xFFFFFFFF;
  }
}

/**
 * 数値をフォーマット
 */
function formatNumber(num) {
  // 非常に小さい値は0に丸める
  if (Math.abs(num) < LIMITS.PRECISION) {
    return '0';
  }

  // 整数ならそのまま
  if (Number.isInteger(num)) {
    return num.toString();
  }

  // 小数は桁数制限
  const str = num.toPrecision(LIMITS.MAX_DIGITS);
  return parseFloat(str).toString();
}

/**
 * エラー状態を設定
 */
function setError(message) {
  calcState.hasError = true;
  calcState.currentValue = message;
  DisplayManager.update();
}
```

---

## 7. 公開API

```javascript
const Calculator = {
  // 初期化・設定
  init,
  setMode,
  setBase,
  setBitLength,
  setAngleMode,
  getState,
  setCurrentValue,      // C-02対応：値の直接設定

  // 入力処理
  inputNumber,
  inputOperator,
  inputDecimal,
  inputHexDigit,
  backspace,
  negate,
  percent,

  // 計算処理
  calculate,
  scientificOperation,
  bitwiseOperation,
  programmerOperation: bitwiseOperation,
  toggleBit,            // C-01対応：ビット反転

  // メモリ操作
  memoryOperation,

  // クリア操作
  clear,
  clearEntry,

  // 進数変換
  convertBase,
  getValueInAllBases,
  getBinaryDisplay,

  // ASCII変換
  hexToAscii,
  asciiToHex
};
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|------------|----------|--------|
| 2025-12-11 | 1.0 | 初版作成 | Claude Code |
| 2025-12-11 | 1.1 | レビュー指摘対応（C-01, C-02, M-01, M-02, M-03） | Claude Code |
