// 总共就两种颜色：light dark
import { changeTheme } from './utils/config';
import Event from './Event';

export const Theme = {
  /**
   * @param {Cherry} $cherry
   */
  init($cherry) {
    const savedTheme = localStorage.getItem('cherry-theme') || 'auto';
    Theme.setTheme($cherry, savedTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (Theme.getTheme() === 'auto') {
        const systemPrefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        Theme.applyTheme($cherry, systemPrefersDarkScheme ? 'dark' : 'light');
      }
    });
  },
  isDark() {
    const theme = Theme.getTheme();
    return theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  },
  getTheme() {
    return localStorage.getItem('cherry-theme') || 'auto';
  },
  setTheme($cherry, theme) {
    localStorage.setItem('cherry-theme', theme);
    if (theme === 'auto') {
      const systemPrefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      Theme.applyTheme($cherry, systemPrefersDarkScheme ? 'dark' : 'light');
    } else {
      Theme.applyTheme($cherry, theme);
    }
  },
  applyTheme($cherry, theme) {
    changeTheme($cherry, theme);
    document.querySelectorAll('.cherry').forEach(function (elem) {
      elem.setAttribute('data-code-block-theme', theme);
    });
    document.querySelectorAll(`.cherry__theme__${theme === 'dark' ? 'light' : 'dark'}`).forEach(function (elem) {
      elem.classList.replace(`cherry__theme__${theme === 'dark' ? 'light' : 'dark'}`, `cherry__theme__${theme}`);
    });
    Event.emit('Theme', 'change', theme === 'dark');
  },
};
