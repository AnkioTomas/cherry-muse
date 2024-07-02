# 卡片

## 普通卡片

++- 语法演示
```card
{
  "count": "auto",
  "type": "list",
  "data": [
    {
      "title": "标题",
      "desc": "描述",
      "image": "图片",
      "link": "链接",
      "bgColor": "",
      "textColor": ""
    },
    
  ]
}
```
+++

## 无图卡片



++- 语法演示
```card
{
  "count": 1,
  "type": "list",
  "data": [
     {
      "title": "标题",
      "desc": "描述",
      "image": "",
      "link": "链接",
      "bgColor": "",
      "textColor": ""
    },
  ]
}
```
+++

## 图文卡片


++- 语法演示
```card
{
  "count": 3,
  "type": "image",
  "data": [
    {
      "img": "图片",
      "link": "链接",
      "title": "标题",
      "desc": "描述内容",
    },
   
  ]
}
```
+++
