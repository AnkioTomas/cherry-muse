<p align="center"><img src="logo/android-chrome-192x192.png" alt="cherry logo" width="100px"/></p>

# Cherry Muse

> 基于 [Cherry Markdown](https://github.com/Tencent/cherry-markdown) 的深度定制版本

## 为什么选择 Cherry Muse？

**体积优化**: 编译后的 `cherry-markdown.min.js` 仅 **800KB**，相比官方版本的 4.8MB 减少了 **83%**

**核心改进**:
- 🎨 现代化 UI 设计，自动跟随系统主题切换
- ⚡ 更激进的按需加载策略（Mermaid/ECharts/MathJax 支持 API 渲染）
- 🔧 增强的 Markdown 语法支持（文件渲染、卡片列表、高亮、徽章等）
- 🌐 专注中文环境优化

## 快速开始

### 安装

```bash
npm install cherry-muse
```

### 基础使用

```javascript
import Cherry from 'cherry-muse';

const cherry = new Cherry({
  id: 'markdown-container',
  value: '# Hello Cherry Muse'
});
```

### CDN 引入

```html
<link href="dist/cherry-markdown.min.css" rel="stylesheet">
<script src="dist/cherry-markdown.min.js"></script>

<div id="markdown-container"></div>

<script>
  const cherry = new Cherry({
    id: 'markdown-container',
    value: '# Hello Cherry Muse'
  });
</script>
```

## 主要特性

### 🎨 UI/UX 增强

- 内置 `light` 和 `dark` 主题，自动跟随系统切换
- 使用 Google Fonts 图标替代原有字体图标
- Typora 风格的语法提示效果
- 重新设计的编辑器界面，更简洁现代

### ✨ 新增语法

| 语法 | 说明 | 示例 |
|------|------|------|
| 文件渲染 | 渲染文件链接 | `!file[文件名](url)` |
| 高亮 | 文本高亮显示 | `==高亮文本==` |
| 徽章 | 显示徽章 | 徽章语法 |
| 卡片列表 | 卡片样式列表 | 卡片列表语法 |
| Iframe | 嵌入外部页面 | iframe 语法 |
| FrontMatter | 完整的元数据支持 | 支持 `yaml` 和 `json` |

### ⚡ 性能优化

**按需加载策略**：大型渲染库支持 API 服务端渲染或前端引入
- Mermaid 图表
- ECharts 图表  
- MathJax 公式

这意味着：
- 默认情况下使用 API 渲染，零前端体积
- 需要离线环境？自行引入对应 JS 库即可切换为前端渲染

### 🔧 功能优化

**新增功能**:
- Emoji 自动联想补全
- 编辑器渲染完成事件
- 二级菜单打开事件
- 编辑器模式修改事件

**改进功能**:
- 重新设计的联想功能，修复深拷贝问题
- Checklist 使用原生 `<input>` 替代图标
- 字数统计移至左下角显示
- 更流畅的预览切换体验

**精简内容**:
- 移除 PlantUML 语法
- 移除浮动菜单（FloatMenu）
- 移除导出长图功能
- 移除预览时修改代码语言功能
- 删除英语语言包，完善中文语言包

### 🛠️ 开发体验

- 移除 TypeScript 相关内容（纯 JavaScript）
- 删除所有测试用例
- 更小的构建产物

## 与原版的区别

Cherry Muse 是对 Cherry Markdown 的**精简优化版**，而非功能增强版。我们的理念是：

```
体积更小 + 核心功能完整 > 大而全但臃肿
```

**适合使用 Cherry Muse 的场景**:
- 需要控制前端资源体积的项目
- 主要面向中文用户的应用
- 不需要 PlantUML、长图导出等边缘功能
- 希望使用服务端渲染 Mermaid/ECharts 的项目

**仍然建议使用原版的场景**:
- 需要完整的国际化支持
- 依赖 PlantUML 等被移除的功能
- 团队已经深度依赖 TypeScript 类型定义

## 维护策略

定期跟随 Cherry Markdown 官方更新，保持同步。

## 开源协议

Apache-2.0

---

**基于 [Cherry Markdown](https://github.com/Tencent/cherry-markdown) 构建** | 感谢腾讯开源团队的优秀工作
