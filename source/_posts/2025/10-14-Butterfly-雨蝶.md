---
title: Butterfly-雨蝶
noticeOutdate: false
categories: 博客主题
tags: 博客效果调整与更新
description: butterfly主题问题修复的地方，临时置顶。_config.butterfly.yml都1k多代码行了，这也太长了...
cover: 'https://image.aibochinese.com/i/2025/10/13/fmak40.jpg'
abbrlink: 15347
date: 2025-10-14 20:02:29
# password: 123456
# sticky: 100
---

### 注意

{% note danger %}
由于 Hexo v8 在标签和分类的显示上存在 bug，导致只能通过部署后的线上页面来验证实际效果。而我使用了 GitHub Actions 进行自动化部署，流程中的 npm install 会重新拉取依赖，无法保留我本地对插件源代码的修改。加之我对相关插件进行了定制化修改，因此一度误以为这些改动未能成功应用，因为部署后的页面始终没有发生变化。

**hexo v8优先使用7.2版本**

```shell
npm uninstall hexo
npm install hexo@7.2
```
{% endnote %}

{% note primary flat %}
edge安装了广告插件会影响到公告侧边栏的JS加载
{% endnote %}

`{% link 链接,标题,图标,介绍 %}`

{%link https://ai.zhheo.com/console/login, AI摘要登录页 postai, https://favicon.im//ai.zhheo.com %}

{%link hoochanlon/hoochanlon.github.io,https://github.com/hoochanlon/hoochanlon.github.io,https://favicon.im/github.com %}


### 更新

{% timeline 2025, blue %}
<!-- timeline 10.21 -->
* 新增懒加载动画
* 电子时钟插件移除index排序，改成根据类名插入式排序
<!-- endtimeline -->
<!-- timeline 10.20 -->
* 重制电子时钟插件
<!-- endtimeline -->
<!-- timeline 10.20 -->
* 整理博客链接，删除不必要的测试文章，增加部分关键代码说明。
<!-- endtimeline -->
<!-- timeline 10.19 -->
* 添加说说功能
* 提出需求issue：https://github.com/jerryc127/hexo-theme-butterfly/issues/1748
<!-- endtimeline -->
<!-- timeline 10.18 -->
* 完成 hexo-butterfly-category-card 插件修复：[hexo-butterfly-category-card-fork](https://github.com/hoochanlon/hexo-butterfly-category-card-fork)
<!-- endtimeline -->
<!-- timeline 10.15 -->
* 建立独立备份目录以及编写相关说明
* 优化访客地图定位频繁获取地址位置
<!-- endtimeline -->
<!-- timeline 10.16 -->
* 因流量负载过大音乐播放器由Splayer更换为安知鱼音乐页面
<!-- endtimeline -->
<!-- timeline 10.13 -->
* 优化响应式布局，修复 iPad Pro 设备下导航栏错位问题
<!-- endtimeline -->
<!-- timeline 10.11 -->
* 导航栏增加留言栏
* 标签外挂增强
<!-- endtimeline -->
<!-- timeline 10.10 -->
* 通过首页加载动画，修复了翻页时页面元素抖动的问题
<!-- endtimeline -->
<!-- timeline 10.9 -->
* 自定义加载动画易出现与主题配置文件冲突导致无法关闭加载动画功能的情况，故取消
<!-- endtimeline -->
<!-- timeline 10.8 -->
* 导航栏现在能根据页面类型正确显示博客标题或文章标题，避免了之前的重叠问题
* 导航菜单居中显示
<!-- endtimeline -->
{% endtimeline %}











