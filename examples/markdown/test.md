

::: tip 基础语法
这里是所有markdown编辑器都会支持的语法
:::


# 标题

```markdown
# heading 1
## heading 2
### heading 3
#### heading 4
##### heading 5
###### heading 6
Heading level 1
===============
Heading level 2
---------------
```

+++ 语法演示
# heading 1

## heading 2

### heading 3

#### heading 4

##### heading 5

###### heading 6

Heading level 1
===============
Heading level 2
---------------
+++

# 斜体

```markdown
_斜体_
*斜体*
```

+++ 语法演示
_斜体_
*斜体*
+++

# 粗体

```markdown
__粗体__
**粗体**
```

+++ 语法演示
__粗体__
**粗体**
+++

# 粗体和斜体

```markdown
___粗体和斜体___
***粗体和斜体***
__*粗体和斜体*__
_**粗体和斜体**_
**_粗体和斜体_**
```

+++ 语法演示
___粗体和斜体___
***粗体和斜体***
__*粗体和斜体*__
_**粗体和斜体**_
**_粗体和斜体_**
+++

## 引用

```markdown
> 引用文本
>> 嵌套引用
```

+++ 语法演示
> 引用文本
>> 嵌套引用
> >
+++

# 列表

## 无序列表

```markdown
- 文本一
- 文本二
- 文本三
```

+++ 语法演示
- 文本一
- 文本二
- 文本三

+++

## 有序列表

```markdown
1. 文本一
2. 文本二
3. 文本三
```

+++ 语法演示

1. 文本一
2. 文本二
3. 文本三

+++

# 代码块

````markdown
```html
<html>
   <head>
     <title>Test</title>
   </head>
   </html>
```
````

+++ 语法演示

```html
<html>
<head>
    <title>Test</title>
</head>
```

+++

# 行内代码

```markdown
`test`
```

+++ 语法演示
`test`
+++

# 转义反引号

```markdown
``Use `code` in your Markdown file.``
```

+++ 语法演示
``Use `code` in your Markdown file.``
+++

# 图片

```markdown
![Linux](/logo/profile.png)
```

+++ 语法演示
![Linux](/logo/profile.png)
+++

# 水平线

```markdown
****
----
____
```


+++ 语法演示

****

----

___
+++


# 链接

## 添加标题

```markdown
My favorite search engine is [Duck Duck Go](https://duckduckgo.com).
```

+++ 语法演示
My favorite search engine is [Duck Duck Go](https://duckduckgo.com).
+++

## URL

```markdown
<https://www.markdownguide.org>
<fake@example.com>
```

+++ 语法演示
<https://www.markdownguide.org>
<fake@example.com>
+++

### 格式化链接

```markdown
I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.
See the section on [`code`](#code).

```

+++ 语法演示
I love supporting the **[EFF](https://eff.org)**.
This is the *[Markdown Guide](https://www.markdownguide.org)*.
See the section on [`code`](#code).
+++



::: tip 进阶语法
只有部分markdown编辑器会支持的语法
:::

# 表格
## 常规表格

```markdown
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |
```

+++ 语法演示
| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |
+++

## 对齐
```markdown
| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |

```
+++ 语法演示
| Syntax | Description | Test Text |
| :--- |    :----:   | ---: |
| Header | Title | Here's this |
| Paragraph | Text | And more |
+++

# 删除线

```markdown
~~The world is flat.~~ We now know that the world is round.
```

+++ 语法演示
~~The world is flat.~~ We now know that the world is round.
+++

# 任务列表

```markdown
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media
```

+++ 语法演示

- [ ] Write the press release
- [x] Update the website
- [ ] Contact the media

+++

# 表情符号

```markdown
Gone camping! :tent: Be back soon.

That is so funny! :joy:
```

+++ 语法演示
Gone camping! :tent: Be back soon.
That is so funny! :joy:
+++

# 突出显示

```markdown
I need to highlight these ==very important words==.
I need to highlight these <mark>very important words</mark>.
```

+++ 语法演示
I need to highlight these ==very important words==.
I need to highlight these <mark>very important words</mark>.
+++

# 下标

```markdown
H<sub>2</sub>O
H^^2^^O
```

+++ 语法演示
H<sub>2</sub>O
H^^2^^O
+++

# 上标

```markdown
X<sup>2</sup>
X^2^
```

+++ 语法演示
X<sup>2</sup>
X^2^
+++

# 下划线

```markdown
Some of these words <ins>will be underlined</ins>.
Some of these words /will/ be underlined.
```

+++ 语法演示
Some of these words <ins>will be underlined</ins>.
Some of these words /will/ be underlined/.
+++

# 中心

```markdown
<center>This text is centered.</center>
```

+++ 语法演示
<center>This text is centered.</center>
+++

# 颜色

```markdown
<font color="red">This text is red!</font>
```

+++ 语法演示
<font color="red">This text is red!</font>
+++

::: tip 高级语法
少数markdown编辑器会支持的语法
:::



# 字体增强
## 字体大小
```markdown
鞋子 !32 特大号!
# !大小 文本!
```
+++ 语法演示
鞋子 !32 特大号!
+++
## 字体颜色

```markdown
!!#ff0000 字体颜色!!
!!!#f9cb9c 背景颜色!!!
[!!#ffffff !!!#000000 黑底白字超链接!!!!!](http://www.qq.com)
```
+++ 语法演示
!!#ff0000 字体颜色!!
!!!#f9cb9c 背景颜色!!!
[!!#ffffff !!!#000000 黑底白字超链接!!!!!](http://www.qq.com)
+++

# 超链接增强
## 自动识别
```markdown
https://www.qq.com?param=中文
```
+++ 语法演示
https://www.qq.com?param=中文
+++

## 引用链接

```markdown
这是一个[引用一个链接]
[引用一个链接]: https://www.qq.com
```
+++ 语法演示
这是一个[引用一个链接]
[引用一个链接]: https://www.qq.com
+++

# 图像增强
## 设置大小
![Linux](/logo/profile.png)

::: tip 高级特性
只有CherryMuse编辑器会支持的语法
:::


