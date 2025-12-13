/**
 * Calculator Module - Unit Tests
 * Tests for basic arithmetic operations
 */

(function() {
  'use strict';

  // Test results
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
  };

  /**
   * Assert helper
   * @param {boolean} condition - Condition to check
   * @param {string} message - Test message
   */
  function assert(condition, message) {
    results.total++;
    if (condition) {
      results.passed++;
      results.tests.push({ status: 'PASS', message });
      console.log(`✓ PASS: ${message}`);
    } else {
      results.failed++;
      results.tests.push({ status: 'FAIL', message });
      console.error(`✗ FAIL: ${message}`);
    }
  }

  /**
   * Assert equals
   * @param {*} actual - Actual value
   * @param {*} expected - Expected value
   * @param {string} message - Test message
   */
  function assertEqual(actual, expected, message) {
    const condition = actual === expected;
    if (!condition) {
      console.error(`  Expected: ${expected}, Got: ${actual}`);
    }
    assert(condition, message);
  }

  /**
   * Test: Addition
   */
  function testAddition() {
    console.log('\n--- Test: Addition ---');

    Calculator.clear();
    Calculator.inputNumber('1');
    Calculator.inputNumber('0');
    Calculator.inputOperator('+');
    Calculator.inputNumber('5');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '15', 'Addition: 10 + 5 = 15');
  }

  /**
   * Test: Subtraction
   */
  function testSubtraction() {
    console.log('\n--- Test: Subtraction ---');

    Calculator.clear();
    Calculator.inputNumber('2');
    Calculator.inputNumber('0');
    Calculator.inputOperator('-');
    Calculator.inputNumber('8');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '12', 'Subtraction: 20 - 8 = 12');
  }

  /**
   * Test: Multiplication
   */
  function testMultiplication() {
    console.log('\n--- Test: Multiplication ---');

    Calculator.clear();
    Calculator.inputNumber('6');
    Calculator.inputOperator('×');
    Calculator.inputNumber('7');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '42', 'Multiplication: 6 × 7 = 42');
  }

  /**
   * Test: Division
   */
  function testDivision() {
    console.log('\n--- Test: Division ---');

    Calculator.clear();
    Calculator.inputNumber('5');
    Calculator.inputNumber('0');
    Calculator.inputOperator('÷');
    Calculator.inputNumber('5');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '10', 'Division: 50 ÷ 5 = 10');
  }

  /**
   * Test: Division by zero
   */
  function testDivisionByZero() {
    console.log('\n--- Test: Division by Zero ---');

    Calculator.clear();
    Calculator.inputNumber('1');
    Calculator.inputNumber('0');
    Calculator.inputOperator('÷');
    Calculator.inputNumber('0');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, 'Error', 'Division by zero: 10 ÷ 0 = Error');
    assert(state.hasError === true, 'Error state is set');
  }

  /**
   * Test: Decimal calculation
   */
  function testDecimalCalculation() {
    console.log('\n--- Test: Decimal Calculation ---');

    Calculator.clear();
    Calculator.inputNumber('0');
    Calculator.inputDecimal();
    Calculator.inputNumber('1');
    Calculator.inputOperator('+');
    Calculator.inputNumber('0');
    Calculator.inputDecimal();
    Calculator.inputNumber('2');
    Calculator.calculate();

    const state = Calculator.getState();
    // Note: Due to floating point precision, we check if result starts with '0.3'
    const result = parseFloat(state.currentValue);
    assert(Math.abs(result - 0.3) < 0.0001, 'Decimal: 0.1 + 0.2 ≈ 0.3');
  }

  /**
   * Test: Continuous calculation
   */
  function testContinuousCalculation() {
    console.log('\n--- Test: Continuous Calculation ---');

    Calculator.clear();
    Calculator.inputNumber('1');
    Calculator.inputOperator('+');
    Calculator.inputNumber('2');
    Calculator.inputOperator('+');
    Calculator.inputNumber('3');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '6', 'Continuous: 1 + 2 + 3 = 6');
  }

  /**
   * Test: Clear function
   */
  function testClearFunction() {
    console.log('\n--- Test: Clear Function ---');

    Calculator.clear();
    Calculator.inputNumber('5');
    Calculator.inputOperator('+');
    Calculator.inputNumber('3');
    Calculator.clear();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '0', 'Clear: Current value reset to 0');
    assertEqual(state.previousValue, null, 'Clear: Previous value is null');
    assertEqual(state.currentOperator, null, 'Clear: Operator is null');
  }

  /**
   * Test: Clear entry function
   */
  function testClearEntry() {
    console.log('\n--- Test: Clear Entry ---');

    Calculator.clear();
    Calculator.inputNumber('5');
    Calculator.inputOperator('+');
    Calculator.inputNumber('3');
    Calculator.clearEntry();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '0', 'CE: Current value reset to 0');
    assertEqual(state.previousValue, 5, 'CE: Previous value retained');
    assertEqual(state.currentOperator, '+', 'CE: Operator retained');
  }

  /**
   * Test: Negate function
   */
  function testNegate() {
    console.log('\n--- Test: Negate ---');

    Calculator.clear();
    Calculator.inputNumber('5');
    Calculator.negate();

    let state = Calculator.getState();
    assertEqual(state.currentValue, '-5', 'Negate: 5 → -5');

    Calculator.negate();
    state = Calculator.getState();
    assertEqual(state.currentValue, '5', 'Negate: -5 → 5');
  }

  /**
   * Test: Percent function
   */
  function testPercent() {
    console.log('\n--- Test: Percent ---');

    Calculator.clear();
    Calculator.inputNumber('5');
    Calculator.inputNumber('0');
    Calculator.percent();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '0.5', 'Percent: 50% = 0.5');
  }

  /**
   * Test: Square root
   */
  function testSquareRoot() {
    console.log('\n--- Test: Square Root ---');

    Calculator.clear();
    Calculator.inputNumber('1');
    Calculator.inputNumber('6');
    Calculator.scientificOperation('sqrt');

    const state = Calculator.getState();
    assertEqual(state.currentValue, '4', 'Square root: √16 = 4');
  }

  /**
   * Test: Square
   */
  function testSquare() {
    console.log('\n--- Test: Square ---');

    Calculator.clear();
    Calculator.inputNumber('5');
    Calculator.scientificOperation('square');

    const state = Calculator.getState();
    assertEqual(state.currentValue, '25', 'Square: 5² = 25');
  }

  /**
   * Test: Reciprocal
   */
  function testReciprocal() {
    console.log('\n--- Test: Reciprocal ---');

    Calculator.clear();
    Calculator.inputNumber('4');
    Calculator.scientificOperation('reciprocal');

    const state = Calculator.getState();
    assertEqual(state.currentValue, '0.25', 'Reciprocal: 1/4 = 0.25');
  }

  /**
   * Test: Boundary values
   */
  function testBoundaryValues() {
    console.log('\n--- Test: Boundary Values ---');

    Calculator.clear();
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');
    Calculator.inputNumber('9');

    const state = Calculator.getState();
    assertEqual(state.currentValue.length, 16, 'Max digits: 16 digits limit enforced');

    // Try to input more (should be ignored)
    Calculator.inputNumber('9');
    const state2 = Calculator.getState();
    assertEqual(state2.currentValue.length, 16, 'Max digits: Additional input ignored');
  }

  /**
   * Test: Base conversion - DEC to HEX
   */
  function testBaseConversionDecToHex() {
    console.log('\n--- Test: Base Conversion (DEC → HEX) ---');

    let result;

    result = Calculator.convertBase('0', 10, 16);
    assertEqual(result, '0', 'DEC to HEX: 0 → 0');

    result = Calculator.convertBase('10', 10, 16);
    assertEqual(result, 'A', 'DEC to HEX: 10 → A');

    result = Calculator.convertBase('255', 10, 16);
    assertEqual(result, 'FF', 'DEC to HEX: 255 → FF');

    result = Calculator.convertBase('1024', 10, 16);
    assertEqual(result, '400', 'DEC to HEX: 1024 → 400');
  }

  /**
   * Test: Base conversion - DEC to OCT
   */
  function testBaseConversionDecToOct() {
    console.log('\n--- Test: Base Conversion (DEC → OCT) ---');

    let result;

    result = Calculator.convertBase('0', 10, 8);
    assertEqual(result, '0', 'DEC to OCT: 0 → 0');

    result = Calculator.convertBase('10', 10, 8);
    assertEqual(result, '12', 'DEC to OCT: 10 → 12');

    result = Calculator.convertBase('255', 10, 8);
    assertEqual(result, '377', 'DEC to OCT: 255 → 377');

    result = Calculator.convertBase('63', 10, 8);
    assertEqual(result, '77', 'DEC to OCT: 63 → 77');
  }

  /**
   * Test: Base conversion - DEC to BIN
   */
  function testBaseConversionDecToBin() {
    console.log('\n--- Test: Base Conversion (DEC → BIN) ---');

    let result;

    result = Calculator.convertBase('0', 10, 2);
    assertEqual(result, '0', 'DEC to BIN: 0 → 0');

    result = Calculator.convertBase('10', 10, 2);
    assertEqual(result, '1010', 'DEC to BIN: 10 → 1010');

    result = Calculator.convertBase('255', 10, 2);
    assertEqual(result, '11111111', 'DEC to BIN: 255 → 11111111');

    result = Calculator.convertBase('15', 10, 2);
    assertEqual(result, '1111', 'DEC to BIN: 15 → 1111');
  }

  /**
   * Test: Base conversion - HEX to DEC
   */
  function testBaseConversionHexToDec() {
    console.log('\n--- Test: Base Conversion (HEX → DEC) ---');

    let result;

    result = Calculator.convertBase('0', 16, 10);
    assertEqual(result, '0', 'HEX to DEC: 0 → 0');

    result = Calculator.convertBase('A', 16, 10);
    assertEqual(result, '10', 'HEX to DEC: A → 10');

    result = Calculator.convertBase('FF', 16, 10);
    assertEqual(result, '255', 'HEX to DEC: FF → 255');

    result = Calculator.convertBase('100', 16, 10);
    assertEqual(result, '256', 'HEX to DEC: 100 → 256');
  }

  /**
   * Test: Base conversion - HEX to OCT
   */
  function testBaseConversionHexToOct() {
    console.log('\n--- Test: Base Conversion (HEX → OCT) ---');

    let result;

    result = Calculator.convertBase('A', 16, 8);
    assertEqual(result, '12', 'HEX to OCT: A → 12');

    result = Calculator.convertBase('FF', 16, 8);
    assertEqual(result, '377', 'HEX to OCT: FF → 377');

    result = Calculator.convertBase('100', 16, 8);
    assertEqual(result, '400', 'HEX to OCT: 100 → 400');
  }

  /**
   * Test: Base conversion - HEX to BIN
   */
  function testBaseConversionHexToBin() {
    console.log('\n--- Test: Base Conversion (HEX → BIN) ---');

    let result;

    result = Calculator.convertBase('A', 16, 2);
    assertEqual(result, '1010', 'HEX to BIN: A → 1010');

    result = Calculator.convertBase('FF', 16, 2);
    assertEqual(result, '11111111', 'HEX to BIN: FF → 11111111');

    result = Calculator.convertBase('100', 16, 2);
    assertEqual(result, '100000000', 'HEX to BIN: 100 → 100000000');
  }

  /**
   * Test: Base conversion - BIN to DEC
   */
  function testBaseConversionBinToDec() {
    console.log('\n--- Test: Base Conversion (BIN → DEC) ---');

    let result;

    result = Calculator.convertBase('0', 2, 10);
    assertEqual(result, '0', 'BIN to DEC: 0 → 0');

    result = Calculator.convertBase('1010', 2, 10);
    assertEqual(result, '10', 'BIN to DEC: 1010 → 10');

    result = Calculator.convertBase('11111111', 2, 10);
    assertEqual(result, '255', 'BIN to DEC: 11111111 → 255');

    result = Calculator.convertBase('1111', 2, 10);
    assertEqual(result, '15', 'BIN to DEC: 1111 → 15');
  }

  /**
   * Test: Base conversion - OCT to DEC
   */
  function testBaseConversionOctToDec() {
    console.log('\n--- Test: Base Conversion (OCT → DEC) ---');

    let result;

    result = Calculator.convertBase('0', 8, 10);
    assertEqual(result, '0', 'OCT to DEC: 0 → 0');

    result = Calculator.convertBase('12', 8, 10);
    assertEqual(result, '10', 'OCT to DEC: 12 → 10');

    result = Calculator.convertBase('377', 8, 10);
    assertEqual(result, '255', 'OCT to DEC: 377 → 255');

    result = Calculator.convertBase('77', 8, 10);
    assertEqual(result, '63', 'OCT to DEC: 77 → 63');
  }

  /**
   * Test: Get values in all bases
   */
  function testGetValueInAllBases() {
    console.log('\n--- Test: Get Value in All Bases ---');

    const result = Calculator.getValueInAllBases('10', 10);

    assertEqual(result.hex, 'A', 'All bases (10): HEX = A');
    assertEqual(result.dec, '10', 'All bases (10): DEC = 10');
    assertEqual(result.oct, '12', 'All bases (10): OCT = 12');
    assertEqual(result.bin, '1010', 'All bases (10): BIN = 1010');
  }

  /**
   * Test: Invalid base conversion
   */
  function testInvalidBaseConversion() {
    console.log('\n--- Test: Invalid Base Conversion ---');

    const result = Calculator.convertBase('INVALID', 10, 16);
    assertEqual(result, '0', 'Invalid value returns 0');
  }

  /**
   * Test: Base mode switching
   */
  function testBaseModeSwitching() {
    console.log('\n--- Test: Base Mode Switching ---');

    Calculator.setBase(16);
    let state = Calculator.getState();
    assertEqual(state.base, 16, 'Set base to HEX (16)');

    Calculator.setBase(10);
    state = Calculator.getState();
    assertEqual(state.base, 10, 'Set base to DEC (10)');

    Calculator.setBase(8);
    state = Calculator.getState();
    assertEqual(state.base, 8, 'Set base to OCT (8)');

    Calculator.setBase(2);
    state = Calculator.getState();
    assertEqual(state.base, 2, 'Set base to BIN (2)');
  }

  /**
   * Test: Bit length setting
   */
  function testBitLengthSetting() {
    console.log('\n--- Test: Bit Length Setting ---');

    Calculator.setBitLength(8);
    let state = Calculator.getState();
    assertEqual(state.bitLength, 8, 'Set bit length to BYTE (8)');

    Calculator.setBitLength(16);
    state = Calculator.getState();
    assertEqual(state.bitLength, 16, 'Set bit length to WORD (16)');

    Calculator.setBitLength(32);
    state = Calculator.getState();
    assertEqual(state.bitLength, 32, 'Set bit length to DWORD (32)');

    Calculator.setBitLength(64);
    state = Calculator.getState();
    assertEqual(state.bitLength, 64, 'Set bit length to QWORD (64)');
  }

  /**
   * Test: Bit length limits
   */
  function testBitLengthLimits() {
    console.log('\n--- Test: Bit Length Limits ---');

    // BYTE mode: max 255
    Calculator.setBitLength(8);
    const result8 = Calculator.clampToBitLength(300);
    assertEqual(result8, 44, 'BYTE (8-bit): 300 → 44 (300 & 0xFF)');

    // WORD mode: max 65535
    Calculator.setBitLength(16);
    const result16 = Calculator.clampToBitLength(70000);
    assertEqual(result16, 4464, 'WORD (16-bit): 70000 → 4464 (70000 & 0xFFFF)');

    // DWORD mode: max 4294967295
    Calculator.setBitLength(32);
    const result32 = Calculator.clampToBitLength(5000000000);
    assertEqual(result32, 705032704, 'DWORD (32-bit): Clamped correctly');
  }

  /**
   * Test: Memory Clear (MC)
   */
  function testMemoryClear() {
    console.log('\n--- Test: Memory Clear (MC) ---');

    Calculator.clear();

    // Set memory to a non-zero value
    Calculator.inputNumber('5');
    Calculator.memoryStore();

    // Clear memory
    Calculator.memoryClear();

    const state = Calculator.getState();
    assertEqual(state.memoryValue, 0, 'MC: Memory cleared to 0');
    assertEqual(state.hasMemory, false, 'MC: hasMemory flag is false');
  }

  /**
   * Test: Memory Store (MS)
   */
  function testMemoryStore() {
    console.log('\n--- Test: Memory Store (MS) ---');

    Calculator.clear();
    Calculator.memoryClear();

    // Store value in memory
    Calculator.inputNumber('4');
    Calculator.inputNumber('2');
    Calculator.memoryStore();

    const state = Calculator.getState();
    assertEqual(state.memoryValue, 42, 'MS: Memory stores current value (42)');
    assertEqual(state.hasMemory, true, 'MS: hasMemory flag is true');
  }

  /**
   * Test: Memory Recall (MR)
   */
  function testMemoryRecall() {
    console.log('\n--- Test: Memory Recall (MR) ---');

    Calculator.clear();
    Calculator.memoryClear();

    // Store value
    Calculator.inputNumber('1');
    Calculator.inputNumber('2');
    Calculator.inputNumber('3');
    Calculator.memoryStore();

    // Input different value
    Calculator.clear();
    Calculator.inputNumber('9');

    // Recall memory
    Calculator.memoryRecall();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '123', 'MR: Recalled value is 123');
    assertEqual(state.isResultDisplayed, true, 'MR: Result displayed flag is true');
  }

  /**
   * Test: Memory Add (M+)
   */
  function testMemoryAdd() {
    console.log('\n--- Test: Memory Add (M+) ---');

    Calculator.clear();
    Calculator.memoryClear();

    // Store initial value
    Calculator.inputNumber('1');
    Calculator.inputNumber('0');
    Calculator.memoryStore();

    // Add to memory
    Calculator.clear();
    Calculator.inputNumber('5');
    Calculator.memoryAdd();

    let state = Calculator.getState();
    assertEqual(state.memoryValue, 15, 'M+: Memory value is 10 + 5 = 15');

    // Add again
    Calculator.clear();
    Calculator.inputNumber('3');
    Calculator.memoryAdd();

    state = Calculator.getState();
    assertEqual(state.memoryValue, 18, 'M+: Memory value is 15 + 3 = 18');
    assertEqual(state.hasMemory, true, 'M+: hasMemory flag is true');
  }

  /**
   * Test: Memory Subtract (M-)
   */
  function testMemorySubtract() {
    console.log('\n--- Test: Memory Subtract (M-) ---');

    Calculator.clear();
    Calculator.memoryClear();

    // Store initial value
    Calculator.inputNumber('5');
    Calculator.inputNumber('0');
    Calculator.memoryStore();

    // Subtract from memory
    Calculator.clear();
    Calculator.inputNumber('1');
    Calculator.inputNumber('2');
    Calculator.memorySubtract();

    let state = Calculator.getState();
    assertEqual(state.memoryValue, 38, 'M-: Memory value is 50 - 12 = 38');

    // Subtract again
    Calculator.clear();
    Calculator.inputNumber('8');
    Calculator.memorySubtract();

    state = Calculator.getState();
    assertEqual(state.memoryValue, 30, 'M-: Memory value is 38 - 8 = 30');
    assertEqual(state.hasMemory, true, 'M-: hasMemory flag is true');
  }

  /**
   * Test: Memory operations with calculations
   */
  function testMemoryWithCalculations() {
    console.log('\n--- Test: Memory with Calculations ---');

    Calculator.clear();
    Calculator.memoryClear();

    // Calculate 5 + 3 = 8
    Calculator.inputNumber('5');
    Calculator.inputOperator('+');
    Calculator.inputNumber('3');
    Calculator.calculate();

    // Store result (8) in memory
    Calculator.memoryStore();

    // Calculate 10 × 2 = 20
    Calculator.clear();
    Calculator.inputNumber('1');
    Calculator.inputNumber('0');
    Calculator.inputOperator('×');
    Calculator.inputNumber('2');
    Calculator.calculate();

    // Add result (20) to memory
    Calculator.memoryAdd();

    let state = Calculator.getState();
    assertEqual(state.memoryValue, 28, 'Memory: 8 + 20 = 28');

    // Recall and use in calculation
    Calculator.clear();
    Calculator.memoryRecall();
    Calculator.inputOperator('-');
    Calculator.inputNumber('8');
    Calculator.calculate();

    state = Calculator.getState();
    assertEqual(state.currentValue, '20', 'Calculation with recalled memory: 28 - 8 = 20');
  }

  /**
   * Test: Memory with zero
   */
  function testMemoryWithZero() {
    console.log('\n--- Test: Memory with Zero ---');

    Calculator.clear();
    Calculator.memoryClear();

    // Recall when memory is 0
    Calculator.memoryRecall();

    let state = Calculator.getState();
    assertEqual(state.currentValue, '0', 'MR with zero memory: currentValue unchanged (0)');

    // Add 0 to memory
    Calculator.inputNumber('0');
    Calculator.memoryStore();

    state = Calculator.getState();
    assertEqual(state.memoryValue, 0, 'MS with 0: Memory is 0');
    assertEqual(state.hasMemory, false, 'MS with 0: hasMemory flag is false');
  }

  /**
   * Run all tests
   */
  function runAllTests() {
    console.log('========================================');
    console.log('Calculator Unit Tests - Starting');
    console.log('========================================');

    // Initialize calculator
    Calculator.init();

    // Run tests
    testAddition();
    testSubtraction();
    testMultiplication();
    testDivision();
    testDivisionByZero();
    testDecimalCalculation();
    testContinuousCalculation();
    testClearFunction();
    testClearEntry();
    testNegate();
    testPercent();
    testSquareRoot();
    testSquare();
    testReciprocal();
    testBoundaryValues();

    // Base conversion tests
    testBaseConversionDecToHex();
    testBaseConversionDecToOct();
    testBaseConversionDecToBin();
    testBaseConversionHexToDec();
    testBaseConversionHexToOct();
    testBaseConversionHexToBin();
    testBaseConversionBinToDec();
    testBaseConversionOctToDec();
    testGetValueInAllBases();
    testInvalidBaseConversion();
    testBaseModeSwitching();
    testBitLengthSetting();
    testBitLengthLimits();

    // Memory function tests
    testMemoryClear();
    testMemoryStore();
    testMemoryRecall();
    testMemoryAdd();
    testMemorySubtract();
    testMemoryWithCalculations();
    testMemoryWithZero();

    // Print summary
    console.log('\n========================================');
    console.log('Test Summary');
    console.log('========================================');
    console.log(`Total:  ${results.total}`);
    console.log(`Passed: ${results.passed} ✓`);
    console.log(`Failed: ${results.failed} ✗`);
    console.log(`Pass Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
    console.log('========================================\n');

    // Return results for automated checking
    return results;
  }

  // Auto-run tests when loaded
  if (typeof Calculator !== 'undefined') {
    runAllTests();
  } else {
    console.error('Calculator module not loaded. Please include calculator.js before this test file.');
  }

  // Export for manual testing
  window.CalculatorTests = {
    runAllTests,
    results
  };
})();
