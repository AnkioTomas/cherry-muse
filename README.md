<p align="center"><img src="logo/cover.png" alt="cherry logo" width="100%"/></p>

## 介绍

Cherry Muse 是基于腾讯开源的[CherryMarkdown](https://github.com/Tencent/cherry-markdown) 深度定制的Markdown编辑器，增加了一些新的特性，删除了一些不太重要的特性，并且进行了一定程度的精简，完整版体积比原版更小。

## 主要改动
- UI：
  - 仅保留`light`和`dark`两种主题，并支持跟随系统切换；
  - 主题配色深度美化；
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
  - 移除浮动框（容易误触，影响写作效率）
  - 新增编辑页显示左侧目录列表；
  - 删除导出长图的功能（没啥用还占体积）；
  - 删除在预览时修改代码语言的功能（没啥用还丑）；
  - 分离mermaid，使用API服务端渲染（也可以自己引入mermaid.js,则使用前端渲染）；
  - 删除英语语言包，完善中文语言包；
  - 所有需要前端渲染的图标，默认均使用API调用；
  - 移除FloatMenu（用途不大，容易误触）;
- 事件：
  - 新增编辑器渲染完成事件；
- 代码：
  - 移除typescript相关内容（项目仅很少的部分用到ts的类型定义，属于大炮打蚊子）；
  - 删除所有的测试用例（总共就俩，还没啥用）


## License

Apache-2.0
