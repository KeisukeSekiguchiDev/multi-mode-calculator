/**
 * Playwright E2E Tests for Programmer Mode
 * Tests programmer calculator mode functionality
 */

const { test, expect } = require('@playwright/test');

test.describe('Programmer Calculator Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to calculator
    await page.goto('http://localhost:8080');

    // Switch to programmer mode
    await page.click('#tab-programmer');
    await page.waitForSelector('#panel-programmer.calculator__panel--active');
  });

  test('should switch to programmer mode successfully', async ({ page }) => {
    // Verify programmer panel is visible
    const programmerPanel = page.locator('#panel-programmer');
    await expect(programmerPanel).toHaveClass(/calculator__panel--active/);

    // Verify standard panel is hidden
    const standardPanel = page.locator('#panel-standard');
    await expect(standardPanel).toHaveClass(/calculator__panel--hidden/);

    // Verify programmer mode elements are visible
    await expect(page.locator('#btn-prog-byte')).toBeVisible();
    await expect(page.locator('#display-hex')).toBeVisible();
    await expect(page.locator('#display-dec')).toBeVisible();
    await expect(page.locator('#display-oct')).toBeVisible();
    await expect(page.locator('#display-bin')).toBeVisible();
  });

  test('should display value in all bases - DEC to HEX conversion', async ({ page }) => {
    // Input 255 in DEC mode (default)
    await page.click('#btn-prog-2');
    await page.click('#btn-prog-5');
    await page.click('#btn-prog-5');

    // Verify all base displays
    await expect(page.locator('#display-hex')).toHaveText('FF');
    await expect(page.locator('#display-dec')).toHaveText('255');
    await expect(page.locator('#display-oct')).toHaveText('377');
    await expect(page.locator('#display-bin')).toContainText('1111 1111');
  });

  test('should switch between base modes - HEX mode input', async ({ page }) => {
    // Switch to HEX mode
    await page.click('#radio-prog-hex');

    // Input FF in HEX mode
    await page.click('#btn-prog-f');
    await page.click('#btn-prog-f');

    // Switch back to DEC mode
    await page.click('#radio-prog-dec');

    // Verify DEC display shows 255
    await expect(page.locator('#display-result')).toHaveText('255');
    await expect(page.locator('#display-dec')).toHaveText('255');
    await expect(page.locator('#display-hex')).toHaveText('FF');
  });

  test('should handle BIN mode input correctly', async ({ page }) => {
    // Switch to BIN mode
    await page.click('#radio-prog-bin');

    // Input 11111111 (255 in binary)
    for (let i = 0; i < 8; i++) {
      await page.click('#btn-prog-1');
    }

    // Verify all base displays
    await expect(page.locator('#display-hex')).toHaveText('FF');
    await expect(page.locator('#display-dec')).toHaveText('255');
    await expect(page.locator('#display-oct')).toHaveText('377');
    await expect(page.locator('#display-bin')).toContainText('1111 1111');
  });

  test('should handle OCT mode input correctly', async ({ page }) => {
    // Switch to OCT mode
    await page.click('#radio-prog-oct');

    // Input 377 (255 in octal)
    await page.click('#btn-prog-3');
    await page.click('#btn-prog-7');
    await page.click('#btn-prog-7');

    // Verify all base displays
    await expect(page.locator('#display-hex')).toHaveText('FF');
    await expect(page.locator('#display-dec')).toHaveText('255');
    await expect(page.locator('#display-oct')).toHaveText('377');
  });

  test('should handle bit size change - DWORD to WORD overflow', async ({ page }) => {
    // Input large number in DEC mode (default DWORD)
    // 4294967295 (max DWORD)
    await page.click('#btn-prog-4');
    await page.click('#btn-prog-2');
    await page.click('#btn-prog-9');
    await page.click('#btn-prog-4');
    await page.click('#btn-prog-9');
    await page.click('#btn-prog-6');
    await page.click('#btn-prog-7');
    await page.click('#btn-prog-2');
    await page.click('#btn-prog-9');
    await page.click('#btn-prog-5');

    // Verify DWORD is active
    await expect(page.locator('#btn-prog-dword')).toHaveClass(/calculator__bit-button--active/);

    // Switch to WORD (should overflow to 65535)
    await page.click('#btn-prog-word');

    // Verify WORD is active
    await expect(page.locator('#btn-prog-word')).toHaveClass(/calculator__bit-button--active/);

    // Verify value is clamped to WORD max (65535)
    await expect(page.locator('#display-dec')).toHaveText('65535');
    await expect(page.locator('#display-hex')).toHaveText('FFFF');
  });

  test('should handle bitwise AND operation', async ({ page }) => {
    // Input 255
    await page.click('#btn-prog-2');
    await page.click('#btn-prog-5');
    await page.click('#btn-prog-5');

    // Click AND button
    await page.click('#btn-prog-and');

    // Input 15
    await page.click('#btn-prog-1');
    await page.click('#btn-prog-5');

    // Click equals
    await page.click('#btn-prog-equals');

    // Verify result (255 AND 15 = 15)
    await expect(page.locator('#display-dec')).toHaveText('15');
    await expect(page.locator('#display-hex')).toHaveText('F');
    await expect(page.locator('#display-bin')).toContainText('1111');
  });

  test('should handle bitwise OR operation', async ({ page }) => {
    // Input 12 (1100 in binary)
    await page.click('#btn-prog-1');
    await page.click('#btn-prog-2');

    // Click OR button
    await page.click('#btn-prog-or');

    // Input 10 (1010 in binary)
    await page.click('#btn-prog-1');
    await page.click('#btn-prog-0');

    // Click equals
    await page.click('#btn-prog-equals');

    // Verify result (12 OR 10 = 14, 1110 in binary)
    await expect(page.locator('#display-dec')).toHaveText('14');
    await expect(page.locator('#display-hex')).toHaveText('E');
  });

  test('should handle bitwise XOR operation', async ({ page }) => {
    // Input 12
    await page.click('#btn-prog-1');
    await page.click('#btn-prog-2');

    // Click XOR button
    await page.click('#btn-prog-xor');

    // Input 10
    await page.click('#btn-prog-1');
    await page.click('#btn-prog-0');

    // Click equals
    await page.click('#btn-prog-equals');

    // Verify result (12 XOR 10 = 6, 0110 in binary)
    await expect(page.locator('#display-dec')).toHaveText('6');
  });

  test('should handle bitwise NOT operation', async ({ page }) => {
    // Switch to BYTE mode for predictable result
    await page.click('#btn-prog-byte');

    // Input 0
    await page.click('#btn-prog-0');

    // Click NOT button
    await page.click('#btn-prog-not');

    // Verify result (NOT 0 = 255 for BYTE)
    await expect(page.locator('#display-dec')).toHaveText('255');
    await expect(page.locator('#display-hex')).toHaveText('FF');
  });

  test('should handle left shift operation', async ({ page }) => {
    // Input 1
    await page.click('#btn-prog-1');

    // Click left shift button
    await page.click('#btn-prog-lsh');

    // Input 3 (shift amount)
    await page.click('#btn-prog-3');

    // Click equals
    await page.click('#btn-prog-equals');

    // Verify result (1 << 3 = 8)
    await expect(page.locator('#display-dec')).toHaveText('8');
    await expect(page.locator('#display-bin')).toContainText('1000');
  });

  test('should handle right shift operation', async ({ page }) => {
    // Input 8
    await page.click('#btn-prog-8');

    // Click right shift button
    await page.click('#btn-prog-rsh');

    // Input 2 (shift amount)
    await page.click('#btn-prog-2');

    // Click equals
    await page.click('#btn-prog-equals');

    // Verify result (8 >> 2 = 2)
    await expect(page.locator('#display-dec')).toHaveText('2');
    await expect(page.locator('#display-bin')).toContainText('10');
  });

  test('should disable hex buttons in DEC mode', async ({ page }) => {
    // Verify DEC mode is active (default)
    const hexButtonA = page.locator('#btn-prog-a');

    // Hex buttons should be disabled or not clickable
    const isDisabled = await hexButtonA.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should enable hex buttons in HEX mode', async ({ page }) => {
    // Switch to HEX mode
    await page.click('#radio-prog-hex');

    // Hex buttons should be enabled
    const hexButtonA = page.locator('#btn-prog-a');
    const isEnabled = await hexButtonA.isEnabled();
    expect(isEnabled).toBe(true);
  });

  test('should update all base displays in real-time', async ({ page }) => {
    // Input 1
    await page.click('#btn-prog-1');
    await expect(page.locator('#display-dec')).toHaveText('1');

    // Input 0
    await page.click('#btn-prog-0');
    await expect(page.locator('#display-dec')).toHaveText('10');
    await expect(page.locator('#display-hex')).toHaveText('A');
    await expect(page.locator('#display-oct')).toHaveText('12');
    await expect(page.locator('#display-bin')).toContainText('1010');
  });

  test('should perform basic arithmetic in programmer mode', async ({ page }) => {
    // Input 10
    await page.click('#btn-prog-1');
    await page.click('#btn-prog-0');

    // Click add
    await page.click('#btn-prog-add');

    // Input 5
    await page.click('#btn-prog-5');

    // Click equals
    await page.click('#btn-prog-equals');

    // Verify result
    await expect(page.locator('#display-dec')).toHaveText('15');
    await expect(page.locator('#display-hex')).toHaveText('F');
  });

  test('should clear value with C button', async ({ page }) => {
    // Input some value
    await page.click('#btn-prog-1');
    await page.click('#btn-prog-2');
    await page.click('#btn-prog-3');

    // Click clear (C button - note: btn-prog-c is the hex button C, so we use the dedicated clear button)
    await page.click('button[data-action="clear"]');

    // Verify all displays are cleared
    await expect(page.locator('#display-dec')).toHaveText('0');
    await expect(page.locator('#display-hex')).toHaveText('0');
    await expect(page.locator('#display-oct')).toHaveText('0');
    await expect(page.locator('#display-bin')).toHaveText('0');
  });

  test('should handle backspace in programmer mode', async ({ page }) => {
    // Input 123
    await page.click('#btn-prog-1');
    await page.click('#btn-prog-2');
    await page.click('#btn-prog-3');

    // Click backspace
    await page.click('#btn-prog-backspace');

    // Verify 12 is displayed
    await expect(page.locator('#display-dec')).toHaveText('12');

    // Click backspace again
    await page.click('#btn-prog-backspace');

    // Verify 1 is displayed
    await expect(page.locator('#display-dec')).toHaveText('1');
  });

  test('should respond quickly (performance test)', async ({ page }) => {
    const startTime = Date.now();

    // Perform a series of operations
    await page.click('#btn-prog-1');
    await page.click('#btn-prog-0');
    await page.click('#btn-prog-add');
    await page.click('#btn-prog-5');
    await page.click('#btn-prog-equals');

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete in less than 1000ms
    expect(duration).toBeLessThan(1000);
  });
});
