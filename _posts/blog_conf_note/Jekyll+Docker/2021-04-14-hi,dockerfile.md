---
title: "Hi,Dockerfile"
date: 2021-04-14 10:42:06 +0800
author: hoochanlon
categories: [2021.,Blogging, Jekyll]
tags: [博客配置存档]
---

## docker部署的反思，By Jekyll

直到现在才想明白，之前构建的Action其实是根本不需要docker封装整块博客镜像的。因为我本来的目的就是为了线上web自动更新，而且我之前配置的action一经push就自动更新gh-pages。不需要大费周章地去用docker构建所谓的上百兆又易过时的博客站点镜像，更不需要再到Windows、Mac、Linux再去重新部署Jekyll本地环境而写博客的。

现在想来，对于已构建好的action，为了部署docker而写博客有些画蛇添足了。事倍功半收益太低，好多重要该记录的事，耗费过多精力投入到docker制作基于Jekyll的博客镜像了。不管哪个平台，我只需要一个ruby本地环境，通过gem或是bundler来安装rake，以此生成一个带符合Jekyll格式标题的文章即可。

⛏，搞了大半个月，我在舍本逐末的追求什么？action省去了一大堆本地构建的环境各种排查疑难杂症的烦扰，GitHub在线上传文件夹或文件不香吗？

4.14 零点 记

 <!-- more -->

## hello,dockerfile

创建dockerfile，复制如下指令

```shell
 # 继承ubuntu镜像
 FROM ubuntu
 # 运行 echo 命令，输出 “hello dockerfile” 字符串
 RUN echo "Hello"
 # 容器启动时执行该命令
 CMD /bin/bash
```

所谓上下文路径`.`就是当前所有整体关联的文件以及文件夹，我们开始构建镜像。

`docker build -t hello:v1 .`

使用镜像`docker run -ti hello:v1`

## dockerfile构建rake文章生成器镜像

这次我们更有目标性的使用dockerfile，搭建基于docker跨平台的rake文章生成器。有了文章生成器，生成文章写好内容，直接线上GitHub repo提交。

* alpine linux/ruby/rake环境及组件🔧
* 博客目录的_posts文件夹以及Rakefile文件封装📦

创建并复制下列内容到Dockerfile

```dockerfile
# pull alpine linux
FROM alpine
RUN apk update
RUN apk add ruby
RUN mkdir -p /writen-demo/_posts && gem install rake
# 宿主机复制多个文件到镜像
COPY ["./Rakefile","/writen-demo/"]
COPY ["_posts","/writen-demo/_posts/"]
# docker cp 89f4a3cc45d9:/writen/ /Users/chanlonhoo/Desktop/ 容器文件夹复制到宿主机

# 制作与上传镜像
## 制作镜像
### docker commit 9153bfe4a69f httpd-t:0.1
### -m -a 为可选项，可不写，后面的是容器id，以及创建镜像命名:标签
### docker images  查看本地镜像

## 将目前的镜像做成目标镜像，用作远程推送的镜像
### docker tag httpd-t:0.1  hoochanlon/httpd-t:0.1
## 远程推送
### docker push hoochanlon/httpd-t:0.1

```

上述操作完成之后，构建生成镜像`docker build -t hello:v1 .`，再制作一个zip小压缩包，也顺便在我的repo附上了written-demo。
