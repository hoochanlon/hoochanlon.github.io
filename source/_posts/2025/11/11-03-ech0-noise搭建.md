---
title: ech0-noise搭建
noticeOutdate: false
categories: 折腾记录
tags:
  - 搭建网站
abbrlink: 26577
date: 2025-11-03 22:27:23
description: 从bluesky、misskey、mastodon部署建站成功，再到ech0-noise部署。
---

### 前言


体验：bluesky > misskey > mastodon。门槛: mastodon > misskey > bluesky 

* [[軟體教學] 自架 Bluesky PDS 伺服器，促進去中心化社群發展](https://tedliou.com/software/bluesky-pds-server-deploy/#bluesky-pds-%E4%BC%BA%E6%9C%8D%E5%99%A8%E6%9E%B6%E8%A8%AD%E5%BF%83%E5%BE%97)
* [1Panel Docker 超详细 Misskey 部署教程](https://liubing.me/article/self-deploy/1panel-docker-deployment-misskey.html)
* [rcy1314/echo-noise](https://github.com/rcy1314/echo-noise)

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

简单的过程感想：

* 以前博客都是从Jekyll选一个基本上都是简陋的主题，现在都是hexo使用效果更丰富的主题，如：[hexo-butterfly](https://butterfly.js.org/)
* 以前GitHub主页都是写很简单的自我介绍，现在都被玩出花了：[IonRh/HomePage](https://github.com/IonRh/HomePage)
* 以前搭建个博客写点文章什么就好了，现在也因言论管控、写博客也不太即时发送的原因，开始自建私有化微博：[misskey](https://misskey-hub.net/cn/)


### docker原理图

```
+-------------------------------------------------+
|                  宿主机                        |
|                                                 |
| 访问地址: http://服务器IP:1314                  |
|                                                 |
|  +-----------------------------------------+   |
|  |             容器: Ech0-Noise           |   |
|  |                                         |   |
|  | 应用: Echo Noise                         |   |
|  | 内部端口: 1314                           |   |
|  |                                         |   |
|  | 数据存储卷: /app/data                     |   |
|  +-----------------------------------------+   |
|                                                 |
| 本地挂载路径: /opt/data  ------------------>   |
|                                                 |
+-------------------------------------------------+

```

### ech0-noise 用到的一些指令介绍

厘清命令用途，方便排错

#### docker run 

这条命令的作用是：

1. 后台启动一个名为 Ech0-Noise 的容器。
2. 使用 noise233/echo-noise 镜像（如果本地没有自动拉取）。
3. 映射宿主机 1314 端口到容器 1314 端口。

```
docker run -d \
  --name Ech0-Noise \
  -p 1314:1314 \
  noise233/echo-noise
```


特点

不挂载宿主机目录，容器自动创建新的数据库。

适合首次安装或测试环境。

删除容器后，数据会一并删除（非持久化）。

优点

部署最简单，一条命令即可启动。

默认账号自动生效，无需手动配置。

缺点

容器删除或重建后，所有数据会丢失。

不适合长期生产环境使用。


#### docker re-run

复制数据库到宿主机

```
docker cp Ech0-Noise:/app/data/noise.db /opt/data/noise.db
```

删除旧容器并重新运行（挂载数据库实现持久化）

```
docker stop Ech0-Noise
docker rm -f Ech0-Noise
docker run -d \
  --name Ech0-Noise \
  -p 1314:1314 \
  -v /opt/data/noise.db:/app/data/noise.db \
  noise233/echo-noise
```

把宿主机的 /opt/data/noise.db 文件挂载到容器内部的 /app/data/noise.db，让容器直接读写宿主机的这个文件。

#### docker-compose

run vs compose

| 对比项    | `docker run`                | `docker-compose.yml`                        |
| ------ | --------------------------- | ------------------------------------------- |
| 启动方式   | 一条命令启动一个容器                  | 管理多个容器的配置文件                                 |
| 适合场景   | 临时部署、测试、单容器应用               | 正式部署、需要持久化与自动管理的服务                          |
| 配置方式   | 命令行参数（繁琐）                   | YAML 文件（清晰易读）                               |
| 环境变量管理 | 需要在命令行里一个个写                 | 可统一写在 `.env` 文件或 compose 文件中                |
| 多容器支持  | 只能手动一个个运行                   | 一键启动多个容器（如 Web + DB）                        |
| 升级与维护  | 每次都得重新输入命令                  | `docker-compose up -d` 自动加载配置               |
| 文件持久化  | 手动挂载 `-v`                   | 在 compose 文件里统一配置 volume                    |
| 日志与状态  | `docker ps` / `docker logs` | `docker-compose ps` / `docker-compose logs` |
| 网络管理   | 默认 bridge 网络                | 自动创建独立 network 隔离容器环境                       |


docker-compose.yml 

```
version: "3"

services:
  noise:
    # 📦 镜像来源（直接使用官方镜像）
    image: noise233/echo-noise
    container_name: note-noise

    # 🌍 映射端口：主机1314 → 容器1314
    ports:
      - "1314:1314"

    # 💾 数据持久化目录：主机 ./data → 容器 /app/data
    volumes:
      - ./data:/app/data

    # ⚙️ 环境变量（默认使用 SQLite）
    environment:
      - LOG_LEVEL=info
      - DB_TYPE=sqlite                # 数据库类型：sqlite / postgres / mysql
      - DB_PATH=/app/data/noise.db    # SQLite 数据库路径


    # 🔁 自动重启策略：除非手动停止，否则自动重启
    restart: unless-stopped
```

一键创建并后台启动所有容器服务。

```
docker compose up -d
```

#### .env

它定义了容器运行所需的参数（日志级别、数据库类型和路径），容器启动时会自动读取这些变量，而不需要在 docker-compose.yml 中写死。

```
LOG_LEVEL=info
DB_TYPE=sqlite
DB_PATH=/app/data/noise.db
```

| 情况     | 使用 `.env` | 不使用 `.env`          |
| ------ | --------- | ------------------- |
| 管理方便   | ✅ 集中修改    | ❌ 需要修改 Compose 文件   |
| 多环境部署  | ✅ 容易切换    | ❌ 需要手动修改            |
| 隐藏敏感信息 | ✅ 可以单独管理  | ❌ 可能暴露在 Compose 文件里 |
| 必须存在吗  | ❌ 不是必须    | ✅ 可以直接写在 Compose 文件 |


### nginx 反代 docker 部署项目

{%note danger%}
浏览器尝试访问反代域名，显示无法访问。说明浏览器可能强制尝试使用HTTPS（端口443）访问。你目前只配置了HTTP（8O），没有HTTPS证书。

解决方法：

1. 配置HTTPS（用Let'sEncrypt申请免费证书），或者清理浏览器缓存，并用明确的`http：//`访问。
2. 浏览器缓存或HSTS：如果之前访问过HTTPS，浏览器会记住HSTS，自动跳转到HTTPS，即使现在Nginx只监听HTTP也会访问失败。

在这种情况下：清理浏览器缓存，或者在浏览器里尝试隐身/无痕模式访问
{%endnote%}


反代步骤可参考 [1Panel Docker 超详细 Misskey 部署教程](https://liubing.me/article/self-deploy/1panel-docker-deployment-misskey.html) 这篇文章。证书配置 [Kerry的学习笔记
 - 如何申请 Cloudflare 免费 SSL 证书](https://kerrynotes.com/apply-ssl-certificate-from-cloudflare/)

### 中国银行visa借记卡申请过程 

* [中国银行visa借记卡申请过程](https://linux.do/t/topic/173844)