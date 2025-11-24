---
title: cloudflare搭建私有图床与网盘
categories: 折腾记录
tags: ['网盘', '图床']
pubDatetime: 2025-11-15
slug: "20251115142753"
description: 根据cloudflare产品现有优惠政策，搭建无服务器私人小型图床及网盘。
---


<figure style="text-align: center;">
   <img src="/src/data/hero-images/it/cloudflare.webp" />
   <figcaption></figcaption>
</figure>


## cloudpaste （新）

官方文档：https://doc.cloudpaste.qzz.io/guide/deploy-github-actions

常见问题：

* https://github.com/ling-drag0n/CloudPaste/issues/122
* https://github.com/ling-drag0n/CloudPaste/issues/124
* https://github.com/ling-drag0n/CloudPaste/issues/126
* https://github.com/MarSeventh/CloudFlare-ImgBed/issues/356


分享文本测试：https://cloudpaste.hoochanlon.space/paste/MEFujD ，由 https://lipsum.app 提供支持

## flaredrive-rev （旧）

还是差点意思...

### 部署

项目：

* https://github.com/MarSeventh/CloudFlare-ImgBed
* https://github.com/project-epb/flaredrive-rev

教程：

* [CloudFlare ImgBed 开源文件托管解决方案](https://cfbed.sanyue.de/)
* 网盘搭建教程：[Zephriel - 无需信用卡，Cloudflare R2+Workers免费部署10G私人网盘](https://www.bilibili.com/video/BV1GStGz1EXJ/)

图床搭建倒是很简单，因为教程确实写的很详细了。倒是网盘的教程写得相当简略，视频还是比较详细的，可是观感不太好。跟着视频做也可以，我这里标出一些关键步骤方便快速搭建。

1 点击快速部署按钮

![](https://hoochanlon.github.io/picx-images-hosting/uploads/2025/PixPin_2025-11-15_14-46-17.webp)

2 绑定域名

![](https://hoochanlon.github.io/picx-images-hosting/uploads/2025/PixPin_2025-11-15_12-25-16.webp)

3 进入 Zero Trust，应用程序调出access，创建策略，邮箱验证访问。

![](https://hoochanlon.github.io/picx-images-hosting/uploads/2025/PixPin_2025-11-15_12-34-19.webp)

4 配置域名、access策略

![](https://hoochanlon.github.io/picx-images-hosting/uploads/2025/PixPin_2025-11-15_12-37-01.webp)

成功

![](https://hoochanlon.github.io/picx-images-hosting/uploads/2025/PixPin_2025-11-15_12-46-49.webp)

## 测试

**图床**

cf-imgbed-8xy.pages.dev 

![](https://cf-imgbed-8xy.pages.dev/file/uploads/bh0gVaGT.jpg)

 cf-imgbed.hoochanlon.space

![](https://cf-imgbed.hoochanlon.space/file/uploads/bh0gVaGT.jpg)

**网盘**

网盘内部图片存在显示问题

![](https://hoochanlon.github.io/picx-images-hosting/uploads/2025/PixPin_2025-11-15_15-59-48.webp)


