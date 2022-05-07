---
title: Linux加入AD域进行Samba共享与账户登录
author: hoochanlon
categories: [2020]
tags: [chip]
date: 2020-11-13 17:46:29
---

## 前言

不如NAS，让自己变得舒服，用这个方式友好使用共享。

Linux跟Samba加AD域是两回事，往深的方面说就是sssd与winbind的ldap访问方式，不少文章以Samba容器来代指Linux，samba及winbind组件底层原理长篇叙述一大论，往往容易让初次搭建项目的新手被搞得很迷糊，这些章节内容也是足够的深，掌握起来也需要耗费大量时间。投入了大量时间进去。

于是投入大量时间好不容易了解了，再学习其章节的另一板块内容，结果发现又如同深渊一般，再投入时间专注费劲功夫搞定了，结果呢？学东忘西的...迷失了，甚至都不知道自己学的是什么东西了，也不知道自己究竟要做什么，如何去做？而且各类知识名词由于特性或历史缘故具有相同属性或不同点，搭建项目的前提是自己又要明确地区分这些内容，所以一旦集成就又会搞混淆把自己弄得头晕脑胀。

文章有我大量的主动式学习向思考及主观看法，不能保证绝对权威的正确性，因此抛砖引玉供同学参考，希望该篇文章也能帮助大家。<!-- more -->

## 安装Windows DC与Linux Samba

### Domain Controller

运行 `dcpromo`执行下一步，在新林新建域填写域名，并将DNS设置为域控计算机全名，整个安装过程完成。安装完成打开系统属性可以看到对计算机名、域的详细描述。

具体每一步图文可参考文章此类步骤执行：[51cto-windows server 2008 R2 enterprise AD域控服务器安装](https://blog.51cto.com/12476193/2123191)，本章节只做流程概述。

![image-20201111174222325.png](https://i.loli.net/2020/11/11/kLHV9SramZIGczX.png)

## 安装Samba 

***做加域集成前，建议先阅读此前写的 《Samba共享及Linux权限的应用》，看看[[sjhf-实例分析—samba的域功能](http://m.blog.chinaunix.net/uid-11636352-id-1757728.html)，我认为这篇文章写得***

接下来到了Linux安装Samba，支撑Samba加入AD域一系列体系的有：
* 域账户与UID映射的Samba-winbind组件
* 主机非安全通信的验证Kerberos
* 用于与域主机时间同步的ntpdate 

这三者都是协作Linux加入AD域完成Samba共享的整个生态周期。了解到这里我们yum开始安装

> 指令参考自 [linuxcn-如何让 Linux 机器加入 Windows 的 AD 域](https://linux.cn/article-7695-1.html)

```shell
# samba、winbind、Kerberos 安装
yum -y install samba samba-client samba-common samba-winbind samba-winbind-clients krb5-workstation ntpdate
```
### 需要关闭及开启的服务 

需要关闭的服务有：selinux、firewall；这带来个问题就是为什么要关闭selinux、firewall？

简而言之selinux核心是防止root滥用权限，用户要是sudo各种不明软件、病毒能这样吗？这就是运维与日常用户的区别。

firewall方面，多数是因为不清楚各个软件通信该放行什么端口，索性关上防火墙，简单省事；或是企业系统已有外部防火墙或第三方防火墙，所以关掉系统自带防火墙。

>  参考 [Linux 下为何要关闭 SELinux？ - Hongbo He的回答 - 知乎](https://www.zhihu.com/question/20559538/answer/761147959) 

***建议：看上去，这些内容很耗时间，但实际上是值得投入与学习的。***

接着，开启samba及winbind组件服务：

* SMB是Samba 的核心启动服务，主要负责建立 Linux Samba服务器与Samba客户机之间的对话
* NMB可以把Linux系统共享的工作组名称与其IP对应起来，若是关闭就只能通过IP来访问共享文件

> 参考 [Samba启动服务中的nmb是什么](https://blog.csdn.net/qq_30782455/article/details/96345259)

```shell
chkconfig smb on && systemtcl start smb
chkconfig nmb on && systemctl start nmb
chkconfig winbind on && systemctl start winbind
```

samba配置文件配置内容解读可以看 [将samba加入到windows域《转载》](https://www.cnblogs.com/rusking/p/3993148.html)

## 加域与验证的准备工作

DNS方面需要配置DC主机IP才能加域，在网络通信中hosts优先级是比DNS高的，先访问hosts是否有对应域名映射，再查找DNS解析。

配置hosts与DNS

```shell
vi /etc/hosts # 配置host
# 格式：主机ip地址 主机名（计算机名.域名） 计算机名
# 比方说我写入的hosts
127.0.0.1 linux.win7.local linux

vi /etc/resolv.conf # 配置DNS
nameserver 172.17.198.34 # DC主机IP
```
接着配置时间同步 `ntpdate dc-01.win7.local`，加域与验证都是与需要时间一致的。


## 搭建Kerberos
前面介绍Kerberos是主机之间非安全通信的验证服务，既然如此就需要服务端与客户端来保持双方的验证。首先DC（Windows Server）搭建Kerberos；在[官网下载](http://web.mit.edu/kerberos/)选择for Windows的msi安装程序傻瓜化安装；初次安装摸索Kerberos配置可参考文章 [Windows Kerberos客户端配置并访问CDH](https://blog.csdn.net/weixin_42438176/article/details/87127632)

安装完Kerberos打开软件，其配置内容自动生成的。配置文件是`C:/programData/mit/kerberos5/krb5.ini`。根本就不需要操心，有些文章教程在Windows上安装Kerberos配这配那的，反倒是画蛇添足。

关注的重点是Kerberos的kdc、admin server、default realm具体是谁。

* kdc：即密钥分发中心，维护域中所有安全主体账户信息数据库。
* admin server：这里为域控DC服务器；default realm：域名

![image-20201112105519473.png](https://i.loli.net/2020/11/12/63ilhg5rQaZdpzL.png)

Kerberos 指令`klist`在Windows中信息中文提示友好

![image-20201110180534597.png](https://i.loli.net/2020/11/13/cC8wgvbX1INQYV2.png)

**让我们再回到Linux**，清除旧票据生成一个新的票据，并查看 

```shell
kdestroy &&  kinit administrator@WIN7.LOCAL && klist #注意域名大写
klist: No credentials cache found (ticket cache FILE:/tmp/krb5cc_0)
Ticket cache: KEYRING:persistent:0:0
Default principal: administrator@WIN7.LOCAL

Valid starting       Expires              Service principal
11/11/2020 22:19:34  11/12/2020 08:19:34  krbtgt/WIN7.LOCAL@WIN7.LOCAL
	renew until 11/18/2020 22:19:31
```
已指令的方式配置samba与Kerberos，并加入AD域，关于命令的说明可参考：[csdn-参考authconfig 用法](https://blog.csdn.net/safenli/article/details/70598885)

```shell
authconfig 
# 命令参考自：https://linux.cn/article-7695-1.html
--smbsecurity ads
--smbworkgroup=WIN7 
--smbrealm WIN7.LOCAL 
--smbservers=dc-01.win7.local

--enablewinbind 
--enablewins # WINS实现的是IP地址和计算机名称的映射
--enablewinbindauth # winbind认证Windows AD-Linux用户映射
--enablewinbindoffline # 允许离线脱域情况登录
--winbindtemplateshell=/bin/bash # 给用户分配bash执行指令
--winbindjoin=administrator 
--enablelocauthorize 本地用户使用本地授权
--enablemkhomedir=/home/%D/%U # 配置AD域用户的家目录，%D域名 %U用户名 
--enablewinbindusedefaultdomain

--enablekrb5 --krb5realm=WIN7.LOCAL --krb5kdc=dc-01.win7.local
--krb5adminserver=dc-01.win7.local --enablekrb5kdcdns --enablekrb5realmdns
--update 更新配置 
```
`authconfig-tui` 所对应的shell配置，这个图形界面集成了pam

![12-01-41.png](https://i.loli.net/2020/11/13/fNtgdezVoZXO1cF.png)

![12-01-59.png](https://i.loli.net/2020/11/13/VjSc2zE3JgHZLFl.png)

![12-02-19.png](https://i.loli.net/2020/11/13/pJ4elQjmILCtGgv.png)


## 完成加域并使用AD账户登录Linux

`vi /etc/nsswitch.conf`添加winbind认证

```shell
passwd:     files sss winbind
shadow:     files sss winbind
group:      files sss winbind
```
在配置winbind的过程中也查阅了关于sss的资料文档，sssd也是用于集成验证的，粗略来说它是作为一个本地验证的缓冲池降低认证服务器负载的。

* [Sina-sssd 系统安全服务守护进程](http://blog.sina.com.cn/s/blog_588c88cb0100ywoh.html)
* [RedHat-SSSD vs Winbind](https://www.redhat.com/zh/blog/sssd-vs-winbind)
* [csdn-红帽企业级Linux 7和 Windows集成指南](https://blog.csdn.net/qtm_gitee/article/details/102879486)

`net ads join -U administrator@WIN7.LOCAL`输入密码并加域

```shell
realm join dc-01.win7.local # 确认是否加域成功
net ads testjoin -U administrator@WIN7.LOCAL # 如上二选一
wbinfo -g & wbinfo -u #查看域中的组与用户
```

### 域账户登录Linux

直接使用AD域账户登录Linux提示Disconnected from remote host(Samba) ，解决办法参考 [chinaunix-winbind实现用windows账户登录linux机器](http://blog.chinaunix.net/uid-73604-id-2058303.html) 所说`vi /etc/pam.d/sshd` 写入以下三行。

```shell
auth       sufficient   pam_winbind.so
account    sufficient   pam_winbind.so
session    required     pam_mkhomedir.so
```

在这个环节中也涉及到linux可插拔认证模块(PAM)知识，关于PAM可参考：

* [csdn-Linux可插拔认证模块的基本概念与架构](https://blog.csdn.net/cpongo4/article/details/89166312)
* [ariclee-常用的Linux可插拔认证模块（PAM）应用举例(一)](https://www.cnblogs.com/ariclee/p/4723835.html)

个人浅见从设计者角度想相当于我们做的是接入式主机账户认证，必然需要随时取消这样的账户登录服务。现在我们开始以域账户SSH登录测试 `ssh od001@172.17.198.35`

登录测试成功，配置AD用户映射生成对应家目录也完成了创建，如图。

![Snipaste_2020-11-11_14-19-49.png](https://i.loli.net/2020/11/12/hFYOCM4xdn975sK.png)

### AD用户访问samba

专为AD共享测试创建了777的adsharp目录`chmod -R 777 /adsharp`，valid users也写成了AD域的hrs组，hr001登录到smb共享测试成功。

## 项目搭建所出现的各种问题疑惑

从samba到ad加域实际上一个复杂的过程，对概念理解空白初次入手照葫芦画瓢，忙着忙着一旦遇到报错也显得很是生疏，解决问题毫无头绪，大量时间也在不断查找资料，查找的过程中这边还没解决，又是一个接一个的新问题。于是为了解决问题而解决问题都不知道自己在忙些什么了。

### failed: Cannot find KDC for requested realm

初次遇到这个问题时，我在想是不是DNS不对，左核对右核对smb.conf、krb5.conf跟DC域控主机名有关的配置，明明是对的怎么会报错呢？真是摸不着头脑？？？

没有在用户名加上 “@域名”，如：`administrator@WIN7.LOCAL`

```shell
[root@linux ~]# net rpc join -U administrator
Enter administrator's password:
kerberos_kinit_password administrator@WIN7 failed: Cannot find KDC for requested realm
Using short domain name -- WIN7
Joined 'LINUX' to realm 'win7.local'
```

### DNS update failed: NT_STATUS_INVALID_PARAMETER

如下报错参考[Samba Net Ads Join “DNS Update Failed” Error Fixed](http://www.kombitz.com/2012/03/05/samba-net-ads-join-dns-update-failed-error-fixed/) 错误原因为hosts仅写入了计算机名“linux”，而没有在后面跟上域名，也就是没将主机名补充完整 “linux7.win7.local”。

```shell
[root@linux ~]# net ads join -U administrator
Enter administrator's password:
Using short domain name -- WIN7
Joined 'LINUX' to dns domain 'win7.local'
No DNS domain configured for linux. Unable to perform DNS Update.
DNS update failed: NT_STATUS_INVALID_PARAMETER
```

### AD域账户id可以显示，但cat /etc/passswd没有记录

如题就证明AD域账户的数据库不是写在了 `/etc/passwd`中，使用`getent passwd 用户名` 可查到相应的域账户。翻阅资料根据[Samba结合AD实现域帐号认证的文件服务器](https://www.cnblogs.com/IvanChen/p/4739092.html)所述：`winbind trusted domains only = yes` 决定getent passwd是否能获得域帐号。

根据[《Linux菜鸟入门2》Ldap](https://blog.51cto.com/12157236/1874077)所说的getent passwd  如果用户信息可以正常显示，证明ldap客户端认证成功，没想到这里又引出一个新的概念LDAP：

* [wilburxu-LDAP概念和原理介绍](https://www.cnblogs.com/wilburxu/p/9174353.html)

* [jpfss-Linux下LDAP统一认证解决方案](https://www.cnblogs.com/jpfss/p/11021948.html)

原来域账户是存在winbind的数据库中，登录时根据此前pam.d配置的可插拔模块，完成家目录的创建。图中hr004未登录用户。

![Snipaste_2020-11-13_09-52-23.png](https://i.loli.net/2020/11/13/Sc1Xu6A7PC2YH5U.png)



###  pam_krb5.so not found

可以使用`whereis`来验证模块是否存在，从而验证完整性，再使用yum安装 。

![](https://i.loli.net/2020/11/13/sDVfmBPyd53cJYg.png)

我在翻阅 [chinaunix-PAM配置](http://blog.chinaunix.net/uid-291705-id-2134362.html)了解到，`pam.d/system-auth`就是用做账户验证与会话管理的，还有一些关于requisite、required、sufficient、optional这类control_flag的涵义。



###  结语

直到自己搭建samba项目所遇到各种报错，看着报错提示，似懂非懂又摸不着头脑，明明自己配置的没问题呀，整个人都处于迷糊的状态。

做完项目后，自己想了想原因才发现这些之前自己的教训都是没有一个项目整体的框架图，没有明确各项组件在项目中的作用、组件中的配置是在项目中承载那一块业务支持的，也就是哪些才是核心模块，是真正掌握的重点。也由此想到一些lights：

我们的专业知识学习看似循序渐进章节明确，但又往往很零碎，我们初期阶段整合集成项目很是困难，经常被弄得头晕脑涨的。一个人集成起来实为困难，若是有一个团队每个人承担着不同分工，相对的

一个人集成起来在项目中是不可或缺的存在，若是集成模块分工化，每个人负责不同的业务逻辑，相互协作组装成一个大项目就容易了许多。分工看起来很专业化，假设我把每条指令作为流水线，每个人作为其中一条指令的作业员，其可替代性强，且更换成本低。

集成在初期本身就要投入大量精力且困难的事情，经验尚浅的朋友采取合作完成项目的形式，是高效且快速的，若要在分工项目中体现出重要性就专注某一方面来体现优势。

建议在做集成项目时，用黑板或是白纸手绘一张大概整体功能及结构拓扑，虽说没各项一一详尽，但梳理出了一个整体性的框架，这样项目实施起来方向就明确了许多，也有利于节奏把控与异常排查。

![image-20201113153331475.png](https://i.loli.net/2020/11/13/NvZzM6H3nlERuPq.png)

## 参考文献

* [linuxcn-如何让 Linux 机器加入 Windows 的 AD 域](https://linux.cn/article-7695-1.html)
* [程序园-Windows AD域用户访问Linux samba服务](http://www.voidcn.com/article/p-smihtnxg-bpn.html)
* [将samba加入到windows域《转载》](https://www.cnblogs.com/rusking/p/3993148.html)
* [Windows Active Directory 域故障排错（三）](https://blog.51cto.com/zhangdonghui/62869)
* [51cto-windows server 2008 R2 enterprise AD域控服务器安装](https://blog.51cto.com/12476193/2123191)
*  [Linux 下为何要关闭 SELinux？ - Hongbo He的回答 - 知乎](https://www.zhihu.com/question/20559538/answer/761147959) 
* [Samba启动服务中的nmb是什么](https://blog.csdn.net/qq_30782455/article/details/96345259)
* [Windows Kerberos客户端配置并访问CDH](https://blog.csdn.net/weixin_42438176/article/details/87127632)
* [Sina-sssd 系统安全服务守护进程](http://blog.sina.com.cn/s/blog_588c88cb0100ywoh.html)
* [RedHat-SSSD vs Winbind](https://www.redhat.com/zh/blog/sssd-vs-winbind)
* [csdn-红帽企业级Linux 7和 Windows集成指南](https://blog.csdn.net/qtm_gitee/article/details/102879486)
* [Linux可插拔认证模块的基本概念与架构](https://blog.csdn.net/cpongo4/article/details/89166312)
* [ariclee-常用的Linux可插拔认证模块（PAM）应用举例(一)](https://www.cnblogs.com/ariclee/p/4723835.html)
*  [chinaunix-winbind实现用windows账户登录linux机器](http://blog.chinaunix.net/uid-73604-id-2058303.html) 
* [Samba Net Ads Join “DNS Update Failed” Error Fixed](http://www.kombitz.com/2012/03/05/samba-net-ads-join-dns-update-failed-error-fixed/) 
* [wilburxu-LDAP概念和原理介绍](https://www.cnblogs.com/wilburxu/p/9174353.html)
* [jpfss-Linux下LDAP统一认证解决方案](https://www.cnblogs.com/jpfss/p/11021948.html)
*  [chinaunix-netid-PAM配置](http://blog.chinaunix.net/uid-291705-id-2134362.html)