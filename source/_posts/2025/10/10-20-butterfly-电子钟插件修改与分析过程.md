---
title: butterfly-电子钟插件修改与分析过程
noticeOutdate: false
abbrlink: 59603
date: 2025-10-20 19:19:48
categories: [博客主题]
tags: [博客效果代码]
description: 对hexo-butterfly-clock进行重制，这是继hexo-butterfly-category-card又一次开发主题插件了。
cover: https://hoochanlon.github.io/picx-images-hosting/uploads/2025/PixPin_2025-11-09_00-45-15.webp
---

### repo

`{% link 链接,标题,图标,介绍 %}`

{%link https://github.com/hoochanlon/hexo-butterfly-clock-remake,hexo-butterfly-clock-remake,https://favicon.im/github.com%}

效果

![ ](https://cdn.jsdelivr.net/gh/hoochanlon/tuchuang@main//up/20251022020145924.png)

### IP定位API

靠经纬度的定位是最准的，IP的定位并不准。但选对IP定位API很关键：

* https://github.com/ihmily/ip-info-api#address-1.3

### 和风天气获取天气过程

定位你的城市（该API不支持跨域）

```
https://api.live.bilibili.com/xlive/web-room/v1/index/getIpInfo
```

通过定位拿到你的城市，获取 location id：101250501

```
https://pp6tupe4xx.re.qweatherapi.com/geo/v2/city/lookup?location={你的城市，例如：深圳}&key={你的key}
```

通过 location id 获取到天气信息

```
https://pp6tupe4xx.re.qweatherapi.com/v7/weather/now?location=101250501&key={你的key}
```

### 温馨提示

{% note green %}
tips：
* `https://pp6tupe4xx.re.qweatherapi.com`是我的和风天气 api host
* API使用方式： api host + 功能路径 + key
* 中国常见城市相关 location id 见：
    * https://github.com/qwd/LocationList/blob/master/China-City-List-latest.csv
* NPM发包教程：https://herrylo.github.io/front/2023-07-23.html
{%endnote%}


{%note danger%}
npm不鼓励任何形式的删除，主要因为我们发布的包可能已经被其他人引用，如果我们删除了此包，其他人在重新安装含有我们包的依赖的工程时，出现找不到包问题。

基于此，npm做了相关的删除限制：

* **删除的版本24小时后方可重发!**
* **只有发布72小时之内的包可以删除!**
* **发包须谨慎，最好给报名起个好名字**
{%endnote%}

