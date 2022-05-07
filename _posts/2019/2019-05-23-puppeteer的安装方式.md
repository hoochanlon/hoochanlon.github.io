---
title: "puppeteer的安装方式"
author: hoochanlon
categories: [2019.]
tags: [chip]
date: 2019-05-23 15:33:08
---

## 推荐使用淘宝chromium源安装

简单方便还快速

```
npm config set puppeteer_download_host=https://npm.taobao.org/mirrors
npm i puppeteer
```
<!-- more -->

#### 使用 `puppeteer-cn` 安装

`npm install puppeteer-cn --save` 按此顺序执行以下指令即可

```
npm install puppeteer --ignore-scripts
npm install
npm config set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD false
npm install puppeteer-cn --save
```

#### 跳过及恢复安装
  1. 跳过安装chromium 安装步骤 `npm install puppeteer --ignore-scripts`
  2. 执行 `npm config set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD false` 再恢复chromium的安装
  3. 恢复安装后，执行 `npm install puppeteer --save`

ps: 以上步骤可能涉及一定的代理设置访问
```
# 代理设置
git config --global http.proxy 'socks5://127.0.0.1:1080'
git config --global https.proxy 'socks5://127.0.0.1:1080'
# 取消代理
git config --global --unset https.proxy 'socks5://127.0.0.1:1080'
git config --global --unset http.proxy 'socks5://127.0.0.1:1080'
```

[此篇文章内容已被该LxxyxResume收录于项目简介中](https://github.com/Lxxyx/LxxyxResume)
