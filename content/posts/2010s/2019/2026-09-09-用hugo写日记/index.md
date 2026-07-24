---
title: "用 Hugo 写日记"
date: 2019-09-09T18:20:16+0800
lastmod: 2026-07-20
draft: false
slug: "20190909182016"
categories: ["写作"]
tags: ["排版","标注"]
summary: "构建日记内容相关配置说明。"
featureAlt: "本文封面示例"
coverCaption: "本文即示例：同目录 feature.jpg 自动作为文首封面与列表缩略图"
---

## 新建日记

Hugo 不会「猜」你今天该放哪：你给出**内容路径**，它用 `archetypes/default.md` 生成 front matter，再按 `config` 里的 permalink 出站。本站磁盘目录与对外 URL **解耦**。

### 目录约定（作者侧）

```text
content/posts/
  {十年桶}/          # 如 2010s、2020s
    {年}/            # 如 2026
      {月}/          # 两位数，如 07（2026 起按月归类）
        YYYY-MM-DD-标题/index.md   # 推荐：page bundle
        # 或 YYYY-MM-DD-标题.md    # 单文件亦可
```

| 层 | 作用 | 是否进对外 URL |
|----|------|----------------|
| `2010s` / `2020s` | 十年整理桶 | 否 |
| `2026` | 年 | 否（URL 的年来自 front matter `date`） |
| `07` | 月（便于本地翻找） | 否 |
| 文章目录或 `.md` | 正文 | 路径不进 URL；`slug` 进 URL |

十年 / 年 / 月 的 `_index.md` 一律：

```yaml
build:
  render: never
  list: never
```

只当文件夹说明，不生成独立列表页。对外固定：

```text
/posts/:year/:slug/   →  例 /posts/2026/20260720124200/
```

`year` 取文章 `date` 的年份，不是文件夹名。

### 模板会写什么

`archetypes/default.md` 大致生成：

```yaml
title: "（由文件名推导，可改）"
date: （创建时刻）
draft: true          # 默认草稿；hugo 不带 -D 时不发布
slug: "20060102150405 形态时间戳"
categories: ["随笔"]
tags: []
summary: ""
featured: false
```

### 推荐：`create.py`

仓库根目录执行；按 **Asia/Shanghai 当天** 拼路径、补 `_index.md`、写草稿 front matter。

```bash
python create.py 今日随笔
```

会先问形态（直接回车 = 单文件，多数无封面日记）：

```text
生成形态（多数文章无封面选 1）:
  1) 单文件  2026-07-20-今日随笔.md
  2) bundle  2026-07-20-今日随笔/index.md   ← 需要 feature 封面图时
选择 [1/2]:
```

路径形态：

```text
# 1 单文件（默认回车）
content/posts/2020s/2026/07/2026-07-20-今日随笔.md

# 2 bundle（要封面时）
content/posts/2020s/2026/07/2026-07-20-今日随笔/index.md
```

之后改 front matter → 写正文：

```bash
hugo server -D    # draft: true 需 -D
# 定稿：draft: false
hugo
```

不依赖脚本时，在仓库根目录：

```bash
hugo new content "posts/2020s/2026/07/2026-07-20-今日随笔.md"
hugo new content "posts/2020s/2026/07/2026-07-20-今日随笔/index.md"
```

| 步骤 | 做什么 |
|------|--------|
| 新建 | `python create.py 标题` → 选单文件或 bundle |
| 落盘 | 自动 `content/posts/{十年}/{年}/{月}/YYYY-MM-DD-标题…` |
| 草稿 | 默认 `draft: true`；预览加 `-D` |
| 发布 | `draft: false` 后 `hugo` |
| 访问 | `/posts/{date 的年}/{slug}/` |

## 封面图

Congo **不会**去扫仓库根目录或随便一个 `static/` 路径当文章封面。封面来自 **页面资源（page resources）**：图必须和这篇 `index.md` 放在**同一个目录**（page bundle）。

### 本文的实际目录

你现在看到的文首大图、首页精选列表上的小图，就是下面这套结构生成的：

```text
content/posts/2010s/2019/2026-09-09-用hugo写日记/
  index.md       # 正文（本文件）
  feature.jpg    # 文件名里带 feature → 自动当封面 + 列表缩略图
```

对应 front matter 里只需可选说明文字，**不必写图片路径**：

```yaml
featureAlt: "本文封面示例"
coverCaption: "本文即示例：同目录 feature.jpg 自动作为文首封面与列表缩略图"
```

主题按文件名匹配资源，逻辑等价于：

```text
文章目录下的图片
  ├─ 文件名含 feature  → 列表缩略图 + 文首封面（优先）
  ├─ 文件名含 cover    → 仅文首封面
  └─ 文件名含 thumb    → 仅列表缩略图
```

### 三种图各管什么

{{< callout type="note" >}}
参考 [Congo：feature / cover / thumb](https://jpanther.github.io/congo/docs/getting-started/#feature-cover-and-thumbnail-images)
{{< /callout >}}

| 文件名包含 | 列表缩略图 | 文首封面 | 社交分享元数据 |
|------------|------------|----------|----------------|
| `feature` | 有 | 有 | 有 |
| `cover` | 无 | 有 | 视主题而定 |
| `thumb` | 有 | 无 | 无 |

日常一篇日记只要一张图时：命名为 `feature.jpg` / `feature.png` 即可，列表和正文都用它。

## 嵌入 YouTube、X

Hugo **内置**短代码，写日记时直接嵌即可，不用装插件。下面是可运行的示例（语法 + 渲染结果）。

### YouTube

只需 **视频 ID**（完整链接里 `v=` 或 `youtu.be/` 后面那一段）。

| 完整链接 | 取出 ID |
|----------|---------|
| `https://www.youtube.com/watch?v=ZJthWmvUzzc` | `ZJthWmvUzzc` |
| `https://youtu.be/ZJthWmvUzzc` | `ZJthWmvUzzc` |

写法（二选一）：

```md
{{</* youtube ZJthWmvUzzc */>}}
{{</* youtube id="ZJthWmvUzzc" */>}}
```

实际效果：

{{< youtube ZJthWmvUzzc >}}

### X（原 Twitter）推文

需要两个命名参数：

| 参数 | 含义 | 从哪抄 |
|------|------|--------|
| `user` | 账号名（不要 `@`） | 主页 `x.com/DesignReviewed` → `DesignReviewed` |
| `id` | 推文数字 ID | 推文链接末尾一长串数字 |

例：推文链接

```text
https://x.com/DesignReviewed/status/1085870671291310081
         └──── user ────┘         └──────── id ────────┘
```

写法：

```md
{{</* x user="DesignReviewed" id="1085870671291310081" */>}}
```

实际效果：

{{< x user="DesignReviewed" id="1085870671291310081" >}}

## 手机截图（特调比例）

单张截图仍可使用常规 Markdown：

```md
![说明](图片地址)
```

两张手机截图需要快速对比时，用 `phone-shots`。块内继续写普通 Markdown 图片，默认两列并排：

```md
{{</* phone-shots caption="手机截图对比" */>}}
![左图说明](左图地址)
![右图说明](右图地址)
{{</* /phone-shots */>}}
```

{{<phone-shots caption="手机截图对比" >}}
![ ](https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEXjkJqXjONyxSBTHJ2qFPN2U7oMvxjIAACmSwAAnUL8Va4InchFarp9j0E.jpg)
![ ](https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAEXx6JqYqSTIWoKQVlS-AU7mg6eOrLZRwAC_ycAAmrvEVcK10o93e97wT0E.jpg)
{{</phone-shots>}}

可选参数：

| 参数 | 默认值 | 用途 |
|------|--------|------|
| `layout` | `compare` | `compare` 为手机长截图对比；`weibo` 为微博式九宫格 |
| `columns` | `compare` 为 `2`，`weibo` 为 `3` | 每行几张图 |
| `maxHeight` | `34rem` | `compare` 模式下单张截图最大高度 |
| `gap` | `compare` 为 `0.9rem`，`weibo` 为 `0.35rem` | 图片间距 |
| `caption` | 空 | 整组说明文字 |

三张图或九宫格可以用微博式布局：

```md
{{</* phone-shots layout="weibo" caption="微博式图片网格" */>}}
![图 1](图片地址 1)
![图 2](图片地址 2)
![图 3](图片地址 3)
{{</* /phone-shots */>}}
```

`layout="weibo"` 会把图片裁成统一方格，3 张图就是一行三列；6/9 张会继续按三列排列。

实际效果：

{{<phone-shots layout="weibo" caption="微博式图片网格" >}}
![ ](https://cn.bing.com/th?id=OHR.DevilsBridge_ZH-CN2164982440_UHD.jpg&pid=hp&w=1920)
![ ](https://cn.bing.com/th?id=OHR.KaysersbergVillage_ZH-CN0445080679_UHD.jpg&pid=hp&w=1920)
![ ](https://cn.bing.com/th?id=OHR.FirefliesJapan_ZH-CN0071253415_UHD.jpg&pid=hp&w=1920)
![ ](https://cn.bing.com/th?id=OHR.ThamesSummer_ZH-CN5292532714_UHD.jpg&pid=hp&w=1920)
![ ](https://cn.bing.com/th?id=OHR.BambooPanda_ZH-CN8455481760_UHD.jpg&pid=hp&w=1920)
![ ](https://cn.bing.com/th?id=OHR.ForumRomanum_ZH-CN5873120178_UHD.jpg&pid=hp&w=1920)
![ ](https://cn.bing.com/th?id=OHR.LondonParliament_ZH-CN7089923691_UHD.jpg&pid=hp&w=1920)
![ ](https://cn.bing.com/th?id=OHR.BhutanMonastery_ZH-CN2469401011_UHD.jpg&pid=hp&w=1920)
![ ](https://cn.bing.com/th?id=OHR.KyrgyzstanRainbow_ZH-CN8027219590_UHD.jpg&pid=hp&w=1920)
{{</phone-shots>}}



## 诗词、注音

### 诗词容器 `poem`

写法（`dir=h` 横排 / `dir=v` 竖排）。**注意**：短代码在 Markdown 代码块里仍会被 Hugo 先执行，展示语法时要用 `{{</* … */>}}` 注释掉标签（同 YouTube / X 写法）。

```md
{{</* poem title="蝶恋花·春景" author="苏轼〔宋代〕" dir="h" */>}}
花褪残红青杏小。
huā tuì cán hóng qīng xìng xiǎo

燕子飞时，绿水人家绕。
yàn zi fēi shí lǜ shuǐ rén jiā rào
{{</* /poem */>}}
```

实际效果（横排）：

{{< poem title="蝶恋花·春景" author="苏轼〔宋代〕" dir="h" >}}
花褪残红青杏小。
huā tuì cán hóng qīng xìng xiǎo

燕子飞时，绿水人家绕。
yàn zi fēi shí lǜ shuǐ rén jiā rào
{{< /poem >}}

```md
{{</* poem title="蝶恋花·春景" author="苏轼〔宋代〕" dir="v" */>}}
花褪残红青杏小。
huā tuì cán hóng qīng xìng xiǎo

燕子飞时，绿水人家绕。
yàn zi fēi shí lǜ shuǐ rén jiā rào
{{</* /poem */>}}
```

实际效果（竖排）：

{{< poem title="蝶恋花·春景" author="苏轼〔宋代〕" dir="v" >}}
花褪残红青杏小。
huā tuì cán hóng qīng xìng xiǎo

燕子飞时，绿水人家绕。
yàn zi fēi shí lǜ shuǐ rén jiā rào

枝上柳绵吹又少，天涯何处无芳草！
zhī shàng liǔ mián chuī yòu shǎo tiān yá hé chù wú fāng cǎo

墙里秋千墙外道。
qiáng lǐ qiū qiān qiáng wài dào

墙外行人，墙里佳人笑。
qiáng wài xíng rén qiáng lǐ jiā rén xiào

笑渐不闻声渐悄，多情却被无情恼。
xiào jiàn bù wén shēng jiàn qiǎo duō qíng què bèi wú qíng nǎo
{{< /poem >}}

### 正文注音 `ruby`

普通段落里不想手写 `<ruby>` 时用。两种模式：

**行内**（嵌进一句话；`py` 按空格分音节，标点不占音节）：

```md
我喜欢{{</* ruby py="chūn jǐng" */>}}春景{{</* /ruby */>}}胜过秋天。
```

实际效果：我喜欢{{< ruby py="chūn jǐng" >}}春景{{< /ruby >}}胜过秋天。

也可自闭参数：`{{</* ruby text="春景" py="chūn jǐng" */>}}`。

**段落**（汉字行 + 拼音行两两配对，空行分段；无诗词题名框）：

```md
{{</* ruby */>}}
人生天地间，忽如远行客。
rén shēng tiān dì jiān hū rú yuǎn xíng kè

对此如何不饮，且共欢笑。
duì cǐ rú hé bù yǐn qiě gòng huān xiào
{{</* /ruby */>}}
```

实际效果：

{{< ruby >}}
人生天地间，忽如远行客。
rén shēng tiān dì jiān hū rú yuǎn xíng kè

对此如何不饮，且共欢笑。
duì cǐ rú hé bù yǐn qiě gòng huān xiào
{{< /ruby >}}



## 数学公式（KaTeX）

本页先放一次 **`katex` 短代码**（无参数），Congo 才会加载 KaTeX；之后全文的 `\( \)` / `$$ $$` 都会渲染。

```md
{{</* katex */>}}
```

{{< katex >}}

### 行内公式

定界符：`\(` … `\)`（在 Markdown 源码里常写成 `\\(` `\\)`，见下方示例块）。

```tex
质能关系：\(E = mc^2\)；黄金比 \(\varphi = \dfrac{1+\sqrt{5}}{2}\)
```

实际效果：质能关系：\(E = mc^2\)；黄金比 \(\varphi = \dfrac{1+\sqrt{5}}{2}\)

### 块级公式

定界符：独立一行的 `$$` … `$$`（或 `\[` … `\]`，见 `config/_default/markup.toml` 的 passthrough）。

```tex
$$
\varphi = 1+\frac{1}{1+\frac{1}{1+\frac{1}{1+\cdots}}}
$$
```

实际效果：

$$
\varphi = 1+\frac{1}{1+\frac{1}{1+\frac{1}{1+\cdots}}}
$$

再举一个日记里常见的「说明型」块公式：

```tex
$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}
$$
```

$$
\sum_{k=1}^{n} k = \frac{n(n+1)}{2}
$$

{{< callout type="tip" >}}
语法参考：[KaTeX 支持的 TeX 函数](https://katex.org/docs/supported.html)。本站已开 Goldmark passthrough，行内 `\(...\)`、块级 `$$...$$` 不会被 Markdown 拆坏。
{{< /callout >}}

## 时序图（Mermaid）

用 Congo 的 **`mermaid` 短代码**包住 [Mermaid](https://mermaid.js.org/) 文本；主题色会跟站点 `colorScheme` 走。

写法骨架：

```md
{{</* mermaid */>}}
sequenceDiagram
  ...
{{</* /mermaid */>}}
```

### 示例：写一篇日记的发布流程

{{< mermaid >}}
sequenceDiagram
  autonumber
  actor 作者
  participant 磁盘 as content/posts
  participant Hugo
  participant 浏览器

  作者->>磁盘: create.py / hugo new（草稿）
  作者->>磁盘: 改 front matter、写正文
  作者->>Hugo: hugo server -D
  Hugo-->>浏览器: 本地预览
  作者->>磁盘: draft: false
  作者->>Hugo: hugo
  Hugo-->>浏览器: 静态页 /posts/{年}/{slug}/
{{< /mermaid >}}

### 示例：带注释的请求时序

{{< mermaid >}}
sequenceDiagram
  participant C as Client
  participant S as Server
  participant DB as Database

  C->>+S: GET /posts/2019/xxx/
  Note right of S: 已是构建好的 HTML
  S-->>-C: 200 + 静态资源
  C->>+S: （可选）评论 API
  S->>+DB: query
  DB-->>-S: rows
  S-->>-C: JSON
{{< /mermaid >}}

常用时序语法备忘：

| 写法 | 含义 |
|------|------|
| `A->>B: 消息` | 实线请求 |
| `B-->>A: 回复` | 虚线响应 |
| `A->>+B` / `B-->>-A` | 激活 / 结束激活 |
| `Note right of A: …` | 注释 |
| `autonumber` | 自动编号 |
| `loop` / `alt` / `par` | 循环 / 分支 / 并行 |

更多图类型（流程图、类图等）见 [Mermaid 文档](https://mermaid.js.org/intro/)；本站 Congo 文档入口：[短代码 · mermaid](https://jpanther.github.io/congo/zh-hans/docs/shortcodes/)。

## 超文本标注

缺点：代码复杂；优点：多样性。

* 波浪线：<span style="text-decoration: wavy underline;color: red;">波浪线</span>，继续普通文本。
* 下划线：<u>下划线文字</u>
* 文字下的着重点：这是<span style="text-emphasis: dot; text-emphasis-position: under;">文字下方着重点</span>。


```
# 波浪线，字体红色
<span style="text-decoration: wavy underline; color: red;">波浪线</span>


# 文字下方着重点
<span style="text-emphasis: dot; text-emphasis-position: under;">文字下方着重点</span>
```


```
/* 语法：线型 + 样式 + 颜色 + 厚度 */
text-decoration: underline wavy red 2px;
            ↓         ↓       ↓    ↓
          "装饰"  "在哪里" "什么样" "什么色" "多粗"
```


## 其他配置

* [短代码总览](https://jpanther.github.io/congo/zh-hans/docs/shortcodes/)
* [数学符号示例](https://jpanther.github.io/congo/zh-hans/samples/mathematical-notation/)
* [图表与流程图示例](https://jpanther.github.io/congo/zh-hans/samples/diagrams-flowcharts/)
