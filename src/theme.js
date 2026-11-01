// PDFly Theme Manager
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('pdfly-theme') || 'light';
    this.listeners = [];
  }

  get isDark() {
    return this.theme === 'dark';
  }

  toggle() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('pdfly-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.listeners.forEach((fn) => fn(theme));
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }
}

export const theme = new ThemeManager();
export default theme;
