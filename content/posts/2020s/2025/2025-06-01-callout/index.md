---
title: "Callout"
date: 2025-06-01T22:40:38+0800
draft: false
slug: "20250601224038"
categories: ["资源"]
tags: ["写作"]
featured: true
coverCaption: "Callout 分色提示与旁白示例"
summary: "用 emoji 与通用符号做旁白强调；整理 Congo alert 与站内 callout/fold/outdated；附本站 Hugo 新建日记的目录与命令。"
---
缘起：简单来说，我记不住这么多不同框架的主题、文档的旁白语法，所以尽可能用文字、符号来进行内容强调，因此也在琢磨替代旁白语法的方案。

## 支持 emoji 输入法适用的旁白

> 💡 **提示**：快速技巧或建议

> ⚠️ **注意**：可能遇到的问题

> ❗️ **重要**：必须遵守的规则

> 🚫 **严禁**：在生产环境直接运行！

> 🔥 **高危操作**：执行前请**务必备份**！

> ☠️ **危险**：此操作会导致**数据永久丢失**！

## Congo 自带：`alert` / `badge`

Congo 的 `alert` **只有一种主题色**，靠换图标区分语义，类别一多就不容易扫读；也**不能折叠**。

```md
{{</* alert "lightbulb" */>}}
**提示**：……
{{</* /alert */>}}
```

{{< alert "lightbulb" >}}
Congo 原版 `alert`：换了图标，底色仍是同一套 primary。
{{< /alert >}}

`badge` 适合行内短标签，不是段落警告：

{{< badge >}}
备忘
{{< /badge >}}

## 站内扩展：`callout`（GitHub Alerts 风格）

本站自建，**色系对齐 GitHub Alerts**：浅蓝 note / 绿 tip / 紫 important / 琥珀 warning / 红 caution。`fold="true"` 可收起长说明。

### 类型一览

| type | 中文别名 | 默认标题 | 色感（GitHub） |
|------|----------|----------|----------------|
| `note` | 注意 | 注意 | 蓝 |
| `tip` | 提示 | 提示 | 绿 |
| `important` | 重要 | 重要 | 紫 |
| `warning` | 警告 | 警告 | 琥珀 |
| `caution` | 小心 / 警示 | 小心 | 红 |
| `success` | 完成 / 成功 | 完成 | 翠绿（站内扩展） |

兼容别名（色类归一，标题/图标可不同）：

| 别名 | 归一到 | 默认标题 |
|------|--------|----------|
| `info` | `important` | 重要 |
| `forbid` | `caution` | 严禁 |
| `danger` | `caution` | 高危操作 |
| `critical` | `caution` | 危险 |

### 常驻提示（不折叠）

{{< callout type="note" >}}
补充说明、背景信息。
{{< /callout >}}

{{< callout type="tip" >}}
快速技巧或建议。
{{< /callout >}}

{{< callout type="important" >}}
必须遵守的关键信息。
{{< /callout >}}

{{< callout type="warning" >}}
可能遇到的问题与风险。
{{< /callout >}}

{{< callout type="caution" >}}
危险操作：执行前请确认后果。
{{< /callout >}}

{{< callout type="forbid" >}}
别名示例：色同 caution，默认标题为「严禁」。
{{< /callout >}}

**语法：**

```md
{{</* callout type="note" */>}}
……
{{</* /callout */>}}

{{</* callout type="tip" */>}}
……
{{</* /callout */>}}

{{</* callout type="important" */>}}
……
{{</* /callout */>}}

{{</* callout type="warning" */>}}
……
{{</* /callout */>}}

{{</* callout type="caution" */>}}
……
{{</* /callout */>}}
```

简写（**仅**写类型、不再混其它命名参数时）：

```md
{{</* callout tip */>}}……{{</* /callout */>}}
{{</* callout 注意 */>}}……{{</* /callout */>}}
{{</* callout 警告 */>}}……{{</* /callout */>}}
```

### 可折叠

长文案默认收起，点标题展开。标题默认用类型名，可用 `title` 覆盖。

{{< callout type="note" fold="true" >}}
展开后的注意事项：环境差异、依赖版本、边界条件等可以写长一点，不占首屏。
{{< /callout >}}

{{< callout type="warning" fold="true" >}}
警告类长说明，折叠后只露出琥珀「警告」条。
{{< /callout >}}

{{< callout type="caution" fold="true" open="true" >}}
高危且希望读者默认看到：加 `open="true"`。
{{< /callout >}}

{{< callout type="critical" fold="true" title="危险：数据不可恢复" >}}
`critical` 别名 + 自定义折叠标题；正文写清后果与回滚方式。
{{< /callout >}}

**语法：**

```md
{{</* callout type="note" fold="true" */>}}
展开后的注意事项……
{{</* /callout */>}}

{{</* callout type="warning" fold="true" */>}}
警告事项……
{{</* /callout */>}}

{{</* callout type="caution" fold="true" open="true" */>}}
默认展开的小心说明……
{{</* /callout */>}}

{{</* callout type="critical" fold="true" title="危险：数据不可恢复" */>}}
……
{{</* /callout */>}}
```

参数备忘：`type` / 中文别名、`fold`、`open`、`title`、`icon`。需要 `fold`/`open`/`title` 时，类型请写成 `type="note"`，**不要**写成位置参数再混命名参数（Hugo 限制）。

## 站内扩展：`fold` / `outdated`

### `fold`（通用折叠；可加 `type` 上色）

不指定类型时是中性灰；指定 `type` 后与 `callout` 同色。

{{< fold title="中性折叠" >}}
术语解释、剧透、附录等。
{{< /fold >}}

{{< fold title="带类型的折叠（警告色）" type="warning" >}}
等价于 `callout type="warning" fold="true"`，适合已经习惯 `fold` 名字时用。
{{< /fold >}}

```md
{{</* fold title="中性折叠" */>}}
……
{{</* /fold */>}}

{{</* fold title="带类型的折叠" type="warning" */>}}
……
{{</* /fold */>}}
```

### `outdated`（满 N 年过期提示）

填一个基准日；**满 1 年**（可用 `years` 改阈值）后自动显示，年数为**实际已满整年**：

> 该内容已超过 **X** 年，可能已过期，注意甄别

例如基准 `2025-06-01`：2026-07-20 显示「超过 **1** 年」；2027-07-20 显示「超过 **2** 年」。  
基准日支持 `2025-06-01` / `2025.6.1` / `2025/6/1`。不写日期则用本文 `date`。  
按**读者访问当天**刷新数字与显隐。

**本页演示**

{{< outdated from="2025-06-01" >}}
{{< /outdated >}}

{{< outdated from="2099-01-01" >}}
{{< /outdated >}}

上面第一条会显示「已超过 X 年…」；第二条（2099）当前应不可见。

**写法：**

````md
{{</* outdated from="2025-06-01" */>}}
{{</* /outdated */>}}

{{</* outdated "2025.6.1" */>}}
{{</* /outdated */>}}

{{</* outdated */>}}
{{</* /outdated */>}}

{{</* outdated from="2025-06-01" */>}}
技术栈已变更，请以仓库 README 为准。
{{</* /outdated */>}}

{{</* outdated from="2025-06-01" years="2" */>}}
{{</* /outdated */>}}
````

| 参数 | 说明 |
|------|------|
| `from` / 位置参数 | 基准日 |
| `years` | 满几年才**显示**，默认 `1`（与文案里的 X 无关；X 是实际年龄） |
| （正文） | 省略则用默认动态句；有正文则完全自定义 |

### 怎么选

| 需求 | 用什么 |
|------|--------|
| 跨主题笔记 | emoji 引用块 |
| 本站：GitHub 风格分色 | `callout type="note|tip|important|warning|caution"` |
| 本站：长文案可折叠 | `callout` + `fold="true"` |
| 本站：过期声明 | `outdated` |
| 主题自带、不在意同色 | Congo `alert` |

## 本站：用 Hugo 新建日记

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

### 推荐：`create.py`（标题 + 选形态）

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

| 用法 | 效果 |
|------|------|
| `python create.py 标题` | 交互选 1 / 2 |
| `python create.py --flat 标题` | 不询问，单文件 |
| `python create.py --bundle 标题` | 不询问，page bundle |
| `python create.py --date 2026-03-15 补记` | 指定写作日 |
| `python create.py` | 再问标题 |

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

{{< callout type="tip" fold="true" title="等价手写 / hugo new" >}}
不依赖脚本时，在仓库根目录：

```bash
hugo new content "posts/2020s/2026/07/2026-07-20-今日随笔.md"
hugo new content "posts/2020s/2026/07/2026-07-20-今日随笔/index.md"
```

缺月份目录时需自建，并给十年/年/月补 `build.render/list: never` 的 `_index.md`。  
2019 等旧文可在 `content/posts/2010s/2019/`（可不强求月层）。
{{< /callout >}}

{{< callout type="note" >}}
**封面**：仅 bundle 同目录放 `feature.png` / `feature.jpg`，front matter 可写 `feature`、`featureAlt`。  
英雄图统一 `static/hero-images/`，正文 `/hero-images/...`。
{{< /callout >}}

{{< callout type="warning" >}}
不要手写散落到 `posts/今日.md` 这类路径。  
`slug` 决定 URL 末段；改 `slug` 等于改永久链接。
{{< /callout >}}

### 一览

| 步骤 | 做什么 |
|------|--------|
| 新建 | `python create.py 标题` → 选单文件或 bundle |
| 落盘 | 自动 `content/posts/{十年}/{年}/{月}/YYYY-MM-DD-标题…` |
| 草稿 | 默认 `draft: true`；预览加 `-D` |
| 发布 | `draft: false` 后 `hugo` |
| 访问 | `/posts/{date 的年}/{slug}/` |

## 使用 HTML 标签进行旁白标注

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
