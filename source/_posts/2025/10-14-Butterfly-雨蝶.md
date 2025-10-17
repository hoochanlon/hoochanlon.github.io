---
title: Butterfly-雨蝶
noticeOutdate: false
categories: 
- 问题修复
- Butterfly-沙漠寂寞
tags: 博客主题修复
description: butterfly主题问题修复的地方，临时置顶。_config.butterfly.yml都1k多代码行了，这也太长了...
cover: 'https://tu.zbhz.org/i/2025/10/15/x8ptab.png'
abbrlink: 15347
date: 2025-10-14 20:02:29
sticky: 100
---

### 注意事项

{% note danger %}
由于 Hexo v8 在标签和分类的显示上存在 bug，导致只能通过部署后的线上页面来验证实际效果。而我使用了 GitHub Actions 进行自动化部署，流程中的 npm install 会重新拉取依赖，无法保留我本地对插件源代码的修改。加之我对相关插件进行了定制化修改，因此一度误以为这些改动未能成功应用，因为部署后的页面始终没有发生变化。
{% endnote %}

{% note warning %}
* hexo v8 标签和分类有bug，这也就意味着相关生成文章统计图表插件部分功能用不了
* 因流量负载过大音乐播放器由Splayer更换为安知鱼音乐页面
{% endnote %}

{% note primary flat %}
edge安装了广告插件会影响到公告侧边栏的JS加载
{% endnote %}

### 访问Repo

{%link hoochanlon/hoochanlon.github.io,https://github.com/hoochanlon/hoochanlon.github.io,https://favicon.im/github.com %}

### 更新&调整说明 


{% tabs %}
<!-- tab 问题修复 -->
* 导航栏现在能根据页面类型正确显示博客标题或文章标题，避免了之前的重叠问题
* 通过首页加载动画，修复了翻页时页面元素抖动的问题
* 优化响应式布局，修复 iPad Pro 设备下导航栏错位问题
* 优化定位频繁获取地址位置
* 建立独立备份目录以及编写相关说明
<!-- endtab -->

<!-- tab 新增&调整 -->
* 首页增加加载动画
* 导航栏增加留言栏
* 调整文章目录显示位置
* 标签外挂增强
* 卡片分类布局
* <s>文章标题信息居中</s>
<!-- endtab -->


<!-- tab 参考链接-->
* [Add Blog Animation -- Wowjs](https://akilar.top/posts/abab51cf)
* [信笺样式留言板](https://akilar.top/posts/e2d3c450/)
* [Hexo添加访客信息和地图](https://1477017264.github.io/posts/22511/)
* [Hexo 博客文章统计图](https://blog.eurkon.com/post/1213ef82.html)
* [Tag Plugins Plus](https://akilar.top/posts/615e2dec/)
* [butterfly 的魔改记录](https://qianxu.run/butterfly-custom/index.html)
* [【butterfly】分类磁贴插件版](https://ll.sc.cn/posts/ab72/)
* [butterfly主题魔改10：分类页面魔改](https://kukual.github.io/posts/a7bebfb0/index.html)
* [Butterffly 分类页和标签页隐藏侧栏](https://blog.eurkon.com/post/d498d8b1.html)
* [Butterfly导航栏美化](https://blog.june-pj.cn/posts/7bed0b4e/)
<!-- endtab -->

{% endtabs %}


### 卡片壁纸、图标参考网站

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
{% endtabs %}

### 编辑文章所参考的语法选项

{% hideToggle 标签外挂语法参考 %}
* [Butterfly外挂标签用法学习](https://www.yooupi.site/posts/235523-d25a2ac1.html)
* [butterfly常用标签外挂](https://blog.pushihao.com/article/a2b56279.html)
{% endhideToggle %}

---


### 调试内容区

调试完内容，部署后，空空如也。

<!-- 文章发布时间统计图 -->
<div id="posts-chart" data-start="2021-01" style="border-radius: 8px; height: 300px; padding: 10px;"></div>
<!-- 文章标签统计图 -->
<div id="tags-chart" data-length="10" style="border-radius: 8px; height: 300px; padding: 10px;"></div>
<!-- 文章分类统计图 -->
<div id="categories-chart" data-parent="true" style="border-radius: 8px; height: 300px; padding: 10px;"></div>


{% timeline 2025, green %}

<!-- timeline 10 -->
* 完成分类页卡片适配
* 标签、分类、归档页隐藏侧边栏
<!-- endtimeline -->

{% endtimeline %}
