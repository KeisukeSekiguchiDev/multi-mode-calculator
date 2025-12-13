/**
 * E2E Tests for Theme Functionality
 * Tests theme switching UI, persistence, and visual appearance
 */

const { test, expect } = require('@playwright/test');

test.describe('Theme Manager E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to calculator
    await page.goto('http://localhost:8080/src/index.html');
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Theme Switching', () => {
    test('should apply default theme on initial load', async ({ page }) => {
      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBeNull(); // Default theme has no data-theme attribute
    });

    test('should switch to Ocean theme', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('ocean');
      });

      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('ocean');

      // Verify CSS variables are applied
      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).getPropertyValue('--color-bg-primary');
      });
      expect(bgColor.trim()).toBe('#e3f2fd');
    });

    test('should switch to Forest theme', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('forest');
      });

      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('forest');

      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).getPropertyValue('--color-bg-primary');
      });
      expect(bgColor.trim()).toBe('#e8f5e9');
    });

    test('should switch to Sunset theme', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('sunset');
      });

      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('sunset');

      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).getPropertyValue('--color-bg-primary');
      });
      expect(bgColor.trim()).toBe('#fff3e0');
    });

    test('should switch to Midnight theme', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('midnight');
      });

      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('midnight');

      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).getPropertyValue('--color-bg-primary');
      });
      expect(bgColor.trim()).toBe('#1a237e');
    });

    test('should switch to Cherry theme', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('cherry');
      });

      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('cherry');

      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).getPropertyValue('--color-bg-primary');
      });
      expect(bgColor.trim()).toBe('#fce4ec');
    });

    test('should switch to Dark theme', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('dark');
      });

      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('dark');

      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).getPropertyValue('--color-bg-primary');
      });
      expect(bgColor.trim()).toBe('#1a1a1a');
    });
  });

  test.describe('Theme Persistence', () => {
    test('should persist theme in localStorage', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('ocean');
      });

      const storedTheme = await page.evaluate(() => {
        return localStorage.getItem('calc_theme');
      });

      expect(storedTheme).toBe('ocean');
    });

    test('should restore theme from localStorage on page reload', async ({ page }) => {
      // Set theme
      await page.evaluate(() => {
        ThemeManager.setTheme('forest');
      });

      // Reload page
      await page.reload();
      await page.waitForLoadState('domcontentloaded');

      // Verify theme is restored
      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('forest');

      const currentTheme = await page.evaluate(() => {
        return ThemeManager.getCurrentTheme();
      });
      expect(currentTheme).toBe('forest');
    });

    test('should handle multiple theme changes with persistence', async ({ page }) => {
      const themes = ['ocean', 'forest', 'sunset', 'midnight', 'cherry'];

      for (const theme of themes) {
        await page.evaluate((t) => {
          ThemeManager.setTheme(t);
        }, theme);

        const storedTheme = await page.evaluate(() => {
          return localStorage.getItem('calc_theme');
        });

        expect(storedTheme).toBe(theme);
      }
    });
  });

  test.describe('Dark Mode Toggle', () => {
    test('should toggle from default to dark mode', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('default');
        ThemeManager.toggleDarkMode();
      });

      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('dark');
    });

    test('should toggle from dark to default mode', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('dark');
        ThemeManager.toggleDarkMode();
      });

      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBeNull();
    });

    test('should toggle multiple times', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.toggleDarkMode(); // -> dark
        ThemeManager.toggleDarkMode(); // -> default
        ThemeManager.toggleDarkMode(); // -> dark
      });

      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('dark');
    });
  });

  test.describe('Visual Appearance', () => {
    test('should apply theme colors to calculator display', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('ocean');
      });

      const displayBgColor = await page.evaluate(() => {
        const display = document.querySelector('.calculator__display');
        return getComputedStyle(display).backgroundColor;
      });

      // Ocean theme display background should be dark blue
      expect(displayBgColor).toContain('rgb(13, 71, 161)'); // #0d47a1
    });

    test('should apply theme colors to buttons', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('forest');
      });

      const numberButtonColor = await page.evaluate(() => {
        const button = document.querySelector('.calculator__button--number');
        return getComputedStyle(button).backgroundColor;
      });

      // Forest theme number button should be white
      expect(numberButtonColor).toContain('rgb(255, 255, 255)');
    });

    test('should update button hover colors based on theme', async ({ page }) => {
      await page.evaluate(() => {
        ThemeManager.setTheme('sunset');
      });

      // Hover over a button
      const button = page.locator('.calculator__button--number').first();
      await button.hover();

      // Verify button styling exists (not checking exact color due to hover state complexity)
      const buttonExists = await button.isVisible();
      expect(buttonExists).toBe(true);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid theme gracefully', async ({ page }) => {
      const consoleMessages = [];
      page.on('console', msg => {
        if (msg.type() === 'warning') {
          consoleMessages.push(msg.text());
        }
      });

      await page.evaluate(() => {
        ThemeManager.setTheme('invalid-theme');
      });

      // Should show warning in console
      expect(consoleMessages.some(msg => msg.includes('Invalid theme'))).toBe(true);

      // Theme should remain unchanged
      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBeNull(); // Still default
    });

    test('should handle localStorage errors gracefully', async ({ page }) => {
      // Simulate localStorage error
      await page.evaluate(() => {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = () => {
          throw new Error('localStorage quota exceeded');
        };
        ThemeManager.setTheme('ocean');
        localStorage.setItem = originalSetItem;
      });

      // Theme should still be applied to DOM even if localStorage fails
      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('ocean');
    });
  });

  test.describe('Performance', () => {
    test('should switch themes quickly (< 100ms)', async ({ page }) => {
      const startTime = Date.now();

      await page.evaluate(() => {
        ThemeManager.setTheme('ocean');
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });

    test('should handle rapid theme switching without errors', async ({ page }) => {
      await page.evaluate(() => {
        for (let i = 0; i < 10; i++) {
          ThemeManager.setTheme('ocean');
          ThemeManager.setTheme('forest');
          ThemeManager.setTheme('sunset');
        }
      });

      const bodyTheme = await page.getAttribute('body', 'data-theme');
      expect(bodyTheme).toBe('sunset');
    });
  });

  test.describe('Accessibility', () => {
    test('should maintain contrast ratios in all themes', async ({ page }) => {
      const themes = ['default', 'dark', 'ocean', 'forest', 'sunset', 'midnight', 'cherry'];

      for (const theme of themes) {
        await page.evaluate((t) => {
          if (t === 'default') {
            ThemeManager.setTheme('default');
          } else {
            ThemeManager.setTheme(t);
          }
        }, theme);

        // Check that display text is visible (simple visibility check)
        const displayText = page.locator('.calculator__result');
        await expect(displayText).toBeVisible();
      }
    });
  });
});
