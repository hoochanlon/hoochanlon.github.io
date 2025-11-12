---
title: Butterfly-沙漠寂寞
categories: 博客主题
tags: 博客效果代码
description: 博客相关效果代码展示，内容比较长。
cover: 'https://tu.zbhz.org/i/2025/11/10/12814rg.png'
random_swiper_index: true
abbrlink: 64462
date: 2025-10-09 18:39:58
---


### 由点击微信图标展开二维码图片

自定义js

```JS
(function () {
  const container = document.querySelector('.card-info-social-icons');
  if (!container) return;

  const links = container.querySelectorAll('a');
  const insertIndex = 1; // 插入到第二个位置

  // 创建微信图标按钮
  const wechatBtn = document.createElement('a');
  wechatBtn.className = 'social-icon wechat-icon';
  wechatBtn.title = '微信';
  wechatBtn.href = 'javascript:void(0);';
  wechatBtn.innerHTML = '<i class="fab fa-weixin" style="color: #1AAD19;"></i>';
  wechatBtn.style.position = 'relative';

  // 创建弹窗元素（插入到 body，避免 overflow 限制）
  const qrPopup = document.createElement('div');
  qrPopup.className = 'wechat-qr-popup';
  qrPopup.style.cssText = `
    position: fixed;
    padding: 10px;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(6px);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: none;
    z-index: 9999;
    transition: opacity 0.2s ease, transform 0.2s ease;
  `;
  qrPopup.innerHTML = '<img src="/img/qr.png" alt="微信二维码" style="width:120px;height:120px;">';
  document.body.appendChild(qrPopup);

  // 插入微信图标到指定位置
  if (links.length > insertIndex) {
    container.insertBefore(wechatBtn, links[insertIndex]);
  } else {
    container.appendChild(wechatBtn);
  }

  // 状态标记：是否显示弹窗
  let isVisible = false;

  // 点击图标切换弹窗显示/隐藏
  wechatBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const rect = wechatBtn.getBoundingClientRect();
    if (!isVisible) {
      qrPopup.style.left = `${rect.left + rect.width / 2}px`;
      qrPopup.style.top = `${rect.bottom + 8}px`;
      qrPopup.style.transform = 'translateX(-50%)';
      qrPopup.style.opacity = '1';
      qrPopup.style.display = 'block';
      isVisible = true;
    } else {
      qrPopup.style.display = 'none';
      qrPopup.style.opacity = '0';
      isVisible = false;
    }
  });

  // 点击空白处关闭弹窗
  document.addEventListener('click', function () {
    qrPopup.style.display = 'none';
    qrPopup.style.opacity = '0';
    isVisible = false;
  });

  // 阻止点击弹窗时关闭
  qrPopup.addEventListener('click', function (e) {
    e.stopPropagation();
  });
})();
```

在主题配置文件插入该js

```yml
inject:
  bottom:
```

### 随机选图

从自己站点中随机选的图片

```yml
inject:
  head:
  bottom:
    - <script> let backimg =["url(/images/draw.JPG)","url(/images/life.jpg)","url(/images/idea.jpg)","url(/images/study.jpg)"];let index = Math.ceil(Math.random() * (backimg.length-1)) - 1;document.getElementById("web_bg").style.backgroundImage = backimg[index]</script>
```

从bing中随机选的图片

```js
const minPage = 300;
const maxPage = 350;
const limit = 10;
const targetId = "web_bg";

// 每天生成稳定页码（只在 300–350 范围内）
const today = new Date();
const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
const page = (daySeed % (maxPage - minPage + 1)) + minPage;

// 请求 Bing 图片 API
fetch(`https://api.bimg.cc/all?page=${page}&order=asc&limit=${limit}&w=1920&h=1080&mkt=zh-CN`)
  .then(response => response.json())
  .then(data => {
    const images = Array.isArray(data.data) ? data.data : [];
    if (!images.length) throw new Error("图片列表为空");

    const randomIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[randomIndex].url;

    const img = new Image();
    img.onload = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.style.backgroundImage = `url(${imageUrl})`;
        target.style.backgroundSize = "cover";
        target.style.backgroundPosition = "center";
      }
    };
    img.onerror = () => {
      console.warn("图片加载失败，使用备用图");
      const fallback = "/img/fallback.jpg";
      const target = document.getElementById(targetId);
      if (target) {
        target.style.backgroundImage = `url(${fallback})`;
        target.style.backgroundSize = "cover";
        target.style.backgroundPosition = "center";
      }
    };
    img.src = imageUrl;
  })
  .catch(error => {
    console.error("获取 Bing 图片失败：", error);
  });

```


### 小图标与杂项

在 {% label \butterfly\layout\includes\widget\card_announcement.pug blue %}  注释掉小喇叭


```pug
//- i.fas.fa-bullhorn.fa-shake 抖动很烦人
i.fas.fa-bullhorn 
```

 在 {% label source\css\_layout\aside.styl blue %} 禁用头像旋转，social 图标旋转也是这样注释。

```styl
.avatar-img
  overflow: hidden
  margin: 0 auto
  width: 110px
  height: 110px
  border-radius: 70px

  img
    width: 100%
    height: 100%
    transition: filter 375ms ease-in .2s, transform .3s
    object-fit: cover
    // 禁止旋转
    // &:hover
    //   transform: rotate(360deg)
```

禁用设置旋转，在{% label layout\includes\rightside.pug blue %}，去掉`fa-spin`

```pug
  #rightside-config-show
    if needCogBtn
      button#rightside-config(type="button" title=_p("rightside.setting"))
        i.fas.fa-cog(class=theme.rightside_config_animation ? 'fa-spin' : '')
```

关闭分割线动画，在 {% label source\css\_global\function.styl blue %}，定位到 `.custom-hr`,注释掉如下代码

```styl
    &:hover
      &:before
        left: calc(95% - 20px)
```


 在 {% label source\css\_layout\footer.styl  blue %} 修改页脚颜色

```styl
  background-color: $light-blue
  background: #b7b7b5!important
```

添加天气组件 {% label hoochanlon.github.io\source\_data\widget.yml  blue %}

```
top:
  - class_name: user-weather
    name: 天气
    icon: fa-solid fa-sun-cloud
    order: 5
    html: |
     <div id="ww_62f74659400aa" v='1.3' loc='auto' a='{"t":"horizontal","lang":"zh","sl_lpl":1,"ids":[],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"image","cl_font":"#FFFFFF","cl_cloud":"#FFFFFF","cl_persp":"#81D4FA","cl_sun":"#FFC107","cl_moon":"#FFC107","cl_thund":"#FF5722"}'><a href="https://weatherwidget.org/zh/" id="ww_62f74659400aa_u" target="_blank">天气插件</a></div>
      <script async src="https://app3.weatherwidget.org/js/?id=ww_62f74659400aa"></script>
```


### 重定向

发现手机重定向加载太慢，还是写一个重定向页面。在source加入nav文件夹加入index.html重定向页面。默认情况下，Hexo也会将这部分进行处理，导致这些页面渲染上了博客主题。这个时候就需要忽略掉该文件 _config.yml

```
# 指定不进行渲染的文件或文件夹
skip_render:
- 'nav/*'
```

重定向 HTML 1

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@4.5.12/index.min.css">
  <title>正在跳转...</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      font-family: 'Segoe UI', sans-serif;
      color: #333;
    }
    body:lang(zh-CN) {
    font-family: 'LXGW WenKai Screen', sans-serif;
    }

    body:lang(en) {
    font-family: 'JetBrains Mono', monospace;
    }
    .loader {
      border: 6px solid #f3f3f3;
      border-top: 6px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .message {
      font-size: 1.2rem;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="loader"></div>
  <div class="message">正在跳转，请稍候...</div>

  <script>
    // 设置跳转目标和延迟时间（毫秒）
    const targetURL = "https://nav-lfuv.vercel.app/";
    const delay = 2000;

    setTimeout(() => {
      window.location.href = targetURL;
    }, delay);
  </script>
</body>
</html>
```

重定向 HTML 2

```HTML
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>正在跳转...</title>

  <!-- 字体引入 -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.7.0/style.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@4.5.12/index.min.css">

  <style>
    body {
      margin: 0;
      padding: 0;
      background: url('/img/caffe.png') no-repeat center center;
      background-size: cover;
      font-family: 'LXGW WenKai Screen', sans-serif;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 16px;
      padding: 40px;
      backdrop-filter: blur(20px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      text-align: center;
      max-width: 90%;
    }

    .loader {
      border: 6px solid #f3f3f3;
      border-top: 6px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }


    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .message {
      font-size: 1.2rem;
      margin-bottom: 10px;
    }

    .fallback {
      margin-top: 20px;
      font-size: 0.97rem;
      font-weight: 500;
      color: #222;
      line-height: 1.6;
    }

    .fallback a {
      font-weight: 600;
      color: #007acc;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="glass-card">
    <div class="loader"></div>

    <div class="message">正在跳转，请稍候...</div>
    <div class="fallback">
      如果未能自动跳转，请&nbsp;<a href="nav-hoo.vercel.app" target="_blank" rel="noopener">点击此处&nbsp;</a>访问。
    </div>
  </div>

  <script>
    const targetURL = "https://nav-hoo.vercel.app";
    const delay = 500;
    setTimeout(() => {
      window.location.href = targetURL;
    }, delay);
  </script>
</body>
</html>
```

### 博客音乐

非全局的单个文章配置音乐盒吸底：文章页 `aplayer: true` 开启后，直接在文章复制粘贴这段div

```
<div class="aplayer no-destroy" data-id="9593638671" data-server="tencent" data-type="playlist" data-fixed="true" data-autoplay="true"> </div>
```

在文章页上音乐盒

```
{% meting "14405552446" "netease" "playlist" "mutex:true" "listmaxheight:300px" "preload:auto" "theme:#ad7a86" %}
```

[hexo配置安知鱼音乐页面](https://wenjiew-astro.github.io/2025/09/01/hexo配置安知鱼音乐页面/index.html)


### 返回首页 优化 返回文章所在页 

`themes\butterfly\languages\zh-CN.yml` 添加以下代码

```
post:
  back_to_home: 返回首页
  back_to_current_page: 返回文章所在页
```


{%note success%}
复制以下代码，全部替换
{%endnote%}

`\themes\butterfly\layout\includes\mixins\indexPostUI.pug`

```
// ==========================
// Butterfly 首页文章列表模板
// 增加分页来源参数 (?from=page&page=current)
// ==========================

mixin indexPostUI()
  - const indexLayout = theme.index_layout
  - const masonryLayoutClass = (indexLayout === 6 || indexLayout === 7) ? 'masonry' : ''
  #recent-posts.recent-posts.nc(class=masonryLayoutClass)
    .recent-post-items
      each article, index in page.posts.data
        .recent-post-item
          - const link = article.link || article.path
          - const title = article.title || _p('no_title')
          - const leftOrRight = indexLayout === 3 ? (index % 2 === 0 ? 'left' : 'right') : (indexLayout === 2 ? 'right' : '')
          - const post_cover = article.cover
          - const no_cover = article.cover === false || !theme.cover.index_enable ? 'no-cover' : ''
          // ✅ 为首页分页文章拼接正确的来源参数：?from=page&page=当前页
          - const linkWithPage = link + (page.current ? `?from=page&page=${page.current}` : '')

          // ==========================
          // 封面部分
          // ==========================
          if post_cover && theme.cover.index_enable
            .post_cover(class=leftOrRight)
              a(href=url_for(linkWithPage) title=title)
                if article.cover_type === 'img'
                  img.post-bg(src=url_for(post_cover) onerror=`this.onerror=null;this.src='${url_for(theme.error_img.post_page)}'` alt=title)
                else
                  div.post-bg(style=`background: ${post_cover}`)

          // ==========================
          // 文章信息部分
          // ==========================
          .recent-post-info(class=no_cover)
            // ✅ 标题链接带来源参数
            a.article-title(href=url_for(linkWithPage) title=title)
              if globalPageType === 'home' && (article.top || article.sticky > 0)
                i.fas.fa-thumbtack.sticky
              = title

            .article-meta-wrap
              if theme.post_meta.page.date_type
                span.post-meta-date
                  if theme.post_meta.page.date_type === 'both'
                    i.far.fa-calendar-alt
                    span.article-meta-label=_p('post.created')
                    time.post-meta-date-created(datetime=date_xml(article.date) title=_p('post.created') + ' ' + full_date(article.date))= date(article.date, config.date_format)
                    span.article-meta-separator |
                    i.fas.fa-history
                    span.article-meta-label=_p('post.updated')
                    time.post-meta-date-updated(datetime=date_xml(article.updated) title=_p('post.updated') + ' ' + full_date(article.updated))= date(article.updated, config.date_format)
                  else
                    - const data_type_updated = theme.post_meta.page.date_type === 'updated'
                    - const date_type = data_type_updated ? 'updated' : 'date'
                    - const date_icon = data_type_updated ? 'fas fa-history' : 'far fa-calendar-alt'
                    - const date_title = data_type_updated ? _p('post.updated') : _p('post.created')
                    i(class=date_icon)
                    span.article-meta-label= date_title
                    time(datetime=date_xml(article[date_type]) title=date_title + ' ' + full_date(article[date_type]))= date(article[date_type], config.date_format)

              if theme.post_meta.page.categories && article.categories.data.length > 0
                span.article-meta
                  span.article-meta-separator |
                  each item, index in article.categories.data
                    i.fas.fa-inbox
                    a(href=url_for(item.path)).article-meta__categories #[=item.name]
                    if index < article.categories.data.length - 1
                      i.fas.fa-angle-right.article-meta-link

              if theme.post_meta.page.tags && article.tags.length > 0
                span.article-meta.tags
                  span.article-meta-separator |
                  each item, index in article.tags.data
                    i.fas.fa-tag
                    a(href=url_for(item.path)).article-meta__tags #[=item.name]
                    if index < article.tags.data.length - 1
                      span.article-meta-link #[='•']

              mixin countBlockInIndex
                - needLoadCountJs = true
                span.article-meta
                  span.article-meta-separator |
                  i.fas.fa-comments
                  if block
                    block
                  span.article-meta-label= ' ' + _p('card_post_count')

              if theme.comments.card_post_count && theme.comments.use
                case theme.comments.use[0]
                  when 'Disqus'
                  when 'Disqusjs'
                    +countBlockInIndex
                      a.disqus-count(href=full_url_for(linkWithPage) + '#post-comment')
                        i.fa-solid.fa-spinner.fa-spin
                  when 'Valine'
                    +countBlockInIndex
                      a(href=url_for(linkWithPage) + '#post-comment')
                        span.valine-comment-count(data-xid=url_for(linkWithPage))
                          i.fa-solid.fa-spinner.fa-spin
                  when 'Waline'
                    +countBlockInIndex
                      a(href=url_for(linkWithPage) + '#post-comment')
                        span.waline-comment-count(data-path=url_for(linkWithPage))
                          i.fa-solid.fa-spinner.fa-spin
                  when 'Twikoo'
                    +countBlockInIndex
                      a.twikoo-count(href=url_for(linkWithPage) + '#post-comment')
                        i.fa-solid.fa-spinner.fa-spin
                  when 'Facebook Comments'
                    +countBlockInIndex
                      a(href=url_for(linkWithPage) + '#post-comment')
                        span.fb-comments-count(data-href=urlNoIndex(article.permalink))
                  when 'Remark42'
                    +countBlockInIndex
                      a(href=url_for(linkWithPage) + '#post-comment')
                        span.remark42__counter(data-url=urlNoIndex(article.permalink))
                          i.fa-solid.fa-spinner.fa-spin
                  when 'Artalk'
                    +countBlockInIndex
                      a(href=url_for(linkWithPage) + '#post-comment')
                        span.artalk-count(data-page-key=url_for(linkWithPage))
                          i.fa-solid.fa-spinner.fa-spin

            - const content = postDesc(article)
            if content
              .content!=content

        if theme.ad && theme.ad.index
          if (index + 1) % 3 === 0
            .recent-post-item.ads-wrap!= theme.ad.index

    include ../pagination.pug
```


`\themes\butterfly\layout\category.pug`

```
extends includes/layout.pug

block content
  // ============================================================
  // 分类页模板 category.pug
  // 自动为文章链接附带来源参数：from=categories/<分类名>&page=页码
  // ============================================================

  if theme.category_ui == 'index'
    include ./includes/mixins/indexPostUI.pug
    +indexPostUI
  else
    include ./includes/mixins/article-sort.pug

    #category
      .article-sort-title
        i.fa-solid.fa-folder-open
        | #{_p('page.category')} - #{page.category}

      // ✅ 传递分类路径与页码
      +articleSort(page.posts, { fromPath: 'categories/' + page.category, currentPage: page.current })

      include includes/pagination.pug
```

`themes\butterfly\layout\tag.pug`

```
extends includes/layout.pug

block content
  // ============================================================
  // 标签页模板 tag.pug
  // 自动为文章链接附带来源参数：from=tags/<标签名>&page=页码
  // ============================================================

  include ./includes/mixins/article-sort.pug

  #tag
    .article-sort-title
      i.fa-solid.fa-tags
      | #{_p('page.tag')} - #{page.tag}

    // ✅ 传递标签路径与页码
    +articleSort(page.posts, { fromPath: 'tags/' + page.tag, currentPage: page.current })

    include includes/pagination.pug

```


`\themes\butterfly\layout\archive.pug`

```
extends includes/layout.pug

block content
  // ============================================================
  // 归档页模板 archive.pug
  // 自动为文章链接附带来源参数：from=archives&page=页码
  // ============================================================

  include ./includes/mixins/article-sort.pug

  #archive
    #posts-calendar.js-pjax
    .article-sort-title
      i.fa-solid.fa-box-archive
      | #{_p('page.articles')} - #{getArchiveLength()}

    // ✅ 传递固定来源路径 "archives"
    +articleSort(page.posts, { fromPath: 'archives', currentPage: page.current })

    include includes/pagination.pug
```

`\themes\butterfly\layout\includes\mixins\article-sort.pug`


```
// ============================================================
// 文章列表排序组件（适用于分类页、标签页、归档页）
// 自动识别来源路径 (fromPath) 和当前分页页码 (currentPage)
// ============================================================

mixin articleSort(posts, opts)
  -
    // 1️⃣ 获取传入参数（来源路径和当前页码）
    const fromPath = (opts && opts.fromPath) ? opts.fromPath : ''
    const currentPage = (opts && opts.currentPage) ? opts.currentPage : ''

  .article-sort
    - let year
    - posts.forEach(article => {
      // 2️⃣ 获取文章所属年份，用于时间分组
      - const tempYear = date(article.date, 'YYYY')

      // 3️⃣ 判断文章是否有封面，用于样式区分
      - const noCoverClass = article.cover === false || !theme.cover.archives_enable ? 'no-article-cover' : ''
      - const title = article.title || _p('no_title')

      // 4️⃣ 生成文章基础链接
      - const baseLink = url_for(article.path)

      // 5️⃣ 拼接带来源参数的链接（⚠️ 使用字符串拼接，Pug 不支持模板字符串）
      - const hasFromInfo = fromPath && currentPage
      - const href = hasFromInfo ? (baseLink + '?from=' + fromPath + '&page=' + currentPage) : baseLink

      // 6️⃣ 年份标签（仅在年份变化时输出）
      if tempYear !== year
        - year = tempYear
        .article-sort-item.year= year

      // 7️⃣ 渲染文章条目
      .article-sort-item(class=noCoverClass)
        if article.cover && theme.cover.archives_enable
          a.article-sort-item-img(href=href title=title)
            if article.cover_type === 'img'
              img(
                src=url_for(article.cover)
                alt=title
                onerror=`this.onerror=null;this.src='${url_for(theme.error_img.post_page)}'`
              )
            else
              div(style=`background: ${article.cover}`)
        .article-sort-item-info
          .article-sort-item-time
            i.far.fa-calendar-alt
            time.post-meta-date-created(
              datetime=date_xml(article.date)
              title=_p('post.created') + ' ' + full_date(article.date)
            )= date(article.date, config.date_format)

          // 8️⃣ 带来源参数的文章标题链接
          a.article-sort-item-title(href=href title=title)= title
    - })

```



`\themes\butterfly\layout\includes\header\nav.pug`


```
// ============================================================
// Butterfly 主题导航栏 nav.pug
// 支持动态返回 分类 / 标签 / 归档 / 首页分页 来源（精准页码返回）
// ============================================================

nav#nav
  span#blog-info
    // ========================
    // 非文章页：显示站点标题
    // ========================
    if globalPageType !== 'post'
      a.nav-site-title(href=url_for('/'))
        if theme.nav.logo
          img.site-icon(src=url_for(theme.nav.logo) alt='Logo')
        if theme.nav.display_title
          span.site-name=config.title

    // ========================
    // 文章页：显示文章标题与返回按钮
    // ========================
    if globalPageType === 'post' && theme.nav.display_post_title
      // 初始为主页链接，稍后 JS 动态修改为来源路径
      a.nav-page-title#nav-back(href=url_for('/'))
        span.site-name= page.title || config.title
        span.site-name
          i.fa-solid.fa-circle-arrow-left
          // 默认显示“返回首页”，JS 动态切换
          span#nav-back-text= ' ' + _p('post.back_to_home')

  // ========================
  // 菜单区域
  // ========================
  #menus
    if theme.menu
      != partial('includes/header/menu_item', {}, {cache: true})
      #toggle-menu
        span.site-page
          i.fas.fa-bars.fa-fw

  // ========================
  // 搜索按钮
  // ========================
  if theme.search.use
    #search-button
      span.site-page.social-icon.search
        i.fas.fa-search.fa-fw
        //- span= ' ' + _p('search.title')


// ============================================================
// ✅ JS：动态判断来源 → 精确返回到所在页（含 page/2/#content-inner）
// ============================================================
script.
  (function() {
    var backLink = document.getElementById('nav-back');
    var backText = document.getElementById('nav-back-text');
    if (!backLink || !backText) return;

    // 读取 URL 参数
    var params = new URLSearchParams(window.location.search);
    var from = params.get('from');     // 来源：page / categories/... / tags/... / archives
    var pageNum = params.get('page');  // 当前页码

    if (from) {
      // ✅ 解码中文路径并规范化（去除首尾斜杠）
      var normalized = decodeURIComponent(from).replace(/^\/|\/$/g, '');
      var isHomePagePager = (normalized === 'page'); // 是否为首页分页
      var href = '/';

      // ✅ 有分页号时
      if (pageNum && /^\d+$/.test(pageNum)) {
        if (isHomePagePager) {
          // 首页分页 → /page/2/#content-inner
          href = (pageNum === '1')
            ? '/'
            : '/page/' + pageNum + '/#content-inner';
        } else {
          // 分类 / 标签 / 归档分页
          href = (pageNum === '1')
            ? '/' + normalized + '/#content-inner'
            : '/' + normalized + '/page/' + pageNum + '/#content-inner';
        }
      } else {
        // ✅ 无分页号 → 第一页
        href = isHomePagePager ? '/' : '/' + normalized + '/#content-inner';
      }

      // ✅ 更新返回按钮
      backLink.href = href;
      backText.textContent = ' ' + '#{_p("post.back_to_current_page")}';

      console.log('[Butterfly] 返回路径:', href);
    } else {
      // ✅ 没有 from 参数 → 返回首页
      backLink.href = '/';
      backText.textContent = ' ' + '#{_p("post.back_to_home")}';
    }
  })();
```


### 分页

`\themes\butterfly\layout\includes\pagination.pug`

```
if page.total !== 1
  -
    const total = page.total
    const current = page.current
    const groupSize = 5   // 每组显示多少页
    const groupIndex = Math.ceil(current / groupSize)
    const startPage = (groupIndex - 1) * groupSize + 1
    const endPage = Math.min(startPage + groupSize - 1, total)
    const prevGroupPage = startPage - groupSize
    const nextGroupPage = endPage + 1

    // 图标
    const prevText = '<i class="fas fa-chevron-left fa-fw"></i>'
    const nextText = '<i class="fas fa-chevron-right fa-fw"></i>'
    const prevGroupText = '<i class="fas fa-angles-left fa-fw"></i>'
    const nextGroupText = '<i class="fas fa-angles-right fa-fw"></i>'

    // ✅ 自动识别当前分页基础路径（首页 / 分类 / 标签 / 归档）
    const base = page.base || '/'

    // ✅ 通用分页链接生成函数
    const pageLink = (num) => {
      if (num === 1) return url_for(base)
      return url_for(`${base.replace(/\/?$/, '/') }page/${num}/#content-inner`)
    }

  nav#pagination
    .pagination
      // 上一组
      if prevGroupPage >= 1
        a.extend.group-prev(href=pageLink(prevGroupPage))!= prevGroupText

      // 上一页
      if current > 1
        a.extend.prev(href=pageLink(current - 1))!= prevText

      // 当前组页码循环（带安全判断）
      if endPage >= startPage
        each i in Array(endPage - startPage + 1).fill().map((_, idx) => startPage + idx)
          if i === current
            span.page-number.current= i
          else
            a.page-number(href=pageLink(i))= i

      // 下一页
      if current < total
        a.extend.next(href=pageLink(current + 1))!= nextText

      // 下一组
      if nextGroupPage <= total
        a.extend.group-next(href=pageLink(nextGroupPage))!= nextGroupText

```


### nav 长标题滚动 v2

自定义css

```
 /* 公交车电子屏效果 */
.nav-page-title {
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  max-width: 220px;
  vertical-align: middle;
  text-decoration: none;
}

/* 默认不滚动 */
.nav-page-title .site-name:first-child {
  display: inline-block;
  white-space: nowrap;
  padding-left: 0;
  animation: none;
  padding-top: 8px;
  padding-bottom: 8px;
}

/* 启用滚动动画时 */
.nav-page-title .site-name:first-child.scroll-enabled {
  padding-left: 100%;
  animation: navMarquee 15s linear infinite;
}

/* 鼠标悬停暂停滚动 */
.nav-page-title:hover .site-name:first-child.scroll-enabled {
  animation-play-state: paused;
}

/* 返回按钮固定区域 */
.nav-page-title .site-name:last-child {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  flex-shrink: 0;
  animation: none !important;
}

/* 滚动动画关键帧 */
@keyframes navMarquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
```


`\themes\butterfly\layout\includes\header\nav.pug` 末尾添加，或独立JS

```JS
/**
 * Butterfly 顶部导航标题滚动检测（基于字符长度）
 * 当标题字数超过设定阈值时触发滚动动画
 */

(function() {
  function checkTitleScroll() {
    const title = document.querySelector('.nav-page-title .site-name:first-child');
    if (!title) return;

    const text = title.textContent.trim();

    // 🧮 统计字符数：中文算 1 个，英文/数字算 0.5 个
    const charCount = text.split('').reduce((count, ch) => {
      // 中文（含全角字符）匹配范围
      return count + (/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(ch) ? 1 : 0.5);
    }, 0);

    // 🚦 设置滚动触发阈值（中文约 18 字，英文约 24 字）
    const threshold = 18;

    if (charCount > threshold) {
      title.classList.add('scroll-enabled');
    } else {
      title.classList.remove('scroll-enabled');
    }

    console.log(`[nav-scroll] 标题长度: ${charCount}, 阈值: ${threshold}, 滚动: ${charCount > threshold}`);
  }

  window.addEventListener('load', () => {
    checkTitleScroll();

    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(() => setTimeout(checkTitleScroll, 200));
  });

  window.addEventListener('resize', checkTitleScroll);
})();
```



### 加载动画优化版

| 环节              | 原因                                 | 解决方案                                                      | 说明                              |
| --------------- | ---------------------------------- | --------------------------------------------------------- | ------------------------------- |
| **内容被 PJAX 清空** | 页面局部更新时，旧 DOM 被移除而加载层未及时显示         | **在捕获阶段监听 `pjax:send`**，提前触发 `preloader.show()`           | 捕获阶段可保证在内容被清空前执行，避免空窗期。         |
| **浏览器渲染延迟**     | JS 已修改样式，但浏览器未立即重绘                 | **强制重绘 `box.offsetHeight` 或使用 `requestAnimationFrame()`** | 让浏览器立即执行一次渲染队列，确保动画层立刻出现。       |
| **JS 控制显示滞后**   | 若 JS 文件未加载或延迟执行，初始状态为隐藏            | **CSS 默认显示 (`display:flex; opacity:1`)**                  | 确保加载动画在 HTML 阶段即存在，JS 只负责隐藏。    |
| **突兀闪烁**        | 加载层淡出过快，或与内容同时显隐                   | **添加 `opacity` 过渡动画与最短展示时长**                              | `transition` + 600ms 显示延迟，避免闪现。 |
| **归档页加载较慢**     | 内容体积大，PJAX 回调与渲染不同步                | **在 `pjax:complete` 延迟 150ms 调用 `preloader.hide()`**      | 保证内容绘制完成后再隐藏动画层。                |
| **锚点跳转 (hash)** | `#` 跳转不会触发 PJAX 或 DOMContentLoaded | **监听 `hashchange` 手动触发加载动画**                              | 兜底方案，避免页面局部滚动时出现短暂白屏。           |

💡 总结原理:白屏不是 Bug，而是渲染时机错位。

通过：

* CSS 默认可见（先显示）
* 捕获阶段监听（提前触发）
* 强制重绘（立即渲染）
* 延迟隐藏（后收尾）

四个层次的策略，可以让加载动画在任意跳转路径下都不缺席，真正实现：🌈 “在页面还没来得及显示任何内容前，用户看到的就是动画层。”



`\layout\includes\loading\fullpage-loading.pug`


```
// ============================================================
// Butterfly 无白屏加载动画增强版 ✅ (PJAX + Hash + CSS先显示)
// ============================================================

if theme.preloader && theme.preloader.enable
  #loading-box
    .loading-bg
      img.loading-img(
        class='nolazyload',
        src=loading_img ? url_for(loading_img) : "/img/avatar.png"
      )
      .loading-image-dot

script.
  (function() {
    const mode = "!{theme.preloader.mode || 'exclude'}";
    const pages = !{JSON.stringify(theme.preloader.pages || [])};
    const path = window.location.pathname;
    const box = document.getElementById("loading-box");

    let showLoading = true;
    if (mode === "exclude") {
      showLoading = !pages.some(p => p === "HOME" ? path === "/" : path.startsWith(p));
    } else if (mode === "include") {
      showLoading = pages.some(p => p === "HOME" ? path === "/" : path.startsWith(p));
    }

    if (!showLoading) {
      if (box) box.classList.add("loaded");
      return;
    }

    const preloader = {
      _start: 0,
      show() {
        if (!box) return;
        // 🚀 确保立刻可见
        box.classList.remove("loaded");
        box.style.display = "flex";
        box.style.opacity = "1";
        box.style.visibility = "visible";
        document.body.style.overflow = "hidden";
        preloader._start = Date.now();
      },
      hide(delay = 0) {
        if (!box) return;
        const elapsed = Date.now() - (preloader._start || 0);
        const minDelay = 600;
        const remain = Math.max(minDelay - elapsed, 0);
        setTimeout(() => {
          box.classList.add("loaded");
          document.body.style.overflow = "auto";
          if (window.WOW) new WOW().init();
        }, remain + delay);
      }
    };

    // 初始页面显示
    preloader._start = Date.now();

    document.addEventListener("DOMContentLoaded", () => preloader.hide());

    // === ✅ PJAX 加载动画增强逻辑 ===
    document.addEventListener("pjax:send", () => {
      if (!box) return;
      // ⚡️ 防止竞态：在清空旧 DOM 前立即显示
      requestAnimationFrame(() => {
        preloader.show();
      });
    }, true);

    document.addEventListener("pjax:complete", () => {
      // ⚡️ 延迟隐藏，防止内容尚未完全渲染
      setTimeout(() => preloader.hide(150), 150);
    }, true);

    // === Hash 跳转 ===
    window.addEventListener("hashchange", () => {
      if (!box) return;
      preloader.show();
      setTimeout(() => preloader.hide(200), 300);
    });
  })();


```

`themes\butterfly\source\css\_layout\loading.styl`

```
// ============================================================
// Butterfly - 无白屏加载动画样式 (Stylus)
// ============================================================

#loading-box
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  display flex                    // ✅ 默认显示（防白屏）
  justify-content center
  align-items center
  z-index 1001
  opacity 1
  overflow hidden
  transition opacity 0.4s ease    // ✅ 添加淡出过渡

.loading-bg
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%
  position relative
  background url(/img/cloud.png) no-repeat center center
  background-size cover
  transition opacity 0.3s
  opacity 1
  z-index 1001

  // ✅ 亚克力遮罩层
  &::before
    content ''
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background rgba(250, 251, 253, 0.6)
    backdrop-filter blur(12px) saturate(180%)
    -webkit-backdrop-filter blur(12px) saturate(180%)
    border 1px solid rgba(255, 255, 255, 0.2)
    z-index 0

// ✅ 夜间模式支持
body.dark
  .loading-bg::before
    background rgba(26, 26, 26, 0.45)
    backdrop-filter blur(10px) saturate(160%)
    -webkit-backdrop-filter blur(10px) saturate(160%)
    border 1px solid rgba(255, 255, 255, 0.1)

.loading-img
  width 100px
  height 100px
  border-radius 50%
  border 4px solid #f0f0f2
  animation rotateAvatar 1.2s linear infinite
  background url(/img/avatar.png) no-repeat center center
  background-size cover
  position relative
  z-index 1

// ✅ 当 loaded 类生效时淡出隐藏
#loading-box.loaded
  opacity 0
  pointer-events none
  transition opacity 0.4s ease
  .loading-bg
    opacity 0
    z-index -1000

@keyframes rotateAvatar
  0%
    transform rotate(0deg)
  100%
    transform rotate(360deg)
```



`\themes\butterfly\layout\includes\layout.pug`


```
// ============================================================
// Butterfly Layout - 无白屏加载动画版 ✅
// ============================================================

- var globalPageType = getPageType(page, is_home)
- var htmlClassHideAside = theme.aside.enable && theme.aside.hide ? 'hide-aside' : ''
- page.aside = globalPageType === 'archive' ? theme.aside.display.archive: globalPageType === 'category' ? theme.aside.display.category : globalPageType === 'tag' ? theme.aside.display.tag : page.aside
- var hideAside = !theme.aside.enable || page.aside === false ? 'hide-aside' : ''
- var pageType = globalPageType === 'post' ? 'post' : 'page'
- pageType = page.type ? pageType + ' type-' + page.type : pageType

doctype html
html(lang=config.language data-theme=theme.display_mode class=htmlClassHideAside)
  head
    include ./head.pug
  body
    // ✅ 加载动画放在最顶层（全局常驻，不被 PJAX 清空）
    include ./loading/fullpage-loading.pug

    if theme.background
      #web_bg(style=getBgPath(theme.background))

    !=partial('includes/sidebar', {}, {cache: true})

    #body-wrap(class=pageType)
      include ./header/index.pug

      main#content-inner.layout(class=hideAside)
        if body
          div!= body
        else
          block content
          if theme.aside.enable && page.aside !== false
            include widget/index.pug

      - const footerBg = theme.footer_img
      - const footer_bg = footerBg ? footerBg === true ? bg_img : getBgPath(footerBg) : ''
      footer#footer(style=footer_bg)
        !=partial('includes/footer', {}, {cache: true})

    include ./rightside.pug
    include ./additional-js.pug

```

`\themes\butterfly\layout\includes\loading\index.pug`

```
//- index.pug
if theme.preloader && theme.preloader.enable
  if theme.preloader.source === 1
    include ./fullpage-loading.pug
  else if theme.preloader.source === 2
    include ./pace.pug
  else
    // 默认全屏动画 + Pace
    include ./fullpage-loading.pug
    include ./pace.pug

```

progressbar.css

```
.pace {
  -webkit-pointer-events: none;
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  z-index: 2000;
  position: fixed;
  margin: auto;
  top: 10px;
  left: 0;
  right: 0;
  height: 8px;
  border-radius: 8px;
  width: 4rem;
  background: #eaecf2;
  border: 1px #e3e8f7;
  overflow: hidden;
}

.pace-inactive .pace-progress {
  opacity: 0;
  transition: 0.3s ease-in;
}

.pace .pace-progress {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -o-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  max-width: 200px;
  position: absolute;
  z-index: 2000;
  display: block;
  top: 0;
  right: 100%;
  height: 100%;
  width: 100%;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  animation: gradient 1.5s ease infinite;
  background-size: 200%;
}

.pace.pace-inactive {
  opacity: 0;
  transition: 0.3s;
  top: -8px;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
```


Sytl 加载动画效果 `themes\butterfly\source\css\_layout\loading.styl`


```
#loading-box
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 1001
  overflow hidden

.loading-bg
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%
  background rgb(250, 251, 253)// ✅ 纯色背景，可改成任意颜色
  transition opacity 0.3s
  opacity 1
  z-index 1001

// 夜间模式支持（可选）
body.dark
  .loading-bg
    background #1a1a1a    // 夜间模式纯色背景，可根据需要修改

.loading-img
  width 100px
  height 100px
  border-radius 50%
  border 4px solid #f0f0f2
  animation loadingAction 0.6s infinite alternate
  background url(/img/avatar.png) no-repeat center center
  background-size cover

.loading-image-dot
  width 30px
  height 30px
  background #6bdf8f
  border-radius 50%
  border 6px solid #fff
  position absolute
  top 50%
  left 50%
  transform translate(18px, 24px)

#loading-box.loaded
  pointer-events none
  .loading-bg
    opacity 0
    z-index -1000

@keyframes loadingAction
  0%
    opacity 1
  100%
    opacity 0.4
```


参考文章：[一款基于Butterfly主题的loading动画](https://legacy.happylee.cn/2023/05/03/%E4%B8%80%E6%AC%BE%E5%9F%BA%E4%BA%8Ebutterfly%E4%B8%BB%E9%A2%98%E7%9A%84loading%E5%8A%A8%E7%94%BB/)




### 加载动画第二版


更换了评论系统，由于加载动画确实不太好调整，所以单独写一篇关于加载动画的文章。更换博客主题太累了，所以很长时间我不会换主题，也懒得升级，光着一个帕金森一样的组件抖动的问题，我都想方设法解决、减缓、掩盖，调了一整天都未达预期...既然这么有精力折腾，那就重头再来，我想还是算了吧，已不复当年...

主题还有一个问题，不能加载一页整篇的文章，就像撕裂的一页纸，得拿胶水黏住你才能拼凑完整的一页，可能有些人看上去以为是特意的效果，但其实是我也不知道是魔改了那一部分弄出的bug。

v2：最小、最大时间；增加排除、包含项目；优化加载动画显示逻辑。

* exclude 模式：列表里的页面不显示动画，其余页面显示动画。
* include 模式：列表里的页面才显示动画，其余页面都跳过。
* HOME 标识词 表示 首页

```
preloader:
  enable: true
  source: 1
  mode: "exclude" # 可选 include 模式
  pages:
    - "HOME"      # 特殊标识词
    - "/about/"
    - "/tags/"
```

`\themes\butterfly\layout\includes\loading\fullpage-loading.pug` 

```
if theme.preloader && theme.preloader.enable
  #loading-box
    .loading-bg
      img.loading-img(
        class='nolazyload',
        src=loading_img ? url_for(loading_img) : "/img/avatar"
      )
      .loading-image-dot
  script.
    (function() {
      const mode = "!{theme.preloader.mode || 'exclude'}"; // 'exclude' 或 'include'
      const pages = !{JSON.stringify(theme.preloader.pages || [])};
      const path = window.location.pathname;

      // 判断当前页面是否需要显示加载动画
      let showLoading = true;
      if(mode === "exclude") {
        // 排除模式：列表里的页面不显示动画
        showLoading = !pages.some(p => p === "HOME" ? path === "/" : path.startsWith(p));
      } else if(mode === "include") {
        // 指定模式：只有列表里的页面显示动画
        showLoading = pages.some(p => p === "HOME" ? path === "/" : path.startsWith(p));
      }

      if(!showLoading){
        const box = document.getElementById("loading-box");
        if(box) box.classList.add("loaded");
        return;
      }

      const preloader = {
        show: () => {
          const box = document.getElementById("loading-box");
          if(box) box.classList.remove("loaded");
          document.body.style.overflow = '';
          preloader._startTime = Date.now(); // 记录开始时间
        },
        hide: () => {
          const box = document.getElementById("loading-box");
          const elapsed = Date.now() - (preloader._startTime || 0);
          const minDelay = 1000; // 最短显示 1 秒
          const maxDelay = 3000; // 最长显示 3 秒
          const remaining = Math.max(minDelay - elapsed, 0);
          setTimeout(() => {
            if(box) box.classList.add("loaded");
            document.body.style.overflow = 'auto';
            if(window.WOW) new WOW().init();
          }, Math.min(remaining + elapsed, maxDelay));
        }
      };

      // 页面一开始就显示动画（早开始）
      preloader.show();

      // 页面加载完成后隐藏动画
      window.addEventListener('load', () => preloader.hide());

      // PJAX 页面切换支持
      if(theme.pjax && theme.pjax.enable){
        document.addEventListener('pjax:send', () => {
          preloader.show();
        });
        document.addEventListener('pjax:complete', () => {
          preloader.hide();
        });
      }
    })();
```

### 加载动画第一版

`\themes\butterfly\layout\includes\loading\fullpage-loading.pug` 

```pug
#loading-box
  .loading-bg
    img.loading-img(
      src=theme.preloader.avatar ? url_for(theme.preloader.avatar) : "/img/avatar.png",
      class="nolazyload"
    )
    .loading-image-dot

script.
  (function() {
    const loadingBox = document.getElementById('loading-box');

    const showLoading = () => {
      if (loadingBox) loadingBox.classList.remove("loaded");
    };

    const hideLoading = () => {
      if (loadingBox) loadingBox.classList.add("loaded");
    };

    // 保证加载动画至少显示1秒
    window.onload = function() {
      showLoading();  // 显示加载动画

      // 延迟1秒后隐藏加载动画（确保至少1秒后才隐藏）
      setTimeout(hideLoading, 1000);
    };

    // PJAX 页面切换支持（可选）
    if (theme.pjax && theme.pjax.enable) {
      document.addEventListener('pjax:send', showLoading);
      document.addEventListener('pjax:complete', hideLoading);
    }
  })();
```

`\themes\butterfly\layout\includes\loading\index.pug`

```
//- index.pug
if theme.preloader && theme.preloader.enable
  if theme.preloader.source === 1
    include ./fullpage-loading.pug
  else if theme.preloader.source === 2
    include ./pace.pug
  else
    // 默认全屏动画 + Pace
    include ./fullpage-loading.pug
    include ./pace.pug
```


头像旋转 `\themes\butterfly\source\css\_layout\loading.styl`

```styl
#loading-box
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  z-index 1001
  overflow hidden

.loading-bg
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%
  background #4e9eff
  opacity 1
  transition opacity 0.3s ease-in-out  // 使用更平滑的动画过渡

.loading-img
  width 100px
  height 100px
  border-radius 50%
  border 4px solid #f0f0f2
  animation loadingAction 1s infinite alternate  // 增加动画时间，使效果更平滑
  background url(/img/avatar.png) no-repeat center center
  background-size cover

@keyframes loadingAction
  0%
    transform rotate(0deg)  // 开始旋转
  100%
    transform rotate(360deg)  // 旋转一圈

#loading-box.loaded
  pointer-events none
  .loading-bg
    opacity 0
    z-index -1000
```

`_config.butterfly.yml`

```yml
preloader:
  enable: true
  source: 1
  # pace theme (see https://codebyzach.github.io/pace/)
  pace_css_url:
```


`\themes\butterfly\layout\includes\loading\index.pug`

```pug
// 根据 source 决定加载内容
if theme.preloader && theme.preloader.enable
  if theme.preloader.source === 1
    include ./fullpage-loading.pug
  else if theme.preloader.source === 2
    include ./pace.pug
  else
    include ./fullpage-loading.pug
    include ./pace.pug
```



参考文章：[一款基于Butterfly主题的loading动画](https://legacy.happylee.cn/2023/05/03/%E4%B8%80%E6%AC%BE%E5%9F%BA%E4%BA%8Ebutterfly%E4%B8%BB%E9%A2%98%E7%9A%84loading%E5%8A%A8%E7%94%BB/)