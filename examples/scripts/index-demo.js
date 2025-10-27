
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

let config2 = {
  id:"markdown",


}
window.cherry = new Cherry(config2);


fetch('./markdown/bigData.md').then((response) => response.text()).then((value) => {
  window.cherry.setMarkdown(value)
});
