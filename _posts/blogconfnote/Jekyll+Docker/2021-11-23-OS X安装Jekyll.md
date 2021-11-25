---
title: "Jekyll安装过程中一些报错的解决办法 for OS X"
date: 2021-04-19 12:20:31 +0800
author: hoochanlon
categories: [Blogging, Jekyll]
tags: [博客配置存档]
---


## 安装rvm版本工具报错

在提示：“ruby_dep-1.5.0 requires ruby version >= 2.2.5, ~> 2.2, which is incompatible with the current version, ruby 3.0.0p0”，发现当前版本不兼容，需要安装ruby版本工具rvm；在网上下载安装rvm频繁失败后，看到[简书-安装RVM 失败的解决办法](https://www.jianshu.com/p/e15f6a793c94)安装rvm实际上是bash文件，于是 将[https://get.rvm.io](https://links.jianshu.com/go?to=https%3A%2F%2Fget.rvm.io) 的脚本内容复制粘贴到本地运行成功。

 <!-- more -->

## 安装Jekyll bundler报错

 fatal error: 'openssl/ssl.h' file not found

```log
./project.h:119:10: fatal error: 'openssl/ssl.h' file not found
\#include <openssl/ssl.h>
1 error generated.
make: *** [binder.o] Error 1
make failed, exit code 2
```

解决办法：`brew link openssl --force` https://www.codenong.com/7f4f071bda4ea81aaf62/

## 安装bundle报错

An error occurred while installing ffi (1.9.25), and Bundler cannot continue. 解决办法：删掉gemfile.lock文件，https://githubmemory.com/repo/ffi/ffi/issues/877

最后终算把Jekyll安装成功了。但每次版本变动都这么折腾，其实是毫无意义的浪费时间。