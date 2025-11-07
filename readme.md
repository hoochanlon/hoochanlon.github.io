# ***[Chanlon Hoo's Blog](https://hoochanlon.github.io/)***

>  [!IMPORTANT]
> * 博客由 Jekyll Next到 Hexo Butterfly，此次属于跨代升级了（2018 —— 2025）。历时近一个月重构部署完毕。
> * 后续相关调整或更新见：https://hoochanlon.github.io/posts/15347.html


### 博客展示

Butterfly 首页部分

![ ](https://tu.zbhz.org/i/2025/10/12/10v8rcq.jpg)

<!-- ![ ](https://tu.zbhz.org/i/2025/10/12/112gauh.jpg) -->

Splayer 音乐板块[^1]

[^1]: 因流量负载过大音乐播放器由Splayer更换为安知鱼音乐页面

![ ](http://image.aibochinese.com/i/2025/10/12/12ruhwr.jpg)

<!-- ![ ](http://image.aibochinese.com/i/2025/10/12/12rud51.jpg) -->


<details>
<summary>其他独立模块内容，包括：导航、番茄钟、日历、todo</summary>

自用导航

![ ](https://tu.zbhz.org/i/2025/10/12/12f4lrr.png)

日历、番茄钟、todo

![ ](https://tu.zbhz.org/i/2025/10/12/12dvoeu.jpg)

</details>


### 功能概述 

除主题自带的效果，额外实现如下：
* 看板娘
* 樱花飘落
* 字体采用霞鹜文楷、JetBrains Mono 
* 刷新或点击不同栏目更换背景图片
* 超链接可转成卡片
* 实现亚克力、毛玻璃、液态玻璃效果
* 重定向美化，重定向提醒呈现半透明玻璃卡片效果
* 以头像作为加载动画的特效，并支持自定义排除相关页面
* 分页支持按组显示：[hexo-theme-butterfly/issues/1757](https://github.com/jerryc127/hexo-theme-butterfly/issues/1757)


<details>
<summary>除主题现有功能，新增内容如下：</summary>

* AI摘要
* 天气
* 导航
* todo  
* 日历
* 时钟 
* 私有微博
* 重要日期倒计时
* 番茄钟
* 站点后台数据分析
* 博客文章信息统计
* <s>文章过期提示(主题现有)</s>  
* 文章加密
</details>

以及优化部分：

* 首页图固定，其余页刷新即换
* 考虑到阅读因素，移除樱花飘落效果
* 考虑看板娘的情绪价值过低（没AI），已优化
* 针对归档采用额外规则分页
* 针对重定向，重写重定向页面
* 微信由跳转二维码链接，改进为下方展示二维码



### 参考部分

参考内容较多，分类整理过程中难免有所遗漏。本文旨在汇总常用的 Hexo 插件、主题配置、UI 优化方案及第三方服务，便于快速查找与集成。

<details>

<summary>参考文章及项目</summary>

#### 内容相关链接

* [HCLonely Blog - Hexo 博客美化](https://blog.hclonely.com/posts/57bd67ce/)
* [使用Charts插件给Butterfly增加统计图表 | Guo Le's Blog](https://blog.guole.fun/posts/18158/)
* [Hexo 博客文章统计图](https://blog.eurkon.com/post/1213ef82.html)
* [Next 7.0+ 实现文章加密 | Alex_McAvoy](https://alex-mcavoy.github.io/hexo/483939e0.html)
* [Hexo博客进阶：为 Next 主题添加 Waline 评论系统 | 小谢的小站](https://qianfanguojin.top/2022/01/eb4966ce759b.html)
* [使用abbrlink生成永久链接 | RikoNekoの猫窝](https://www.rikoneko.xyz/posts/b40f8ae4/index.html)
* [Hexo的Butterfly主题 添加AI摘要 | ZiMu](https://www.myzimu.com/post/978df16.html)
* [安装 | TianliGPT](https://docs_s.tianli0.top/install.html)
* [gulp 压缩 hexo 博客的静态资源（css、js、html） | 马斯克的赛博空间](https://macin.top/posts/4be968a2/index.html)
* [Tag Plugins Plus | Akilarの糖果屋](https://akilar.top/posts/615e2dec/)
* [Butterfly外挂标签用法学习](https://www.yooupi.site/posts/235523-d25a2ac1.html)
* [butterfly常用标签外挂](https://blog.pushihao.com/article/a2b56279.html)
* [暴涨75k星！本地部署超强备忘录Memos，不只是记笔记！ - 知乎](https://zhuanlan.zhihu.com/p/1926331659915104675)
* [butterfly 代码块中的所有功能](https://butterfly.js.org/posts/4aa8abbe/?highlight=height_limit)



#### UI/渲染优化

* [hexo-theme-butterfly 修改分割线的样式 - 洛语 の Blog](https://luoyuy.top/posts/5c76ad4123cd/)
* [Hexo-Butterfly主题解决B站视频自适应的方法-我不是咕咕鸽](https://blog.laoda.de/archives/bilibili-video-adaptation-hexo-butterfly)
* [Butterfly 文檔(三) 主題配置 | Butterfly](https://butterfly.js.org/posts/4aa8abbe/)
* [【Hexo】使用hexo-markdown-it实现渲染markdown脚注能力 | 慕雪的寒舍](https://blog.musnow.top/posts/8330674478/index.html)
* [【Hexo】更高级的Markdown渲染器 | Everett Rain](https://blog.everettrain.cn/2024/12/11/更高级的Markdown渲染器/)
* [Butterfly 主题更改字体 | 开罗猫老大](https://www.smathsp.com/post/202504272045.html)
* [hexo+butterfly 导航栏居中 | LUCKYLYH](https://www.luckylyh.top/post/8efe842b.html)
* [Butterfly 主题一图流背景及文章顶部图修改 | Gzzz's Blog](https://blog.gzzz.pro/posts/22283ba3/index.html)
* [butterfly主题美化之背景毛玻璃效果 | Welcome To My-Blog](https://eisem.github.io/2025/03/08/butter/)
* [Hexo动态效果 | LuosBlog](https://seashore.top/Blog_ButterFly/2024/03/22/Hexo动态效果/)
* [Butterfly 引入卡片链接 | 欢迎来到爱谦 717 的博客](https://bczblog.online/2025/08/28/Butterfly/Butterfly 引入卡片链接/index.html)
* [Add Blog Animation – Wowjs](https://akilar.top/posts/abab51cf)
* [Butterffly 分类页和标签页隐藏侧栏](https://blog.eurkon.com/post/d498d8b1.html)
* [Butterfly导航栏美化 | June's Blog](https://blog.june-pj.cn/posts/7bed0b4e/)
* [解决Butterfly页脚养鱼在切换页面时不生效的问题](https://ihave.news/post/20240818194045.html)
* [懒加载动画效果](https://butterfly.js.org/posts/198a4240/?highlight=loading)
* [一款基于Butterfly主题的loading动画](https://legacy.happylee.cn/2023/05/03/%E4%B8%80%E6%AC%BE%E5%9F%BA%E4%BA%8Ebutterfly%E4%B8%BB%E9%A2%98%E7%9A%84loading%E5%8A%A8%E7%94%BB/)


####  插件与功能扩展

* [自定義側邊欄 | Butterfly](https://butterfly.js.org/posts/ea33ab97/#例子)
* [Butterfly:为博客添加微软Clarity数据统计 | YvYang's Blog](https://blog.yvyang.fun/posts/48347/index.HTML)
* [aristorechina/Tomodoro_Chinese: 一款带有画中画模式、白噪声生成、任务等功能的番茄钟 Web 应用！](https://github.com/aristorechina/Tomodoro_Chinese)
* [fletchto99/hexo-sliding-spoiler: A sliding spoiler for hexo](https://github.com/fletchto99/hexo-sliding-spoiler)
* [ricocc/uiineed-todo-list: Todo List Online - Minimalist, No-Login Required Web Todo App](https://github.com/ricocc/uiineed-todo-list)
* [xyxc0673/calendar-remark: A simple calendar with nice design for remarking a date](https://github.com/xyxc0673/calendar-remark)
* [stevenjoezhang/live2d-widget: 把萌萌哒的看板娘抱回家 (ノ≧∇≦)ノ | Live2D widget for web platform](https://github.com/stevenjoezhang/live2d-widget)
* [hexo 搭建一个音乐馆 | Peter-JiY's Blog](https://peter-jiy.github.io/post/20241118152148.html)
* [hexo配置安知鱼音乐页面](https://wenjiew-astro.github.io/2025/09/01/hexo%E9%85%8D%E7%BD%AE%E5%AE%89%E7%9F%A5%E9%B1%BC%E9%9F%B3%E4%B9%90%E9%A1%B5%E9%9D%A2/index.html)
* [NeteaseCloudMusicApiEnhanced/api-enhanced: 🔍 A revival project for NeteaseCloudMusicApi Node.js Services || 网易云音乐 API 备份 + 增强 || 本项目自原版v4.28.0版本后开始自行维护](https://github.com/neteasecloudmusicapienhanced/api-enhanced)
* [imsyy/SPlayer: 🎉 一个简约的音乐播放器，支持逐字歌词，下载歌曲，展示评论区，音乐云盘及歌单管理，音乐频谱，移动端基础适配 | 网易云音乐 | A minimalist music player](https://github.com/imsyy/SPlayer)
* [SPlayer部署指南 - 部署一个免费强大的第三方网易云音乐播放器 | My Space (๑•̀ㅂ•́)و✧](https://www.focalors.ltd/article/splayer-deployment)
* [butterfly 的魔改记录 | qxdn的乐园](https://qianxu.run/butterfly-custom/index.html#信封留言板)（#信封留言板）
* [信笺样式留言板 | Akilarの糖果屋](https://akilar.top/posts/e2d3c450/)
* [tianyaxiang/NavSphere: NavSphere： 一个基于 Github 存储的网址导航程序 支持一键部署至 Vercel，数据存储在 Github，零成本搭建一个网站导航！](https://github.com/tianyaxiang/NavSphere)
* [写了一份手把手教你部署导航站管理系统的指南，请查收](https://mp.weixin.qq.com/s/90LUmKilfLZfc5L63Ej3Sg)
* [时间插件（ClockZone）](https://clockzone.net/)
* [时间插件（Time.is）](https://time.is/zh/widgets)
* [天气插件](https://weatherwidget.org/zh/)
* [【butterfly】分类磁贴插件版 | 雷雷的个人博客](https://ll.sc.cn/posts/ab72/)
* [butterfly主题魔改10：分类页面魔改 | kukualのblog](https://kukual.github.io/posts/a7bebfb0/index.html)
* [hoochanlon/hexo-butterfly-category-card-fork: hexo-butterfly-category-card-fork](https://github.com/hoochanlon/hexo-butterfly-category-card-fork)
* [Butterfly日历卡片](https://blog.june-pj.cn/posts/c8344523)
* [Hexo添加访客信息和地图](https://1477017264.github.io/posts/22511/)
* https://artitalk.js.org
*  [使用 Twikoo 架設匿名留言板](https://mrpeelblog.com/posts/twikoo/)

####  部署与自动化

* [Hexo + GitHub Actions 实现自动化部署完整指南 | GoofySatoshi's Blog](https://icarus-blog.top/2025/08/29/Hexo-GitHub-Actions-实现自动化部署完整指南/index.html)

#### font awesome图标对应字符编码表

- [font awesome图标对应字符编码表](https://www.cnblogs.com/ytkah/p/12605237.html)
- [Font Awesome 5.15.2 版本全部图标Unicode对照表大全](https://fa.uutool.cn/unicode/5.15.2/)

#### 壁纸

* [pexels](https://www.pexels.com/zh-cn)（照片式）
* [wallspic](https://wallspic.com/)（以终端适配为主）
* [wallhaven.cc](https://wallhaven.cc/) （各类图片搜索）
* [动漫图片超分辨率 Real-CUGAN](https://real-cugan.animesales.xyz/)
* [随机二次元图片API接口 - 免费高清动漫壁纸服务 | UAPI](https://uapis.cn/docs/api-reference/get-random-image)
* [butterfly随机背景最简单的写法 | 小冰博客](https://zfe.space/post/55346.html)

#### 图床

* https://img.remit.ee
* [2025 年，我们还有哪些免费图床可用？（长期更新）](https://sspai.com/post/98911)

#### 加载动画

* https://loading.io
* https://css-loaders.com
* https://tenor.com
* https://products.conholdate.app

#### AI

- [chatgpt](https://chatgpt.com/)
- [copilot](https://copilot.microsoft.com/)
- [deepseek](https://www.deepseek.com/)

</details>

---

<p align="center">
<em><span style="font-size: 1.2em;">Thanks</span></em>
</p>