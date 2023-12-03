/**
 * 自定义一个语法
 */
let isDark = window.matchMedia('(prefers-color-scheme:  dark)').matches;
/**
 * 定义一个自带二级菜单的工具栏
 */
var customMenuC = Cherry.createMenuHook('帮助中心', {
  iconName: 'question',
  onClick: (selection, type) => {
    switch (type) {
      case 'shortKey':
        return `${selection}快捷键看这里：https://codemirror.net/5/demo/sublime.html`;
      case 'github':
        return `${selection}我们在这里：https://github.com/Tencent/cherry-markdown`;
      case 'release':
        return `${selection}我们在这里：https://github.com/Tencent/cherry-markdown/releases`;
      default:
        return selection;
    }
  },
  subMenuConfig: [
    {
      noIcon: true, name: '快捷键', onclick: (event) => {
        cherry.toolbar.menus.hooks.customMenuCName.fire(null, 'shortKey')
      }
    },
    {
      noIcon: true, name: '联系我们', onclick: (event) => {
        cherry.toolbar.menus.hooks.customMenuCName.fire(null, 'github')
      }
    },
    {
      noIcon: true, name: '更新日志', onclick: (event) => {
        cherry.toolbar.menus.hooks.customMenuCName.fire(null, 'release')
      }
    },
  ]
});

var basicConfig = {
  id: 'markdown',
  externals: {
    echarts: window.echarts,
    katex: window.katex,
    MathJax: window.MathJax,
  },

  isPreviewOnly: false,
  engine: {
    global: {
      urlProcessor(url, srcType) {
        console.log(`url-processor`, url, srcType);
        return url;
      },
    },
    syntax: {
      codeBlock: {

      },
      fontEmphasis: {
        allowWhitespace: false, // 是否允许首尾空格
      },
      strikethrough: {
        needWhitespace: false, // 是否必须有前后空格
      },
      mathBlock: {
        engine: 'MathJax', // katex或MathJax
        src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js', // 如果使用MathJax plugins，则需要使用该url通过script标签引入
      },
      inlineMath: {
        engine: 'MathJax', // katex或MathJax
      },
      emoji: {
        useUnicode: true,
        customResourceURL: 'https://github.githubassets.com/images/icons/emoji/unicode/${code}.png?v8',
        upperCase: false
        ,
      },
      // toc: {
      //     tocStyle: 'nested'
      // }
      // 'header': {
      //   strict: false
      // }
    },

  },
  toolbars: {
    toolbar: [
      'bold',
      'italic',
      {
        strikethrough: ['strikethrough', 'underline', 'sub', 'sup', 'ruby'],
      },
      'size',
      '|',
      'color',
      'header',
      '|',
      'detail',
      'panel',
      'lineTable',
      'theme',
      '|',
      {
        insert: ['ol',
          'ul', 'checklist', 'image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'formula', 'toc', 'table', 'pdf', 'word', 'drawIo'],
      },
      'graph',
      'togglePreview',

      'customMenuCName',
    ],
    toolbarRight: ['fullScreen', '|', 'export', '|'],
    bubble: false, // array or false
    sidebar: false,
    customMenu: {
      customMenuCName: customMenuC,
    },
  },
  drawioIframeUrl: './drawio_demo.html',
  editor: {
    defaultModel: 'edit&preview',
    id: 'cherry-text',
    name: 'cherry-text',
    autoSave2Textarea: true,
  },
  previewer: {
    // 自定义markdown预览区域class
    // className: 'markdown'
  },
  keydown: [],
  //extensions: [],
  callback: {
    changeString2Pinyin: pinyin,
  },
};

fetch('./markdown/basic.md').then((response) => response.text()).then((value) => {
  var config = Object.assign({}, basicConfig, {value: value});
  window.cherry = new Cherry(config);
  function setTheme(isDark) {
      if (isDark) {
          window.cherry.setTheme('dark');
          document.querySelector('.cherry').setAttribute('data-code-block-theme', 'tomorrow-night');
      } else {
          window.cherry.setTheme('light');
          document.querySelector('.cherry').setAttribute('data-code-block-theme', 'default');
      }
  }
  window.matchMedia('(prefers-color-scheme:  dark)').addEventListener('change', () => {
    const systemPrefersDarkScheme = window.matchMedia('(prefers-color-scheme:  dark)').matches;
      setTheme(systemPrefersDarkScheme);
  });
  setTheme(isDark)
  window.onresize=function () {
      if(window.outerWidth>725){
        window.cherry.switchModel('edit&preview');
      }else{
        window.cherry.switchModel('editOnly');
      }
  }
});
