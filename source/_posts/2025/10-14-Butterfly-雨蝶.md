---
title: Butterfly-雨蝶
noticeOutdate: false
categories: 问题修复
tags: 博客主题修复
description: butterfly主题问题修复的地方。_config.butterfly.yml都1k多代码行了，这也太长了...
cover: 'https://tu.zbhz.org/i/2025/10/15/x8ptab.png'
abbrlink: 15347
date: 2025-10-14 20:02:29
---

{% note warning modern %}
hexo v8 标签和分类有bug，这也就意味着相关生成文章统计图表插件部分功能用不了。
{% endnote %}

折腾完主题，发现博客翻页有些抖动，响应式也不能适配所有屏幕，这点反正大厂也不上心，我就更无所谓了。让我在意的点是点击翻页进入页面抖动的问题，网上找了些方法似乎并不适用，就用加载动画替代了。

{%link https://akilar.top/posts/abab51cf, 更新于2021-12-21 Add Blog Animation -- Wowjs%}


{% tabs %}
<!-- tab 问题修复-->
* 导航栏现在能根据页面类型正确显示博客标题或文章标题，避免了之前的重叠问题。
* 通过首页加载动画，修复了翻页时页面元素抖动的问题。
<!-- endtab -->

<!-- tab 新增效果/功能-->
* 首页增加加载动画
* 导航栏增加留言栏
<!-- endtab -->
{% endtabs %}

