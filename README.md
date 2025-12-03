<p align="center"><img src="logo/android-chrome-192x192.png" alt="cherry logo" width="100%"/></p>

## 介绍

Cherry Muse 是基于腾讯开源的[CherryMarkdown](https://github.com/Tencent/cherry-markdown) 深度定制的Markdown编辑器，增加了一些新的特性，删除了一些不太重要的特性，并且进行了一定程度的精简，完整版体积比原版更小。

编译出来的`cherry-markdown.min.js`约800KB，远小于官方编译版的4.8MB

## 主要改动
- UI：
  - 主题调整为内置light和dark，自动跟随系统切换；
  - 字体图标使用Google Fonts取代；
  - 增强了markdown编辑区域的语法提示效果，趋向于typora；
  - 重新设计了编辑器的UI,整体更美观；
- 语法：
  - 增加`!file[]()`这种文件渲染语法；
  - 增加`卡片列表语法`；
  - 补全`echarts`功能；
  - 增加`==`高亮语法；
  - 增加`徽章`语法；
  - 移除plantuml语法；
  - checklist由图标换成input；
  - 增加iframe渲染语法；
  - frontMatter完整语法支持，可以使用`yaml`和`json`,可以在markdown中使用变量或者在js中的cherry对象使用frontMatter变量访问；
- 功能：
  - 重新规划联想功能；
  - 新增Emoji自动联想；
  - 自动联想深拷贝修复；
  - 移除浮动框；
  - ~~新增编辑页显示左侧目录列表~~（已替换为官方方案）；
  - 删除导出长图的功能；
  - 删除在预览时修改代码语言的功能；
  - 分离mermaid，使用API服务端渲染（也可以自己引入mermaid.js,则使用前端渲染）；
  - 分离echarts，使用API服务端渲染（也可以自己引入echarts.js,则使用前端渲染）；
  - 分离MathJax，使用API服务端渲染（也可以自己引入MathJax.js,则使用前端渲染）；
  - 删除英语语言包，完善中文语言包；
  - 所有需要前端渲染的图标，默认均使用API调用；
  - 移除FloatMenu；
  - 字数统计功能改成左下角显示；
  - 重新优化编辑器预览切换功能，更自然；
- 事件：
  - 新增编辑器渲染完成事件；
  - 新增二级菜单打开事件；
  - 新增编辑器模式修改事件；
- 代码：
  - 移除typescript相关内容；
  - 删除所有的测试用例；

## 其他

定期跟随Cherry Markdown的更新，保持同步。

## License

Apache-2.0
