/**
 * Theme Manager Module
 * Manages theme switching with grid-based modal
 */

const ThemeManager = (function() {
  'use strict';

  let currentTheme = 'default';
  const THEME_STORAGE_KEY = 'calc_theme';
  const DARK_MODE_STORAGE_KEY = 'calc_darkMode';

  const VALID_THEMES = [
    'default', 'ocean', 'forest', 'sunset', 'midnight',
    'cherry', 'monochrome', 'neon', 'wooden', 'glass'
  ];

  /**
   * Initialize theme manager
   * @returns {boolean} Success status
   */
  function init() {
    loadTheme();
    bindModalEvents();
    return true;
  }

  /**
   * Set theme
   * @param {string} themeName - Theme name
   */
  function setTheme(themeName) {
    if (!VALID_THEMES.includes(themeName)) {
      console.warn(`Invalid theme: ${themeName}`);
      return;
    }

    currentTheme = themeName;

    // Apply theme to body
    if (themeName === 'default') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', themeName);
    }

    // Update active card in modal
    updateActiveCard();

    // Save to localStorage
    saveTheme();
  }

  /**
   * Get current theme
   * @returns {string} Current theme name
   */
  function getCurrentTheme() {
    return currentTheme;
  }

  /**
   * Toggle between light and dark mode
   * Note: This is a legacy function. Dark mode toggle is now handled separately.
   */
  function toggleDarkMode() {
    // This function is kept for backward compatibility
    // In the new design, dark mode is toggled via header button
    console.log('toggleDarkMode called (legacy)');
  }

  /**
   * Check if current theme is dark mode
   * @returns {boolean} True if dark mode is active
   */
  function isDarkMode() {
    // Check if body has dark theme or if theme name includes 'dark'
    const dataTheme = document.body.getAttribute('data-theme');
    return dataTheme === 'dark' || currentTheme.includes('dark');
  }

  /**
   * Load theme from localStorage
   */
  function loadTheme() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && VALID_THEMES.includes(stored)) {
        setTheme(stored);
      } else {
        setTheme('default');
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      setTheme('default');
    }
  }

  /**
   * Save theme to localStorage
   */
  function saveTheme() {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Open theme modal
   */
  function openModal() {
    const modal = document.getElementById('theme-modal');
    if (!modal) {
      console.error('Theme modal not found');
      return;
    }

    modal.classList.remove('modal-overlay--hidden');
    modal.setAttribute('aria-hidden', 'false');

    // Update active card
    updateActiveCard();

    // Disable keyboard shortcuts while modal is open
    if (typeof KeyboardHandler !== 'undefined' && KeyboardHandler.disable) {
      KeyboardHandler.disable();
    }
  }

  /**
   * Close theme modal
   */
  function closeModal() {
    const modal = document.getElementById('theme-modal');
    if (!modal) return;

    modal.classList.add('modal-overlay--hidden');
    modal.setAttribute('aria-hidden', 'true');

    // Re-enable keyboard shortcuts
    if (typeof KeyboardHandler !== 'undefined' && KeyboardHandler.enable) {
      KeyboardHandler.enable();
    }
  }

  /**
   * Toggle theme modal
   */
  function toggleModal() {
    const modal = document.getElementById('theme-modal');
    if (!modal) return;

    const isHidden = modal.getAttribute('aria-hidden') === 'true';
    if (isHidden) {
      openModal();
    } else {
      closeModal();
    }
  }

  /**
   * Update active theme card
   */
  function updateActiveCard() {
    const allCards = document.querySelectorAll('.theme-card');
    
    allCards.forEach(card => {
      const theme = card.getAttribute('data-theme');
      if (theme === currentTheme) {
        card.classList.add('theme-card--active');
        card.setAttribute('aria-pressed', 'true');
      } else {
        card.classList.remove('theme-card--active');
        card.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /**
   * Handle theme card click
   * @param {Event} event - Click event
   */
  function handleThemeCardClick(event) {
    const card = event.currentTarget;
    const theme = card.getAttribute('data-theme');

    if (theme && VALID_THEMES.includes(theme)) {
      setTheme(theme);
    }
  }

  /**
   * Bind modal events
   */
  function bindModalEvents() {
    // Settings button (opens modal)
    const settingsBtn = document.getElementById('btn-settings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', openModal);
    }

    // Close button
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Overlay click (close modal)
    const overlay = document.getElementById('theme-modal');
    if (overlay) {
      overlay.addEventListener('click', (event) => {
        // Only close if clicking the overlay itself, not the content
        if (event.target === overlay) {
          closeModal();
        }
      });
    }

    // Theme cards
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
      card.addEventListener('click', handleThemeCardClick);

      // Keyboard support
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleThemeCardClick(event);
        }
      });
    });

    // Escape key to close modal
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const modal = document.getElementById('theme-modal');
        if (modal && modal.getAttribute('aria-hidden') === 'false') {
          closeModal();
        }
      }
    });
  }

  /**
   * Legacy function for backward compatibility
   * (Used by old settings dialog code)
   */
  function openDialog() {
    openModal();
  }

  /**
   * Legacy function for backward compatibility
   */
  function closeDialog() {
    closeModal();
  }

  /**
   * Legacy function for backward compatibility
   */
  function toggleDialog() {
    toggleModal();
  }

  // Public API
  return {
    init,
    setTheme,
    toggleDarkMode,
    getCurrentTheme,
    isDarkMode,
    openModal,
    closeModal,
    toggleModal,
    // Legacy API (for backward compatibility)
    openDialog,
    closeDialog,
    toggleDialog,
    bindDialogEvents: bindModalEvents
  };
})();
