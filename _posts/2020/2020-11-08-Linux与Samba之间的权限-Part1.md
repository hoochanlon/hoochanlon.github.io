---
title: Linux与Samba之间的权限 Part1
author: hoochanlon
categories: [daily note,--2020,chip]
tags: [chip]
math: true
mermaid: true
date: 2020-11-08 18:40:12
---

Samba安装配置过程脚本之家的这篇文章写的很详细： [jb51net-Centos 7 Samba服务安装方法详解](https://www.jb51.net/article/162573.htm)，此外我们还需要注意权限分配的问题：

* smb、nmb服务开启（nmb服务是负责解析用的，类似与DNS实现的功能）
* selinux 与 firewalld 禁用
* 建议注释掉homes再配置共享（homes生成的目录，反倒成了干扰）
* smb 读写执行依赖于Linux系统用户权限

[第十六章、檔案伺服器之二： SAMBA 伺服器](http://linux.vbird.org/linux_server/0370samba.php)

read：r，write：w，execute：x；rwx整合在一起就是可读可写可执行。

> 图片整合自 [csdn-qq_42325315-linux权限说明](https://blog.csdn.net/qq_42325315/article/details/80474607)

![20180604003458118.png](https://i.loli.net/2020/11/04/5Q9GfDTuqU2aIzH.png)

samba权限是在Linux分配权限基础之上再进行调配的，例如Linux的普通用户权限不够，在smb设置成777之类权限也无济于事，依旧访问不了smb设定的共享目录；在samba创建了root用户，但在samba中未对root进行配置指定的目录访问权限，就算用root登录也是不能访问该目录的。

关于上述可以用`su 普通用户名`切换登录，然后到目录中进行rwx实验，，这也是建议初次搭建samba建议最好也创建一个root级的smb用户的原因，方便研究与故障排查。

```shell
# Linux分配目录权限 

## 创建组并将新创建的用户添加到组内，参数前面第一个guest为组名
groupadd guest && useradd -g guest guest && passwd
## 赋给用户guest读写执行权限到 /home/guest/data 目录
setfacl -m u:guest:rwx -R /home/guest/data/
## 赋给guest组读写执行权限到 /home/guest/data 目录
setfacl -m g:guest:rwx -R /home/guest/data

# 参考 https://www.cnblogs.com/Jimmy1988/p/7260215.html
```

扩展阅读了[Linux文件权限与属性详解 之 SUID、SGID & SBIT](https://www.cnblogs.com/Jimmy1988/p/7260215.html)，部分文件除rwx额外带“s”与“t”，s即为设置uid、gid，t即为粘滞位，粘滞位作用是以防止普通用户删除或移动其他用户的文件。

## 对用户及组“所属者“与”权限“踩坑过程

我们先创建一个用户public，加入guest组`useradd -g guest public && passwd` 。再将guest用户设置成同名组的管理员` gpasswd -A guest（用户） guest`试下粘滞位。

别忘了创建系统用户的同时，相对的给smb也创建一个，但进入"来宾共享资源目录"出现了意外。😁

![1-37-51.png](https://i.loli.net/2020/11/08/NVXeuUYiwoagC7O.png)

```shell
setfacl -m g:guest:rwx -R /home/guest/来宾共享目录
systemctl restart smb
```

配置了如上指令还是访问无效，接着将来宾目录的rwx赋给test组，将用户peter加入到该组中，smb的valid users也改成@test，进行测试，还是不成。于是`su peter`访问目录发现Linux权限是拒绝的...把peter提升至组管理员也以失败告终。

再阅读配置文件，首先valid user是生效的，因为生效后才能见着共享目录，访问受限是因为Linux的普通用户根本无法访问其他用户的家目录文件。于是又尝试了以下方法：

* chgrp -R 组名 文件/目录名      表示递归修改文件/目录的所属组！
* create directory mask升级到777

以上都无效，终于

```
chown -R peter:test guest # 所有文件与子目录的拥有者皆设为peter，使用群组test
```

成功了进入共享目录，peter是可以rwx的，我们再将此前创建的用户加入到test组测试，结果访问无效！😱怎样才能让smb配置@test生效呢？

### 跳坑转机

我的当前情况是用户public有两个组，test、guest；于是我`usermod -g test public` 改成一个test组，去掉guest看看行不行？居然还是不行！！！

最后参考 [【Linux】Linux下文件的权限管理和所属用户所属组](https://www.cnblogs.com/html55/p/13516659.html)所说的：

> **权限要从最外层的文件夹开始进入**，**父级文件夹只要有x权限，那么子级文件夹就不受父级文件夹的影响了。父级文件夹没有x权限，其下的文件和文件夹在操作时会受到影响。**
>
> **有点类似大院子嵌套小院子，大院子没有x权限（没有钥匙），就进入不了大院子，那你们的小院子，你有钥匙也没有用。**

马上用`ls -ll /home`查看了下权限，于是发现了其中的端倪，于是将所属组权限改成 4+2+1，这次总算是明白了问题所在，总算搞定了。

> 参考[Linux 之 用户、用户组以及权限](https://www.cnblogs.com/xs104/p/4510114.html)
>
> * 图中的d代表目录；另外，l代表link、b储存设备、c键盘、鼠标等。

![5-11.png](https://i.loli.net/2020/11/08/ROABXQvo4xGmkHD.png)

**将文件目录分配给某个指定组，不代表指定组就有读写执行权限，这才是关键！Windows的思维有些严重了，走了很大的弯路。**但如果 `chmod 770 -R -v /home`又出现了同类型状况。

![4-01.png](https://i.loli.net/2020/11/08/4eFEQZ6qOu3GWiU.png)

因为不知道home原先权限，大脑也被折腾胀了，无奈将Linux还原😔，Linux初始home权限是755

![4-5.png](https://i.loli.net/2020/11/08/xuqmMH7bf9oFwiI.png)

由于我们把Linux还原需要重新配置samba，这里做个小总结：

* 创建Linux用户与samba用户，并将用户分配到特定组
* 将目录权限分配到特定组，设置群管理
* 创建共享目录并在smb.conf配置
* 管理->服务->workstation重启可以清除smb账号信息，完成重新登录

## Linux粘滞位

回顾上节，我们扩展阅读了[Linux文件权限与属性详解 之 SUID、SGID & SBIT](https://www.cnblogs.com/Jimmy1988/p/7260215.html)，部分文件除rwx额外带“s”与“t”，s即为设置uid、gid，t即为粘滞位，粘滞位作用是以防止普通用户删除或移动其他用户的文件。处于业务需要，用户也需要向目录写入文件、删除自己的文件，但不能胡乱删除同事的文件，基于这个要求设置

`chmod -R o+t  /home/guest/ # 添加目录粘滞位`但这么一来，文件所属人又删除不了其他用户的文件了。

![8-47.png](https://i.loli.net/2020/11/08/uCNIeLxpV96Kocd.png)

此时smb.conf设置目录的admin user键即可解决这类问题。

![44-02.png](https://i.loli.net/2020/11/08/5aRG6kiCw4Pojef.png)


## 参考文献

* [Samba共享权限分配](https://www.cnblogs.com/liuquan/p/5644760.html)
* [菜鸟教程-Linux 命令大全](https://www.runoob.com/linux/linux-command-manual.html)
* [Linux文件权限与属性详解 之 SUID、SGID & SBIT](https://www.cnblogs.com/Jimmy1988/p/7260215.html)
*  [Linux中的组管理员-gpasswd](https://blog.csdn.net/u010599211/article/details/84969308)
* [【Linux】文件的权限管理及特殊属性-粘滞位（sticky bit）概述](https://blog.csdn.net/her__0_0/article/details/53930785)
* [Linux 之 用户、用户组以及权限](https://www.cnblogs.com/xs104/p/4510114.html)
* [第十六章、檔案伺服器之二： SAMBA 伺服器](http://linux.vbird.org/linux_server/0370samba.php)
*  [jb51net-Centos 7 Samba服务安装方法详解](https://www.jb51.net/article/162573.htm)