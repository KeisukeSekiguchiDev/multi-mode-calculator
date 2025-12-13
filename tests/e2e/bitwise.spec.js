/**
 * E2E tests for bitwise operations
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Bitwise Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Load the test HTML page
    const testPage = 'file://' + path.join(__dirname, '../bitwise-test.html');
    await page.goto(testPage);

    // Wait for tests to complete (look for summary)
    await page.waitForSelector('.summary', { timeout: 10000 });
  });

  test('should run all bitwise tests successfully', async ({ page }) => {
    // Wait a bit for all tests to finish
    await page.waitForTimeout(2000);

    // Get the output
    const output = await page.locator('#output').textContent();

    // Check that tests ran
    expect(output).toContain('Bitwise Operations Unit Tests');
    expect(output).toContain('Test Summary');

    // Check for pass/fail counts
    const passedMatch = output.match(/Passed: (\d+)/);
    const failedMatch = output.match(/Failed: (\d+)/);

    expect(passedMatch).not.toBeNull();
    expect(failedMatch).not.toBeNull();

    const passed = parseInt(passedMatch[1]);
    const failed = parseInt(failedMatch[1]);

    console.log(`Bitwise tests: ${passed} passed, ${failed} failed`);

    // All tests should pass
    expect(failed).toBe(0);
    expect(passed).toBeGreaterThan(0);
  });

  test('should pass AND operation test', async ({ page }) => {
    const output = await page.locator('#output').textContent();
    expect(output).toContain('✓ PASS: AND: 12 AND 10 = 8');
  });

  test('should pass OR operation test', async ({ page }) => {
    const output = await page.locator('#output').textContent();
    expect(output).toContain('✓ PASS: OR: 12 OR 10 = 14');
  });

  test('should pass XOR operation test', async ({ page }) => {
    const output = await page.locator('#output').textContent();
    expect(output).toContain('✓ PASS: XOR: 12 XOR 10 = 6');
  });

  test('should pass NOT operation test', async ({ page }) => {
    const output = await page.locator('#output').textContent();
    expect(output).toContain('✓ PASS: NOT: NOT 5 (8-bit) = 250');
  });

  test('should pass NAND operation test', async ({ page }) => {
    const output = await page.locator('#output').textContent();
    expect(output).toContain('✓ PASS: NAND: 12 NAND 10 (8-bit) = 247');
  });

  test('should pass NOR operation test', async ({ page }) => {
    const output = await page.locator('#output').textContent();
    expect(output).toContain('✓ PASS: NOR: 12 NOR 10 (8-bit) = 241');
  });

  test('should pass toggle bit tests', async ({ page }) => {
    const output = await page.locator('#output').textContent();
    expect(output).toContain('✓ PASS: Toggle bit 0: 0 → 1');
    expect(output).toContain('✓ PASS: Toggle bit 2: 1 → 5');
    expect(output).toContain('✓ PASS: Toggle bit 0 again: 5 → 4');
  });
});
