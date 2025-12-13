# MOD-004 history.js モジュール設計書

## 文書情報

| 項目 | 内容 |
|------|------|
| モジュールID | MOD-004 |
| ファイル名 | history.js |
| 責務 | 計算履歴の管理 |
| 作成日 | 2025-12-11 |

---

## 1. モジュール概要

### 1.1 責務

- 計算履歴の追加・取得・削除
- LocalStorageへの永続化
- 履歴パネルのUI制御
- 履歴項目クリック時の値反映

### 1.2 依存モジュール

| モジュール | 用途 |
|-----------|------|
| calculator.js | 履歴項目クリック時の値設定 |
| display.js | 表示更新の通知 |

---

## 2. 定数定義

```javascript
/**
 * LocalStorageキー
 */
const STORAGE_KEY = 'calc_history';

/**
 * 履歴制限
 */
const HISTORY_LIMITS = {
  MAX_ENTRIES: 100,    // 最大履歴件数
  MAX_EXPR_LENGTH: 50  // 式の最大表示文字数
};

/**
 * DOM要素ID
 */
const ELEMENT_IDS = {
  HISTORY_PANEL: 'history-panel',
  HISTORY_LIST: 'history-list',
  HISTORY_EMPTY: 'history-empty',
  BTN_CLEAR_HISTORY: 'btn-clear-history',
  BTN_CLOSE_HISTORY: 'btn-close-history'
};

/**
 * 確認メッセージ
 */
const MESSAGES = {
  CONFIRM_CLEAR: '履歴をすべて削除しますか？',
  CLEARED: '履歴を削除しました',
  COPIED: 'コピーしました'
};
```

---

## 3. データ構造

### 3.1 履歴エントリ

```javascript
/**
 * 履歴エントリの構造
 * @typedef {Object} HistoryEntry
 * @property {string} id - 一意のID（タイムスタンプベース）
 * @property {string} expression - 計算式（例: "10 + 5"）
 * @property {string} result - 計算結果（例: "15"）
 * @property {string} mode - 計算モード（standard/scientific/programmer）
 * @property {number} timestamp - 作成日時（ミリ秒）
 */

// 例:
{
  id: "hist_1702281600000",
  expression: "10 + 5",
  result: "15",
  mode: "standard",
  timestamp: 1702281600000
}
```

### 3.2 状態管理

```javascript
/**
 * 履歴モジュールの状態
 */
const historyState = {
  // 履歴データ配列
  entries: [],

  // パネル表示状態
  isPanelOpen: false,

  // DOM要素キャッシュ
  elements: {
    panel: null,
    list: null,
    empty: null,
    clearBtn: null,
    closeBtn: null
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
| init() | なし | void | 履歴モジュールの初期化 |
| cacheElements() | なし | void | DOM要素をキャッシュ |
| loadFromStorage() | なし | void | LocalStorageから読み込み |
| setupEventListeners() | なし | void | イベントリスナーを設定 |

### 4.2 CRUD操作

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| add(entry) | entry: object | void | 履歴を追加 |
| get(id) | id: string | HistoryEntry | 指定IDの履歴を取得 |
| getAll() | なし | HistoryEntry[] | 全履歴を取得 |
| remove(id) | id: string | void | 指定IDの履歴を削除 |
| clear() | なし | void | 全履歴を削除 |

### 4.3 永続化

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| saveToStorage() | なし | void | LocalStorageに保存 |
| loadFromStorage() | なし | void | LocalStorageから読み込み |

### 4.4 UI操作

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| openPanel() | なし | void | 履歴パネルを開く |
| closePanel() | なし | void | 履歴パネルを閉じる |
| togglePanel() | なし | void | パネル開閉をトグル |
| render() | なし | void | 履歴リストを描画 |
| renderEntry(entry) | entry: HistoryEntry | HTMLElement | 履歴項目を描画 |
| showEmptyMessage() | なし | void | 空メッセージを表示 |
| hideEmptyMessage() | なし | void | 空メッセージを非表示 |

### 4.5 ユーティリティ

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| generateId() | なし | string | 一意のIDを生成 |
| truncateExpression(expr) | expr: string | string | 長い式を省略 |
| formatTimestamp(ts) | ts: number | string | 日時をフォーマット |
| copyToClipboard(text) | text: string | Promise | クリップボードにコピー |

---

## 5. 関数詳細設計

### 5.1 init()

```javascript
/**
 * 履歴モジュールの初期化
 */
function init() {
  // DOM要素をキャッシュ
  cacheElements();

  // LocalStorageから読み込み
  loadFromStorage();

  // イベントリスナーを設定
  setupEventListeners();

  // 初期表示
  render();

  historyState.isInitialized = true;
}
```

### 5.2 cacheElements()

```javascript
/**
 * DOM要素をキャッシュ
 */
function cacheElements() {
  historyState.elements.panel = document.getElementById(ELEMENT_IDS.HISTORY_PANEL);
  historyState.elements.list = document.getElementById(ELEMENT_IDS.HISTORY_LIST);
  historyState.elements.empty = document.getElementById(ELEMENT_IDS.HISTORY_EMPTY);
  historyState.elements.clearBtn = document.getElementById(ELEMENT_IDS.BTN_CLEAR_HISTORY);
  historyState.elements.closeBtn = document.getElementById(ELEMENT_IDS.BTN_CLOSE_HISTORY);
}
```

### 5.3 setupEventListeners()

```javascript
/**
 * イベントリスナーを設定
 */
function setupEventListeners() {
  // クリアボタン
  if (historyState.elements.clearBtn) {
    historyState.elements.clearBtn.addEventListener('click', handleClearClick);
  }

  // 閉じるボタン
  if (historyState.elements.closeBtn) {
    historyState.elements.closeBtn.addEventListener('click', closePanel);
  }

  // 履歴リストのイベントデリゲーション
  if (historyState.elements.list) {
    historyState.elements.list.addEventListener('click', handleListClick);
  }

  // パネル外クリックで閉じる（モバイル）
  document.addEventListener('click', handleOutsideClick);

  // Escapeキーで閉じる
  document.addEventListener('keydown', handleKeydown);
}
```

### 5.4 add()

```javascript
/**
 * 履歴を追加
 * @param {Object} entry - 追加する履歴データ
 * @param {string} entry.expression - 計算式
 * @param {string} entry.result - 計算結果
 * @param {string} entry.mode - 計算モード
 */
function add(entry) {
  const newEntry = {
    id: generateId(),
    expression: entry.expression,
    result: entry.result,
    mode: entry.mode,
    timestamp: Date.now()
  };

  // 先頭に追加
  historyState.entries.unshift(newEntry);

  // 最大件数を超えたら古いものを削除
  if (historyState.entries.length > HISTORY_LIMITS.MAX_ENTRIES) {
    historyState.entries.pop();
  }

  // LocalStorageに保存
  saveToStorage();

  // UIを更新
  render();
}
```

### 5.5 clear()

```javascript
/**
 * 全履歴を削除
 */
function clear() {
  historyState.entries = [];
  saveToStorage();
  render();
}
```

### 5.6 saveToStorage()

```javascript
/**
 * LocalStorageに保存
 */
function saveToStorage() {
  try {
    const json = JSON.stringify(historyState.entries);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    console.error('Failed to save history:', e);
  }
}
```

### 5.7 loadFromStorage()

```javascript
/**
 * LocalStorageから読み込み
 */
function loadFromStorage() {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (json) {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        // 最大件数に制限
        historyState.entries = parsed.slice(0, HISTORY_LIMITS.MAX_ENTRIES);
      }
    }
  } catch (e) {
    console.error('Failed to load history:', e);
    historyState.entries = [];
  }
}
```

### 5.8 openPanel()

```javascript
/**
 * 履歴パネルを開く
 */
function openPanel() {
  const panel = historyState.elements.panel;
  if (!panel) return;

  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  historyState.isPanelOpen = true;

  // フォーカストラップ（アクセシビリティ）
  const firstFocusable = panel.querySelector('button, [tabindex="0"]');
  if (firstFocusable) {
    firstFocusable.focus();
  }
}
```

### 5.9 closePanel()

```javascript
/**
 * 履歴パネルを閉じる
 */
function closePanel() {
  const panel = historyState.elements.panel;
  if (!panel) return;

  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  historyState.isPanelOpen = false;
}
```

### 5.10 render()

```javascript
/**
 * 履歴リストを描画
 */
function render() {
  const list = historyState.elements.list;
  if (!list) return;

  // リストをクリア
  list.innerHTML = '';

  // 履歴が空の場合
  if (historyState.entries.length === 0) {
    showEmptyMessage();
    return;
  }

  hideEmptyMessage();

  // 各エントリを描画
  historyState.entries.forEach(entry => {
    const element = renderEntry(entry);
    list.appendChild(element);
  });
}
```

### 5.11 renderEntry()

```javascript
/**
 * 履歴項目を描画
 * @param {HistoryEntry} entry - 履歴エントリ
 * @returns {HTMLElement} 履歴項目要素
 */
function renderEntry(entry) {
  const item = document.createElement('div');
  item.className = 'history__item';
  item.dataset.id = entry.id;
  item.tabIndex = 0;
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `${entry.expression} = ${entry.result}`);

  // 式表示
  const expr = document.createElement('div');
  expr.className = 'history__expression';
  expr.textContent = truncateExpression(entry.expression);

  // 結果表示
  const result = document.createElement('div');
  result.className = 'history__result';
  result.textContent = entry.result;

  // 時刻表示
  const time = document.createElement('div');
  time.className = 'history__time';
  time.textContent = formatTimestamp(entry.timestamp);

  // コピーボタン
  const copyBtn = document.createElement('button');
  copyBtn.className = 'history__copy-btn';
  copyBtn.textContent = 'コピー';
  copyBtn.dataset.action = 'copy';
  copyBtn.dataset.value = entry.result;
  copyBtn.setAttribute('aria-label', '結果をコピー');

  // 削除ボタン
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'history__delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.dataset.action = 'delete';
  deleteBtn.setAttribute('aria-label', 'この履歴を削除');

  // 組み立て
  item.appendChild(expr);
  item.appendChild(result);
  item.appendChild(time);
  item.appendChild(copyBtn);
  item.appendChild(deleteBtn);

  return item;
}
```

### 5.12 handleListClick()

```javascript
/**
 * 履歴リストのクリックハンドラ
 * @param {Event} event - クリックイベント
 */
function handleListClick(event) {
  const target = event.target;

  // コピーボタン
  if (target.dataset.action === 'copy') {
    const value = target.dataset.value;
    copyToClipboard(value).then(() => {
      showToast(MESSAGES.COPIED);
    });
    return;
  }

  // 削除ボタン
  if (target.dataset.action === 'delete') {
    const item = target.closest('.history__item');
    if (item) {
      remove(item.dataset.id);
    }
    return;
  }

  // 履歴項目クリック（結果を計算機に反映）
  const item = target.closest('.history__item');
  if (item) {
    const entry = get(item.dataset.id);
    if (entry) {
      Calculator.setCurrentValue(entry.result);
      DisplayManager.update();
      closePanel();
    }
  }
}
```

### 5.13 handleClearClick()

```javascript
/**
 * クリアボタンのクリックハンドラ
 */
function handleClearClick() {
  // 確認ダイアログ
  if (confirm(MESSAGES.CONFIRM_CLEAR)) {
    clear();
    showToast(MESSAGES.CLEARED);
  }
}
```

### 5.14 ユーティリティ関数

```javascript
/**
 * 一意のIDを生成
 * @returns {string} ID
 */
function generateId() {
  return `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 長い式を省略
 * @param {string} expr - 計算式
 * @returns {string} 省略された式
 */
function truncateExpression(expr) {
  if (expr.length <= HISTORY_LIMITS.MAX_EXPR_LENGTH) {
    return expr;
  }
  return expr.slice(0, HISTORY_LIMITS.MAX_EXPR_LENGTH - 3) + '...';
}

/**
 * タイムスタンプをフォーマット
 * @param {number} timestamp - ミリ秒
 * @returns {string} フォーマットされた日時
 */
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  // 今日なら時刻のみ
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  }

  // 今年なら月日+時刻
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }) +
           ' ' + date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  }

  // それ以外は年月日
  return date.toLocaleDateString('ja-JP');
}

/**
 * クリップボードにコピー
 * @param {string} text - コピーするテキスト
 * @returns {Promise<void>}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // フォールバック
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

/**
 * トースト通知を表示
 * @param {string} message - メッセージ
 */
function showToast(message) {
  // 簡易トースト実装
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast--show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('toast--show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}
```

---

## 6. 公開API

```javascript
const HistoryManager = {
  init,
  add,
  get,
  getAll,
  remove,
  clear,
  openPanel,
  closePanel,
  togglePanel
};
```

---

## 7. CSS連携

### 7.1 必要なCSSクラス

```css
/* 履歴パネル */
.history-panel { }
.history-panel.is-open { }

/* 履歴リスト */
.history__list { }

/* 履歴項目 */
.history__item { }
.history__item:hover { }
.history__item:focus { }
.history__expression { }
.history__result { }
.history__time { }
.history__copy-btn { }
.history__delete-btn { }

/* 空メッセージ */
.history__empty { }

/* トースト */
.toast { }
.toast--show { }
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|------------|----------|--------|
| 2025-12-11 | 1.0 | 初版作成 | Claude Code |
