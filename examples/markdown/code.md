## CDN方式

### 引入资源

核心库 [[必须:important,top]]

```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/cherry-muse/dist/cherry-markdown.min.css">
<script src="https://cdn.jsdelivr.net/npm/cherry-muse/dist/cherry-markdown.min.js"></script>
```

MathJax库（数学公式渲染）[[可选:tip,top]]

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.min.js" integrity="sha512-EtUjpk/hY3NXp8vfrPUJWhepp1ZbgSI10DKPzfd+3J/p2Wo89JRBvQIdk3Q83qAEhKOiFOsYfhqFnOEv23L+dA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
```

Mermaid库（mermaid语法支持）[[可选:tip,top]]

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
```

Echarts库（echarts语法支持）[[可选:tip,top]]

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/echarts@4.6.0/dist/echarts.js"></script>
```

自动拼音转换库 [[可选:tip,top]]

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/dreamncn/cherry-muse/examples/scripts/pinyin/pinyin_dist.js"></script>
```

::: info 提示
以上可选库若不引入则默认使用API的方式调用。
:::

### 挂载点

```html
 <div id="markdown"></div>
```

### 使用

```javascript
let config2 = {id:"markdown"}
window.cherry = new Cherry(config2);
```



## NPM方式

::: tip 提示
此处以Vue为例，其他框架使用方式也类似。
:::

### 安装cherry-muse

```shell
yarn add cherry-muse
```
### 编写CherryMuse组件
```html
<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import Cherry from 'cherry-muse'
import 'cherry-muse/dist/cherry-markdown.min.css'

let cherry = null

const help = Cherry.createMenuHook('帮助中心', {
  iconName: 'question_mark',
  subMenuConfig: [
    { 
      iconName: 'function', 
      name: 'Latex在线', 
      onclick: () => window.open('https://www.latexlive.com/')
    },
    { 
      iconName: 'face', 
      name: 'Emoji在线', 
      onclick: () => window.open('https://emojixd.com/list')
    },
    { 
      noIcon: true, 
      name: '更新日志', 
      onclick: () => {}
    },
  ]
})

onMounted(() => {
  cherry = new Cherry({
    id: 'markdown',
    toolbars: {
      customMenu: { help },
      toolbarRight: ['fullScreen', '|', 'export', '|', 'help', '|', 'switchModel'],
    }
  })
})

onBeforeUnmount(() => {
  if (cherry) {
    cherry.destroy()
    cherry = null
  }
})
</script>

<template>
  <div id="markdown"></div>
</template>

<style scoped>
#markdown {
  width: 100%;
  height: 100vh;
}
 </style>

```

### 使用CherryMuse组件

```html
<script setup>
import CherryMuse from './components/CherryMuse.vue'
</script>

<template>
  <CherryMuse style="height:100vh;width:100%;"  />
 </template>

<style scoped></style>
              
```



