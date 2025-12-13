/**
 * Calculator Module - Bitwise Operations Unit Tests
 * Tests for bitwise AND, OR, XOR, NOT, NAND, NOR, shifts, and bit manipulation
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
   * Test: Bitwise AND operation
   */
  function testBitwiseAnd() {
    console.log('\n--- Test: Bitwise AND ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(32);

    // Test: 12 AND 10 = 8 (1100 AND 1010 = 1000)
    Calculator.inputNumber('1');
    Calculator.inputNumber('2');
    Calculator.bitwiseOperation('AND');
    Calculator.inputNumber('1');
    Calculator.inputNumber('0');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '8', 'AND: 12 AND 10 = 8');
  }

  /**
   * Test: Bitwise OR operation
   */
  function testBitwiseOr() {
    console.log('\n--- Test: Bitwise OR ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(32);

    // Test: 12 OR 10 = 14 (1100 OR 1010 = 1110)
    Calculator.inputNumber('1');
    Calculator.inputNumber('2');
    Calculator.bitwiseOperation('OR');
    Calculator.inputNumber('1');
    Calculator.inputNumber('0');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '14', 'OR: 12 OR 10 = 14');
  }

  /**
   * Test: Bitwise XOR operation
   */
  function testBitwiseXor() {
    console.log('\n--- Test: Bitwise XOR ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(32);

    // Test: 12 XOR 10 = 6 (1100 XOR 1010 = 0110)
    Calculator.inputNumber('1');
    Calculator.inputNumber('2');
    Calculator.bitwiseOperation('XOR');
    Calculator.inputNumber('1');
    Calculator.inputNumber('0');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '6', 'XOR: 12 XOR 10 = 6');
  }

  /**
   * Test: Bitwise NOT operation
   */
  function testBitwiseNot() {
    console.log('\n--- Test: Bitwise NOT ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(8); // 8-bit for easier verification

    // Test: NOT 5 (00000101) = 250 (11111010)
    Calculator.inputNumber('5');
    Calculator.bitwiseOperation('NOT');

    const state = Calculator.getState();
    assertEqual(state.currentValue, '250', 'NOT: NOT 5 (8-bit) = 250');
  }

  /**
   * Test: Bitwise NAND operation
   */
  function testBitwiseNand() {
    console.log('\n--- Test: Bitwise NAND ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(8);

    // Test: 12 NAND 10 = 247 (NOT(1100 AND 1010) = NOT(1000) = 11110111)
    Calculator.inputNumber('1');
    Calculator.inputNumber('2');
    Calculator.bitwiseOperation('NAND');
    Calculator.inputNumber('1');
    Calculator.inputNumber('0');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '247', 'NAND: 12 NAND 10 (8-bit) = 247');
  }

  /**
   * Test: Bitwise NOR operation
   */
  function testBitwiseNor() {
    console.log('\n--- Test: Bitwise NOR ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(8);

    // Test: 12 NOR 10 = 241 (NOT(1100 OR 1010) = NOT(1110) = 11110001)
    Calculator.inputNumber('1');
    Calculator.inputNumber('2');
    Calculator.bitwiseOperation('NOR');
    Calculator.inputNumber('1');
    Calculator.inputNumber('0');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '241', 'NOR: 12 NOR 10 (8-bit) = 241');
  }

  /**
   * Test: Left shift operation
   */
  function testLeftShift() {
    console.log('\n--- Test: Left Shift ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(32);

    // Test: 5 << 2 = 20 (0101 << 2 = 10100)
    Calculator.inputNumber('5');
    Calculator.bitwiseOperation('LSH');
    Calculator.inputNumber('2');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '20', 'LSH: 5 << 2 = 20');
  }

  /**
   * Test: Right shift operation
   */
  function testRightShift() {
    console.log('\n--- Test: Right Shift ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(32);

    // Test: 20 >> 2 = 5 (10100 >> 2 = 0101)
    Calculator.inputNumber('2');
    Calculator.inputNumber('0');
    Calculator.bitwiseOperation('RSH');
    Calculator.inputNumber('2');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '5', 'RSH: 20 >> 2 = 5');
  }

  /**
   * Test: Bit toggle operation
   */
  function testToggleBit() {
    console.log('\n--- Test: Toggle Bit ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(8);

    // Start with 0 (00000000)
    Calculator.inputNumber('0');

    // Toggle bit 0: 0 → 1 (00000001)
    Calculator.toggleBit(0);
    let state = Calculator.getState();
    assertEqual(state.currentValue, '1', 'Toggle bit 0: 0 → 1');

    // Toggle bit 2: 1 → 5 (00000101)
    Calculator.toggleBit(2);
    state = Calculator.getState();
    assertEqual(state.currentValue, '5', 'Toggle bit 2: 1 → 5');

    // Toggle bit 0 again: 5 → 4 (00000100)
    Calculator.toggleBit(0);
    state = Calculator.getState();
    assertEqual(state.currentValue, '4', 'Toggle bit 0 again: 5 → 4');
  }

  /**
   * Test: Bitwise operations with HEX base
   */
  function testBitwiseWithHex() {
    console.log('\n--- Test: Bitwise with HEX ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(16);
    Calculator.setBitLength(8);

    // Test: 0xF0 AND 0x0F = 0x00
    Calculator.inputHexDigit('F');
    Calculator.inputNumber('0');
    Calculator.bitwiseOperation('AND');
    Calculator.inputNumber('0');
    Calculator.inputHexDigit('F');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '0', 'AND (HEX): 0xF0 AND 0x0F = 0x00');
  }

  /**
   * Test: Bitwise operations with BIN base
   */
  function testBitwiseWithBin() {
    console.log('\n--- Test: Bitwise with BIN ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(2);
    Calculator.setBitLength(8);

    // Test: 1111 (15) OR 0101 (5) = 1111 (15)
    Calculator.inputNumber('1');
    Calculator.inputNumber('1');
    Calculator.inputNumber('1');
    Calculator.inputNumber('1');
    Calculator.bitwiseOperation('OR');
    Calculator.inputNumber('0');
    Calculator.inputNumber('1');
    Calculator.inputNumber('0');
    Calculator.inputNumber('1');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '1111', 'OR (BIN): 1111 OR 0101 = 1111');
  }

  /**
   * Test: Bit length clamping (BYTE)
   */
  function testBitLengthClampByte() {
    console.log('\n--- Test: Bit Length Clamp (BYTE) ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(8);

    // Test: 256 clamped to 8-bit = 0 (overflow)
    Calculator.inputNumber('2');
    Calculator.inputNumber('5');
    Calculator.inputNumber('6');
    Calculator.inputOperator('+'); // Trigger calculation to apply clamp
    Calculator.inputNumber('0');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '0', 'BYTE clamp: 256 → 0 (overflow)');
  }

  /**
   * Test: Bit length clamping (WORD)
   */
  function testBitLengthClampWord() {
    console.log('\n--- Test: Bit Length Clamp (WORD) ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(16);

    // Test: 65535 + 1 = 0 (overflow in 16-bit)
    Calculator.inputNumber('6');
    Calculator.inputNumber('5');
    Calculator.inputNumber('5');
    Calculator.inputNumber('3');
    Calculator.inputNumber('5');
    Calculator.inputOperator('+');
    Calculator.inputNumber('1');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '0', 'WORD clamp: 65535 + 1 = 0 (overflow)');
  }

  /**
   * Test: Consecutive bitwise operations
   */
  function testConsecutiveBitwiseOps() {
    console.log('\n--- Test: Consecutive Bitwise Operations ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(8);

    // Test: (15 AND 7) OR 8 = 15
    // 15 AND 7 = 7 (1111 AND 0111 = 0111)
    // 7 OR 8 = 15 (0111 OR 1000 = 1111)
    Calculator.inputNumber('1');
    Calculator.inputNumber('5');
    Calculator.bitwiseOperation('AND');
    Calculator.inputNumber('7');
    Calculator.bitwiseOperation('OR');
    Calculator.inputNumber('8');
    Calculator.calculate();

    const state = Calculator.getState();
    assertEqual(state.currentValue, '15', 'Consecutive: (15 AND 7) OR 8 = 15');
  }

  /**
   * Test: Toggle bit out of range (should be ignored)
   */
  function testToggleBitOutOfRange() {
    console.log('\n--- Test: Toggle Bit Out of Range ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(8);

    Calculator.inputNumber('5');

    // Try to toggle bit 8 (out of range for 8-bit)
    Calculator.toggleBit(8);

    const state = Calculator.getState();
    assertEqual(state.currentValue, '5', 'Toggle out of range: value unchanged');
  }

  /**
   * Test: Toggle bit with negative index (should be ignored)
   */
  function testToggleBitNegativeIndex() {
    console.log('\n--- Test: Toggle Bit Negative Index ---');

    Calculator.clear();
    Calculator.setMode('programmer');
    Calculator.setBase(10);
    Calculator.setBitLength(8);

    Calculator.inputNumber('5');

    // Try to toggle bit -1 (invalid)
    Calculator.toggleBit(-1);

    const state = Calculator.getState();
    assertEqual(state.currentValue, '5', 'Toggle negative index: value unchanged');
  }

  /**
   * Run all tests
   */
  function runAllTests() {
    console.log('========================================');
    console.log('Bitwise Operations Unit Tests - Starting');
    console.log('========================================');

    // Initialize calculator
    Calculator.init();

    // Run bitwise operation tests
    testBitwiseAnd();
    testBitwiseOr();
    testBitwiseXor();
    testBitwiseNot();
    testBitwiseNand();
    testBitwiseNor();
    testLeftShift();
    testRightShift();
    testToggleBit();
    testBitwiseWithHex();
    testBitwiseWithBin();
    testBitLengthClampByte();
    testBitLengthClampWord();
    testConsecutiveBitwiseOps();
    testToggleBitOutOfRange();
    testToggleBitNegativeIndex();

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
  window.BitwiseTests = {
    runAllTests,
    results
  };
})();
