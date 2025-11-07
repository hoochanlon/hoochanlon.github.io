---
title: 永远永远
abbrlink: 57696
date: 2025-10-15 20:45:21
categories: 博客主题
tags:
- 博客效果调整与更新
description: 三分归元气，七分靠打拼，九十分靠投胎。
cover: https://hoochanlon.github.io/picx-images-hosting/uploads/2025/PixPin_2025-11-06_20-48-17.webp
---

更换了评论系统，由于加载动画确实不太好调整，所以单独写一篇关于加载动画的文章。更换博客主题太累了，所以很长时间我不会换主题，也懒得升级，光着一个帕金森一样的组件抖动的问题，我都想方设法解决、减缓、掩盖，调了一整天都未达预期...既然这么有精力折腾，那就重头再来，我想还是算了吧，已不复当年...

主题还有一个问题，不能加载一页整篇的文章，就像撕裂的一页纸，得拿胶水黏住你才能拼凑完整的一页，可能有些人看上去以为是特意的效果，但其实是我也不知道是魔改了那一部分弄出的bug。



### 加载动画第二版

v2：最小、最大时间；增加排除、包含项目；优化加载动画显示逻辑。

* exclude 模式：列表里的页面不显示动画，其余页面显示动画。
* include 模式：列表里的页面才显示动画，其余页面都跳过。
* HOME 标识词 表示 首页

```
preloader:
  enable: true
  source: 1
  mode: "exclude" # 可选 include 模式
  pages:
    - "HOME"      # 特殊标识词
    - "/about/"
    - "/tags/"
```

`\themes\butterfly\layout\includes\loading\fullpage-loading.pug` 

```
if theme.preloader && theme.preloader.enable
  #loading-box
    .loading-bg
      img.loading-img(
        class='nolazyload',
        src=loading_img ? url_for(loading_img) : "/img/avatar"
      )
      .loading-image-dot
  script.
    (function() {
      const mode = "!{theme.preloader.mode || 'exclude'}"; // 'exclude' 或 'include'
      const pages = !{JSON.stringify(theme.preloader.pages || [])};
      const path = window.location.pathname;

      // 判断当前页面是否需要显示加载动画
      let showLoading = true;
      if(mode === "exclude") {
        // 排除模式：列表里的页面不显示动画
        showLoading = !pages.some(p => p === "HOME" ? path === "/" : path.startsWith(p));
      } else if(mode === "include") {
        // 指定模式：只有列表里的页面显示动画
        showLoading = pages.some(p => p === "HOME" ? path === "/" : path.startsWith(p));
      }

      if(!showLoading){
        const box = document.getElementById("loading-box");
        if(box) box.classList.add("loaded");
        return;
      }

      const preloader = {
        show: () => {
          const box = document.getElementById("loading-box");
          if(box) box.classList.remove("loaded");
          document.body.style.overflow = '';
          preloader._startTime = Date.now(); // 记录开始时间
        },
        hide: () => {
          const box = document.getElementById("loading-box");
          const elapsed = Date.now() - (preloader._startTime || 0);
          const minDelay = 1000; // 最短显示 1 秒
          const maxDelay = 3000; // 最长显示 3 秒
          const remaining = Math.max(minDelay - elapsed, 0);
          setTimeout(() => {
            if(box) box.classList.add("loaded");
            document.body.style.overflow = 'auto';
            if(window.WOW) new WOW().init();
          }, Math.min(remaining + elapsed, maxDelay));
        }
      };

      // 页面一开始就显示动画（早开始）
      preloader.show();

      // 页面加载完成后隐藏动画
      window.addEventListener('load', () => preloader.hide());

      // PJAX 页面切换支持
      if(theme.pjax && theme.pjax.enable){
        document.addEventListener('pjax:send', () => {
          preloader.show();
        });
        document.addEventListener('pjax:complete', () => {
          preloader.hide();
        });
      }
    })();
```

### 加载动画第一版

`\themes\butterfly\layout\includes\loading\fullpage-loading.pug` 

```pug
#loading-box
  .loading-bg
    img.loading-img(
      src=theme.preloader.avatar ? url_for(theme.preloader.avatar) : "/img/avatar.png",
      class="nolazyload"
    )
    .loading-image-dot

script.
  (function() {
    const loadingBox = document.getElementById('loading-box');

    const showLoading = () => {
      if (loadingBox) loadingBox.classList.remove("loaded");
    };

    const hideLoading = () => {
      if (loadingBox) loadingBox.classList.add("loaded");
    };

    // 保证加载动画至少显示1秒
    window.onload = function() {
      showLoading();  // 显示加载动画

      // 延迟1秒后隐藏加载动画（确保至少1秒后才隐藏）
      setTimeout(hideLoading, 1000);
    };

    // PJAX 页面切换支持（可选）
    if (theme.pjax && theme.pjax.enable) {
      document.addEventListener('pjax:send', showLoading);
      document.addEventListener('pjax:complete', hideLoading);
    }
  })();
```

`\themes\butterfly\layout\includes\loading\index.pug`

```
//- index.pug
if theme.preloader && theme.preloader.enable
  if theme.preloader.source === 1
    include ./fullpage-loading.pug
  else if theme.preloader.source === 2
    include ./pace.pug
  else
    // 默认全屏动画 + Pace
    include ./fullpage-loading.pug
    include ./pace.pug
```


头像旋转 `\themes\butterfly\source\css\_layout\loading.styl`

```styl
#loading-box
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 1001
  overflow hidden

.loading-bg
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%
  background #4e9eff
  opacity 1
  transition opacity 0.3s ease-in-out  // 使用更平滑的动画过渡

.loading-img
  width 100px
  height 100px
  border-radius 50%
  border 4px solid #f0f0f2
  animation loadingAction 1s infinite alternate  // 增加动画时间，使效果更平滑
  background url(/img/avatar.png) no-repeat center center
  background-size cover

@keyframes loadingAction
  0%
    transform rotate(0deg)  // 开始旋转
  100%
    transform rotate(360deg)  // 旋转一圈

#loading-box.loaded
  pointer-events none
  .loading-bg
    opacity 0
    z-index -1000
```

`_config.butterfly.yml`

```yml
preloader:
  enable: true
  source: 1
  # pace theme (see https://codebyzach.github.io/pace/)
  pace_css_url:
```


`\themes\butterfly\layout\includes\loading\index.pug`

```pug
// 根据 source 决定加载内容
if theme.preloader && theme.preloader.enable
  if theme.preloader.source === 1
    include ./fullpage-loading.pug
  else if theme.preloader.source === 2
    include ./pace.pug
  else
    include ./fullpage-loading.pug
    include ./pace.pug
```


### Sytl 动画效果

`themes\butterfly\source\css\_layout\loading.styl`

```
#loading-box
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 1001
  overflow hidden

.loading-bg
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%
  background rgb(250, 251, 253)// ✅ 纯色背景，可改成任意颜色
  transition opacity 0.3s
  opacity 1
  z-index 1001

// 夜间模式支持（可选）
body.dark
  .loading-bg
    background #1a1a1a    // 夜间模式纯色背景，可根据需要修改

.loading-img
  width 100px
  height 100px
  border-radius 50%
  border 4px solid #f0f0f2
  animation loadingAction 0.6s infinite alternate
  background url(/img/avatar.png) no-repeat center center
  background-size cover

.loading-image-dot
  width 30px
  height 30px
  background #6bdf8f
  border-radius 50%
  border 6px solid #fff
  position absolute
  top 50%
  left 50%
  transform translate(18px, 24px)

#loading-box.loaded
  pointer-events none
  .loading-bg
    opacity 0
    z-index -1000

@keyframes loadingAction
  0%
    opacity 1
  100%
    opacity 0.4
```


参考文章：[一款基于Butterfly主题的loading动画](https://legacy.happylee.cn/2023/05/03/%E4%B8%80%E6%AC%BE%E5%9F%BA%E4%BA%8Ebutterfly%E4%B8%BB%E9%A2%98%E7%9A%84loading%E5%8A%A8%E7%94%BB/)