class ThemeManager {
  constructor() {
    this.currentTheme = this.getPreferredTheme();
    this.applyTheme(this.currentTheme);
  }

  // localStorage 在某些环境（隐私模式、跨域 iframe）下会抛错，需做容错
  static safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  static safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* 忽略写入失败 */
    }
  }

  getPreferredTheme() {
    const saved = ThemeManager.safeStorageGet('resume-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    try {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch (e) {
      return 'dark';
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.persist(theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateToggleIcon(theme);
    if (window.particles) {
      window.particles.refresh();
    }
  }

  persist(theme) {
    ThemeManager.safeStorageSet('resume-theme', theme);
  }

  updateToggleIcon(theme) {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    const thumb = toggle.querySelector('.theme-toggle-thumb');
    if (!thumb) return;

    if (theme === 'dark') {
      thumb.innerHTML = '<svg viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill="currentColor"/></svg>';
    } else {
      thumb.innerHTML = '<svg viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/></svg>';
    }
  }
}