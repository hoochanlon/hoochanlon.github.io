---
title: “在Mac M1部署Jekyll的试错过程”
author: hoochanlon
categories: [2021.,Blogging, Jekyll]
tags: [博客配置存档]
math: true
mermaid: true
date: 2021-03-28 10:22:04
---

## Mac使用上的一些小问题

使用vs code打开gemfile写入文件方便sudo保存，按着[Jekyll-admin](https://github.com/jekyll/jekyll-admin)教程来即可使用。但始终以“x”的方式打开存在问题，网上查找资料发现这一个命令：`sudo chown -R user /dir`。💡更改所有者归属，chmod则是文件及文件夹执行属性。

重复启用及关闭Jekyll也存在端口占用问题，`control`+`c`不能重用端口。使用`sudo lsof -i:占用端口 `与`sudo kill 占用端口进程`解决此类问题。[简书-a23e72df5267-Mac OSX 下Address already in use 端口占用问题](https://www.jianshu.com/p/de3c2874383d)

option+shift+h,切换半角符号——Mac；但我们此次主要问题点：

* 安装失败，系统版本不兼容与访问权限
* 安装成功使用命令报错，各种缺少组建资源
* 组件已安装，但使用命令还是提示缺少组件（访问权限）
* 使用最高权限sudo 还存在拒绝访问（内核保护机制）
* 下载安装组件命令配置过于麻烦，包管理工具存在网络干扰

 <!-- more -->

程序报错描述不具有整体性，偏向推进实施的节点过程原因，难以从整体看问题。个人环境相对随机（时间点、组件安装完善度、版本）解决方式存在差异并不适用于多数。

报错次数频繁，原因问题较多且解决方式不通用，很容易在长时间解决过程甚至都忘了自己在做什么。网站给出的配置过于简单也忽视了对相关环境的说明，他人博客中又是否存在解决异常给出结果的过程（思维）省略？

## ***Jekyll安装及配置问题（加载·运行）***

***一些命令配置的执行也需要工具包环境支持` xcode-select --install `***


如下这也就是为什么用homebrew的原因。

![7CD338C1-54F5-4146-B688-667279E24DAB.png](https://i.loli.net/2021/03/27/4QuzgOsqyBPSp3L.jpg)

#### 防火墙干扰brew下载

可是现有的环境存在网络防火墙干扰问题：

* 我们普遍购买VPN通常较为昂贵而且容易被封，配置代理还存在windows/mac终端及其他命令行工具的支持程度，命令也通常不一致。

在这样的条件下，我们通常是寻找镜像源最为合适。[brew.idayer.com-homebrew镜像助手网站](https://brew.idayer.com/)，复制粘贴命令行进行安装。

`/bin/bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install.sh)"`

#### 使用Jekyll权限问题

[关于使用sudo chmod 777授权运行安装所出现的Operation not permitted的错误提示链接](https://segmentfault.com/q/1010000004924940/a-1020000004925010)，查明原因为系统内核保护所造成，`csrutil status`可以查看保护状态是否处于开启，在Mac的恢复os使用终端``csrutil disable`，按“y”进行确认重启。

##  由上，我们为什么要包管理工具？ 

### 环境变量修改问题

环境变量修改不当造成错上加错，环境变量还存在优先级问题，还有浪费时间的重装系统。

[简书-iambowen-部署的模式(一):基础设施即代码](https://www.jianshu.com/p/ffa986168f69)所说的**配置漂移（Configuration Drift）、脆弱的基础设施（Fragile Infrastructure）**，开发环境的适用程序运行范围广，但配置也极其繁杂与脆弱，难以追溯以及排查原因，也很难进行修复。因此我们要尤为小心。

### jekyll版本问题

jekyll4.2版本开始，在serve后面添加`--trace`

![D2367715-10C3-437E-97A9-6FE3024C774E.png](https://i.loli.net/2021/03/27/Uho5FWeYkrRg2mw.jpg)

可是我们执行之后呢？明明存在又为什么加载不起来？

![648AD4F7-9E63-40EA-8EF7-F826C982B10A.png](https://i.loli.net/2021/03/27/5Do31lm8JXF27YA.jpg)

`sudo bundle exec jekyll serve --trace` 

![AF952680-DB43-4CD9-9674-5C5D0E2E21BD.png](https://i.loli.net/2021/03/27/Z6n3JCR2rukUPob.jpg)

如果还是提示`bundler: failed to load command: jekyll`，jekyll文件也存在，使用[pages-gem/issues/752](https://github.com/github/pages-gem/issues/752)提供的`bundle add webrick`。[原因为`webrick`gem是从ruby3的标准库中删除的，所以它需要包含在gem文件中.](https://www.5axxw.com/questions/content/grbr28)

### 初始化问题与文件依赖关系

使用 `source "https://rubygems.org"`、`bundle install` 命令安装出现，运行命令提示“ Could not locate Gemfile or .bundle/ directory”之类的错误，[根据这个链接指引才知道要初始化`bundle init`创建gem file](https://www.itranslater.com/qa/details/2582629696882082816)

后来才要了解出现这个问题的原因，[360docs-Gemfile 详解](http://www.360doc.com/content/16/0322/17/10058718_544367748.shtml)得知gemfile与gem的关系：

* gemfile是gem描述依赖的文件，而这份描述包含：依赖、安装源的指定，不同gem组件的版本信息，这几点构成整体的依存关系。

由上述也联想到：每个开发者实际上都是根据自身环境需求而开发的组件，可能一开始就并不是为这个产品而存在的，这个产品为了更好的使用或体验效果而把他们集成组装了起来，由于这个现象的存在也就有版本不相兼容适配的情况。

新产品是否稳定？具有缺陷的产品是否能补丁完善回来？遇到重大异常事故，能不能回滚切换正常运行？我们来看这篇文章[luke stringer-Jekyll on the Apple M1](https://stringer.dev/2021/02/14/jekyll-on-the-apple-m1.html)的行事风格：

* 遇到开发环境的相关组件缺失，并不是下载单一的某一个组件，而是下载包管理工具。

  * 再由这个包管理工具下载开发环境

* 这个产品是基于这个平台上，这个平台又是否存在不稳定性

  * 下载其相关的环境版本管理工具

* 使用该产品的某一类功能，能否启动类似于绿色版程序单独运行？

  * 进行捆绑运行

* 命令没找到却存在此类文件夹与文件

  * 不止环境变量还有自由彻底的权限执行问题
  * **有时百度出来的问题别人所断言的结论也只是问题事故其中的一个原因之一**

  ![21D003E0-263E-46C3-9BFF-18B6307F9D23.png](https://i.loli.net/2021/03/27/pbVhGcqmW7vrIF9.jpg)



## 综上，我们为什么进行版本管理？

### jekyll结构关系

> 摘自 [初探Jekyll（一）：Jekyll是什么？Jekyll常用的专业名词](https://blog.csdn.net/yq_forever/article/details/103449864)

* Gem相当于Ruby中的包，可以调用
* Jekyll一种用Ruby写成的静态网页生成工具，本质上也是一个Gem

* Gemfile是Jekyll中用来列出所需Gem的一个文件，Bundler可以安装Gemfile里的Gem。

