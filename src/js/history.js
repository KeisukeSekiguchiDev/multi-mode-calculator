/**
 * History Manager Module
 * T-130: Manages calculation history (CRUD operations)
 * T-131: LocalStorage persistence with LRU strategy
 */

const HistoryManager = (function() {
  'use strict';

  // ========================================
  // Constants
  // ========================================

  /**
   * Maximum number of history items to store
   * @constant {number}
   */
  const MAX_HISTORY_ITEMS = 100;

  /**
   * LocalStorage key for history data
   * @constant {string}
   */
  const STORAGE_KEY = 'calc_history';

  // ========================================
  // State
  // ========================================

  /**
   * In-memory history array
   * @type {Array<HistoryItem>}
   */
  let history = [];

  // ========================================
  // History Item Structure
  // ========================================

  /**
   * @typedef {Object} HistoryItem
   * @property {string} expression - Calculation expression (e.g., "10 + 5")
   * @property {string} result - Calculation result (e.g., "15")
   * @property {string} mode - Calculator mode ('standard' | 'scientific' | 'programmer')
   * @property {string} timestamp - ISO 8601 timestamp
   */

  // ========================================
  // Public API: Initialization
  // ========================================

  /**
   * Initialize history manager
   * Loads history from localStorage
   * @returns {boolean} true if initialization succeeded
   */
  function init() {
    loadFromStorage();
    return true;
  }

  // ========================================
  // Public API: CRUD Operations (T-130)
  // ========================================

  /**
   * Add a calculation to history
   * - Validates input data
   * - Adds timestamp automatically
   * - Maintains MAX_HISTORY_ITEMS limit (LRU)
   * - Persists to localStorage
   *
   * @param {Object} entry - History entry
   * @param {string} entry.expression - Calculation expression
   * @param {string} entry.result - Calculation result
   * @param {string} [entry.mode='standard'] - Calculator mode
   * @returns {void}
   */
  function add(entry) {
    // Validation
    if (!entry ||
        typeof entry.expression !== 'string' ||
        typeof entry.result !== 'string' ||
        entry.expression.trim() === '' ||
        entry.result.trim() === '') {
      return;
    }

    // Create history item with metadata
    const historyItem = {
      expression: entry.expression,
      result: entry.result,
      mode: entry.mode || 'standard',
      timestamp: new Date().toISOString()
    };

    // Add to the beginning (newest first)
    history.unshift(historyItem);

    // Apply LRU: Keep only MAX_HISTORY_ITEMS (oldest items are removed)
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    // Persist to localStorage
    saveToStorage();
  }

  /**
   * Get all history items
   * Returns a copy to prevent external mutation
   *
   * @returns {Array<HistoryItem>} Array of history items (newest first)
   */
  function getAll() {
    return [...history];
  }

  /**
   * Delete a specific history item by index
   *
   * @param {number} index - Index of the item to delete (0-based)
   * @returns {void}
   */
  function deleteHistoryItem(index) {
    // Validation
    if (typeof index !== 'number' || index < 0 || index >= history.length) {
      return;
    }

    // Remove item at index
    history.splice(index, 1);

    // Persist to localStorage
    saveToStorage();
  }

  /**
   * Clear all history
   * Removes all items from memory and localStorage
   *
   * @returns {void}
   */
  function clear() {
    history = [];
    saveToStorage();
  }

  // ========================================
  // Public API: LocalStorage Persistence (T-131)
  // ========================================

  /**
   * Load history from localStorage
   * - Handles JSON parsing errors
   * - Applies MAX_HISTORY_ITEMS limit
   * - Falls back to empty array on error
   *
   * @returns {void}
   */
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        history = [];
        return;
      }

      const parsed = JSON.parse(stored);

      // Validate that parsed data is an array
      if (!Array.isArray(parsed)) {
        console.warn('Invalid history data in localStorage, resetting to empty');
        history = [];
        return;
      }

      // Apply MAX_HISTORY_ITEMS limit (LRU: keep newest items)
      history = parsed.slice(0, MAX_HISTORY_ITEMS);

    } catch (error) {
      console.warn('Failed to load history from localStorage:', error);
      history = [];
    }
  }

  /**
   * Save history to localStorage
   * - Serializes history array to JSON
   * - Handles quota exceeded errors gracefully
   *
   * @returns {void}
   */
  function saveToStorage() {
    try {
      const json = JSON.stringify(history);
      localStorage.setItem(STORAGE_KEY, json);
    } catch (error) {
      // Handle QuotaExceededError or other storage errors
      console.warn('Failed to save history to localStorage:', error);

      // Optional: Try to free up space by removing oldest items
      if (error.name === 'QuotaExceededError' && history.length > 10) {
        history = history.slice(0, 50); // Keep only 50 newest items
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (retryError) {
          console.error('Failed to save history even after reducing size:', retryError);
        }
      }
    }
  }

  // ========================================
  // UI Control: History Panel (T-132)
  // ========================================

  /**
   * Open history panel
   * Note: Selectors match index.html (#history-panel)
   */
  function openPanel() {
    const panel = document.getElementById('history-panel');

    if (panel) {
      panel.classList.remove('calculator__history--hidden');
      panel.setAttribute('aria-hidden', 'false');
      renderHistoryList();
    }
  }

  /**
   * Close history panel
   */
  function closePanel() {
    const panel = document.getElementById('history-panel');

    if (panel) {
      panel.classList.add('calculator__history--hidden');
      panel.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Toggle history panel
   */
  function togglePanel() {
    const panel = document.getElementById('history-panel');
    if (panel && panel.getAttribute('aria-hidden') === 'false') {
      closePanel();
    } else {
      openPanel();
    }
  }

  /**
   * Render history items to the panel
   * Note: Selectors match index.html (#history-list)
   */
  function renderHistoryList() {
    const listContainer = document.getElementById('history-list');
    if (!listContainer) return;

    // Clear existing items
    listContainer.innerHTML = '';

    // Render each history item (empty state handled by HTML element)
    history.forEach(function(item, index) {
      const historyItem = createHistoryItemElement(item, index);
      listContainer.appendChild(historyItem);
    });
  }

  /**
   * Create a history item DOM element
   * @param {HistoryItem} item - History item data
   * @param {number} index - Item index
   * @returns {HTMLElement} History item element
   */
  function createHistoryItemElement(item, index) {
    const itemEl = document.createElement('div');
    itemEl.className = 'calculator__history-item';
    itemEl.setAttribute('data-index', index);
    itemEl.setAttribute('role', 'listitem');
    itemEl.setAttribute('tabindex', '0');

    // Expression
    const expressionEl = document.createElement('div');
    expressionEl.className = 'calculator__history-expression';
    expressionEl.textContent = item.expression;

    // Result
    const resultEl = document.createElement('div');
    resultEl.className = 'calculator__history-result';
    resultEl.textContent = '= ' + item.result;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'calculator__history-delete';
    deleteBtn.setAttribute('aria-label', '削除');
    deleteBtn.innerHTML = '&times;';
    deleteBtn.addEventListener('click', function(event) {
      event.stopPropagation();
      handleDeleteClick(index);
    });

    // Assemble
    itemEl.appendChild(expressionEl);
    itemEl.appendChild(resultEl);
    itemEl.appendChild(deleteBtn);

    // Click handler (T-133)
    itemEl.addEventListener('click', function() {
      handleItemClick(item);
    });

    // Keyboard support
    itemEl.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleItemClick(item);
      }
    });

    return itemEl;
  }

  // ========================================
  // UI Control: History Item Click (T-133)
  // ========================================

  /**
   * Handle history item click
   * Loads the calculation result into the calculator
   * @param {HistoryItem} item - Clicked history item
   */
  function handleItemClick(item) {
    if (typeof Calculator !== 'undefined' && typeof Calculator.setCurrentValue === 'function') {
      Calculator.setCurrentValue(item.result);

      if (typeof DisplayManager !== 'undefined') {
        DisplayManager.update();
      }
    }

    // Close panel after selection
    closePanel();
  }

  /**
   * Handle delete button click
   * @param {number} index - Index of item to delete
   */
  function handleDeleteClick(index) {
    deleteHistoryItem(index);
    renderHistoryList();
  }

  /**
   * Bind history panel events
   * Note: Event binding handled by main.js bindPanelControlEvents()
   * This function provides additional binding if needed
   */
  function bindPanelEvents() {
    // History button (ID based)
    const historyBtn = document.getElementById('btn-history');
    if (historyBtn) {
      historyBtn.addEventListener('click', togglePanel);
    }

    // Close button (ID based)
    const closeBtn = document.getElementById('btn-history-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closePanel);
    }

    // Clear all button (ID based)
    const clearBtn = document.getElementById('btn-history-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        clear();
        renderHistoryList();
      });
    }
  }

  // ========================================
  // Public API Export
  // ========================================

  return {
    // Initialization
    init,

    // CRUD operations (T-130)
    add,
    getAll,
    deleteHistoryItem,
    clear,
    clearHistory: clear, // Alias for compatibility

    // UI Control (T-132)
    openPanel,
    closePanel,
    togglePanel,
    renderHistoryList,
    refreshPanel: renderHistoryList, // Alias for refreshing panel
    bindPanelEvents,

    // Internal methods (exposed for testing)
    _test: {
      loadFromStorage,
      saveToStorage,
      handleItemClick,
      createHistoryItemElement
    }
  };
})();
