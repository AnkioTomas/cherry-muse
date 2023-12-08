// 总共就两种颜色：light dark
import { changeTheme } from './utils/config';
import Event from './Event';

export const Theme = {
  /**
   * @param {Cherry} $cherry
   */
  init($cherry) {
    const isDark = window.matchMedia('(prefers-color-scheme:  dark)').matches;
    window.matchMedia('(prefers-color-scheme:  dark)').addEventListener('change', () => {
      const systemPrefersDarkScheme = window.matchMedia('(prefers-color-scheme:  dark)').matches;
      Theme.setTheme($cherry, systemPrefersDarkScheme);
    });
    Theme.setTheme($cherry, isDark);
    window.addEventListener('resize', function () {
      if ($cherry.model === 'previewOnly') return;
      if (window.outerWidth > 600) {
        $cherry.switchModel('edit&preview');
      } else {
        $cherry.switchModel('editOnly');
      }
    });
  },
  isDark() {
    const theme = localStorage.getItem('cherry-theme');
    return (theme !== null && theme === 'dark') || window.matchMedia('(prefers-color-scheme:  dark)').matches;
  },
  getTheme() {
    return Theme.isDark() ? 'dark' : 'light';
  },
  setTheme($cherry, isDark) {
    if (isDark) {
      changeTheme($cherry, 'dark');
      document.querySelectorAll('.cherry').forEach(function (elem) {
        elem.setAttribute('data-code-block-theme', 'dark');
      });
      localStorage.setItem('cherry-theme', 'dark');
      document.querySelectorAll('.cherry__theme__light').forEach(function (elem) {
        elem.classList.replace('cherry__theme__light', 'cherry__theme__dark');
      });
    } else {
      changeTheme($cherry, 'light');
      document.querySelectorAll('.cherry').forEach(function (elem) {
        elem.setAttribute('data-code-block-theme', 'light');
      });
      localStorage.setItem('cherry-theme', 'light');
      document.querySelectorAll('.cherry__theme__dark').forEach(function (elem) {
        elem.classList.replace('cherry__theme__dark', 'cherry__theme__light');
      });
    }
    Event.emit('Theme', 'change', isDark);
  },
};
