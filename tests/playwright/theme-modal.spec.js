/**
 * Theme Modal Tests
 * Tests for grid-based theme selection modal
 */

const { test, expect } = require('@playwright/test');

test.describe('Theme Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.waitForLoadState('networkidle');
  });

  test('should display theme modal when settings button is clicked', async ({ page }) => {
    // Click settings button
    await page.click('#btn-settings');

    // Modal should be visible
    const modal = page.locator('#theme-modal');
    await expect(modal).toBeVisible();

    // Modal should have correct aria attributes
    await expect(modal).toHaveAttribute('aria-hidden', 'false');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('should display 10 theme cards in grid layout', async ({ page }) => {
    await page.click('#btn-settings');

    // Should have exactly 10 theme cards
    const themeCards = page.locator('.theme-card');
    await expect(themeCards).toHaveCount(10);

    // Check each theme exists
    const expectedThemes = [
      'default', 'ocean', 'forest', 'sunset', 'midnight',
      'cherry', 'monochrome', 'neon', 'wooden', 'glass'
    ];

    for (const theme of expectedThemes) {
      const card = page.locator(`.theme-card[data-theme="${theme}"]`);
      await expect(card).toBeVisible();
    }
  });

  test('should show active state for current theme', async ({ page }) => {
    await page.click('#btn-settings');

    // Default theme should be active initially
    const defaultCard = page.locator('.theme-card[data-theme="default"]');
    await expect(defaultCard).toHaveClass(/active/);

    // Should have checkmark or visual indicator
    const activeIndicator = defaultCard.locator('.theme-check');
    await expect(activeIndicator).toBeVisible();
  });

  test('should apply theme immediately when card is clicked', async ({ page }) => {
    await page.click('#btn-settings');

    // Click Ocean theme
    await page.click('.theme-card[data-theme="ocean"]');

    // Check body has correct data-theme attribute
    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'ocean');

    // Ocean card should now be active
    const oceanCard = page.locator('.theme-card[data-theme="ocean"]');
    await expect(oceanCard).toHaveClass(/active/);
  });

  test('should save theme to localStorage', async ({ page }) => {
    await page.click('#btn-settings');
    await page.click('.theme-card[data-theme="forest"]');

    // Check localStorage
    const savedTheme = await page.evaluate(() => {
      return localStorage.getItem('calc_theme');
    });

    expect(savedTheme).toBe('forest');
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    await page.click('#btn-settings');
    await page.click('.modal-close');

    const modal = page.locator('#theme-modal');
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when overlay is clicked', async ({ page }) => {
    await page.click('#btn-settings');
    
    // Click overlay (not modal content)
    await page.click('.modal-overlay', { position: { x: 10, y: 10 } });

    const modal = page.locator('#theme-modal');
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
  });

  test('should close modal when Escape key is pressed', async ({ page }) => {
    await page.click('#btn-settings');
    await page.keyboard.press('Escape');

    const modal = page.locator('#theme-modal');
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    await page.click('#btn-settings');

    const modal = page.locator('#theme-modal');
    
    // Check ARIA attributes
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toHaveAttribute('aria-labelledby', 'theme-modal-title');

    // Each theme card should have aria-label
    const themeCards = page.locator('.theme-card');
    const firstCard = themeCards.first();
    await expect(firstCard).toHaveAttribute('aria-label');
  });

  test('should display theme preview in each card', async ({ page }) => {
    await page.click('#btn-settings');

    // Each card should have a preview element
    const previews = page.locator('.theme-preview');
    await expect(previews).toHaveCount(10);

    // Preview should have visual representation
    const firstPreview = previews.first();
    await expect(firstPreview).toBeVisible();
  });

  test('should maintain grid layout on different screen sizes', async ({ page }) => {
    // Desktop: 5 columns
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.click('#btn-settings');
    
    let grid = page.locator('.theme-grid');
    let gridColumns = await grid.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
    });
    expect(gridColumns).toBe(5);

    // Close and reopen for tablet test
    await page.keyboard.press('Escape');

    // Tablet: should adapt (3-4 columns)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.click('#btn-settings');
    
    grid = page.locator('.theme-grid');
    gridColumns = await grid.evaluate(el => {
      return window.getComputedStyle(el).gridTemplateColumns.split(' ').length;
    });
    expect(gridColumns).toBeGreaterThanOrEqual(3);
    expect(gridColumns).toBeLessThanOrEqual(4);
  });

  test('should not have old dropdown selector', async ({ page }) => {
    await page.click('#btn-settings');

    // Old <select> element should not exist
    const oldSelector = page.locator('#theme-selector');
    await expect(oldSelector).toHaveCount(0);

    // Old save/cancel buttons should not exist
    const saveBtn = page.locator('#btn-settings-save');
    const cancelBtn = page.locator('#btn-settings-cancel');
    await expect(saveBtn).toHaveCount(0);
    await expect(cancelBtn).toHaveCount(0);
  });

  test('should persist theme selection after page reload', async ({ page }) => {
    // Select a theme
    await page.click('#btn-settings');
    await page.click('.theme-card[data-theme="midnight"]');
    await page.keyboard.press('Escape');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Theme should still be applied
    const body = page.locator('body');
    await expect(body).toHaveAttribute('data-theme', 'midnight');
  });
});
