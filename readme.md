# ***[Chanlon Hoo's Blog](https://hoochanlon.github.io/)***

>  [!IMPORTANT]
> 博客由 Jekyll Next到 Hexo Butterfly，此次属于跨代升级了（2018 —— 2025）。历时6天重构部署完毕。

### 博客展示

Butterfly 首页部分

![ ](https://tu.zbhz.org/i/2025/10/12/10v8rcq.jpg)

<!-- ![ ](https://tu.zbhz.org/i/2025/10/12/112gauh.jpg) -->

Splayer 音乐板块

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
* 主题亚克力毛玻璃
* 重定向美化，重定向提醒呈现半透明玻璃卡片效果


<details>
<summary>除主题现有功能，新增内容如下：</summary>

* AI摘要
* 天气
* 导航
* todo  
* 日历
* 时钟 
* 重要日期倒计时
* 番茄钟
* 站点后台数据分析
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

####  📝 内容相关链接

- [文章摘要](https://www.myzimu.com/post/978df16.html)
- [AI摘要KEY](https://docs_s.tianli0.top/install.html)
- [文章节选](https://butterfly.js.org/posts/4aa8abbe/?highlight=description)
- [文章过期提醒设置](https://butterfly.js.org/posts/4aa8abbe/?highlight=%E6%8F%90%E9%86%92)
- [文章时效性](https://qianfanguojin.top/2022/09/69288abaaf16.html)
- [固定链接](https://www.rikoneko.xyz/posts/b40f8ae4/index.html)
- [文章加密](https://alex-mcavoy.github.io/hexo/483939e0.html)
- [评论系统](https://qianfanguojin.top/2022/01/eb4966ce759b.html)

#### 🎨 UI/渲染优化

- [分割线处理](https://luoyuy.top/posts/5c76ad4123cd/)
- [部分UI优化](https://iitii.github.io/2021/05/28/1/)
- [插入太小问题](https://blog.laoda.de/archives/bilibili-video-adaptation-hexo-butterfly)
- [插入图片](http://home.ustc.edu.cn/~sdyzzy/posts/36e27ee1.html)
- [代码块参考](https://homulilly.com/post/hexo-use-note-and-tabs-block.html)
- [更高级的渲染器](https://blog.everettrain.cn/2024/12/11/更高级的Markdown渲染器/)
- [渲染器脚注语法补充](https://blog.musnow.top/posts/8330674478/index.html)

#### 🧩 Butterfly 主题相关

- [butterfly文档三主题配置](https://butterfly.js.org/posts/4aa8abbe/)
- [tag页面图片生效位置](https://github.com/jerryc127/hexo-theme-butterfly/issues/1023)
- [给butterfly添加侧边栏电子钟](https://blog.anheyu.com/posts/fc18.html)
- [自定义插件示例](https://butterfly.js.org/posts/ea33ab97/#%E4%BE%8B%E5%AD%90)
- [添加微软Clarity数据统计](https://blog.yvyang.fun/posts/48347/index.HTML)
- [主题讨论区](https://github.com/jerryc127/hexo-theme-butterfly/discussions/878)

#### ⚙️ 插件与功能扩展

- [折叠内容插件](https://github.com/fletchto99/hexo-sliding-spoiler)
- [todo 插件](https://github.com/ricocc/uiineed-todo-list)
- [todo 插件（重复）](https://github.com/ricocc/uiineed-todo-list)
- [日历备注插件](https://github.com/xyxc0673/calendar-remark)
- [Live2D 看板娘插件](https://github.com/stevenjoezhang/live2d-widget)
- [SPlayer 播放器](https://github.com/imsyy/SPlayer)
- [网易云音乐 API 增强](https://github.com/neteasecloudmusicapienhanced/api-enhanced)
- [更多功能参考](https://zenreal.github.io/posts/44730)

#### 🌐 第三方服务插件

- [天气插件](https://weatherwidget.org/zh/)
- [时间插件（Time.is）](https://time.is/zh/widgets)
- [时间插件（ClockZone）](https://clockzone.net/)

#### 🚀 部署与自动化

- [自动化部署指南](https://goofysatoshi.github.io/2025/08/29/Hexo-GitHub-Actions-实现自动化部署完整指南/index.html)

#### 🧠 AI

- [chatgpt](https://chatgpt.com/)
- [copilot](https://copilot.microsoft.com/)

</details>

---

<p align="center">
<em><span style="font-size: 1.2em;">Thanks</span></em>
</p>
