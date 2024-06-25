<p align="center"><img src="logo/cover.png" alt="cherry logo" width="100%"/></p>

## 介绍

Cherry Muse 是基于腾讯开源的[CherryMarkdown](https://github.com/Tencent/cherry-markdown) 深度定制的Markdown编辑器，增加了一些新的特性，删除了一些不太重要的特性，并且进行了一定程度的精简，完整版体积比原版更小。

## 主要改动
- UI：
  - 调整各个模块的UI显示方式，不再内置主题，主题采用外部引入的形式；
  - 字体图标使用Google Fonts取代；
- 语法：
  - 增加`!file[]()`这种文件渲染语法；
  - 增加`卡片列表语法`；
  - 补全`echarts`功能；
  - 增加`==`高亮语法；
  - 增加`徽章`语法；
  - [表格生成图表（Pro）](https://github.com/Tencent/cherry-markdown/wiki/%E5%A6%82%E4%BD%95%E9%85%8D%E7%BD%AE--configuration)功能补全；
  - 移除plantuml语法；
  - checklist由图标换成input；
- 功能：
  - 重新规划联想功能；
  - 新增Emoji自动联想、各类自动联想；
  - 自动联想深拷贝修复；
  - 移除浮动框；
  - 新增编辑页显示左侧目录列表；
  - 删除导出长图的功能；
  - 删除在预览时修改代码语言的功能；
  - 分离mermaid，使用API服务端渲染（也可以自己引入mermaid.js,则使用前端渲染）；
  - 删除英语语言包，完善中文语言包；
  - 所有需要前端渲染的图标，默认均使用API调用；
  - 移除FloatMenu；
  - 字数统计功能改成下拉框的形式；
- 事件：
  - 新增编辑器渲染完成事件；
  - 新增二级菜单打开事件；
- 代码：
  - 移除typescript相关内容；
  - 删除所有的测试用例；

## 其他

定期跟随Cherry Markdown的更新，保持同步。

## License

Apache-2.0
