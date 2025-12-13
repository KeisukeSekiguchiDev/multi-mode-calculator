/**
 * Calculator Module
 * Core calculation logic for all modes
 */

const Calculator = (function() {
  'use strict';

  // Constants
  const CALC_MODES = {
    STANDARD: 'standard',
    SCIENTIFIC: 'scientific',
    PROGRAMMER: 'programmer'
  };

  const OPERATORS = {
    ADD: '+',
    SUBTRACT: '-',
    MULTIPLY: '×',
    DIVIDE: '÷',
    POWER: '^'
  };

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
    POW10: 'pow10',
    FACTORIAL: 'factorial',
    RECIPROCAL: 'reciprocal',
    ABS: 'abs',
    PI: 'pi',
    E: 'e'
  };

  const ANGLE_MODES = {
    DEG: 'DEG',
    RAD: 'RAD'
  };

  const BASE_MODES = {
    HEX: 16,
    DEC: 10,
    OCT: 8,
    BIN: 2
  };

  const BIT_LENGTHS = {
    BYTE: 8,
    WORD: 16,
    DWORD: 32,
    QWORD: 64
  };

  const LIMITS = {
    MAX_DIGITS: 16,
    MAX_DECIMAL_PLACES: 10,
    MAX_FACTORIAL: 170,
    PRECISION: 1e-15
  };

  // Calculator state
  const calcState = {
    currentValue: '0',
    previousValue: null,
    currentOperator: null,
    mode: CALC_MODES.STANDARD,
    angleMode: ANGLE_MODES.DEG,
    base: BASE_MODES.DEC,
    bitLength: BIT_LENGTHS.DWORD,
    memoryValue: 0,
    hasMemory: false,
    isResultDisplayed: false,
    hasError: false,
    expression: ''
  };

  /**
   * Initialize calculator
   */
  function init() {
    clear();
    return true;
  }

  /**
   * Get current calculator state
   * @returns {object} Current state
   */
  function getState() {
    return { ...calcState };
  }

  /**
   * Set current value (used by history click)
   * @param {string} value - Value to set
   */
  function setCurrentValue(value) {
    if (calcState.hasError) {
      clear();
    }

    calcState.currentValue = value;
    calcState.isResultDisplayed = true;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Input number (0-9)
   * @param {string} num - Number to input
   */
  function inputNumber(num) {
    // Ignore input if error
    if (calcState.hasError) return;

    // Start new input if result is displayed
    if (calcState.isResultDisplayed) {
      calcState.currentValue = '0';
      calcState.isResultDisplayed = false;
    }

    // Check digit limit
    const currentDigits = calcState.currentValue.replace(/[.-]/g, '').length;
    if (currentDigits >= LIMITS.MAX_DIGITS) {
      return;
    }

    // Replace leading zero
    if (calcState.currentValue === '0' && num !== '0') {
      calcState.currentValue = num;
    } else if (calcState.currentValue === '0' && num === '0') {
      // Keep as 0
    } else {
      calcState.currentValue += num;
    }

    // Notify display
    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Input decimal point
   */
  function inputDecimal() {
    if (calcState.hasError) return;

    // Start new input if result is displayed
    if (calcState.isResultDisplayed) {
      calcState.currentValue = '0';
      calcState.isResultDisplayed = false;
    }

    // Add decimal point if not present
    if (!calcState.currentValue.includes('.')) {
      calcState.currentValue += '.';
    }

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Input operator (+, -, ×, ÷)
   * @param {string} op - Operator
   */
  function inputOperator(op) {
    if (calcState.hasError) return;

    // If previous calculation exists, execute it first
    if (calcState.previousValue !== null && calcState.currentOperator !== null && !calcState.isResultDisplayed) {
      calculate();
      if (calcState.hasError) return;
    }

    // Store value and operator
    calcState.previousValue = parseFloat(calcState.currentValue);
    calcState.currentOperator = op;
    calcState.expression = `${calcState.currentValue} ${op}`;
    calcState.isResultDisplayed = true;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Calculate result
   */
  function calculate() {
    if (calcState.hasError) return;
    if (calcState.previousValue === null || calcState.currentOperator === null) {
      return;
    }

    const op = calcState.currentOperator;
    let a, b, result;

    // Check if it's a bitwise operation or regular operation
    const bitwiseOps = ['AND', 'OR', 'XOR', 'LSH', 'RSH'];
    const isBitwiseOp = bitwiseOps.includes(op);

    if (isBitwiseOp) {
      // Bitwise operation - use integers
      a = calcState.previousValue;
      b = parseInt(calcState.currentValue, calcState.base);
      result = performBitwiseOperation(a, op, b);
    } else {
      // Regular arithmetic operation - use floats
      a = calcState.previousValue;
      b = parseFloat(calcState.currentValue);
      result = performOperation(a, op, b);
    }

    // Build expression
    const expression = `${a} ${op} ${b}`;

    // Check for errors
    if (!isFinite(result) || isNaN(result)) {
      setError(result === Infinity ? 'Infinity' : 'Error');
      return;
    }

    // Format result
    let formattedResult;
    if (isBitwiseOp) {
      // For bitwise operations, format in current base
      formattedResult = result.toString(calcState.base).toUpperCase();
    } else {
      formattedResult = formatNumber(result);
    }

    // Add to history
    if (typeof HistoryManager !== 'undefined') {
      HistoryManager.add({
        expression: expression,
        result: formattedResult,
        mode: calcState.mode
      });
    }

    // Update state
    calcState.currentValue = formattedResult;
    calcState.previousValue = null;
    calcState.currentOperator = null;
    calcState.expression = '';
    calcState.isResultDisplayed = true;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Perform binary operation
   * @param {number} a - Left operand
   * @param {string} op - Operator
   * @param {number} b - Right operand
   * @returns {number} Result
   */
  function performOperation(a, op, b) {
    switch (op) {
      case OPERATORS.ADD:
        return a + b;
      case OPERATORS.SUBTRACT:
        return a - b;
      case OPERATORS.MULTIPLY:
        return a * b;
      case OPERATORS.DIVIDE:
        if (b === 0) return NaN; // Division by zero
        return a / b;
      default:
        return NaN;
    }
  }

  /**
   * Clear all (AC/C)
   */
  function clear() {
    calcState.currentValue = '0';
    calcState.previousValue = null;
    calcState.currentOperator = null;
    calcState.expression = '';
    calcState.isResultDisplayed = false;
    calcState.hasError = false;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Clear entry (CE)
   */
  function clearEntry() {
    if (calcState.hasError) {
      clear();
      return;
    }

    calcState.currentValue = '0';
    calcState.isResultDisplayed = false;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Backspace - delete last character
   */
  function backspace() {
    if (calcState.hasError || calcState.isResultDisplayed) {
      return;
    }

    if (calcState.currentValue.length > 1) {
      calcState.currentValue = calcState.currentValue.slice(0, -1);
    } else {
      calcState.currentValue = '0';
    }

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Negate current value (±)
   */
  function negate() {
    if (calcState.hasError) return;

    const num = parseFloat(calcState.currentValue);
    if (num === 0) return;

    calcState.currentValue = formatNumber(-num);
    calcState.isResultDisplayed = false;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Percent calculation
   */
  function percent() {
    if (calcState.hasError) return;

    const num = parseFloat(calcState.currentValue);
    calcState.currentValue = formatNumber(num / 100);
    calcState.isResultDisplayed = true;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Scientific function operations
   * @param {string} func - Function name
   */
  function scientificOperation(func) {
    if (calcState.hasError) return;

    const value = parseFloat(calcState.currentValue);
    let result;

    switch (func) {
      // Trigonometric functions
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

      // Logarithmic functions
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

      // Exponential functions
      case SCIENTIFIC_FUNCTIONS.EXP:
        result = Math.exp(value);
        break;
      case SCIENTIFIC_FUNCTIONS.POW10:
        result = Math.pow(10, value);
        break;

      // Power and root functions
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

      // Other functions
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

      // Constants
      case SCIENTIFIC_FUNCTIONS.PI:
        result = Math.PI;
        break;
      case SCIENTIFIC_FUNCTIONS.E:
        result = Math.E;
        break;

      default:
        return;
    }

    if (!isFinite(result)) {
      setError('Infinity');
      return;
    }

    calcState.currentValue = formatNumber(result);
    calcState.isResultDisplayed = true;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees - Angle in degrees
   * @returns {number} Angle in radians
   */
  function toRadians(degrees) {
    if (calcState.angleMode === ANGLE_MODES.RAD) {
      return degrees;
    }
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   * @param {number} radians - Angle in radians
   * @returns {number} Angle in degrees
   */
  function toDegrees(radians) {
    if (calcState.angleMode === ANGLE_MODES.RAD) {
      return radians;
    }
    return radians * (180 / Math.PI);
  }

  /**
   * Calculate factorial
   * @param {number} n - Number
   * @returns {number|null} Factorial or null if error
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
   * Set angle mode (DEG/RAD)
   * @param {string} mode - Angle mode
   */
  function setAngleMode(mode) {
    if (mode === ANGLE_MODES.DEG || mode === ANGLE_MODES.RAD) {
      calcState.angleMode = mode;
    }
  }

  /**
   * Format number for display
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  function formatNumber(num) {
    // Round very small values to zero
    if (Math.abs(num) < LIMITS.PRECISION) {
      return '0';
    }

    // Return integer as-is
    if (Number.isInteger(num)) {
      return num.toString();
    }

    // Limit decimal places
    const str = num.toPrecision(LIMITS.MAX_DIGITS);
    return parseFloat(str).toString();
  }

  /**
   * Set error state
   * @param {string} message - Error message
   */
  function setError(message) {
    calcState.hasError = true;
    calcState.currentValue = message;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Set calculator mode
   * @param {string} mode - Mode ('standard', 'scientific', 'programmer')
   */
  function setMode(mode) {
    if (mode === CALC_MODES.STANDARD || mode === CALC_MODES.SCIENTIFIC || mode === CALC_MODES.PROGRAMMER) {
      calcState.mode = mode;
    }
  }

  /**
   * Set base mode (HEX/DEC/OCT/BIN)
   * @param {number} base - Base (2, 8, 10, 16)
   */
  function setBase(base) {
    if (base === 2 || base === 8 || base === 10 || base === 16) {
      calcState.base = base;
    }
  }

  /**
   * Set bit length (BYTE/WORD/DWORD/QWORD)
   * @param {number} length - Bit length (8, 16, 32, 64)
   */
  function setBitLength(length) {
    if (length === 8 || length === 16 || length === 32 || length === 64) {
      calcState.bitLength = length;
    }
  }

  /**
   * Convert value from one base to another
   * @param {string} value - Value to convert
   * @param {number} fromBase - Source base (2, 8, 10, 16)
   * @param {number} toBase - Target base (2, 8, 10, 16)
   * @returns {string} Converted value
   */
  function convertBase(value, fromBase, toBase) {
    // Convert to decimal first
    const decimal = parseInt(value, fromBase);

    // Check for NaN
    if (isNaN(decimal)) {
      return '0';
    }

    // Convert to target base
    return decimal.toString(toBase).toUpperCase();
  }

  /**
   * Get value in all bases
   * @param {string} value - Value to convert
   * @param {number} currentBase - Current base
   * @returns {object} Value in all bases {hex, dec, oct, bin}
   */
  function getValueInAllBases(value, currentBase) {
    const decimal = parseInt(value, currentBase);

    if (isNaN(decimal)) {
      return {
        hex: '0',
        dec: '0',
        oct: '0',
        bin: '0'
      };
    }

    return {
      hex: decimal.toString(16).toUpperCase(),
      dec: decimal.toString(10),
      oct: decimal.toString(8),
      bin: decimal.toString(2)
    };
  }

  /**
   * Clamp value to current bit length
   * @param {number} value - Value to clamp
   * @returns {number} Clamped value
   */
  function clampToBitLength(value) {
    let mask;

    switch (calcState.bitLength) {
      case BIT_LENGTHS.BYTE:
        mask = 0xFF; // 255
        break;
      case BIT_LENGTHS.WORD:
        mask = 0xFFFF; // 65535
        break;
      case BIT_LENGTHS.DWORD:
        mask = 0xFFFFFFFF; // 4294967295
        break;
      case BIT_LENGTHS.QWORD:
        // JavaScript can't handle 64-bit integers natively
        // Use Number.MAX_SAFE_INTEGER as approximation
        return value;
      default:
        mask = 0xFFFFFFFF;
    }

    return value & mask;
  }

  /**
   * Get binary display with spacing
   * @returns {string} Binary string with spacing
   */
  function getBinaryDisplay() {
    const decimal = parseInt(calcState.currentValue, calcState.base);
    if (isNaN(decimal)) {
      return '0';
    }

    const binary = decimal.toString(2);

    // Add spacing every 4 bits from right
    const parts = [];
    for (let i = binary.length; i > 0; i -= 4) {
      const start = Math.max(0, i - 4);
      parts.unshift(binary.substring(start, i));
    }

    return parts.join(' ');
  }

  /**
   * Input hexadecimal digit (A-F)
   * @param {string} digit - Hex digit (A-F)
   */
  function inputHexDigit(digit) {
    if (calcState.hasError) return;
    if (calcState.base !== BASE_MODES.HEX) return;

    // Start new input if result is displayed
    if (calcState.isResultDisplayed) {
      calcState.currentValue = '0';
      calcState.isResultDisplayed = false;
    }

    // Check digit limit
    const currentDigits = calcState.currentValue.replace(/[.-]/g, '').length;
    if (currentDigits >= LIMITS.MAX_DIGITS) {
      return;
    }

    // Replace leading zero
    if (calcState.currentValue === '0') {
      calcState.currentValue = digit.toUpperCase();
    } else {
      calcState.currentValue += digit.toUpperCase();
    }

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Perform bitwise operation
   * @param {string} operation - Bitwise operation (AND, OR, XOR, NOT, LSH, RSH)
   */
  function bitwiseOperation(operation) {
    if (calcState.hasError) return;

    const currentValue = parseInt(calcState.currentValue, calcState.base);

    if (operation === 'NOT') {
      // Unary operation - NOT
      const result = performBitwiseNot(currentValue);
      calcState.currentValue = result.toString(calcState.base).toUpperCase();
      calcState.isResultDisplayed = true;
    } else {
      // Binary operations - AND, OR, XOR, LSH, RSH
      if (calcState.previousValue !== null && calcState.currentOperator !== null && !calcState.isResultDisplayed) {
        // Execute pending operation first
        calculate();
        if (calcState.hasError) return;
      }

      // Store value and operator
      calcState.previousValue = currentValue;
      calcState.currentOperator = operation;
      calcState.expression = `${calcState.currentValue} ${operation}`;
      calcState.isResultDisplayed = true;
    }

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Perform bitwise NOT operation
   * @param {number} value - Value to negate
   * @returns {number} Result
   */
  function performBitwiseNot(value) {
    // Bitwise NOT (~) and apply bit length mask
    const result = ~value;
    return clampToBitLength(result);
  }

  /**
   * Perform bitwise binary operation
   * @param {number} a - Left operand
   * @param {string} op - Operation (AND, OR, XOR, NAND, NOR, LSH, RSH)
   * @param {number} b - Right operand
   * @returns {number} Result
   */
  function performBitwiseOperation(a, op, b) {
    let result;

    switch (op) {
      case 'AND':
        result = a & b;
        break;
      case 'OR':
        result = a | b;
        break;
      case 'XOR':
        result = a ^ b;
        break;
      case 'NAND':
        result = ~(a & b);
        break;
      case 'NOR':
        result = ~(a | b);
        break;
      case 'LSH':
        result = a << b;
        break;
      case 'RSH':
        result = a >> b;
        break;
      default:
        return NaN;
    }

    // Apply bit length clamp
    return clampToBitLength(result);
  }

  /**
   * Memory Clear (MC) - Clear memory
   */
  function memoryClear() {
    calcState.memoryValue = 0;
    calcState.hasMemory = false;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Memory Store (MS) - Store current value in memory
   */
  function memoryStore() {
    if (calcState.hasError) return;

    const currentNum = parseFloat(calcState.currentValue);
    if (!isNaN(currentNum)) {
      calcState.memoryValue = currentNum;
      calcState.hasMemory = currentNum !== 0;
    }

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Memory Recall (MR) - Recall memory value
   */
  function memoryRecall() {
    if (calcState.memoryValue !== 0) {
      calcState.currentValue = formatNumber(calcState.memoryValue);
      calcState.isResultDisplayed = true;

      if (typeof DisplayManager !== 'undefined') {
        DisplayManager.update();
      }
    }
  }

  /**
   * Memory Add (M+) - Add current value to memory
   */
  function memoryAdd() {
    if (calcState.hasError) return;

    const currentNum = parseFloat(calcState.currentValue);
    if (!isNaN(currentNum)) {
      calcState.memoryValue += currentNum;
      calcState.hasMemory = calcState.memoryValue !== 0;
    }

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Memory Subtract (M-) - Subtract current value from memory
   */
  function memorySubtract() {
    if (calcState.hasError) return;

    const currentNum = parseFloat(calcState.currentValue);
    if (!isNaN(currentNum)) {
      calcState.memoryValue -= currentNum;
      calcState.hasMemory = calcState.memoryValue !== 0;
    }

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * Toggle specific bit (XOR with bit mask)
   * @param {number} index - Bit position (0-based from right)
   */
  function toggleBit(index) {
    // Error state or non-programmer mode: do nothing
    if (calcState.hasError) return;
    if (calcState.mode !== CALC_MODES.PROGRAMMER) return;

    // Convert current value to integer
    let value = parseInt(calcState.currentValue, calcState.base);
    if (isNaN(value)) {
      value = 0;
    }

    // Check bit index is within valid range
    if (index < 0 || index >= calcState.bitLength) {
      return;
    }

    // Toggle the bit using XOR
    const toggled = value ^ (1 << index);

    // Apply bit length clamp
    const clamped = clampToBitLength(toggled);

    // Convert to current base and update
    calcState.currentValue = clamped.toString(calcState.base).toUpperCase();
    calcState.isResultDisplayed = true;

    if (typeof DisplayManager !== 'undefined') {
      DisplayManager.update();
    }
  }

  /**
   * ASCII変換機能
   */

  /**
   * 数値をASCII文字に変換
   * @param {number} value - 変換する数値（0-127）
   * @returns {string} ASCII文字
   */
  function toAscii(value) {
    const num = value !== undefined ? value : calcState.currentValue;

    if (!Number.isInteger(num) || num < 0 || num > 127) {
      throw new Error('ASCII value must be between 0-127');
    }

    return String.fromCharCode(num);
  }

  /**
   * ASCII文字を数値に変換
   * @param {string} char - 変換する文字
   * @returns {number} ASCII値
   */
  function fromAscii(char) {
    if (typeof char !== 'string' || char.length !== 1) {
      throw new Error('Input must be a single character');
    }

    const asciiValue = char.charCodeAt(0);
    calcState.currentValue = asciiValue;
    updateDisplay();
    return asciiValue;
  }

  /**
   * 現在の値をASCII文字として表示
   * @returns {string} ASCII文字または空文字
   */
  function getAsciiChar() {
    try {
      return toAscii();
    } catch (e) {
      return '';
    }
  }

  // Public API
  return {
    init,
    getState,
    setCurrentValue,
    setMode,
    inputNumber,
    inputDecimal,
    inputOperator,
    calculate,
    clear,
    clearEntry,
    backspace,
    negate,
    percent,
    scientificOperation,
    setAngleMode,
    setBase,
    setBitLength,
    convertBase,
    getValueInAllBases,
    clampToBitLength,
    getBinaryDisplay,
    inputHexDigit,
    bitwiseOperation,
    toggleBit,
    memoryClear,
    memoryStore,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    toAscii,
    fromAscii,
    getAsciiChar
  };
})();
