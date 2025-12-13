# MOD-005 themes.js モジュール設計書

## 文書情報

| 項目 | 内容 |
|------|------|
| モジュールID | MOD-005 |
| ファイル名 | themes.js |
| 責務 | テーマ・ライト/ダークモード管理 |
| 作成日 | 2025-12-11 |

---

## 1. モジュール概要

### 1.1 責務

- 10種類のテーマ切り替え
- ライト/ダークモード切り替え
- LocalStorageへの設定永続化
- システムのダークモード設定検出
- テーマ設定ダイアログのUI制御

### 1.2 依存モジュール

なし（独立モジュール）

---

## 2. 定数定義

```javascript
/**
 * LocalStorageキー
 */
const STORAGE_KEYS = {
  THEME: 'calc_theme',
  DARK_MODE: 'calc_darkMode'
};

/**
 * テーマ一覧
 */
const THEMES = {
  DEFAULT: 'default',
  OCEAN: 'ocean',
  FOREST: 'forest',
  SUNSET: 'sunset',
  MIDNIGHT: 'midnight',
  CHERRY: 'cherry',
  MONO: 'mono',
  NEON: 'neon',
  WOODEN: 'wooden',
  GLASS: 'glass'
};

/**
 * テーマメタデータ
 */
const THEME_META = {
  default: { name: 'Default', description: 'シンプルなグレー基調' },
  ocean: { name: 'Ocean', description: '青・水色のグラデーション' },
  forest: { name: 'Forest', description: '緑・自然をイメージ' },
  sunset: { name: 'Sunset', description: 'オレンジ・赤のグラデーション' },
  midnight: { name: 'Midnight', description: '深い紺・紫' },
  cherry: { name: 'Cherry', description: 'ピンク・桜色' },
  mono: { name: 'Monochrome', description: '白黒のシンプルデザイン' },
  neon: { name: 'Neon', description: '蛍光色・サイバーパンク風' },
  wooden: { name: 'Wooden', description: '木目調・ナチュラル' },
  glass: { name: 'Glass', description: '透明感・ガラス風' }
};

/**
 * モード
 */
const MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};

/**
 * DOM要素ID
 */
const ELEMENT_IDS = {
  SETTINGS_DIALOG: 'settings-dialog',
  THEME_LIST: 'theme-list',
  MODE_TOGGLE: 'mode-toggle',
  BTN_CLOSE_SETTINGS: 'btn-close-settings'
};

/**
 * CSS属性
 */
const CSS_ATTRIBUTES = {
  THEME: 'data-theme',
  MODE: 'data-mode'
};
```

---

## 3. 状態管理

```javascript
/**
 * テーマモジュールの状態
 */
const themeState = {
  // 現在のテーマ
  currentTheme: THEMES.DEFAULT,

  // 現在のモード（light/dark）
  currentMode: MODES.LIGHT,

  // ダイアログ表示状態
  isDialogOpen: false,

  // システムのダークモード設定
  systemPrefersDark: false,

  // DOM要素キャッシュ
  elements: {
    dialog: null,
    themeList: null,
    modeToggle: null,
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
| init() | なし | void | テーマモジュールの初期化 |
| cacheElements() | なし | void | DOM要素をキャッシュ |
| loadFromStorage() | なし | void | 保存された設定を読み込み |
| setupEventListeners() | なし | void | イベントリスナーを設定 |
| detectSystemPreference() | なし | void | システムのダークモード設定を検出 |

### 4.2 テーマ操作

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| setTheme(theme) | theme: string | void | テーマを設定 |
| getTheme() | なし | string | 現在のテーマを取得 |
| getThemeList() | なし | object[] | テーマ一覧を取得 |

### 4.3 モード操作

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| setMode(mode) | mode: string | void | モードを設定 |
| getMode() | なし | string | 現在のモードを取得 |
| toggleMode() | なし | void | モードをトグル |
| isDarkMode() | なし | boolean | ダークモードかどうか |

### 4.4 永続化

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| saveToStorage() | なし | void | 設定をLocalStorageに保存 |

### 4.5 UI操作

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| openDialog() | なし | void | 設定ダイアログを開く |
| closeDialog() | なし | void | 設定ダイアログを閉じる |
| renderThemeList() | なし | void | テーマ一覧を描画 |
| renderThemeItem(theme) | theme: string | HTMLElement | テーマ項目を描画 |
| updateModeToggle() | なし | void | モードトグルの表示を更新 |

### 4.6 適用

| 関数名 | 引数 | 戻り値 | 説明 |
|--------|------|--------|------|
| applyTheme() | なし | void | テーマをDOMに適用 |
| applyMode() | なし | void | モードをDOMに適用 |

---

## 5. 関数詳細設計

### 5.1 init()

```javascript
/**
 * テーマモジュールの初期化
 */
function init() {
  // DOM要素をキャッシュ
  cacheElements();

  // システム設定を検出
  detectSystemPreference();

  // 保存された設定を読み込み
  loadFromStorage();

  // イベントリスナーを設定
  setupEventListeners();

  // テーマとモードを適用
  applyTheme();
  applyMode();

  // テーマリストを描画
  renderThemeList();

  themeState.isInitialized = true;
}
```

### 5.2 detectSystemPreference()

```javascript
/**
 * システムのダークモード設定を検出
 */
function detectSystemPreference() {
  // メディアクエリでシステム設定を検出
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  themeState.systemPrefersDark = mediaQuery.matches;

  // 設定変更を監視
  mediaQuery.addEventListener('change', (e) => {
    themeState.systemPrefersDark = e.matches;

    // LocalStorageに保存がない場合のみ自動切り替え
    if (!localStorage.getItem(STORAGE_KEYS.DARK_MODE)) {
      setMode(e.matches ? MODES.DARK : MODES.LIGHT);
    }
  });
}
```

### 5.3 loadFromStorage()

```javascript
/**
 * 保存された設定を読み込み
 */
function loadFromStorage() {
  try {
    // テーマを読み込み
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      themeState.currentTheme = savedTheme;
    }

    // モードを読み込み
    const savedMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (savedMode !== null) {
      themeState.currentMode = savedMode === 'true' ? MODES.DARK : MODES.LIGHT;
    } else {
      // 保存がなければシステム設定に従う
      themeState.currentMode = themeState.systemPrefersDark ? MODES.DARK : MODES.LIGHT;
    }
  } catch (e) {
    console.error('Failed to load theme settings:', e);
  }
}
```

### 5.4 setupEventListeners()

```javascript
/**
 * イベントリスナーを設定
 */
function setupEventListeners() {
  // モードトグル
  if (themeState.elements.modeToggle) {
    themeState.elements.modeToggle.addEventListener('click', toggleMode);
  }

  // 閉じるボタン
  if (themeState.elements.closeBtn) {
    themeState.elements.closeBtn.addEventListener('click', closeDialog);
  }

  // テーマリストのクリック（イベントデリゲーション）
  if (themeState.elements.themeList) {
    themeState.elements.themeList.addEventListener('click', handleThemeClick);
  }

  // オーバーレイクリックで閉じる
  if (themeState.elements.dialog) {
    themeState.elements.dialog.addEventListener('click', handleOverlayClick);
  }

  // Escapeキーで閉じる
  document.addEventListener('keydown', handleKeydown);
}
```

### 5.5 setTheme()

```javascript
/**
 * テーマを設定
 * @param {string} theme - テーマ名
 */
function setTheme(theme) {
  // 有効なテーマかチェック
  if (!Object.values(THEMES).includes(theme)) {
    console.warn(`Invalid theme: ${theme}`);
    return;
  }

  themeState.currentTheme = theme;

  // DOMに適用
  applyTheme();

  // LocalStorageに保存
  saveToStorage();

  // UIを更新
  updateThemeSelection();
}
```

### 5.6 setMode()

```javascript
/**
 * モードを設定
 * @param {string} mode - 'light' or 'dark'
 */
function setMode(mode) {
  if (mode !== MODES.LIGHT && mode !== MODES.DARK) {
    console.warn(`Invalid mode: ${mode}`);
    return;
  }

  themeState.currentMode = mode;

  // DOMに適用
  applyMode();

  // LocalStorageに保存
  saveToStorage();

  // トグルボタンを更新
  updateModeToggle();
}
```

### 5.7 toggleMode()

```javascript
/**
 * モードをトグル
 */
function toggleMode() {
  const newMode = themeState.currentMode === MODES.LIGHT ? MODES.DARK : MODES.LIGHT;
  setMode(newMode);
}
```

### 5.8 applyTheme()

```javascript
/**
 * テーマをDOMに適用
 */
function applyTheme() {
  document.documentElement.setAttribute(CSS_ATTRIBUTES.THEME, themeState.currentTheme);
}
```

### 5.9 applyMode()

```javascript
/**
 * モードをDOMに適用
 */
function applyMode() {
  document.documentElement.setAttribute(CSS_ATTRIBUTES.MODE, themeState.currentMode);
}
```

### 5.10 saveToStorage()

```javascript
/**
 * 設定をLocalStorageに保存
 */
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, themeState.currentTheme);
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(themeState.currentMode === MODES.DARK));
  } catch (e) {
    console.error('Failed to save theme settings:', e);
  }
}
```

### 5.11 openDialog()

```javascript
/**
 * 設定ダイアログを開く
 */
function openDialog() {
  const dialog = themeState.elements.dialog;
  if (!dialog) return;

  dialog.classList.add('is-open');
  dialog.setAttribute('aria-hidden', 'false');
  themeState.isDialogOpen = true;

  // フォーカス管理
  const firstFocusable = dialog.querySelector('button, [tabindex="0"]');
  if (firstFocusable) {
    firstFocusable.focus();
  }
}
```

### 5.12 closeDialog()

```javascript
/**
 * 設定ダイアログを閉じる
 */
function closeDialog() {
  const dialog = themeState.elements.dialog;
  if (!dialog) return;

  dialog.classList.remove('is-open');
  dialog.setAttribute('aria-hidden', 'true');
  themeState.isDialogOpen = false;
}
```

### 5.13 renderThemeList()

```javascript
/**
 * テーマ一覧を描画
 */
function renderThemeList() {
  const list = themeState.elements.themeList;
  if (!list) return;

  list.innerHTML = '';

  Object.keys(THEMES).forEach(key => {
    const themeId = THEMES[key];
    const item = renderThemeItem(themeId);
    list.appendChild(item);
  });
}
```

### 5.14 renderThemeItem()

```javascript
/**
 * テーマ項目を描画
 * @param {string} themeId - テーマID
 * @returns {HTMLElement} テーマ項目要素
 */
function renderThemeItem(themeId) {
  const meta = THEME_META[themeId];
  const isActive = themeState.currentTheme === themeId;

  const item = document.createElement('div');
  item.className = `theme-item ${isActive ? 'theme-item--active' : ''}`;
  item.dataset.theme = themeId;
  item.tabIndex = 0;
  item.setAttribute('role', 'button');
  item.setAttribute('aria-pressed', String(isActive));

  // プレビュー
  const preview = document.createElement('div');
  preview.className = 'theme-item__preview';
  preview.setAttribute('data-theme', themeId);

  // ラベル
  const label = document.createElement('div');
  label.className = 'theme-item__label';
  label.textContent = meta.name;

  // 説明
  const desc = document.createElement('div');
  desc.className = 'theme-item__desc';
  desc.textContent = meta.description;

  item.appendChild(preview);
  item.appendChild(label);
  item.appendChild(desc);

  return item;
}
```

### 5.15 updateModeToggle()

```javascript
/**
 * モードトグルの表示を更新
 */
function updateModeToggle() {
  const toggle = themeState.elements.modeToggle;
  if (!toggle) return;

  const isDark = themeState.currentMode === MODES.DARK;

  // アイコンを更新
  toggle.innerHTML = isDark ? '☀' : '🌙';

  // aria-label更新
  toggle.setAttribute('aria-label', isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え');

  // 状態クラス更新
  toggle.classList.toggle('mode-toggle--dark', isDark);
}
```

### 5.16 handleThemeClick()

```javascript
/**
 * テーマリストのクリックハンドラ
 * @param {Event} event - クリックイベント
 */
function handleThemeClick(event) {
  const item = event.target.closest('.theme-item');
  if (!item) return;

  const theme = item.dataset.theme;
  if (theme) {
    setTheme(theme);
  }
}
```

### 5.17 updateThemeSelection()

```javascript
/**
 * テーマ選択状態を更新
 */
function updateThemeSelection() {
  const list = themeState.elements.themeList;
  if (!list) return;

  // 全項目のアクティブ状態をリセット
  list.querySelectorAll('.theme-item').forEach(item => {
    const isActive = item.dataset.theme === themeState.currentTheme;
    item.classList.toggle('theme-item--active', isActive);
    item.setAttribute('aria-pressed', String(isActive));
  });
}
```

---

## 6. 公開API

```javascript
const ThemeManager = {
  init,
  setTheme,
  getTheme,
  getThemeList,
  setMode,
  getMode,
  toggleMode,
  isDarkMode,
  openDialog,
  closeDialog
};
```

---

## 7. CSS連携

### 7.1 CSS変数構造

```css
:root[data-theme="default"][data-mode="light"] {
  --color-bg-primary: #f5f5f5;
  --color-bg-secondary: #ffffff;
  --color-text-primary: #333333;
  --color-text-secondary: #666666;
  --color-accent: #007bff;
  --color-btn-number: #ffffff;
  --color-btn-operator: #f0f0f0;
  --color-btn-function: #e0e0e0;
  --color-btn-equals: #007bff;
  --color-display-bg: #ffffff;
  --shadow-btn: 0 2px 4px rgba(0,0,0,0.1);
}

:root[data-theme="default"][data-mode="dark"] {
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2d2d2d;
  --color-text-primary: #ffffff;
  --color-text-secondary: #b0b0b0;
  /* ... */
}
```

### 7.2 必要なCSSクラス

```css
/* 設定ダイアログ */
.settings-dialog { }
.settings-dialog.is-open { }
.settings-dialog__overlay { }
.settings-dialog__content { }

/* テーマリスト */
.theme-list { }
.theme-item { }
.theme-item--active { }
.theme-item__preview { }
.theme-item__label { }
.theme-item__desc { }

/* モードトグル */
.mode-toggle { }
.mode-toggle--dark { }
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|------------|----------|--------|
| 2025-12-11 | 1.0 | 初版作成 | Claude Code |
