---
title: memos搭建
noticeOutdate: false
date: 2025-11-05 00:05:13
categories: 折腾记录
tags:
  - 搭建网站
description: 从bluesky、misskey、mastodon部署建站成功，再到ech0-noise部署，最终决定memos。
---

一键安装1panel，方便下载docker、web配置Linux

```
bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"
```

用法

```
Usage:
  ./1pctl [COMMAND] [ARGS...]
  ./1pctl --help

Commands:
  status [core|agent]         检查 1Panel 服务状态
  start [core|agent|all]      启动 1Panel 服务
  stop [core|agent|all]       停止 1Panel 服务
  restart [core|agent|all]    重启 1Panel 服务
  uninstall                   卸载 1Panel 服务
  user-info                   获取 1Panel 用户信息
  listen-ip                   切换 1Panel 监听 IP
```


* [1Panel Docker 超详细 Misskey 部署教程](https://liubing.me/article/self-deploy/1panel-docker-deployment-misskey.html)
* [为1panel面板中托管到CloudFlare的网站配置HTTPS](https://blog.gusmin.net/2025/03/23/%E4%B8%BA1panel%E9%9D%A2%E6%9D%BF%E4%B8%AD%E6%89%98%E7%AE%A1%E5%88%B0cloudflare%E7%9A%84%E7%BD%91%E7%AB%99%E9%85%8D%E7%BD%AEhttps/)
* [使用1panel自动申请和续签通配符证书](https://hin.cool/posts/sslfor1panel.html)
* [github page搭建个人博客绑定域名问题](https://blog.csdn.net/jinweilin/article/details/79607349?)

