/**
 * Simple bitwise operations test runner
 */

// Mock browser environment
if (typeof window === 'undefined') {
  global.window = {};
}
if (typeof DisplayManager === 'undefined') {
  global.DisplayManager = { update: () => {} };
}
if (typeof HistoryManager === 'undefined') {
  global.HistoryManager = { add: () => {} };
}

// Load modules
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load and execute calculator.js
const calculatorCode = fs.readFileSync(
  path.join(__dirname, '../src/js/calculator.js'),
  'utf8'
);

// Create a sandbox context with necessary globals
const sandbox = {
  window: global.window,
  DisplayManager: global.DisplayManager,
  HistoryManager: global.HistoryManager,
  console: console
};

// Execute the code in the sandbox
vm.createContext(sandbox);
const Calculator = vm.runInContext(calculatorCode, sandbox);

console.log('Calculator loaded:', typeof Calculator);
console.log('========================================');
console.log('Bitwise Operations Unit Tests - Starting');
console.log('========================================');

// Initialize
Calculator.init();

let passed = 0;
let failed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`✗ FAIL: ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  const condition = actual === expected;
  if (!condition) {
    console.error(`  Expected: ${expected}, Got: ${actual}`);
  }
  assert(condition, message);
}

// Test: Bitwise AND
console.log('\n--- Test: Bitwise AND ---');
Calculator.clear();
Calculator.setMode('programmer');
Calculator.setBase(10);
Calculator.setBitLength(32);
Calculator.inputNumber('1');
Calculator.inputNumber('2');
Calculator.bitwiseOperation('AND');
Calculator.inputNumber('1');
Calculator.inputNumber('0');
Calculator.calculate();
assertEqual(Calculator.getState().currentValue, '8', 'AND: 12 AND 10 = 8');

// Test: Bitwise OR
console.log('\n--- Test: Bitwise OR ---');
Calculator.clear();
Calculator.inputNumber('1');
Calculator.inputNumber('2');
Calculator.bitwiseOperation('OR');
Calculator.inputNumber('1');
Calculator.inputNumber('0');
Calculator.calculate();
assertEqual(Calculator.getState().currentValue, '14', 'OR: 12 OR 10 = 14');

// Test: Bitwise XOR
console.log('\n--- Test: Bitwise XOR ---');
Calculator.clear();
Calculator.inputNumber('1');
Calculator.inputNumber('2');
Calculator.bitwiseOperation('XOR');
Calculator.inputNumber('1');
Calculator.inputNumber('0');
Calculator.calculate();
assertEqual(Calculator.getState().currentValue, '6', 'XOR: 12 XOR 10 = 6');

// Test: Bitwise NOT
console.log('\n--- Test: Bitwise NOT ---');
Calculator.clear();
Calculator.setBitLength(8);
Calculator.inputNumber('5');
Calculator.bitwiseOperation('NOT');
assertEqual(Calculator.getState().currentValue, '250', 'NOT: NOT 5 (8-bit) = 250');

// Test: Bitwise NAND
console.log('\n--- Test: Bitwise NAND ---');
Calculator.clear();
Calculator.inputNumber('1');
Calculator.inputNumber('2');
Calculator.bitwiseOperation('NAND');
Calculator.inputNumber('1');
Calculator.inputNumber('0');
Calculator.calculate();
assertEqual(Calculator.getState().currentValue, '247', 'NAND: 12 NAND 10 (8-bit) = 247');

// Test: Bitwise NOR
console.log('\n--- Test: Bitwise NOR ---');
Calculator.clear();
Calculator.inputNumber('1');
Calculator.inputNumber('2');
Calculator.bitwiseOperation('NOR');
Calculator.inputNumber('1');
Calculator.inputNumber('0');
Calculator.calculate();
assertEqual(Calculator.getState().currentValue, '241', 'NOR: 12 NOR 10 (8-bit) = 241');

// Test: Left Shift
console.log('\n--- Test: Left Shift ---');
Calculator.clear();
Calculator.setBitLength(32);
Calculator.inputNumber('5');
Calculator.bitwiseOperation('LSH');
Calculator.inputNumber('2');
Calculator.calculate();
assertEqual(Calculator.getState().currentValue, '20', 'LSH: 5 << 2 = 20');

// Test: Right Shift
console.log('\n--- Test: Right Shift ---');
Calculator.clear();
Calculator.inputNumber('2');
Calculator.inputNumber('0');
Calculator.bitwiseOperation('RSH');
Calculator.inputNumber('2');
Calculator.calculate();
assertEqual(Calculator.getState().currentValue, '5', 'RSH: 20 >> 2 = 5');

// Test: Toggle Bit
console.log('\n--- Test: Toggle Bit ---');
Calculator.clear();
Calculator.setBitLength(8);
Calculator.inputNumber('0');
Calculator.toggleBit(0);
assertEqual(Calculator.getState().currentValue, '1', 'Toggle bit 0: 0 → 1');

Calculator.toggleBit(2);
assertEqual(Calculator.getState().currentValue, '5', 'Toggle bit 2: 1 → 5');

Calculator.toggleBit(0);
assertEqual(Calculator.getState().currentValue, '4', 'Toggle bit 0 again: 5 → 4');

// Test: Toggle bit out of range
console.log('\n--- Test: Toggle Bit Out of Range ---');
Calculator.clear();
Calculator.inputNumber('5');
Calculator.toggleBit(8);
assertEqual(Calculator.getState().currentValue, '5', 'Toggle out of range: value unchanged');

Calculator.toggleBit(-1);
assertEqual(Calculator.getState().currentValue, '5', 'Toggle negative index: value unchanged');

// Print summary
console.log('\n========================================');
console.log('Test Summary');
console.log('========================================');
console.log(`Total:  ${total}`);
console.log(`Passed: ${passed} ✓`);
console.log(`Failed: ${failed} ✗`);
console.log(`Pass Rate: ${((passed / total) * 100).toFixed(2)}%`);
console.log('========================================\n');

process.exit(failed > 0 ? 1 : 0);
