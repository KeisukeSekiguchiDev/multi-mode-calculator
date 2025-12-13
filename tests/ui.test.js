/**
 * UI Layout Tests
 * Tests for scientific calculator UI layout
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

  function assertEqual(actual, expected, message) {
    const condition = actual === expected;
    if (!condition) {
      console.error(`  Expected: ${expected}, Got: ${actual}`);
    }
    assert(condition, message);
  }

  /**
   * Test: Scientific panel exists
   */
  function testScientificPanelExists() {
    console.log('\n--- Test: Scientific Panel Exists ---');

    const panel = document.getElementById('panel-scientific');
    assert(panel !== null, 'Scientific panel element exists');
    assert(panel.classList.contains('calculator__panel'), 'Has calculator__panel class');
  }

  /**
   * Test: Scientific mode has 7-column grid
   */
  function testScientificGridLayout() {
    console.log('\n--- Test: Scientific Grid Layout ---');

    const buttonsContainer = document.querySelector('#panel-scientific .calculator__buttons');
    assert(buttonsContainer !== null, 'Scientific buttons container exists');
    assert(
      buttonsContainer.classList.contains('calculator__buttons--scientific'),
      'Has calculator__buttons--scientific class for 7-column grid'
    );

    // Check computed style
    const style = window.getComputedStyle(buttonsContainer);
    const gridCols = style.getPropertyValue('grid-template-columns');
    // Should have 7 columns (7 "fr" values)
    const colCount = (gridCols.match(/\d+(\.\d+)?px/g) || []).length;
    assert(colCount === 7 || gridCols.includes('repeat(7'), 'Grid has 7 columns');
  }

  /**
   * Test: Button count in scientific mode
   */
  function testScientificButtonCount() {
    console.log('\n--- Test: Scientific Button Count ---');

    const panel = document.getElementById('panel-scientific');
    const buttons = panel.querySelectorAll('.calculator__button');
    const spacers = panel.querySelectorAll('.calculator__spacer');

    // Expected: 7 cols x 8 rows = 56 cells
    // Buttons: Row1(7) + Row2(7) + Row3(7) + Row4(7) + Row5(4) + Row6(3) + Row7(4) + Row8(3) = 42
    // Spacers: Row5(3) + Row6(4) + Row7(3) + Row8(4) = 14
    assertEqual(buttons.length, 42, `Button count: expected 42, got ${buttons.length}`);
    assertEqual(spacers.length, 14, `Spacer count: expected 14, got ${spacers.length}`);
  }

  /**
   * Test: Number buttons are in correct positions
   */
  function testNumberButtonPositions() {
    console.log('\n--- Test: Number Button Positions ---');

    const panel = document.getElementById('panel-scientific');

    // Check that numbers 0-9 exist in scientific panel
    for (let i = 0; i <= 9; i++) {
      const btn = panel.querySelector(`[data-number="${i}"]`);
      assert(btn !== null, `Number button ${i} exists in scientific panel`);
    }
  }

  /**
   * Test: Function buttons exist
   */
  function testFunctionButtonsExist() {
    console.log('\n--- Test: Function Buttons Exist ---');

    const panel = document.getElementById('panel-scientific');

    const functions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan',
                       'log', 'ln', 'exp', 'pow10', 'sqrt', 'cbrt',
                       'square', 'cube', 'factorial', 'reciprocal', 'abs',
                       'pi', 'e'];

    functions.forEach(func => {
      const btn = panel.querySelector(`[data-function="${func}"]`);
      assert(btn !== null, `Function button '${func}' exists`);
    });
  }

  /**
   * Test: Operator buttons exist
   */
  function testOperatorButtonsExist() {
    console.log('\n--- Test: Operator Buttons in Scientific Mode ---');

    const panel = document.getElementById('panel-scientific');

    const operators = ['÷', '×', '-', '+', '^'];
    operators.forEach(op => {
      const btn = panel.querySelector(`[data-operator="${op}"]`);
      assert(btn !== null, `Operator button '${op}' exists`);
    });
  }

  /**
   * Test: Angle mode selector exists
   */
  function testAngleModeSelector() {
    console.log('\n--- Test: Angle Mode Selector ---');

    const degRadio = document.getElementById('radio-deg');
    const radRadio = document.getElementById('radio-rad');

    assert(degRadio !== null, 'DEG radio button exists');
    assert(radRadio !== null, 'RAD radio button exists');
    assert(degRadio.checked === true, 'DEG is default selected');
  }

  /**
   * Test: Clear button exists (AC)
   */
  function testClearButton() {
    console.log('\n--- Test: Clear Button ---');

    const panel = document.getElementById('panel-scientific');
    const clearBtn = panel.querySelector('[data-action="clear"]');

    assert(clearBtn !== null, 'Clear button exists');
    assertEqual(clearBtn.textContent.trim(), 'AC', 'Clear button shows AC');
  }

  /**
   * Test: Parentheses buttons exist
   */
  function testParenthesesButtons() {
    console.log('\n--- Test: Parentheses Buttons ---');

    const panel = document.getElementById('panel-scientific');

    const lparenBtn = panel.querySelector('[data-value="("]');
    const rparenBtn = panel.querySelector('[data-value=")"]');

    assert(lparenBtn !== null, 'Left parenthesis button exists');
    assert(rparenBtn !== null, 'Right parenthesis button exists');
  }

  /**
   * Test: Mode switching updates body class
   */
  function testModeSwitchingBodyClass() {
    console.log('\n--- Test: Mode Switching Body Class ---');

    // Switch to scientific mode
    const sciTab = document.getElementById('tab-scientific');
    if (sciTab) {
      sciTab.click();

      // Check body class
      setTimeout(() => {
        assert(
          document.body.classList.contains('mode-scientific'),
          'Body has mode-scientific class when in scientific mode'
        );

        // Switch back to standard
        const stdTab = document.getElementById('tab-standard');
        if (stdTab) {
          stdTab.click();
        }
      }, 100);
    }
  }

  /**
   * Test: Programmer panel exists
   */
  function testProgrammerPanelExists() {
    console.log('\n--- Test: Programmer Panel Exists ---');

    const panel = document.getElementById('panel-programmer');
    assert(panel !== null, 'Programmer panel element exists');
    assert(panel.classList.contains('calculator__panel'), 'Has calculator__panel class');
  }

  /**
   * Test: Bit size selector buttons exist
   */
  function testBitSizeSelector() {
    console.log('\n--- Test: Bit Size Selector ---');

    const panel = document.getElementById('panel-programmer');

    const byteBtn = document.getElementById('btn-prog-byte');
    const wordBtn = document.getElementById('btn-prog-word');
    const dwordBtn = document.getElementById('btn-prog-dword');
    const qwordBtn = document.getElementById('btn-prog-qword');

    assert(byteBtn !== null, 'BYTE button exists');
    assert(wordBtn !== null, 'WORD button exists');
    assert(dwordBtn !== null, 'DWORD button exists');
    assert(qwordBtn !== null, 'QWORD button exists');
  }

  /**
   * Test: Base display panels exist
   */
  function testBaseDisplayPanels() {
    console.log('\n--- Test: Base Display Panels ---');

    const hexDisplay = document.getElementById('display-hex');
    const decDisplay = document.getElementById('display-dec');
    const octDisplay = document.getElementById('display-oct');
    const binDisplay = document.getElementById('display-bin');

    assert(hexDisplay !== null, 'HEX display exists');
    assert(decDisplay !== null, 'DEC display exists');
    assert(octDisplay !== null, 'OCT display exists');
    assert(binDisplay !== null, 'BIN display exists');
  }

  /**
   * Test: Input mode selector exists
   */
  function testInputModeSelector() {
    console.log('\n--- Test: Input Mode Selector ---');

    const hexRadio = document.getElementById('radio-prog-hex');
    const decRadio = document.getElementById('radio-prog-dec');
    const octRadio = document.getElementById('radio-prog-oct');
    const binRadio = document.getElementById('radio-prog-bin');

    assert(hexRadio !== null, 'HEX radio button exists');
    assert(decRadio !== null, 'DEC radio button exists');
    assert(octRadio !== null, 'OCT radio button exists');
    assert(binRadio !== null, 'BIN radio button exists');
    assert(decRadio.checked === true, 'DEC is default selected');
  }

  /**
   * Test: Bitwise operation buttons exist
   */
  function testBitwiseOperationButtons() {
    console.log('\n--- Test: Bitwise Operation Buttons ---');

    const panel = document.getElementById('panel-programmer');

    const bitwiseOps = [
      { id: 'btn-prog-and', label: 'AND' },
      { id: 'btn-prog-or', label: 'OR' },
      { id: 'btn-prog-xor', label: 'XOR' },
      { id: 'btn-prog-not', label: 'NOT' },
      { id: 'btn-prog-lsh', label: 'LSH' },
      { id: 'btn-prog-rsh', label: 'RSH' }
    ];

    bitwiseOps.forEach(op => {
      const btn = document.getElementById(op.id);
      assert(btn !== null, `${op.label} button exists`);
    });
  }

  /**
   * Test: Hex digit buttons exist (A-F)
   */
  function testHexDigitButtons() {
    console.log('\n--- Test: Hex Digit Buttons (A-F) ---');

    const panel = document.getElementById('panel-programmer');

    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(hex => {
      const btn = panel.querySelector(`[data-hex="${hex}"]`);
      assert(btn !== null, `Hex digit ${hex} button exists`);
    });
  }

  /**
   * Test: Number buttons exist in programmer mode (0-9)
   */
  function testProgrammerNumberButtons() {
    console.log('\n--- Test: Number Buttons in Programmer Mode ---');

    const panel = document.getElementById('panel-programmer');

    for (let i = 0; i <= 9; i++) {
      const btn = panel.querySelector(`[data-number="${i}"]`);
      assert(btn !== null, `Number button ${i} exists in programmer panel`);
    }
  }

  /**
   * Test: Clear buttons exist in programmer mode
   */
  function testProgrammerClearButtons() {
    console.log('\n--- Test: Clear Buttons in Programmer Mode ---');

    const panel = document.getElementById('panel-programmer');

    const ceBtn = panel.querySelector('[data-action="ce"]');
    const cBtn = panel.querySelector('[data-action="clear"]');
    const backspaceBtn = panel.querySelector('[data-action="backspace"]');

    assert(ceBtn !== null, 'CE button exists');
    assert(cBtn !== null, 'C button exists');
    assert(backspaceBtn !== null, 'Backspace button exists');
  }

  /**
   * Test: Standard operator buttons exist in programmer mode
   */
  function testProgrammerStandardOperators() {
    console.log('\n--- Test: Standard Operators in Programmer Mode ---');

    const panel = document.getElementById('panel-programmer');

    const operators = ['+', '-', '×', '÷'];
    operators.forEach(op => {
      const btn = panel.querySelector(`[data-operator="${op}"]`);
      assert(btn !== null, `Operator button '${op}' exists`);
    });

    const equalsBtn = panel.querySelector('[data-action="equals"]');
    assert(equalsBtn !== null, 'Equals button exists');
  }

  /**
   * Test: ASCII button exists
   */
  function testAsciiButton() {
    console.log('\n--- Test: ASCII Button ---');

    const asciiBtn = document.getElementById('btn-prog-ascii');
    assert(asciiBtn !== null, 'ASCII button exists');
  }

  /**
   * Test: Negate button exists in programmer mode
   */
  function testProgrammerNegateButton() {
    console.log('\n--- Test: Negate Button in Programmer Mode ---');

    const panel = document.getElementById('panel-programmer');
    const negateBtn = panel.querySelector('[data-action="negate"]');

    assert(negateBtn !== null, 'Negate (±) button exists');
  }

  /**
   * Run all UI tests
   */
  function runAllTests() {
    console.log('========================================');
    console.log('UI Layout Tests - Starting');
    console.log('========================================');

    testScientificPanelExists();
    testScientificGridLayout();
    testScientificButtonCount();
    testNumberButtonPositions();
    testFunctionButtonsExist();
    testOperatorButtonsExist();
    testAngleModeSelector();
    testClearButton();
    testParenthesesButtons();
    testModeSwitchingBodyClass();

    // Programmer mode tests
    testProgrammerPanelExists();
    testBitSizeSelector();
    testBaseDisplayPanels();
    testInputModeSelector();
    testBitwiseOperationButtons();
    testHexDigitButtons();
    testProgrammerNumberButtons();
    testProgrammerClearButtons();
    testProgrammerStandardOperators();
    testAsciiButton();
    testProgrammerNegateButton();

    // Print summary
    console.log('\n========================================');
    console.log('UI Test Summary');
    console.log('========================================');
    console.log(`Total:  ${results.total}`);
    console.log(`Passed: ${results.passed} ✓`);
    console.log(`Failed: ${results.failed} ✗`);
    console.log(`Pass Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`);
    console.log('========================================\n');

    return results;
  }

  // Auto-run tests when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
  } else {
    runAllTests();
  }

  // Export for external access
  window.UITests = {
    runAllTests,
    results
  };
})();
