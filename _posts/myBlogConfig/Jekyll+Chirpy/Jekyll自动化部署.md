---

title: GitHub action自动化部署
author: hoochanlon
categories: [Blogging, Jekyll]
tags: [typography]
math: true
mermaid: true
math: true
mermaid: true
date: 2021-04-02 10:22:04

---

## github action gh-pages

我在下意识搜索大部分博客文章都是对GitHub action复杂化，而不是从最简单的例子入手，似乎成了为了做事情而做事情，为了无意义的折腾而折腾。

### 两个例子

* [GitHub docs-构建和测试 Ruby](https://docs.github.com/cn/actions/guides/building-and-testing-ruby)
* [Simple GitHub Pages Deploy Action](https://github.com/marketplace?type=actions&query=action+gh-pages)

核心目的：

* 博客环境：构建出ruby环境用已有的gemfile进行bundle install将组件完全安装上。
* 生成的站点目录文件上传到gh-pages

```yml
name: push-gh-pages

on:
  push:
    branches: [master]

jobs:
  test:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Set up Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: 2.6
    - name: Install dependencies
      run: bundle install
    - name: Run jekyll-build
      run: bundle exec jekyll build
    - name: Simple deploy with git
      uses: rdarida/simple-github-pages-deploy-action@v1
      with: # optional
        git-user: 'hoochanlon'
        git-email: 'hoochanlon@outlook.com'
        git-base-folder: '_site'
        commit-message: 'test'
        branch: 'gh-pages'
```

事实上我们是为了想要的理想化效果而实施操作的，如果这种操作极度繁杂实现困难，与其这样还不如不要。学会拒绝无意义的geek。