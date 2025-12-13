/**
 * Node.js test runner for bitwise operations
 */

// Load Calculator module first
const fs = require('fs');
const path = require('path');

const calculatorCode = fs.readFileSync(
  path.join(__dirname, '../src/js/calculator.js'),
  'utf8'
);

// Mock browser environment before loading calculator
global.window = {};
global.DisplayManager = { update: () => {} };
global.HistoryManager = { add: () => {} };

// Execute calculator code and make it globally available
global.Calculator = eval(calculatorCode);

// Load test suite
const testCode = fs.readFileSync(
  path.join(__dirname, 'bitwise.test.js'),
  'utf8'
);

eval(testCode);

// Exit with appropriate code
if (window.BitwiseTests && window.BitwiseTests.results) {
  const results = window.BitwiseTests.results;
  process.exit(results.failed > 0 ? 1 : 0);
} else {
  process.exit(1);
}
