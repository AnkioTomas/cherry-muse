![profile.png](https://wiki.ankio.net/file/upload_6574546916e75.png)

# 图像增强

## 设置大小

```markdown
![profile.png#189px #189px](https://wiki.ankio.net/file/upload_6574546916e75.png)
```

++- 语法演示
![profile.png#189px #189px](https://wiki.ankio.net/file/upload_6574546916e75.png)
+++

## 设置相对大小&绝对大小

```markdown
![profile.png#10%#50px](https://wiki.ankio.net/file/upload_6574546916e75.png)
```

++- 语法演示
![profile.png#10%#50px](https://wiki.ankio.net/file/upload_6574546916e75.png)
+++

## 设置图片对齐方式

### 参数说明

| 参数| 说明| 位置| 
| ------ | ------ | ------ |
| `#100px` 或 `#10%` 或 `#auto` | 宽度 | 第一个 | 
| `#100px` 或 `#10%` 或 `#auto` | 高度 | 第二个 | 
| `#left` | 左对齐 | 任意 | 
| `#center` | 居中 | 任意 | 
| `#right` | 右对齐 | 任意 | 
| `#float-left` | 悬浮左对齐 | 任意 | 
| `#float-right` | 悬浮右对齐 |任意 | 
| `#border` 或 `#B` | 边框 | 任意 | 
| `#shadow` 或 `#S` | 阴影 | 任意 | 
| `#radius` 或 `#R` | 圆角 | 任意 | 


### 左对齐+边框

```markdown
![profile.png#auto#100px#left#border](https://wiki.ankio.net/file/upload_6574546916e75.png)
```

++- 语法演示
![profile.png#auto#100px#left#border](https://wiki.ankio.net/file/upload_6574546916e75.png)
+++

### 居中+边框+阴影

```markdown
![profile.png#auto#100px#center#B#shadow](https://wiki.ankio.net/file/upload_6574546916e75.png)
```

++- 语法演示
![profile.png#auto#100px#center#B#shadow](https://wiki.ankio.net/file/upload_6574546916e75.png)
+++

### 右对齐+边框+阴影+圆角

```markdown
![profile.png#auto#100px#right#B#S#radius](https://wiki.ankio.net/file/upload_6574546916e75.png)
```

++- 语法演示
![profile.png#auto#100px#right#B#S#radius](https://wiki.ankio.net/file/upload_6574546916e75.png)
+++


### 浮动左对齐+边框+阴影+圆角

```markdown
![profile.png#auto#100px#float-left#B#S#R](https://wiki.ankio.net/file/upload_6574546916e75.png)
开心也是一天，不开心也是一天
```

++- 语法演示
![profile.png#auto#100px#float-left#B#S#R](https://wiki.ankio.net/file/upload_6574546916e75.png)
开心也是一天，不开心也是一天
+++
# 音频

```
!audio[描述](链接)
```

++- 语法演示

!audio[描述](https://music.163.com/song/media/outer/url?id=29753702.mp3)

+++

# 视频

```
!video[不带封面演示视频](链接)
!video[带封面演示视频](链接){poster=https://wiki.ankio.net/file/upload_6574546916e75.png}
```

++- 语法演示

!video[不带封面演示视频](链接)
!video[带封面演示视频](链接){poster=https://wiki.ankio.net/file/upload_6574546916e75.png}

+++

# 文件

```markdown
!file[文件名|类型|密码](链接)
```
++- 语法演示

!file[文件名|类型|密码](链接)

!file[文件名|mp3](链接)

!file[文件名|mp4](链接)

+++

