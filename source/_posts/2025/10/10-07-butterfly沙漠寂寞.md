---
title: Butterfly-沙漠寂寞
categories: 博客主题
tags: 博客效果代码
description: 代码展示
abbrlink: 442
date: 2025-10-07 18:39:58
cover: https://tu.zbhz.org/i/2025/10/15/x8ptab.png
# sticky: 99
---


### 由点击微信图标展开二维码图片

自定义js

```JS
(function () {
  const container = document.querySelector('.card-info-social-icons');
  if (!container) return;

  const links = container.querySelectorAll('a');
  const insertIndex = 1; // 插入到第二个位置

  // 创建微信图标按钮
  const wechatBtn = document.createElement('a');
  wechatBtn.className = 'social-icon wechat-icon';
  wechatBtn.title = '微信';
  wechatBtn.href = 'javascript:void(0);';
  wechatBtn.innerHTML = '<i class="fab fa-weixin" style="color: #1AAD19;"></i>';
  wechatBtn.style.position = 'relative';

  // 创建弹窗元素（插入到 body，避免 overflow 限制）
  const qrPopup = document.createElement('div');
  qrPopup.className = 'wechat-qr-popup';
  qrPopup.style.cssText = `
    position: fixed;
    padding: 10px;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(6px);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: none;
    z-index: 9999;
    transition: opacity 0.2s ease, transform 0.2s ease;
  `;
  qrPopup.innerHTML = '<img src="/img/qr.png" alt="微信二维码" style="width:120px;height:120px;">';
  document.body.appendChild(qrPopup);

  // 插入微信图标到指定位置
  if (links.length > insertIndex) {
    container.insertBefore(wechatBtn, links[insertIndex]);
  } else {
    container.appendChild(wechatBtn);
  }

  // 状态标记：是否显示弹窗
  let isVisible = false;

  // 点击图标切换弹窗显示/隐藏
  wechatBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const rect = wechatBtn.getBoundingClientRect();
    if (!isVisible) {
      qrPopup.style.left = `${rect.left + rect.width / 2}px`;
      qrPopup.style.top = `${rect.bottom + 8}px`;
      qrPopup.style.transform = 'translateX(-50%)';
      qrPopup.style.opacity = '1';
      qrPopup.style.display = 'block';
      isVisible = true;
    } else {
      qrPopup.style.display = 'none';
      qrPopup.style.opacity = '0';
      isVisible = false;
    }
  });

  // 点击空白处关闭弹窗
  document.addEventListener('click', function () {
    qrPopup.style.display = 'none';
    qrPopup.style.opacity = '0';
    isVisible = false;
  });

  // 阻止点击弹窗时关闭
  qrPopup.addEventListener('click', function (e) {
    e.stopPropagation();
  });
})();
```

在主题配置文件插入该js

```yml
inject:
  bottom:
```

### 随机选图

从自己站点中随机选的图片

```yml
inject:
  head:
  bottom:
    - <script> let backimg =["url(/images/draw.JPG)","url(/images/life.jpg)","url(/images/idea.jpg)","url(/images/study.jpg)"];let index = Math.ceil(Math.random() * (backimg.length-1)) - 1;document.getElementById("web_bg").style.backgroundImage = backimg[index]</script>
```

从bing中随机选的图片

```js
const minPage = 300;
const maxPage = 350;
const limit = 10;
const targetId = "web_bg";

// 每天生成稳定页码（只在 300–350 范围内）
const today = new Date();
const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
const page = (daySeed % (maxPage - minPage + 1)) + minPage;

// 请求 Bing 图片 API
fetch(`https://api.bimg.cc/all?page=${page}&order=asc&limit=${limit}&w=1920&h=1080&mkt=zh-CN`)
  .then(response => response.json())
  .then(data => {
    const images = Array.isArray(data.data) ? data.data : [];
    if (!images.length) throw new Error("图片列表为空");

    const randomIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[randomIndex].url;

    const img = new Image();
    img.onload = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.style.backgroundImage = `url(${imageUrl})`;
        target.style.backgroundSize = "cover";
        target.style.backgroundPosition = "center";
      }
    };
    img.onerror = () => {
      console.warn("图片加载失败，使用备用图");
      const fallback = "/img/fallback.jpg";
      const target = document.getElementById(targetId);
      if (target) {
        target.style.backgroundImage = `url(${fallback})`;
        target.style.backgroundSize = "cover";
        target.style.backgroundPosition = "center";
      }
    };
    img.src = imageUrl;
  })
  .catch(error => {
    console.error("获取 Bing 图片失败：", error);
  });

```


### 小图标

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

### 重定向

发现手机重定向加载太慢，还是写一个重定向页面。在source加入nav文件夹加入index.html重定向页面。默认情况下，Hexo也会将这部分进行处理，导致这些页面渲染上了博客主题。这个时候就需要忽略掉该文件 _config.yml

```
# 指定不进行渲染的文件或文件夹
skip_render:
- 'nav/*'
```

重定向 HTML 1

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@4.5.12/index.min.css">
  <title>正在跳转...</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: 'Segoe UI', sans-serif;
      color: #333;
    }
    body:lang(zh-CN) {
    font-family: 'LXGW WenKai Screen', sans-serif;
    }

    body:lang(en) {
    font-family: 'JetBrains Mono', monospace;
    }
    .loader {
      border: 6px solid #f3f3f3;
      border-top: 6px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .message {
      font-size: 1.2rem;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="loader"></div>
  <div class="message">正在跳转，请稍候...</div>

  <script>
    // 设置跳转目标和延迟时间（毫秒）
    const targetURL = "https://nav-lfuv.vercel.app/";
    const delay = 2000;

    setTimeout(() => {
      window.location.href = targetURL;
    }, delay);
  </script>
</body>
</html>
```

重定向 HTML 2

```HTML
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>正在跳转...</title>

  <!-- 字体引入 -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@4.5.12/index.min.css">

  <style>
    body {
      margin: 0;
      padding: 0;
      background: url('/img/caffe.png') no-repeat center center;
      background-size: cover;
      font-family: 'LXGW WenKai Screen', sans-serif;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 16px;
      padding: 40px;
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      text-align: center;
      max-width: 90%;
    }

    .loader {
      border: 6px solid #f3f3f3;
      border-top: 6px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }


    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .message {
      font-size: 1.2rem;
      margin-bottom: 10px;
    }

    .fallback {
      margin-top: 20px;
      font-size: 0.97rem;
      font-weight: 500;
      color: #222;
      line-height: 1.6;
    }

    .fallback a {
      font-weight: 600;
      color: #007acc;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="glass-card">
    <div class="loader"></div>

    <div class="message">正在跳转，请稍候...</div>
    <div class="fallback">
      如果未能自动跳转，请&nbsp;<a href="nav-hoo.vercel.app" target="_blank" rel="noopener">点击此处&nbsp;</a>访问。
    </div>
  </div>

  <script>
    const targetURL = "https://nav-hoo.vercel.app";
    const delay = 500;
    setTimeout(() => {
      window.location.href = targetURL;
    }, delay);
  </script>
</body>
</html>
```

### 博客音乐

非全局的单个文章配置音乐盒吸底：文章页 `aplayer: true` 开启后，直接在文章复制粘贴这段div

```
<div class="aplayer no-destroy" data-id="9593638671" data-server="tencent" data-type="playlist" data-fixed="true" data-autoplay="true"> </div>
```

在文章页上音乐盒

```
{% meting "14405552446" "netease" "playlist" "mutex:true" "listmaxheight:300px" "preload:auto" "theme:#ad7a86" %}
```


### 加载动画


`\themes\butterfly\layout\includes\loading\fullpage-loading.pug`

这个相对适合我，因为页面侧边栏元素抖动的问题，我没解决所以用加载动画过渡一下

```
- loading_img = theme.preloader.avatar

if theme.preloader && theme.preloader.enable
  #loading-box
    .loading-bg
      img.loading-img(class='nolazyload' src=loading_img ? url_for(loading_img) : "/img/avatar")
      .loading-image-dot
      #loading-percentage 0%
  script.
    (function() {
      const excludePages = !{JSON.stringify(theme.preloader.exclude || [])};
      const path = window.location.pathname;

      // 判断是否在排除列表中
      const isExcluded = excludePages.some(p => {
        if(p === "HOME") return path === "/"; // 首页特殊标识
        return path.startsWith(p);            // 其他页面按前缀匹配
      });

      if(isExcluded){
        const box = document.getElementById("loading-box");
        if(box) box.classList.add("loaded");
        return;
      }

      const loadingPercentage = document.getElementById("loading-percentage");
      let progress = 0;
      let timer = setInterval(() => {
        progress += Math.random() * (progress < 70 ? 5 : 1);
        if(progress >= 99) progress = 99;
        loadingPercentage.textContent = Math.floor(progress) + "%";
      }, 100);

      const preloader = {
        endLoading: () => {
          clearInterval(timer);
          loadingPercentage.textContent = "100%";
          const box = document.getElementById("loading-box");
          if(box){
            box.classList.add("loaded");
            document.body.style.overflow = 'auto';
          }
          if(window.WOW) new WOW().init();
        },
        initLoading: () => {
          const box = document.getElementById("loading-box");
          if(box) box.classList.remove("loaded");
          document.body.style.overflow = '';
        }
      };

      window.addEventListener('load', () => preloader.endLoading());

      if(theme.pjax && theme.pjax.enable){
        document.addEventListener('pjax:send', () => preloader.initLoading());
        document.addEventListener('pjax:complete', () => preloader.endLoading());
      }
    })();
```

`\themes\butterfly\source\css\_layout\loading.styl`

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
  transition opacity 0.3s
  opacity 1

.loading-img
  width 100px
  height 100px
  border-radius 50%
  border 4px solid #f0f0f2
  animation loadingAction 0.6s infinite alternate
  background url(/img/avatar.png) no-repeat center center
  background-size cover        // ✅ 确保头像完整显示

.loading-image-dot
  width 30px                    // ✅ 保持原始大小
  height 30px
  background #6bdf8f
  border-radius 50%
  border 6px solid #fff
  position absolute
  top 50%
  left 50%
  transform translate(18px, 24px)   // ✅ 保持在线状态点原位

#loading-percentage
  position absolute
  top 58%                       // ✅ 百分比靠近头像
  left 50%
  transform translateX(-50%)
  font-weight bold
  &::before
    content "「"
    margin-right 10px
  &::after
    content "」"
    margin-left 10px

#loading-box.loaded
  pointer-events none           // ✅ 不阻挡点击
  .loading-bg
    opacity 0
    z-index -1000

@keyframes loadingAction
  0%
    opacity 1
  100%
    opacity 0.4
```


### 加载动画优化版

之前逻辑是完全阻塞的：#loading-box 一出现就覆盖整个页面，百分比动画跑到 99% 前都不消失，即使首页内容已经可以交互，也被挡住。我们要改成非阻塞式加载动画，让页面可用时动画先消失，同时保留百分比动画和 PJAX 支持。

`\themes\butterfly\layout\includes\loading\fullpage-loading.pug`

```
- loading_img = theme.preloader.avatar

if theme.preloader && theme.preloader.enable
  #loading-box
    .loading-bg
      img.loading-img(class='nolazyload' src=loading_img ? url_for(loading_img) : "/img/avatar")
      .loading-image-dot
      #loading-percentage 0%
  script.
    (function() {
      const excludePages = !{JSON.stringify(theme.preloader.exclude || [])};
      const path = window.location.pathname;

      const isExcluded = excludePages.some(p => {
        if(p === "HOME") return path === "/";
        return path.startsWith(p);
      });

      const loadingBox = document.getElementById("loading-box");
      const loadingPercentage = document.getElementById("loading-percentage");

      if(isExcluded){
        if(loadingBox) loadingBox.classList.add("loaded");
        return;
      }

      let progress = 0;
      let timer = setInterval(() => {
        progress += Math.random() * (progress < 70 ? 5 : 1);
        if(progress >= 99) progress = 99;
        if(loadingPercentage) loadingPercentage.textContent = Math.floor(progress) + "%";
      }, 100);

      const preloader = {
        endLoading: () => {
          clearInterval(timer);
          if(loadingPercentage) loadingPercentage.textContent = "100%";
          if(loadingBox) {
            loadingBox.classList.add("loaded");
            loadingBox.style.pointerEvents = "none"; // ✅ 不阻塞点击
            document.body.style.overflow = 'auto';
          }
          if(window.WOW) new WOW().init();
        },
        initLoading: () => {
          if(loadingBox){
            loadingBox.classList.remove("loaded");
            loadingBox.style.pointerEvents = "auto";
          }
          document.body.style.overflow = '';
        }
      };

      // 页面可交互就结束动画
      if(document.readyState === "interactive" || document.readyState === "complete"){
        preloader.endLoading();
      }

      // DOMContentLoaded 时也结束动画
      document.addEventListener('DOMContentLoaded', preloader.endLoading);

      if(theme.pjax && theme.pjax.enable){
        document.addEventListener('pjax:send', preloader.initLoading);
        document.addEventListener('pjax:complete', preloader.endLoading);
      }
    })();
```


### 杂项

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


