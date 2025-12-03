
var help = Cherry.createMenuHook('帮助中心',  {
  iconName: 'question_mark',
  subMenuConfig: [
    { iconName: 'function', name: 'Latex在线', onclick: (event)=>{
      window.open("https://www.latexlive.com/");
    }

    },
    { iconName: 'face', name: 'Emoji在线', onclick: (event)=>{
        window.open("https://emojixd.com/list");
      }},
    { noIcon: true, name: '更新日志', onclick: (event)=>{

      }},
  ]
});
let config1 = {
  id:"markdown",
  toolbars: {

    customMenu: {
      help: help
    },
    toolbarRight: ['fullScreen', '|', 'export', '|','help', '|', 'switchModel'],
  }
}
let config2 = {
  id:"markdown",
  editor:{
    defaultModel: "editOnly"
  },
  stats: false,
}
window.cherry = new Cherry(config1);


fetch('./markdown/bigData.md').then((response) => response.text()).then((value) => {
  window.cherry.setMarkdown(value)
});
