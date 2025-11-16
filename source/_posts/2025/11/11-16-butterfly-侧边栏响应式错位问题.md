---
title: butterfly-由侧边栏错位问题，从gh-pages转向到netlify部署
noticeOutdate: false
categories: 博客主题
tags: 博客效果调整与更新
description: 侧边栏错位问题。
abbrlink: 6082
date: 2025-11-16 23:14:05
cover: https://hoochanlon.github.io/picx-images-hosting/special/Netlify.webp
---

### 最初的起点

一开始打开手机浏览器查看我的网页连接速度，果然被墙挡了。然后发现侧边栏错位了。

初步排错过程：

1. 在本地用仿真正常，gh-pages自动化部署侧边样式异常。
2. 关闭 gulp、algolia等插件，清缓存，去淘宝源等等，gh-pages自动化部署侧边栏样式依旧异常。
3. 在本地用仿真正常，去掉自动化部署，用真机样式正常。

`hexo clean && hexo g && hexo a && gulp && hexo d`

![](https://hoochanlon.github.io/picx-images-hosting/uploads/2025/PixPin_2025-11-16_23-28-46.webp)

试用了朋友、chatgpt推荐的netlify部署静态博客，样式正常。

![](https://hoochanlon.github.io/picx-images-hosting/uploads/2025/PixPin_2025-11-17_01-13-18.webp)

### netlify 绑定域名


netlify部署参考：

* https://io-oi.me/tech/deploy-static-site-to-netlify
* https://www.wevg.org/archives/hexo-with-netlify-cms