---
title: "Jekyll-NexT 微调"
date: 2021-11-29 21:41:38 +0800
author: hoochanlon
categories: [Blogging, Jekyll]
tags: [博客配置存档]
---

开始对Jekyll-NexT进行主题改动；主题样式及标签美化、添加文章结尾部分、分享评论等其他方面内容修改。 <!-- more -->

## 添加文章结尾

在`/_includes/_macro/` 处新建post-end.html

```html
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
