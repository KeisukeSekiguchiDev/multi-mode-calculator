/**
 * Scientific Calculator Unit Tests
 * T-201: Scientific calculation tests
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
    toBeCloseTo: function(expected, precision = 10) {
      const factor = Math.pow(10, precision);
      const actualRounded = Math.round(actual * factor) / factor;
      const expectedRounded = Math.round(expected * factor) / factor;
      if (actualRounded !== expectedRounded) {
        throw new Error('Expected ' + expected + ' (±' + (1/factor) + ') but got ' + actual);
      }
    },
    toContain: function(substring) {
      if (!actual.includes(substring)) {
        throw new Error('Expected "' + actual + '" to contain "' + substring + '"');
      }
    }
  };
}

// Run tests
function runTests() {
  console.log('=== Scientific Calculator Unit Tests ===\n');

  describe('Scientific Calculator Module', function() {

    describe('Trigonometric Functions (DEG mode)', function() {

      it('should calculate sin(0) = 0', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('sin');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should calculate sin(30) = 0.5', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('3');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('sin');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0.5);
      });

      it('should calculate sin(90) = 1', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('9');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('sin');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1);
      });

      it('should calculate cos(0) = 1', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('cos');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1);
      });

      it('should calculate cos(60) = 0.5', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('6');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('cos');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0.5);
      });

      it('should calculate cos(90) = 0', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('9');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('cos');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should calculate tan(0) = 0', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('tan');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should calculate tan(45) = 1', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('4');
        Calculator.inputNumber('5');
        Calculator.scientificOperation('tan');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1);
      });
    });

    describe('Trigonometric Functions (RAD mode)', function() {

      it('should calculate sin(0) = 0 in RAD', function() {
        Calculator.clear();
        Calculator.setAngleMode('RAD');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('sin');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should calculate sin(π/2) ≈ 1 in RAD', function() {
        Calculator.clear();
        Calculator.setAngleMode('RAD');
        Calculator.scientificOperation('pi');
        Calculator.inputOperator('÷');
        Calculator.inputNumber('2');
        Calculator.calculate();
        Calculator.scientificOperation('sin');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1);
      });

      it('should calculate cos(π) = -1 in RAD', function() {
        Calculator.clear();
        Calculator.setAngleMode('RAD');
        Calculator.scientificOperation('pi');
        Calculator.scientificOperation('cos');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(-1);
      });
    });

    describe('Inverse Trigonometric Functions', function() {

      it('should calculate asin(0) = 0 in DEG', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('asin');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should calculate asin(0.5) = 30 in DEG', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('0');
        Calculator.inputDecimal();
        Calculator.inputNumber('5');
        Calculator.scientificOperation('asin');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(30);
      });

      it('should calculate asin(1) = 90 in DEG', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('1');
        Calculator.scientificOperation('asin');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(90);
      });

      it('should error on asin(2) - out of range', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('2');
        Calculator.scientificOperation('asin');
        const state = Calculator.getState();
        expect(state.hasError).toBe(true);
        expect(state.currentValue).toContain('Error');
      });

      it('should calculate acos(0) = 90 in DEG', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('acos');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(90);
      });

      it('should calculate acos(1) = 0 in DEG', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('1');
        Calculator.scientificOperation('acos');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should error on acos(-2) - out of range', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('2');
        Calculator.negate();
        Calculator.scientificOperation('acos');
        const state = Calculator.getState();
        expect(state.hasError).toBe(true);
      });

      it('should calculate atan(0) = 0 in DEG', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('atan');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should calculate atan(1) = 45 in DEG', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('1');
        Calculator.scientificOperation('atan');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(45);
      });
    });

    describe('Logarithmic Functions', function() {

      it('should calculate log(100) = 2', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.inputNumber('0');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('log');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(2);
      });

      it('should calculate log(1000) = 3', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.inputNumber('0');
        Calculator.inputNumber('0');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('log');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(3);
      });

      it('should calculate log(10) = 1', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('log');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1);
      });

      it('should error on log(0)', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('log');
        const state = Calculator.getState();
        expect(state.hasError).toBe(true);
      });

      it('should error on log(-10)', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.inputNumber('0');
        Calculator.negate();
        Calculator.scientificOperation('log');
        const state = Calculator.getState();
        expect(state.hasError).toBe(true);
      });

      it('should calculate ln(e) = 1', function() {
        Calculator.clear();
        Calculator.scientificOperation('e');
        Calculator.scientificOperation('ln');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1);
      });

      it('should calculate ln(1) = 0', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.scientificOperation('ln');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should error on ln(0)', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('ln');
        const state = Calculator.getState();
        expect(state.hasError).toBe(true);
      });

      it('should calculate log2(8) = 3', function() {
        Calculator.clear();
        Calculator.inputNumber('8');
        Calculator.scientificOperation('log2');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(3);
      });

      it('should calculate log2(16) = 4', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.inputNumber('6');
        Calculator.scientificOperation('log2');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(4);
      });
    });

    describe('Exponential Functions', function() {

      it('should calculate exp(0) = 1', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('exp');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1);
      });

      it('should calculate exp(1) = e', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.scientificOperation('exp');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(Math.E);
      });

      it('should calculate exp(2) = e²', function() {
        Calculator.clear();
        Calculator.inputNumber('2');
        Calculator.scientificOperation('exp');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(Math.E * Math.E);
      });

      it('should calculate pow10(0) = 1', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('pow10');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1);
      });

      it('should calculate pow10(2) = 100', function() {
        Calculator.clear();
        Calculator.inputNumber('2');
        Calculator.scientificOperation('pow10');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(100);
      });

      it('should calculate pow10(3) = 1000', function() {
        Calculator.clear();
        Calculator.inputNumber('3');
        Calculator.scientificOperation('pow10');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1000);
      });
    });

    describe('Root Functions', function() {

      it('should calculate sqrt(0) = 0', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('sqrt');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should calculate sqrt(4) = 2', function() {
        Calculator.clear();
        Calculator.inputNumber('4');
        Calculator.scientificOperation('sqrt');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(2);
      });

      it('should calculate sqrt(9) = 3', function() {
        Calculator.clear();
        Calculator.inputNumber('9');
        Calculator.scientificOperation('sqrt');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(3);
      });

      it('should calculate sqrt(16) = 4', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.inputNumber('6');
        Calculator.scientificOperation('sqrt');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(4);
      });

      it('should error on sqrt(-1)', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.negate();
        Calculator.scientificOperation('sqrt');
        const state = Calculator.getState();
        expect(state.hasError).toBe(true);
      });

      it('should calculate cbrt(0) = 0', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('cbrt');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should calculate cbrt(8) = 2', function() {
        Calculator.clear();
        Calculator.inputNumber('8');
        Calculator.scientificOperation('cbrt');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(2);
      });

      it('should calculate cbrt(27) = 3', function() {
        Calculator.clear();
        Calculator.inputNumber('2');
        Calculator.inputNumber('7');
        Calculator.scientificOperation('cbrt');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(3);
      });

      it('should calculate cbrt(-8) = -2', function() {
        Calculator.clear();
        Calculator.inputNumber('8');
        Calculator.negate();
        Calculator.scientificOperation('cbrt');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(-2);
      });
    });

    describe('Power Functions', function() {

      it('should calculate square(0) = 0', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('square');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should calculate square(5) = 25', function() {
        Calculator.clear();
        Calculator.inputNumber('5');
        Calculator.scientificOperation('square');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(25);
      });

      it('should calculate square(-3) = 9', function() {
        Calculator.clear();
        Calculator.inputNumber('3');
        Calculator.negate();
        Calculator.scientificOperation('square');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(9);
      });

      it('should calculate cube(0) = 0', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('cube');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });

      it('should calculate cube(3) = 27', function() {
        Calculator.clear();
        Calculator.inputNumber('3');
        Calculator.scientificOperation('cube');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(27);
      });

      it('should calculate cube(-2) = -8', function() {
        Calculator.clear();
        Calculator.inputNumber('2');
        Calculator.negate();
        Calculator.scientificOperation('cube');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(-8);
      });
    });

    describe('Other Functions', function() {

      it('should calculate factorial(0) = 1', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('factorial');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1);
      });

      it('should calculate factorial(1) = 1', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.scientificOperation('factorial');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(1);
      });

      it('should calculate factorial(5) = 120', function() {
        Calculator.clear();
        Calculator.inputNumber('5');
        Calculator.scientificOperation('factorial');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(120);
      });

      it('should calculate factorial(10) = 3628800', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('factorial');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(3628800);
      });

      it('should error on factorial(-1)', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.negate();
        Calculator.scientificOperation('factorial');
        const state = Calculator.getState();
        expect(state.hasError).toBe(true);
      });

      it('should calculate reciprocal(2) = 0.5', function() {
        Calculator.clear();
        Calculator.inputNumber('2');
        Calculator.scientificOperation('reciprocal');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0.5);
      });

      it('should calculate reciprocal(4) = 0.25', function() {
        Calculator.clear();
        Calculator.inputNumber('4');
        Calculator.scientificOperation('reciprocal');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0.25);
      });

      it('should error on reciprocal(0)', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('reciprocal');
        const state = Calculator.getState();
        expect(state.hasError).toBe(true);
      });

      it('should calculate abs(5) = 5', function() {
        Calculator.clear();
        Calculator.inputNumber('5');
        Calculator.scientificOperation('abs');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(5);
      });

      it('should calculate abs(-5) = 5', function() {
        Calculator.clear();
        Calculator.inputNumber('5');
        Calculator.negate();
        Calculator.scientificOperation('abs');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(5);
      });

      it('should calculate abs(0) = 0', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.scientificOperation('abs');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0);
      });
    });

    describe('Constants', function() {

      it('should return PI = 3.14159...', function() {
        Calculator.clear();
        Calculator.scientificOperation('pi');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(Math.PI);
      });

      it('should return E = 2.71828...', function() {
        Calculator.clear();
        Calculator.scientificOperation('e');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(Math.E);
      });
    });

    describe('Edge Cases', function() {

      it('should handle very small sin values near 180°', function() {
        Calculator.clear();
        Calculator.setAngleMode('DEG');
        Calculator.inputNumber('1');
        Calculator.inputNumber('8');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('sin');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(Math.abs(result)).toBeCloseTo(0, 8); // Very close to 0
      });

      it('should handle sqrt(0.25) = 0.5', function() {
        Calculator.clear();
        Calculator.inputNumber('0');
        Calculator.inputDecimal();
        Calculator.inputNumber('2');
        Calculator.inputNumber('5');
        Calculator.scientificOperation('sqrt');
        const result = parseFloat(Calculator.getState().currentValue);
        expect(result).toBeCloseTo(0.5);
      });

      it('should handle large factorial overflow gracefully', function() {
        Calculator.clear();
        Calculator.inputNumber('1');
        Calculator.inputNumber('8');
        Calculator.inputNumber('0');
        Calculator.scientificOperation('factorial');
        // Should result in Infinity, which triggers error
        const state = Calculator.getState();
        expect(state.currentValue).toContain('Infinity');
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
    // Delay to ensure Calculator is loaded
    setTimeout(runTests, 100);
  });
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests, testResults };
}
