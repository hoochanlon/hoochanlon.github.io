---
title: "Congo 站点定制记录"
date: 2026-07-24T12:10:00+08:00
lastmod: 2026-07-24
draft: false
slug: "congo-site-customization"
categories: ["写作"]
tags: ["内容生产"]
summary: "记录本站页面级 front matter、标题特调和显示开关等模板定制项。"
showComments: false
---

这篇只管**站点作者怎么调模板**。发文流程见：[《Hugo + Congo 发文流程》]({{< relref "/posts/2020s/2026/07/2026-07-24-Hugo-Congo-发文流程/index.md" >}})；正文语法见：[《Hugo 内容写法备忘》]({{< relref "/posts/2020s/2026/07/2026-07-24-Hugo-内容写法备忘/index.md" >}})。

{{< callout type="note" >}}
普通日记通常不需要这里的大部分字段。只有你想覆盖站点默认行为、或者继续扩模板时，再回来看这一篇。
{{< /callout >}}

## 页面级 front matter

### 基础增强

| 参数 | 类型 | 作用 |
|------|------|------|
| `lastmod` | datetime | 最近更新时间 |
| `keywords` | array | 输出到页面 `meta keywords` |
| `canonicalUrl` | string | 指定 canonical URL |
| `robots` | string | 覆盖页面级 robots |
| `externalUrl` | string | 让文章卡片点击后跳到外链 |

### 列表 / 封面增强

| 参数 | 类型 | 作用 |
|------|------|------|
| `weight` | int | 精选排序值，越小越靠前 |
| `feature` | string | 指定 feature 图匹配名 |
| `cover` | string | 指定 cover 图匹配名 |
| `thumbnail` | string | 指定缩略图匹配名 |
| `featureAlt` | string | feature 图替代文本 |
| `coverAlt` | string | cover 图替代文本 |
| `thumbnailAlt` | string | 缩略图替代文本 |
| `coverCaption` | string | 文首封面说明 |

## 单页显示开关

这些参数用于**单页覆盖**站点默认值。

| 参数 | 类型 | 作用 |
|------|------|------|
| `showBreadcrumbs` | bool | 是否显示面包屑 |
| `showDate` | bool | 是否显示发布日期 |
| `showDateUpdated` | bool | 是否显示更新时间 |
| `showWordCount` | bool | 是否显示字数 |
| `showReadingTime` | bool | 是否显示阅读时间 |
| `showEdit` | bool | 是否显示编辑入口 |
| `showTaxonomies` | bool | 是否在单页显示分类 / 标签 |
| `showTableOfContents` | bool | 是否显示目录 |
| `showSharingLinks` | bool | 是否显示文末分享按钮 |
| `showComments` | bool | 是否显示评论 |
| `showSummary` | bool | 列表卡片里是否显示摘要 |

## 本站自定义标题特调

这些不是 Congo 通用字段，而是本站模板额外支持的参数：

| 参数 | 类型 | 用途 |
|------|------|------|
| `titleStyle` | string | 标题样式；当前支持 `script` |
| `titleSize` | string | 标题尺寸；如 `small` |
| `birthLabel` | string | 标题下方副标题 |

About 页示例：

```yaml
title: "Ch'eng-Lung Hu"
birthLabel: "b. 1996.01.01"
titleStyle: script
titleSize: small
showSharingLinks: false
```

## Callout / Fold / Outdated 扩展

这块属于**站点层能力**，不是 Congo 原生全套行为。当前实现由三层组成：

```text
Markdown 渲染钩子
  -> layouts/_markup/render-blockquote.html

短代码
  -> layouts/_shortcodes/callout.html
  -> layouts/_shortcodes/fold.html
  -> layouts/_shortcodes/outdated.html

样式
  -> assets/css/custom/40-callout.css
```

### 当前能力边界

| 能力 | 入口 | 说明 |
|------|------|------|
| GitHub Alerts | `render-blockquote.html` | 支持 `> [!NOTE]` / `TIP` / `IMPORTANT` / `WARNING` / `CAUTION` |
| Obsidian 风格折叠 marker | `render-blockquote.html` | 支持 `+` 默认展开、`-` 默认收起 |
| 站内分色提示框 | `callout` | 支持扩展类型、标题、折叠、打开状态 |
| 通用折叠块 | `fold` | 中性折叠或带类型折叠 |
| 过期提示 | `outdated` | 按基准日和阈值动态显示 |

### 维护建议

```text
只想写正文
  -> 直接看《Hugo 内容写法备忘》里的用法

要继续扩类型 / 图标 / 默认标题 / 显示逻辑
  -> 改 callout / fold / outdated shortcode
  -> 改 render-blockquote hook
  -> 改 40-callout.css
```

### 字段与兼容策略

当前站内色系对齐 GitHub Alerts：

- `note`
- `tip`
- `important`
- `warning`
- `caution`

另外保留站内扩展别名：

- `success`
- `forbid`
- `danger`
- `critical`

其中 GitHub Markdown 只认基础五类；扩展别名仍建议走短代码。

## 当前模板的实际入口

如果要继续扩模板，优先看这些文件：

```text
layouts/single.html
layouts/_partials/article-meta.html
layouts/_partials/extend-head.html
layouts/_markup/render-image.html
layouts/_markup/render-codeblock.html
config/_default/markup.toml
assets/css/custom/06-page-title.css
```

其中职责可以这样理解：

```text
single.html
  -> 单页总装配、标题特调、显示开关

article-meta.html
  -> 日期、阅读时间、标签等元信息

render-image.html / render-codeblock.html
  -> Markdown 渲染钩子

extend-head.html + custom CSS
  -> 字体、额外资源、页面级样式扩展
```

## 维护建议

```text
普通作者写文章
  -> 看《Hugo + Congo 发文流程》

需要正文短代码 / 排版效果
  -> 看《Hugo 内容写法备忘》

需要新增参数、改模板、调显示行为
  -> 看本文
```

## 参考入口

- [Congo 短代码总览](https://jpanther.github.io/congo/zh-hans/docs/shortcodes/)
- [KaTeX 支持的 TeX 函数](https://katex.org/docs/supported.html)
- [Mermaid 文档](https://mermaid.js.org/intro/)
