// 总共就两种颜色：light dark
import { changeTheme } from './utils/config';
import Event from './Event';

export const Theme = {
  init($cherry) {
    const isDark = window.matchMedia('(prefers-color-scheme:  dark)').matches;
    window.matchMedia('(prefers-color-scheme:  dark)').addEventListener('change', () => {
      const systemPrefersDarkScheme = window.matchMedia('(prefers-color-scheme:  dark)').matches;
      Theme.setTheme($cherry, systemPrefersDarkScheme);
    });
    Theme.setTheme($cherry, isDark);
    window.addEventListener('resize', function () {
      if (window.outerWidth > 600) {
        window.cherry.switchModel('edit&preview');
      } else {
        window.cherry.switchModel('editOnly');
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
      document.querySelector('.cherry').setAttribute('data-code-block-theme', 'dark');
      localStorage.setItem('cherry-theme', 'dark');
    } else {
      changeTheme($cherry, 'light');
      document.querySelector('.cherry').setAttribute('data-code-block-theme', 'light');
      localStorage.setItem('cherry-theme', 'light');
    }
    Event.emit('Theme', 'change', isDark);
  },
};
