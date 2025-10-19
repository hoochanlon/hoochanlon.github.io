---
title: butterfly主题测试页面
categories: 测试
tags: 博客测试
description: 主要测试AI、封面图、时钟、基本效果等
abbrlink: 442
date: 2025-10-07 18:39:58
cover: https://tu.zbhz.org/i/2025/10/15/x8ptab.png
---

<!-- https://rpgamer.com/wp-content/uploads/2022/08/persona-heroes-image.jpg -->
<!-- https://tu.zbhz.org/i/2025/10/09/114ak04.jpg -->

* 文章摘要：https://www.myzimu.com/post/978df16.html
  * AI摘要KEY：https://docs_s.tianli0.top/install.html
* 文章节选： https://butterfly.js.org/posts/4aa8abbe/?highlight=description
* 文章过期提醒设置：https://butterfly.js.org/posts/4aa8abbe/?highlight=%E6%8F%90%E9%86%92
* 动漫图片超分辨率：https://real-cugan.animesales.xyz/
* [tag页面图片生效位置](https://github.com/jerryc127/hexo-theme-butterfly/issues/1023)
* [分割线处理](https://luoyuy.top/posts/5c76ad4123cd/)
* [butterfly文档三主题配置](https://butterfly.js.org/posts/4aa8abbe/)
* [给butterfly添加侧边栏电子钟](https://blog.anheyu.com/posts/fc18.html)
* https://github.com/jerryc127/hexo-theme-butterfly/discussions/878
* 天气插件：https://weatherwidget.org/zh/
* 时间插件：https://time.is/zh/widgets
* 时间插件：https://clockzone.net/
* todo：https://github.com/ricocc/uiineed-todo-list
* 自定义插件：https://butterfly.js.org/posts/ea33ab97/#%E4%BE%8B%E5%AD%90
* Butterfly:为博客添加微软Clarity数据统计：https://blog.yvyang.fun/posts/48347/index.
* 信封留言板：https://qianxu.run/butterfly-custom/index.html


在文章 front-matter 修改 `updated: 2020-10-08 18:39:58`，加入 `noticeOutdate: false` 测试效果则不显示。


Next 当前不支持设置文章封面。butterfly的侧边时钟看着挺不错，但不能用了...显示的字太小了，看着有点费劲。

在 {% label \butterfly\layout\includes\widget\card_announcement.pug blue %}  注释掉小喇叭


```pug
//- i.fas.fa-bullhorn.fa-shake 抖动很烦人
i.fas.fa-bullhorn 
```

 在 {% label source\css\_layout\aside.styl blue %} 禁用头像旋转，social 图标旋转也是这样注释。

```styl
.avatar-img
  overflow: hidden
  margin: 0 auto
  width: 110px
  height: 110px
  border-radius: 70px

  img
    width: 100%
    height: 100%
    transition: filter 375ms ease-in .2s, transform .3s
    object-fit: cover
    // 禁止旋转
    // &:hover
    //   transform: rotate(360deg)
```

禁用设置旋转，在{% label layout\includes\rightside.pug blue %}，去掉`fa-spin`

```pug
  #rightside-config-show
    if needCogBtn
      button#rightside-config(type="button" title=_p("rightside.setting"))
        i.fas.fa-cog(class=theme.rightside_config_animation ? 'fa-spin' : '')
```

关闭分割线动画，在 {% label source\css\_global\function.styl blue %}，定位到 `.custom-hr`,注释掉如下代码

```styl
    &:hover
      &:before
        left: calc(95% - 20px)
```

 在 {% label source\css\_layout\footer.styl  blue %} 修改页脚颜色

```styl
  background-color: $light-blue
  background: #b7b7b5!important
```

添加天气组件 {% label hoochanlon.github.io\source\_data\widget.yml  blue %}

```
top:
  - class_name: user-weather
    name: 天气
    icon: fa-solid fa-sun-cloud
    order: 5
    html: |
     <div id="ww_62f74659400aa" v='1.3' loc='auto' a='{"t":"horizontal","lang":"zh","sl_lpl":1,"ids":[],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"image","cl_font":"#FFFFFF","cl_cloud":"#FFFFFF","cl_persp":"#81D4FA","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722"}'><a href="https://weatherwidget.org/zh/" id="ww_62f74659400aa_u" target="_blank">天气插件</a></div>
      <script async src="https://app3.weatherwidget.org/js/?id=ww_62f74659400aa"></script>
```