---
title: "Hugo + Congo 发文流程"
date: 2026-07-24T11:30:00+08:00
lastmod: 2026-07-24
draft: false
slug: "hugo-congo-publishing-workflow"
categories: ["写作"]
tags: ["内容生产"]
summary: "从新建文章到发布的最小工作流，以及常用 front matter 与封面规则。"
featureAlt: "本文封面示例"
coverCaption: "本文即示例：同目录 cover.jpg 自动作为文首封面"
---

这篇只回答一个问题：**怎样从 0 到 1 发出一篇文章**。

如果你要查正文语法或站点特调，不要继续在这一篇里翻：

- 正文能力见：[《Hugo 内容写法备忘》]({{< relref "/posts/2020s/2026/07/2026-07-24-Hugo-内容写法备忘/index.md" >}})
- 模板特调见：[《Congo 站点定制记录》]({{< relref "/posts/2020s/2026/07/2026-07-24-Congo-站点定制记录/index.md" >}})

## 新建文章

Hugo 不会「猜」你今天该放哪：你给出**内容路径**，它用 `archetypes/default.md` 生成 front matter，再按 `config` 里的 permalink 出站。本站磁盘目录与对外 URL **解耦**。

### 目录约定

```text
content/posts/
  {十年桶}/
    {年}/
      {月}/
        YYYY-MM-DD-标题/index.md   # 推荐：page bundle
        # 或 YYYY-MM-DD-标题.md    # 单文件亦可
```

| 层 | 作用 | 是否进对外 URL |
|----|------|----------------|
| `2010s` / `2020s` | 十年整理桶 | 否 |
| `2026` | 年 | 否，URL 年份来自 front matter `date` |
| `07` | 月 | 否，只用于本地整理 |
| 文章目录或 `.md` | 正文 | 路径不进 URL；`slug` 进 URL |

十年 / 年 / 月 的 `_index.md` 一律：

```yaml
build:
  render: never
  list: never
```

对外固定规则：

```text
/posts/:year/:slug/
```

### 推荐：`create.py`

仓库根目录执行；按 **Asia/Shanghai 当天** 拼路径、补 `_index.md`、写草稿 front matter。

```bash
python create.py 今日随笔
```

会先问形态：

```text
1) 单文件  2026-07-20-今日随笔.md
2) bundle  2026-07-20-今日随笔/index.md
```

后续流程：

```bash
hugo server -D    # draft: true 需 -D
# 定稿后改成 draft: false
hugo
```

不依赖脚本时，也可以直接：

```bash
hugo new content "posts/2020s/2026/07/2026-07-20-今日随笔.md"
hugo new content "posts/2020s/2026/07/2026-07-20-今日随笔/index.md"
```

## 常用 front matter

`archetypes/default.md` 当前实际生成的是：

```yaml
title: "（由文件名推导，可改）"
date: （创建时刻）
draft: true
slug: "20060102150405"
categories: ["随笔"]
tags: []
summary: ""
featured: false
# weight: 1
```

普通文章最常用的字段只有这些：

| 参数 | 类型 | 作用 |
|------|------|------|
| `title` | string | 文章标题 |
| `date` | datetime | 发布时间；URL 年份、归档都看它 |
| `draft` | bool | 草稿开关 |
| `slug` | string | URL 末段 |
| `categories` | array | 分类 |
| `tags` | array | 标签 |
| `summary` | string | 列表摘要 |
| `featured` | bool | 是否进入首页精选 |

推荐最小集：

```yaml
title: "今日随笔"
date: 2026-07-20T12:42:00+08:00
draft: true
slug: "20260720124200"
categories: ["随笔"]
tags: []
summary: ""
featured: false
```

{{< callout type="tip" >}}
页面显示开关、SEO 跳转、标题样式等进阶字段，统一放到[《Congo 站点定制记录》]({{< relref "/posts/2020s/2026/07/2026-07-24-Congo-站点定制记录/index.md" >}})里维护。
{{< /callout >}}

## 封面图

Congo 的封面来自 **页面资源（page resources）**。图必须和这篇 `index.md` 放在**同一个目录**。

```text
文章目录
  ├─ index.md
  ├─ feature.jpg   -> 列表缩略图 + 文首封面（优先）
  ├─ cover.jpg     -> 仅文首封面
  └─ thumb.jpg     -> 仅列表缩略图
```

只要一张图时，直接命名为 `feature.jpg` / `feature.png` 即可。

对应的可选说明文字：

```yaml
featureAlt: "封面图替代文本"
coverCaption: "封面图说明"
```

## 站内文章链接

站内文章不要手写最终 URL，优先用 `relref`：

```md
使用方式见：[《Hugo 内容写法备忘》]({{</* relref "/posts/2020s/2026/07/2026-07-24-Hugo-内容写法备忘/index.md" */>}})
```

这样以后你改 `slug` 或 permalink 规则时，链接仍能跟着走。

## 发文时的两套心智模型

```text
普通文章（无封面）
  -> title / date / draft / slug / categories / tags / summary

带封面或想进精选
  -> 上面那套
  -> + feature.jpg（放同目录）
  -> + featureAlt / coverCaption
  -> + featured / weight
```

## 延伸阅读

- 正文写法：[《Hugo 内容写法备忘》]({{< relref "/posts/2020s/2026/07/2026-07-24-Hugo-内容写法备忘/index.md" >}})
- 模板特调：[《Congo 站点定制记录》]({{< relref "/posts/2020s/2026/07/2026-07-24-Congo-站点定制记录/index.md" >}})
