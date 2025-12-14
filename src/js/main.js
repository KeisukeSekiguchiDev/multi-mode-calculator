/**
 * Main Application Entry Point
 * Initializes all modules and handles UI events
 */

(function() {
  'use strict';

  /**
   * Initialize application
   */
  function init() {
    try {
      // Initialize all modules
      const modulesOk = initializeModules();
      if (!modulesOk) {
        console.error('Failed to initialize modules');
        return;
      }

      // Bind button events
      bindButtonEvents();

      // Bind tab events
      bindTabEvents();

      // Bind angle mode events
      bindAngleModeEvents();

      // Bind theme toggle
      bindThemeToggle();

      // Bind programmer mode events
      bindProgrammerModeEvents();

      // Bind panel control events
      bindPanelControlEvents();

      // Bind settings dialog events

      // Enable keyboard handler
      KeyboardHandler.enable();

      console.log('Calculator initialized successfully');
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  /**
   * Initialize all calculator modules
   * @returns {boolean} Success status
   */
  function initializeModules() {
    const modules = [
      { name: 'Calculator', module: Calculator },
      { name: 'DisplayManager', module: DisplayManager },
      { name: 'HistoryManager', module: HistoryManager },
      { name: 'ThemeManager', module: ThemeManager },
      { name: 'KeyboardHandler', module: KeyboardHandler }
    ];

    for (const { name, module } of modules) {
      if (!module || typeof module.init !== 'function') {
        console.error(`${name} module not available or missing init()`);
        return false;
      }

      const result = module.init();
      if (result === false) {
        console.error(`${name}.init() failed`);
        return false;
      }
    }

    return true;
  }

  /**
   * Bind calculator button events using event delegation
   */
  function bindButtonEvents() {
    const buttonContainers = document.querySelectorAll('.calculator__buttons');
    if (buttonContainers.length === 0) {
      console.error('Buttons containers not found');
      return;
    }

    // Event delegation for all button containers (standard, scientific, programmer)
    buttonContainers.forEach(container => {
      container.addEventListener('click', handleButtonClick);
    });
  }

  /**
   * Handle button click events
   * @param {Event} event - Click event
   */
  function handleButtonClick(event) {
    const button = event.target.closest('.calculator__button');
    if (!button) return;

    // Prevent default and stop propagation
    event.preventDefault();

    // Get button data attributes
    const number = button.dataset.number;
    const operator = button.dataset.operator;
    const action = button.dataset.action;
    const value = button.dataset.value;
    const func = button.dataset.function;
    const hex = button.dataset.hex;
    const bitwise = button.dataset.bitwise;

    // Route to appropriate handler
    if (number !== undefined) {
      Calculator.inputNumber(number);
    } else if (hex !== undefined) {
      Calculator.inputHexDigit(hex);
    } else if (operator !== undefined) {
      Calculator.inputOperator(operator);
    } else if (bitwise !== undefined) {
      Calculator.bitwiseOperation(bitwise);
    } else if (value === '.') {
      Calculator.inputDecimal();
    } else if (value === '%') {
      Calculator.percent();
    } else if (action === 'equals') {
      Calculator.calculate();
    } else if (action === 'clear') {
      Calculator.clear();
    } else if (action === 'ce') {
      Calculator.clearEntry();
    } else if (action === 'backspace') {
      Calculator.backspace();
    } else if (action === 'negate') {
      Calculator.negate();
    } else if (action === 'ascii') {
      handleAsciiConversion();
    } else if (func !== undefined) {
      Calculator.scientificOperation(func);
    }

    // Visual feedback
    button.classList.add('calculator__button--active');
    setTimeout(() => {
      button.classList.remove('calculator__button--active');
    }, 100);
  }

  /**
   * Handle ASCII conversion
   */
  function handleAsciiConversion() {
    try {
      const state = Calculator.getState();
      const currentValue = state.currentValue;

      // Convert current value to ASCII character
      const asciiChar = Calculator.toAscii(currentValue);

      // Show result in a simple alert for now
      // In future, this could be shown in a dedicated display area
      alert(`ASCII Character: "${asciiChar}" (Code: ${currentValue})`);
    } catch (error) {
      alert(error.message);
    }
  }

  /**
   * Bind tab events for mode switching
   */
  function bindTabEvents() {
    const tabs = document.querySelectorAll('.calculator__tab');
    if (tabs.length === 0) {
      console.warn('Tab buttons not found');
      return;
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetPanelId = tab.getAttribute('aria-controls');
        switchPanel(targetPanelId, tab);
      });
    });
  }

  /**
   * Switch calculator panel (standard/scientific/programmer)
   * @param {string} panelId - Target panel ID
   * @param {HTMLElement} activeTab - Active tab element
   */
  function switchPanel(panelId, activeTab) {
    // Hide all panels
    const panels = document.querySelectorAll('.calculator__panel');
    panels.forEach(panel => {
      panel.classList.remove('calculator__panel--active');
      panel.classList.add('calculator__panel--hidden');
    });

    // Show target panel
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
      targetPanel.classList.add('calculator__panel--active');
      targetPanel.classList.remove('calculator__panel--hidden');
    }

    // Update tab states
    const tabs = document.querySelectorAll('.calculator__tab');
    tabs.forEach(tab => {
      tab.classList.remove('calculator__tab--active');
      tab.setAttribute('aria-selected', 'false');
    });

    activeTab.classList.add('calculator__tab--active');
    activeTab.setAttribute('aria-selected', 'true');

    // Update body mode class for CSS width adjustments
    document.body.classList.remove('mode-standard', 'mode-scientific', 'mode-programmer');
    if (panelId === 'panel-scientific') {
      document.body.classList.add('mode-scientific');
    } else if (panelId === 'panel-programmer') {
      document.body.classList.add('mode-programmer');
    } else {
      document.body.classList.add('mode-standard');
    }
  }

  /**
   * Bind angle mode radio buttons (DEG/RAD)
   */
  function bindAngleModeEvents() {
    const degRadio = document.getElementById('radio-deg');
    const radRadio = document.getElementById('radio-rad');

    if (!degRadio || !radRadio) {
      console.warn('Angle mode radio buttons not found');
      return;
    }

    degRadio.addEventListener('change', () => {
      if (degRadio.checked) {
        Calculator.setAngleMode('DEG');
      }
    });

    radRadio.addEventListener('change', () => {
      if (radRadio.checked) {
        Calculator.setAngleMode('RAD');
      }
    });
  }

  /**
   * Bind theme toggle button
   */
  function bindThemeToggle() {
    const themeToggle = document.getElementById('btn-theme-toggle');
    if (!themeToggle) {
      console.warn('Theme toggle button not found');
      return;
    }

    themeToggle.addEventListener('click', () => {
      ThemeManager.toggleDarkMode();
      updateThemeIcon();
    });

    // Set initial icon
    updateThemeIcon();
  }

  /**
   * Update theme toggle icon
   */
  function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (!themeIcon) return;

    const currentTheme = ThemeManager.getCurrentTheme();
    themeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀';
  }

  /**
   * Bind programmer mode events (base mode, bit size)
   */
  function bindProgrammerModeEvents() {
    // Bind base mode radio buttons (HEX/DEC/OCT/BIN)
    bindBaseModeEvents();

    // Bind bit size buttons (BYTE/WORD/DWORD/QWORD)
    bindBitSizeEvents();

    // Initialize hex buttons state (disabled by default in DEC mode)
    updateHexButtonsState(false);
  }

  /**
   * Bind base mode radio buttons
   */
  function bindBaseModeEvents() {
    const hexRadio = document.getElementById('radio-prog-hex');
    const decRadio = document.getElementById('radio-prog-dec');
    const octRadio = document.getElementById('radio-prog-oct');
    const binRadio = document.getElementById('radio-prog-bin');

    if (!hexRadio || !decRadio || !octRadio || !binRadio) {
      console.warn('Base mode radio buttons not found');
      return;
    }

    hexRadio.addEventListener('change', () => {
      if (hexRadio.checked) {
        Calculator.setBase(16);
        updateHexButtonsState(true);
        DisplayManager.update();
      }
    });

    decRadio.addEventListener('change', () => {
      if (decRadio.checked) {
        Calculator.setBase(10);
        updateHexButtonsState(false);
        DisplayManager.update();
      }
    });

    octRadio.addEventListener('change', () => {
      if (octRadio.checked) {
        Calculator.setBase(8);
        updateHexButtonsState(false);
        DisplayManager.update();
      }
    });

    binRadio.addEventListener('change', () => {
      if (binRadio.checked) {
        Calculator.setBase(2);
        updateHexButtonsState(false);
        DisplayManager.update();
      }
    });
  }

  /**
   * Bind bit size buttons
   */
  function bindBitSizeEvents() {
    const byteBtn = document.getElementById('btn-prog-byte');
    const wordBtn = document.getElementById('btn-prog-word');
    const dwordBtn = document.getElementById('btn-prog-dword');
    const qwordBtn = document.getElementById('btn-prog-qword');

    if (!byteBtn || !wordBtn || !dwordBtn || !qwordBtn) {
      console.warn('Bit size buttons not found');
      return;
    }

    byteBtn.addEventListener('click', () => {
      Calculator.setBitLength(8);
      updateBitSizeButtonsState(byteBtn);
      DisplayManager.update();
    });

    wordBtn.addEventListener('click', () => {
      Calculator.setBitLength(16);
      updateBitSizeButtonsState(wordBtn);
      DisplayManager.update();
    });

    dwordBtn.addEventListener('click', () => {
      Calculator.setBitLength(32);
      updateBitSizeButtonsState(dwordBtn);
      DisplayManager.update();
    });

    qwordBtn.addEventListener('click', () => {
      Calculator.setBitLength(64);
      updateBitSizeButtonsState(qwordBtn);
      DisplayManager.update();
    });
  }

  /**
   * Update hex buttons (A-F) enabled/disabled state
   * @param {boolean} enabled - Whether hex buttons should be enabled
   */
  function updateHexButtonsState(enabled) {
    // Note: hex C button has ID 'btn-prog-hex-c' to avoid conflict with clear button
    const hexButtonIds = [
      'btn-prog-a', 'btn-prog-b', 'btn-prog-hex-c',
      'btn-prog-d', 'btn-prog-e', 'btn-prog-f'
    ];
    hexButtonIds.forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.disabled = !enabled;
        if (enabled) {
          btn.classList.remove('calculator__button--disabled');
        } else {
          btn.classList.add('calculator__button--disabled');
        }
      }
    });
  }

  /**
   * Update bit size buttons active state
   * @param {HTMLElement} activeBtn - Active button
   */
  function updateBitSizeButtonsState(activeBtn) {
    const allBitBtns = document.querySelectorAll('.calculator__bit-button');
    allBitBtns.forEach(btn => {
      btn.classList.remove('calculator__bit-button--active');
    });
    activeBtn.classList.add('calculator__bit-button--active');
  }

  /**
   * Bind panel control events (history panel)
   */
  function bindPanelControlEvents() {
    const historyBtn = document.getElementById('btn-history');
    const historyCloseBtn = document.getElementById('btn-history-close');
    const historyClearBtn = document.getElementById('btn-history-clear');

    if (historyBtn) {
      historyBtn.addEventListener('click', () => {
        toggleHistoryPanel();
      });
    }

    if (historyCloseBtn) {
      historyCloseBtn.addEventListener('click', () => {
        closeHistoryPanel();
      });
    }

    if (historyClearBtn) {
      historyClearBtn.addEventListener('click', () => {
        HistoryManager.clearHistory();
        HistoryManager.renderHistoryList();
        updateEmptyState();
      });
    }
  }

  /**
   * Toggle history panel
   */
  function toggleHistoryPanel() {
    const panel = document.getElementById('history-panel');
    if (!panel) return;

    const isHidden = panel.getAttribute('aria-hidden') === 'true';

    if (isHidden) {
      openHistoryPanel();
    } else {
      closeHistoryPanel();
    }
  }

  /**
   * Open history panel
   */
  function openHistoryPanel() {
    const panel = document.getElementById('history-panel');
    if (!panel) return;

    panel.classList.remove('calculator__history--hidden');
    panel.setAttribute('aria-hidden', 'false');

    // Refresh history list
    HistoryManager.refreshPanel();
    updateEmptyState();
  }

  /**
   * Update empty state visibility based on history list
   */
  function updateEmptyState() {
    const historyList = document.getElementById('history-list');
    const emptyState = document.getElementById('history-empty');

    if (!historyList || !emptyState) return;

    const hasItems = historyList.children.length > 0;
    emptyState.style.display = hasItems ? 'none' : 'flex';
  }

  /**
   * Close history panel
   */
  function closeHistoryPanel() {
    const panel = document.getElementById('history-panel');
    if (!panel) return;

    panel.classList.add('calculator__history--hidden');
    panel.setAttribute('aria-hidden', 'true');
  }

  /**
   * Bind settings dialog events
   */
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
