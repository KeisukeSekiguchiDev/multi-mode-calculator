/**
 * Display Manager Module
 * Manages calculator display updates
 */

const DisplayManager = (function() {
  'use strict';

  // DOM elements
  let displayExpression;
  let displayResult;
  let displayHex;
  let displayDec;
  let displayOct;
  let displayBin;
  let bitPanel;

  /**
   * Initialize display manager
   */
  function init() {
    displayExpression = document.getElementById('display-expression');
    displayResult = document.getElementById('display-result');
    displayHex = document.getElementById('display-hex');
    displayDec = document.getElementById('display-dec');
    displayOct = document.getElementById('display-oct');
    displayBin = document.getElementById('display-bin');
    bitPanel = document.getElementById('bit-panel');

    if (!displayExpression || !displayResult) {
      console.error('Display elements not found');
      return false;
    }

    return true;
  }

  /**
   * Update display with current calculator state
   */
  function update() {
    if (!Calculator) {
      console.error('Calculator module not available');
      return;
    }

    const state = Calculator.getState();

    // Update main display (result)
    updateMainDisplay(state.currentValue);

    // Update sub display (expression)
    updateSubDisplay(state.expression);

    // Update base displays (programmer mode)
    updateBaseDisplays();

    // Update bit panel (programmer mode)
    updateBitPanel();
  }

  /**
   * Format number for display
   * @param {string|number} value - Value to format
   * @returns {string} - Formatted value
   */
  function formatNumber(value) {
    if (value === null || value === undefined || value === '') {
      return '0';
    }

    // String values (Error, Infinity, etc.)
    if (typeof value === 'string') {
      // Check for special values
      if (value === 'Error' || value === 'Infinity' || value === '-Infinity' || value === 'NaN') {
        return value;
      }

      // Try to parse as number
      const num = parseFloat(value);
      if (isNaN(num)) {
        return value; // Return as-is if not a valid number
      }
      value = num;
    }

    // Handle special numeric values
    if (!isFinite(value)) {
      return value === Infinity ? 'Infinity' : (value === -Infinity ? '-Infinity' : 'Error');
    }

    // Very small numbers close to zero
    if (Math.abs(value) < 1e-15) {
      return '0';
    }

    // Integer values
    if (Number.isInteger(value)) {
      return value.toString();
    }

    // Decimal values - limit precision
    const str = value.toPrecision(16);
    const parsed = parseFloat(str);

    // Remove trailing zeros
    return parsed.toString();
  }

  /**
   * Update main display (result area)
   * @param {string} value - Value to display
   */
  function updateMainDisplay(value) {
    if (displayResult) {
      const formatted = formatNumber(value);
      displayResult.textContent = formatted;

      // Adjust font size if number is too long
      adjustFontSize(formatted);
    }
  }

  /**
   * Adjust font size based on content length
   * @param {string} content - Content to measure
   */
  function adjustFontSize(content) {
    if (!displayResult) return;

    const length = content.length;

    if (length > 16) {
      displayResult.style.fontSize = '24px';
    } else if (length > 12) {
      displayResult.style.fontSize = '32px';
    } else if (length > 8) {
      displayResult.style.fontSize = '40px';
    } else {
      displayResult.style.fontSize = '48px'; // Default from CSS
    }
  }

  /**
   * Update sub display (expression area)
   * @param {string} expression - Expression to display
   */
  function updateSubDisplay(expression) {
    if (displayExpression) {
      displayExpression.textContent = expression || '';
    }
  }

  /**
   * Update base displays (HEX/DEC/OCT/BIN)
   */
  function updateBaseDisplays() {
    if (!displayHex || !displayDec || !displayOct || !displayBin) {
      // Base displays not available (not in programmer mode)
      return;
    }

    const state = Calculator.getState();

    // Parse current value based on current base
    const decimal = parseInt(state.currentValue, state.base);

    if (isNaN(decimal)) {
      // Invalid value
      displayHex.textContent = '0';
      displayDec.textContent = '0';
      displayOct.textContent = '0';
      displayBin.textContent = '0';
      return;
    }

    // Apply bit length clamp
    const clamped = Calculator.clampToBitLength(decimal);

    // Convert to all bases
    const hexValue = clamped.toString(16).toUpperCase();
    const decValue = clamped.toString(10);
    const octValue = clamped.toString(8);
    const binValue = formatBinaryDisplay(clamped.toString(2));

    // Update displays
    displayHex.textContent = hexValue;
    displayDec.textContent = decValue;
    displayOct.textContent = octValue;
    displayBin.textContent = binValue;

    // Highlight active base
    updateBaseHighlight(state.base);
  }

  /**
   * Format binary display with 4-bit grouping
   * @param {string} binary - Binary string
   * @returns {string} Formatted binary string
   */
  function formatBinaryDisplay(binary) {
    // Pad to multiple of 4
    const padLength = Math.ceil(binary.length / 4) * 4;
    const padded = binary.padStart(padLength, '0');

    // Split into 4-bit groups
    const groups = [];
    for (let i = 0; i < padded.length; i += 4) {
      groups.push(padded.substring(i, i + 4));
    }

    return groups.join(' ');
  }

  /**
   * Update base display highlight
   * @param {number} activeBase - Active base (2, 8, 10, 16)
   */
  function updateBaseHighlight(activeBase) {
    const baseDisplays = [
      { element: displayHex, base: 16 },
      { element: displayDec, base: 10 },
      { element: displayOct, base: 8 },
      { element: displayBin, base: 2 }
    ];

    baseDisplays.forEach(({ element, base }) => {
      if (element) {
        if (base === activeBase) {
          element.classList.add('calculator__base-value--active');
        } else {
          element.classList.remove('calculator__base-value--active');
        }
      }
    });
  }

  /**
   * Update bit panel display
   */
  function updateBitPanel() {
    if (!bitPanel) {
      // Bit panel not available (not in programmer mode)
      return;
    }

    const state = Calculator.getState();
    if (!state || state.mode !== 'programmer') {
      return;
    }

    // Parse current value based on current base
    const decimal = parseInt(state.currentValue, state.base);

    if (isNaN(decimal)) {
      renderBitPanel(0, state.bitLength || 32);
      return;
    }

    // Apply bit length clamp
    const clamped = Calculator.clampToBitLength(decimal);

    // Render bit panel
    renderBitPanel(clamped, state.bitLength || 32);
  }

  /**
   * Render bit panel with individual bit elements
   * @param {number} value - Value to display
   * @param {number} bitLength - Bit length (8, 16, 32, 64)
   */
  function renderBitPanel(value, bitLength) {
    if (!bitPanel) return;

    // Clear existing content
    bitPanel.innerHTML = '';

    // Calculate rows and columns
    const bitsPerRow = 16; // 16 bits per row
    const totalRows = bitLength / bitsPerRow;

    // Create bit elements from MSB to LSB
    for (let row = totalRows - 1; row >= 0; row--) {
      const rowStart = row * bitsPerRow;

      for (let i = bitsPerRow - 1; i >= 0; i--) {
        const bitIndex = rowStart + i;
        const bitValue = (value >> bitIndex) & 1;

        // Create bit element
        const bitElement = createBitElement(bitIndex, bitValue === 1);
        bitPanel.appendChild(bitElement);

        // Add separator every 4 bits (except at the end of row)
        if (i > 0 && i % 4 === 0) {
          const separator = document.createElement('span');
          separator.className = 'calculator__bit-separator';
          bitPanel.appendChild(separator);
        }
      }

      // Add row break (except for last row)
      if (row > 0) {
        // This will be handled by grid wrapping
      }
    }
  }

  /**
   * Create a single bit element
   * @param {number} index - Bit position (0-based from LSB)
   * @param {boolean} isActive - Whether bit is set (1) or not (0)
   * @returns {HTMLElement} Bit element
   */
  function createBitElement(index, isActive) {
    const bit = document.createElement('span');
    bit.className = `calculator__bit ${isActive ? 'calculator__bit--active' : 'calculator__bit--inactive'}`;
    bit.textContent = isActive ? '1' : '0';
    bit.dataset.index = index;
    bit.setAttribute('aria-label', `ビット${index}: ${isActive ? '1' : '0'}`);
    bit.setAttribute('role', 'button');
    bit.setAttribute('tabindex', '0');

    // Click handler to toggle bit
    bit.addEventListener('click', () => {
      toggleBit(index);
    });

    // Keyboard handler (Enter/Space)
    bit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBit(index);
      }
    });

    return bit;
  }

  /**
   * Toggle a specific bit
   * @param {number} index - Bit position to toggle
   */
  function toggleBit(index) {
    if (!Calculator || !Calculator.toggleBit) {
      // Calculator module doesn't support bit toggling yet
      console.warn('Bit toggling not yet implemented in Calculator module');
      return;
    }

    Calculator.toggleBit(index);
  }

  /**
   * Clear all displays
   */
  function clear() {
    updateMainDisplay('0');
    updateSubDisplay('');

    if (displayHex) displayHex.textContent = '0';
    if (displayDec) displayDec.textContent = '0';
    if (displayOct) displayOct.textContent = '0';
    if (displayBin) displayBin.textContent = '0';

    if (bitPanel) {
      renderBitPanel(0, 32);
    }
  }

  // Public API
  return {
    init,
    update,
    updateMainDisplay,
    updateSubDisplay,
    updateBaseDisplays,
    updateBitPanel,
    renderBitPanel,
    clear,
    formatNumber
  };
})();
