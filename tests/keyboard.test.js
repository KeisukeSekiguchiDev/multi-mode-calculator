/**
 * Keyboard Handler Unit Tests
 * T-213: keyboard.js tests
 */

// Test results container
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Simple test framework
function describe(description, fn) {
  console.group(description);
  fn();
  console.groupEnd();
}

function it(description, fn) {
  try {
    fn();
    testResults.passed++;
    testResults.tests.push({ description, status: 'passed' });
    console.log('✓ ' + description);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ description, status: 'failed', error: error.message });
    console.error('✗ ' + description + ': ' + error.message);
  }
}

function expect(actual) {
  return {
    toBe: function(expected) {
      if (actual !== expected) {
        throw new Error('Expected ' + expected + ' but got ' + actual);
      }
    },
    toEqual: function(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error('Expected ' + JSON.stringify(expected) + ' but got ' + JSON.stringify(actual));
      }
    },
    toBeTruthy: function() {
      if (!actual) {
        throw new Error('Expected truthy value but got ' + actual);
      }
    },
    toBeFalsy: function() {
      if (actual) {
        throw new Error('Expected falsy value but got ' + actual);
      }
    },
    toBeNull: function() {
      if (actual !== null) {
        throw new Error('Expected null but got ' + actual);
      }
    },
    toContain: function(item) {
      if (!actual.includes(item)) {
        throw new Error('Expected ' + JSON.stringify(actual) + ' to contain ' + item);
      }
    },
    toBeGreaterThan: function(expected) {
      if (!(actual > expected)) {
        throw new Error('Expected ' + actual + ' to be greater than ' + expected);
      }
    }
  };
}

// Mock Calculator for testing
const MockCalculator = {
  state: {
    currentValue: '0',
    base: 10
  },
  inputNumber: function(value) { this.state.currentValue = value; },
  inputOperator: function(value) { },
  inputDecimal: function() { },
  calculate: function() { },
  clear: function() { this.state.currentValue = '0'; },
  backspace: function() { },
  negate: function() { },
  percent: function() { },
  getState: function() { return this.state; },
  setCurrentValue: function(value) { this.state.currentValue = value; }
};

// Run tests
function runTests() {
  console.log('=== KeyboardHandler Unit Tests ===\n');

  describe('KeyboardHandler Module', function() {

    describe('Initialization', function() {
      it('should have init method', function() {
        expect(typeof KeyboardHandler.init).toBe('function');
      });

      it('should have enable method', function() {
        expect(typeof KeyboardHandler.enable).toBe('function');
      });

      it('should have disable method', function() {
        expect(typeof KeyboardHandler.disable).toBe('function');
      });

      it('should have setMode method', function() {
        expect(typeof KeyboardHandler.setMode).toBe('function');
      });

      it('should have getState method', function() {
        expect(typeof KeyboardHandler.getState).toBe('function');
      });

      it('should initialize successfully', function() {
        const result = KeyboardHandler.init();
        // First init returns true, subsequent returns undefined (already initialized)
        expect(result === true || result === undefined).toBeTruthy();
      });
    });

    describe('State Management', function() {
      it('should return current state', function() {
        const state = KeyboardHandler.getState();
        expect(state).toBeTruthy();
        expect(typeof state.isEnabled).toBe('boolean');
        expect(typeof state.currentMode).toBe('string');
      });

      it('should enable keyboard input', function() {
        KeyboardHandler.enable();
        const state = KeyboardHandler.getState();
        expect(state.isEnabled).toBe(true);
      });

      it('should disable keyboard input', function() {
        KeyboardHandler.disable();
        const state = KeyboardHandler.getState();
        expect(state.isEnabled).toBe(false);
        // Re-enable for other tests
        KeyboardHandler.enable();
      });

      it('should set mode to standard', function() {
        KeyboardHandler.setMode('standard');
        const state = KeyboardHandler.getState();
        expect(state.currentMode).toBe('standard');
      });

      it('should set mode to scientific', function() {
        KeyboardHandler.setMode('scientific');
        const state = KeyboardHandler.getState();
        expect(state.currentMode).toBe('scientific');
      });

      it('should set mode to programmer', function() {
        KeyboardHandler.setMode('programmer');
        const state = KeyboardHandler.getState();
        expect(state.currentMode).toBe('programmer');
      });

      it('should ignore invalid mode', function() {
        KeyboardHandler.setMode('standard');
        KeyboardHandler.setMode('invalid');
        const state = KeyboardHandler.getState();
        expect(state.currentMode).toBe('standard');
      });
    });

    describe('Key Mapping', function() {
      it('should map number keys in standard mode', function() {
        KeyboardHandler.setMode('standard');
        const mapping = KeyboardHandler._test.getKeyMapping('5', 'standard');
        expect(mapping).toBeTruthy();
        expect(mapping.action).toBe('number');
        expect(mapping.value).toBe('5');
      });

      it('should map operator keys', function() {
        const plusMapping = KeyboardHandler._test.getKeyMapping('+', 'standard');
        expect(plusMapping.action).toBe('operator');
        expect(plusMapping.value).toBe('+');

        const minusMapping = KeyboardHandler._test.getKeyMapping('-', 'standard');
        expect(minusMapping.action).toBe('operator');
        expect(minusMapping.value).toBe('-');

        const multiplyMapping = KeyboardHandler._test.getKeyMapping('*', 'standard');
        expect(multiplyMapping.action).toBe('operator');

        const divideMapping = KeyboardHandler._test.getKeyMapping('/', 'standard');
        expect(divideMapping.action).toBe('operator');
      });

      it('should map Enter key to equals', function() {
        const mapping = KeyboardHandler._test.getKeyMapping('Enter', 'standard');
        expect(mapping.action).toBe('equals');
      });

      it('should map = key to equals', function() {
        const mapping = KeyboardHandler._test.getKeyMapping('=', 'standard');
        expect(mapping.action).toBe('equals');
      });

      it('should map Escape key to clear', function() {
        const mapping = KeyboardHandler._test.getKeyMapping('Escape', 'standard');
        expect(mapping.action).toBe('clear');
      });

      it('should map Backspace key', function() {
        const mapping = KeyboardHandler._test.getKeyMapping('Backspace', 'standard');
        expect(mapping.action).toBe('backspace');
      });

      it('should map decimal point', function() {
        const dotMapping = KeyboardHandler._test.getKeyMapping('.', 'standard');
        expect(dotMapping.action).toBe('decimal');

        const commaMapping = KeyboardHandler._test.getKeyMapping(',', 'standard');
        expect(commaMapping.action).toBe('decimal');
      });

      it('should map percent key', function() {
        const mapping = KeyboardHandler._test.getKeyMapping('%', 'standard');
        expect(mapping.action).toBe('percent');
      });

      it('should return null for unmapped keys', function() {
        const mapping = KeyboardHandler._test.getKeyMapping('x', 'standard');
        expect(mapping).toBeNull();
      });
    });

    describe('Programmer Mode Keys', function() {
      it('should map hex digits A-F in programmer mode', function() {
        KeyboardHandler.setMode('programmer');

        const mappingA = KeyboardHandler._test.getKeyMapping('a', 'programmer');
        expect(mappingA).toBeTruthy();
        expect(mappingA.action).toBe('hex');
        expect(mappingA.value).toBe('A');

        const mappingF = KeyboardHandler._test.getKeyMapping('F', 'programmer');
        expect(mappingF.action).toBe('hex');
        expect(mappingF.value).toBe('F');
      });

      it('should map bitwise operators in programmer mode', function() {
        const andMapping = KeyboardHandler._test.getKeyMapping('&', 'programmer');
        expect(andMapping).toBeTruthy();
        expect(andMapping.action).toBe('bitwise');
        expect(andMapping.value).toBe('AND');

        const orMapping = KeyboardHandler._test.getKeyMapping('|', 'programmer');
        expect(orMapping.action).toBe('bitwise');
        expect(orMapping.value).toBe('OR');

        const xorMapping = KeyboardHandler._test.getKeyMapping('^', 'programmer');
        expect(xorMapping.action).toBe('bitwise');
        expect(xorMapping.value).toBe('XOR');
      });

      it('should not map hex digits in standard mode', function() {
        KeyboardHandler.setMode('standard');
        const mapping = KeyboardHandler._test.getKeyMapping('a', 'standard');
        expect(mapping).toBeNull();
      });
    });

    describe('Base Validation', function() {
      it('should validate digits for binary (base 2)', function() {
        expect(KeyboardHandler._test.isValidForBase('0', 2)).toBe(true);
        expect(KeyboardHandler._test.isValidForBase('1', 2)).toBe(true);
        expect(KeyboardHandler._test.isValidForBase('2', 2)).toBe(false);
      });

      it('should validate digits for octal (base 8)', function() {
        expect(KeyboardHandler._test.isValidForBase('0', 8)).toBe(true);
        expect(KeyboardHandler._test.isValidForBase('7', 8)).toBe(true);
        expect(KeyboardHandler._test.isValidForBase('8', 8)).toBe(false);
      });

      it('should validate digits for decimal (base 10)', function() {
        expect(KeyboardHandler._test.isValidForBase('0', 10)).toBe(true);
        expect(KeyboardHandler._test.isValidForBase('9', 10)).toBe(true);
      });

      it('should validate hex digits only for base 16', function() {
        expect(KeyboardHandler._test.isValidForBase('A', 16)).toBe(true);
        expect(KeyboardHandler._test.isValidForBase('F', 16)).toBe(true);
        expect(KeyboardHandler._test.isValidForBase('A', 10)).toBe(false);
        expect(KeyboardHandler._test.isValidForBase('F', 8)).toBe(false);
      });

      it('should allow operators for all bases', function() {
        expect(KeyboardHandler._test.isValidForBase('+', 2)).toBe(true);
        expect(KeyboardHandler._test.isValidForBase('+', 16)).toBe(true);
      });
    });

    describe('Input Element Detection', function() {
      it('should detect input elements', function() {
        const input = document.createElement('input');
        expect(KeyboardHandler._test.isInputElement(input)).toBe(true);

        const textarea = document.createElement('textarea');
        expect(KeyboardHandler._test.isInputElement(textarea)).toBe(true);

        const select = document.createElement('select');
        expect(KeyboardHandler._test.isInputElement(select)).toBe(true);
      });

      it('should detect contenteditable elements', function() {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        expect(KeyboardHandler._test.isInputElement(div)).toBe(true);
      });

      it('should return false for regular elements', function() {
        const div = document.createElement('div');
        expect(KeyboardHandler._test.isInputElement(div)).toBe(false);

        const button = document.createElement('button');
        expect(KeyboardHandler._test.isInputElement(button)).toBe(false);
      });

      it('should handle null element', function() {
        expect(KeyboardHandler._test.isInputElement(null)).toBe(false);
      });
    });

  });

  // Print summary
  console.log('\n=== Test Summary ===');
  console.log('Passed: ' + testResults.passed);
  console.log('Failed: ' + testResults.failed);
  console.log('Total: ' + (testResults.passed + testResults.failed));

  return testResults;
}

// Auto-run tests when loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', function() {
    // Delay to ensure KeyboardHandler is loaded
    setTimeout(runTests, 100);
  });
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests, testResults };
}
