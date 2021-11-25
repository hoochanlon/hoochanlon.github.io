---
title: “hexo备份并推送到github（二）”
author: hoochanlon
categories: [Blogging, Hexo]
tags: [博客配置存档]
math: true
mermaid: true
date: 2018-02-26 03:10:54
---

 使用git推送至github备份hexo的其他博客主题

* 创建远程仓库 ...
* 本地初始化 `git init`
* 创建忽略文件 `vi .gitignore`  
* [Git忽略规则](https://www.cnblogs.com/kevingrace/p/5690241.html)
* 在hexo的根目录下新建`README.md`
* 按需分配

    ```
    .DS_Store
    Thumbs.db
    db.json  
    *.log
    .deploy*/
    node_modules/
    .npmignore
    public/
    ```

* Windows10以`gitignore.txt`保存配置，再另存为并改名
* 添加所有文件到寄存区 `git add .`
* 提交 `git commit -m "commit"`
* 添加远程源 `git remote add origin yourname@github.com/example.git`
* 提交远程库master分支 `git push -u origin master`
