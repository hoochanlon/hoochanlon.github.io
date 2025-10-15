---
title: Butterfly-雨蝶
noticeOutdate: false
categories: 问题修复
tags: 博客主题修复
description: butterfly主题问题修复的地方。_config.butterfly.yml都1k多代码行了，这也太长了...
cover: 'https://tu.zbhz.org/i/2025/10/15/x8ptab.png'
abbrlink: 15347
date: 2025-10-14 20:02:29
sticky: 100
---


{% note warning %}
hexo v8 标签和分类有bug，这也就意味着相关生成文章统计图表插件部分功能用不了。
{% endnote %}


{% tabs %}
<!-- tab 问题修复-->
* 导航栏现在能根据页面类型正确显示博客标题或文章标题，避免了之前的重叠问题
* 通过首页加载动画，修复了翻页时页面元素抖动的问题
* 修复gulp.js语法错误，正常执行自动化操作
* 优化响应式布局，修复 iPad Pro 设备下导航栏错位问题
* 脚本存放路径优化，改进调用方式
<!-- endtab -->

<!-- tab 新增效果/功能-->
* 首页增加加载动画
* 导航栏增加留言栏
<!-- endtab -->

<!-- tab 参考链接-->
* [Add Blog Animation -- Wowjs](https://akilar.top/posts/abab51cf)
* [信笺样式留言板](https://akilar.top/posts/e2d3c450/)
* [个性定位信息](https://meuicat.com/posts/af19e490.html)
<!-- endtab -->


{% endtabs %}



{% hideToggle 标签外挂语法参考 %}
* [Butterfly外挂标签用法学习](https://www.yooupi.site/posts/235523-d25a2ac1.html)
* [butterfly常用标签外挂](https://blog.pushihao.com/article/a2b56279.html)
{% endhideToggle %}