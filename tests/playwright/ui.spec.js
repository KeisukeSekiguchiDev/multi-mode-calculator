// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Scientific Calculator UI Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/index.html');
  });

  test('Scientific panel exists', async ({ page }) => {
    const panel = page.locator('#panel-scientific');
    await expect(panel).toBeAttached();
    await expect(panel).toHaveClass(/calculator__panel/);
  });

  test('Scientific mode has 7-column grid class', async ({ page }) => {
    const buttonsContainer = page.locator('#panel-scientific .calculator__buttons');
    await expect(buttonsContainer).toBeAttached();
    await expect(buttonsContainer).toHaveClass(/calculator__buttons--scientific/);
  });

  test('Scientific mode has correct button count', async ({ page }) => {
    const panel = page.locator('#panel-scientific');
    const buttons = panel.locator('.calculator__button');
    const spacers = panel.locator('.calculator__spacer');

    // Expected: 42 buttons + 14 spacers = 56 cells (7 cols x 8 rows)
    await expect(buttons).toHaveCount(42);
    await expect(spacers).toHaveCount(14);
  });

  test('Number buttons 0-9 exist in scientific panel', async ({ page }) => {
    const panel = page.locator('#panel-scientific');

    for (let i = 0; i <= 9; i++) {
      const btn = panel.locator(`[data-number="${i}"]`);
      await expect(btn).toBeAttached();
    }
  });

  test('Trigonometric function buttons exist', async ({ page }) => {
    const panel = page.locator('#panel-scientific');
    const trigFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];

    for (const func of trigFunctions) {
      const btn = panel.locator(`[data-function="${func}"]`);
      await expect(btn).toBeAttached();
    }
  });

  test('Logarithm and exponential function buttons exist', async ({ page }) => {
    const panel = page.locator('#panel-scientific');
    const functions = ['log', 'ln', 'exp', 'pow10'];

    for (const func of functions) {
      const btn = panel.locator(`[data-function="${func}"]`);
      await expect(btn).toBeAttached();
    }
  });

  test('Power and root function buttons exist', async ({ page }) => {
    const panel = page.locator('#panel-scientific');
    const functions = ['sqrt', 'cbrt', 'square', 'cube'];

    for (const func of functions) {
      const btn = panel.locator(`[data-function="${func}"]`);
      await expect(btn).toBeAttached();
    }
  });

  test('Other function buttons exist', async ({ page }) => {
    const panel = page.locator('#panel-scientific');
    const functions = ['factorial', 'reciprocal', 'abs', 'pi', 'e'];

    for (const func of functions) {
      const btn = panel.locator(`[data-function="${func}"]`);
      await expect(btn).toBeAttached();
    }
  });

  test('Operator buttons exist in scientific mode', async ({ page }) => {
    const panel = page.locator('#panel-scientific');
    const operators = ['÷', '×', '-', '+', '^'];

    for (const op of operators) {
      const btn = panel.locator(`[data-operator="${op}"]`);
      await expect(btn).toBeAttached();
    }
  });

  test('Angle mode selector exists with DEG default', async ({ page }) => {
    const degRadio = page.locator('#radio-deg');
    const radRadio = page.locator('#radio-rad');

    await expect(degRadio).toBeAttached();
    await expect(radRadio).toBeAttached();
    await expect(degRadio).toBeChecked();
  });

  test('Clear button shows AC', async ({ page }) => {
    const panel = page.locator('#panel-scientific');
    const clearBtn = panel.locator('[data-action="clear"]');

    await expect(clearBtn).toBeAttached();
    await expect(clearBtn).toHaveText('AC');
  });

  test('Parentheses buttons exist', async ({ page }) => {
    const panel = page.locator('#panel-scientific');
    const lparenBtn = panel.locator('[data-value="("]');
    const rparenBtn = panel.locator('[data-value=")"]');

    await expect(lparenBtn).toBeAttached();
    await expect(rparenBtn).toBeAttached();
  });

  test('Numbers are not in function rows (layout structure)', async ({ page }) => {
    const panel = page.locator('#panel-scientific .calculator__buttons--scientific');
    const allElements = panel.locator('> *');

    // First 28 elements should be function rows (rows 1-4 = 7*4)
    // No number buttons should be in these positions
    const count = await allElements.count();

    for (let i = 0; i < 28 && i < count; i++) {
      const el = allElements.nth(i);
      const dataNumber = await el.getAttribute('data-number');
      expect(dataNumber).toBeNull();
    }
  });

  test('Mode switching to scientific adds body class', async ({ page }) => {
    // Click scientific tab
    await page.click('#tab-scientific');

    // Check body class
    await expect(page.locator('body')).toHaveClass(/mode-scientific/);
  });

  test('Mode switching back to standard removes scientific class', async ({ page }) => {
    // Switch to scientific
    await page.click('#tab-scientific');
    await expect(page.locator('body')).toHaveClass(/mode-scientific/);

    // Switch back to standard
    await page.click('#tab-standard');
    await expect(page.locator('body')).toHaveClass(/mode-standard/);
    await expect(page.locator('body')).not.toHaveClass(/mode-scientific/);
  });
});

test.describe('Scientific Calculator Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/index.html');
    // Switch to scientific mode
    await page.click('#tab-scientific');
  });

  test('Sin function calculates correctly (DEG mode)', async ({ page }) => {
    // Input 90
    await page.click('#btn-sci-9');
    await page.click('#btn-sci-0');

    // Click sin
    await page.click('#btn-sin');

    // Result should be 1
    const result = page.locator('#display-result');
    await expect(result).toHaveText('1');
  });

  test('Cos function calculates correctly (DEG mode)', async ({ page }) => {
    // Input 0
    await page.click('#btn-sci-0');

    // Click cos
    await page.click('#btn-cos');

    // Result should be 1
    const result = page.locator('#display-result');
    await expect(result).toHaveText('1');
  });

  test('Log function calculates correctly', async ({ page }) => {
    // Input 100
    await page.click('#btn-sci-1');
    await page.click('#btn-sci-0');
    await page.click('#btn-sci-0');

    // Click log
    await page.click('#btn-log');

    // Result should be 2
    const result = page.locator('#display-result');
    await expect(result).toHaveText('2');
  });

  test('Square function calculates correctly', async ({ page }) => {
    // Input 5
    await page.click('#btn-sci-5');

    // Click square
    await page.click('#btn-sci-square');

    // Result should be 25
    const result = page.locator('#display-result');
    await expect(result).toHaveText('25');
  });

  test('Square root function calculates correctly', async ({ page }) => {
    // Input 16
    await page.click('#btn-sci-1');
    await page.click('#btn-sci-6');

    // Click sqrt
    await page.click('#btn-sci-sqrt');

    // Result should be 4
    const result = page.locator('#display-result');
    await expect(result).toHaveText('4');
  });

  test('Pi constant inserts correct value', async ({ page }) => {
    // Click pi
    await page.click('#btn-pi');

    // Result should start with 3.14
    const result = page.locator('#display-result');
    const text = await result.textContent();
    expect(text).toMatch(/^3\.14/);
  });
});
