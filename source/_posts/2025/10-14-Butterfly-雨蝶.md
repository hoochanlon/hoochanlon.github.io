---
title: Butterfly-雨蝶
noticeOutdate: false
categories: 
- Butterfly-雨蝶
- Butterfly-沙漠寂寞
tags: 博客主题修复
description: butterfly主题问题修复的地方，临时置顶。_config.butterfly.yml都1k多代码行了，这也太长了...
cover: 'https://image.aibochinese.com/i/2025/10/13/fmak40.jpg'
abbrlink: 15347
date: 2025-10-14 20:02:29
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


{%link hoochanlon/hoochanlon.github.io,https://github.com/hoochanlon/hoochanlon.github.io,https://favicon.im/github.com %}


### 杂项

{% tabs %}
<!-- tab 壁纸 -->
* [pexels](https://www.pexels.com/zh-cn)（照片式）
* [wallspic](https://wallspic.com/)（以终端适配为主）
* [wallhaven.cc](https://wallhaven.cc/) （各类图片搜索）
<!-- endtab -->

<!-- tab awesome图标对应字符编码表 -->
* [font awesome图标对应字符编码表](https://www.cnblogs.com/ytkah/p/12605237.html)
* [Font Awesome 5.15.2 版本全部图标Unicode对照表大全](https://fa.uutool.cn/unicode/5.15.2/)
<!-- endtab -->

<!-- tab 标签外挂 -->
{% hideToggle 标签外挂语法参考 %}
* [Butterfly外挂标签用法学习](https://www.yooupi.site/posts/235523-d25a2ac1.html)
* [butterfly常用标签外挂](https://blog.pushihao.com/article/a2b56279.html)
{% endhideToggle %}
<!-- endtab -->

<!-- tab 参考链接 -->
{% hideToggle 参考链接 %}
* [Add Blog Animation -- Wowjs](https://akilar.top/posts/abab51cf)
* [信笺样式留言板](https://akilar.top/posts/e2d3c450/)
* [Hexo添加访客信息和地图](https://1477017264.github.io/posts/22511/)
* [Hexo 博客文章统计图](https://blog.eurkon.com/post/1213ef82.html)
* [使用Charts插件给Butterfly增加统计图表](https://blog.guole.fun/posts/18158/index.html)
* [Tag Plugins Plus](https://akilar.top/posts/615e2dec/)
* [butterfly 的魔改记录](https://qianxu.run/butterfly-custom/index.html)
* [【butterfly】分类磁贴插件版](https://ll.sc.cn/posts/ab72/)
* [butterfly主题魔改10：分类页面魔改](https://kukual.github.io/posts/a7bebfb0/index.html)
* [Butterffly 分类页和标签页隐藏侧栏](https://blog.eurkon.com/post/d498d8b1.html)
* [Butterfly导航栏美化](https://blog.june-pj.cn/posts/7bed0b4e/)
* [基于Artitalk的说说和清单功能](https://zhsher.cn/posts/33243/index.html)
{% endhideToggle %}
<!-- endtab -->

{% endtabs %}



### 更新

{% timeline 2025, blue %}
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











