---
title: "steam for Mac经常断线的解决办法"
date: 2022-05-03 19:14:56 +0800
author: hoochanlon
categories: [2022]
tags: [Mac/iPad/iPhone]
---

steam for Mac经常断线，以前是可以用hosts搞定，现在难度也变大了，无非两种：代理/VPN、游戏加速器。两个都要钱，代理/VPN已经充值过钱，加速器...其实我就不想单单为steam交加速的钱，不值...我咨询了steam网友，原来还有一个免费的steam++，可以的；我用了后，还行，可以。

目前总结两个还好用的工具的吧：

* [SHARE · 杂铺 - [白嫖机场]西部世界VPN，注册送三天/可撸无限时长！](https://sh.tmioe.com/175.html)
* https://sjssr.fun/
* [Steam++」是一个开源跨平台的多功能游戏工具箱。](https://steampp.net/)

<!-- more -->

steam++需要注意是在Mac上系统会报错不让安装，查了百度，发现一篇文章介绍的解决办法还挺好用的 ——[Mac软件出现【已损坏，打不开。您应该将它移到废纸娄】，应该这样解决]（https://www.jianshu.com/p/fb417163309a）

打开终端复制 `sudo xattr -r -d com.apple.quarantine`

补，steam购买及转区相关：

* [steam港区支付相关](https://zhidao.baidu.com/question/1455646243155895940.html)
* [Steam游戏锁国区怎么办？两种方法助你玩到心仪的游戏!](https://baijiahao.baidu.com/s?id=1690312043047794783&wfr=spider&for=pc)