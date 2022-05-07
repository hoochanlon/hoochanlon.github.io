---
title: "Jekyll-NexT 微调"
date: 2021-11-24 21:41:38 +0800
author: hoochanlon
categories: [2021.,Blogging, Jekyll]
tags: [博客配置存档]
---

开始对Jekyll-NexT进行主题改动；主题样式及标签美化、添加文章结尾部分、分享评论等其他方面内容修改。 <!-- more -->

## 首页文章缩减行间距、文章结尾

### 缩减文章首页行间距

在 `_schemes/Mist/_posts-expanded.scss`文件中，修改post的margin-top默认值，初始设定为`.post { margin-top: 120px; }`，

### 添加文章结尾

在`/_includes/_macro/` 处新建post-end.html

```html
{% raw %}
<div>
    {% if page.passage_end %}
    <style>
    .passage_end::after{
        content: "- The End -";
        text-align:center;
        color: #252525;
        display: block;
        font-size:26px;
        font-weight:bold;
        font-family: Vladimir Script;
    }
    </style>
        <div class="passage_end"></div>
    {% endif %}
</div>
{% endraw %}
```
在post.html中定位到copyright代码处，加上此代码

```html
    <div>
      {% unless is_index %}
        {% include _macro/post-end.html %}
      {% endunless %}
    </div>
```

最后到_config.yml增加如下配置。

```
post_end:
  enable: true
```



## 分享与评论

### share

在_includes/post.html中添加如下代码；参考：https://github.com/overtrue/share.js。

```html
 <div class="social-share" style="text-align:center"></div>
    <!--  css & js -->
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/social-share.js/1.0.16/css/share.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/social-share.js/1.0.16/js/social-share.min.js"></script>
```

### gitalk

参考这两篇文章：[Gitment：一款基于 Github 的 Issues 实现的评论插件](https://linux.cn/article-9018-1.html)、[gitalk#install](https://github.com/gitalk/gitalk#install)，但我最终还是选择gitalk。

config.yml

```yaml
  gitalk:
    enable: true # 是否启用
    owner:  # 用户名
    repo: BlogComment # 存放评论的仓库名
    clientID: # Github Application 的 clientID
    clientSecret:  # Github Application 的 clientSecret
    admin: Jonzzs # 用户名
    distractionFreeMode: false # 评论时遮照效果的开关
```

settings -> OAuth application -> Register a new application，如下填写即可找到clentid与clent secret。

```
Application name：应用名称，随意
Homepage URL： 必须是博客的github仓库，如https://github.com/hoochanlon/hoochanlon.github.io
Application description：描述，随意
Authorization callback URL： 填写你主页地址
```

* https://www.freesion.com/article/5113194603/
* https://www.jianshu.com/p/b5f509f25872

自动创建issue的问题，参考：https://github.com/gitalk/gitalk/issues/440



## 花里胡哨

### 背景版图形调试

```yaml
# Canvas-nest
canvas_nest: false

# three_waves
three_waves: true

# canvas_lines
canvas_lines: false

# canvas_sphere
canvas_sphere: false

# Only fit scheme Pisces
# Canvas-ribbon
canvas_ribbon: false
```

### 标签美化

只需要修改模板`/_macro/post.html`，搜索 rel="tag">#，将 # 换成<i class="fa fa-tag"></i>

### 字数统计加竖条

post.html文件代码post-wordcount下方添加代码如下

```html
<div class="post-wordcount">
      &nbsp;&nbsp;|&nbsp;&nbsp;
```

### ⚠️dark mode

***目前该模式会使照片、视频的颜色反转，暂没想出合理的解决办法。***

打开 _scripts 文件夹内的vendors.html文件，在末尾添加以下代码

```js
<script src="https://cdn.jsdelivr.net/npm/darkmode-js@1.5.7/lib/darkmode-js.min.js"></script>
<script>
  function addDarkmodeWidget() {
    const options = {
      bottom: '64px', // default: '32px'
      right: '32px', // default: '32px'
      left: 'unset', // default: 'unset'
      time: '0.5s', // default: '0.3s'
      mixColor: '#fff', // default: '#fff'
      backgroundColor: '#fff',  // default: '#fff'
      buttonColorDark: '#100f2c',  // default: '#100f2c'
      buttonColorLight: '#fff', // default: '#fff'
      saveInCookies: false, // default: true,
      label: '🌓', // default: ''
      autoMatchOsTheme: true // default: true
    }
    const darkmode = new Darkmode(options);
    darkmode.showWidget();
  }
  window.addEventListener('load', addDarkmodeWidget);
</script>
```

在主题配置`_custom/custom.scss`，设置：

```css
// 应用生效调试参考：https://darkmodejs.learn.uno/#debug。
.darkmode-layer, .darkmode-toggle {z-index: 500;}
```

忽略暗黑模式对图像视频渲染。

```scss
// 过滤图像视频参考：https://gaojiajun.cn/2020/06/css-dark-mode/
html {
    filter: invert(100%) hue-rotate(180deg);
}
img,video {
    filter: invert(100%) hue-rotate(180deg);
}
```



