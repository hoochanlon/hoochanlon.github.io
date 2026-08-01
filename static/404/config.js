// 404页面配置文件
const Config404 = {
  // 默认语言设置
  defaultLanguage: "ja", // zh: 中文, ja: 日文, en: 英文

  // 多语言文案
  i18n: {
    zh: {
      pageTitle: "404 - 页面未找到",
      title: "404",
      subtitle: "哎呀！你来到了未知星球。",
      desktopDescription: "你要找的页面不存在。不妨用侧边栏导航，也许能发现更有趣的星球。",
      mobileDescription: "你要找的页面不存在。不如试试 Google 搜索吧。",
      searchButtonText: "去 Google 搜一下",
      searchButtonUrl: "https://www.google.com/",
      sidebarItems: [
        { name: "待办事项", url: "http://hoochanlon.github.io/todo" },
        { name: "番茄钟与秒表", url: "http://hoochanlon.github.io/shigure" },
        { name: "图片压缩", url: "https://squoosh-neon.vercel.app" },
        { name: "文件重命名", url: "http://hoochanlon.github.io/rename" },
        { name: "网络计算器", url: "https://hoochanlon.github.io/network-calculator" },
        { name: "中国日历", url: "http://hoochanlon.github.io/calendar" }
      ]
    },
    en: {
      pageTitle: "404 - Page Not Found",
      title: "404",
      subtitle: "Oops! You've arrived at an unknown planet.",
      desktopDescription: "The page doesn't exist. Try the sidebar tools or search.",
      mobileDescription: "The page doesn't exist. Try Google search.",
      searchButtonText: "Search on Google",
      searchButtonUrl: "https://www.google.com/",
      sidebarItems: [
        { name: "Todo List", url: "http://hoochanlon.github.io/todo" },
        { name: "Pomodoro Timer", url: "http://hoochanlon.github.io/shigure" },
        { name: "Image Compress", url: "https://squoosh-neon.vercel.app" },
        { name: "File Rename", url: "http://hoochanlon.github.io/rename" },
        { name: "Network Calculator", url: "https://hoochanlon.github.io/network-calculator" },
        { name: "Chinese Calendar", url: "http://hoochanlon.github.io/calendar" }
      ]
    },
    ja: {
      pageTitle: "404 - ページが見つかりません",
      title: "404",
      subtitle: "<ruby>未知<rt>みち</rt></ruby>の<ruby>惑星<rt>わくせい</rt></ruby>に<ruby>到着<rt>とうちゃく</rt></ruby>！",
      desktopDescription: "お<ruby>探<rt>さが</rt></ruby>しのページは<ruby>存在<rt>そんざい</rt></ruby>しません。サイドバーのツールまたは Google <ruby>検索<rt>けんさく</rt></ruby>をお<ruby>試<rt>ため</rt></ruby>しください。",
      mobileDescription: "お<ruby>探<rt>さが</rt></ruby>しのページは<ruby>存在<rt>そんざい</rt></ruby>しません。Google <ruby>検索<rt>けんさく</rt></ruby>をお<ruby>試<rt>ため</rt></ruby>しください。",
      searchButtonText: "Google で検索",
      searchButtonUrl: "https://www.google.com/",
      sidebarItems: [
        { name: "<ruby>予定表<rt>よていひょう</rt></ruby>", url: "http://hoochanlon.github.io/todo" },
        { name: "<ruby>時間管理<rt>じかんかんり</rt></ruby>", url: "http://hoochanlon.github.io/shigure" },
        { name: "<ruby>画像圧縮<rt>がぞうあっしゅく</rt></ruby>", url: "https://squoosh-neon.vercel.app" },
        { name: "<ruby>名前変更<rt>なまえへんこう</rt></ruby>", url: "http://hoochanlon.github.io/rename" },
        { name: "<ruby>通信計算機<rt>つうしんけいさんき</rt></ruby>", url: "https://hoochanlon.github.io/network-calculator" },
        { name: "<ruby>中国暦<rt>ちゅうごくれき</rt></ruby>", url: "http://hoochanlon.github.io/calendar" }
      ]
    }
  },

  // 社交链接配置
  social: [
    {
      name: "博客",
      iconId: "icon-blog",
      iconClass: "social-icon--blog",
      url: "/",
      title: "博客"
    },
    {
      name: "Twitter",
      iconId: "icon-twitter",
      iconClass: "social-icon--twitter",
      url: "https://blog.hoochanlon.moe/twitter/",
      title: "Twitter"
    },
    {
      name: "GitHub",
      iconId: "icon-github",
      iconClass: "social-icon--github",
      url: "https://github.com/hoochanlon",
      title: "GitHub"
    },
    {
      name: "Email",
      iconId: "icon-email",
      iconClass: "social-icon--email",
      url: "mailto:hoochanlon@outlook.com",
      title: "邮件"
    }
  ],

  // 侧边栏配置
  sidebar: {
    defaultOpen: false
  }
};
