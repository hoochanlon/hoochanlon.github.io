---
title: "扩展 Congo Callout 语法"
date: 2025-06-01T22:40:38+0800
lastmod: 2026-07-20
draft: false
slug: "20250601224038"
categories: ["写作"]
tags: ["排版","标注"]
featured: true
coverCaption: "Callout 分色提示与旁白示例"
summary: "整理 Congo alert 与站内 callout/fold/outdated 语法。"
featuredWeight: 3
---


## 扩展`callout`（GitHub 风格）

Congo 的 `alert` **只有一种主题色**，靠换图标区分语义，类别一多就不容易扫读；也**不能折叠**。

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

