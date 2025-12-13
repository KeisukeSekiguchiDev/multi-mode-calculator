/**
 * Keyboard Handler Module
 * T-150: Keyboard event monitoring
 * T-151: Key mapping processing
 * T-152: Shortcut key processing
 */

const KeyboardHandler = (function() {
  'use strict';

  // Key mappings for standard mode
  const STANDARD_KEY_MAP = {
    // Numbers
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

    // Operators
    '+': { action: 'operator', value: '+' },
    '-': { action: 'operator', value: '-' },
    '*': { action: 'operator', value: '×' },
    '/': { action: 'operator', value: '÷' },
    '%': { action: 'percent', value: null },

    // Decimal
    '.': { action: 'decimal', value: null },
    ',': { action: 'decimal', value: null },

    // Calculation
    'Enter': { action: 'equals', value: null },
    '=': { action: 'equals', value: null },

    // Clear
    'Escape': { action: 'clear', value: null },
    'Delete': { action: 'clear-entry', value: null },
    'Backspace': { action: 'backspace', value: null }
  };

  // Key mappings for programmer mode (additional)
  const PROGRAMMER_KEY_MAP = {
    // Hex digits
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

    // Bitwise operators
    '&': { action: 'bitwise', value: 'AND' },
    '|': { action: 'bitwise', value: 'OR' },
    '^': { action: 'bitwise', value: 'XOR' },
    '~': { action: 'bitwise', value: 'NOT' },
    '<': { action: 'bitwise', value: 'LSH' },
    '>': { action: 'bitwise', value: 'RSH' }
  };

  // Shortcut keys (Ctrl/Cmd + key)
  const SHORTCUT_MAP = {
    'c': { action: 'copy', value: null },
    'v': { action: 'paste', value: null },
    'h': { action: 'history', value: null },
    ',': { action: 'settings', value: null },
    'z': { action: 'undo', value: null }
  };

  // Function keys
  const FUNCTION_KEY_MAP = {
    'F1': { action: 'help', value: null },
    'F9': { action: 'negate', value: null }
  };

  // Keys to ignore
  const IGNORED_KEYS = ['Tab', 'CapsLock', 'Shift', 'Control', 'Alt', 'Meta'];

  // Module state
  const keyboardState = {
    isEnabled: true,
    currentMode: 'standard',
    modifiers: {
      ctrl: false,
      alt: false,
      shift: false,
      meta: false
    },
    isInitialized: false
  };

  /**
   * Initialize keyboard module
   */
  function init() {
    if (keyboardState.isInitialized) return;

    setupEventListeners();
    keyboardState.isInitialized = true;
    return true;
  }

  /**
   * Setup event listeners
   */
  function setupEventListeners() {
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    // Reset modifiers on window blur
    window.addEventListener('blur', function() {
      keyboardState.modifiers = {
        ctrl: false,
        alt: false,
        shift: false,
        meta: false
      };
    });
  }

  /**
   * Handle keydown event
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeydown(event) {
    if (!keyboardState.isEnabled) return;

    // Skip if focus is on input element
    if (isInputElement(event.target)) return;

    // Update modifier state
    updateModifiers(event);

    const key = event.key;

    // Ignore modifier keys
    if (IGNORED_KEYS.includes(key)) return;

    // Handle shortcuts (Ctrl/Cmd + key)
    if (keyboardState.modifiers.ctrl || keyboardState.modifiers.meta) {
      const shortcutKey = key.toLowerCase();
      if (SHORTCUT_MAP[shortcutKey]) {
        event.preventDefault();
        executeShortcut(shortcutKey);
        return;
      }
    }

    // Handle function keys
    if (FUNCTION_KEY_MAP[key]) {
      event.preventDefault();
      executeAction(FUNCTION_KEY_MAP[key]);
      return;
    }

    // Handle regular keys
    const mapping = getKeyMapping(key, keyboardState.currentMode);
    if (mapping) {
      event.preventDefault();
      executeAction(mapping);
    }
  }

  /**
   * Handle keyup event
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeyup(event) {
    updateModifiers(event);
  }

  /**
   * Update modifier key state
   * @param {KeyboardEvent} event - Keyboard event
   */
  function updateModifiers(event) {
    keyboardState.modifiers.ctrl = event.ctrlKey;
    keyboardState.modifiers.alt = event.altKey;
    keyboardState.modifiers.shift = event.shiftKey;
    keyboardState.modifiers.meta = event.metaKey;
  }

  /**
   * Get action for a key
   * @param {string} key - Pressed key
   * @param {string} mode - Calculator mode
   * @returns {object|null} Action object
   */
  function getKeyMapping(key, mode) {
    // Search in standard key map
    if (STANDARD_KEY_MAP[key]) {
      return STANDARD_KEY_MAP[key];
    }

    // For programmer mode, search additional keys
    if (mode === 'programmer' && PROGRAMMER_KEY_MAP[key]) {
      // Check if key is valid for current base
      if (typeof Calculator !== 'undefined') {
        const state = Calculator.getState();
        if (isValidForBase(key, state.base)) {
          return PROGRAMMER_KEY_MAP[key];
        }
      } else {
        return PROGRAMMER_KEY_MAP[key];
      }
    }

    return null;
  }

  /**
   * Check if key is valid for the given base
   * @param {string} key - Key
   * @param {number} base - Base (2, 8, 10, 16)
   * @returns {boolean} Is valid
   */
  function isValidForBase(key, base) {
    const upperKey = key.toUpperCase();

    // Digit keys
    if (/^[0-9]$/.test(key)) {
      const digit = parseInt(key);
      return digit < base;
    }

    // Hex digits (A-F)
    if (/^[A-F]$/.test(upperKey)) {
      return base === 16;
    }

    // Operators are always valid
    return true;
  }

  /**
   * Execute action
   * @param {object} action - Action object
   */
  function executeAction(action) {
    if (typeof Calculator === 'undefined') {
      console.warn('Calculator module not available');
      return;
    }

    switch (action.action) {
      case 'number':
        Calculator.inputNumber(action.value);
        break;

      case 'hex':
        if (typeof Calculator.inputHexDigit === 'function') {
          Calculator.inputHexDigit(action.value);
        } else {
          Calculator.inputNumber(action.value);
        }
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
        if (typeof Calculator.clearEntry === 'function') {
          Calculator.clearEntry();
        } else {
          Calculator.clear();
        }
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
        if (typeof Calculator.bitwiseOperation === 'function') {
          Calculator.bitwiseOperation(action.value);
        }
        break;

      case 'help':
        console.log('Keyboard shortcuts: 0-9, +, -, *, /, Enter, Escape, Backspace');
        break;

      default:
        console.warn('Unknown action:', action.action);
    }

    // Update display
    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Execute shortcut
   * @param {string} key - Shortcut key (lowercase)
   */
  function executeShortcut(key) {
    const shortcut = SHORTCUT_MAP[key];
    if (!shortcut) return;

    switch (shortcut.action) {
      case 'copy':
        copyToClipboard();
        break;

      case 'paste':
        pasteFromClipboard();
        break;

      case 'history':
        if (typeof HistoryManager !== 'undefined' && typeof HistoryManager.togglePanel === 'function') {
          HistoryManager.togglePanel();
        } else {
          // Toggle history panel via DOM
          const historyPanel = document.querySelector('.history-panel');
          if (historyPanel) {
            historyPanel.classList.toggle('history-panel--open');
          }
        }
        break;

      case 'settings':
        if (typeof ThemeManager !== 'undefined' && typeof ThemeManager.openDialog === 'function') {
          ThemeManager.openDialog();
        } else {
          // Toggle settings dialog via DOM
          const settingsDialog = document.querySelector('.settings-dialog');
          if (settingsDialog) {
            settingsDialog.classList.toggle('settings-dialog--open');
          }
        }
        break;

      case 'undo':
        console.log('Undo not implemented');
        break;
    }
  }

  /**
   * Copy current value to clipboard
   */
  function copyToClipboard() {
    let value = '0';

    if (typeof Calculator !== 'undefined') {
      const state = Calculator.getState();
      value = state.currentValue || '0';
    } else {
      // Try to get from display
      const display = document.querySelector('.calculator__result');
      if (display) {
        value = display.textContent.trim();
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function() {
        showCopyFeedback();
      }).catch(function(err) {
        console.error('Copy failed:', err);
      });
    }
  }

  /**
   * Paste from clipboard
   */
  function pasteFromClipboard() {
    if (navigator.clipboard && navigator.clipboard.readText) {
      navigator.clipboard.readText().then(function(text) {
        const cleanText = text.trim();
        // Validate numeric input
        if (/^-?\d*\.?\d+$/.test(cleanText)) {
          if (typeof Calculator !== 'undefined' && typeof Calculator.setCurrentValue === 'function') {
            Calculator.setCurrentValue(cleanText);
            if (typeof DisplayManager !== 'undefined') {
              DisplayManager.update();
            }
          }
        }
      }).catch(function(err) {
        console.error('Paste failed:', err);
      });
    }
  }

  /**
   * Show copy feedback
   */
  function showCopyFeedback() {
    const display = document.querySelector('.calculator__display');
    if (!display) return;

    display.classList.add('calculator__display--copied');
    setTimeout(function() {
      display.classList.remove('calculator__display--copied');
    }, 300);
  }

  /**
   * Check if element is an input element
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} Is input element
   */
  function isInputElement(element) {
    if (!element) return false;

    const tagName = element.tagName.toLowerCase();
    const inputTypes = ['input', 'textarea', 'select'];

    if (inputTypes.includes(tagName)) {
      return true;
    }

    if (element.isContentEditable) {
      return true;
    }

    return false;
  }

  /**
   * Enable keyboard input
   */
  function enable() {
    keyboardState.isEnabled = true;
  }

  /**
   * Disable keyboard input
   */
  function disable() {
    keyboardState.isEnabled = false;
  }

  /**
   * Set calculator mode
   * @param {string} mode - Calculator mode
   */
  function setMode(mode) {
    if (['standard', 'scientific', 'programmer'].includes(mode)) {
      keyboardState.currentMode = mode;
    }
  }

  /**
   * Get current state (for testing)
   * @returns {object} Current state
   */
  function getState() {
    return { ...keyboardState };
  }

  // Public API
  return {
    init: init,
    enable: enable,
    disable: disable,
    setMode: setMode,
    getState: getState,
    // Expose for testing
    _test: {
      handleKeydown: handleKeydown,
      getKeyMapping: getKeyMapping,
      isValidForBase: isValidForBase,
      executeAction: executeAction,
      executeShortcut: executeShortcut,
      isInputElement: isInputElement
    }
  };
})();
