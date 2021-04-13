---
title: "docker基本命令整理"
date: 2021-04-13 16:42:06 +0800
author: hoochanlon
categories: [CICD, Docker]
tags: [CICD]
math: true
mermaid: true
math: true
image:
 src:
---

docker免费默认只能用一个私有仓库...这点可以登录docker官网了解价目以及使用详情🔎。alpine linux确实很轻量不到10M，但对Jekyll支持度目前并不是很好，搜索不到安装包。<!--more-->

另外还找到 [yeasy-docker-从入门到实践](https://yeasy.gitbook.io/docker_practice/os/alpine)可供参考。

### 开始>>>

从容器下载到拷贝

```shell
# 下载容器 https://hub.docker.com/ 容器市场有下载
docker pull httpd
# 创建并运行容器 httpd-test，而且将容器开放8000端口映射在主机80上
docker container run -p 8000:80 --name httpd-test httpd
# 以命令行交互式进入容器终端
docker exec -ti httpd-test /bin/bash
拷贝目录到httpd容器站点存放目录
docker cp c:\jekyllblog\_site\. a29403526515:/usr/local/apache2/htdocs
```

docker cp 容器id:路径/文件 本地路径。这样，文件就从容器中拷贝到了宿主机上：

`docker cp 89f4a3cc45d9:/usr/context.xml .`

### 打包提交

* [cnblogs-pjcd-32718195-docker 制作自己的镜像](https://www.cnblogs.com/pjcd-32718195/p/11762079.html)
* [docker docs- docker tag](https://docs.docker.com/engine/reference/commandline/tag/)

容器制作成镜像，🏷️标签部分必须要一致保证有序性，这也算提交远程镜像的规范化吧。

```
# 制作镜像
docker commit 9153bfe4a69f httpd-t:0.1
# -m -a 为可选项，可不写，后面的是容器id，以及创建镜像命名:标签

# 查看本地镜像
docker images

# 将目前的镜像做成目标镜像，用作远程推送的镜像
docker tag httpd-t:0.1  hoochanlon/httpd-t:0.1
# 远程推送
docker push hoochanlon/httpd-t:0.1
```

我们的最终目的其实就是提交远程镜像做一个备份环境仓，这样转移平台配置环境，就只在docker进行操作。

