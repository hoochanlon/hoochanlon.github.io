---
title: "serverless 搭建 memos"
date: 2025-12-16T12:18:33+0800
draft: false
slug: "20251216121833"
categories: ["折腾"]
tags: ["建站"]
summary: "对比 Render 与 Zeabur 部署 memos，并补充 S3 存储与保活相关配置要点。"
---
## render

render由于免费存储空间过低，不是优选。

* 使用 render 创建 Web Service
* Image：填写为 neosmemo/memos:stable
* Environment Variables 分别填入:
    * Key、port
    * Value、5230

保活方式：https://github.com/hoochanlon/keep-alive

## zeabur

官方镜像按照如图所示填写相关参数

![](https://github.com/hoochanlon/picx-images-hosting/raw/master/imgs/uploads/2025/PixPin_2025-12-15_00-15-59.8s3rjb1vs2.webp)

使用 [hu3rror/memos-litestream](https://github.com/hu3rror/memos-litestream)  项目镜像的填写方式

![](https://cdn.jsdelivr.net/gh/hoochanlon/picx-images-hosting@master/imgs/uploads/2025/PixPin_2025-12-15_21-55-53.webp)

S3 配置如图及相关解答：https://github.com/hu3rror/memos-litestream/issues/67

* b2

![](https://cdn.jsdelivr.net/gh/hoochanlon/picx-images-hosting@master/imgs/uploads/2025/PixPin_2025-12-16_12-59-21.webp)

* memos

![](https://cdn.jsdelivr.net/gh/hoochanlon/picx-images-hosting@master/imgs/uploads/2025/PixPin_2025-12-16_12-57-31.webp)

CF 代理 B2 配置见：https://github.com/hoochanlon/CF-Proxy-B2




