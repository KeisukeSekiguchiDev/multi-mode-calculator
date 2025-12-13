/**
 * Unit Tests for Theme Manager Module
 * Tests theme switching, persistence, and validation
 */

describe('ThemeManager', () => {
  let originalLocalStorage;

  beforeEach(() => {
    // Mock localStorage
    originalLocalStorage = global.localStorage;
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };

    // Reset document.body
    document.body.removeAttribute('data-theme');

    // Reinitialize ThemeManager for each test
    ThemeManager.init();
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
    document.body.removeAttribute('data-theme');
  });

  describe('init()', () => {
    test('should initialize successfully', () => {
      const result = ThemeManager.init();
      expect(result).toBe(true);
    });

    test('should load theme from localStorage on init', () => {
      localStorage.getItem.mockReturnValue('ocean');
      ThemeManager.init();
      expect(localStorage.getItem).toHaveBeenCalledWith('calc_theme');
      expect(document.body.getAttribute('data-theme')).toBe('ocean');
    });

    test('should apply default theme if localStorage is empty', () => {
      localStorage.getItem.mockReturnValue(null);
      ThemeManager.init();
      expect(document.body.getAttribute('data-theme')).toBeNull();
    });
  });

  describe('setTheme()', () => {
    test('should set valid theme to body data-theme attribute', () => {
      ThemeManager.setTheme('ocean');
      expect(document.body.getAttribute('data-theme')).toBe('ocean');
    });

    test('should remove data-theme attribute for default theme', () => {
      ThemeManager.setTheme('ocean');
      ThemeManager.setTheme('default');
      expect(document.body.getAttribute('data-theme')).toBeNull();
    });

    test('should save theme to localStorage', () => {
      ThemeManager.setTheme('forest');
      expect(localStorage.setItem).toHaveBeenCalledWith('calc_theme', 'forest');
    });

    test('should warn and reject invalid theme', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      ThemeManager.setTheme('invalid-theme');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid theme: invalid-theme');
      expect(document.body.getAttribute('data-theme')).toBeNull();
      consoleWarnSpy.mockRestore();
    });

    test('should accept all valid themes', () => {
      const validThemes = ['default', 'dark', 'ocean', 'forest', 'sunset', 'midnight', 'cherry'];

      validThemes.forEach(theme => {
        ThemeManager.setTheme(theme);
        if (theme === 'default') {
          expect(document.body.getAttribute('data-theme')).toBeNull();
        } else {
          expect(document.body.getAttribute('data-theme')).toBe(theme);
        }
      });
    });
  });

  describe('toggleDarkMode()', () => {
    test('should toggle from default to dark', () => {
      ThemeManager.setTheme('default');
      ThemeManager.toggleDarkMode();
      expect(document.body.getAttribute('data-theme')).toBe('dark');
    });

    test('should toggle from dark to default', () => {
      ThemeManager.setTheme('dark');
      ThemeManager.toggleDarkMode();
      expect(document.body.getAttribute('data-theme')).toBeNull();
    });

    test('should toggle from other theme to dark', () => {
      ThemeManager.setTheme('ocean');
      ThemeManager.toggleDarkMode();
      expect(document.body.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('getCurrentTheme()', () => {
    test('should return current theme name', () => {
      ThemeManager.setTheme('sunset');
      expect(ThemeManager.getCurrentTheme()).toBe('sunset');
    });

    test('should return default for initial state', () => {
      ThemeManager.init();
      expect(ThemeManager.getCurrentTheme()).toBe('default');
    });

    test('should update after theme change', () => {
      ThemeManager.setTheme('midnight');
      expect(ThemeManager.getCurrentTheme()).toBe('midnight');
      ThemeManager.setTheme('cherry');
      expect(ThemeManager.getCurrentTheme()).toBe('cherry');
    });
  });

  describe('localStorage error handling', () => {
    test('should handle localStorage.getItem error gracefully', () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage is disabled');
      });

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      ThemeManager.init();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to load theme from localStorage:',
        expect.any(Error)
      );
      consoleWarnSpy.mockRestore();
    });

    test('should handle localStorage.setItem error gracefully', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      ThemeManager.setTheme('ocean');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to save theme to localStorage:',
        expect.any(Error)
      );
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Theme persistence', () => {
    test('should persist theme across page reloads (simulation)', () => {
      // Simulate first page load
      ThemeManager.setTheme('forest');
      expect(localStorage.setItem).toHaveBeenCalledWith('calc_theme', 'forest');

      // Simulate page reload by creating new localStorage mock with saved value
      localStorage.getItem.mockReturnValue('forest');
      ThemeManager.init();

      expect(document.body.getAttribute('data-theme')).toBe('forest');
      expect(ThemeManager.getCurrentTheme()).toBe('forest');
    });

    test('should handle corrupted localStorage data', () => {
      localStorage.getItem.mockReturnValue('corrupted-invalid-theme');
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      ThemeManager.init();

      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid theme: corrupted-invalid-theme');
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Edge cases', () => {
    test('should handle rapid theme switching', () => {
      ThemeManager.setTheme('ocean');
      ThemeManager.setTheme('forest');
      ThemeManager.setTheme('sunset');
      ThemeManager.setTheme('midnight');

      expect(document.body.getAttribute('data-theme')).toBe('midnight');
      expect(ThemeManager.getCurrentTheme()).toBe('midnight');
    });

    test('should handle null or undefined theme name', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      ThemeManager.setTheme(null);
      expect(consoleWarnSpy).toHaveBeenCalled();

      ThemeManager.setTheme(undefined);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    test('should handle empty string theme name', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      ThemeManager.setTheme('');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid theme: ');
      consoleWarnSpy.mockRestore();
    });
  });
});
