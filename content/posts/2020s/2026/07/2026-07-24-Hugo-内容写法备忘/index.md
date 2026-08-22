---
title: "Hugo 内容写法备忘"
date: 2026-07-24T12:00:00+08:00
lastmod: 2026-07-24
draft: false
slug: "hugo-content-notes"
categories: ["写作"]
tags: ["内容生产","排版"]
summary: "正文里常用的图片、媒体、剧透、诗词、公式与 Mermaid 写法速查。"
showComments: false
---

这篇只管**正文怎么写**。发文流程见：[《Hugo + Congo 发文流程》]({{< relref "/posts/2020s/2026/07/2026-07-24-Hugo-Congo-发文流程/index.md" >}})；模板特调见：[《Congo 站点定制记录》]({{< relref "/posts/2020s/2026/07/2026-07-24-Congo-站点定制记录/index.md" >}})。

## 图片布局

### 普通图片

单张图片直接写标准 Markdown：

```md
![说明](图片地址)
```

当前站点的普通正文图片会自动接入点击放大；但它们是**单图查看**，不会串成整篇文章图库。

### 手机截图对比 `phone-shots`

```md
{{</* phone-shots caption="手机截图对比" */>}}
![左图说明](左图地址)
![右图说明](右图地址)
{{</* /phone-shots */>}}
```

实际效果：

{{<phone-shots caption="图：https://haowallpaper.com/mobileView" >}}
![](https://i.ibb.co/v47GysrQ/image.png)
![](https://i.ibb.co/YB3z01XH/image.png)
{{</phone-shots>}}

### 微博式九宫格

```md
{{</* phone-shots layout="weibo" caption="微博式图片网格" */>}}
![图 1](图片地址 1)
![图 2](图片地址 2)
![图 3](图片地址 3)
{{</* /phone-shots */>}}
```

### 常用参数

| 参数 | 默认值 | 用途 |
|------|--------|------|
| `layout` | `compare` | `compare` 为手机长截图对比；`weibo` 为方格九宫格 |
| `columns` | `compare` 为 `2`，`weibo` 为 `3` | 每行几张图 |
| `gap` | `compare` 为 `0.45rem`，`weibo` 为 `0.35rem` | 图片间距 |
| `maxHeight` | `42rem` | `compare` 模式下单张截图最大高度 |
| `fillColumn` | 空 | 补齐列高 |
| `caption` | 空 | 整组说明文字 |

`phone-shots` 组图会自动接入图库浏览：上一张 / 下一张、键盘 `←` `→`、手机横向滑动、Mac 触控板横向翻图都支持。

## 媒体分享

### YouTube

```md
{{</* youtube ZJthWmvUzzc */>}}
{{</* youtube id="ZJthWmvUzzc" */>}}
```

### X（原 Twitter）

```md
{{</* x user="DesignReviewed" id="1085870671291310081" */>}}
```

### TikTok

```md
{{</* tiktok url="https://www.tiktok.com/@hinatazakanews/video/7619919230682565908" */>}}
```

### Bilibili

```md
{{</* bilibili id="BV1hx411T7XW" */>}}
{{</* bilibili id="BV1Gg411m75M" p="19" auto="1" */>}}
{{</* bilibili url="https://www.bilibili.com/video/BV1hx411T7XW?p=2" */>}}
```

### 音乐

| 平台 | 核心参数 | 说明 |
|------|----------|------|
| Spotify | `platform="spotify"` + `id` | 支持 `track` / `album` / `playlist` |
| Apple Music | `platform="apple"` + `src` | 直接贴 Apple Music 页面链接 |
| 通用 iframe | `src` | 兜底方式 |

```md
{{</* music
  platform="spotify"
  id="2kM92TK9i4lnxE8IVLpgOm"
  title="ジャーマンアリイス"
  compact="true"
  theme="light"
*/>}}
```

## 提示框 / 折叠 / 过期声明

### GitHub 风格提示框

当前站点已经兼容 **GitHub Markdown callout**，正文里可以直接写：

```md
> [!NOTE]
> 补充说明、背景信息。

> [!TIP]
> 快速技巧或建议。

> [!IMPORTANT]
> 必须遵守的关键信息。

> [!WARNING]
> 可能遇到的问题与风险。

> [!CAUTION]
> 危险操作：执行前请确认后果。
```

如果你想顺手写折叠态，也兼容 Obsidian 风格：

```md
> [!WARNING]- 风险说明
> 默认收起，点开查看。

> [!TIP]+ 经验技巧
> 默认展开。
```

其中：

- `+` = 默认展开
- `-` = 默认收起
- GitHub 本身只认基础五类；`success` / `forbid` / `critical` 这类站内扩展，仍建议继续用短代码

### `callout`

如果你想显式控制类型、标题、折叠和打开状态，继续用站内 `callout` 短代码：

```md
{{</* callout type="note" */>}}
补充说明、背景信息。
{{</* /callout */>}}

{{</* callout type="warning" fold="true" */>}}
长文案默认收起。
{{</* /callout */>}}

{{</* callout type="caution" fold="true" open="true" */>}}
高危说明默认展开。
{{</* /callout */>}}
```

常用类型：

| type | 默认语义 |
|------|----------|
| `note` | 注意 |
| `tip` | 提示 |
| `important` | 重要 |
| `warning` | 警告 |
| `caution` | 小心 |
| `success` | 站内扩展：完成 / 成功 |
| `forbid` / `danger` / `critical` | 站内扩展：高风险别名 |

### `fold`

通用折叠块可以直接写：

```md
{{</* fold title="中性折叠" */>}}
术语解释、剧透、附录等。
{{</* /fold */>}}

{{</* fold title="带类型的折叠" type="warning" */>}}
等价于 `callout type="warning" fold="true"`。
{{</* /fold */>}}
```

### `outdated`

过期提示用于给旧内容加时间阈值提醒：

```md
{{</* outdated from="2025-06-01" */>}}
{{</* /outdated */>}}

{{</* outdated from="2025-06-01" years="2" */>}}
{{</* /outdated */>}}
```

| 参数 | 说明 |
|------|------|
| `from` / 位置参数 | 基准日 |
| `years` | 满几年才显示，默认 `1` |
| 正文 | 省略则用默认动态句；有正文则完全自定义 |

### 怎么选

| 需求 | 用什么 |
|------|--------|
| 普通提示 | GitHub 风格 `> [!NOTE]` 等 |
| 分色且可控 | `callout` |
| 折叠附录 / 剧透 | `fold` |
| 过期声明 | `outdated` |
|


## 诗词 / 注音

### `poem`

```md
{{</* poem title="蝶恋花·春景" author="苏轼〔宋代〕" dir="h" */>}}
花褪残红青杏小。
huā tuì cán hóng qīng xìng xiǎo

燕子飞时，绿水人家绕。
yàn zi fēi shí lǜ shuǐ rén jiā rào
{{</* /poem */>}}
```

### `ruby`

```md
我喜欢{{</* ruby py="chūn jǐng" */>}}春景{{</* /ruby */>}}胜过秋天。
```

实际效果：我喜欢{{< ruby py="chūn jǐng" >}}春景{{< /ruby >}}胜过秋天。

## 数学公式（KaTeX）

先放一次加载短代码：

```md
{{</* katex */>}}
```

{{< katex >}}

行内公式：

```tex
质能关系：\(E = mc^2\)
```

块级公式：

```tex
$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}
$$
```

实际效果：

$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}
$$

## 时序图（Mermaid）

```md
{{</* mermaid */>}}
sequenceDiagram
  autonumber
  作者->>Hugo: hugo server -D
  Hugo-->>浏览器: 本地预览
{{</* /mermaid */>}}
```

实际效果：

{{< mermaid >}}
sequenceDiagram
  autonumber
  作者->>Hugo: hugo server -D
  Hugo-->>浏览器: 本地预览
{{< /mermaid >}}

## 杂项

### 行内剧透 `spoiler`

```md
这是普通内容，{{</* spoiler */>}}这是剧透{{</* /spoiler */>}}。
这是普通内容，{{</* spoiler text="这是剧透" */>}}。
```

实际效果：这是普通内容，{{< spoiler >}}这是剧透{{< /spoiler >}}。

### 键盘按键 `kbd`

直接写原生 HTML 即可：

```md
按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制
按 <kbd>⌘</kbd> + <kbd>K</kbd> 打开链接面板
```

显示效果：按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制。

### 正文标注

原生 HTML 仍然能混写，例如：

```md
<span style="text-decoration: wavy underline; color: red;">波浪线</span>
<u>下划线文字</u>
<span style="text-emphasis: dot; text-emphasis-position: under;">文字下方着重点</span>
```