/**
 * 自定义一个语法
 */
let isDark = window.matchMedia('(prefers-color-scheme:  dark)').matches;


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
      table: {
        enableChart: true
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

      {
        strikethrough: ['strikethrough', 'underline', 'sub', 'sup', 'ruby',  'bold',
          'italic',],
      },
      'size',
      '|',
      'color',
      'header',
      '|',

        'badge',
      'panel',

      '|',
      {
        insert: ['ol',
          'ul', 'checklist', 'image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'formula', 'toc', 'table','detail','lineTable','barTable','emoji'],
      },
      'graph',
        'echarts',
        'card',
      'togglePreview',
        'switchModel'

    ],
    toolbarRight: ['fullScreen', '|', 'export', '|'],
    bubble: false, // array or false
    sidebar: false,
    customMenu: {

    },
  },
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
if(window.outerWidth<=600){
  basicConfig.toolbars.toolbar = [
    'togglePreview',
    'switchModel',
  ];
}
window.cherry = new Cherry(basicConfig);


fetch('./markdown/test.md').then((response) => response.text()).then((value) => {
  window.cherry.setMarkdown(value)
});
