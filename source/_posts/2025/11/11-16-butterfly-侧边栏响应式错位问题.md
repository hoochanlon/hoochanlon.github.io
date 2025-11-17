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


### 中途的修复 —— github 更换自动化部署遇到的问题

在npm、hexo环境一致的情况下，gh-pages部署样式还走样，只能是怀疑是最后部署的模块问题了。索性直接换成hexo官方原版的部署。

* 参考： [Hexo-部署到-GitHub-Pages-教程-runs-on-解释](https://sven-chr.github.io/myblog/2025/10/10/Hexo-%E9%83%A8%E7%BD%B2%E5%88%B0-GitHub-Pages-%E6%95%99%E7%A8%8B-runs-on-%E8%A7%A3%E9%87%8A/)


```YML
name: Build and Deploy to GitHub Pages

on:
  push:
    branches: [ master ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'  # 推荐使用最新 LTS 版本
          cache: 'npm'

      - name: Install dependencies
        run: |
          npm ci
          # 确保安装所有必需的渲染器
          npm install hexo-renderer-pug hexo-renderer-stylus --save

      - name: Build
        run: |
          npx hexo clean
          npx hexo generate

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

遇到的错误

* {% label 'Error: Creating Pages deployment failed ' red %}  
* {% label 'Error: HttpError: Invalid deployment branch and no branch protection rules set in the environment. Deployments are only allowed from gh-pages' red%}  
* {% label 'Error: Failed to create deployment (status: 400). Responded with: Invalid deployment branch and no branch protection rules set in the environment. Deployments are only allowed from gh-pages' red%}  


{% blockquote %}
Sounds like that your environment has some protection set up. You can try the following:

1. Go to you repository **Settings**.
2. Click on **Environments**.
3. Select your environment **github-pages**.
4. Next to **Deployment branches** select **Selected branches** from the dropdown.
5. Click on **Add deployment branch rule**.
6. Enter the pattern **master**.

This should allow deployments from the **master** branch to your **github-pages** environment.

 ***@Sascha*** &mdash; https://stackoverflow.com/questions/76937061/branch-master-is-not-allowed-to-deploy-to-github-pages-due-to-environment-prot
{% endblockquote %}

对比答案分析：

* 你的 workflow 是设置为在某个分支（例如 master）被 push 时触发部署。
* 但是在你的仓库中，对于一个被称为 “environment” 的 GitHub 功能（这里是环境 “github‑pages”）有一个 保护规则（protection rule），它限制哪些分支可以触发该环境的 deploy。
* 所以即使 workflow 本身触发了，GitHub 检查到你当前分支（master）不在 “允许部署到环境” 的列表里，就拒绝执行，导致这个错误。


再来对比下样式正常了（手机图实在太占版面空间了，所以合并成一张图）。

![](https://hoochanlon.github.io/picx-images-hosting/uploads/2025/20251117012941.webp)


### netlify 额度问题

额度参考：

* [netlify信用额度急剧消耗，300免费信用分到底谁占用了？](https://developer.aliyun.com/article/1685027)
* [我把网站迁移到 cf，省了几万块](https://zhuanlan.zhihu.com/p/714582414)
* [netlify_just_sent_me_a_104k_bill_for_a_simple](https://www.reddit.com/r/webdev/comments/1b14bty/netlify_just_sent_me_a_104k_bill_for_a_simple/?tl=zh-hans)

太贵了，又是给人一种黑箱操作，莫名其妙我也用掉了75%额度，已放弃。看了 [Vercel、Heroku、Netlify的开源替代方案Dokploy和Coolify](https://www.magentonotes.com/vercel-heroku-netlify-open-source-dokploy-coolify.html) 该文章，又是，只能，自给，自足，吗？无力吐槽，好累...


netlify部署参考：

* https://io-oi.me/tech/deploy-static-site-to-netlify
* https://www.wevg.org/archives/hexo-with-netlify-cms

netlify看看能不能用吧...

* 对比参考：[几个免费静态网站托管平台对比](https://skyhigh.moe/blog/staticwebhost)
* 抠抠搜搜参考：
    * [解决Netlify免费Build额度太少的问题](https://182.254.147.27/solving-netlify-free-build-limit/)
    * [使用 GitHub Actions 部署网站到 Netlify](https://zhuanlan.zhihu.com/p/149508734)
* 加速参考：https://github.com/xingpingcn/enhanced-FaaS-in-China

至于再搭hexo + CMS，随便在自建的云盘写点内容复制过去就好了。反正都不完善，有的为了适配相关框架安装起来又特别复杂，算了算了。