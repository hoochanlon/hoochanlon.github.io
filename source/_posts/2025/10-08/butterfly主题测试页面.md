---
title: butterfly主题测试页面
categories: 测试
tags: 测试
description: 主要测试封面图、时钟、天气
abbrlink: 442
date: 2025-10-08 18:39:58
cover: https://h2.gifposter.com/bingImages/SwallowtailFlower_1920x1080.jpg
---

Next 当前不支持设置文章封面。butterfly的侧边时钟看着挺不错，但不能用了...显示的字太小了，看着有点费劲。

在 {% label \butterfly\layout\includes\widget blue %} 注释掉小喇叭


```
//- i.fas.fa-bullhorn.fa-shake 抖动很烦人
i.fas.fa-bullhorn 
```

 在 {% label source\css\_layout\aside.styl blue %} 禁用头像旋转，social 图标旋转也是这样注释。

```
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

```
  #rightside-config-show
    if needCogBtn
      button#rightside-config(type="button" title=_p("rightside.setting"))
        i.fas.fa-cog(class=theme.rightside_config_animation ? 'fa-spin' : '')
```


 在 {% label `source\css\_layout\footer.styl`  blue %} 修改页脚颜色

```
  background-color: $light-blue
  background: #b7b7b5!important
```


* [butterfly文档三主题配置](https://butterfly.js.org/posts/4aa8abbe/)
* [给butterfly添加侧边栏电子钟](https://blog.anheyu.com/posts/fc18.html)
* https://github.com/jerryc127/hexo-theme-butterfly/discussions/878


