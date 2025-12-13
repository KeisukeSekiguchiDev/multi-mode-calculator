// Minimal test for base conversion

// Simulate Calculator module
const Calculator = {
  convertBase: function(value, fromBase, toBase) {
    const decimal = parseInt(value, fromBase);
    if (isNaN(decimal)) {
      return '0';
    }
    return decimal.toString(toBase).toUpperCase();
  },

  getValueInAllBases: function(value, currentBase) {
    const decimal = parseInt(value, currentBase);
    if (isNaN(decimal)) {
      return { hex: '0', dec: '0', oct: '0', bin: '0' };
    }
    return {
      hex: decimal.toString(16).toUpperCase(),
      dec: decimal.toString(10),
      oct: decimal.toString(8),
      bin: decimal.toString(2)
    };
  }
};

// Test cases
console.log('=== Base Conversion Tests ===\n');

let passed = 0;
let failed = 0;

function test(name, actual, expected) {
  if (actual === expected) {
    console.log(`✓ PASS: ${name}`);
    passed++;
  } else {
    console.log(`✗ FAIL: ${name} (Expected: ${expected}, Got: ${actual})`);
    failed++;
  }
}

// DEC to HEX
test('DEC to HEX: 0 → 0', Calculator.convertBase('0', 10, 16), '0');
test('DEC to HEX: 10 → A', Calculator.convertBase('10', 10, 16), 'A');
test('DEC to HEX: 255 → FF', Calculator.convertBase('255', 10, 16), 'FF');
test('DEC to HEX: 1024 → 400', Calculator.convertBase('1024', 10, 16), '400');

// DEC to OCT
test('DEC to OCT: 0 → 0', Calculator.convertBase('0', 10, 8), '0');
test('DEC to OCT: 10 → 12', Calculator.convertBase('10', 10, 8), '12');
test('DEC to OCT: 255 → 377', Calculator.convertBase('255', 10, 8), '377');

// DEC to BIN
test('DEC to BIN: 10 → 1010', Calculator.convertBase('10', 10, 2), '1010');
test('DEC to BIN: 255 → 11111111', Calculator.convertBase('255', 10, 2), '11111111');

// HEX to DEC
test('HEX to DEC: A → 10', Calculator.convertBase('A', 16, 10), '10');
test('HEX to DEC: FF → 255', Calculator.convertBase('FF', 16, 10), '255');

// All bases
const allBases = Calculator.getValueInAllBases('10', 10);
test('All bases (10): HEX', allBases.hex, 'A');
test('All bases (10): DEC', allBases.dec, '10');
test('All bases (10): OCT', allBases.oct, '12');
test('All bases (10): BIN', allBases.bin, '1010');

console.log(`\n=== Summary ===`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);
