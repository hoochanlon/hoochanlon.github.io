---
title: "github action for gh pages"
date: 2021-04-19 12:20:31 +0800
author: hoochanlon
categories: [Blogging, Jekyll]
tags: [博客配置存档]
---

fatal: could not read Password for 'https://github.com': No such device or address。在此期间我试了很多次解决此类问题，否定了有关于网上所说的：git远程仓，账户@密码.git、ssh key等相关原因。没有必要再纠结于此，随后尝试了其他的action。

虽然都是为了push gh-pages而实现的，每个action for gh-page实际提供的键值对也是各有迥异。后来部署成功是因为比对如下的repo的用例说明，发现了历史版本键值对的键参数格式的变更问题。

 <!-- more -->

* [vuepress-deploy](https://github.com/jenkey2011/vuepress-deploy)
* [github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action)
* [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)

`actions/checkout@v2`，这是github官方的一个action，用于clone该仓库的源码到工作流中。如下代码其实说白了，我就做三件事情：

* 代码导入系统容器
* yarn install与build doc
* 上传到gh-page分支

```yaml
{%raw%}
name: Deploy GitHub Pages

# 触发条件：在 push 到 master 分支后
on:
  push:
    branches:
      - master

# 任务
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          persist-credentials: false

      - name: install
        run: yarn install

      - name: Build
        run:  yarn docs:build

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@4.1.1
        with:
          token: ${{ secrets.ACCESS_TOKEN }}
          branch: gh-pages # The branch the action should deploy to.
          folder: docs/.vuepress/dist # The folder the action should deploy.
{%endraw%}
```

`persist-credentials: false`，[actions/checkout](https://github.com/actions/checkout)对此的说明：

```
# Whether to configure the token or SSH key with the local git config
# Default: true
persist-credentials: ''
```
是使用本地git config配置令牌还是SSH密钥，难怪`persist-credentials: false`之后需要`${{ secrets.ACCESS_TOKEN }}`验证。

这个`${{ secrets.ACCESS_TOKEN }}`一开始也是，让我想了好久。它实际上为GitHub设置中的`Settings Developer settings/Personal access tokens`的生成令牌。将令牌复制到repo的`Actions secrets`并命名为`ACCESS_TOKEN`。
